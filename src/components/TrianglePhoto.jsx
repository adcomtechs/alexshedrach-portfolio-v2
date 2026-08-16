import React from "react";



// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

/**
 * TriangleFrame — the geometric SVG decoration.
 *
 * LEARNING POINT:
 * SVG `polygon` draws a shape by connecting a list of x,y points.
 * `fill="none"` means the inside is transparent.
 * `stroke` sets the outline color.
 * `strokeLinejoin="round"` softens the sharp corners slightly.
 *
 * The viewBox="0 0 500 480" defines the internal coordinate space.
 * points="250,10 490,460 10,460" draws an equilateral-ish triangle:
 *   - Top apex:    (250, 10)   — center-top
 *   - Bottom-left: (10,  460)  — far left
 *   - Bottom-right:(490, 460)  — far right
 */
function TriangleFrame() {
  return (
    <svg
      viewBox="0 0 500 480"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
      focusable="false"
    >
      <polygon
        points="250,10 490,465 10,465"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Triangle + Photo ──────────── */

/*
    LEARNING POINT — How the layering works:
    The outer div has `position: relative` (via Tailwind's `relative`).
    This creates a "positioning context" — all children with
    `position: absolute` are positioned relative to this div.

    Layer stack (back to front):
    z-0 → SVG triangle (behind everything)
    z-10 → Photo rectangle (on top of triangle)

    The photo rectangle is inset from all sides so the triangle
    peeks out above (apex) and at the bottom corners.

    `aspect-[4/4.5]` gives the container a tall-square shape so
    the triangle isn't squished.
*/

function TrianglePhoto() {
  return (
    <div className="relative w-full aspect-[4/4.5] max-w-[520px] mx-auto lg:mx-0 lg:ml-auto">
      {/* Layer 0: Triangle — behind everything */}
      <div className="absolute inset-0 z-0">
        <TriangleFrame />
      </div>

      {/*
                Layer 1: Photo — on top of triangle.

                Insets:
                  left/right: ~12% from each side (so triangle corners show)
                  top: ~14% (so triangle apex shows above photo)
                  bottom: 0 (photo sits flush with bottom, corners poke out)

                Replace the placeholder div below with:
                <img
                  src="/images/alex-headshot.jpg"
                  alt="Alex Shedrach — Full-Stack Engineer"
                  className="w-full h-full object-cover object-top"
                />
              */}
      <div
        className="absolute z-10 overflow-hidden"
        style={{
          top: "14%",
          left: "12%",
          right: "12%",
          bottom: "0",
        }}
      >
        {/* ── PHOTO PLACEHOLDER ── Replace with <img> ── */}
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-3"
          style={{
            background:
              "linear-gradient(135deg, var(--color-surface-2) 0%, var(--color-surface) 100%)",
            border: "1px dashed var(--color-border)",
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
            style={{
              background: "var(--color-accent-bg)",
              color: "var(--color-accent)",
              border: "2px solid rgba(181,242,61,0.3)",
            }}
          >
            AS
          </div>
          <p
            className="text-xs text-center px-4"
            style={{ color: "var(--color-faint)" }}
          >
            Replace with your headshot photo
            <br />
            <code
              className="text-[10px]"
              style={{ color: "var(--color-accent)", opacity: 0.7 }}
            >
              /public/images/alex.jpg
            </code>
          </p>
        </div>
        {/* ── END PLACEHOLDER ──────────────────────── */}
      </div>

      {/*
                Decorative: small inverted triangle below main section.
                Jonas has a small downward-pointing triangle at the bottom
                of his page as a decorative element. Optional — remove if unused.
              */}
      <div aria-hidden="true" className="absolute -bottom-6 right-4 opacity-20">
        <svg width="24" height="21" viewBox="0 0 24 21">
          <polygon
            points="12,20 1,1 23,1"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

export default TrianglePhoto;
