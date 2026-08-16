// components/ui/Tag.jsx
// RSC — no client directive required

import { cn } from "@/lib/utils";

/**
 * Tag
 *
 * Filterable and selectable label. Distinct from Badge:
 *   Badge  → communicates status or semantic state (read-only, uppercase, dense)
 *   Tag    → represents a category, technology, or filter option (interactive,
 *             sentence-case, slightly larger — designed to be tapped/clicked)
 *
 * Typical use: technology stack labels on project cards, filter pills in
 * the projects index, topic labels on lab entries.
 *
 * @param {boolean}   active    - Selected/active state. Renders accent treatment.
 * @param {boolean}   clickable - Enables interactive styles and correct ARIA.
 *                                When true, pass `onClick` for handler.
 * @param {function}  onClick   - Click handler. Only consumed when `clickable` is true.
 * @param {string}    className - Layout overrides only.
 */

export function Tag({
  children,
  active = false,
  clickable = false,
  onClick,
  className,
  ...props
}) {
  return (
    <span
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? onClick : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.(e);
              }
            }
          : undefined
      }
      style={{ fontSize: "var(--text-xs)", letterSpacing: "0.01em" }}
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1",
        "font-medium border",
        "transition-colors duration-150",

        // Default (inactive, non-clickable)
        !active &&
          "bg-[var(--color-surface-2)] text-[var(--color-muted)] border-[var(--color-border)]",

        // Active state
        active &&
          "bg-[var(--color-accent-bg)] text-[var(--color-accent)] border-[rgba(181,242,61,0.3)]",

        // Clickable — hover and focus treatment
        clickable && [
          "cursor-pointer select-none",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1",
          "focus-visible:ring-offset-[var(--color-bg)]",
          // Hover when inactive
          !active &&
            "hover:bg-[var(--color-border)] hover:text-[var(--color-fg)] hover:border-[var(--color-border)]",
          // Hover when active
          active && "hover:bg-[rgba(181,242,61,0.15)]",
        ],

        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
