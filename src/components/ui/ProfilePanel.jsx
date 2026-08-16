// features/about/ProfilePanel.jsx
// RSC — no client directive required.
//
// The left column of AboutTeaser. Manages the primary profile image and
// the content that appears below it — either the stat cards or a secondary
// image in a 3D floating presentation.
//
// The `mode` prop is the single switch:
//   "stats"   → Primary image + AboutStats below  [default]
//   "image"   → Primary image + secondary image below in 3D treatment
//
// ── Theming fix ──────────────────────────────────────────────────────────
// Every accent-colored highlight below (image gradient overlays, border
// lines, the shadow's accent edge, the left-face highlight strip) was
// previously a hardcoded rgba(181,242,61,X) — a dark-theme snapshot reused
// verbatim in light mode. Replaced with color-mix() against the live
// --color-accent token throughout.
//
// The ambient shadow stack was also simplified: instead of hand-tuning
// three black rgba layers, it now composes the existing --shadow-lg token
// (already theme-aware — softer/warmer in light mode, per themes.css) with
// a border ring and the accent edge highlight. Shorter, and correct by
// construction in both themes rather than by luck in one.
//
// What deliberately stayed literal: the surface vignette (white/black) and
// the ground shadow beneath the tilted card. Those simulate a physical
// light source and drop shadow on the photograph itself — not brand color
// — and conventionally stay theme-invariant the same way a modal backdrop
// scrim does. Forcing those through the token system would be solving a
// problem that isn't there.
//
// @param {string}  primarySrc    — Path to main profile image. Required.
// @param {string}  primaryAlt    — Alt text for primary image. Required.
// @param {string}  secondarySrc  — Path to secondary image. Required when mode="image".
// @param {string}  secondaryAlt  — Alt text for secondary image. This is a real
//                                  photograph of the site owner, not decoration —
//                                  always pass a meaningful value when mode="image";
//                                  the empty-string default below is a fallback for
//                                  genuinely decorative use only.
// @param {"stats"|"image"} mode  — Which content renders below the primary image.

import { AboutStats } from "@/features/about/AboutStats";
import Image from "next/image";

// ── PrimaryImage ───────────────────────────────────────────────────────────────

function PrimaryImage({ src, alt }) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      <Image
        src={src}
        alt={alt}
        width={320}
        height={380}
        sizes="(max-width: 768px) 100vw, 320px"
        priority
        className="block h-auto w-full object-cover object-top"
      />

      {/* Bottom gradient overlay — subtle accent glow at base */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{
          background:
            "linear-gradient(to top, color-mix(in srgb, var(--color-accent) 6%, transparent) 0%, transparent 100%)",
        }}
      />

      {/* Bottom border line — accent, fades at edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, color-mix(in srgb, var(--color-accent) 30%, transparent) 40%, color-mix(in srgb, var(--color-accent) 30%, transparent) 60%, transparent 95%)",
        }}
      />
    </div>
  );
}

// ── SecondaryImage ─────────────────────────────────────────────────────────────

/**
 * A second profile photograph rendered with a CSS 3D perspective transform —
 * a slight tilt that reads as a physical photograph placed at an angle.
 * CSS-only, no animation, no JavaScript.
 */
function SecondaryImage({ src, alt }) {
  return (
    <div
      className="relative ml-auto"
      style={{
        width: "88%",
        marginTop: "-20px", // overlaps the primary image — layered stack visual
        perspective: "700px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      <div
        style={{
          transform: "perspective(700px) rotateY(-8deg) rotateX(3deg) rotate(-1.5deg)",
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
          boxShadow: [
            "var(--shadow-lg)",
            "0 0 0 1px var(--color-border)",
            "-2px 0 0 0 color-mix(in srgb, var(--color-accent) 25%, transparent)",
          ].join(", "),
          borderRadius: "14px",
          overflow: "hidden",
          isolation: "isolate", // prevents shadow bleeding into the primary image
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={280}
          height={320}
          sizes="(max-width: 768px) 80vw, 280px"
          className="block h-auto w-full object-cover object-top"
        />

        {/* Left face accent — simulates the lit edge of a rotated card */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 top-0 w-1"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in srgb, var(--color-accent) 35%, transparent) 0%, color-mix(in srgb, var(--color-accent) 15%, transparent) 50%, transparent 100%)",
          }}
        />

        {/* Surface vignette — physical lighting simulation, intentionally
            theme-invariant (see file header). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)",
          }}
        />
      </div>

      {/* Ground shadow — physical drop shadow, intentionally theme-invariant */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-3 left-[5%] right-[5%] h-4 rounded-full"
        style={{
          background: "rgba(0,0,0,0.35)",
          filter: "blur(12px)",
          transform: "scaleY(0.4)",
        }}
      />
    </div>
  );
}

// ── ProfilePanel ───────────────────────────────────────────────────────────────

export function ProfilePanel({
  primarySrc,
  primaryAlt,
  secondarySrc,
  secondaryAlt = "",
  mode = "stats",
}) {
  return (
    <div className="flex flex-col gap-3">
      <PrimaryImage src={primarySrc} alt={primaryAlt} />

      {mode === "image" && secondarySrc ? (
        <SecondaryImage src={secondarySrc} alt={secondaryAlt} />
      ) : (
        <AboutStats />
      )}
    </div>
  );
}