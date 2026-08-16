// components/ui/Progress/Progress.jsx
// RSC — no client directive required

import { cn } from "@/lib/utils";

/**
 * Progress
 *
 * Accessible linear progress indicator. Communicates completion state
 * to both visual and assistive technology users.
 *
 * @param {number}  value     - Current value. Clamped to [0, max]. Required.
 * @param {number}  max       - Maximum value. Defaults to 100.
 * @param {string}  label     - Accessible label describing what is in progress.
 *                              Surfaced to screen readers via aria-label.
 *                              Required when Progress is not accompanied by
 *                              visible descriptive text.
 * @param {string}  size      - Bar height. "sm" | "md" [default] | "lg"
 * @param {string}  className - Layout overrides only.
 *
 * Usage:
 *   <Progress value={72} label="Profile completion" />
 *   <Progress value={3} max={10} label="Step 3 of 10" size="sm" />
 */

const heights = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

export function Progress({ value, max = 100, label, size = "md", className }) {
  const clamped = Math.min(Math.max(value ?? 0, 0), max);
  const pct = max > 0 ? (clamped / max) * 100 : 0;

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={cn(
        "w-full rounded-full bg-[var(--color-border)] overflow-hidden",
        heights[size] ?? heights.md,
        className,
      )}
    >
      <div
        className="h-full bg-[var(--color-accent)] rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
