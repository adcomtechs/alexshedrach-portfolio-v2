"use client";
// features/home/ProofOfWork/ScreenshotCarousel.jsx
//
// DESIGN:
//   Each slide shows two project screenshots stacked vertically — equal height,
//   equal width, filling the carousel area exactly. A 1px divider separates them.
//   Each image half has its own inline label overlay (project name + category badge).
//
// TRANSITIONS — "directional crossfade":
//   Slides are absolutely stacked. On navigation:
//     Exiting slide → opacity 0 + slight translateX in exit direction (−24px fwd / +24px back)
//     Entering slide → arrives from opposite side (+24px fwd / −24px back), settles to 0
//   Both animate simultaneously → smooth, directional crossfade with depth.
//   Duration: 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)
//
// PROGRESS BAR:
//   2px accent-colored bar at the top. Fills linearly over AUTO_MS.
//   Resets instantly on any navigation via React key prop.
//   Pauses on hover/focus. Resumes on leave/blur.
//
// TOUCH:
//   touchstart/touchend delta threshold: 45px — swipe left/right to navigate.
//
// SLIDE GROUPING:
//   Projects are grouped into pairs → each slide shows 2 stacked screenshots.
//   Odd project count → last slide top image only; bottom slot renders EmptySlot.
//
// ACCESSIBILITY:
//   role="region" + aria-label, aria-live on label, keyboard ← →, aria-current on dots.

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import Image from "next/image";

// ─── Constants ────────────────────────────────────────────────────────────────

const TRANSITION_MS = 500;
const AUTO_MS = 4500;
const SWIPE_THRESHOLD = 45;
const TRANSITION_EASING = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
const SLIDE_OFFSET = "24px";

// ─── Per-project placeholder palettes ────────────────────────────────────────

const PALETTES = {
  attendiq: { from: "#0f2a1c", to: "#071410", accent: "#22c55e" },
  vendacore: { from: "#0f1e2a", to: "#070e14", accent: "#60a5fa" },
  gradeforge: { from: "#1c0f2a", to: "#0e0714", accent: "#a78bfa" },
  ledgera: { from: "#2a1e0f", to: "#14100a", accent: "#f59e0b" },
  scholarsync: { from: "#0f2a2a", to: "#071414", accent: "#2dd4bf" },
};

// ─── Category badge colors — kept in sync with SignalPanel.jsx ───────────────

const CATEGORY_COLORS = {
  "architecture fact": {
    color: "var(--color-info)",
    bg: "rgba(96,165,250,0.12)",
  },
  "tested behaviour": {
    color: "var(--color-success)",
    bg: "rgba(34,197,94,0.12)",
  },
  "design target": {
    color: "var(--color-warning)",
    bg: "rgba(245,158,11,0.12)",
  },
};

// ─── Utility ─────────────────────────────────────────────────────────────────

function groupIntoSlides(projects) {
  const slides = [];
  for (let i = 0; i < projects.length; i += 2) {
    slides.push({
      id: `slide-${i}`,
      top: projects[i],
      bottom: projects[i + 1] ?? null,
    });
  }
  return slides;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

// ─── ScreenshotCarousel ──────────────────────────────────────────────────────

export function ScreenshotCarousel({ projects }) {
  const slides = useMemo(() => groupIntoSlides(projects), [projects]);
  const total = slides.length;

  const [current, setCurrent] = useState(0);
  const [exiting, setExiting] = useState(-1);
  const [dir, setDir] = useState(1); // 1 = forward, -1 = back
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAuto, setIsAuto] = useState(true);

  const touchStartX = useRef(null);

  // ── Navigation ────────────────────────────────────────────────────────────

  const navigate = useCallback(
    (nextIndex, direction) => {
      if (isTransitioning || nextIndex === current) return;
      setDir(direction);
      setExiting(current);
      setIsTransitioning(true);
      setCurrent(nextIndex);

      setTimeout(() => {
        setExiting(-1);
        setIsTransitioning(false);
      }, TRANSITION_MS + 60); // slight buffer over transition duration
    },
    [current, isTransitioning],
  );

  const goNext = useCallback(
    () => navigate((current + 1) % total, 1),
    [current, total, navigate],
  );
  const goPrev = useCallback(
    () => navigate((current - 1 + total) % total, -1),
    [current, total, navigate],
  );
  const goTo = useCallback(
    (i) => navigate(i, i > current ? 1 : -1),
    [current, navigate],
  );

  // ── Auto-advance ──────────────────────────────────────────────────────────
  // setTimeout (not setInterval) — naturally re-arms after each navigation
  // and avoids stale-closure drift.

  useEffect(() => {
    if (!isAuto) return;
    const timer = setTimeout(goNext, AUTO_MS);
    return () => clearTimeout(timer);
  }, [current, isAuto, goNext]);

  // ── Touch ─────────────────────────────────────────────────────────────────

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (touchStartX.current === null) return;
      const delta = touchStartX.current - e.changedTouches[0].clientX;
      touchStartX.current = null;
      if (Math.abs(delta) < SWIPE_THRESHOLD) return;
      setIsAuto(false);
      delta > 0 ? goNext() : goPrev();
    },
    [goNext, goPrev],
  );

  // ── Keyboard ──────────────────────────────────────────────────────────────

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowRight") {
        setIsAuto(false);
        goNext();
      }
      if (e.key === "ArrowLeft") {
        setIsAuto(false);
        goPrev();
      }
    },
    [goNext, goPrev],
  );

  return (
    <div
      role="region"
      aria-label="Project screenshot carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsAuto(false)}
      onMouseLeave={() => setIsAuto(true)}
      onFocus={() => setIsAuto(false)}
      onBlur={() => setIsAuto(true)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "var(--color-surface-2)",
        outline: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {/* ── Progress bar ── */}
      <ProgressBar
        key={current} // remounts on every slide change → resets animation
        duration={AUTO_MS}
        active={isAuto}
      />

      {/* ── Slide stack ── */}
      {slides.map((slide, i) => {
        const isActive = i === current;
        const isExiting = i === exiting;
        if (!isActive && !isExiting) return null; // unmount hidden slides from DOM

        return (
          <SlidePanel
            key={slide.id}
            slide={slide}
            isActive={isActive}
            isExiting={isExiting}
            dir={dir}
          />
        );
      })}

      {/* ── Bottom overlay: slide counter + dot nav ── */}
      <BottomOverlay
        current={current}
        total={total}
        onSelect={(i) => {
          setIsAuto(false);
          goTo(i);
        }}
      />

      {/* ── Arrow buttons ── */}
      <ArrowButton
        direction="left"
        onClick={() => {
          setIsAuto(false);
          goPrev();
        }}
      />
      <ArrowButton
        direction="right"
        onClick={() => {
          setIsAuto(false);
          goNext();
        }}
      />
    </div>
  );
}

// ─── ProgressBar ─────────────────────────────────────────────────────────────
//
// Mounts at width 0, transitions to 100% over `duration` ms.
// React key on the parent resets this component on every slide change.
// `active` pauses via a CSS custom property trick — width stays frozen
// when not active by setting transition-duration to 0 on the paused state.

function ProgressBar({ duration, active }) {
  const [started, setStarted] = useState(false);

  // Defer start by one frame so the CSS transition fires after mount.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setStarted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        background: "rgba(255,255,255,0.08)",
        zIndex: 10,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          background: "var(--color-accent)",
          width: started && active ? "100%" : "0%",
          transition: started && active ? `width ${duration}ms linear` : "none",
          transformOrigin: "left",
        }}
      />
    </div>
  );
}

// ─── SlidePanel ──────────────────────────────────────────────────────────────
//
// Absolutely positioned — all slides occupy the same space.
//
// States:
//   active  → opacity 1, translateX 0
//   exiting → opacity 0, translateX(dir === 1 ? −SLIDE_OFFSET : +SLIDE_OFFSET)
//
// Entering slide (active) arrives from the opposite offset:
//   On first render as active, it starts at the offset and transitions to 0.
//   This is achieved by reading `isExiting === false && isActive === true` as
//   the entering condition — the initial inline style is the start position,
//   and the transition moves it to the settled position.

function SlidePanel({ slide, isActive, isExiting, dir }) {
  // The exiting slide moves away in the direction of travel.
  // The entering slide arrives from the opposite side.
  const exitTranslate = dir === 1 ? `-${SLIDE_OFFSET}` : SLIDE_OFFSET;
  const enterTranslate = dir === 1 ? SLIDE_OFFSET : `-${SLIDE_OFFSET}`;

  // On mount as entering: start offset, settle to 0 via transition.
  // This requires a one-frame delay before applying the "settled" state.
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    const raf = requestAnimationFrame(() => setSettled(true));
    return () => cancelAnimationFrame(raf);
  }, [isActive]);

  let opacity = 1;
  let translateX = "0px";

  if (isExiting) {
    opacity = 0;
    translateX = exitTranslate;
  } else if (isActive && !settled) {
    opacity = 0;
    translateX = enterTranslate;
  }

  return (
    <div
      aria-hidden={!isActive}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        opacity,
        transform: `translateX(${translateX})`,
        transition: `opacity ${TRANSITION_MS}ms ${TRANSITION_EASING}, transform ${TRANSITION_MS}ms ${TRANSITION_EASING}`,
        willChange: "opacity, transform",
        // Exiting slides sit behind entering ones
        zIndex: isActive ? 2 : 1,
      }}
    >
      {/* Top image slot */}
      <ImageSlot project={slide.top} position="top" />

      {/* 1px slot divider */}
      <div
        aria-hidden
        style={{
          height: "1px",
          background: "var(--color-border-sub)",
          flexShrink: 0,
        }}
      />

      {/* Bottom image slot — EmptySlot if no second project */}
      {slide.bottom ? (
        <ImageSlot project={slide.bottom} position="bottom" />
      ) : (
        <EmptySlot />
      )}
    </div>
  );
}

// ─── ImageSlot ───────────────────────────────────────────────────────────────
//
// Exactly half the carousel height. Contains:
//   - Screenshot image (or PlaceholderSlide)
//   - Bottom gradient scrim
//   - Project name + category badge (bottom-left of each slot, above scrim)

function ImageSlot({ project, position }) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Image / placeholder */}
      {project.screenshot ? (
        <Image
          src={project.screenshot}
          alt={`${project.name} — project screenshot`}
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          style={{
            objectFit: "cover",
            objectPosition: "top center",
          }}
          draggable={false}
        />
      ) : (
        <PlaceholderSlide project={project} />
      )}

      {/* Gradient scrim — bottom 60px of each slot */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60px",
          background:
            "linear-gradient(to top, rgba(11,11,12,0.88) 0%, rgba(11,11,12,0.4) 60%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Slot label — project name + category badge */}
      <div
        aria-live={position === "top" ? "polite" : "off"}
        aria-atomic="true"
        className="max-w-[calc(100%-24px)] flex-wrap"
        style={{
          position: "absolute",
          bottom: "8px",
          left: "12px",
          display: "flex",
          alignItems: "center",
          gap: "7px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "0.04em",
            overflowWrap: "anywhere",
          }}
        >
          {project.name}
        </span>
        <CategoryBadge category={project.category} />
      </div>
    </div>
  );
}

// ─── EmptySlot ───────────────────────────────────────────────────────────────
//
// Shown when a slide has only one project (odd total count).
// Subtle — communicates "nothing here" without looking broken.

function EmptySlot() {
  return (
    <div
      aria-hidden
      style={{
        flex: 1,
        minHeight: 0,
        background: "var(--color-surface-2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          color: "var(--color-faint)",
          letterSpacing: "0.06em",
        }}
      >
        more projects incoming
      </span>
    </div>
  );
}

// ─── PlaceholderSlide ────────────────────────────────────────────────────────

function PlaceholderSlide({ project }) {
  const pal = PALETTES[project.id] ?? {
    from: "#1a1a2a",
    to: "#0b0b14",
    accent: "var(--color-accent)",
  };

  return (
    <div
      aria-hidden
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(145deg, ${pal.from} 0%, ${pal.to} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
      }}
    >
      <PlaceholderGrid accent={pal.accent} />
    </div>
  );
}

function PlaceholderGrid({ accent }) {
  return (
    <svg
      width="160"
      height="88"
      viewBox="0 0 160 88"
      fill="none"
      aria-hidden
      style={{ opacity: 0.22 }}
    >
      {/* Browser chrome bar */}
      <rect
        x="0"
        y="0"
        width="160"
        height="14"
        rx="3"
        fill={accent}
        opacity="0.4"
      />
      <circle cx="8" cy="7" r="3" fill={accent} opacity="0.7" />
      <circle cx="17" cy="7" r="3" fill={accent} opacity="0.7" />
      <circle cx="26" cy="7" r="3" fill={accent} opacity="0.7" />
      <rect
        x="36"
        y="4"
        width="80"
        height="6"
        rx="3"
        fill={accent}
        opacity="0.2"
      />
      {/* Content skeleton rows */}
      <rect
        x="0"
        y="22"
        width="72"
        height="5"
        rx="2"
        fill={accent}
        opacity="0.5"
      />
      <rect
        x="0"
        y="32"
        width="144"
        height="3"
        rx="2"
        fill={accent}
        opacity="0.25"
      />
      <rect
        x="0"
        y="39"
        width="128"
        height="3"
        rx="2"
        fill={accent}
        opacity="0.25"
      />
      <rect
        x="0"
        y="46"
        width="108"
        height="3"
        rx="2"
        fill={accent}
        opacity="0.25"
      />
      {/* Card placeholders */}
      <rect
        x="0"
        y="56"
        width="46"
        height="28"
        rx="4"
        fill={accent}
        opacity="0.13"
      />
      <rect
        x="54"
        y="56"
        width="46"
        height="28"
        rx="4"
        fill={accent}
        opacity="0.13"
      />
      <rect
        x="108"
        y="56"
        width="46"
        height="28"
        rx="4"
        fill={accent}
        opacity="0.13"
      />
    </svg>
  );
}

// ─── BottomOverlay ───────────────────────────────────────────────────────────
//
// Sits above the bottom of the entire carousel (not each slot).
// Contains: slide counter (left) + dot nav (right).
// Positioned at z-index 5 — above slide panels and scrim.

function BottomOverlay({ current, total, onSelect }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "10px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 5,
        // Subtle full-width scrim just for the overlay row
        background:
          "linear-gradient(to top, rgba(11,11,12,0.6) 0%, transparent 100%)",
        pointerEvents: "none", // container is non-interactive — children override
      }}
    >
      {/* Slide counter */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.08em",
          pointerEvents: "none",
        }}
      >
        {pad(current + 1)} / {pad(total)}
      </span>

      {/* Dot nav */}
      <DotNav total={total} current={current} onSelect={onSelect} />
    </div>
  );
}

// ─── DotNav ──────────────────────────────────────────────────────────────────
//
// Active dot expands to pill (16px). Shape communicates position — not color alone.
// WCAG 1.4.1 compliant.

function DotNav({ total, current, onSelect }) {
  return (
    <div
      role="tablist"
      aria-label="Slide position"
      style={{
        display: "flex",
        gap: "5px",
        alignItems: "center",
        pointerEvents: "all",
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === current}
          aria-current={i === current ? "true" : undefined}
          aria-label={`Slide ${i + 1} of ${total}`}
          onClick={() => onSelect(i)}
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "99px",
            border: "none",
            padding: 0,
            cursor: "pointer",
            background: "transparent",
            outline: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = "2px solid var(--color-accent)";
            e.currentTarget.style.outlineOffset = "3px";
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = "none";
          }}
        >
          <span
            aria-hidden
            style={{
              width: i === current ? "16px" : "5px",
              height: "5px",
              borderRadius: "99px",
              background:
                i === current
                  ? "var(--color-accent)"
                  : "rgba(255,255,255,0.3)",
              transition: `width 300ms ${TRANSITION_EASING}, background 200ms ease`,
            }}
          />
        </button>
      ))}
    </div>
  );
}

// ─── ArrowButton ─────────────────────────────────────────────────────────────
//
// Positioned at vertical center of the carousel, not each slot.
// Frosted glass treatment — consistent with the design system's glass variant.

function ArrowButton({ direction, onClick }) {
  const isLeft = direction === "left";

  return (
    <button
      aria-label={isLeft ? "Previous slide" : "Next slide"}
      onClick={onClick}
      style={{
        position: "absolute",
        top: "50%",
        [isLeft ? "left" : "right"]: "10px",
        transform: "translateY(-50%)",
        zIndex: 6,
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(11,11,12,0.5)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        color: "rgba(255,255,255,0.7)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        fontSize: "13px",
        lineHeight: 1,
        transition:
          "background 180ms ease, border-color 180ms ease, color 180ms ease, transform 180ms ease",
        // Arrow buttons are subtle at rest; hover reveals them
        opacity: 1,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.background = "rgba(11,11,12,0.82)";
        el.style.borderColor = "rgba(255,255,255,0.25)";
        el.style.color = "rgba(255,255,255,0.95)";
        el.style.transform = `translateY(-50%) scale(1.08)`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = "rgba(11,11,12,0.5)";
        el.style.borderColor = "rgba(255,255,255,0.12)";
        el.style.color = "rgba(255,255,255,0.7)";
        el.style.transform = "translateY(-50%) scale(1)";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "translateY(-50%) scale(0.94)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "translateY(-50%) scale(1.08)";
      }}
    >
      {isLeft ? "‹" : "›"}
    </button>
  );
}

// ─── CategoryBadge ───────────────────────────────────────────────────────────

function CategoryBadge({ category }) {
  const style =
    CATEGORY_COLORS[category] ?? CATEGORY_COLORS["architecture fact"];

  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
        color: style.color,
        background: style.bg,
        borderRadius: "3px",
        padding: "2px 5px",
        letterSpacing: "0.05em",
        textTransform: "lowercase",
        lineHeight: 1.6,
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {category}
    </span>
  );
}
