// components/ui/SectionBackground/SectionBackground.jsx
// RSC — no client directive required.
//
// Purely presentational — aria-hidden, pointer-events-none.
// Absolutely positioned to fill its nearest relative ancestor.
// Every page section that uses this must set position: relative on its wrapper.
//
// RENDERING ORDER (back to front):
//   1. Lines         — horizontal ruled pattern (editorial)
//   2. Grid          — technical crosshatch (grid)
//   3. Dots          — dot matrix at grid intersections (grid)
//   4. Mesh layers   — soft light blobs (mesh, aurora, luminous, spotlight, radiant)
//   5. Primary glow  — single positioned glow (editorial, grid)
//   6. Gradient overlay — directional sweep (mesh, aurora, luminous, spotlight)
//   7. Vignette      — edge darkening (all)
//   8. Top accent line — hero boundary marker (mesh, aurora, spotlight)
//   9. Noise         — grain texture (all)
//
// The order is deliberate: structural patterns render first, atmospheric
// layers render over them, and noise texture renders last over everything.

import { cn } from "@/lib/utils";
import { SECTION_BACKGROUND_VARIANTS, NOISE_TEXTURE } from "./variants";

/**
 * SectionBackground
 *
 * Drop this as the first child of any relative-positioned section wrapper.
 * The variant prop selects the full visual character of the section.
 *
 * @param {"minimal"|"editorial"|"luminous"|"grid"|"mesh"|"aurora"|"spotlight"|"radiant"} variant
 * @param {string}  className    - Passthrough for absolute positioning overrides.
 * @param {number}  noiseOpacity - Override the variant's default noise opacity.
 * @param {boolean} glow         - Set false to suppress the primary glow layer.
 */
export function SectionBackground({
  variant = "minimal",
  className,
  noiseOpacity,
  glow = true,
}) {
  const config =
    SECTION_BACKGROUND_VARIANTS[variant] ?? SECTION_BACKGROUND_VARIANTS.minimal;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {/* ── 1. Lines ──────────────────────────────────────────────────────────
          Horizontal ruled lines — full section width, spaced like writing paper.
          The 47px/1px rhythm creates approximately 18–19 lines per 900px section.
          editorial variant only. */}
      {config.lines && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(" +
              "to bottom," +
              "transparent," +
              "transparent 47px," +
              "var(--color-border-sub) 47px," +
              "var(--color-border-sub) 48px" +
              ")",
            opacity: `calc(${config.linesOpacity ?? 0.35} * var(--ambient-line-opacity))`,
          }}
        />
      )}

      {/* ── 2. Grid ───────────────────────────────────────────────────────────
          Technical crosshatch — equal horizontal and vertical 48px spacing.
          grid variant only. */}
      {config.grid && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: [
              "linear-gradient(to right, var(--color-border-sub) 1px, transparent 1px)",
              "linear-gradient(to bottom, var(--color-border-sub) 1px, transparent 1px)",
            ].join(", "),
            backgroundSize: `${config.dotSpacing ?? 48}px ${config.dotSpacing ?? 48}px`,
            opacity: `calc(${config.gridOpacity ?? 0.08} * var(--ambient-line-opacity))`,
          }}
        />
      )}

      {/* ── 3. Dots ───────────────────────────────────────────────────────────
          Dot matrix at grid intersection points. Renders over the grid lines
          so the dots appear to sit AT the intersections — circuit board nodes.
          Uses repeating radial gradient; dot size and spacing match the grid. */}
      {config.dots && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, var(--color-border-sub) ${config.dotSize ?? 1}px, transparent ${config.dotSize ?? 1}px)`,
            backgroundSize: `${config.dotSpacing ?? 48}px ${config.dotSpacing ?? 48}px`,
            opacity: `calc(${config.dotsOpacity ?? 0.25} * var(--ambient-line-opacity))`,
          }}
        />
      )}

      {/* ── 4. Mesh layers ────────────────────────────────────────────────────
          Multiple soft light blobs positioned precisely per variant config.
          Each layer is a large blurred circle. Layers composite over each other
          creating color mixing where they overlap — the source of chromatic depth. */}
      {config.meshLayers?.map((layer, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: layer.width,
            height: layer.height,
            top: layer.top,
            bottom: layer.bottom,
            left: layer.left,
            right: layer.right,
            background: layer.background,
            opacity: `calc(${layer.opacity} * var(--ambient-glow-opacity))`,
            filter: `blur(${layer.blur})`,
          }}
        />
      ))}

      {/* ── 5. Primary glow ───────────────────────────────────────────────────
          Single positioned glow — editorial and grid variants.
          Suppressed when the `glow` prop is false (e.g., when the section
          already has strong content contrast and the glow would compete). */}
      {config.glow && glow && (
        <div
          className="absolute rounded-full"
          style={{
            width: config.glow.width,
            height: config.glow.height,
            top: config.glow.top,
            bottom: config.glow.bottom,
            left: config.glow.left,
            right: config.glow.right,
            background: config.glow.background,
            opacity: `calc(${config.glow.opacity} * var(--ambient-glow-opacity))`,
            filter: `blur(${config.glow.blur})`,
          }}
        />
      )}

      {/* ── 6. Gradient overlay ───────────────────────────────────────────────
          Directional CSS gradient layered over the mesh.
          Creates sweep, flow, and directional reading motion.
          At low opacity (2–3%) it's invisible individually but contributes
          to the overall luminance field in a way that ties mesh layers together. */}
      {config.gradientOverlay && (
        <div
          className="absolute inset-0"
          style={{
            background: config.gradientOverlay,
            opacity: `calc(${config.gradientOverlayOpacity ?? 1} * var(--ambient-glow-opacity))`,
          }}
        />
      )}

      {/* ── 7. Vignette ───────────────────────────────────────────────────────
          Pulls edges toward the bg color. Used by all variants.
          The gradient shape (circle vs ellipse) and center position differ
          per variant — this is the primary differentiator between how sections
          feel even when their mesh layers are similar. */}
      {config.vignette && (
        <div
          className="absolute inset-0"
          style={{
            background: config.vignetteBackground,
            opacity: `calc(${config.vignetteOpacity ?? 0.6} * var(--ambient-vignette-opacity))`,
          }}
        />
      )}

      {/* ── 8. Top accent line ────────────────────────────────────────────────
          A 1px glowing gradient bar along the very top edge of the section.
          Creates a precise, clean boundary at the top of hero sections.
          The gradient fades to transparent at both ends — never a hard edge.
          mesh, aurora, spotlight variants. */}
      {config.topAccentLine && (
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: "1px",
            background:
              "linear-gradient(to right, transparent 0%, var(--color-accent) 30%, var(--color-accent) 70%, transparent 100%)",
            opacity: config.topAccentLineOpacity ?? 0.35,
          }}
        />
      )}

      {/* ── 9. Noise ──────────────────────────────────────────────────────────
          Organic grain texture — the last layer rendered, over everything else.
          Prevents the background from reading as flat digital gradients.
          mixBlendMode: overlay means it brightens lights and darkens darks,
          adding micro-texture without shifting the overall hue. */}
      {config.noise && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: NOISE_TEXTURE,
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
            opacity: `calc(${noiseOpacity ?? config.noiseOpacity ?? 0.015} * var(--ambient-noise-opacity))`,
            mixBlendMode: "overlay",
          }}
        />
      )}
    </div>
  );
}
