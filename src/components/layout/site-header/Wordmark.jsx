// components/layout/site-header/Wordmark.jsx
// RSC-compatible — no client hooks

import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Wordmark
 *
 * Brand mark used in both the desktop header and the mobile drawer header.
 * Animated square mark with hover accent treatment.
 * Extracted as a standalone component so both surfaces stay in sync.
 */
export function Wordmark() {
  return (
    <Link
      href="/"
      aria-label="Alex Shedrach — home"
      className={cn(
        "flex items-center gap-2.5 shrink-0 group",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[var(--color-accent)] rounded-sm",
      )}
    >
      {/* Animated square mark */}
      <span
        aria-hidden="true"
        className={cn(
          "relative flex items-center justify-center",
          "w-6 h-6 rounded-[5px] shrink-0",
          "border border-[var(--color-border)] bg-[var(--color-surface-2)]",
          "transition-[background,border-color] duration-200",
          "group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-accent-bg)]",
        )}
      >
        <span
          className="w-2 h-2 rounded-sm"
          style={{
            background: "var(--color-accent)",
            transition: "transform 0.2s ease",
          }}
        />
      </span>

      {/* Name */}
      <span
        className="text-[14px] font-semibold"
        style={{
          fontFamily: "var(--font-display)",
          letterSpacing: "-0.02em",
          color: "var(--color-fg)",
        }}
      >
        Alex <span style={{ color: "var(--color-accent)" }}>Shedrach</span>
      </span>
    </Link>
  );
}
