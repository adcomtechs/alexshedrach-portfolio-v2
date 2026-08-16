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
// Secondary image 3D presentation:
//   The secondary image is rendered with a CSS 3D transform — a slight
//   perspective rotation on the Y and X axes. This creates a "floating
//   card" depth illusion without any animation or JavaScript.
//
//   Transform values:
//     perspective(700px) — sets the depth plane
//     rotateY(-8deg)     — tilts left edge toward viewer
//     rotateX(3deg)      — tips top slightly forward
//     rotate(-1.5deg)    — slight counter-clockwise rotation
//
//   The combination reads as a physical photograph placed at an angle on
//   a surface. It is distinctly different from the primary image without
//   being gimmicky. The shadow is directional — casts to the right and
//   down, consistent with the tilt.
//
//   Why this reads as professional:
//     - The transform angles are subtle, not dramatic — it is not a trick
//     - The box-shadow is multi-layered: lift shadow + ambient shadow + accent edge
//     - The image itself is slightly smaller than the primary — establishes hierarchy
//     - A thin accent border edge on the left face reinforces depth perception
//
// @param {string}  primarySrc    — Path to main profile image. Required.
// @param {string}  primaryAlt    — Alt text for primary image. Required.
// @param {string}  secondarySrc  — Path to secondary image. Required when mode="image".
// @param {string}  secondaryAlt  — Alt text for secondary image.
// @param {"stats"|"image"} mode  — Which content renders below the primary image.

import { AboutStats } from "@/features/about/AboutStats";
import Image from "next/image";


// ── PrimaryImage ───────────────────────────────────────────────────────────────

/**
 * PrimaryImage
 *
 * Main profile image. Full column width. Rounded corners.
 * A thin accent gradient overlays the bottom edge — creates a subtle
 * glow that connects the image to the content below it.
 */
function PrimaryImage({ src, alt }) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden">
      {/* Image */}
      <Image
        src={src}
        alt={alt}
        width={320}
        height={380}
        sizes="(max-width: 768px) 100vw, 320px"
        priority
        className="object-cover object-top"
        style={{
          display: "block",
          width: "100%",
          height: "auto",
        }}
      />

      {/* Bottom gradient overlay — subtle accent glow at base */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(181,242,61,0.06) 0%, transparent 100%)",
        }}
      />

      {/* Bottom border line — accent, fades at edges */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, rgba(181,242,61,0.3) 40%, rgba(181,242,61,0.3) 60%, transparent 95%)",
        }}
      />
    </div>
  );
}

// ── SecondaryImage ─────────────────────────────────────────────────────────────

/**
 * SecondaryImage
 *
 * A second profile photograph rendered with a CSS 3D perspective transform.
 * The tilt conveys a physical object placed at an angle — distinct from the
 * primary image's flat, direct presentation.
 *
 * Composition:
 *   - Slightly narrower than the primary (90% width, right-offset)
 *   - 3D rotation via perspective() + rotateY() + rotateX() + rotate()
 *   - Multi-layer shadow: directional lift + ambient spread + accent glow
 *   - Left face accent edge: thin vertical gradient that simulates
 *     the lit edge of a physically rotated card
 *   - Overlaps the primary image by ~16px via negative top margin —
 *     the two images read as a layered stack
 *
 * All effects are CSS-only. No animation. No JavaScript.
 */
function SecondaryImage({ src, alt }) {
  return (
    <div
      className="relative ml-auto"
      style={{
        width: "88%",
        // Overlap the primary image — layered stack visual
        marginTop: "-20px",
        // 3D transform container — needs perspective set on the wrapper
        // to establish the depth plane before the child transforms
        perspective: "700px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      {/* Transform wrapper — applies the 3D rotation */}
      <div
        style={{
          transform:
            "perspective(700px) rotateY(-8deg) rotateX(3deg) rotate(-1.5deg)",
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
          // Multi-layer box shadow:
          //   1. Directional lift shadow (matches tilt direction)
          //   2. Ambient spread (environmental light)
          //   3. Accent glow (accent color, very subtle)
          boxShadow: [
            "14px 18px 40px rgba(0,0,0,0.55)",
            "4px 6px 16px rgba(0,0,0,0.35)",
            "0 0 0 1px var(--color-border)",
            "-2px 0 0 0 rgba(181,242,61,0.25)",
          ].join(", "),
          borderRadius: "14px",
          overflow: "hidden",
          // Isolate stacking context — prevents glow bleeding into primary image
          isolation: "isolate",
        }}
      >
        {/* Image */}
        <Image
          src={src}
          alt={alt}
          width={280}
          height={320}
          sizes="(max-width: 768px) 80vw, 280px"
          className="object-cover object-top"
          style={{
            display: "block",
            width: "100%",
            height: "auto",
          }}
        />

        {/* Left face accent — simulates the lit edge of a rotated card */}
        {/* Positioned on the left edge, a thin gradient strip */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 bottom-0 w-1 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(181,242,61,0.35) 0%, rgba(181,242,61,0.15) 50%, transparent 100%)",
          }}
        />

        {/* Surface overlay — slight vignette to reinforce depth */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)",
          }}
        />
      </div>

      {/* Ground shadow — the shadow cast by the tilted card on the surface below */}
      {/* This is a separate blurred div below the image, not a box-shadow */}
      <div
        aria-hidden="true"
        className="absolute -bottom-3 left-[5%] right-[5%] h-4 rounded-full pointer-events-none"
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

/**
 * ProfilePanel
 *
 * Left column of AboutTeaser. Primary image always renders.
 * Content below switches based on the `mode` prop.
 *
 * @param {string}          primarySrc   — Required.
 * @param {string}          primaryAlt   — Required.
 * @param {string}          secondarySrc — Required when mode="image".
 * @param {string}          secondaryAlt — Defaults to empty string (decorative).
 * @param {"stats"|"image"} mode         — Defaults to "stats".
 */
export function ProfilePanel({
  primarySrc,
  primaryAlt,
  secondarySrc,
  secondaryAlt = "",
  mode = "stats",
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Primary image — always rendered */}
      <PrimaryImage src={primarySrc} alt={primaryAlt} />

      {/* Below-image content — switches on `mode` */}
      {mode === "image" && secondarySrc ? (
        <SecondaryImage src={secondarySrc} alt={secondaryAlt} />
      ) : (
        <AboutStats />
      )}
    </div>
  );
}
