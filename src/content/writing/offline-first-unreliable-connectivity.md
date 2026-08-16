---
title: "Building offline-first apps for unreliable connectivity"
summary: "Designing for intermittent connectivity is not a fallback mode — it is a different mental model for how state flows through your application."
published: "2026-04-07"
tags: ["PWA", "Architecture", "JavaScript", "System Design"]
---

Unreliable connectivity is not an edge case in most of the world. It is the default. A user in Lagos or Accra or Nairobi may have full 4G signal for ten minutes and then drop to GPRS for the next thirty, or lose connectivity entirely, without moving from their desk. Designing for this means treating offline as a first-class state rather than an error condition.

I built a data-entry application where field agents submitted structured records throughout the day — often in locations with no signal. The requirement was simple: the application must work whether or not the device is connected, and submitted records must reach the server without data loss when connectivity returns. What follows is the architecture I settled on and the decisions I would make the same way today.

## The mental model shift

An online-first application treats the server as the source of truth and the client as a display layer. State lives on the server. The client fetches it, displays it, and posts mutations back. When the network is unavailable, the application is unavailable.

An offline-first application inverts this. The client is the source of truth for local state. The server is a synchronization target. The application is always available — the network is just the mechanism by which local state and remote state are reconciled.

This shift has consequences throughout the stack:

- **Local storage is not optional.** Every piece of state the application needs to function must be readable without a network request.
- **Mutations are queued, not sent.** A write operation stores the change locally and returns success immediately. The network transmission is asynchronous.
- **Conflict resolution is a first-class concern.** When two clients mutate the same record while offline and both sync to the server, the server needs a principled way to handle the conflict.

## The layer structure

```
┌─────────────────────────────────┐
│         Application UI          │
├─────────────────────────────────┤
│        State Manager            │  Reads from IndexedDB. Writes to
│    (local source of truth)      │  IndexedDB + sync queue.
├─────────────────────────────────┤
│         Sync Engine             │  Processes the queue when online.
│   (queue + conflict resolution) │  Handles retries and backoff.
├──────────────┬──────────────────┤
│  IndexedDB   │  Service Worker  │  IndexedDB: structured local data.
│  (data)      │  (asset cache)   │  SW: static assets + API responses.
└──────────────┴──────────────────┘
          ↕ (when connected)
┌─────────────────────────────────┐
│            API Server           │
└─────────────────────────────────┘
```

Service Worker and IndexedDB serve different purposes. The Service Worker caches the application shell and interceptable API responses. IndexedDB stores the application's structured data — the records the user works with. They are complementary, not alternatives.

## Service Worker: what to cache and what to skip

The caching strategy is not one-size-fits-all. Different resource types have different update characteristics.

```js
// service-worker.js

const SHELL_CACHE = "shell-v1";
const DATA_CACHE = "data-v1";

// Application shell — everything needed to render the UI
// Updated only on new service worker activation
const SHELL_ASSETS = [
  "/",
  "/index.html",
  "/app.js",
  "/app.css",
  "/icons/icon-192.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS)),
  );
  // Skip waiting — activate immediately rather than waiting for existing
  // clients to close. Acceptable here because shell assets are versioned.
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Application shell — cache first, fall back to network
  if (SHELL_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => cached ?? fetch(request)),
    );
    return;
  }

  // GET API requests — network first, fall back to cache
  // Stale cached responses are better than no response
  if (request.method === "GET" && url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful GET responses for offline fallback
          if (response.ok) {
            const clone = response.clone();
            caches.open(DATA_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request)),
    );
    return;
  }

  // POST/PUT/DELETE — do not intercept here.
  // Mutations go through the sync queue, not the service worker.
});
```

Mutations are not intercepted at the Service Worker level. Intercepting POST requests in the Service Worker and using Background Sync produces a system where the sync logic is split between the SW and the application layer. I keep all mutation logic in the sync engine instead.

## IndexedDB: the local data store

I use a thin wrapper around IndexedDB rather than a library. The dependency is not worth it for a structured data model this predictable.

```js
// db.js — IndexedDB wrapper

const DB_NAME = "fieldapp";
const DB_VERSION = 1;

export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Records store — the application's primary data
      if (!db.objectStoreNames.contains("records")) {
        const store = db.createObjectStore("records", { keyPath: "id" });
        store.createIndex("status", "status");
        store.createIndex("syncedAt", "syncedAt");
      }

      // Sync queue — outbound mutations waiting for connectivity
      if (!db.objectStoreNames.contains("syncQueue")) {
        const queue = db.createObjectStore("syncQueue", {
          keyPath: "id",
          autoIncrement: true,
        });
        queue.createIndex("createdAt", "createdAt");
        queue.createIndex("status", "status");
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
```

## The sync queue

Every mutation writes to IndexedDB and enqueues a sync operation. The mutation returns success to the UI immediately — the user does not wait for network transmission.

```js
// sync-queue.js

export async function enqueue(db, operation) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("syncQueue", "readwrite");
    const store = tx.objectStore("syncQueue");

    const entry = {
      ...operation, // { type, endpoint, method, payload }
      createdAt: new Date().toISOString(),
      status: "pending",
      attempts: 0,
      lastError: null,
    };

    const request = store.add(entry);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Called when the application detects connectivity
export async function processQueue(db) {
  const pending = await getPendingEntries(db);

  for (const entry of pending) {
    try {
      await markInFlight(db, entry.id);

      const response = await fetch(entry.endpoint, {
        method: entry.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry.payload),
      });

      if (response.ok) {
        await markComplete(db, entry.id);
      } else if (response.status === 409) {
        // Conflict — resolve before retrying
        const resolved = await resolveConflict(db, entry, response);
        if (resolved) {
          await markComplete(db, entry.id);
        }
      } else if (response.status >= 400 && response.status < 500) {
        // Client error — not retryable, mark as failed
        await markFailed(db, entry.id, `HTTP ${response.status}`);
      } else {
        // Server error or network issue — exponential backoff retry
        await markRetryable(db, entry.id);
      }
    } catch (error) {
      // Network failure — requeue for retry
      await markRetryable(db, entry.id);
    }
  }
}
```

The queue processes entries in insertion order. This is important: if record A depends on record B (a record with a reference to a parent record), B must reach the server before A. FIFO order preserves causal dependencies without requiring the queue to understand the data model.

## Conflict resolution

Two agents submit edits to the same record while both are offline. Both queues process when connectivity returns. The server receives two conflicting updates.

There is no universally correct resolution strategy. The right one depends on the domain. For this application — field data entry — the rule was: last write wins, where "last" means the highest `updatedAt` timestamp on the local record.

```js
async function resolveConflict(db, queueEntry, serverResponse) {
  const serverRecord = await serverResponse.json();
  const localRecord = await getRecord(db, queueEntry.payload.id);

  // If the server's record is newer, it wins — discard the local mutation
  if (new Date(serverRecord.updatedAt) > new Date(localRecord.updatedAt)) {
    // Update local store to reflect server state
    await putRecord(db, serverRecord);
    return false; // Signal: do not mark this queue entry as complete
  }

  // Local record is newer — retry with a force flag
  await fetch(queueEntry.endpoint, {
    method: queueEntry.method,
    headers: {
      "Content-Type": "application/json",
      "X-Force-Update": "true", // Server accepts this from authenticated clients
    },
    body: JSON.stringify({
      ...queueEntry.payload,
      // Include server version for the server's conflict log
      conflictsWith: serverRecord.updatedAt,
    }),
  });

  return true;
}
```

For data where last-write-wins is not acceptable — collaborative documents, inventory quantities, financial amounts — the resolution strategy is different. Those domains warrant operational transformation or CRDTs. For structured field records with discrete fields and a single authoritative agent per record, timestamp-based resolution is correct and simple.

## Connectivity detection

`navigator.onLine` is not reliable. It reflects whether the device has a network interface, not whether the network is actually reachable. A device connected to a router with no internet access reports `navigator.onLine === true`.

```js
// connectivity.js

async function checkConnectivity() {
  try {
    // Fetch a known endpoint — the server's health check.
    // Timeout after 5 seconds to handle high-latency connections.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch("/api/health", {
      method: "HEAD",
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
}

// Poll on a schedule and also on the browser's online event
// (which may be unreliable, but is a useful trigger for an immediate check)
window.addEventListener("online", async () => {
  const connected = await checkConnectivity();
  if (connected) {
    const db = await openDB();
    await processQueue(db);
  }
});

setInterval(async () => {
  const connected = await checkConnectivity();
  if (connected) {
    const db = await openDB();
    await processQueue(db);
  }
}, 30_000); // Check every 30 seconds
```

The poll interval is a tradeoff between responsiveness and battery/data usage. 30 seconds is conservative for field use where data costs are real. A progressive interval — check more frequently immediately after detecting offline, then slow down — is a refinement worth adding if the application is sensitive to sync latency.

## What this architecture does not solve

Offline-first does not eliminate network dependency for initial data load. A user who has never opened the application on their device cannot use it offline — there is nothing in IndexedDB yet. The onboarding flow must include a connectivity step that seeds the local store. This is a product decision, not an engineering one, but the engineering must support it explicitly.

Real-time features — notifications, live collaboration, presence — do not work offline. Anything that requires push from the server requires a persistent connection. Offline-first and real-time are not incompatible, but they apply to different parts of the application. Design the boundary explicitly.

The architecture I have described works for applications where the primary value is data capture and where users are the sole editors of their own records. If your use case involves shared mutable state, evaluate whether CRDTs or operational transformation are worth the added complexity before committing to timestamp-based conflict resolution.

Build for the network your users actually have, not the network you have in your office.
