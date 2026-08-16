// features/home/TechSelectorSection/TechList.jsx

// RSC-compatible — rendered inside the client TechSelector parent.
// No "use client" required — onClick is passed as a prop from the parent.
//
// Renders TECH_CATEGORIES as keyboard-accessible, clickable rows.
// Each row: domain label, description, and 4 tech chip tags.
//
// Active state: left accent border (category color) + surface-2 background.
// Hover state: CSS group-hover — no onMouseEnter/onMouseLeave handlers.
// Focus state: inset ring — avoids clipping by the column border.

import { cn } from "@/lib/utils";
import { TECH_CATEGORIES } from "@/lib/data/techSelector";

// ── CategoryRow ────────────────────────────────────────────────────────────────

/**
 * CategoryRow
 *
 * Single clickable domain row in the left column.
 * Active indicator is a 2px left border in the category accent color.
 * All visual transitions are CSS-only.
 *
 * @param {Object}   category  - TECH_CATEGORIES entry
 * @param {boolean}  isActive  - Whether this row is currently selected
 * @param {function} onActivate - Called with category.id on click or Enter/Space
 */
function CategoryRow({ category, isActive, onActivate }) {
  return (
    <button
      type="button"
      onClick={() => onActivate(category.id)}
      aria-pressed={isActive}
      aria-label={`View ${category.label} projects`}
      className={cn(
        // Structure
        "group relative w-full text-left",
        "flex flex-col gap-1.5",
        "px-4 py-4 sm:px-5 lg:py-5",
        "border-b border-[var(--color-border-sub)]",
        "sm:[&:nth-child(odd)]:border-r lg:[&:nth-child(odd)]:border-r-0 lg:last:border-b-0",
        // Transitions
        "transition-[background] duration-150",
        // Focus ring — inset prevents clipping at column border
        "outline-none",
        "focus-visible:ring-2 focus-visible:ring-inset",
        "focus-visible:ring-[var(--color-accent)]",
        // Background state
        isActive
          ? "bg-[var(--color-surface-2)]"
          : "bg-transparent hover:bg-[var(--color-surface-2)]",
      )}
    >
      {/* Active indicator — left accent border */}
      {/*
        Positioned absolute to stay flush with the column left edge.
        Opacity transition rather than conditional render — avoids layout shift.
      */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-0 top-0 bottom-0 w-0.5",
          "transition-opacity duration-200",
          isActive ? "opacity-100" : "opacity-0",
        )}
        style={{ background: category.color.text }}
      />

      {/* Domain label */}
      <span
        className="transition-colors duration-150"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-sm)",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          lineHeight: "var(--leading-snug)",
          color: isActive ? category.color.text : "var(--color-fg)",
        }}
      >
        {category.label}
      </span>

      {/* Short description */}
      <span
        style={{
          fontSize: "var(--text-xs)",
          lineHeight: "var(--leading-snug)",
          color: "var(--color-faint)",
        }}
      >
        {category.description}
      </span>

      {/* Tech chips — compact pill row */}
      {/*
        Chips are intentionally small (0.5625rem) — they communicate
        breadth at a glance, not legibility at reading distance.
        Active state: category accent color. Inactive: faint, borderless.
      */}
      <div className="flex flex-wrap gap-1 mt-0.5">
        {category.chips.map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center px-1.5 py-0.5 rounded-[3px] border"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.5625rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: isActive ? category.color.text : "var(--color-faint)",
              background: isActive ? category.color.bg : "transparent",
              borderColor: isActive
                ? category.color.border
                : "var(--color-border-sub)",
              transition:
                "color 150ms ease, background 150ms ease, border-color 150ms ease",
            }}
          >
            {chip}
          </span>
        ))}
      </div>
    </button>
  );
}

// ── TechList ───────────────────────────────────────────────────────────────────

/**
 * TechList
 *
 * Left column of TechSelector.
 * Renders all TECH_CATEGORIES as stacked CategoryRow buttons.
 * Column header is a mono uppercase label — matches TestimonialsColumn header.
 *
 * @param {string|null} activeId   - Currently active category id
 * @param {function}    onActivate - Setter passed from TechSelector
 */
export function TechList({ activeId, onActivate }) {
  return (
    <div className="flex flex-col h-full">
      {/* Column header */}
      <div
        className="px-5 py-3 border-b border-(--color-border-sub) shrink-0"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.5rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--color-faint)",
        }}
      >
        Domain
      </div>

      {/* Category rows */}
      <div className="grid flex-1 sm:grid-cols-2 lg:flex lg:flex-col">
        {TECH_CATEGORIES.map((category) => (
          <CategoryRow
            key={category.id}
            category={category}
            isActive={activeId === category.id}
            onActivate={onActivate}
          />
        ))}
      </div>
    </div>
  );
}
