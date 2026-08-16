// features/projects/StickyOutline.jsx
"use client";
//
// use client justified — IntersectionObserver and scroll tracking cannot run
// server-side. This is the first and only use client on the case study page.
// Strictly scoped: case study content, hero, testimonial, and navigation
// remain RSC. (DEC-034)
//
// RESPONSIVE — hidden below lg breakpoint via the outermost className.
// Linear reading is the correct pattern at mobile and tablet widths.
// The component still mounts at all breakpoints — CSS controls visibility.
// (DEC-034)
//
// ANCHOR IDs — section elements in CaseStudyLayout must carry matching `id`
// attributes for href="#id" scrolling and IntersectionObserver targeting.
// IDs are slugified section names: "problem", "constraints", "architecture",
// "decisions", "tradeoffs", "outcome", "challenges". (DEC-036)

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * StickyOutline
 *
 * Sticky left-column sidebar that surfaces the case study section structure
 * and highlights the section currently in the viewport as the user scrolls.
 *
 * Renders as a vertical list of anchor links. Active section is indicated by
 * a 2px accent border segment that replaces the container's 1px neutral border —
 * the active indicator is always aligned with the section list's vertical axis.
 *
 * Hidden below the lg breakpoint — the component mounts but is display: none
 * on mobile and tablet. (DEC-034)
 *
 * @param {Array<{ id: string, label: string }>} sections
 *   Ordered list of sections to include in the outline. Constructed by the
 *   parent from the project data — StickyOutline does not read project data.
 *   Standard order: Problem → Constraints → Architecture → Decisions →
 *   Tradeoffs → Outcome → [Challenges if present] → [Testimonial if present]
 */
export function StickyOutline({ sections = [] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!sections.length) return;

    // Disconnect any existing observer before creating a new one.
    // This handles the unlikely case of sections changing after mount.
    observerRef.current?.disconnect();

    // rootMargin: the intersection "window" is the band between 15% from the
    // top and 75% from the bottom of the viewport. A section becomes "active"
    // when its top edge enters this band — roughly when it has scrolled into
    // the upper reading area of the screen.
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Process entries in document order — the last intersecting entry
        // in the list is the section nearest the top of the reading area.
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (intersecting.length > 0) {
          setActiveId(intersecting[0].target.id);
        }
      },
      {
        rootMargin: "-15% 0% -75% 0%",
        threshold: 0,
      },
    );

    // Observe each section element by ID.
    // Elements may not exist if the section data is absent from a project record.
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [sections]);

  if (!sections.length) return null;

  return (
    // hidden lg:block — absent on mobile and tablet, visible on wide viewports.
    // sticky top-24 — clears typical navigation height (~80px) with breathing room.
    // self-start — prevents the outline from stretching to the grid row height.
    <aside className="hidden lg:block sticky top-24 self-start">
      {/* Section label — identifies the outline to screen readers */}
      <p
        className="mb-4"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--color-faint)",
        }}
      >
        Contents
      </p>

      {/* Section list — vertical axis defined by the 1px left border */}
      <nav aria-label="Case study sections">
        <div style={{ borderLeft: "1px solid var(--color-border-sub)" }}>
          {sections.map(({ id, label }) => {
            const isActive = activeId === id;

            return (
              <a
                key={id}
                href={`#${id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "block transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1",
                  "focus-visible:ring-offset-[var(--color-bg)] rounded-sm",
                  isActive
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-faint)] hover:text-[var(--color-muted)]",
                )}
                style={{
                  display: "block",
                  paddingTop: "5px",
                  paddingBottom: "5px",
                  // Active item: shift 1px left + add 2px accent border.
                  // The 2px accent border sits over the container's 1px neutral border,
                  // replacing it with the accent color for the active section's extent.
                  // paddingLeft compensates to preserve the total 16px indent.
                  paddingLeft: isActive ? "15px" : "16px",
                  marginLeft: isActive ? "-1px" : "0",
                  borderLeft: isActive
                    ? "2px solid var(--color-accent)"
                    : "2px solid transparent",
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.05em",
                  fontWeight: isActive ? 500 : 400,
                  textDecoration: "none",
                }}
              >
                {label}
              </a>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
