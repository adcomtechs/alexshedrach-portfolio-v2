// features/projects/FilterControls.jsx
"use client";
//
// use client justified — router.push and focus management cannot run server-side.
// Minimum client boundary: filter pill interaction only. ProjectIndex stays RSC.
// (DEC-025, DEC-026)
//
// Filter state lives in the URL via searchParams — bookmarkable, shareable,
// and RSC-compatible. (DEC-025)
//
// UI pattern: horizontal pill row. Domain pills first, status second.
// Active pills render with accent treatment via Tag component. (DEC-026)
// "Clear filters" link appears when any filter is active.
//
// Keyboard navigation: roving tabindex within each group. Arrow keys move
// focus between pills. Enter/Space activates the focused pill (handled by Tag).
// This is a mandatory accessibility requirement, not an enhancement. (DEC-026)

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useRef } from "react";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/utils";

// Human-readable labels for status values
const STATUS_LABELS = {
  live:     "Live",
  wip:      "WIP",
  archived: "Archived",
};

/**
 * FilterControls
 *
 * Renders the filter pill row for the projects index. Conditionally renders
 * domain and status filter groups based on the conditions object from page.jsx.
 * The filter row container itself only renders when showFilterRow is true —
 * that check lives in page.jsx, not here. (DEC-031)
 *
 * @param {{ domain: string|null, status: string|null, page: number }} filters
 *   Current active filters from parseFilters().
 * @param {{
 *   showDomainFilter: boolean,
 *   showStatusFilter: boolean,
 *   uniqueDomains:    string[],
 *   uniqueStatuses:   string[],
 * }} conditions
 *   Evaluated conditions from evaluateConditions().
 * @param {boolean} filtersActive  Whether any filter is currently active.
 * @param {number}  filteredCount  Count of filtered results.
 * @param {number}  totalCount     Total unfiltered project count.
 */
export function FilterControls({
  filters,
  conditions,
  filtersActive,
}) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  // Container refs for each filter group — used for arrow key focus management.
  const domainGroupRef = useRef(null);
  const statusGroupRef = useRef(null);

  // ── URL builder ─────────────────────────────────────────────────────────────
  //
  // Preserves all existing searchParams, applies updates, resets page to 1.
  // Passing null for a key removes it from the URL (clean URLs, no stale params).

  function buildUrl(updates) {
    const params = new URLSearchParams(searchParams.toString());

    // Reset to page 1 on any filter change — current page may be out of range
    params.delete("page");

    Object.entries(updates).forEach(([key, value]) => {
      if (value != null && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    const query = params.toString();
    return `${pathname}${query ? `?${query}` : ""}`;
  }

  function setDomain(domain) {
    router.push(buildUrl({ domain }), { scroll: false });
  }

  function setStatus(status) {
    router.push(buildUrl({ status }), { scroll: false });
  }

  function clearAll() {
    router.push(buildUrl({ domain: null, status: null }), { scroll: false });
  }

  // ── Keyboard navigation ──────────────────────────────────────────────────────
  //
  // Roving tabindex within each group. Arrow keys move focus between pills.
  // querySelectorAll('[role="button"]') finds all Tag spans in the group.
  // Enter/Space is handled by the Tag component's own onKeyDown — not overridden.

  function handleGroupKeyDown(e, groupRef) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      return;
    }
    e.preventDefault();

    const pills = Array.from(
      groupRef.current?.querySelectorAll('[role="button"]') ?? [],
    );
    if (pills.length === 0) return;

    const focusedIndex = pills.findIndex((el) => el === document.activeElement);
    if (focusedIndex === -1) {
      pills[0].focus();
      return;
    }

    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? (focusedIndex + 1) % pills.length
        : (focusedIndex - 1 + pills.length) % pills.length;

    pills[next].focus();
  }

  // ── Pill builders ────────────────────────────────────────────────────────────

  // Domain pills: "All" resets domain filter, individual values set it.
  const domainPills = [
    { value: null,  label: "All" },
    ...conditions.uniqueDomains.map((d) => ({ value: d, label: d })),
  ];

  // Status pills: "All" resets status filter, individual values set it.
  const statusPills = [
    { value: null,  label: "All" },
    ...conditions.uniqueStatuses.map((s) => ({
      value: s,
      label: STATUS_LABELS[s] ?? s,
    })),
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">

      {/* Domain filter group ── per DEC-026, domain pills render first */}
      {conditions.showDomainFilter && (
        <div
          ref={domainGroupRef}
          role="group"
          aria-label="Filter by domain"
          className="flex items-center gap-1.5 flex-wrap"
          onKeyDown={(e) => handleGroupKeyDown(e, domainGroupRef)}
        >
          {domainPills.map(({ value, label }, i) => {
            const isActive = value === null
              ? !filters.domain
              : filters.domain === value;

            // Roving tabindex — focused/active pill is reachable via Tab.
            // Others are skipped (tabIndex={-1}) and reached via arrow keys.
            const isTabbable = isActive || (!filters.domain && i === 0);

            return (
              <Tag
                key={label}
                active={isActive}
                clickable
                onClick={() => setDomain(value)}
                tabIndex={isTabbable ? 0 : -1}
              >
                {label}
              </Tag>
            );
          })}
        </div>
      )}

      {/* Group divider — only when both filter groups render */}
      {conditions.showDomainFilter && conditions.showStatusFilter && (
        <span
          aria-hidden
          style={{
            color: "var(--color-border)",
            fontSize: "var(--text-sm)",
            userSelect: "none",
          }}
        >
          /
        </span>
      )}

      {/* Status filter group ── renders second, per DEC-026 */}
      {conditions.showStatusFilter && (
        <div
          ref={statusGroupRef}
          role="group"
          aria-label="Filter by status"
          className="flex items-center gap-1.5 flex-wrap"
          onKeyDown={(e) => handleGroupKeyDown(e, statusGroupRef)}
        >
          {statusPills.map(({ value, label }, i) => {
            const isActive = value === null
              ? !filters.status
              : filters.status === value;

            const isTabbable = isActive || (!filters.status && i === 0);

            return (
              <Tag
                key={label}
                active={isActive}
                clickable
                onClick={() => setStatus(value)}
                tabIndex={isTabbable ? 0 : -1}
              >
                {label}
              </Tag>
            );
          })}
        </div>
      )}

      {/* Clear filters — appears only when a filter is active. (DEC-026) */}
      {filtersActive && (
        <button
          onClick={clearAll}
          className={cn(
            "flex items-center gap-1",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-[var(--color-accent)] rounded-sm",
          )}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            letterSpacing: "0.06em",
            color: "var(--color-faint)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-muted)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-faint)";
          }}
        >
          Clear filters ×
        </button>
      )}
    </div>
  );
}