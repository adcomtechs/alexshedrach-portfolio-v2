// features/projects/CaseStudyLayout/CaseStudySection.jsx
// RSC — no client directive required.
//
// Internal to CaseStudyLayout — not a shared primitive. (DEC-016)
// Flat labeled prose block — no sidebar, no toggle, no expand. (DEC-017)
//
// `id` prop — forwarded to the root element for three purposes:
//   1. Anchor scrolling:       href="#problem" → scrolls to this element
//   2. IntersectionObserver:   StickyOutline observes document.getElementById(id)
//   3. AnchorCopy URL:         constructs /projects/[slug]#[id]
// (DEC-034, DEC-036)
//
// `group` class on the label row enables the CSS-only hover reveal
// of the AnchorCopy button. No JS involved in the show/hide. (DEC-036)

import { Text } from "@/components/ui/Text";
import { AnchorCopy } from "./AnchorCopy";

/**
 * CaseStudySection
 *
 * A single labeled prose section. The `id` prop is required for anchor
 * navigation, IntersectionObserver targeting, and AnchorCopy URL construction.
 *
 * AnchorCopy is a use client component rendered inside this RSC — the client
 * boundary is scoped to AnchorCopy only. (DEC-036)
 *
 * @param {string}    id       - Stable anchor ID. Slugified section name.
 *                               e.g. "problem", "constraints", "architecture"
 * @param {string}    label    - Display label. e.g. "Problem", "Constraints"
 * @param {ReactNode} children - Prose content
 */
export function CaseStudySection({ id, label, children }) {
  return (
    <div id={id} className="flex flex-col gap-4 scroll-mt-24">
      {/* Label row — group enables CSS-only hover reveal on AnchorCopy */}
      <div className="group flex items-center gap-2.5">
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
          {label}
        </span>

        {/* Copy anchor link — use client, visible on hover of parent group.
            Clipboard write only — all other elements in this row are RSC. */}
        {id && <AnchorCopy sectionId={id} />}
      </div>

      {/* Prose */}
      <Text size="base" color="muted">
        {children}
      </Text>
    </div>
  );
}
