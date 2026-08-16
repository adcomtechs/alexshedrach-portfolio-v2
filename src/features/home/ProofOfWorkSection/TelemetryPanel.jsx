// features/home/ProofOfWork/TelemetryPanel.jsx
// RSC — no client directive required.
//
// Left panel of the open-book layout.
//
// Anatomy (top → bottom):
//   HeaderBar          — terminal-style status bar
//   MetricsGrid        — 2×2 compact metric cards
//   PanelDivider       — hairline separator
//   ScreenshotCarousel — image slider (use client — imported below)
//   FooterStrip        — signal count + date range
//
// ScreenshotCarousel is client-only. Everything else is RSC.

import { ScreenshotCarousel } from "./ScreenshotCarousel";

// ─── Trend config ─────────────────────────────────────────────────────────────

const trendConfig = {
  up: { glyph: "↑", color: "var(--color-success)" },
  down: { glyph: "↓", color: "var(--color-danger)" },
  neutral: { glyph: "→", color: "var(--color-faint)" },
};

// ─── TelemetryPanel ──────────────────────────────────────────────────────────

export function TelemetryPanel({ metrics, projects }) {
  return (
    <div
      className="min-h-full"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--color-surface)",
      }}
    >
      <HeaderBar />
      <MetricsGrid metrics={metrics} />
      <PanelDivider />

      {/* Screenshot carousel fills all remaining vertical space */}
      <div className="min-h-[300px] sm:min-h-[360px] lg:min-h-0" style={{ flex: 1 }}>
        <ScreenshotCarousel projects={projects} />
      </div>

      <FooterStrip count={metrics.length} />
    </div>
  );
}

// ─── HeaderBar ───────────────────────────────────────────────────────────────

function HeaderBar() {
  return (
    <div
      className="flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
      style={{
        display: "flex",
        padding: "10px 20px",
        borderBottom: "1px solid var(--color-border-sub)",
        background: "var(--color-surface-2)",
        flexShrink: 0,
      }}
    >
      <div className="min-w-0" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          aria-hidden
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "var(--color-success)",
            display: "inline-block",
            animation: "dot-pulse 2.5s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-faint)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            overflowWrap: "anywhere",
          }}
        >
          sys.output · alexshedrach.dev
        </span>
      </div>

      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          color: "var(--color-accent)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        verified
      </span>
    </div>
  );
}

// ─── MetricsGrid ─────────────────────────────────────────────────────────────
//
// 2×2 grid of compact metric cards.
// Value at ~text-2xl — small enough that all four fit without crowding,
// large enough to read as data at a glance.

function MetricsGrid({ metrics }) {
  return (
    <div
      className="gap-2.5 p-3.5 sm:p-4"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        flexShrink: 0,
      }}
    >
      {metrics.map((metric, i) => (
        <MetricCard key={i} metric={metric} />
      ))}
    </div>
  );
}

// ─── MetricCard ──────────────────────────────────────────────────────────────
//
// Anatomy (flex column):
//   [project source] — mono, faint, uppercase, xs
//   [value + trend]  — display font, 2xl
//   [label]          — xs, muted, max 2 lines

function MetricCard({ metric }) {
  const trend = trendConfig[metric.trend] ?? trendConfig.neutral;

  return (
    <div
      className="min-w-0"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        padding: "12px 14px",
        background: "var(--color-surface-2)",
        border: "1px solid var(--color-border-sub)",
        borderLeft: "2px solid var(--color-border)",
        borderRadius: "8px",
      }}
    >
      {/* Project source */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          color: "var(--color-faint)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: 1,
        }}
      >
        {metric.project}
      </span>

      {/* Value + trend glyph */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-xl)",
            fontWeight: 700,
            letterSpacing: "var(--tracking-tight)",
            lineHeight: 1,
            color: "var(--color-fg)",
          }}
        >
          {metric.value}
        </span>
        <span
          aria-hidden
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            color: trend.color,
            lineHeight: 1,
          }}
        >
          {trend.glyph}
        </span>
      </div>

      {/* Label — hard-capped at 2 lines so cards stay uniform height */}
      <span
        style={{
          fontSize: "var(--text-xs)",
          color: "var(--color-muted)",
          lineHeight: "1.45",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {metric.label}
      </span>
    </div>
  );
}

// ─── PanelDivider ────────────────────────────────────────────────────────────

function PanelDivider() {
  return (
    <div
      aria-hidden
      style={{
        height: "1px",
        background: "var(--color-border-sub)",
        flexShrink: 0,
      }}
    />
  );
}

// ─── FooterStrip ─────────────────────────────────────────────────────────────

function FooterStrip({ count }) {
  return (
    <div
      className="flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between"
      style={{
        display: "flex",
        padding: "10px 20px",
        borderTop: "1px solid var(--color-border-sub)",
        background: "var(--color-surface-2)",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          color: "var(--color-faint)",
          letterSpacing: "0.06em",
        }}
      >
        {count} signals logged
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          color: "var(--color-faint)",
          letterSpacing: "0.06em",
        }}
      >
        2023 — present
      </span>
    </div>
  );
}
