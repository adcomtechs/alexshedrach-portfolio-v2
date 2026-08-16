// components/ui/Spinner/Spinner.jsx
// RSC — no client directive required

import { cn } from "@/lib/utils";

/**
 * Spinner
 *
 * Standalone loading indicator. Use for full-section or page-level loading
 * states. For button-level loading, use the spinner built into Button.
 *
 * Always pair with a visible loading message when the context permits —
 * the aria-label on this component is the fallback for AT users only.
 *
 * @param {string}  size      - "sm" | "md" [default] | "lg"
 * @param {string}  label     - Accessible label for screen readers.
 *                              Defaults to "Loading". Override when more
 *                              specific context is available ("Sending message").
 * @param {string}  className - Layout overrides (centering, margin).
 */

const sizes = {
  sm: "w-4 h-4 border-[1.5px]",
  md: "w-5 h-5 border-2",
  lg: "w-8 h-8 border-[2.5px]",
};

export function Spinner({ size = "md", label = "Loading", className }) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        "rounded-full animate-spin",
        "border-[var(--color-border)] border-t-[var(--color-accent)]",
        sizes[size] ?? sizes.md,
        className,
      )}
    />
  );
}
