// features/projects/TestimonialBlock.jsx
// RSC — no client directive required.
//
// Internal to CaseStudyLayout — not a shared primitive. (DEC-016)
// editorial SectionBackground — per DEC-020, DEC-022.
// Caller (CaseStudyLayout) is responsible for conditional rendering —
// this component always renders when called. (DEC-022)

import { Avatar } from "@/components/ui/Avatar";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { Text } from "@/components/ui/Text";

/**
 * TestimonialBlock
 *
 * Third-party validation. Closes the credibility loop — engineering narrative
 * supported by external confirmation. (DEC-022)
 *
 * Avatar renders initials when `avatar` is an empty string — no special
 * handling required, Avatar's fallback handles it. (DEC-022)
 *
 * @param {Object} testimonial
 * @param {string} testimonial.quote        - Testimonial text. No surrounding quotes in the string.
 * @param {string} testimonial.author       - Full name — also used as Avatar alt and initials source
 * @param {string} testimonial.role         - Job title
 * @param {string} testimonial.organisation - Company or institution
 * @param {string} testimonial.avatar       - Image URL. Empty string triggers Avatar initials fallback.
 */
export function TestimonialBlock({ testimonial }) {
  const { quote, author, role, organisation, avatar } = testimonial;

  return (
    <div
      className="relative overflow-hidden rounded-xl px-8 py-10"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border-sub)",
      }}
    >
      <SectionBackground variant="editorial" />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Opening typographic mark — decorative, aria-hidden */}
        <span
          aria-hidden
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "5rem",
            lineHeight: 0.75,
            color: "var(--color-accent)",
            opacity: 0.25,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          &ldquo;
        </span>

        {/* Quote — blockquote for correct semantic structure */}
        <blockquote cite="">
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-md)",
              lineHeight: "var(--leading-relaxed)",
              color: "var(--color-fg)",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            {quote}
          </p>
        </blockquote>

        {/* Attribution */}
        <figcaption className="flex items-center gap-3">
          <Avatar src={avatar || undefined} alt={author} size="md" />
          <div className="flex flex-col gap-0.5">
            <span
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                color: "var(--color-fg)",
                lineHeight: "var(--leading-snug)",
              }}
            >
              {author}
            </span>
            <Text size="sm" color="muted" as="span">
              {role}
              {organisation ? `, ${organisation}` : ""}
            </Text>
          </div>
        </figcaption>
      </div>
    </div>
  );
}
