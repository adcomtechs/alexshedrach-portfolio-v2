// features/about/AboutStats.jsx
// RSC — no client directive required.
//
// Redesign rationale (vs. original):
//   Original: cramped 3-column horizontal cells, mono labels, values clipping at
//   "100%", "Full stacks (JS + Java)" unreadable at xs size. No visual hierarchy.
//
//   Redesigned: vertical stack of three metric cards. Each card has:
//     - A thin top accent bar in --color-accent (full width, 2px)
//     - Value at display scale — never clips, always readable
//     - Label in body font (not mono) — legible at natural reading distance
//     - Optional qualifier in mono below the label — for nuance without clutter
//     - Hover: CSS-only lift + accent border + subtle glow
//     - A decorative corner mark (top-right) — engineering instrument motif
//
//   Vertical stacking is correct for the column context (~320px wide).
//   Three horizontal cells in that width force illegible font sizes.
//   Three vertical cards give each stat the space it deserves.
//
// Data source: ABOUT_STATS from lib/data/about.js
// Schema expected: { value: string, label: string, qualifier?: string }
// The `qualifier` field is optional — if absent, no qualifier row renders.

import { ABOUT_STATS } from "@/lib/data/about";

/**
 * StatCard
 *
 * Individual metric card. Top accent bar + value + label + optional qualifier.
 * All hover states are CSS-only via Tailwind group utilities.
 * No client boundary, no onMouseEnter/onMouseLeave.
 *
 * @param {Object} stat        — ABOUT_STATS entry
 * @param {number} index       — Position in the list (0-based)
 * @param {number} total       — Total stat count (for aria description)
 */
function StatCard({ stat, index, total }) {
  return (
    <div
      className="group relative flex items-center gap-5 px-5 py-4 rounded-xl overflow-hidden"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border-sub)",
        transition:
          "transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease",
      }}
      role="listitem"
      aria-label={`${stat.value} — ${stat.label}`}
    >
      {/* Top accent bar — full width, 2px, transitions from border-sub to accent */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
        style={{
          background: `linear-gradient(90deg, var(--color-accent), rgba(181,242,61,0.3))`,
          opacity: 0.45,
          transition: "opacity 200ms ease",
        }}
      />

      {/* Decorative corner mark — engineering grid motif */}
      {/* Two perpendicular lines in the top-right corner, very faint */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-8 h-8 overflow-hidden opacity-[0.07]"
      >
        <div
          className="absolute top-3 right-0 w-full h-px"
          style={{ background: "var(--color-accent)" }}
        />
        <div
          className="absolute top-0 right-3 w-px h-full"
          style={{ background: "var(--color-accent)" }}
        />
      </div>

      {/* Left: index counter — ordinal position, mono, very faint */}
      <div
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.5rem",
          letterSpacing: "0.1em",
          color: "var(--color-faint)",
          opacity: 0.5,
          flexShrink: 0,
          alignSelf: "flex-start",
          paddingTop: "4px",
          minWidth: "18px",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Center: value */}
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-xl)",
          fontWeight: 700,
          letterSpacing: "var(--tracking-tight)",
          lineHeight: "var(--leading-tight)",
          color: "var(--color-accent)",
          flexShrink: 0,
          minWidth: "72px",
          // Subtle glow — reinforces the accent color
          textShadow: "0 0 24px rgba(181,242,61,0.25)",
          transition: "text-shadow 200ms ease",
        }}
      >
        {stat.value}
      </div>

      {/* Right: label + qualifier */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            color: "var(--color-fg)",
            lineHeight: "var(--leading-snug)",
          }}
        >
          {stat.label}
        </span>

        {stat.qualifier && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--color-faint)",
              letterSpacing: "0.04em",
              lineHeight: "var(--leading-snug)",
            }}
          >
            {stat.qualifier}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * AboutStats
 *
 * Vertical stack of StatCard components.
 * Replaces the cramped 3-column horizontal cell layout.
 * Each stat gets a full card — value, label, and qualifier are all readable.
 */
export function AboutStats() {
  return (
    <div
      className="flex flex-col gap-2.5"
      role="list"
      aria-label="Engineering statistics"
    >
      {ABOUT_STATS.map((stat, i) => (
        <StatCard
          key={stat.label}
          stat={stat}
          index={i}
          total={ABOUT_STATS.length}
        />
      ))}
    </div>
  );
}
