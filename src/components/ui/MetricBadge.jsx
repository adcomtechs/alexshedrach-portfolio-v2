// components/ui/MetricBadge/MetricBadge.jsx
// RSC — no client directive required

import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/Text";

/**
 * MetricBadge
 *
 * Outcome-oriented data display. Communicates a quantified result — not a
 * label, not a status, not a category. A MetricBadge says: "here is a number
 * that proves something."
 *
 * Distinct from Badge: Badge classifies. MetricBadge evidences.
 *
 * Used in the "Proof of Work" section on the home page and in case study
 * outcome sections. Designed to sit in a grid of 2–4 units.
 *
 * @param {string|number} value   - The metric value. Displayed prominently.
 *                                  Pass the full string including units: "40%", "2.4s", "12k".
 * @param {string}        label   - Describes what the value measures.
 *                                  Keep it short — 2–4 words max.
 * @param {string}        trend   - Optional directional signal.
 *                                  "up"      → improvement (success color + ↑)
 *                                  "down"    → regression  (danger color + ↓)
 *                                  "neutral" → stable      (faint color + →)
 *                                  Omit when direction is irrelevant to the metric.
 * @param {string}        context - Optional one-line context note rendered below
 *                                  the label. Use sparingly — only when the metric
 *                                  requires clarification to be meaningful.
 * @param {string}        className - Passthrough for layout overrides (grid span, etc.).
 *                                    Must not override visual styles.
 */

const trendConfig = {
  up: {
    glyph: "↑",
    color: "var(--color-success)",
    label: "improvement",
  },
  down: {
    glyph: "↓",
    color: "var(--color-danger)",
    label: "regression",
  },
  neutral: {
    glyph: "→",
    color: "var(--color-faint)",
    label: "stable",
  },
};

export function MetricBadge({ value, label, trend, context, className }) {
  const trendMeta = trend ? trendConfig[trend] : null;

  return (
    <div
      className={cn(
        // Surface treatment — consistent with `.surface` utility but
        // with tighter padding tuned to data display density.
        "flex flex-col gap-2 p-5 rounded-xl",
        "bg-[var(--color-surface)] border border-[var(--color-border-sub)]",
        className,
      )}
    >
      {/* Value row */}
      <div className="flex items-baseline gap-2">
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-3xl)",
            lineHeight: "var(--leading-tight)",
            letterSpacing: "var(--tracking-tight)",
            fontWeight: 700,
            color: "var(--color-fg)",
          }}
        >
          {value}
        </span>

        {trendMeta && (
          <span
            aria-label={trendMeta.label}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-md)",
              fontWeight: 600,
              color: trendMeta.color,
              // Slight lift so the glyph optically aligns with the value baseline
              lineHeight: 1,
            }}
          >
            {trendMeta.glyph}
          </span>
        )}
      </div>

      {/* Label + optional context */}
      <div className="flex flex-col gap-0.5">
        <Text size="sm" color="muted">
          {label}
        </Text>

        {context && (
          <Text size="sm" color="faint">
            {context}
          </Text>
        )}
      </div>
    </div>
  );
}
