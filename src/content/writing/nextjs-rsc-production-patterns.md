---
title: "React Server Components in production: what actually changed"
summary: "RSC is not a performance optimization with caveats. It is a different mental model for where computation happens and the boundary between server and client is more consequential than most guides suggest."
published: "2026-05-05"
tags: ["Next.js", "Architecture", "Performance"]
---

I have been shipping React Server Components in production since the App Router stabilised. The mental model shift took longer than I expected — not because RSC is complicated, but because the instinct from years of React development keeps pulling in the wrong direction.

The core question RSC changes is not "how do I fetch data?" It is "where should this computation happen, and what does the answer imply about the boundary?"

## The boundary is about capability, not performance

The most common framing of RSC is as a performance optimisation: server components run on the server, so JavaScript doesn't ship to the client. This is true but it is the wrong frame for making decisions.

The correct frame: the server and client have different capabilities.

| Capability                                  | Server Component | Client Component |
| ------------------------------------------- | ---------------- | ---------------- |
| Read filesystem / database directly         | ✓                | ✗                |
| Access environment secrets                  | ✓                | ✗                |
| Use browser APIs (`window`, `localStorage`) | ✗                | ✓                |
| Hold interactive state (`useState`)         | ✗                | ✓                |
| Subscribe to browser events                 | ✗                | ✓                |
| Render synchronously without hydration      | ✓                | ✗                |

When you reach for `"use client"`, you are not adding interactivity — you are crossing into the capability zone where browser APIs and state are available. The performance implication (JavaScript ships to the client) is a consequence of that capability requirement, not a cost you're paying for no reason.

This reframe matters because it changes the question from "can I make this a server component?" to "does this component need browser capabilities?"

## The serialization constraint

Server components pass data to client components across a serialization boundary. What can cross this boundary is more limited than it appears:

```jsx
// ✅ Works — primitive values are serializable
<ClientComponent
  title="Hello"
  count={42}
  tags={["a", "b"]}
  post={{ slug: "my-post", published: "2026-05-01" }}
/>

// ✅ Works — JSX can cross the boundary as children
<ClientComponent>
  <ServerRenderedContent />
</ClientComponent>

// ❌ Fails — functions are not serializable
<ClientComponent
  onSuccess={() => revalidatePath("/posts")} // Cannot pass this
  formatter={new Intl.DateTimeFormat("en-GB")} // Or this
/>
```

The function constraint is the one that most frequently surprises. If a client component needs to trigger a server action on interaction, the pattern is to import the server action directly in the client component — not to pass it as a prop from a parent server component.

```jsx
// features/posts/DeleteButton.jsx
"use client";

import { deletePost } from "@/actions/posts"; // Server action imported directly

export function DeleteButton({ postId }) {
  return (
    <form action={deletePost}>
      <input type="hidden" name="postId" value={postId} />
      <button type="submit">Delete</button>
    </form>
  );
}
```

## cache() — what it actually does

`React.cache()` memoises a function's return value within a single render pass (a single request). The same function called with the same arguments returns the same result without re-executing.

```js
// lib/data/posts.js
import { cache } from "react";

export const getPostBySlug = cache(async function getPostBySlug(slug) {
  // This filesystem read runs once per request, regardless of how many
  // components call getPostBySlug with the same slug.
  const raw = fs.readFileSync(path.join(CONTENT_DIR, `${slug}.md`), "utf-8");
  return parsePost(raw);
});
```

```jsx
// app/writing/[slug]/page.jsx
export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug); // First call — executes
  return { title: post.title };
}

export default async function Page({ params }) {
  const post = await getPostBySlug(params.slug); // Second call — returns cached result
  return <PostLayout post={post} />;
}
```

Both calls share a single execution. The pipeline — filesystem read, frontmatter parse, remark/rehype processing including Shiki syntax highlighting — runs once per request, not twice.

The important constraint: `cache()` memoisation is per-request. The cache is created when the request begins and discarded when it ends. It is not a persistent cache between requests — for that you need something like `unstable_cache` with explicit revalidation.

## Granular client boundaries

The mistake I made early: marking page components as `"use client"` when only a small interaction within the page needed browser capabilities.

```jsx
// ❌ Too broad — entire page becomes a client component
"use client";

export default function ProjectsPage({ projects }) {
  const [view, setView] = useState("grid"); // Only this needs client
  // Everything else could have been server-rendered
  return (
    <>
      <ViewToggle view={view} onToggle={setView} />
      <ProjectGrid projects={projects} view={view} />
    </>
  );
}
```

```jsx
// ✅ Correct — minimum client boundary
// app/projects/page.jsx — RSC, no "use client"
import { ViewToggle } from "@/features/projects/ViewToggle"; // "use client" inside
import { ProjectGrid } from "@/features/projects/ProjectGrid"; // RSC

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  return (
    <>
      <ViewToggle /> {/* client — manages view state */}
      <ProjectGrid projects={projects} /> {/* RSC — renders the grid */}
    </>
  );
}
```

The `"use client"` boundary is contagious downward: any component imported by a client component is also a client component. It does not propagate upward. A server component can import a client component. A client component cannot import a server component — though it can receive server-rendered JSX as children.

## When RSC is the wrong tool

RSC works well for components that fetch data, render static or nearly-static content, and have no browser-specific requirements. It is the wrong tool for:

**Real-time UI.** Anything that subscribes to a WebSocket, polling interval, or browser event needs to live in a client component. RSC renders once, server-side, and is done. It has no mechanism for re-rendering in response to client-side events.

**Stateful forms.** Multi-step forms with complex validation state, conditional field rendering, or character counters need client state. Server Actions handle submission, but the UI state during form interaction belongs on the client.

**Browser-only libraries.** A charting library that reads `window.devicePixelRatio`, an animation library that uses `requestAnimationFrame`, a drag-and-drop implementation — all of these need `"use client"`.

The test I apply before deciding: does this component need to know something that only exists after the browser has loaded? If yes, it is a client component. If no, it probably should not be.

## The render model in one sentence

Server components run once, on the server, at request time. Client components run on the server for the initial HTML, then hydrate and run again in the browser. Everything in a server component — the data fetch, the transformation, the render — happens before the client sees a byte.

The practical implication: a server component that accidentally imports a large dependency ships zero bytes of that dependency to the client. A client component that imports the same dependency ships all of it. The boundary placement is the bundle size decision.

That is what changed.
