// features/projects/CaseStudyLayout/ChallengesSolutions.jsx
// RSC — no client directive required.
//
// Flat numbered list — no accordion, no progressive disclosure. (DEC-017, DEC-033)
// Renders between the six prose sections and the testimonial. (DEC-033)
// Caller (CaseStudyLayout) is responsible for conditional rendering —
// this component only renders when the challenges array is populated.
//
// Visual language is consistent with CaseStudySection:
// same label pattern, same border treatment, same spacing rhythm.

import { Text } from "@/components/ui/Text";

/**
 * ChallengesSolutions
 *
 * Structured extraction of problem-solving approach from the case study.
 * More scannable than the constraint and decisions prose fields — an evaluator
 * can read three numbered entries faster than three paragraphs of narrative.
 *
 * Content standard (DEC-033):
 *   - 3–5 entries per project
 *   - Challenge: the specific problem — not a generic description
 *   - Resolution: what was concretely done — not that it was fixed
 *   - Must not duplicate the constraints or decisions prose fields verbatim
 *
 * @param {Array<{ challenge: string, resolution: string }>} challenges
 */
export function ChallengesSolutions({ challenges }) {
  if (!challenges?.length) return null;

  return (
    <div className="flex flex-col">
      {/* Section label — matches CaseStudySection label pattern */}
      <div
        className="flex items-center gap-2.5 py-10"
        style={{ borderTop: "1px solid var(--color-border-sub)" }}
      >
        <span
          aria-hidden
          className="inline-block w-1 h-1 rounded-full shrink-0"
          style={{ background: "var(--color-accent)" }}
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
          Challenges &amp; Solutions
        </span>
      </div>

      {/* Entry list */}
      <div className="flex flex-col">
        {challenges.map((entry, i) => {
          const number = String(i + 1).padStart(2, "0");
          const isLast = i === challenges.length - 1;

          return (
            <div
              key={i}
              className="flex gap-6 py-8"
              style={{
                borderTop: "1px solid var(--color-border-sub)",
                borderBottom: isLast
                  ? "1px solid var(--color-border-sub)"
                  : "none",
              }}
            >
              {/* Number — fixed width, anchors the entry visually */}
              <span
                aria-hidden
                className="shrink-0 w-6 pt-px"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.06em",
                  color: "var(--color-accent)",
                  lineHeight: "var(--leading-normal)",
                }}
              >
                {number}
              </span>

              {/* Content — challenge above, resolution below */}
              <div className="flex flex-col gap-3 min-w-0">
                {/* Challenge — fg color, medium weight, reads as the problem */}
                <p
                  style={{
                    fontSize: "var(--text-base)",
                    fontWeight: 500,
                    color: "var(--color-fg)",
                    lineHeight: "var(--leading-normal)",
                  }}
                >
                  {entry.challenge}
                </p>

                {/* Resolution — muted, reads as the answer */}
                <Text size="base" color="muted">
                  {entry.resolution}
                </Text>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
