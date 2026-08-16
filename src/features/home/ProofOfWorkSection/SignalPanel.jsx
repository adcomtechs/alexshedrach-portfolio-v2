// features/home/ProofOfWork/SignalPanel.jsx
// RSC — no client directive required.
//
// Right panel of the open-book layout. Evidence log + footnote.
// This is the "readable side" of the book — prose where the left panel is data.
//
// The category badge on each signal entry identifies how the adjacent metric
// was verified: architecture fact | tested behaviour | design target.
// This directly addresses the credibility question without extra explanation.

import { Text } from "@/components/ui/Text";

// ─── Category badge config ────────────────────────────────────────────────────────
//
// Each category maps to a semantic color token so the classification
// reads at a glance without requiring the footnote.

const categoryConfig = {
  architecture: {
    label: "architecture fact",
    color: "var(--color-info)",
    bg: "var(--color-info-bg)",
  },
  "tested behaviour": {
    label: "tested behaviour",
    color: "var(--color-success)",
    bg: "var(--color-success-bg)",
  },
  "design target": {
    label: "design target",
    color: "var(--color-warning)",
    bg: "var(--color-warning-bg)",
  },
};

// ─── SignalPanel ──────────────────────────────────────────────────────────────────

export function SignalPanel({ signals, footnote }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--color-surface)",
      }}
    >
      {/* Panel header */}
      <HeaderBar count={signals.length} />

      {/* Signal log entries — fills available height */}
      <div style={{ flex: 1 }}>
        {signals.map((signal, i) => (
          <SignalEntry
            key={i}
            signal={signal}
            last={i === signals.length - 1}
          />
        ))}
      </div>

      {/* Footnote — pinned to bottom of panel */}
      <Footnote text={footnote} />
    </div>
  );
}

// ─── HeaderBar ───────────────────────────────────────────────────────────────────

function HeaderBar({ count }) {
  return (
    <div
      className="gap-2"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 20px",
        borderBottom: "1px solid var(--color-border-sub)",
        background: "var(--color-surface-2)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          color: "var(--color-faint)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        signal log
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          color: "var(--color-faint)",
          letterSpacing: "0.06em",
        }}
      >
        {count} entries
      </span>
    </div>
  );
}

// ─── SignalEntry ─────────────────────────────────────────────────────────────────
//
// Each entry is structured as:
//   [check icon] [project name]   [category badge]
//   [evidence text]
//
// The check communicates confirmation. The category badge tells the reader
// how the adjacent metric was verified. Project name anchors the claim.

function SignalEntry({ signal, last }) {
  const category =
    categoryConfig[signal.category] ?? categoryConfig.architecture;

  return (
    <div
      className="px-4 py-4 sm:px-5"
      style={{
        borderBottom: last ? "none" : "1px solid var(--color-border-sub)",
      }}
    >
      {/* Entry header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
          flexWrap: "wrap",
        }}
      >
        {/* Check mark */}
        <span
          aria-hidden
          style={{
            color: "var(--color-accent)",
            fontSize: "var(--text-sm)",
            fontWeight: 700,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ✓
        </span>

        {/* Project name */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-fg)",
            fontWeight: 600,
            letterSpacing: "0.03em",
          }}
        >
          {signal.project}
        </span>

        {/* Category badge */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: category.color,
            background: category.bg,
            border: `1px solid ${category.color}22`,
            borderRadius: "4px",
            padding: "1px 6px",
            letterSpacing: "0.04em",
            textTransform: "lowercase",
            lineHeight: "1.6",
          }}
        >
          {category.label}
        </span>
      </div>

      {/* Evidence text */}
      <Text color="muted">
        {signal.text}
      </Text>
    </div>
  );
}

// ─── Footnote ────────────────────────────────────────────────────────────────────
//
// Pinned to the bottom of the panel. Matches the header bar aesthetic
// for visual closure — the panel reads as a bounded document.

function Footnote({ text }) {
  return (
    <div
      className="px-4 py-3 sm:px-5"
      style={{
        borderTop: "1px solid var(--color-border-sub)",
        background: "var(--color-surface-2)",
      }}
    >
      <Text size="sm" color="faint">
        {text}
      </Text>
    </div>
  );
}
