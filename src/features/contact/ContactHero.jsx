// features/contact/ContactHero/ContactHero.jsx
// RSC — no client directive required.
//
// Opens the contact page. Must establish three things before the visitor
// reads the form:
//   1. What kind of work is welcome (high-level — LookingFor delivers the detail)
//   2. Availability status
//   3. Response expectation
//
// SectionBackground variant: editorial — per DEC-020 pattern for document/
// evidence-character pages.

import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { AvailabilitySignal } from "@/components/ui/AvailabilitySignal";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { AVAILABILITY } from "./contact-data";
import ContactIdentity from "./ContactIdentity";

export function ContactHero() {
  return (
    <Section spacing="sm" className="relative overflow-hidden">
      <SectionBackground variant="editorial" />

      <Container size="wide" className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-16 items-center">
          {/* Left — heading + availability + reply commitment */}
          <div>
            <SectionHeader
              as="h1"
              size="lg"
              label="Contact"
              title="Let's work together."
              description="Open to product licensing, custom builds, consulting, and content collaboration. If what you're building maps to what's listed below, write."
            />

            <div className="flex flex-col gap-5 mt-6">
              <AvailabilitySignal
                available={AVAILABILITY.open}
                label={AVAILABILITY.label}
                types={AVAILABILITY.types}
                timezone={AVAILABILITY.timezone}
                size="md"
              />

              {/* Reply commitment — time + quality, visible before submission */}
              <div
                className="inline-flex items-start gap-3 px-4 py-3 rounded-lg"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border-sub)",
                  maxWidth: "fit-content",
                }}
              >
                {/* Left accent rule */}
                <span
                  aria-hidden="true"
                  className="shrink-0 w-px self-stretch rounded-full"
                  style={{ background: "var(--color-accent)", opacity: 0.5 }}
                />

                <div className="flex flex-col gap-0.5">
                  <p
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-fg)",
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    Replies within {AVAILABILITY.responseTime.toLowerCase()}
                  </p>
                  <p
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-faint)",
                      lineHeight: "var(--leading-snug)",
                    }}
                  >
                    Every message gets a specific answer — not a template.
                    Available to start {AVAILABILITY.startDate.toLowerCase()}.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — identity anchor (desktop only, hidden on mobile) */}
          <ContactIdentity />
        </div>
      </Container>
    </Section>
  );
}

export default ContactHero;

// // features/contact/ContactHero.jsx
// // RSC — no client directive required.
// //
// // Opens the contact page. Must establish three things before the visitor
// // reads the form:
// //   1. What kind of work is welcome (high-level — LookingFor delivers the detail)
// //   2. Availability status
// //   3. Response expectation
// //
// // SectionBackground variant: editorial — per DEC-020 pattern for document/
// // evidence-character pages.

// import { SectionHeader } from "@/components/ui/SectionHeader";
// import { SectionBackground } from "@/components/ui/SectionBackground";
// import { AvailabilitySignal } from "@/components/ui/AvailabilitySignal";
// import { Section } from "@/components/layout/Section";
// import { Container } from "@/components/layout/Container";
// import { AVAILABILITY } from "./contact-data";

// export function ContactHero() {
//   return (
//     <Section spacing="sm" className="relative overflow-hidden">
//       <SectionBackground variant="editorial" />

//       <Container size="wide" className="relative">
//         <SectionHeader
//           as="h1"
//           size="lg"
//           label="Contact"
//           title="Let's work together."
//           description="Open to product licensing, custom builds, consulting, and content collaboration. If what you're building maps to what's listed below, write."
//         />

//         <div className="flex flex-col gap-4 mt-6">
//           <AvailabilitySignal
//             available={AVAILABILITY.open}
//             label={AVAILABILITY.label}
//             types={AVAILABILITY.types}
//             timezone={AVAILABILITY.timezone}
//             size="md"
//           />

//           {/* Response commitment — surfaced before the form, not only in success state */}
//           {AVAILABILITY.open && (
//             <p
//               style={{
//                 fontSize: "var(--text-xs)",
//                 color: "var(--color-faint)",
//                 fontFamily: "var(--font-mono)",
//                 letterSpacing: "0.03em",
//               }}
//             >
//               Responds within {AVAILABILITY.responseTime.toLowerCase()}.
//               Available to start {AVAILABILITY.startDate.toLowerCase()}.
//             </p>
//           )}
//         </div>
//       </Container>
//     </Section>
//   );
// }

// export default ContactHero;
