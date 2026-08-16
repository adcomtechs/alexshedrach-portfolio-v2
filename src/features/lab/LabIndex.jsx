// features/lab/LabIndex/LabIndex.jsx
// RSC — no client directive required.
//
// Receives entries from page.jsx. Does not fetch, does not filter.
// Rendering only.
//
// Grid: two columns desktop, one column mobile — consistent with DEC-023
// pattern for index surfaces.
//
// Filter UI is out of scope at current entry volume. The conditional pattern
// from DEC-031 applies: if a filter is ever warranted, condition checks
// live in page.jsx and are passed as props — not embedded here.

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { LabCard } from "@/components/ui/Cards/LabCard";

/**
 * LabIndex
 *
 * @param {Array}   entries - All lab entries from lab.js
 */
export function LabIndex({ entries }) {
  if (!entries || entries.length === 0) return null;

  return (
    <Section spacing="lg" className="relative">
      <SectionBackground variant="minimal" />

      <Container size="wide" className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {entries.map((entry) => (
            <LabCard key={entry.slug} entry={entry} variant="card" />
          ))}
        </div>
      </Container>
    </Section>
  );
}
