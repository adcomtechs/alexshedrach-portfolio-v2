// features/projects/NextPrevNavigation/NextPrevNavigation.jsx
// RSC — no client directive required.
//
// Adjacent case study navigation — renders below the case study content,
// above the footer. Keeps evaluators inside the projects system without
// a return trip to the index. (DEC-035)
//
// Previous and Next are computed by page.jsx from ALL_PROJECTS sorted by
// index. This component receives already-resolved adjacent project objects
// and renders links — it does not touch the data layer. (DEC-031, DEC-035)
//
// Edge cases (DEC-035):
//   First project — previous is null, left slot renders nothing
//   Last project  — next is null, right slot renders nothing
//   Only project  — both null, component returns null entirely

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ── NavCard ────────────────────────────────────────────────────────────────────
//
// A single adjacent project link — used for both previous and next.
// `direction` controls visual alignment and icon placement.

function NavCard({ project, direction }) {
  const isPrev = direction === "previous";

  return (
    <Link
      href={`/projects/${project.slug}`}
      aria-label={`${isPrev ? "Previous" : "Next"} case study: ${project.title}`}
      className={cn(
        "group flex flex-col gap-2 p-5 rounded-xl",
        "bg-[var(--color-surface)] border border-[var(--color-border-sub)]",
        "hover:bg-[var(--color-surface-2)] hover:border-[var(--color-border)]",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[var(--color-bg)]",
        !isPrev && "items-end text-right",
      )}
    >
      {/* Direction label with icon */}
      <div
        className={cn(
          "flex items-center gap-1.5",
          !isPrev && "flex-row-reverse",
        )}
      >
        {isPrev ? (
          <ChevronLeft
            size={13}
            aria-hidden
            style={{ color: "var(--color-faint)", flexShrink: 0 }}
          />
        ) : (
          <ChevronRight
            size={13}
            aria-hidden
            style={{ color: "var(--color-faint)", flexShrink: 0 }}
          />
        )}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--color-faint)",
          }}
        >
          {isPrev ? "Previous" : "Next"}
        </span>
      </div>

      {/* Project title */}
      <span
        className="group-hover:text-[var(--color-accent)] transition-colors duration-200"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-md)",
          fontWeight: 600,
          color: "var(--color-fg)",
          lineHeight: "var(--leading-snug)",
        }}
      >
        {project.title}
      </span>

      {/* Domain */}
      {project.domain && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            letterSpacing: "0.04em",
            color: "var(--color-faint)",
          }}
        >
          {project.domain}
        </span>
      )}
    </Link>
  );
}

// ── NextPrevNavigation ─────────────────────────────────────────────────────────

/**
 * NextPrevNavigation
 *
 * Two-column strip — previous on the left, next on the right.
 * When one is absent (first or last project), its column is empty and the
 * present card spans its half of the grid — no empty state placeholder,
 * no layout shift. The grid structure is always two columns. (DEC-035)
 *
 * @param {{ slug: string, title: string, domain: string }|null} previous
 * @param {{ slug: string, title: string, domain: string }|null} next
 */
export function NextPrevNavigation({ previous, next }) {
  // Single project or neither adjacent project exists — render nothing
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="Case study navigation"
      className="mt-12 pt-12"
      style={{ borderTop: "1px solid var(--color-border-sub)" }}
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Left — Previous */}
        <div>
          {previous && <NavCard project={previous} direction="previous" />}
        </div>

        {/* Right — Next */}
        <div>{next && <NavCard project={next} direction="next" />}</div>
      </div>
    </nav>
  );
}
