// features/home/SelectedSystemsSection/index.jsx
// RSC — no client directive required.
//
// Changes from previous version:
//   ✓ Section footnote redesigned — now a contained surface with a subtle
//     accent glow. Reads as a visual boundary between this section and the
//     next, replacing the floating caption treatment which merged invisibly
//     into the background.
//   ✓ spacing="md" — was "lg". Section content is now compact enough that
//     "lg" spacing over-separates it from adjacent sections.
//
// Layout:
//   ┌─ Section header row ──────────────────────── [View all →] ─┐
//   ├─────────────────────────────────────────────────────────────┤  ← accent gradient line
//   │  FeaturedProjectCard (full width, split interior)           │
//   ├────────────────────────┬────────────────────────────────────┤
//   │  ProjectCard           │  ProjectCard                       │
//   ├────────────────────────┴────────────────────────────────────┤
//   │  GridFooter (count + CTA)                                   │
//   └─────────────────────────────────────────────────────────────┘
//   [ Section footnote — glowed surface, visual boundary ]

import { ArrowRight } from "lucide-react";

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { ProjectCard } from "@/components/ui/Cards/ProjectCard";

import { ALL_PROJECTS } from "@/lib/data/projects";
import { FeaturedProjectCard } from "./FeaturedProjectCard";

const FEATURED = ALL_PROJECTS[0];
const SUPPORTING = ALL_PROJECTS.slice(1, 3);
const TOTAL_PROJECT_COUNT = ALL_PROJECTS.length;

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionAccentLine() {
  return (
    <div
      aria-hidden="true"
      className="relative h-px w-full"
      style={{ background: "var(--color-border-sub)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, var(--color-accent) 0%, rgba(181,242,61,0.15) 30%, transparent 65%)",
          opacity: 0.6,
        }}
      />
    </div>
  );
}

function GridFooter({ count }) {
  return (
    <div
      className="flex items-center justify-between gap-4 px-6 py-4"
      style={{ borderTop: "1px solid var(--color-border-sub)" }}
    >
      <Text size="sm" color="faint">
        {count} case studies in the projects index
      </Text>

      <Button
        href="/projects"
        variant="ghost"
        size="sm"
        rightIcon={<ArrowRight />}
      >
        View all projects
      </Button>
    </div>
  );
}

/**
 * SectionFootnote
 *
 * Visual boundary between SelectedSystemsSection and the next section.
 * Rendered as a contained surface with a radial accent glow emanating
 * from the left — directional, not decorative. The glow reads as the
 * grid's visual energy bleeding into the space below it.
 *
 * Not a floating caption. Not a divider line.
 * A deliberate section closer with its own visual identity.
 */
function SectionFootnote() {
  return (
    <div className="relative mt-5 overflow-hidden rounded-xl">
      {/* Contained surface */}
      <div
        className="relative flex items-center gap-3 px-5 py-3.5"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-sub)",
          borderRadius: "0.75rem",
        }}
      >
        {/* Accent glow — left-anchored radial, bleeds into the surface */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-8 top-1/2 -translate-y-1/2 rounded-full blur-[40px]"
          style={{
            width: "160px",
            height: "80px",
            background: "var(--color-accent)",
            opacity: 0.12,
          }}
        />

        {/* Secondary glow — faint, right side, creates depth axis */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 rounded-full blur-[50px]"
          style={{
            width: "120px",
            height: "60px",
            background: "var(--color-accent)",
            opacity: 0.05,
          }}
        />

        {/* Accent dot */}
        <span
          aria-hidden
          className="relative w-1 h-1 rounded-full shrink-0"
          style={{ background: "var(--color-accent)", opacity: 0.7 }}
        />

        {/* Text */}
        <Text as="span" size="sm" color="faint" className="relative">
          Each case study documents the decisions made, the tradeoffs accepted,
          and the measured outcome — not just what was built.
        </Text>
      </div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────

/**
 * SelectedSystemsSection
 *
 * Home page section 2. 3 curated engineering case studies in a bordered grid.
 * Intentionally structured and static — no animation, no ambient decoration.
 */
export function SelectedSystemsSection() {
  return (
    <Section
      spacing="md"
      id="selected-systems"
      aria-label="Selected engineering systems"
    >
      <Container size="full">
        {/* ── Section header row ─────────────────────────────────────────── */}
        <div className="flex items-end justify-between gap-6 mb-8">
          <SectionHeader
            label="Selected Systems"
            title="Engineering in practice"
            description="Three systems across different domains — each representing a distinct architectural challenge, a real constraint navigated, and a measurable outcome."
            className="mb-0"
          />

          <div className="hidden md:flex items-center gap-3 shrink-0 pb-1">
            <Text as="span" size="sm" color="faint">
              {TOTAL_PROJECT_COUNT} case studies
            </Text>
            <Button
              href="/projects"
              variant="outline"
              size="sm"
              rightIcon={<ArrowRight />}
            >
              View all
            </Button>
          </div>
        </div>

        {/* ── Project grid ───────────────────────────────────────────────── */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            border: "1px solid var(--color-border-sub)",
            background: "var(--color-surface)",
          }}
        >
          <SectionAccentLine />

          {FEATURED && <FeaturedProjectCard project={FEATURED} />}

          {SUPPORTING.length > 0 && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2"
              style={{ borderTop: "1px solid var(--color-border-sub)" }}
            >
              {SUPPORTING.map((project, i) => (
                <div
                  key={project.slug}
                  style={{
                    borderRight:
                      i < SUPPORTING.length - 1
                        ? "1px solid var(--color-border-sub)"
                        : undefined,
                  }}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}

          <GridFooter count={TOTAL_PROJECT_COUNT} />
        </div>

        {/* ── Section footnote — glowed visual boundary ───────────────────── */}
        <SectionFootnote />
      </Container>
    </Section>
  );
}

export default SelectedSystemsSection;

// // features/home/SelectedSystemsSection/index.jsx
// // RSC — no client directive required.
// //
// // Visual differentiation from HeroSection (intentional design contract):
// //
// //   HeroSection      — atmospheric: ambient glows, parallax, dot grid, motion
// //   SelectedSystems  — architectural: bordered grid, indexed cells, zero decoration
// //
// // The grid container wraps FeaturedProjectCard + two ProjectCards in a single
// // bordered frame. Cards are cells — they do not float with individual shadows.
// // This reads as a system diagram, not a portfolio gallery.
// //
// // Layout:
// //   ┌─ Section header row ──────────────────────── [View all →] ─┐
// //   ├─────────────────────────────────────────────────────────────┤  ← accent gradient line
// //   │  FeaturedProjectCard (full width, split interior)           │
// //   ├────────────────────────┬────────────────────────────────────┤
// //   │  ProjectCard           │  ProjectCard                       │
// //   └────────────────────────┴────────────────────────────────────┘

// import { ArrowRight } from "lucide-react";

// import { Section } from "@/components/layout/Section";
// import { Container } from "@/components/layout/Container";
// import { SectionHeader } from "@/components/ui/SectionHeader";
// import { Button } from "@/components/ui/Button";
// import { Text } from "@/components/ui/Text";
// import { ProjectCard } from "@/components/ui/Cards/ProjectCard";

// import { ALL_PROJECTS } from "@/lib/data/projects";
// import { FeaturedProjectCard } from "./FeaturedProjectCard";

// // The home page surfaces 3 projects:
// //   [0] — Featured / primary (always the first by index)
// //   [1], [2] — Supporting, demonstrating range across domains
// // Do not show more than 3 here — depth over breadth.
// const FEATURED = ALL_PROJECTS[0];
// const SUPPORTING = ALL_PROJECTS.slice(1, 3);

// // ── Section count ──────────────────────────────────────────────────────────────

// // Total project count surfaced in the footer CTA — single source of truth.
// // When ALL_PROJECTS grows, this updates automatically.
// const TOTAL_PROJECT_COUNT = ALL_PROJECTS.length;

// // ── Sub-components ─────────────────────────────────────────────────────────────

// /**
//  * SectionAccentLine
//  *
//  * A thin top border for the grid container with an accent gradient overlay.
//  * Signals the boundary between the hero and the structured content grid.
//  * Purely decorative — aria-hidden.
//  *
//  * The gradient runs: accent (left) → transparent (center/right).
//  * It draws the eye to the top-left corner of the grid, reinforcing the
//  * left-to-right reading direction of the layout.
//  */
// function SectionAccentLine() {
//   return (
//     <div
//       aria-hidden="true"
//       className="relative h-px w-full"
//       style={{ background: "var(--color-border-sub)" }}
//     >
//       <div
//         className="absolute inset-0"
//         style={{
//           background:
//             "linear-gradient(to right, var(--color-accent) 0%, rgba(181,242,61,0.15) 30%, transparent 65%)",
//           opacity: 0.6,
//         }}
//       />
//     </div>
//   );
// }

// /**
//  * GridFooter
//  *
//  * Bottom row of the section — project count + CTA.
//  * Separated from the card grid by a top border.
//  */
// function GridFooter({ count }) {
//   return (
//     <div
//       className="flex items-center justify-between gap-4 px-6 py-4"
//       style={{ borderTop: "1px solid var(--color-border-sub)" }}
//     >
//       <Text size="sm" color="faint">
//         {count} case studies in the projects index
//       </Text>

//       <Button
//         href="/projects"
//         variant="ghost"
//         size="sm"
//         rightIcon={<ArrowRight />}
//       >
//         View all projects
//       </Button>
//     </div>
//   );
// }

// // ── Main export ────────────────────────────────────────────────────────────────

// /**
//  * SelectedSystemsSection
//  *
//  * Home page section 2. Surfaces 3 curated engineering case studies in a
//  * bordered grid system. Intentionally structured and static — no animation,
//  * no ambient decoration. The content carries the weight here.
//  *
//  * All components are RSC. No client boundary needed.
//  */
// export function SelectedSystemsSection() {
//   return (
//     <Section
//       spacing="md"
//       id="selected-systems"
//       aria-label="Selected engineering systems"
//     >
//       <Container size="full">
//         {/* ── Section header row ───────────────────────────────────────────
//             Left: label + title + description
//             Right: project count signal + CTA (desktop only)

//             The CTA on mobile lives in GridFooter below the cards.
//             On desktop both exist — header CTA is high-visibility,
//             footer CTA catches users who scrolled through the cards.
//         ─────────────────────────────────────────────────────────────────── */}
//         <div className="flex items-end justify-between gap-6 mb-8">
//           <SectionHeader
//             label="Selected Systems"
//             title="Engineering in practice"
//             description="Three systems across different domains each representing a distinct architectural challenge, a real constraint navigated, and a measurable outcome."
//             className="mb-0"
//           />

//           {/* Desktop CTA — hidden on mobile, shown in GridFooter instead */}
//           <div className="hidden md:flex items-center gap-3 shrink-0 pb-1">
//             <Text as="span" size="sm" color="faint">
//               {TOTAL_PROJECT_COUNT} case studies
//             </Text>
//             <Button
//               href="/projects"
//               variant="outline"
//               size="sm"
//               rightIcon={<ArrowRight />}
//             >
//               View all
//             </Button>
//           </div>
//         </div>

//         {/* ── Project grid ─────────────────────────────────────────────────
//             Single bordered container — cells share hairline borders.
//             No individual card shadows or rounded corners on cells.
//             The grid container owns the border-radius and outer border.
//         ─────────────────────────────────────────────────────────────────── */}
//         <div
//           className="rounded-xl overflow-hidden"
//           style={{
//             border: "1px solid var(--color-border-sub)",
//             background: "var(--color-surface)",
//           }}
//         >
//           {/* Accent gradient line — separates header from grid */}
//           <SectionAccentLine />

//           {/* Featured project — full width */}
//           {FEATURED && <FeaturedProjectCard project={FEATURED} />}

//           {/* Supporting projects row — 2-column grid */}
//           {SUPPORTING.length > 0 && (
//             <div
//               className="grid grid-cols-1 sm:grid-cols-2"
//               style={{ borderTop: "1px solid var(--color-border-sub)" }}
//             >
//               {SUPPORTING.map((project, i) => (
//                 <div
//                   key={project.slug}
//                   style={{
//                     // Right border on all but the last card
//                     borderRight:
//                       i < SUPPORTING.length - 1
//                         ? "1px solid var(--color-border-sub)"
//                         : undefined,
//                   }}
//                 >
//                   <ProjectCard project={project} />
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Grid footer — mobile CTA + project count */}
//           <GridFooter count={TOTAL_PROJECT_COUNT} />
//         </div>

//         {/* ── Section footnote ─────────────────────────────────────────────
//             Below the grid — a concise signal about what the case studies contain.
//             Keeps the note contextual, not buried inside the grid footer.
//         ─────────────────────────────────────────────────────────────────── */}
//         <div className="flex items-center gap-2 mt-5">
//           <span
//             aria-hidden
//             className="w-1 h-1 rounded-full shrink-0"
//             style={{ background: "var(--color-faint)" }}
//           />
//           <Text as="span" size="sm" color="faint">
//             Each case study documents the decisions made, the tradeoffs
//             accepted, and the measured outcome not just what was built.
//           </Text>
//         </div>
//       </Container>
//     </Section>
//   );
// }

// export default SelectedSystemsSection;
