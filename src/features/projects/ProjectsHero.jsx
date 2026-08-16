// features/projects/ProjectsHero.jsx
// use client — three justifications:
//   1. Card tilt — mouse position tracked via onMouseMove.
//   2. Domain bar animations — state-driven width transition on mount.
//   3. Hover glow — isHovered state toggles box-shadow.
// Logged in AI_CONTEXT.md use client ledger as
// "ProjectsHero — card tilt + bar animations + hover glow".
//
// editorial SectionBackground — per DEC-020.
// Hero specification — per DEC-021.
// Availability signal — per DEC-029.
// wide Container — two-column layout requires 1152px. Per DEC-024.
//
// Layout: two-column split.
//   Left  (~55%) — editorial content: eyebrow, heading, description, availability.
//   Right (~45%) — ProjectIntelligencePanel: domain bars, status, summary.
//
// Data flows from page.jsx — this component does not import from the data
// layer or siteConfig directly. The page owns the data flow. (DEC-031)
//
// Props extended from original:
//   domains       — { value, label, count }[] from page domainMap
//   statusBreakdown — { live, wip, archived } counts from page

"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/layout/Container";

// ── Status display config ─────────────────────────────────────────────────────
// Color + label for each status value. Per DEC-015 enum: live | wip | archived.

const STATUS_CONFIG = {
  live: { color: "var(--color-success)", label: "Live" },
  wip: { color: "var(--color-warning)", label: "WIP" },
  archived: { color: "var(--color-faint)", label: "Archived" },
};

// ── ProjectIntelligencePanel ──────────────────────────────────────────────────
//
// A lifted data card showing domain distribution, status breakdown, and a
// summary footer. Reads as an analytics panel or a JSON schema opened in an
// editor — coherent with the system's existing book-window aesthetic.
//
// Visual effects:
//   Tilt  — perspective transform tracked from mouse position on the card.
//            Max ±3 degrees. Returns to flat on mouse leave with a slow ease.
//   Glow  — accent box-shadow on hover (--shadow-glow from tokens.css).
//   Bars  — domain bars transition from 0% to target width on mount (400ms delay).
//           Staggered by 100ms per bar via transition-delay.
//   Shine — a diagonal gradient overlay sweeps in on hover.
//
// @param {{ value, label, count }[]} domains
// @param {{ live?: number, wip?: number, archived?: number }} statusBreakdown
// @param {number} projectCount

function ProjectIntelligencePanel({
  domains = [],
  statusBreakdown = {},
  projectCount = 0,
}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [barsReady, setBarsReady] = useState(false);

  // Delay bar fill so the animation is visible after paint settles
  useEffect(() => {
    const t = setTimeout(() => setBarsReady(true), 420);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    // Max ±3 degrees
    setTilt({ x: dy * -3, y: dx * 3 });
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  const maxCount = Math.max(...domains.map((d) => d.count), 1);
  const isFlat = tilt.x === 0 && tilt.y === 0;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        // Compound shadow: depth + optional accent glow on hover
        boxShadow: isHovered
          ? "var(--shadow-lg), 0 0 32px rgba(181,242,61,0.1), 0 0 0 1px rgba(181,242,61,0.1)"
          : "var(--shadow-md), 0 0 0 1px var(--color-border-sub)",
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: `transform ${isFlat ? "500ms" : "80ms"} cubic-bezier(0.22,1,0.36,1), box-shadow 300ms ease`,
        willChange: "transform",
        position: "relative",
      }}
    >
      {/* Shine overlay — diagonal gradient sweep visible on hover */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%, rgba(181,242,61,0.02) 100%)",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 300ms ease",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ── Header bar ─────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 1.25rem",
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-surface-2)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: "6px" }}>
          {[
            "var(--color-danger)",
            "var(--color-warning)",
            "var(--color-success)",
          ].map((color, i) => (
            <span
              key={i}
              aria-hidden="true"
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: color,
                opacity: 0.45,
                display: "block",
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        {/* Filename */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-faint)",
            letterSpacing: "0.06em",
          }}
        >
          projects.json
        </span>

        {/* Record count */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-faint)",
          }}
        >
          {String(projectCount).padStart(2, "0")} records
        </span>
      </div>

      {/* ── Domain distribution ───────────────────────────────────────────── */}
      <div
        style={{
          padding: "1.25rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--color-faint)",
            marginBottom: "1rem",
          }}
        >
          Domain Distribution
        </span>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}
        >
          {domains.map((domain, i) => {
            const pct = (domain.count / maxCount) * 100;

            return (
              <div key={domain.value}>
                {/* Label + count */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "5px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      color: "var(--color-muted)",
                    }}
                  >
                    {domain.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      fontWeight: 700,
                      color: "var(--color-accent)",
                    }}
                  >
                    {domain.count}
                  </span>
                </div>

                {/* Bar track */}
                <div
                  style={{
                    height: "3px",
                    borderRadius: "2px",
                    background: "var(--color-surface-2)",
                    overflow: "hidden",
                  }}
                >
                  {/* Bar fill — transitions from 0% on mount */}
                  <div
                    style={{
                      height: "100%",
                      width: barsReady ? `${pct}%` : "0%",
                      background:
                        "linear-gradient(to right, var(--color-accent), rgba(181,242,61,0.55))",
                      borderRadius: "2px",
                      transition: `width 750ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 100}ms`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div
        aria-hidden="true"
        style={{
          height: "1px",
          background: "var(--color-border-sub)",
          margin: "0 1.25rem",
          position: "relative",
          zIndex: 2,
        }}
      />

      {/* ── Status breakdown ──────────────────────────────────────────────── */}
      <div
        style={{
          padding: "1rem 1.25rem",
          display: "flex",
          gap: "1.5rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
          const count = statusBreakdown[status] ?? 0;
          return (
            <div
              key={status}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              {/* Status dot */}
              <span
                aria-hidden="true"
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: cfg.color,
                  flexShrink: 0,
                  display: "block",
                  opacity: count === 0 ? 0.3 : 1,
                }}
              />
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 700,
                    color: count > 0 ? "var(--color-fg)" : "var(--color-faint)",
                    display: "block",
                    lineHeight: 1,
                  }}
                >
                  {count}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    color: "var(--color-faint)",
                    display: "block",
                    marginTop: "2px",
                    letterSpacing: "0.04em",
                  }}
                >
                  {cfg.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.625rem 1.25rem",
          borderTop: "1px solid var(--color-border)",
          background: "var(--color-surface-2)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "var(--color-faint)",
            letterSpacing: "0.04em",
          }}
        >
          {projectCount} {projectCount === 1 ? "case study" : "case studies"}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "var(--color-faint)",
            letterSpacing: "0.04em",
          }}
        >
          {domains.length} {domains.length === 1 ? "domain" : "domains"}
        </span>
      </div>
    </div>
  );
}

// ── ProjectsHero ──────────────────────────────────────────────────────────────

/**
 * ProjectsHero
 *
 * Two-column hero: editorial content left, project intelligence panel right.
 * Container: wide (1152px) — two-column layout cannot fit at default (896px).
 * This is a container sizing amendment from the original single-column layout.
 *
 * @param {boolean}  available       - Whether to render the availability signal.
 * @param {string}   availableFrom   - Human-readable availability date.
 * @param {number}   projectCount    - Total project count.
 * @param {{ value, label, count }[]} domains - Domain distribution from page.
 * @param {{ live?: number, wip?: number, archived?: number }} statusBreakdown
 */
export function ProjectsHero({
  available,
  availableFrom,
  projectCount,
  domains = [],
  statusBreakdown = {},
}) {
  const displayCount = String(projectCount ?? 0).padStart(2, "0");

  return (
    <div className="relative overflow-hidden py-10 lg:py-15">
      <SectionBackground variant="editorial" />

      <Container size="wide" className="relative z-10">
        {/*
         * Two-column grid — items-center vertically aligns both columns
         * when the panel and the text content are different heights.
         * Collapses to single column on mobile.
         */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 lg:gap-16 items-center">
          {/* ── Left: editorial content ──────────────────────────────────── */}
          <div>
            {/* Eyebrow */}
            <div
              className="flex items-center gap-2.5"
              style={{ marginBottom: "1.5rem" }}
            >
              <span
                aria-hidden="true"
                className="inline-block shrink-0"
                style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: "var(--color-accent)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                }}
              >
                Engineering Work
              </span>
              <span
                aria-hidden="true"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.06em",
                  color: "var(--color-faint)",
                }}
              >
                /{" "}
                <span style={{ color: "var(--color-muted)" }}>
                  {displayCount}
                </span>
              </span>
            </div>

            {/* Heading */}
            <Heading
              as="h1"
              size="1"
              balance
              style={{ marginBottom: "1.25rem" }}
            >
              Systems Designed,
              <br />
              Decisions Documented
            </Heading>

            {/* Description */}
            <p
              style={{
                fontSize: "var(--text-lg)",
                lineHeight: "var(--leading-relaxed)",
                color: "var(--color-muted)",
                maxWidth: "38rem",
                textWrap: "pretty",
                marginBottom: "1.5rem",
              }}
            >
              Each project is an engineering record — the problem, the
              constraints that shaped the solution, and the tradeoffs knowingly
              accepted. Not a gallery of thumbnails.
            </p>

            {/* Availability signal — per DEC-029 */}
            {available && availableFrom && (
              <Badge variant="success" dot size="md">
                Available for work · {availableFrom}
              </Badge>
            )}
          </div>

          {/* ── Right: intelligence panel ─────────────────────────────────── */}
          {/*
           * Only renders when domain data is available. When domains is empty
           * (e.g. in tests or on fresh data), the left column spans full width
           * naturally — no broken empty column.
           */}
          {domains.length > 0 && (
            <ProjectIntelligencePanel
              domains={domains}
              statusBreakdown={statusBreakdown}
              projectCount={projectCount}
            />
          )}
        </div>
      </Container>
    </div>
  );
}

// // features/projects/ProjectsHero.jsx
// // RSC — no client directive required.
// //
// // editorial SectionBackground — per DEC-020.
// // Hero specification — per DEC-021.
// // Availability signal — per DEC-029.
// // default Container applied at the page level — per DEC-024.
// //
// // Props are passed from page.jsx — this component does not import from the
// // data layer or siteConfig directly. The page owns the data flow. (DEC-031)

// import { SectionBackground } from "@/components/ui/SectionBackground";
// import { Heading } from "@/components/ui/Heading";
// import { Text } from "@/components/ui/Text";
// import { Badge } from "@/components/ui/Badge";
// import { Container } from "@/components/layout/Container";

// /**
//  * ProjectsHero
//  *
//  * Frames the projects index before the visitor reaches the grid.
//  * Communicates curation philosophy — projects as engineering records,
//  * not a gallery — and quantifies the index with a project count signal.
//  *
//  * When `available` is true, renders an availability signal below the
//  * subheading — a green dot with availableFrom date. Absent otherwise.
//  * No "currently unavailable" state renders — the signal is simply absent. (DEC-029)
//  *
//  * @param {boolean} available     - Whether to render the availability signal.
//  * @param {string}  availableFrom - Human-readable availability date.
//  * @param {number}  projectCount  - Total project count for the eyebrow display.
//  */
// export function ProjectsHero({ available, availableFrom, projectCount }) {
//   const displayCount = String(projectCount ?? 0).padStart(2, "0");

//   return (
//     <div className="relative overflow-hidden py-20 lg:py-28">
//       <SectionBackground variant="editorial" />

//       <Container size="wide" className="relative z-10">
//         {/* Eyebrow — section identifier + live project count from page props */}
//         <div className="flex items-center gap-2.5 mb-6">
//           <span
//             aria-hidden
//             className="inline-block w-1 h-1 rounded-full shrink-0"
//             style={{ background: "var(--color-accent)" }}
//           />
//           <span
//             style={{
//               fontFamily: "var(--font-mono)",
//               fontSize: "var(--text-xs)",
//               letterSpacing: "0.1em",
//               textTransform: "uppercase",
//               color: "var(--color-accent)",
//             }}
//           >
//             Engineering Work
//           </span>
//           <span
//             aria-hidden
//             style={{
//               fontFamily: "var(--font-mono)",
//               fontSize: "var(--text-xs)",
//               letterSpacing: "0.06em",
//               color: "var(--color-faint)",
//             }}
//           >
//             /{" "}
//             <span style={{ color: "var(--color-muted)" }}>{displayCount}</span>
//           </span>
//         </div>

//         {/* Primary heading */}
//         <Heading as="h1" size="1" balance className="mb-5">
//           Systems Designed,
//           <br />
//           Decisions Documented
//         </Heading>

//         {/* Curation philosophy */}
//         <Text size="lg" color="muted" balance className="mb-6">
//           Each project is an engineering record — the problem, the constraints
//           that shaped the solution, and the tradeoffs knowingly accepted. Not a
//           gallery of thumbnails.
//         </Text>

//         {/* Availability signal — renders only when available: true. (DEC-029)
//             Badge dot pulses to reinforce the live/active signal.
//             The signal is entirely absent when available is false —
//             no "currently unavailable" copy renders. */}
//         {available && availableFrom && (
//           <Badge variant="success" dot size="md">
//             Available for work · {availableFrom}
//           </Badge>
//         )}
//       </Container>
//     </div>
//   );
// }
