"use client";

// features/home/TestimonialsSection/index.jsx
//
// Client component — carousel state requires useState/useEffect.
//
// WHY THIS IS ITS OWN SECTION:
//   PrinciplesSection communicates how you think — ideas, rules, reasoning.
//   TestimonialsSection communicates that others have verified those ideas
//   in real work. These are different claims requiring different visual
//   identities. Merging them into one section dilutes both arguments.
//
// VISUAL IDENTITY — "Editorial / Grounded"
//   PrinciplesSection owns: atmospheric dual-color radial glows (luminous, alive)
//   This section owns:      horizontal-rule grid + single warm bottom glow (settled, human)
//
//   The contrast is intentional. Principles feel like thinking; testimonials
//   feel like evidence. Atmospheric vs grounded. Ideas vs people.
//
// LAYOUT:
//   SectionBackground   — horizontal lines + single warm glow (bottom-center)
//   SectionLabel        — "PROOF OF WORK" mono ticker strip
//   SectionHeader       — title + description
//   TestimonialsCarousel — 2 cards per slide, auto-advance, keyboard/touch
//   ClosingStatement    — tagline + CTA to /projects
//
// DATA:
//   PHILOSOPHY_TESTIMONIALS and ACCENT_TOKENS from @/data/philosophy
//   4 testimonials → 2 slides of 2 cards each
//   Replace placeholder entries in data/philosophy.js before going live.
//
// HOOKS:
//   useCarousel     — local, carousel-specific state machine
//   usePrefersReducedMotion — shared hook, suppresses auto-advance

import { useState, useEffect, useRef, useCallback, memo, useId } from "react";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseBold } from "@/lib/utils";
import { PHILOSOPHY_TESTIMONIALS, ACCENT_TOKENS } from "@/lib/data/philosophy";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CARDS_PER_SLIDE = 2;
const SLIDE_DURATION = 5000;

// ─────────────────────────────────────────────────────────────────────────────
// useCarousel
//
// Local hook — not shared because no other component in the project uses
// this exact carousel engine (fixed card count, auto-advance, loop).
//
// State machine:
//   slide          — current slide index (0-based)
//   animatingRef   — guard against slide-change collisions during transition
//   intervalRef    — handle for the auto-advance timer
//   slideRef       — always-current slide index accessible inside closures
//
// The advance() function is the single mutation point for slide state.
// All public methods (prev, next, goToSlide) call advance().
// ─────────────────────────────────────────────────────────────────────────────

function useCarousel(totalItems, itemsPerSlide, autoInterval) {
  const totalSlides = Math.ceil(totalItems / itemsPerSlide);
  const [slide, setSlide] = useState(0);
  const reduced = usePrefersReducedMotion();
  const intervalRef = useRef(null);
  const animatingRef = useRef(false);
  const slideRef = useRef(slide);

  useEffect(() => {
    slideRef.current = slide;
  }, [slide]);

  const advance = useCallback((targetIndex) => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    setSlide(targetIndex);
    setTimeout(() => {
      animatingRef.current = false;
    }, 560);
  }, []);

  const goToSlide = useCallback(
    (index) => {
      if (index !== slideRef.current) advance(index);
    },
    [advance],
  );

  const prev = useCallback(
    () => advance(Math.max(0, slideRef.current - 1)),
    [advance],
  );

  const next = useCallback(
    () => advance((slideRef.current + 1) % totalSlides),
    [advance, totalSlides],
  );

  const stopAuto = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const startAuto = useCallback(() => {
    if (reduced) return;
    stopAuto();
    intervalRef.current = setInterval(
      () => advance((slideRef.current + 1) % totalSlides),
      autoInterval,
    );
  }, [reduced, totalSlides, autoInterval, advance, stopAuto]);

  // Start on mount, stop on unmount
  useEffect(() => {
    startAuto();
    return stopAuto;
  }, [startAuto, stopAuto]);

  // Pause when tab is hidden — avoids runaway timer in background tabs
  useEffect(() => {
    const handler = () => (document.hidden ? stopAuto() : startAuto());
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [startAuto, stopAuto]);

  return {
    currentSlide: slide,
    totalSlides,
    goToSlide,
    prev,
    next,
    progressKey: slide,
    stopAuto,
    startAuto,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION BACKGROUND
//
// Visual identity: horizontal-rule grid + single warm bottom-center glow.
//
// Deliberately distinct from PrinciplesSection's dual radial glow.
//   PrinciplesSection: atmospheric, luminous, two-color diagonal energy field
//   TestimonialsSection: editorial, settled, warm single source at the base
//
// The horizontal lines reinforce the "evidence / documented" feeling —
// they read as ruled paper, as lines of text, as record-keeping.
// The warm bottom glow grounds the section and prevents it reading as cold.
// ─────────────────────────────────────────────────────────────────────────────

function SectionBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Horizontal ruled lines — full width, spaced like writing paper */}
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
          opacity: 0.35,
        }}
      />

      {/* Warm accent glow — bottom-center, fades upward */}
      {/* Position at base creates a "grounded" reading vs top glows which read "floating" */}
      <div
        className="absolute rounded-full blur-[160px]"
        style={{
          width: "70%",
          height: "60%",
          bottom: "-20%",
          left: "15%",
          background: "var(--color-accent)",
          opacity: 0.04,
        }}
      />

      {/* Radial vignette — darkens the corners so ruled lines don't compete with cards */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, var(--color-bg) 100%)",
          opacity: 0.6,
        }}
      />

      {/* Noise texture — same treatment as PrinciplesSection at matching opacity */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
          opacity: 0.015,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION LABEL STRIP
//
// A slim bordered strip above the main header.
// The "PROOF OF WORK" label uses the same mono ticker pattern as
// SectionLabel in philosophy-section.jsx — visual language consistency.
//
// "Proof of work" means exactly what it says: cryptographic-style verification
// that real work was done. The term works on two levels here — software and
// engineering credibility. It is a stronger frame than "testimonials."
// ─────────────────────────────────────────────────────────────────────────────

function SectionLabelStrip() {
  return (
    <div
      className="border-y border-[var(--color-border-sub)] mb-16"
      style={{
        background: "color-mix(in srgb, var(--color-surface) 80%, transparent)",
      }}
    >
      <Container>
        <div
          className="flex items-center gap-3 py-3"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-faint)",
          }}
        >
          {/* Accent prefix — matches philosophy-section.jsx section label */}
          <span style={{ color: "var(--color-accent)", fontWeight: 700 }}>
            {"//"}
          </span>
          <span>Proof of work</span>

          {/* Repeating dots fill — adds visual rhythm without extra components */}
          <span
            aria-hidden="true"
            className="hidden md:block flex-1 overflow-hidden"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, var(--color-border-sub) 0, var(--color-border-sub) 1px, transparent 1px, transparent 12px)",
              height: "1px",
              marginTop: "1px",
            }}
          />

          {/* Count — number of testimonials, right-aligned */}
          <span
            className="hidden md:block ml-auto"
            style={{ color: "var(--color-faint)" }}
          >
            {String(PHILOSOPHY_TESTIMONIALS.length).padStart(2, "0")} entries
          </span>
        </div>
      </Container>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIAL CARD
//
// Extracted from philosophy-section.jsx — identical visual output.
// Accent tokens (color, bg, border) come from ACCENT_TOKENS keyed by
// the testimonial's `accent` field.
//
// Structure:
//   Top accent bar  — thin gradient line above the card
//   Ambient glow    — radial blob behind the card content, matching accent
//   Opening quote   — large decorative glyph, low opacity
//   Quote body      — italic, parseBold() for **bold** markers
//   Author footer   — initials badge + name + role
// ─────────────────────────────────────────────────────────────────────────────

const TestimonialCard = memo(function TestimonialCard({ testimonial }) {
  const tokens = ACCENT_TOKENS[testimonial.accent] ?? ACCENT_TOKENS.accent;

  return (
    <article
      className="relative flex flex-col w-[50%] flex-shrink-0 min-h-[320px] overflow-hidden"
      style={{
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border-sub)",
        borderTop: "1px solid var(--color-border-sub)",
      }}
      aria-label={`Testimonial from ${testimonial.name}`}
    >
      {/* Top accent bar */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, ${tokens.text}55, transparent)`,
        }}
      />

      {/* Ambient glow behind content */}
      <div
        aria-hidden="true"
        className="absolute -top-16 -left-16 w-56 h-56 rounded-full pointer-events-none"
        style={{
          background: tokens.text,
          opacity: 0.04,
          filter: "blur(40px)",
        }}
      />

      <div className="relative flex flex-col gap-5 h-full p-8 pt-10">
        {/* Opening quote glyph — decorative, suppressed from AT */}
        <div
          aria-hidden="true"
          className="select-none leading-none"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "3rem",
            lineHeight: 1,
            color: tokens.text,
            opacity: 0.2,
          }}
        >
          &ldquo;
        </div>

        {/* Quote body */}
        <p
          className="flex-1 italic"
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-muted)",
            lineHeight: "var(--leading-relaxed)",
          }}
        >
          {parseBold(testimonial.quote)}
        </p>

        {/* Author footer */}
        <footer
          className="flex items-center gap-3 pt-4"
          style={{ borderTop: "1px solid var(--color-border-sub)" }}
        >
          {/* Initials badge */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: tokens.bg,
              border: `1px solid ${tokens.border}`,
              color: tokens.text,
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "var(--text-xs)",
            }}
            aria-hidden="true"
          >
            {testimonial.initials}
          </div>

          <div className="flex flex-col gap-0.5 min-w-0">
            <span
              className="truncate"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-sm)",
                fontWeight: 700,
                color: "var(--color-fg)",
              }}
            >
              {testimonial.name}
            </span>
            <span
              className="truncate"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-faint)",
              }}
            >
              {testimonial.role}
            </span>
          </div>
        </footer>
      </div>
    </article>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// CAROUSEL SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ProgressBar
 * Full-width 1px line below the control bar.
 * Animates from left to right over SLIDE_DURATION using a CSS animation.
 * key={progressKey} resets the animation on every slide change.
 */
function ProgressBar({ progressKey, duration }) {
  return (
    <div
      aria-hidden="true"
      className="w-full h-px"
      style={{ background: "var(--color-border-sub)" }}
    >
      <div
        key={progressKey}
        className="h-full w-0 progress-running"
        style={{
          background: "var(--color-accent-dim)",
          opacity: 0.6,
          "--slide-duration": `${duration}ms`,
        }}
      />
    </div>
  );
}

/**
 * ArrowButton
 * Prev/next navigation button. Inline style mutation on hover avoids
 * Tailwind variant limitations for dynamic colour tokens.
 */
function ArrowButton({ direction, onClick, disabled, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center border",
        "transition-all duration-150 active:scale-95",
        "focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2",
        "disabled:opacity-25 disabled:cursor-not-allowed",
      )}
      style={{
        background: "var(--color-surface-2)",
        borderColor: "var(--color-border)",
        color: "var(--color-muted)",
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        e.currentTarget.style.background = "var(--color-accent-bg)";
        e.currentTarget.style.borderColor = "rgba(181,242,61,0.4)";
        e.currentTarget.style.color = "var(--color-accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--color-surface-2)";
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.color = "var(--color-muted)";
      }}
    >
      {direction === "prev" ? (
        <ArrowLeft size={13} aria-hidden="true" />
      ) : (
        <ArrowRight size={13} aria-hidden="true" />
      )}
    </button>
  );
}

/**
 * SlideIndicators
 * Dot/pill navigation below the carousel viewport.
 * Active slide: wide pill (1.25rem × 0.375rem), accent color.
 * Inactive: small dot (0.375rem × 0.375rem), border color.
 */
function SlideIndicators({ totalSlides, currentSlide, onSelect }) {
  return (
    <div
      role="tablist"
      aria-label="Testimonial slide indicators"
      className="flex items-center justify-center gap-2 py-4 border-t border-[var(--color-border-sub)]"
    >
      {Array.from({ length: totalSlides }).map((_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === currentSlide}
          aria-label={`Go to slide ${i + 1} of ${totalSlides}`}
          onClick={() => onSelect(i)}
          className="rounded-full border-0 p-0 cursor-pointer transition-[background,width] duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2"
          style={
            i === currentSlide
              ? {
                  width: "1.25rem",
                  height: "0.375rem",
                  background: "var(--color-accent)",
                }
              : {
                  width: "0.375rem",
                  height: "0.375rem",
                  background: "var(--color-border)",
                }
          }
          onMouseEnter={(e) => {
            if (i !== currentSlide)
              e.currentTarget.style.background = "var(--color-faint)";
          }}
          onMouseLeave={(e) => {
            if (i !== currentSlide)
              e.currentTarget.style.background = "var(--color-border)";
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS CAROUSEL
//
// Wraps useCarousel + all carousel sub-components into a single unit.
// Keyboard navigation: ArrowLeft/ArrowRight when the viewport is focused.
// Touch navigation: swipe gesture (40px minimum threshold).
// Screen reader: aria-live announcer reports the visible slide range.
// Visibility: auto-advance pauses on tab hide, resumes on tab focus.
// Hover: auto-advance pauses on mouse enter, resumes on mouse leave.
// ─────────────────────────────────────────────────────────────────────────────

function TestimonialsCarousel() {
  const regionId = useId();
  const announcerRef = useRef(null);
  const touchStartX = useRef(0);

  const {
    currentSlide,
    totalSlides,
    goToSlide,
    prev,
    next,
    progressKey,
    stopAuto,
    startAuto,
  } = useCarousel(
    PHILOSOPHY_TESTIMONIALS.length,
    CARDS_PER_SLIDE,
    SLIDE_DURATION,
  );

  // Screen reader announcement on slide change
  useEffect(() => {
    if (!announcerRef.current) return;
    const from = currentSlide * CARDS_PER_SLIDE + 1;
    const to = Math.min(
      (currentSlide + 1) * CARDS_PER_SLIDE,
      PHILOSOPHY_TESTIMONIALS.length,
    );
    announcerRef.current.textContent = `Showing testimonials ${from}–${to} of ${PHILOSOPHY_TESTIMONIALS.length}`;
  }, [currentSlide]);

  // Keyboard: ArrowLeft / ArrowRight
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        stopAuto();
        prev();
        startAuto();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        stopAuto();
        next();
        startAuto();
      }
    },
    [prev, next, stopAuto, startAuto],
  );

  // Touch: horizontal swipe
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback(
    (e) => {
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) < 40) return;
      stopAuto();
      diff > 0 ? next() : prev();
      startAuto();
    },
    [next, prev, stopAuto, startAuto],
  );

  const translateX = currentSlide * CARDS_PER_SLIDE * 50;

  return (
    <section
      aria-labelledby={`${regionId}-heading`}
      style={{ borderTop: "1px solid var(--color-border-sub)" }}
    >
      <h2 id={`${regionId}-heading`} className="sr-only">
        Testimonials from collaborators
      </h2>

      {/* Screen reader live region */}
      <div
        ref={announcerRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* ── Control bar ──────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-6 py-3"
        style={{
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border-sub)",
        }}
      >
        {/* Left label */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-faint)",
          }}
        >
          <span
            style={{ color: "var(--color-accent)", marginRight: "0.5rem" }}
            aria-hidden="true"
          >
            {"//"}
          </span>
          Collaborator feedback
        </span>

        {/* Right: counter + arrows */}
        <div className="flex items-center gap-3">
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--color-faint)",
            }}
          >
            {String(currentSlide + 1).padStart(2, "0")} /{" "}
            {String(totalSlides).padStart(2, "0")}
          </span>
          <ArrowButton
            direction="prev"
            onClick={() => {
              stopAuto();
              prev();
              startAuto();
            }}
            disabled={currentSlide === 0}
            label="Previous testimonials"
          />
          <ArrowButton
            direction="next"
            onClick={() => {
              stopAuto();
              next();
              startAuto();
            }}
            disabled={false}
            label="Next testimonials"
          />
        </div>
      </div>

      {/* Auto-advance progress bar */}
      <ProgressBar progressKey={progressKey} duration={SLIDE_DURATION} />

      {/* ── Card viewport ────────────────────────────────────────────────── */}
      <div
        className="overflow-hidden"
        onMouseEnter={stopAuto}
        onMouseLeave={startAuto}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
        role="region"
        aria-label="Testimonials carousel — use arrow keys to navigate"
      >
        <div
          className="flex"
          style={{
            transform: `translateX(-${translateX}%)`,
            transition: "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
            willChange: "transform",
          }}
        >
          {PHILOSOPHY_TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </div>

      {/* Dot / pill navigation */}
      <SlideIndicators
        totalSlides={totalSlides}
        currentSlide={currentSlide}
        onSelect={(i) => {
          stopAuto();
          goToSlide(i);
          startAuto();
        }}
      />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CLOSING STATEMENT
//
// The final element of the section — and the natural handoff to the
// projects section that follows in the page flow.
//
// Structure:
//   Tagline — principle summary, left-aligned, display font
//   CTA     — "Explore the projects" button linking to /projects
//
// DESIGN DECISION:
//   The tagline is left-aligned + CTA right-aligned on desktop (space-between).
//   This creates a natural reading line: you read the statement left to right
//   and your eye lands on the button at the far right — a flow that encourages
//   the click without forcing it.
//
// The copy connects testimonials → projects:
//   "Principles are easy to state. Projects are where they are tested."
//   This bridges the two sections cleanly without an abrupt topic change.
// ─────────────────────────────────────────────────────────────────────────────

function ClosingStatement() {
  return (
    <div
      className="border-t border-[var(--color-border-sub)]"
      style={{
        background: "color-mix(in srgb, var(--color-surface) 60%, transparent)",
      }}
    >
      <Container>
        <div className="flex items-center justify-between gap-6 py-8 flex-wrap">
          {/* Tagline */}
          <div className="flex flex-col gap-1 max-w-md">
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-base)",
                fontWeight: 700,
                color: "var(--color-fg)",
                lineHeight: "var(--leading-snug)",
              }}
            >
              Principles without shipped work are just opinions.
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                color: "var(--color-muted)",
                lineHeight: "var(--leading-relaxed)",
              }}
            >
              The case studies are where the reasoning becomes concrete.
            </p>
          </div>

          {/* CTA */}
          <Button href="/projects" variant="glow" size="lg" pill>
            Explore the projects
            <ArrowRight size={15} aria-hidden="true" />
          </Button>
        </div>
      </Container>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT EXPORT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * TestimonialsSection
 *
 * Homepage section: "Proof of Work"
 *
 * Follows PrinciplesSection in the page order.
 * Its job: verify from outside voices that the principles stated in the
 * previous section are observable in real work — not just claimed.
 *
 * Visual register: editorial + grounded (contrast with PrinciplesSection's
 * atmospheric + floating identity).
 *
 * Replace placeholder testimonials in data/philosophy.js before going live.
 * See the TESTIMONIAL REPLACEMENT GUIDE at the bottom of that file.
 */
export function TestimonialsSection() {
  return (
    <Section
      spacing="xl"
      id="testimonials"
      aria-label="Proof of work — collaborator feedback"
      className="relative"
    >
      <SectionBackground />

      {/* Section label strip — above the main header */}
      {/* <SectionLabelStrip /> */}

        {/* ── Section header ───────────────────────────────────────────── */}
      {/* <Container size="wide" className="relative">
        <SectionHeader
          label="From people who've seen it"
          title="What they say about the work"
          description="Principles are easy to state. These are the people who watched
            them applied in real constraints, real codebases, and real deadlines."
          align="center"
          size="lg"
        />
      </Container> */}

      {/* ── Carousel — full width, no Container padding ──────────────── */}
      {/*
        Rendered outside Container deliberately — the card viewport should
        bleed to the full section width on desktop for maximum visual impact.
        The control bar and slide indicators use their own internal padding.
      */}
      <TestimonialsCarousel />

      {/* ── Closing statement + CTA ──────────────────────────────────── */}
      {/* <ClosingStatement /> */}
    </Section>
  );
}

export default TestimonialsSection;

// Named sub-component exports — available for testing or composition elsewhere
export {
  TestimonialCard,
  ArrowButton,
  ProgressBar,
  SlideIndicators,
  ClosingStatement,
  SectionLabelStrip,
  TestimonialsCarousel,
};
