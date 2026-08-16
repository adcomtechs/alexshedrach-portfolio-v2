// features/home/HeroSection/index.jsx
"use client";
//
// DEC-008 resolved: HeroSection requires a client boundary.
//
// Reasons:
//   1. useMouseParallax — window.addEventListener('mousemove') requires a DOM
//      reference unavailable at server render time.
//   2. HeroHeadline — useTypewriter manages character-level animation state.
//
// Scope: this boundary is contained to this section. All other page sections
// (SelectedSystemsSection, PrinciplesSection, ProofOfWorkSection) remain RSC.
//
// Sub-component boundaries:
//   AvailabilityBadge  — RSC (CSS animation only)
//   HeroHeadline       — client (typewriter state)
//   HeroCTA            — RSC (Button href renders as <a>)
//   SocialProof        — RSC (static metric display)
//   TechTicker         — client (ticker state machine)
//   StatusTerminal     — client (live clock)

import { Container } from "@/components/layout/Container";
import { Text } from "@/components/ui/Text";
import { useMouseParallax } from "@/hooks/useMouseParallax";

import { AvailabilityBadge } from "./AvailabilityBadge";
import { HeroHeadline } from "./HeroHeadline";
import { HeroCTA } from "./HeroCTA";
import { TechTicker } from "./TechTicker";
import { StatusTerminal } from "./StatusTerminal";

/**
 * HeroSection
 *
 * Establishes credibility within 10 seconds — the primary goal of the home page.
 * No scroll required for the positioning signal.
 *
 * Layout:
 *   Two-column on desktop: [Left: identity + CTAs | Right: StatusTerminal]
 *   Single column on mobile: stacked
 *   Full-width below: TechTicker
 *
 * Background layer:
 *   Static dot grid (CSS background-image)
 *   Two ambient glows that follow cursor via parallax
 *   Both are aria-hidden and pointer-events-none
 */
export function HeroSection() {
  const parallax = useMouseParallax(20);

  return (
    <section aria-label="Introduction" className="relative overflow-hidden">
      {/* ── Background layer ─────────────────────────────────────────────────
          Purely decorative. aria-hidden prevents AT from reading these elements.
          pointer-events-none prevents these from intercepting mouse events.
      ─────────────────────────────────────────────────────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Dot grid — masked to fade at the bottom edge */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.35,
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          }}
        />

        {/* Primary accent glow — top-left, follows cursor at 50% speed */}
        <div
          className="absolute -top-24 -left-32 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{
            background: "var(--color-accent)",
            opacity: 0.055,
            transform: `translate(${parallax.x * 0.5}px, ${parallax.y * 0.5}px)`,
            transition: "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            willChange: "transform",
          }}
        />

        {/* Secondary info glow — bottom-right, counter-parallax at 30% speed */}
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{
            background: "var(--color-info)",
            opacity: 0.03,
            transform: `translate(${-parallax.x * 0.3}px, ${-parallax.y * 0.3}px)`,
            transition: "transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
            willChange: "transform",
          }}
        />
      </div>

      {/* ── Hero body ────────────────────────────────────────────────────────
          Sits above the TechTicker. pt-16 clears the sticky nav.
      ─────────────────────────────────────────────────────────────────────── */}
      <div className="relative pt-16 pb-10">
        <Container size="wide">
          {/*
            Two-column grid:
              Mobile  — single column, stacked
              Desktop — [1fr left] [360px right]

            `items-start` prevents the right column from stretching to match
            the left column height when the terminal card is shorter.
          */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-16 items-start">
            {/* ── Left column: identity, copy, CTAs, proof ──────────────── */}
            <div className="flex flex-col gap-7 lg:gap-8">
              {/* 1. Status signal — 0ms entrance */}
              <AvailabilityBadge />

              {/* 2. Headline — 80ms entrance, typewriter on line 2 */}
              <HeroHeadline />

              {/* 3. Description — 140ms entrance */}
              {/*
                Text component handles typography. `strong` inside Text gets
                --color-fg with fontWeight 600 to lift the key phrase.
                "Hi, I'm Alex!" removed — the design system context and
                headline already establish identity. The description carries
                the value proposition, not a greeting.
              */}
              <Text
                size="lg"
                color="muted"
                className="text-center lg:text-left max-w-[520px] mx-auto lg:mx-0 hero-animate"
                style={{ animationDelay: "140ms" }}
              >
                Full-stack engineer specialising in production{" "}
                <strong style={{ color: "var(--color-fg)", fontWeight: 600 }}>
                  software for the African market.
                </strong>{" "}
                Spring Boot on the backend. Next.js on the front. Real
                problems, real deployments, real users.
              </Text>

              {/* 4. CTAs — 200ms entrance */}
              <HeroCTA />

              {/* 5. Social proof — 260ms entrance */}
              {/* <SocialProof /> */}
            </div>

            {/* ── Right column: live activity terminal ───────────────────── */}
            {/*
              aspect-[4/4.5] maintains the card's proportions on mobile.
              max-w-[520px] caps width on large screens.
              lg:ml-auto pushes the terminal to the right edge of its column.
            */}
            <div className="relative w-full aspect-[4/4.5] max-w-[520px] mx-auto lg:mx-0 lg:ml-auto">
              <StatusTerminal />
            </div>
          </div>
        </Container>
      </div>

      {/* ── TechTicker — full-width, below hero body ─────────────────────── */}
      <TechTicker />
    </section>
  );
}

export default HeroSection;
