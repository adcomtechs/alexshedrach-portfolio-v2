// features/home/HeroSection/HeroHeadline.jsx
"use client";
//
// Client boundary is required: useTypewriter manages character-level string
// state that cannot be computed server-side.
//
// The Heading component is used for the h1 — not raw Tailwind type classes.
// The typewriter span is a visual overlay with an aria-hidden + sr-only split
// to keep screen reader output clean while the visual text animates.

import { Heading } from "@/components/ui/Heading";
import { useTypewriter } from "@/hooks/useTypewriter";

// Typewriter lines — complete the thought "I build real systems."
// Each line is a short, specific, falsifiable signal. Not motivational filler.
const ROLES = [
  "Shipped to production.",
  "No demos. Only products.",
  "Architecture first.",
];

/**
 * HeroHeadline
 *
 * Two-line heading:
 *   Line 1 — "I build real systems." (static)
 *   Line 2 — Cycling typewriter line (accent color)
 *
 * The static line establishes the identity claim.
 * The typewriter line qualifies it with a rotating engineering signal.
 *
 * Entrance: hero-animate at 80ms delay — after AvailabilityBadge.
 */
export function HeroHeadline() {
  const { text: typedRole, showCursor } = useTypewriter(ROLES, {
    typeSpeed: 72,
    eraseSpeed: 42,
    holdMs: 2600,
    startDelayMs: 900,
  });

  return (
    <div
      className="hero-animate text-center lg:text-left"
      style={{ animationDelay: "80ms" }}
    >
      <Heading as="h1" size="display" balance>
        {/* Static identity line */}I build real systems.{" "}
        {/* Typewriter line — accent color, cycles through ROLES */}
        <span
          className="block mt-1 text-3xl"
          // Screen reader always reads the first role — never the animated partial string
          aria-label={ROLES[0]}
        >
          {/* Visual typewriter output — aria-hidden keeps AT away from partial strings */}
          <span
            aria-hidden="true"
            style={{
              color: "var(--color-accent)",
              display: "inline-block",
              minWidth: "2ch", // Prevents layout collapse when text is empty
            }}
          >
            {typedRole}
            {/* Cursor — blinks independently of the typewriter state */}
            <span
              aria-hidden="true"
              style={{
                opacity: showCursor ? 1 : 0,
                transition: "opacity 0.1s",
                marginLeft: "2px",
                fontWeight: 300,
              }}
            >
              |
            </span>
          </span>
        </span>
      </Heading>
    </div>
  );
}
