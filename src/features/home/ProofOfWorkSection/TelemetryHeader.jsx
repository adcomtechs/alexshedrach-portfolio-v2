// features/home/ProofOfWorkSection/TelemetryHeader.jsx
// RSC — no client directive required.
//
// The telemetry panel header. Reads as a live monitoring dashboard bar:
//   Left  — pulsing status dot + system identifier string
//   Right — measurement date range
//
// "sys.output · alexshedrach.dev · verified" is a real identifier —
// not decorative placeholder text. It communicates: this is output data,
// this is the source, and it has been verified against shipped work.
//
// The pulsing dot uses the status-pulse keyframe from animations.css.
// It is the only motion element in the entire section — intentional.
// A single pulse communicates "live system" without decorating the data.

export function TelemetryHeader() {
  return (
    <div
      className="flex items-center justify-between gap-4 px-6 py-3"
      style={{
        borderBottom: "1px solid var(--color-border-sub)",
        background: "var(--color-surface-2)",
      }}
    >
      {/* Left: pulsing status dot + system label */}
      <div className="flex items-center gap-2.5">
        {/* Pulsing dot — the only animated element in the section */}
        <span
          className="relative flex h-[7px] w-[7px] shrink-0"
          aria-hidden="true"
        >
          {/* Outer pulse ring */}
          <span
            className="absolute inline-flex h-full w-full rounded-full"
            style={{
              background: "var(--color-info)",
              opacity: 0.5,
              animation: "status-pulse 2.5s ease-in-out infinite",
            }}
          />
          {/* Inner solid dot */}
          <span
            className="relative inline-flex h-[7px] w-[7px] rounded-full"
            style={{ background: "var(--color-info)" }}
          />
        </span>

        {/* System identifier */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.5625rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-faint)",
            fontWeight: 600,
          }}
        >
          sys.output
          <span style={{ color: "var(--color-border)", margin: "0 6px" }}>
            ·
          </span>
          alexshedrach.dev
          <span style={{ color: "var(--color-border)", margin: "0 6px" }}>
            ·
          </span>
          <span style={{ color: "var(--color-info)", opacity: 0.8 }}>
            verified
          </span>
        </span>
      </div>

      {/* Right: measurement window */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.5625rem",
          letterSpacing: "0.07em",
          color: "var(--color-faint)",
        }}
      >
        2022 — present
      </span>
    </div>
  );
}
