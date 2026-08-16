// components/ui/Text/Text.jsx
// RSC — no client directive required

import { cn } from "@/lib/utils";

/**
 * Text
 *
 * Owns all body copy in the design system. The only permitted entry point for
 * paragraph-level type. Heading handles hierarchy; Text handles everything else.
 *
 * Do not apply typographic styles to raw HTML elements outside this component.
 * If a layout primitive needs text, it composes Text.
 *
 * @param {string}  as      - Rendered HTML element.
 *                            "p" | "span" | "label" | "li" | "div"
 *                            Defaults to "p". Use "span" for inline text,
 *                            "label" for form labels, "li" inside list contexts.
 * @param {string}  size    - Visual scale.
 *                            "sm"   → var(--text-sm), normal leading
 *                            "base" → var(--text-base), normal leading [default]
 *                            "lg"   → var(--text-lg), relaxed leading
 * @param {string}  color   - Text color token.
 *                            "default" → var(--color-fg)     [default]
 *                            "muted"   → var(--color-muted)
 *                            "faint"   → var(--color-faint)
 * @param {boolean} balance - Applies text-wrap: balance. Useful for short
 *                            descriptive lines that shouldn't orphan.
 * @param {string}  className - Passthrough for one-off overrides.
 */

const sizeMap = {
  sm: "text-body-sm",
  base: "text-body",
  lg: "text-body-lg",
};

const colorMap = {
  default: "",
  muted: "text-muted",
  faint: "text-faint",
};

export function Text({
  as: Tag = "p",
  size = "base",
  color = "default",
  balance = false,
  className,
  children,
  ...rest
}) {
  return (
    <Tag
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
