// features/about/PhilosophyExamples.jsx
"use client";
//
// use client justified: IntersectionObserver for scroll-triggered entrance
// animation on each example block. The section shell and narrative text
// remain RSC — this boundary is scoped to the examples list only.
//
// Scales to any number of examples — adding entries to aboutData.engineeringPhilosophy.examples
// requires zero layout changes. Index numbers, threading, and entrance
// animation stagger all derive from the array index automatically.

import { useEffect, useRef } from "react";

// ─── Single evidence block ────────────────────────────────────────────────────

function ExampleBlock({ project, detail, index }) {
  const ref = useRef(null);
  const displayIndex = String(index + 1).padStart(2, "0");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion — skip animation entirely
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger delay based on index — each block enters slightly after the previous
          el.style.transitionDelay = `${index * 80}ms`;
          el.classList.add("philosophy-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <li
      ref={ref}
      className="philosophy-block group relative"
      style={{
        // Initial state for entrance animation
        opacity: 0,
        transform: "translateY(20px)",
        transition:
          "opacity 550ms cubic-bezier(0.22, 1, 0.36, 1), transform 550ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Connector line — threads from this block to the next */}
      {/* Absent on the last item — handled via CSS :last-child */}
      <div
        aria-hidden="true"
        className="philosophy-thread absolute left-[19px] top-[52px] w-px pointer-events-none"
        style={{
          bottom: "-24px",
          background:
            "linear-gradient(to bottom, rgba(181,242,61,0.25), transparent)",
          transition: "opacity 300ms ease",
        }}
      />

      {/* Block shell */}
      <div
        className="relative flex gap-5 p-5 rounded-2xl overflow-hidden"
        style={{
          border: "1px solid var(--color-border-sub)",
          background: "var(--color-surface)",
          transition: "border-color 250ms ease, box-shadow 250ms ease",
        }}
      >
        {/* Hover wash — gradient from accent corner */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 0% 0%, rgba(181,242,61,0.05) 0%, transparent 70%)",
            transition: "opacity 300ms ease",
          }}
        />

        {/* Accent left flash — visible on hover */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full opacity-0 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-accent), rgba(181,242,61,0.2))",
            transition: "opacity 250ms ease",
          }}
        />

        {/* Left column — index + project name vertical stack */}
        <div className="relative shrink-0 flex flex-col items-center gap-2 pt-0.5">
          {/* Index number */}
          <span
            aria-hidden="true"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.12em",
              color: "var(--color-accent)",
              opacity: 0.7,
              lineHeight: 1,
            }}
          >
            {displayIndex}
          </span>

          {/* Icon container */}
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "var(--color-accent-bg)",
              border: "1px solid rgba(181,242,61,0.18)",
              transition: "border-color 250ms ease, background 250ms ease",
            }}
            aria-hidden="true"
          >
            {/* Code brackets icon — signals engineering context */}
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>

          {/* Project name — rotated, sits below the icon */}
          {/* Hidden on mobile — too narrow for rotated text */}
          <div
            className="hidden md:flex items-center justify-center mt-1"
            style={{ minHeight: "60px" }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-muted)",
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                transform: "rotate(180deg)",
                lineHeight: 1,
              }}
            >
              {project}
            </span>
          </div>
        </div>

        {/* Right column — project name (mobile) + detail */}
        <div className="relative flex flex-col gap-2 min-w-0 pt-0.5">
          {/* Project name — shown on mobile only (replaces rotated label) */}
          <div className="flex items-center gap-2 md:hidden">
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
              }}
            >
              {project}
            </span>
          </div>

          {/* Detail text */}
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-muted)",
              lineHeight: "var(--leading-relaxed)",
            }}
          >
            {detail}
          </p>

          {/* Project tag — desktop, bottom of right column */}
          <div className="hidden md:flex items-center gap-1.5 mt-1">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-faint)",
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border-sub)",
              }}
            >
              <span
                aria-hidden="true"
                className="w-1 h-1 rounded-full"
                style={{ background: "var(--color-accent)", opacity: 0.6 }}
              />
              {project}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}

// ─── PhilosophyExamples ───────────────────────────────────────────────────────

export function PhilosophyExamples({ examples }) {
  return (
    <>
      {/* Inject entrance animation class via a style tag — avoids a CSS module */}
      <style>{`
        .philosophy-visible {
          opacity: 1 !important;
          transform: none !important;
        }
        .philosophy-block:last-child .philosophy-thread {
          display: none;
        }
      `}</style>

      <ul
        className="flex flex-col gap-6"
        role="list"
        aria-label="Engineering philosophy examples"
      >
        {examples.map(({ project, detail }, index) => (
          <ExampleBlock
            key={project}
            project={project}
            detail={detail}
            index={index}
          />
        ))}
      </ul>
    </>
  );
}
