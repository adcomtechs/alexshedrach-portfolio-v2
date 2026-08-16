// features/projects/CaseStudyLayout.jsx
// RSC — no client directive required.
//
// File location — features/projects/ not components/layout/. (DEC-016)
// Flat vertical stack of labeled sections. (DEC-017)
// MetricBadge not used — outcome renders as prose. (DEC-018)
// Testimonial is optional — renders only when field is populated. (DEC-022)
//
// SECTION_MAP is exported so page.jsx can construct the StickyOutline
// section list without duplicating the section order. (DEC-034)

import { CaseStudySection } from "./CaseStudySection";
import { ChallengesSolutions } from "./ChallengesSolutions";
import { TestimonialBlock } from "./TestimonialBlock";

// Section order is fixed — matches the six required questions from
// PORTFOLIO_V2_SPEC.md § 6.2. Do not reorder without a spec amendment.
// Exported so page.jsx can build the StickyOutline section list. (DEC-034)
export const SECTION_MAP = [
  { key: "problem", label: "Problem" },
  { key: "constraints", label: "Constraints" },
  { key: "architecture", label: "Architecture" },
  { key: "decisions", label: "Decisions" },
  { key: "tradeoffs", label: "Tradeoffs" },
  { key: "outcome", label: "Outcome" },
];

/**
 * CaseStudyLayout
 *
 * Renders the full engineering narrative for a single project as a flat
 * vertical stack of labeled prose sections, followed by optional Challenges
 * and Solutions and an optional Testimonial. (DEC-016, DEC-017, DEC-022, DEC-033)
 *
 * Each CaseStudySection receives its `key` as the `id` prop — this forwards
 * the anchor ID to the section's root DOM element for anchor scrolling,
 * IntersectionObserver targeting by StickyOutline, and AnchorCopy URL
 * construction. (DEC-034, DEC-036)
 *
 * Sections with no content are skipped — graceful degradation when caseStudy
 * fields are not yet fully populated.
 *
 * @param {Object} project - Full project data object from lib/data/projects.js
 */
export function CaseStudyLayout({ project }) {
  const { caseStudy, testimonial, challenges } = project;

  return (
    <article>
      {/* Six prose sections — flat vertical stack per DEC-017.
          The border-top on the wrapper opens the section visually.
          Each CaseStudySection carries border-bottom via scroll-mt-24
          and the py-10 wrapper below. */}
      <div
        className="flex flex-col"
        style={{ borderTop: "1px solid var(--color-border-sub)" }}
      >
        {SECTION_MAP.map(({ key, label }) => {
          const content = caseStudy?.[key];
          if (!content) return null;

          return (
            <div
              key={key}
              className="py-10"
              style={{ borderBottom: "1px solid var(--color-border-sub)" }}
            >
              {/* id={key} forwards the anchor ID to CaseStudySection's root
                  element. key === id === anchor slug. e.g. "problem" */}
              <CaseStudySection id={key} label={label}>
                {content}
              </CaseStudySection>
            </div>
          );
        })}
      </div>

      {/* Challenges and Solutions — conditional per DEC-033 */}
      {challenges?.length > 0 && (
        <ChallengesSolutions challenges={challenges} />
      )}

      {/* Testimonial — conditional per DEC-022 */}
      {testimonial?.quote && (
        <div className="pt-12 pb-4">
          <TestimonialBlock testimonial={testimonial} />
        </div>
      )}
    </article>
  );
}
