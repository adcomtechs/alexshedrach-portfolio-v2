// features/projects/EmptyState.jsx
// RSC — no client directive required.
//
// Renders when active filters return zero projects. (DEC-031)
// Never renders when no filters are active — the unfiltered list always
// has projects. The condition check lives in page.jsx.
//
// "Clear filters" is a Link to /projects — resets all params including
// view, returning the user to the default grid with no active filters.
// RSC-safe: no router.push, no client interaction needed.

import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

// Human-readable labels for status values — mirrors FilterControls
const STATUS_LABELS = {
  live: "Live",
  wip: "WIP",
  archived: "Archived",
};

/**
 * EmptyState
 *
 * Communicates clearly that filters returned no results and provides a
 * single, unambiguous action to recover. No illustration, no decoration —
 * the message and the action are the entire component.
 *
 * Min-height matches roughly two rows of the two-column grid so the page
 * does not feel broken or collapsed when results are absent.
 *
 * @param {{ domain: string|null, status: string|null }} filters
 *   Current active filters — used to describe what returned no results.
 */
export function EmptyState({ filters }) {
  // Build a readable description of the active filters
  const activeLabels = [
    filters.domain ?? null,
    filters.status ? STATUS_LABELS[filters.status] : null,
  ].filter(Boolean);

  const filterDescription =
    activeLabels.length > 0 ? activeLabels.join(" · ") : "these filters";

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[380px] px-6 py-16"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border-sub)",
      }}
    >
      {/* Eyebrow — mono, faint — identifies the state */}
      <span
        className="mb-4"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--color-faint)",
        }}
      >
        No results
      </span>

      {/* Heading */}
      <Heading as="h2" size="3" balance className="mb-3 text-center">
        No projects match{" "}
        <span style={{ color: "var(--color-accent)" }}>
          {filterDescription}
        </span>
      </Heading>

      {/* Subtext */}
      <Text size="sm" color="muted" balance className="mb-8 text-center">
        Try a different filter combination or clear all filters to see the full
        project index.
      </Text>

      {/* Reset action — Link renders as Button, no client JS needed */}
      <Button href="/projects" variant="outline" size="sm">
        Clear filters
      </Button>
    </div>
  );
}
