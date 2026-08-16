// features/home/ProofOfWorkSection/SecondaryMetric.jsx
// RSC — no client directive required.
//
// Supporting metric cell. Right column, stacked vertically on desktop.
// Smaller than PrimaryMetric in value size but still generous —
// not a compact badge, a readable data cell.
//
// Each cell has:
//   Value     — text-3xl, 700 weight
//   Trend     — directional glyph, color-coded
//   Label     — what the number measures
//   Context   — measurement qualifier
//   Separator — a thin horizontal rule between the value and metadata
//               gives each cell an internal structure that reads clearly
//               when three cells are stacked in a column
//
// The left accent bar is driven by the metric's trend color —
// up = success green, neutral = faint, down = danger red.
// This gives the right column a subtle coded visual rhythm
// without requiring additional UI elements.

import { Text } from "@/components/ui/Text";

const TREND_CONFIG = {
  up: { glyph: "↑", color: "var(--color-success)" },
  down: { glyph: "↓", color: "var(--color-danger)" },
  neutral: { glyph: "→", color: "var(--color-faint)" },
};

/**
 * SecondaryMetric
 *
 * @param {Object}  metric       — HOME_METRICS entry with featured: false
 * @param {boolean} isLast       — Suppresses bottom border on the final cell
 */
export function SecondaryMetric({ metric, isLast = false }) {
  const trend = metric.trend ? TREND_CONFIG[metric.trend] : null;
  const accentColor = trend?.color ?? "var(--color-faint)";

  return (
    <div
      className="relative flex flex-col gap-3 px-6 py-6"
      style={
        !isLast
          ? { borderBottom: "1px solid var(--color-border-sub)" }
          : undefined
      }
    >
      {/* Left accent bar — trend-color coded */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-6 bottom-6 w-[2px] rounded-full"
        style={{
          background: `linear-gradient(to bottom, ${accentColor}, transparent)`,
          opacity: 0.5,
        }}
      />

      {/* Value row — number + trend glyph */}
      <div className="flex items-baseline gap-2 flex-wrap">
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-3xl)",
            fontWeight: 700,
            lineHeight: "var(--leading-tight)",
            letterSpacing: "var(--tracking-tight)",
            color: "var(--color-fg)",
          }}
        >
          {metric.value}
        </span>

        {trend && (
          <span
            aria-label={`Trend: ${metric.trend}`}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-md)",
              fontWeight: 600,
              color: trend.color,
              lineHeight: 1,
            }}
          >
            {trend.glyph}
          </span>
        )}
      </div>

      {/* Separator — gives the cell internal visual structure */}
      <div
        aria-hidden="true"
        className="h-px w-8 rounded-full"
        style={{ background: "var(--color-border)" }}
      />

      {/* Label + context */}
      <div className="flex flex-col gap-0.5">
        <Text size="sm" color="muted">
          {metric.label}
        </Text>
        {metric.context && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--color-faint)",
              letterSpacing: "0.02em",
            }}
          >
            {metric.context}
          </span>
        )}
      </div>
    </div>
  );
}
