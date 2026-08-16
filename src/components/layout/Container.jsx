// components/layout/Container.jsx
// RSC — no client directive required
//
// FLAG: "narrow" (672px) is not in the Container sizing table logged in
// PORTFOLIO_V2_SPEC.md §7 / AI_CONTEXT.md §4 (default/wide/full only).
// Left in place since it's already load-bearing elsewhere, but this needs
// a DECISIONS.md entry (next ID: DEC-052) before it's treated as canon —
// otherwise "which container size for X" stops being a closed decision.

import { cn } from "@/lib/utils";

/**
 * Container
 *
 * Horizontal constraint and content alignment unit. Always sits inside a
 * Section. Never used as a standalone layout root.
 *
 * Layout contract:
 *   RootLayout → Section → Container → [Feature Content]
 *
 * @param {string} as       - Rendered HTML element. Defaults to "div".
 * @param {string} size     - Max-width variant.
 *                            "narrow"  → 672px  — UNLOGGED, needs DEC-052
 *                            "default" → 896px  — standard page sections [default]
 *                            "wide"    → 1152px — grid / two-column sections
 *                            "full"    → unconstrained
 * @param {string} className - Passthrough for structural overrides only.
 */

const sizes = {
  narrow: "max-w-2xl",
  default: "max-w-4xl",
  wide: "max-w-6xl",
  full: "max-w-none",
};

export function Container({
  as: Tag = "div",
  size = "default",
  className,
  children,
  ...props
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full",
        "px-4 sm:px-6 lg:px-8",
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
