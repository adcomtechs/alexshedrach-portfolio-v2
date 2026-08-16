// components/ui/Heading/Heading.jsx
// RSC — no client directive required

import { cn } from "@/lib/utils";

/**
 * Heading
 *
 * Owns all typographic hierarchy from display through h4. The only permitted
 * entry point for heading-level type in the design system.
 *
 * `as` and `size` are intentionally decoupled. Semantic element and visual
 * scale are independent concerns — an h2 can render at display scale for a
 * hero, or at "3" scale for a sidebar label. The caller decides both.
 *
 * @param {string}  as       - Rendered HTML element.
 *                             "h1" | "h2" | "h3" | "h4" | "p" | "span"
 *                             Defaults to the natural match for the size:
 *                             display/1 → h1, 2 → h2, 3 → h3, 4 → h4.
 *                             Override explicitly when semantic context differs.
 * @param {string}  size     - Visual scale.
 *                             "display" → 3–4rem fluid, tight, 700 — hero identity
 *                             "1"       → 2.25–3rem fluid, tight, 600 — page titles
 *                             "2"       → 1.875–2.5rem fluid, snug, 600 — section titles
 *                             "3"       → 1.5–1.875rem fluid, snug, 600 — subsection titles
 *                             "4"       → 1.25–1.5rem fluid, normal, 500 — labels, groups
 * @param {string}  color    - Text color token.
 *                             "default" → var(--color-fg)     [default]
 *                             "muted"   → var(--color-muted)
 *                             "accent"  → var(--color-accent)
 * @param {boolean} balance  - Applies text-wrap: balance. Use on short headings
 *                             to prevent orphaned single words.
 * @param {string}  className - Passthrough for one-off overrides.
 */

const defaultTagMap = {
  display: "h1",
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "5",
};

const sizeMap = {
  display: "text-display",
  1: "text-heading-1",
  2: "text-heading-2",
  // h3/h4 compose directly from token-registered Tailwind v4 classes.
  // text-xl, text-lg resolve to var(--text-xl), var(--text-lg) from @theme.
  // leading-snug, leading-normal resolve to var(--leading-snug), var(--leading-normal).
  // font-family is applied via style — no utility class exists for var(--font-display) at this level.
  3: "text-xl leading-snug font-semibold",
  4: "text-lg leading-normal font-medium",
  5: "text-base leading-relaxed font-medium",
};

// Sizes that use utility classes already set font-family.
// Sizes "3" and "4" need it applied directly.
const needsDisplayFont = new Set(["3", "4", "5", 3, 4, 5]);

const colorMap = {
  default: "",
  muted: "text-muted",
  accent: "text-accent",
};

export function Heading({
  as,
  size = "2",
  color = "default",
  balance = false,
  className,
  children,
  ...rest
}) {
  const Tag = as ?? defaultTagMap[size] ?? "h2";

  return (
    <Tag
      style={
        needsDisplayFont.has(size)
          ? { fontFamily: "var(--font-display)" }
          : undefined
      }
      className={cn(
        sizeMap[size],
        colorMap[color],
        balance && "text-balance",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
