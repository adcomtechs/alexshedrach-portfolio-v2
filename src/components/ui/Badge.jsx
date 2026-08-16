// components/ui/Badge.jsx
// RSC — no client directive required

import { cn } from "@/lib/utils";

/**
 * Badge
 *
 * Label and classification component. Communicates status, category, or
 * semantic state. Distinct from MetricBadge: Badge classifies, MetricBadge evidences.
 *
 * @param {string}   variant  - Semantic color variant.
 *                              "accent"  → green brand [default-ish, high signal]
 *                              "success" → positive / live / active
 *                              "warning" → caution / beta / pending
 *                              "danger"  → error / deprecated / destructive
 *                              "info"    → neutral informational
 *                              "muted"   → no semantic weight [default]
 * @param {string}   size     - "sm" | "md" [default]
 *                              "sm" is appropriate for dense UI (tables, code annotations).
 *                              "md" is the standard inline badge.
 * @param {boolean}  dot      - Prepends a colored status dot matching the variant.
 *                              Use for live/active/status signals where the dot
 *                              communicates state faster than the text alone.
 *                              The dot renders with a subtle pulse on "success" and "accent"
 *                              to reinforce a "live" signal.
 * @param {string}   className - Layout overrides only.
 */

const variants = {
  accent:
    "bg-[var(--color-accent-bg)] text-[var(--color-accent)] border border-[rgba(181,242,61,0.3)]",
  success:
    "bg-[var(--color-success-bg)] text-[var(--color-success)] border border-[rgba(34,197,94,0.3)]",
  warning:
    "bg-[var(--color-warning-bg)] text-[var(--color-warning)] border border-[rgba(245,158,11,0.3)]",
  danger:
    "bg-[var(--color-danger-bg)] text-[var(--color-danger)] border border-[rgba(239,68,68,0.3)]",
  info: "bg-[var(--color-info-bg)] text-[var(--color-info)] border border-[rgba(96,165,250,0.3)]",
  muted:
    "bg-[var(--color-surface-2)] text-[var(--color-muted)] border border-[var(--color-border)]",
};

// Dot color maps to the text color of the variant — always inherits correctly.
// Pulsing dot on "live" variants (accent, success) signals active state.
const dotConfig = {
  accent: { pulse: true },
  success: { pulse: true },
  warning: { pulse: false },
  danger: { pulse: false },
  info: { pulse: false },
  muted: { pulse: false },
};

const sizes = {
  sm: "px-1.5 py-0.5 text-[0.65rem] gap-1 rounded",
  md: "px-2   py-0.5 text-xs        gap-1.5 rounded",
};

export function Badge({
  variant = "muted",
  size = "md",
  dot = false,
  className,
  children,
  ...props
}) {
  const { pulse } = dotConfig[variant] ?? { pulse: false };

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold uppercase",
        // Letter spacing via style — 0.06em is tighter than the token (0.04em)
        // but wider than default. Uppercase labels at xs need this range.
        sizes[size] ?? sizes.md,
        variants[variant] ?? variants.muted,
        className,
      )}
      style={{ letterSpacing: "0.06em" }}
      {...props}
    >
      {dot && (
        <span
          aria-hidden
          className={cn(
            "shrink-0 rounded-full",
            size === "sm" ? "size-1" : "size-1.5",
            "bg-current",
            pulse && "animate-[dot-pulse_2.5s_ease-in-out_infinite]",
          )}
        />
      )}
      {children}
    </span>
  );
}
