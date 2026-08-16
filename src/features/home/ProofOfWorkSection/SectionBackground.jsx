// features/home/ProofOfWorkSection/SectionBackground.jsx
// RSC — no client directive required.
//
// Visual identity for ProofOfWork: cold, precise, single-source.
// One centered --color-info radial that reads as a measurement instrument
// lit from within — opposed to the warm lime/emerald field of PrinciplesSection.
//
// Three layers:
//   1. Outer wide glow   — atmosphere, sets the cold temperature
//   2. Inner tight glow  — the "hot spot" — a focused light source
//   3. Scan line grid    — horizontal rule pattern, engineering instrument motif
//
// All layers are aria-hidden and pointer-events-none.
// No animation — this section is deliberately still.

export function SectionBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Layer 1 — wide outer glow. Sets cold blue ambient temperature. */}
      <div
        className="absolute rounded-full"
        style={{
          width: "80%",
          height: "90%",
          top: "5%",
          left: "10%",
          background: "var(--color-info)",
          opacity: 0.04,
          filter: "blur(180px)",
        }}
      />

      {/* Layer 2 — tight inner hot spot. Creates depth against the wide glow. */}
      <div
        className="absolute rounded-full"
        style={{
          width: "32%",
          height: "38%",
          top: "30%",
          left: "34%",
          background: "var(--color-info)",
          opacity: 0.028,
          filter: "blur(80px)",
        }}
      />

      {/* Layer 3 — scan line grid. Horizontal rules at 40px intervals.
          Masked to fade at all four edges — never clips visibly.
          Evokes a monitoring dashboard / oscilloscope aesthetic.
          Extremely low opacity: present but never distracting. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(96,165,250,0.03) 39px, rgba(96,165,250,0.03) 40px)",
          maskImage:
            "radial-gradient(ellipse 75% 70% at 50% 50%, black 30%, transparent 100%)",
        }}
      />
    </div>
  );
}
