// features/about/EngineeringPhilosophy/EngineeringPhilosophy.jsx
// RSC — no client directive required.
//
// SectionBackground: minimal — per DEC-045.
// Container: default (896px) — per DEC-044.
//
// Client boundary: PhilosophyExamples — scoped to the examples list only.
// Justified: IntersectionObserver for scroll-triggered entrance animation.
// The section shell and narrative prose remain RSC.
//
// Scalability contract:
//   Adding entries to aboutData.engineeringPhilosophy.examples requires
//   zero changes to this component or PhilosophyExamples. The list maps
//   directly — index numbers, stagger timing, and threading derive automatically.

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { aboutData } from "./about-data";
import { PhilosophyExamples } from "./PhilosophyExamples";

export function EngineeringPhilosophy() {
  const { narrative, examples } = aboutData.engineeringPhilosophy;

  return (
    <Section spacing="md" id="engineering-philosophy" className="relative">
      <SectionBackground variant="minimal" />

      <Container size="default" className="relative">
        <SectionHeader
          label="Philosophy"
          title="Architecture before tooling"
          as="h2"
          size="default"
        />

        {/* ── Narrative — pull-quote treatment ───────────────────────────────
            Elevated from plain body text: left accent rule, slightly larger
            measure, and a faint background container that sets it apart
            from the examples below without creating a card aesthetic.
        ──────────────────────────────────────────────────────────────── */}
        <div
          className="relative pl-5 mt-2"
          style={{
            borderLeft: "2px solid rgba(181,242,61,0.35)",
          }}
        >
          {/* Glow on the accent rule */}
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 bottom-0 w-0.5"
            style={{
              background:
                "linear-gradient(to bottom, var(--color-accent), rgba(181,242,61,0.1))",
              filter: "blur(4px)",
              opacity: 0.4,
            }}
          />

          <p
            style={{
              fontSize: "var(--text-md)",
              color: "var(--color-muted)",
              lineHeight: "var(--leading-relaxed)",
              maxWidth: "68ch",
            }}
          >
            {narrative}
          </p>
        </div>

        {/* ── Section bridge — label + count ─────────────────────────────────
            Separates the narrative from the examples with a labelled divider.
            The count auto-updates as examples grow — no manual edit required.
        ──────────────────────────────────────────────────────────────── */}
        <div className="mt-12 mb-8 flex items-center gap-4">
          <div
            aria-hidden="true"
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(to right, var(--color-border-sub), transparent)",
            }}
          />

          <div className="flex items-center gap-2 shrink-0">
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
              }}
            >
              Decisions in practice
            </span>

            {/* Live count — increments automatically with the data */}
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-md"
              style={{
                background: "var(--color-accent-bg)",
                border: "1px solid rgba(181,242,61,0.2)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                fontWeight: 700,
                color: "var(--color-accent)",
                letterSpacing: "0.04em",
              }}
              aria-label={`${examples.length} examples`}
            >
              {examples.length}
            </span>
          </div>

          <div
            aria-hidden="true"
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(to left, var(--color-border-sub), transparent)",
            }}
          />
        </div>

        {/* ── Examples — client boundary for scroll animation ──────────────── */}
        <PhilosophyExamples examples={examples} />

        {/* ── Closing note ───────────────────────────────────────────────────
            Anchors the section — signals this list is a living record.
        ──────────────────────────────────────────────────────────────── */}
        <div
          className="mt-10 flex items-center gap-3"
          aria-label="Section note"
        >
          <div
            aria-hidden="true"
            className="w-6 h-px"
            style={{ background: "var(--color-border)" }}
          />
          <p
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-faint)",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.03em",
            }}
          >
            Updated as new projects ship and new decisions are made.
          </p>
        </div>
      </Container>
    </Section>
  );
}

export default EngineeringPhilosophy;

// // features/about/EngineeringPhilosophy.jsx
// // RSC — no client directive required.
// //
// // minimal variant — SectionBackground per DEC-045.
// // default Container (896px). Per DEC-044.
// // Prose narrative + examples. Internal structure: prose block per example.
// // Not a card grid — content is continuous argument grounded in real projects.

// import { Section } from "@/components/layout/Section";
// import { Container } from "@/components/layout/Container";
// import { SectionBackground } from "@/components/ui/SectionBackground";
// import { SectionHeader } from "@/components/ui/SectionHeader";
// import { Text } from "@/components/ui/Text";
// import { aboutData } from "./about-data";

// export function EngineeringPhilosophy() {
//   const { narrative, examples } = aboutData.engineeringPhilosophy;

//   return (
//     <Section spacing="md" id="engineering-philosophy" className="relative">
//       <SectionBackground variant="minimal" />

//       <Container size="default">
//         <SectionHeader
//           label="Philosophy"
//           title="Architecture before tooling"
//           as="h2"
//           size="default"
//         />

//         {/* Narrative */}
//         <Text size="base" color="muted" className="max-w-4xl leading-relaxed">
//           {narrative}
//         </Text>

//         {/* Examples — each grounded in a real project */}
//         <div className="mt-12 flex flex-col gap-10">
//           {examples.map(({ project, detail }) => (
//             <div
//               key={project}
//               className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-3 md:gap-8"
//             >
//               {/* Project label — mono, left column on desktop */}
//               <div className="pt-0.5">
//                 <span
//                   style={{
//                     fontFamily: "var(--font-mono)",
//                     fontSize: "var(--text-xs)",
//                     letterSpacing: "0.06em",
//                     textTransform: "uppercase",
//                     color: "var(--color-accent)",
//                   }}
//                 >
//                   {project}
//                 </span>
//               </div>

//               {/* Detail — right column */}
//               <Text size="sm" color="muted" className="leading-relaxed">
//                 {detail}
//               </Text>
//             </div>
//           ))}
//         </div>
//       </Container>
//     </Section>
//   );
// }
