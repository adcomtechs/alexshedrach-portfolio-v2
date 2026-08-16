// components/ui/SectionHeader/SectionHeader.jsx
// RSC — no client directive required

import { cn } from "@/lib/utils";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

/**
 * SectionHeader
 *
 * Consistent section title and subtitle treatment. The authoritative entry
 * point for section-level headings across every page. Composes Heading and
 * Text — no independent type styling.
 *
 * @param {string}  label        - Eyebrow label. Rendered in mono uppercase with accent color.
 *                                 Keep to 2–3 words. Sets context before the heading lands.
 * @param {string}  title        - Primary heading text. Required.
 * @param {string}  description  - Optional supporting text below the heading.
 *                                 Max 1–2 sentences. If you need more, the content belongs
 *                                 in the section body, not the header.
 * @param {string}  as           - Heading element. Defaults to "h2".
 *                                 Use "h1" on page-level headers, "h3" inside nested sections.
 * @param {string}  size         - Maps to Heading size prop.
 *                                 "sm"      → Heading size "3" (text-xl)
 *                                 "default" → Heading size "2" (text-2xl) [default]
 *                                 "lg"      → Heading size "1" (text-3xl)
 * @param {string}  align        - "left" [default] | "center"
 * @param {string}  titleColor   - Forwarded to Heading color prop.
 *                                 "default" [default] | "muted" | "accent"
 * @param {string}  className    - Layout overrides only (margin, width).
 *                                 Must not contain visual styles.
 */

const sizeToHeadingSize = {
  sm: "3",
  default: "2",
  lg: "1",
};

export function SectionHeader({
  label,
  title,
  description,
  as = "h2",
  size = "default",
  align = "left",
  titleColor = "default",
  className,
}) {
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "mb-10",
        isCentered && "text-center mx-auto max-w-xl",
        className,
      )}
    >
      {/* Eyebrow label */}
      {label && (
        <div
          className={cn(
            "inline-flex items-center gap-2 mb-3",
            isCentered && "justify-center w-full",
          )}
        >
          {/* Pulse indicator — dot-pulse keyframe in animations.css */}
          <span
            aria-hidden
            className="size-1.5 rounded-full bg-[var(--color-accent)] animate-[dot-pulse_2.5s_ease-in-out_infinite]"
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.09em",
              // 0.09em exceeds --tracking-wide (0.04em) intentionally —
              // mono uppercase labels lose legibility at token tracking
              textTransform: "uppercase",
              color: "var(--color-accent)",
            }}
          >
            {label}
          </span>
        </div>
      )}

      {/* Title */}
      <Heading
        as={as}
        size={sizeToHeadingSize[size] ?? "2"}
        color={titleColor}
        balance
      >
        {title}
      </Heading>

      {/* Description */}
      {description && (
        <Text
          size="sm"
          color="muted"
          className={cn("mt-3 max-w-lg", isCentered && "mx-auto")}
        >
          {description}
        </Text>
      )}
    </div>
  );
}
