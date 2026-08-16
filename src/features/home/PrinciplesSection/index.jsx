// features/home/PrinciplesSection/index.jsx
// RSC — no client directive required.
//
// Changes from previous version:
//   ✓ TestimonialsCarousel removed — must live in its own dedicated Section
//     component at the page level. Rendering it here violated section
//     boundary and was the primary cause of vertical scroll debt.
//   ✓ mb-4 → mb-6 lg:mb-8 between featured and grid (more deliberate rhythm)
//   ✓ Card grid gap: gap-4 (unchanged — correct)
//   ✓ Data props: `description` replaced by `summary` + `details`
//     Components handle the split — this file is unaffected by that change.
//
// Progressive disclosure ("Read rationale →") is intentionally deferred.
// It requires a `use client` boundary that contradicts DEC-008.
// A DECISIONS.md entry is required before implementation.
// The `details` field is in the data and ready for that decision.
//
// Section identity: luminous + floating
//   Dual accent+success glow — "thinking" section visual identity.
//   Deliberately distinct from HeroSection and SelectedSystemsSection.

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PRINCIPLES_HOME } from "@/lib/data/home";
import { FeaturedPrincipleCard } from "./FeaturedPrincipleCard";
import { PrincipleCard } from "./PrincipleCard";

// ─────────────────────────────────────────────────────────────────────────────
// SECTION BACKGROUND
// ─────────────────────────────────────────────────────────────────────────────

function SectionBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute rounded-full blur-[130px]"
        style={{
          width: "60%",
          height: "70%",
          top: "-10%",
          left: "-10%",
          background: "var(--color-accent)",
          opacity: 0.055,
        }}
      />
      <div
        className="absolute rounded-full blur-[120px]"
        style={{
          width: "55%",
          height: "65%",
          bottom: "-15%",
          right: "-8%",
          background: "var(--color-success)",
          opacity: 0.045,
        }}
      />
      <div
        className="absolute rounded-full blur-[160px]"
        style={{
          width: "40%",
          height: "40%",
          top: "30%",
          left: "30%",
          background: "var(--color-accent)",
          opacity: 0.018,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
          opacity: 0.018,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VIEW ALL LINK
// Quiet anchor to /about for the full 5-principle set.
// Intentionally subdued — navigation affordance, not a CTA.
// ─────────────────────────────────────────────────────────────────────────────

function ViewAllLink() {
  return (
    <div className="flex items-center justify-center gap-4 mt-10">
      <div
        aria-hidden="true"
        className="h-px flex-1 max-w-[60px]"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--color-border-sub))",
        }}
      />

      <a
        href="/about#principles"
        className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.06em] text-faint transition-colors duration-150 hover:text-accent"
      >
        All five principles
        <svg
          className="transition-transform duration-150 group-hover:translate-x-0.5"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
        >
          <path
            d="M1 5h8M5.5 1.5L9 5l-3.5 3.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>

      <div
        aria-hidden="true"
        className="h-px flex-1 max-w-[60px]"
        style={{
          background:
            "linear-gradient(to left, transparent, var(--color-border-sub))",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT EXPORT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * PrinciplesSection
 *
 * Homepage section: "How I Think"
 * 3 compressed principles — scan-optimized for Layer 1 comprehension.
 * Full philosophy (5 principles, full details) lives at /about.
 *
 * No TestimonialsCarousel here. Move it to a dedicated Section at the
 * page composition level (home/page.jsx or equivalent).
 */
export function PrinciplesSection() {
  const [featured, ...rest] = PRINCIPLES_HOME;

  return (
    <Section
      spacing="md"
      id="principles"
      aria-label="Engineering principles"
      className="relative"
    >
      <SectionBackground />

      <Container size="full" className="relative">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <SectionHeader
          label="How I Think"
          title="Principles that govern every decision"
          description="These are not values posted on a wall. They are the specific rules
            that determine how I approach a problem, evaluate a tradeoff,
            and decide what ships."
          align="center"
          size="lg"
        />

        {/* ── Featured principle — full width ────────────────────────────── */}
        {featured && (
          <div className="mb-6 lg:mb-8">
            <FeaturedPrincipleCard principle={featured} />
          </div>
        )}

        {/* ── Supporting principles — 2-column grid ──────────────────────── */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rest.map((principle) => (
              <PrincipleCard key={principle.id} principle={principle} />
            ))}
          </div>
        )}

        {/* ── View all link ───────────────────────────────────────────────── */}
        <ViewAllLink />
      </Container>
    </Section>
  );
}

export default PrinciplesSection;

// // features/home/PrinciplesSection/index.jsx
// //
// // RSC — no client directive required.
// //
// // WHAT CHANGED FROM PREVIOUS VERSION:
// //   ✓ TestimonialsCarousel removed — lives in TestimonialsSection now
// //   ✓ Closing tagline removed — moved to TestimonialsSection
// //   ✓ PRINCIPLES → PRINCIPLES_HOME (3 cards, homepage subset)
// //   ✓ SECTION_STATS imported from data layer instead of hardcoded inline
// //   ✓ Subtle "View all principles" link added at bottom
// //
// // Section identity: luminous + floating
// //   Dual accent+success glow positions this as the "thinking" section.
// //   Principles are ideas — the glow reads as alive and generative.
// //   This visual identity belongs only to this section; TestimonialsSection
// //   deliberately uses a different background treatment.
// //
// // Layout:
// //   SectionHeader   — centred, label + title + description
// //   StatBand        — 3 quantified anchors above the cards
// //   FeaturedCard    — full-width, principle[0] (domain-first)
// //   2-card grid     — principles[1] and [2] (environment + correctness)
// //   ViewAllLink     — quiet anchor to /about for the full 5-principle set

// import { Section } from "@/components/layout/Section";
// import { Container } from "@/components/layout/Container";
// import { SectionHeader } from "@/components/ui/SectionHeader";
// import { PRINCIPLES_HOME, SECTION_STATS } from "@/lib/data/home";
// import { FeaturedPrincipleCard } from "./FeaturedPrincipleCard";
// import { PrincipleCard } from "./PrincipleCard";
// import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";

// // ─────────────────────────────────────────────────────────────────────────────
// // SECTION BACKGROUND
// // Dual-color glow: accent top-left + success bottom-right + centre seam blend.
// // Noise texture at very low opacity adds physical depth to the glow field.
// // Identical to previous version — no changes.
// // ─────────────────────────────────────────────────────────────────────────────

// function SectionBackground() {
//   return (
//     <div
//       aria-hidden="true"
//       className="pointer-events-none absolute inset-0 overflow-hidden"
//     >
//       {/* Accent glow — top-left anchor */}
//       <div
//         className="absolute rounded-full blur-[130px]"
//         style={{
//           width: "60%",
//           height: "70%",
//           top: "-10%",
//           left: "-10%",
//           background: "var(--color-accent)",
//           opacity: 0.055,
//         }}
//       />

//       {/* Success glow — bottom-right anchor, creates diagonal energy axis */}
//       <div
//         className="absolute rounded-full blur-[120px]"
//         style={{
//           width: "55%",
//           height: "65%",
//           bottom: "-15%",
//           right: "-8%",
//           background: "var(--color-success)",
//           opacity: 0.045,
//         }}
//       />

//       {/* Centre seam blend — softens the meeting point between the two glows */}
//       <div
//         className="absolute rounded-full blur-[160px]"
//         style={{
//           width: "40%",
//           height: "40%",
//           top: "30%",
//           left: "30%",
//           background: "var(--color-accent)",
//           opacity: 0.018,
//         }}
//       />

//       {/* Noise texture — prevents the glow reading as a flat gradient */}
//       <div
//         className="absolute inset-0"
//         style={{
//           backgroundImage:
//             "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
//           backgroundRepeat: "repeat",
//           backgroundSize: "128px 128px",
//           opacity: 0.018,
//           mixBlendMode: "overlay",
//         }}
//       />
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // STAT BAND
// // Three quantified anchors rendered between the header and the principle cards.
// // Values come from SECTION_STATS in the data layer — no inline hardcoding.
// // Honest numbers only: see lib/data/principles.js for the update rationale.
// // ─────────────────────────────────────────────────────────────────────────────

// function StatBand() {
//   return (
//     <div
//       className="flex items-center justify-center gap-0 mb-12 mx-auto"
//       style={{ maxWidth: "520px" }}
//     >
//       {SECTION_STATS.map((stat, i) => (
//         <div key={stat.label} className="flex items-center flex-1">
//           <div className="flex flex-col items-center gap-1 px-4 text-center flex-1">
//             <span
//               style={{
//                 fontFamily: "var(--font-display)",
//                 fontSize: "var(--text-xl)",
//                 fontWeight: 700,
//                 color: "var(--color-fg)",
//                 letterSpacing: "var(--tracking-tight)",
//                 lineHeight: "var(--leading-tight)",
//               }}
//             >
//               {stat.value}
//             </span>
//             <span
//               style={{
//                 fontFamily: "var(--font-mono)",
//                 fontSize: "var(--text-xs)",
//                 color: "var(--color-faint)",
//                 letterSpacing: "0.03em",
//                 lineHeight: "var(--leading-snug)",
//                 textAlign: "center",
//               }}
//             >
//               {stat.label}
//             </span>
//           </div>

//           {/* Divider — suppressed after last stat */}
//           {i < SECTION_STATS.length - 1 && (
//             <div
//               aria-hidden="true"
//               className="h-8 w-px shrink-0"
//               style={{ background: "var(--color-border)" }}
//             />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // VIEW ALL LINK
// // Quiet text anchor at the bottom of the section.
// // Only 3 of 5 principles appear here; the full set lives at /about.
// // Intentionally subdued — this is a navigation affordance, not a CTA.
// // ─────────────────────────────────────────────────────────────────────────────

// function ViewAllLink() {
//   return (
//     <div className="flex items-center justify-center gap-4 mt-12">
//       {/* Left rule */}
//       <div
//         aria-hidden="true"
//         className="h-px flex-1 max-w-[60px]"
//         style={{
//           background:
//             "linear-gradient(to right, transparent, var(--color-border-sub))",
//         }}
//       />

//       <a
//         href="/about#principles"
//         className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.06em] text-faint transition-colors duration-150 hover:text-accent"
//       >
//         All five principles
//         <svg
//           className="transition-transform duration-150 group-hover:translate-x-0.5"
//           width="10"
//           height="10"
//           viewBox="0 0 10 10"
//           fill="none"
//         >
//           <path
//             d="M1 5h8M5.5 1.5L9 5l-3.5 3.5"
//             stroke="currentColor"
//             strokeWidth="1.2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           />
//         </svg>
//       </a>

//       {/* Right rule */}
//       <div
//         aria-hidden="true"
//         className="h-px flex-1 max-w-[60px]"
//         style={{
//           background:
//             "linear-gradient(to left, transparent, var(--color-border-sub))",
//         }}
//       />
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // ROOT EXPORT
// // ─────────────────────────────────────────────────────────────────────────────

// /**
//  * PrinciplesSection
//  *
//  * Homepage section: "How I Think"
//  * Communicates the 3 most contextually specific engineering principles
//  * with real proof from named projects.
//  *
//  * Principle 04 (decisions) and 05 (clarity) live at /about only — they are
//  * real but less visually differentiated from what any developer might write.
//  * The three shown here could only come from someone building offline-first
//  * software for Nigerian retail and prototyping in vanilla JS before Java.
//  */
// export function PrinciplesSection() {
//   const [featured, ...rest] = PRINCIPLES_HOME;

//   return (
//     <Section
//       spacing="md"
//       id="principles"
//       aria-label="Engineering principles"
//       className="relative"
//     >
//       <SectionBackground />

//       <Container size="full" className="relative">
//         {/* ── Header ─────────────────────────────────────────────────────── */}
//         <SectionHeader
//           label="How I Think"
//           title="Principles that govern every decision"
//           description="These are not values posted on a wall. They are the specific rules
//             that determine how I approach a problem, evaluate a tradeoff,
//             and decide what ships."
//           align="center"
//           size="lg"
//         />

//         {/* ── Stat band ──────────────────────────────────────────────────── */}
//         {/* <StatBand /> */}

//         {/* ── Featured principle — full width ────────────────────────────── */}
//         {featured && (
//           <div className="mb-4">
//             <FeaturedPrincipleCard principle={featured} />
//           </div>
//         )}

//         {/* ── Supporting principles — 2-column grid ──────────────────────── */}
//         {rest.length > 0 && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {rest.map((principle) => (
//               <PrincipleCard key={principle.id} principle={principle} />
//             ))}
//           </div>
//         )}

//         {/* <TestimonialsCarousel /> */}

//         {/* ── View all link — quiet anchor to /about ──────────────────────── */}
//         <ViewAllLink />
//       </Container>
//     </Section>
//   );
// }

// export default PrinciplesSection;
