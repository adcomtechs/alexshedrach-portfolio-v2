// components/ui/MetricsStrip.jsx
// RSC — no client directive required.
//
// Renders a horizontal strip of quantified metrics in the case study hero.
// Sits between the one-sentence description and the metadata row. (DEC-018 amendment)
//
// VALUE SAFETY — this component never uses truthiness to check metric values.
// The number 0 and the string "0" are both valid, meaningful metric values.
// A truthiness check (`if (metric.value)`) would silently suppress them.
// All value presence checks use explicit null/undefined guards only.

import { MetricBadge } from "./MetricBadge";

/**
 * MetricsStrip
 *
 * Horizontal composition of MetricBadge components. Renders in the case study
 * hero to surface quantified results before the evaluator reads the prose.
 * (DEC-018 amendment — additive; does not replace caseStudy.outcome prose)
 *
 * Renders nothing when the metrics array is absent or empty — no empty state,
 * no placeholder. The case study hero degrades cleanly without a metrics strip.
 *
 * @param {Array<{
 *   value: string | number,
 *   label: string,
 *   trend?: "up" | "down" | "neutral"
 * }>} metrics - Metric entries from the project schema.
 *               Max 3–4 entries — hero space is constrained. (DEC-018 amendment)
 */
export function MetricsStrip({ metrics }) {
  // Guard: empty or absent array renders nothing.
  if (!metrics?.length) return null;

  // Filter entries where value is explicitly null or undefined.
  // 0, "0", "", and false are all permitted values — only nullish is excluded.
  const visible = metrics.filter(
    (m) => m.value !== null && m.value !== undefined,
  );

  if (!visible.length) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {visible.map((metric, i) => (
        <MetricBadge
          key={i}
          value={metric.value}
          label={metric.label}
          trend={metric.trend}
        />
      ))}
    </div>
  );
}
