// features/home/WritingSection/WritingBackground.jsx
// RSC — no client directive required.
//
// Amber → lime background treatment for the WritingSection.
// Extracted as a standalone component for two reasons:
//   1. Keeps the section index clean — visual decoration is isolated
//   2. ResourcesCallout shares the same color palette; if the gradient
//      treatment is ever unified, this is the single change point.
//
// Color sources (from themes.css):
//   --color-warning : #f59e0b  (amber)
//   --color-accent  : #b5f23d  (lime)
//
// Glow architecture:
//   Amber pool  — bottom-left, large, slow warm bloom
//   Lime pool   — top-right, slightly smaller, crisp counterpoint
//   Diagonal wash — full-bleed at 0.045 opacity, unifies the two pools
//   Top accent bar — 2px gradient line, full opacity, editorial signal
//
// Light mode: the same rgba values produce a warm dual-tint against
// --color-bg: #fafafa. Neither pool is visible as a block of colour —
// they read as warmth in the background, not paint on the surface.

export function WritingBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Diagonal gradient wash — amber bottom-left, lime top-right */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #f59e0b 0%, #b5f23d 100%)",
          opacity: 0.045,
        }}
      />

      {/* Amber pool — bottom-left, primary warm anchor */}
      <div
        className="absolute rounded-full blur-[140px]"
        style={{
          width: "65%",
          height: "80%",
          bottom: "-20%",
          left: "-12%",
          background: "var(--color-warning)",
          opacity: 0.1,
        }}
      />

      {/* Lime pool — top-right, cool editorial counterpoint */}
      <div
        className="absolute rounded-full blur-[120px]"
        style={{
          width: "50%",
          height: "65%",
          top: "-15%",
          right: "-8%",
          background: "var(--color-accent)",
          opacity: 0.08,
        }}
      />

      {/* Center blend — prevents visible seam between the two pools */}
      <div
        className="absolute rounded-full blur-[180px]"
        style={{
          width: "40%",
          height: "45%",
          top: "25%",
          left: "30%",
          background: "#d4b832",
          opacity: 0.025,
        }}
      />

      {/* Top accent bar — amber → lime → transparent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, #f59e0b 0%, #b5f23d 55%, transparent 100%)",
        }}
      />
    </div>
  );
}
