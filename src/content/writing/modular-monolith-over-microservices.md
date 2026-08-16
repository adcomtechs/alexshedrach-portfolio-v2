---
title: "Why I chose a modular monolith over microservices"
summary: "Microservices are the default assumption for serious backend work. I rejected them on a project that seemed to justify them, and the reasoning is more transferable than the conclusion."
published: "2026-03-12"
tags: ["Architecture", "Node.js", "System Design"]
---

Every serious backend project gets the same early question: microservices or monolith? The framing is usually wrong. The real question is: what are your actual constraints, and which architecture fits them?

I made this call on a document-heavy SaaS product where the instinct — and the client expectation — was microservices. We had a clear domain split, a team that knew distributed systems, and a roadmap that projected serious traffic growth. Microservices felt inevitable.

I built a modular monolith instead. Eighteen months later, that decision has not caused a single architectural problem. Here is the reasoning.

## The instinct toward microservices

Microservices solve real problems. When you have genuinely independent teams that need to deploy without coordinating, or when specific subsystems have dramatically different scaling profiles, or when you need to mix runtimes because one problem demands a different language — microservices are the right answer.

The argument for microservices on this project was:

- Three distinct domains: document ingestion, user management, and billing
- A roadmap projecting 10× user growth over 18 months
- A team with distributed systems experience

None of these are bad arguments. They are just not sufficient ones.

## What microservices actually cost at this scale

Microservices distribute your operational complexity across the network. Every call that was a function invocation becomes an HTTP request — or a message queue entry if you're being careful — with all the failure modes that implies.

At the scale this project was targeting at launch — a few thousand users, maybe 50 concurrent — the cost of that distribution would have been entirely overhead:

**Service discovery.** Even with a service mesh, you are now thinking about which service instance handles which request. At our scale, a single load balancer in front of a monolith handles this with zero configuration overhead.

**Distributed tracing.** A request that triggers document ingestion touches user validation, quota checking, storage, and an async processing pipeline. In a monolith, a stack trace gives you the full picture. In a microservices setup, you are correlating trace IDs across four service logs to debug one failed upload.

**Cross-service transactions.** Billing and document ingestion needed to stay consistent. A user hits their quota limit at the same moment they submit a document — what is the correct outcome? In a monolith, this is a database transaction. Across services, it is a distributed transaction, which means either eventual consistency (acceptable in some cases, not this one) or a saga pattern, which is a significant implementation cost.

**Deployment coordination.** Deploying a schema change that affects two services requires coordinating the rollout order, handling the window where one service is on the old schema and the other is on the new one, and writing migration logic that handles both. In a monolith, a migration runs once, atomically.

The scaling argument was the strongest one, and it was still wrong. Premature optimization at the architectural level is more expensive than premature optimization at the code level. You can profile a slow function in an afternoon. You cannot refactor a service boundary in one.

## What a modular monolith actually looks like

A modular monolith is not an unstructured monolith. The boundaries are real — they just live at the module level rather than the network level.

The structure I settled on:

```
src/
├── modules/
│   ├── documents/          # Document ingestion, processing, storage
│   │   ├── index.js        # Public API — only export from this module
│   │   ├── service.js      # Business logic
│   │   ├── repository.js   # Data access
│   │   └── events.js       # Internal events this module emits
│   │
│   ├── users/              # Authentication, profiles, quotas
│   │   ├── index.js
│   │   ├── service.js
│   │   └── repository.js
│   │
│   └── billing/            # Subscriptions, usage tracking, invoicing
│       ├── index.js
│       ├── service.js
│       └── repository.js
│
├── shared/                 # Cross-module utilities — no business logic
│   ├── db.js               # Database connection
│   ├── events.js           # Event bus (Node EventEmitter in dev, Redis in prod)
│   └── errors.js           # Shared error types
│
└── app.js                  # Express setup — routes delegate to module APIs
```

The rule that makes this work: **modules communicate only through their `index.js` public API or through the event bus.** A module never imports from another module's internal files.

```js
// ✅ Correct — cross-module call through the public API
import { getUserQuota } from "@/modules/users";

// ❌ Wrong — importing from an internal file breaks the boundary
import { quotaRepository } from "@/modules/users/repository";
```

This rule is enforced by ESLint. The configuration:

```js
// eslint.config.js
import { defineConfig } from "eslint";

export default defineConfig({
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["*/modules/*/!(index)"],
            message:
              "Import from module index only. Module internals are private.",
          },
        ],
      },
    ],
  },
});
```

When a module needs to notify another without a direct dependency, it emits an event:

```js
// modules/documents/service.js
import { events } from "@/shared/events";

export async function ingestDocument(userId, file) {
  const doc = await processAndStore(userId, file);

  // Billing module listens for this — no direct import required
  events.emit("document.ingested", {
    userId,
    documentId: doc.id,
    pageCount: doc.pageCount,
  });

  return doc;
}
```

```js
// modules/billing/index.js
import { events } from "@/shared/events";
import { incrementUsage } from "./service.js";

events.on("document.ingested", ({ userId, pageCount }) => {
  incrementUsage(userId, pageCount);
});
```

The modules are decoupled. The billing module does not know how documents are ingested. The document module does not know that billing exists. Both can be tested independently.

## The migration path I preserved

The primary argument for microservices was future scale. A modular monolith does not abandon that future — it defers the cost until the benefit is real.

Each module is already structured as if it were a service:

- Its own business logic, isolated behind a public API
- Its own data access layer — repositories that could point to a dedicated database
- Communication via events — which maps cleanly to a message queue

Extracting a module into a service when the scale actually demands it is a refactor, not a rewrite. The boundary definition work is already done. The only structural change is moving the `events.emit` call to publish to a queue instead of an in-process event emitter, and changing the cross-module API calls to HTTP.

That migration, done precisely when the traffic data justifies it, costs far less than building the distributed system eighteen months early and paying the operational overhead on day one.

## What would make me choose microservices instead

Different constraints produce different answers. I would choose microservices from the start if:

| Constraint                              | Why it changes the answer                                                                            |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Genuinely independent teams             | Deployment coordination overhead is a people cost, not just an engineering cost                      |
| Mixed runtimes required                 | A Python ML pipeline cannot live in a Node.js monolith                                               |
| Dramatically different scaling profiles | If the ingestion service needs 20 instances and the auth service needs 2, separation pays for itself |
| Regulatory isolation                    | Some compliance requirements mandate physical separation of certain data                             |
| Existing distributed infrastructure     | If the org already runs a service mesh, the setup cost is already paid                               |

None of those were true on this project. The modular monolith was not a compromise — it was the correct answer to the actual problem.

## The decision framework

Before choosing an architecture, I answer four questions:

1. Do independent teams need to deploy without coordination?
2. Do any subsystems have incompatible scaling requirements?
3. Do any subsystems need a different runtime?
4. Is the operational complexity justified by the current scale?

If the answer to the first three is no and the fourth requires an honest assessment of where you actually are rather than where you hope to be in two years, the modular monolith earns the decision almost every time.

Build the simplest system that could work at your current scale. Structure it so the next scale is achievable. Ship.
