// components/ui/Tabs.jsx
// RSC — no client directive required
//
// STATE CONTRACT — this component is intentionally stateless.
// The consumer owns active tab state. This enables the Tabs component to work
// with URL-driven state (searchParams), local useState, or a context store
// without the component imposing a model.
//
// ARIA CONTRACT — full tab accessibility requires the consumer to:
//   1. Assign `id` to each <Tab> (e.g., id="tab-overview")
//   2. Assign `aria-controls` pointing to the panel it controls (e.g., aria-controls="panel-overview")
//   3. Render panel elements with `role="tabpanel"` and `aria-labelledby` matching the tab id
//
// Minimal example:
//   <Tabs aria-label="Project sections">
//     <Tab id="tab-overview" aria-controls="panel-overview" active>Overview</Tab>
//     <Tab id="tab-decisions" aria-controls="panel-decisions">Decisions</Tab>
//   </Tabs>
//   <div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview">...</div>
//   <div id="panel-decisions" role="tabpanel" aria-labelledby="tab-decisions" hidden>...</div>

import { cn } from "@/lib/utils";

/**
 * Tabs
 *
 * Tab strip container. Renders as `role="tablist"`. Provides consistent
 * bottom-border baseline and alignment for Tab children.
 *
 * @param {string}    aria-label - Required. Describes the tab group for AT users.
 * @param {string}    className  - Layout overrides only.
 */
export function Tabs({ className, children, ...props }) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex border-b border-[var(--color-border-sub)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Tab
 *
 * Individual tab trigger. Renders as `role="tab"` with `aria-selected`.
 *
 * Pass `id` and `aria-controls` to complete the ARIA relationship.
 * See ARIA CONTRACT at the top of this file.
 *
 * @param {boolean}  active    - Whether this tab is currently selected.
 * @param {string}   className - Layout overrides only.
 */
export function Tab({ active = false, className, children, ...props }) {
  return (
    <button
      role="tab"
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      style={{ fontSize: "var(--text-sm)" }}
      className={cn(
        "px-4 py-2.5 font-medium border-b-2 -mb-px",
        "transition-colors duration-150",
        "outline-none",
        "focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
        "focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-bg)]",
        // Inactive
        "text-[var(--color-faint)] border-transparent",
        "hover:text-[var(--color-muted)]",
        // Active
        active && "text-[var(--color-accent)] border-[var(--color-accent)]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
