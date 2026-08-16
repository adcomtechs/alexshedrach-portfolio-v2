// components/layout/Section.jsx
// RSC — no client directive required

import { cn } from "@/lib/utils";

/**
 * Section
 *
 * Vertical rhythm and spacing unit. Every page section lives inside this
 * component. It owns vertical spacing only — no color, no border, no visual
 * treatment. Visual concerns belong to feature content or ui components.
 *
 * Layout contract:
 *   RootLayout → Section → Container → [Feature Content]
 *
 * @param {string}  as       - Rendered HTML element. Defaults to "section".
 *                             Use "div" when nesting inside another section,
 *                             "article" for standalone content units.
 * @param {string}  spacing  - Vertical padding variant.
 *                             "sm"  → 48px  (utility sections, footers)
 *                             "md"  → 80px  (standard page sections) [default]
 *                             "lg"  → 112px (major sections requiring breathing room)
 *                             "xl"  → 160px (hero-scale sections)
 *                             "none"→ 0px   (when the parent owns spacing)
 * @param {string}  id       - Optional anchor ID for in-page navigation.
 * @param {string}  className - Passthrough for one-off structural overrides.
 *                             Must not contain visual styles — use a wrapper component instead.
 */

const spacingMap = {
  none: "",
  sm: "py-12",
  md: "py-20",
  lg: "py-28",
  xl: "py-40",
};

export function Section({
  as: Tag = "section",
  spacing = "md",
  id,
  className,
  children,
  ...rest
}) {
  return (
    <Tag id={id} className={cn(spacingMap[spacing], className)} {...rest}>
      {children}
    </Tag>
  );
}
