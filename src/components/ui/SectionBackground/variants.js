// components/ui/SectionBackground/variants.js
//
// Visual identity system for all section backgrounds.
//
// DESIGN PHILOSOPHY
// ─────────────────
// Every variant is a deliberate character — not an arbitrary style.
// Each one answers: what does this section FEEL like, and why?
//
// The visual language uses three tools:
//   1. Mesh layers   — soft, large-radius light sources. Create atmospheric depth.
//   2. Hard overlays — gradient sweeps, grid lines, dot matrices. Create structure.
//   3. Vignette      — pulls edges to bg color. Creates focus and containment.
//
// Opacities are intentionally low throughout. The background should never
// compete with content — it should make content feel placed, not floating.
//
// VARIANT INVENTORY
// ─────────────────
// minimal    — Recedes entirely. Content-heavy sections. No visual competition.
// editorial  — Horizontal ruled lines + warm bottom glow. Evidence / documented.
// luminous   — Diagonal two-color energy field. Atmospheric / principles.
// grid       — Technical precision grid + dot intersections + centered glow.
// mesh       — Cinematic multi-layer mesh. Case study hero. Production-grade.
// aurora     — Maximum atmospheric drama. Home page hero. Five-layer mesh sweep.
// spotlight  — Single dramatic top-down light source. Feature / CTA sections.
// radiant    — Warm wide center glow. Contact / hire sections. Approachable.
//
// SECTION ASSIGNMENT (from DECISIONS.md)
// ───────────────────────────────────────
// /projects hero            → editorial
// /projects grid            → minimal
// /projects/[slug] hero     → mesh
// /projects/[slug] prose    → minimal
// testimonial blocks        → editorial
// home hero                 → aurora  (recommended)
// contact / hire section    → radiant (recommended)
// engineering principles    → luminous
// lab / experiments         → grid

// ── Noise texture ─────────────────────────────────────────────────────────────
//
// Used by all variants. Single definition, referenced by the component.
// SVG fractalNoise filter — creates organic grain without an image dependency.

export const NOISE_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")";

// ── Variant definitions ────────────────────────────────────────────────────────

export const SECTION_BACKGROUND_VARIANTS = {
  // ── minimal ─────────────────────────────────────────────────────────────────
  //
  // Character: invisible support.
  // Use: any section where content is dense and the background should disappear.
  // Technique: vignette only — pulls edge attention back to center content.
  // No glow, no lines, no pattern. Just depth.

  minimal: {
    vignette: true,
    vignetteBackground:
      "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, var(--color-bg) 100%)",
    vignetteOpacity: 0.4,
    noise: true,
    noiseOpacity: 0.012,
  },

  // ── editorial ───────────────────────────────────────────────────────────────
  //
  // Character: evidence. Documentation. The ruled page of a technical notebook.
  // Use: /projects index hero, testimonial sections.
  // Technique: horizontal ruled lines + warm single bottom glow + ellipse vignette.
  //   Lines evoke writing paper, record-keeping, structured thought.
  //   Warm glow at base grounds the section — reads "settled", not "floating".
  //   Ellipse vignette (not circle) lets the lines breathe at center.

  editorial: {
    lines: true,
    linesOpacity: 0.3,

    glow: {
      width: "70%",
      height: "60%",
      bottom: "-20%",
      left: "15%",
      background: "var(--color-accent)",
      opacity: 0.045,
      blur: "160px",
    },

    vignette: true,
    vignetteBackground:
      "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, var(--color-bg) 100%)",
    vignetteOpacity: 0.6,

    noise: true,
    noiseOpacity: 0.015,
  },

  // ── luminous ────────────────────────────────────────────────────────────────
  //
  // Character: ideas in motion. Diagonal energy. Two sources in tension.
  // Use: engineering principles sections, about page, philosophy content.
  // Technique: three-layer diagonal mesh. Accent top-left, success bottom-right,
  //   accent center creates a triangle of light that implies movement.
  //   Gradient sweep overlay ties the layers into a coherent directional flow.

  luminous: {
    meshLayers: [
      {
        width: "65%",
        height: "75%",
        top: "-15%",
        left: "-15%",
        background: "var(--color-accent)",
        opacity: 0.065,
        blur: "140px",
      },
      {
        width: "60%",
        height: "70%",
        bottom: "-20%",
        right: "-10%",
        background: "var(--color-success)",
        opacity: 0.05,
        blur: "130px",
      },
      {
        width: "45%",
        height: "45%",
        top: "30%",
        left: "28%",
        background: "var(--color-accent)",
        opacity: 0.02,
        blur: "170px",
      },
    ],

    gradientOverlay:
      "linear-gradient(135deg, rgba(181,242,61,0.015) 0%, transparent 50%, rgba(34,197,94,0.012) 100%)",

    vignette: true,
    vignetteBackground:
      "radial-gradient(ellipse 85% 70% at 20% 30%, transparent 20%, var(--color-bg) 100%)",
    vignetteOpacity: 0.55,

    noise: true,
    noiseOpacity: 0.018,
  },

  // ── grid ────────────────────────────────────────────────────────────────────
  //
  // Character: precision. Infrastructure. Systems under control.
  // Use: architecture diagrams, lab experiments, technical documentation.
  // Technique: fine grid overlay + dot intersections at grid nodes + centered
  //   ambient glow. The dots at intersections read as circuit board nodes or
  //   coordinate system points — immediately technical, immediately intentional.

  grid: {
    grid: true,
    gridOpacity: 0.1,

    dots: true,
    dotsOpacity: 0.22,
    dotSize: 1,
    dotSpacing: 48,

    glow: {
      width: "50%",
      height: "50%",
      top: "25%",
      left: "25%",
      background: "var(--color-accent)",
      opacity: 0.035,
      blur: "140px",
    },

    vignette: true,
    vignetteBackground:
      "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 25%, var(--color-bg) 100%)",
    vignetteOpacity: 0.6,

    noise: true,
    noiseOpacity: 0.014,
  },

  // ── mesh ────────────────────────────────────────────────────────────────────
  //
  // Character: cinematic depth. The hero of a case study deserves presence.
  // Use: /projects/[slug] case study hero. (DEC-020)
  // Technique: four mesh layers at strategic positions create a light field with
  //   apparent depth — the large soft accent top-left acts as the primary source,
  //   success mid-right as a counter-light, accent bottom as a bounce reflection,
  //   and a tight white highlight at center that creates apparent luminance.
  //   A directional sweep overlay ties the field into a single coherent scene.
  //   topAccentLine marks the section boundary with a precise accent edge.

  mesh: {
    meshLayers: [
      // Primary light source — large, soft, top-left
      {
        width: "75%",
        height: "85%",
        top: "-25%",
        left: "-15%",
        background: "var(--color-accent)",
        opacity: 0.08,
        blur: "150px",
      },
      // Counter-light — right side, success color creates chromatic depth
      {
        width: "60%",
        height: "70%",
        top: "10%",
        right: "-20%",
        background: "var(--color-success)",
        opacity: 0.055,
        blur: "130px",
      },
      // Bounce reflection — bottom, grounded warmth
      {
        width: "55%",
        height: "55%",
        bottom: "-20%",
        left: "20%",
        background: "var(--color-accent)",
        opacity: 0.04,
        blur: "180px",
      },
      // Central white luminance — creates apparent depth at focal point
      {
        width: "30%",
        height: "40%",
        top: "25%",
        left: "35%",
        background: "rgba(255,255,255,0.15)",
        opacity: 0.03,
        blur: "100px",
      },
    ],

    gradientOverlay:
      "linear-gradient(135deg, rgba(181,242,61,0.025) 0%, transparent 45%, rgba(34,197,94,0.018) 100%)",

    topAccentLine: true,
    topAccentLineOpacity: 0.35,

    vignette: true,
    vignetteBackground:
      "radial-gradient(ellipse 85% 85% at 30% 20%, transparent 10%, var(--color-bg) 100%)",
    vignetteOpacity: 0.55,

    noise: true,
    noiseOpacity: 0.02,
  },

  // ── aurora ──────────────────────────────────────────────────────────────────
  //
  // Character: the opening statement. Maximum atmospheric presence.
  //   Reserved for the primary portfolio hero — the first thing anyone sees.
  //   More expansive than mesh: five layers, wider coverage, higher opacity,
  //   a stronger accent line, and a sweep overlay that pulls the eye left-to-right
  //   in the direction of reading.
  // Use: home page hero. (Not a case study — the whole portfolio's entry point.)
  // Technique: five mesh layers covering the full section from multiple angles
  //   create a genuine sense of depth and environment — not just decoration.
  //   The dominant accent top-left and success top-right create a color field
  //   that frames content without obscuring it.

  aurora: {
    meshLayers: [
      // Dominant accent mass — sweeps from top-left, largest layer
      {
        width: "90%",
        height: "90%",
        top: "-35%",
        left: "-25%",
        background: "var(--color-accent)",
        opacity: 0.085,
        blur: "180px",
      },
      // Success counter-point — top-right, creates two-color field
      {
        width: "65%",
        height: "65%",
        top: "-15%",
        right: "-20%",
        background: "var(--color-success)",
        opacity: 0.065,
        blur: "140px",
      },
      // Mid-field accent — horizontal depth, left-of-center
      {
        width: "50%",
        height: "45%",
        top: "40%",
        left: "-5%",
        background: "var(--color-accent)",
        opacity: 0.03,
        blur: "160px",
      },
      // Bottom-right anchor — grounds the lower section
      {
        width: "60%",
        height: "50%",
        bottom: "-20%",
        right: "5%",
        background: "var(--color-success)",
        opacity: 0.035,
        blur: "150px",
      },
      // Central white luminance — brightest point, creates depth hierarchy
      {
        width: "35%",
        height: "45%",
        top: "20%",
        left: "30%",
        background: "rgba(255,255,255,0.12)",
        opacity: 0.04,
        blur: "120px",
      },
    ],

    // Directional sweep — left-to-right reading motion reinforcement
    gradientOverlay:
      "linear-gradient(125deg, rgba(181,242,61,0.03) 0%, transparent 40%, rgba(34,197,94,0.02) 75%, transparent 100%)",

    topAccentLine: true,
    topAccentLineOpacity: 0.45,

    vignette: true,
    vignetteBackground:
      "radial-gradient(ellipse 75% 80% at 25% 15%, transparent 8%, var(--color-bg) 100%)",
    vignetteOpacity: 0.5,

    noise: true,
    noiseOpacity: 0.02,
  },

  // ── spotlight ───────────────────────────────────────────────────────────────
  //
  // Character: focus. Singular attention. A product in a beam of light.
  // Use: feature callouts, CTA sections, "hire me" sections.
  // Technique: tall narrow mesh layer concentrated top-center creates a genuine
  //   spotlight cone — the light appears to come from directly above.
  //   The gradient overlay reinforces the top-down direction.
  //   topAccentLine marks where the light enters from.
  //   The tight vignette at 55% width keeps the spotlight effect contained.

  spotlight: {
    meshLayers: [
      // Spotlight cone — tall, narrow, top-center
      {
        width: "50%",
        height: "130%",
        top: "-65%",
        left: "25%",
        background: "var(--color-accent)",
        opacity: 0.07,
        blur: "90px",
      },
      // Ambient floor fill — very soft, wide, prevents total darkness at bottom
      {
        width: "80%",
        height: "55%",
        bottom: "-25%",
        left: "10%",
        background: "var(--color-accent)",
        opacity: 0.022,
        blur: "180px",
      },
    ],

    gradientOverlay:
      "linear-gradient(to bottom, rgba(181,242,61,0.03) 0%, transparent 55%)",

    topAccentLine: true,
    topAccentLineOpacity: 0.5,

    vignette: true,
    vignetteBackground:
      "radial-gradient(ellipse 55% 70% at 50% 0%, transparent 15%, var(--color-bg) 100%)",
    vignetteOpacity: 0.65,

    noise: true,
    noiseOpacity: 0.015,
  },

  // ── radiant ─────────────────────────────────────────────────────────────────
  //
  // Character: warmth. Openness. An invitation.
  // Use: contact sections, "available for work" callouts, hire me sections.
  //   Distinct from spotlight (which is focused from above).
  //   Radiant glows outward from the center — approachable, not dramatic.
  // Technique: single large, very soft, centered mesh layer.
  //   The vignette and glow work together: the glow pushes light from center,
  //   the vignette pulls the edges back — the result is a "breathing" quality.
  //   No gradient sweep, no accent line — this variant should feel calm.

  radiant: {
    meshLayers: [
      {
        width: "85%",
        height: "85%",
        top: "7.5%",
        left: "7.5%",
        background: "var(--color-accent)",
        opacity: 0.05,
        blur: "220px",
      },
    ],

    vignette: true,
    vignetteBackground:
      "radial-gradient(ellipse 55% 55% at 50% 50%, transparent 20%, var(--color-bg) 100%)",
    vignetteOpacity: 0.6,

    noise: true,
    noiseOpacity: 0.012,
  },
};
