// features/about/ConnectToWork.jsx
// RSC — no client directive required.
//
// mesh variant — SectionBackground per DEC-045.
// default Container (896px). Per DEC-044.
//
// Enhancements over the original:
//
//   1. Eyebrow row — mono "Connect" label left, AvailabilitySignal right.
//      Surfaces availability state immediately at the CTA section (DEC-029).
//      The signal already renders in nav and /projects hero — this is the
//      third surface, appropriate for a closing CTA.
//
//   2. Heading promoted to display scale — this is the peak-intent CTA on
//      the page. h2 size="2" undersells it. Display scale with a contained
//      max-width creates correct visual weight without breaking line length.
//
//   3. Two-column split — projects path left, contact path right.
//      Each path has its own copy block, button, and accent rule.
//      Grouping copy with its CTA reduces cognitive distance and makes the
//      two intent paths scannable without reading both paragraphs.
//
//   4. Response time signal — surfaced near the contact CTA, not only in the
//      success state. Per DEC-037 requirement. Sourced from siteConfig so it
//      stays in sync with the contact page treatment.
//
//   5. Work type + meta strip — bottom rule with work types and location.
//      Scannable context for evaluators who skip body copy. Sourced from
//      aboutData.connectToWork — add workTypes and locationMeta fields.
//
// Button ordering preserved: glow (projects, primary) → secondary (contact).
// Per DEC-050.

import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { AvailabilitySignal } from "@/components/ui/AvailabilitySignal";
import { siteConfig } from "@/lib/config/site";
import { aboutData } from "./about-data";
import { Text } from "@/components/ui/Text";

// ── PathColumn ────────────────────────────────────────────────────────────────
//
// A single intent path: short accent rule + copy + CTA + optional sub-signal.
// accent=true → lime rule (primary path, projects).
// accent=false → border-color rule (secondary path, contact).
//
// The accent rule is the primary differentiator between paths — it signals
// hierarchy without requiring different font sizes or bold labels.

function PathColumn({ copy, accent, children }) {
  return (
    <div className="flex flex-col" style={{ gap: "1.5rem" }}>
      {/* Short horizontal rule — marks path entry */}
      <div
        aria-hidden="true"
        style={{
          width: "2rem",
          height: "2px",
          background: accent ? "var(--color-accent)" : "var(--color-border)",
        }}
      />

      {/* Path copy */}
      <Text size="md" color="muted" className="max-w-lg mb-3 leading-relaxed">
        {copy}
      </Text>

      {/* CTA area — button + optional sub-signal */}
      <div className="flex flex-col items-start" style={{ gap: "0.75rem" }}>
        {children}
      </div>
    </div>
  );
}

// ── WorkStrip ─────────────────────────────────────────────────────────────────
//
// Bottom meta strip — work types pipe-separated from location/timezone data.
// Mono treatment, faint weight — context for fast-scanning evaluators.

function WorkStrip({ workTypes = [], locationMeta = [] }) {
  if (!workTypes.length && !locationMeta.length) return null;

  return (
    <div
      className="flex items-center flex-wrap"
      style={{
        paddingTop: "1.5rem",
        borderTop: "1px solid var(--color-border-sub)",
        gap: "0.375rem",
        rowGap: "0.375rem",
      }}
    >
      {workTypes.map((type, i) => (
        <span
          key={type}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-faint)",
          }}
        >
          {type}
          {i < workTypes.length - 1 && (
            <span
              aria-hidden="true"
              style={{ marginLeft: "0.375rem", color: "var(--color-border)" }}
            >
              ·
            </span>
          )}
        </span>
      ))}

      {workTypes.length > 0 && locationMeta.length > 0 && (
        <span
          aria-hidden="true"
          style={{
            margin: "0 0.375rem",
            color: "var(--color-border)",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
          }}
        >
          |
        </span>
      )}

      {locationMeta.map((item, i) => (
        <span
          key={item}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-faint)",
          }}
        >
          {item}
          {i < locationMeta.length - 1 && (
            <span
              aria-hidden="true"
              style={{ marginLeft: "0.375rem", color: "var(--color-border)" }}
            >
              ·
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

// ── ConnectToWork ─────────────────────────────────────────────────────────────

export function ConnectToWork() {
  const { heading, projectsCopy, contactCopy, workTypes, locationMeta } =
    aboutData.connectToWork;

 const { available } = siteConfig;
 const responseTime = aboutData.connectToWork.responseTime;

  return (
    <Section spacing="sm" id="connect-to-work" className="relative">
      <SectionBackground variant="mesh" />

      <Container size="wide">
        {/* ── Eyebrow row ─────────────────────────────────────────────────── */}
        {/*
         * Mono "Connect" label left — grounds the section identity.
         * AvailabilitySignal right — surfaces work status at the moment
         * of highest intent. The signal is already present in nav and
         * /projects hero (DEC-029); closing CTAs are the third natural surface.
         */}
        <div
          className="flex items-center justify-between flex-wrap"
          style={{ marginBottom: "2rem", gap: "0.75rem" }}
        >
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full shrink-0"
              style={{ background: "var(--color-accent)" }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
              }}
            >
              Connect
            </span>
          </div>

          {/* AvailabilitySignal — renders only when available. DEC-029. */}
          {available && <AvailabilitySignal />}
        </div>

        {/* ── Display heading ──────────────────────────────────────────────── */}
        {/*
         * Promoted from h2 size="2" to display scale.
         * This is the peak-intent moment on the About page — the heading
         * must carry appropriate visual weight. max-width keeps line length
         * tight so the balance attribute controls breaks on large screens.
         */}
        <Heading
          as="h2"
          size="2"
          balance
          // style={{ maxWidth: "30rem", marginBottom: "3rem" }}
        >
          {heading}
        </Heading>

        {/* ── Two-path split ───────────────────────────────────────────────── */}
        {/*
         * Each path (projects / contact) is isolated: own copy, own rule,
         * own CTA. The grid collapses to a single column on mobile with
         * a horizontal rule separating paths.
         * border-top creates a visual anchor so the split reads as a
         * structured decision, not two unrelated paragraphs.
         */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{
            gap: "2.5rem",
            paddingTop: "2.5rem",
            borderTop: "1px solid var(--color-border-sub)",
            marginBottom: "2.5rem",
          }}
        >
          {/* Projects path — primary, accent rule */}
          <PathColumn copy={projectsCopy} accent>
            <Button asChild variant="glow" size="lg">
              <Link href="/projects">View the work</Link>
            </Button>
          </PathColumn>

          {/* Contact path — secondary, muted rule + response time sub-signal */}
          <PathColumn copy={contactCopy} accent={false}>
            <Button asChild variant="secondary" size="lg">
              <Link href="/contact">Get in touch</Link>
            </Button>

            {/* Response time — sourced from siteConfig per DEC-037.
                Surfaced at the CTA not only in the contact page success state. */}
            {responseTime && (
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-faint)",
                }}
              >
                {responseTime}
              </p>
            )}
          </PathColumn>
        </div>

        {/* ── Work type + location strip ───────────────────────────────────── */}
        {/*
         * Scannable meta for evaluators who skip body copy.
         * Work types left, location/timezone right, pipe-separated.
         * Sourced from aboutData — add workTypes and locationMeta to
         * the connectToWork data shape.
         */}
        <WorkStrip workTypes={workTypes} locationMeta={locationMeta} />
      </Container>
    </Section>
  );
}

// // features/about/ConnectToWork.jsx
// // RSC — no client directive required.
// //
// // mesh variant — SectionBackground per DEC-045.
// // default Container (896px). Per DEC-044.
// // Closing CTA — four lines of copy maximum. Per DEC-044.
// // Button ordering: glow (projects, primary) → secondary (contact). Per DEC-050.

// import { Section } from "@/components/layout/Section";
// import { Container } from "@/components/layout/Container";
// import { SectionBackground } from "@/components/ui/SectionBackground";
// import { Heading } from "@/components/ui/Heading";
// import { Text } from "@/components/ui/Text";
// import { Button } from "@/components/ui/Button";
// import { aboutData } from "./about-data";

// export function ConnectToWork() {
//   const { heading, projectsCopy, contactCopy } = aboutData.connectToWork;

//   return (
//     <Section spacing="lg" id="connect-to-work" className="relative">
//       <SectionBackground variant="mesh" />

//       <Container size="default">
//         {/* Heading — display scale, this is the peak-intent CTA on the page */}
//         <Heading as="h2" size="2" balance className="max-w-xl mb-6">
//           {heading}
//         </Heading>

//         {/* Projects copy */}
//         <Text size="sm" color="muted" className="max-w-lg mb-3 leading-relaxed">
//           {projectsCopy}
//         </Text>

//         {/* Contact copy */}
//         <Text
//           size="sm"
//           color="muted"
//           className="max-w-lg mb-10 leading-relaxed"
//         >
//           {contactCopy}
//         </Text>

//         {/* CTA row — glow primary, secondary contact. Per DEC-050. */}
//         <div className="flex flex-wrap items-center gap-3">
//           <Button variant="glow" size="lg" href="/projects">
//             View the work
//           </Button>
//           <Button variant="secondary" size="lg" href="/contact">
//             Get in touch
//           </Button>
//         </div>
//       </Container>
//     </Section>
//   );
// }
