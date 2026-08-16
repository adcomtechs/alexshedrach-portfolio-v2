// components/ui/Button/Button.jsx
// RSC-compatible — no client directive required.
// onClick handlers are passed through; the component itself is not interactive.

import { cn } from "@/lib/utils";

/**
 * Button
 *
 * Full-spectrum button component. Renders as <button> by default,
 * or as <a> when `href` is provided.
 *
 * @param {string}    variant   - Visual variant. See variant map below.
 *                                "primary" | "secondary" | "outline" | "ghost" |
 *                                "danger"  | "glow"      | "glass"   | "gradient" |
 *                                "invert"  | "muted"
 *                                Default: "primary"
 * @param {string}    size      - "xs" | "sm" | "md" | "lg" | "xl". Default: "md"
 * @param {boolean}   pill      - Fully rounded corners (rounded-full).
 * @param {boolean}   loading   - Shows spinner. Disables interaction.
 * @param {boolean}   disabled  - Disables interaction.
 * @param {ReactNode} leftIcon  - Icon slot rendered before children.
 *                                Pass an icon component at the correct size — the
 *                                Button sets `gap` but does not enforce icon sizing.
 * @param {ReactNode} rightIcon - Icon slot rendered after children.
 * @param {string}    href      - Renders as <a> when provided.
 * @param {boolean}   external  - Adds target="_blank" rel="noopener noreferrer".
 * @param {string}    className - Layout overrides only. Do not use for visual overrides.
 */

// ── Variant map ────────────────────────────────────────────────────────────────
//
// Color convention:
//   Buttons that sit on the accent background use --color-accent-contrast
//   so text remains readable in both dark and light themes.

const variants = {
  primary:
    "bg-[var(--color-accent)] text-[var(--color-accent-contrast)] border-[var(--color-accent)] " +
    "hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,white)] hover:border-[color-mix(in_srgb,var(--color-accent)_88%,white)] " +
    "hover:-translate-y-px hover:shadow-[var(--shadow-glow)] " +
    "before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",

  secondary:
    "bg-[var(--color-surface-2)] text-[var(--color-fg)] border-[var(--color-border)] " +
    "hover:bg-[var(--color-border-sub)] hover:border-[var(--color-border)]",

  outline:
    "bg-transparent text-[var(--color-accent)] border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] " +
    "hover:bg-[var(--color-accent-bg)] hover:border-[var(--color-accent)] " +
    "hover:shadow-[0_0_0_3px_var(--color-accent-bg)]",

  ghost:
    "bg-transparent text-[var(--color-muted)] border-transparent " +
    "hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)] hover:border-[var(--color-border-sub)]",

  danger:
    "bg-[var(--color-danger-bg)] text-[var(--color-danger)] border-[color-mix(in_srgb,var(--color-danger)_25%,transparent)] " +
    "hover:bg-[color-mix(in_srgb,var(--color-danger)_15%,transparent)] hover:border-[var(--color-danger)] " +
    "hover:shadow-[0_0_0_3px_var(--color-danger-bg)]",

  glow:
    "bg-[var(--color-accent)] text-[var(--color-accent-contrast)] border-[var(--color-accent)] font-bold " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] " +
    "hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,white)] hover:border-[color-mix(in_srgb,var(--color-accent)_88%,white)] " +
    "hover:-translate-y-0.5 " +
    "hover:shadow-[var(--shadow-glow),_inset_0_1px_0_rgba(255,255,255,0.2)] " +
    "active:translate-y-0 active:shadow-[var(--shadow-sm)]",

  glass:
    "bg-[color-mix(in_srgb,var(--color-surface)_72%,transparent)] text-[var(--color-fg)] border-[var(--color-border-sub)] backdrop-blur-md " +
    "hover:bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] hover:border-[var(--color-border)] " +
    "hover:-translate-y-px hover:shadow-[var(--shadow-md)]",

  gradient:
    "bg-[length:200%_100%] bg-[position:right_center] font-bold text-[var(--color-accent-contrast)] " +
    "[background-image:linear-gradient(125deg,_var(--color-accent-dim)_0%,_var(--color-accent)_50%,_color-mix(in_srgb,var(--color-accent)_70%,white)_100%)] " +
    "border-[var(--color-accent-dim)] " +
    "hover:bg-[position:left_center] " +
    "hover:shadow-[var(--shadow-glow)] " +
    "hover:-translate-y-px " +
    "transition-[background-position,box-shadow,transform,border-color]",

  invert:
    "bg-[var(--color-fg)] text-[var(--color-bg)] border-[var(--color-fg)] font-bold " +
    "hover:opacity-90 hover:-translate-y-px " +
    "hover:shadow-[var(--shadow-md)]",

  muted:
    "bg-transparent text-[var(--color-faint)] border-transparent " +
    "hover:text-[var(--color-muted)] hover:bg-[var(--color-surface-2)]",
};

// ── Size map ────────────────────────────────────────────────────────────────────
const sizes = {
  xs: "h-7  px-2.5 text-[0.725rem] gap-1.5 rounded-[5px]",
  sm: "h-[34px] px-3.5 text-[0.8125rem] gap-1.5",
  md: "h-10 px-[1.125rem] text-[0.875rem] gap-2",
  lg: "h-12 px-6  text-[0.9375rem] gap-2.5 rounded-[10px]",
  xl: "h-14 px-8  text-base gap-3 rounded-xl font-bold",
};

// ── Spinner ─────────────────────────────────────────────────────────────────────
function Spinner({ className }) {
  return (
    <svg
      className={cn("animate-spin shrink-0", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ── Button ──────────────────────────────────────────────────────────────────────
export function Button({
  children,
  onClick,
  href,
  variant = "primary",
  size = "md",
  pill = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  download,
  external = false,
  className,
  ...props
}) {
  // Base — shared by every variant and size.
  const base = [
    "inline-flex items-center justify-center",
    "rounded-lg border font-medium",
    "cursor-pointer select-none",
    "relative overflow-hidden",
    "whitespace-nowrap",
    "transition-[background,border-color,color,box-shadow,transform,opacity] duration-150",
    // Shimmer sweep
    "before:absolute before:inset-0",
    "before:bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.1)_50%,transparent_60%)]",
    "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500",
    // Focus ring
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
    "focus-visible:ring-offset-[var(--color-bg)]",
    // Disabled state
    "disabled:opacity-40 disabled:pointer-events-none",
    // Press feedback
    "active:scale-[0.995] active:translate-y-px",
  ].join(" ");

  const classes = cn(
    base,
    variants[variant] ?? variants.primary,
    sizes[size] ?? sizes.md,
    pill && "rounded-full",
    className,
  );

  // Icon sizing derived from size prop — icons match the button's text scale.
  const iconSize =
    {
      xs: "w-3 h-3",
      sm: "w-3.5 h-3.5",
      md: "w-4 h-4",
      lg: "w-4 h-4",
      xl: "w-5 h-5",
    }[size] ?? "w-4 h-4";

  const content = (
    <>
      {loading && <Spinner className={iconSize} />}
      {!loading && leftIcon && (
        <span
          className={cn("shrink-0 inline-flex", iconSize)}
          aria-hidden="true"
        >
          {leftIcon}
        </span>
      )}
      <span
        className={cn(
          "inline-flex items-center gap-[inherit]",
          loading && "opacity-60",
        )}
      >
        {children}
      </span>
      {!loading && rightIcon && (
        <span
          className={cn("shrink-0 inline-flex", iconSize)}
          aria-hidden="true"
        >
          {rightIcon}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        download={download}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
}

export default Button;
