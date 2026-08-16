// components/ui/Cards/Card.jsx
// RSC — no client directive required

import { cn } from "@/lib/utils";

/**
 * Card
 *
 * Structured content container. Composes into CardHeader, CardContent,
 * and CardFooter sub-components. Supports four visual variants and optional
 * interactive state with full keyboard accessibility.
 *
 * Composition pattern:
 *   <Card>
 *     <CardHeader> ... </CardHeader>
 *     <CardContent> ... </CardContent>
 *     <CardFooter> ... </CardFooter>
 *   </Card>
 *
 * CardHeader is a slot — it does not apply type styling. Compose Heading
 * or Text inside it based on the semantic context.
 *
 * @param {string}   variant     - Visual treatment.
 *                                 "default"  → surface bg, subtle border [default]
 *                                 "elevated" → surface bg, stronger border + shadow
 *                                 "flat"     → surface-2 bg, no border — for nested contexts
 *                                 "accent"   → default + accent left border — for feature callouts
 * @param {boolean}  interactive - Adds hover lift, shadow, and cursor-pointer.
 *                                 Also enables keyboard focus + Enter/Space activation
 *                                 when onClick is provided.
 * @param {function} onClick     - Click handler. When provided alongside `interactive`,
 *                                 the card becomes keyboard-activatable.
 * @param {string}   className   - Layout overrides only (width, grid span, margin).
 */

const cardVariants = {
  default: "bg-[var(--color-surface)] border border-[var(--color-border-sub)]",
  elevated:
    "bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--shadow-md)]",
  flat: "bg-[var(--color-surface-2)] border-0",
  accent:
    "bg-[var(--color-surface)] border border-[var(--color-border-sub)] " +
    "border-l-2 border-l-[var(--color-accent)]",
};

export function Card({
  variant = "default",
  interactive = false,
  onClick,
  className,
  children,
  ...props
}) {
  const isActivatable = interactive && typeof onClick === "function";

  function handleKeyDown(e) {
    if (!isActivatable) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(e);
    }
  }

  return (
    <div
      role={isActivatable ? "button" : undefined}
      tabIndex={isActivatable ? 0 : undefined}
      onClick={isActivatable ? onClick : undefined}
      onKeyDown={isActivatable ? handleKeyDown : undefined}
      className={cn(
        "rounded-xl overflow-hidden",
        cardVariants[variant] ?? cardVariants.default,
        interactive && [
          "transition-[transform,border-color,box-shadow] duration-200",
          "hover:-translate-y-0.5",
          "hover:border-[var(--color-border)]",
          "hover:shadow-[var(--shadow-lg)]",
          "cursor-pointer",
        ],
        isActivatable && [
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-[var(--color-accent)]",
          "focus-visible:ring-offset-2",
          "focus-visible:ring-offset-[var(--color-bg)]",
        ],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * CardHeader
 *
 * Top slot of the Card. Structural padding only — no type treatment applied.
 * Compose Heading or Text inside based on semantic context.
 *
 * @param {string} className - Passthrough for one-off overrides.
 */
export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("px-5 pt-5 pb-2", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * CardContent
 *
 * Primary content area. Applies body padding and muted text color via Text.
 * Accepts raw children — Text is the default wrapper but not enforced,
 * allowing rich content (lists, code blocks, component compositions).
 *
 * @param {string}  className  - Layout overrides only.
 * @param {boolean} noPadding  - Removes default padding. Use when the content
 *                               manages its own spacing (e.g., an image flush to edges).
 */
export function CardContent({
  className,
  noPadding = false,
  children,
  ...props
}) {
  return (
    <div className={cn(!noPadding && "px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * CardFooter
 *
 * Bottom slot. Separated by a top border. Typically holds actions (Button)
 * or secondary metadata. Composes Text for any copy rendered inside it.
 *
 * @param {string} className - Layout overrides only.
 */
export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "px-5 py-4",
        "border-t border-[var(--color-border-sub)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
