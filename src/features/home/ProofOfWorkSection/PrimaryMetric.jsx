// features/home/ProofOfWorkSection/PrimaryMetric.jsx
// RSC — no client directive required.
//
// The dominant metric. Left column on desktop.
// The value renders at the largest type scale on the page below the hero —
// it is the first number the eye lands on inside the panel.
//
// Structure:
//   Eyebrow  — "Primary signal" in mono uppercase
//   Value    — display scale, 800 weight, the focal point
//   Trend    — directional glyph, color-coded to token system
//   Label    — one phrase describing what the number measures
//   Context  — mono, muted — timeframe and measurement method
//   Rail     — decorative measurement bar with calibration marks
//              communicates precision without adding content weight
//
// The rail is a purely decorative engineering motif. It reinforces the
// telemetry instrument aesthetic without requiring additional data.
// The filled width (72%) is not a data point — it is visual composition.

import { Text } from "@/components/ui/Text";

// Trend → glyph + color mapping.
// "up" = success (growth). "down" = danger. "neutral" = faint (stable).
const TREND_CONFIG = {
  up: { glyph: "↑", color: "var(--color-success)" },
  down: { glyph: "↓", color: "var(--color-danger)" },
  neutral: { glyph: "→", color: "var(--color-faint)" },
};

/**
 * MeasurementRail
 *
 * Decorative telemetry motif. Horizontal bar with calibration tick marks.
 * The filled portion width is a composition decision, not a data point.
 * Communicates "this was measured" without competing with the metric content.
 */
function MeasurementRail() {
  // 5 calibration ticks evenly distributed across the rail.
  const TICKS = [0, 25, 50, 75, 100];

  return (
    <div className="flex flex-col gap-2" aria-hidden="true">
      {/* Rail track */}
      <div
        className="relative h-px w-full rounded-full"
        style={{ background: "var(--color-border)" }}
      >
        {/* Filled segment */}
        <div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{
            width: "72%",
            background:
              "linear-gradient(to right, var(--color-info), rgba(96,165,250,0.25))",
          }}
        />

        {/* Calibration ticks — 4px tall marks at 0/25/50/75/100% */}
        {TICKS.map((pct) => (
          <div
            key={pct}
            className="absolute top-0 w-px"
            style={{
              left: `${pct}%`,
              height: "4px",
              background:
                pct <= 72 ? "rgba(96,165,250,0.5)" : "var(--color-border)",
              transform: "translateX(-50%)",
            }}
          />
        ))}
      </div>

      {/* Rail label */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.5rem",
          color: "var(--color-faint)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        verified output · 72% toward target
      </span>
    </div>
  );
}

/**
 * PrimaryMetric
 *
 * @param {Object} metric — HOME_METRICS entry with featured: true
 */
export function PrimaryMetric({ metric }) {
  const trend = metric.trend ? TREND_CONFIG[metric.trend] : null;

  return (
    <div
      className="flex flex-col justify-between gap-8 p-7 lg:p-9"
      style={{ borderRight: "1px solid var(--color-border-sub)" }}
    >
      {/* Eyebrow */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.5rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--color-info)",
          fontWeight: 600,
        }}
      >
        Primary signal
      </span>

      {/* Value block */}
      <div className="flex flex-col gap-4">
        {/* Value + trend glyph */}
        <div className="flex items-start gap-3 flex-wrap">
          <span
            style={{
              fontFamily: "var(--font-display)",
              // Fluid scale between 3.5rem and 5.5rem — always dominates
              fontSize: "clamp(3.5rem, 5.5vw, 5.5rem)",
              fontWeight: 800,
              lineHeight: 0.88,
              letterSpacing: "-0.045em",
              color: "var(--color-fg)",
              // Subtle info-blue text shadow — reinforces the cold light source
              textShadow: "0 0 60px rgba(96,165,250,0.15)",
            }}
          >
            {metric.value}
          </span>

          {trend && (
            <span
              aria-label={`Trend: ${metric.trend}`}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                fontWeight: 700,
                color: trend.color,
                lineHeight: 1.2,
                marginTop: "0.5rem",
              }}
            >
              {trend.glyph}
            </span>
          )}
        </div>

        {/* Label */}
        <Text size="base" color="muted" style={{ maxWidth: "20ch" }}>
          {metric.label}
        </Text>

        {/* Context — mono, quieter than the label */}
        {metric.context && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--color-info)",
              letterSpacing: "0.03em",
              opacity: 0.75,
            }}
          >
            {metric.context}
          </span>
        )}
      </div>

      {/* Measurement rail — decorative engineering motif */}
      <MeasurementRail />
    </div>
  );
}
