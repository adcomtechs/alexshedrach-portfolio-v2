"use client";
// features/home/ProofOfWork/ProjectCarousel.jsx
//
// WHY use client:
//   - scroll position tracking (onScroll → active dot)
//   - imperative scroll for dot navigation (scrollTo)
//   These are the only two interactive concerns. The rest is static.
//
// DESIGN:
//   Horizontal scroll-snap carousel. No JS-driven transitions —
//   native CSS scroll-snap gives smooth momentum scrolling on touch.
//   Dot navigation is JS-driven for accessibility (keyboard + click).
//
//   Cards are intentionally compact — this is a "signal strip" below
//   the evidence panels, not a second project index.
//
// ANIMATION:
//   Cards fade and slide up on mount via CSS keyframes (hero-fade-up from animations.css).
//   Each card gets a staggered delay so the strip reveals sequentially.
//   The carousel wrapper fades in after a short delay to let the panels settle first.

import { useRef, useState, useEffect, useCallback } from "react";
import { Text } from "@/components/ui/Text";
import { Tag } from "@/components/ui/Tag";

// ─── ProjectCarousel ─────────────────────────────────────────────────────────────

export function ProjectCarousel({ projects }) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Trigger mount animation after hydration
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Sync dot indicator with scroll position
  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.scrollWidth / projects.length;
    const scrolled = track.scrollLeft + cardWidth / 2;
    const index = Math.min(
      Math.floor(scrolled / cardWidth),
      projects.length - 1,
    );
    setActiveIndex(index);
  }, [projects.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Scroll to a specific card on dot click
  const scrollTo = useCallback(
    (index) => {
      const track = trackRef.current;
      if (!track) return;
      const cardWidth = track.scrollWidth / projects.length;
      track.scrollTo({ left: cardWidth * index, behavior: "smooth" });
    },
    [projects.length],
  );

  return (
    <div
      aria-label="Project signal strip"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s",
      }}
    >
      {/* Scroll track */}
      <div
        ref={trackRef}
        style={{
          display: "flex",
          gap: "12px",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
          paddingBottom: "4px", // prevents clipping of border-radius
          WebkitOverflowScrolling: "touch",
        }}
        // Hide scrollbar in Webkit
        className="[&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            mounted={mounted}
          />
        ))}
      </div>

      {/* Dot navigation */}
      <DotNav
        count={projects.length}
        active={activeIndex}
        onSelect={scrollTo}
      />
    </div>
  );
}

// ─── ProjectCard ─────────────────────────────────────────────────────────────────
//
// Compact signal card. Not a full ProjectCard (that lives in components/ui/Card) —
// this is scoped to the ProofOfWork section's carousel context.
//
// Anatomy:
//   [category badge]
//   [project name]     [metric value]
//   [tagline]
//   [stack tags]

function ProjectCard({ project, index, mounted }) {
  // Staggered slide-up on mount
  const delay = `${0.05 + index * 0.07}s`;

  return (
    <a
      href={`/projects/${project.slug}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        minWidth: "260px",
        maxWidth: "260px",
        padding: "20px",
        borderRadius: "12px",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        scrollSnapAlign: "start",
        textDecoration: "none",
        cursor: "pointer",
        // Mount animation — uses hero-fade-up from animations.css
        opacity: mounted ? 1 : 0,
        animation: mounted
          ? `hero-fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay} both`
          : "none",
        // Hover state — lift + accent border
        transition:
          "border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(181,242,61,0.3)";
        e.currentTarget.style.boxShadow = "var(--shadow-glow)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
      aria-label={`${project.name} — ${project.tagline}`}
    >
      {/* Category badge */}
      <CategoryBadge category={project.category} />

      {/* Name + metric */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-md)",
            fontWeight: 600,
            color: "var(--color-fg)",
            lineHeight: "var(--leading-snug)",
          }}
        >
          {project.name}
        </span>

        {/* Metric callout */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-lg)",
              fontWeight: 700,
              color: "var(--color-accent)",
              lineHeight: "var(--leading-tight)",
              letterSpacing: "var(--tracking-tight)",
            }}
          >
            {project.metric.value}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--color-faint)",
              letterSpacing: "0.03em",
              lineHeight: 1.3,
              maxWidth: "80px",
            }}
          >
            {project.metric.label}
          </div>
        </div>
      </div>

      {/* Tagline */}
      <Text size="sm" color="muted">
        {project.tagline}
      </Text>

      {/* Stack tags */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {project.stack.map((tech) => (
          <Tag key={tech}>{tech}</Tag>
        ))}
      </div>
    </a>
  );
}

// ─── CategoryBadge ───────────────────────────────────────────────────────────────
//
// Maps to the same category system as SignalPanel for visual consistency.

const categoryStyles = {
  "architecture fact": {
    color: "var(--color-info)",
    bg: "var(--color-info-bg)",
  },
  "tested behaviour": {
    color: "var(--color-success)",
    bg: "var(--color-success-bg)",
  },
  "design target": {
    color: "var(--color-warning)",
    bg: "var(--color-warning-bg)",
  },
};

function CategoryBadge({ category }) {
  const style = categoryStyles[category] ?? categoryStyles["architecture fact"];
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-xs)",
        color: style.color,
        background: style.bg,
        borderRadius: "4px",
        padding: "2px 7px",
        letterSpacing: "0.05em",
        textTransform: "lowercase",
        alignSelf: "flex-start",
      }}
    >
      {category}
    </span>
  );
}

// ─── DotNav ──────────────────────────────────────────────────────────────────────
//
// Accessible dot navigation. Active dot widens to a pill to communicate
// position without relying on color alone (WCAG 1.4.1 — Use of Color).

function DotNav({ count, active, onSelect }) {
  return (
    <div
      role="tablist"
      aria-label="Carousel position"
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "6px",
        marginTop: "16px",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === active}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => onSelect(i)}
          style={{
            width: i === active ? "20px" : "6px",
            height: "6px",
            borderRadius: "99px",
            border: "none",
            padding: 0,
            cursor: "pointer",
            background:
              i === active ? "var(--color-accent)" : "var(--color-border)",
            transition:
              "width 250ms cubic-bezier(0.22, 1, 0.36, 1), background 200ms ease",
            outline: "none",
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = "2px solid var(--color-accent)";
            e.currentTarget.style.outlineOffset = "2px";
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = "none";
          }}
        />
      ))}
    </div>
  );
}
