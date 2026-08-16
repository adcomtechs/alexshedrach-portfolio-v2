"use client";
// features/projects/StatusFilterBar.jsx
//
// use client — router.push for URL-based status filter state. (DEC-025)
// Replaces the status filter portion of FilterControls.jsx (now superseded).
//
// Renders above the project grid. Three responsibilities:
//   1. Status filter pills (All / Live / WIP / Archived)
//   2. Contextual project count — visible only when any filter is active
//   3. View toggle (grid / list)
//
// The count display is the primary feedback mechanism for filter state.
// It reads: "N of T" with the filtered count in accent color, total in muted.
// When no filters are active, the count is hidden — it adds no information.
// (DEC-031: condition evaluation governs what renders)

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ViewToggle } from "@/features/projects/ViewToggle";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  live: { label: "Live", dot: "var(--color-success)" },
  wip: { label: "WIP", dot: null },
  archived: { label: "Archived", dot: null },
};

/**
 * StatusPill
 *
 * Single status filter pill. Active state uses accent color treatment.
 * Inactive state uses muted text with border.
 */
function StatusPill({ label, isActive, hasDot, dotColor, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        "inline-flex items-center gap-1.5",
        "px-3 py-1 rounded-full border",
        "transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1",
      )}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-xs)",
        letterSpacing: "0.05em",
        fontWeight: isActive ? 600 : 400,
        color: isActive ? "var(--color-accent)" : "var(--color-muted)",
        background: isActive
          ? "var(--color-accent-bg)"
          : "var(--color-surface)",
        borderColor: isActive ? "rgba(181,242,61,0.35)" : "var(--color-border)",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.borderColor = "var(--color-border-sub)";
          e.currentTarget.style.background = "var(--color-surface-2)";
          e.currentTarget.style.color = "var(--color-fg)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.borderColor = "var(--color-border)";
          e.currentTarget.style.background = "var(--color-surface)";
          e.currentTarget.style.color = "var(--color-muted)";
        }
      }}
    >
      {/* Status dot — only for "live" */}
      {hasDot && (
        <span
          aria-hidden
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: dotColor }}
        />
      )}
      {label}
    </button>
  );
}

/**
 * ProjectCountBadge
 *
 * Compact count display. Renders only when filters are active.
 * Filtered count in accent treatment; total in faint.
 *
 * @param {number} filteredCount
 * @param {number} totalCount
 */
function ProjectCountBadge({ filteredCount, totalCount }) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1 rounded-full"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border-sub)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          letterSpacing: "0.05em",
          fontWeight: 600,
          color: "var(--color-accent)",
        }}
      >
        {filteredCount}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          color: "var(--color-faint)",
        }}
      >
        /
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          letterSpacing: "0.04em",
          color: "var(--color-faint)",
        }}
      >
        {totalCount}
      </span>
    </div>
  );
}

/**
 * StatusFilterBar
 *
 * @param {string[]}     statuses       — unique status values from evaluateConditions
 * @param {string|null}  activeStatus   — current active status filter
 * @param {"grid"|"list"} activeView    — current view mode
 * @param {number}       totalCount     — unfiltered total
 * @param {number}       filteredCount  — post-filter total
 * @param {boolean}      filtersActive  — whether any filter is currently set
 */
export function StatusFilterBar({
  statuses,
  activeStatus,
  activeView,
  totalCount,
  filteredCount,
  filtersActive,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function buildUrl(updates) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    Object.entries(updates).forEach(([key, value]) => {
      if (value != null) params.set(key, value);
      else params.delete(key);
    });
    const query = params.toString();
    return `${pathname}${query ? `?${query}` : ""}`;
  }

  function setStatus(status) {
    router.push(buildUrl({ status }), { scroll: false });
  }

  return (
    <div
      className="flex items-center justify-between gap-4 pb-4 mb-6"
      style={{ borderBottom: "1px solid var(--color-border-sub)" }}
    >
      {/* Left cluster: status pills + count badge */}
      <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
        {/* "All" pill — resets status filter */}
        <StatusPill
          label="All"
          isActive={!activeStatus}
          hasDot={false}
          onClick={() => setStatus(null)}
        />

        {/* Individual status pills */}
        {statuses.map((status) => {
          const config = STATUS_CONFIG[status];
          if (!config) return null;
          return (
            <StatusPill
              key={status}
              label={config.label}
              isActive={activeStatus === status}
              hasDot={!!config.dot}
              dotColor={config.dot}
              onClick={() => setStatus(activeStatus === status ? null : status)}
            />
          );
        })}

        {/* Count badge — only when filters produce a subset */}
        {filtersActive && filteredCount !== totalCount && (
          <ProjectCountBadge
            filteredCount={filteredCount}
            totalCount={totalCount}
          />
        )}
      </div>

      {/* Right: view toggle */}
      <ViewToggle activeView={activeView} />
    </div>
  );
}
