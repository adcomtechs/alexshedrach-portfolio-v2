// components/sections/tech-selector/selector-bottom-bar.jsx
// RSC-compatible — rendered inside the client TechSelector parent.
// No "use client" required.
//
// Refinements vs. original:
//
//   1. onMouseEnter/onMouseLeave on CTAs → Button component.
//      All hover states are CSS-only via Button's internal variant system.
//      No inline style mutations anywhere in this file.
//
//   2. Hardcoded #0a0a0b → var(--color-bg) via Button variant="primary".
//      Button handles text color internally. No override needed.
//
//   3. max-w-[1200px] → max-w-6xl.
//      Aligns with the established container system used by the panel above.
//
//   4. "Currently viewing" label uses category label, not tech item label.
//      TECH_CATEGORIES replaces the flat TECH_ITEMS list — lookup updated.
//
//   5. Removed the long "This is the full engineering stack" paragraph.
//      Replaced with a shorter, higher-signal statement that respects the
//      content standard: concrete, direct, no filler.

import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { TECH_CATEGORIES } from "@/lib/data/techSelector";

function ArrowRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/**
 * SelectorBottomBar
 *
 * Closes the TechSelector panel. Three elements in one horizontal row:
 *   Left  — one-line positioning statement
 *   Center — "Viewing: [active domain]" live label
 *   Right  — "Browse all projects" CTA
 *
 * The center label is aria-live="polite" — screen readers announce
 * the active domain label when it changes.
 *
 * @param {string|null} activeId - Active category id from TechSelector
 */
export function SelectorBottomBar({ activeId }) {
  const activeCategory = TECH_CATEGORIES.find((c) => c.id === activeId);
  const activeLabel = activeCategory?.label ?? "—";
  const activeColor = activeCategory?.color.text ?? "var(--color-accent)";

  return (
    <div
      className="border-t border-[var(--color-border-sub)]"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center lg:grid-cols-[1fr_auto_auto] lg:gap-8">
          {/* Left — positioning statement */}
          <Text size="sm" color="muted" className="max-w-sm">
            Every item above has{" "}
            <strong style={{ color: "var(--color-fg)", fontWeight: 600 }}>
              shipped to production.
            </strong>{" "}
            The case studies show the decisions behind them.
          </Text>

          {/* Center — live active domain label */}
          <div
            className="flex min-w-0 items-center gap-2 sm:justify-end lg:justify-start"
            aria-live="polite"
            aria-label={`Currently viewing ${activeLabel}`}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-faint)",
                letterSpacing: "0.08em",
              }}
            >
              Viewing:
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: activeColor,
                transition: "color 200ms ease",
                overflowWrap: "anywhere",
              }}
            >
              {activeLabel}
            </span>
          </div>

          {/* Right — CTA */}
          <Button
            href="/projects"
            variant="primary"
            size="sm"
            className="w-full sm:col-span-2 sm:w-auto lg:col-span-1"
            rightIcon={<ArrowRightIcon />}
          >
            Browse all projects
          </Button>
        </div>
      </div>
    </div>
  );
}
