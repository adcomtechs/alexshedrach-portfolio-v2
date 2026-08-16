'use client'; 

import { useEffect, useRef, useCallback, memo, useId } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PHILOSOPHY_TESTIMONIALS } from "@/lib/data/philosophy";
import { TestimonialCard } from "./ui/Cards/TestimonialCard";
import { useCarousel } from "@/hooks/useCarousel";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CARDS_PER_SLIDE = 2;
const SLIDE_DURATION = 5000;

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

export function TestimonialsCarousel() {
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
