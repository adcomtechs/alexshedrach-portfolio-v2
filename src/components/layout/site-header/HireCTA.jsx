// components/layout/site-header/HireCTA.jsx
// RSC-compatible — genuinely, this time. The shimmer sweep is CSS-only
// (group-hover), so no event handler forces a client boundary.

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * HireCTA
 *
 * Primary hire CTA, sm+ only.
 *
 * Hover background is a color-mix lighten of --color-accent. Hover glow uses
 * --shadow-glow, which each theme can tune independently.
 * Text uses --color-accent-contrast for readable accent-backed CTAs in both
 * themes without a hardcoded fallback.
 */
export function HireCTA() {
  return (
    <Link
      href="/contact"
      className={cn(
        "hidden sm:inline-flex items-center gap-1.5",
        "group relative overflow-hidden",
        "h-9 px-4 rounded-lg",
        "bg-(--color-accent)",
        "font-bold",
        "transition-[background,box-shadow,transform] duration-150",
        "hover:-translate-y-px",
        "hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,white)]",
        "hover:shadow-(--shadow-glow)",
        "active:translate-y-0 active:shadow-none",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-(--color-accent) focus-visible:ring-offset-2",
        "focus-visible:ring-offset-(--color-bg)",
      )}
      style={{
        color: "var(--color-accent-contrast)",
        fontSize: "var(--text-sm)",
      }}
    >
      {/* Shimmer sweep — pure CSS, driven by the parent's `group` hover
          state. No JS, no handlers, no client boundary needed. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 pointer-events-none",
          "opacity-0 group-hover:opacity-100",
          "transition-opacity duration-150",
        )}
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.14) 50%, transparent 60%)",
        }}
      />
      Hire me
      <ArrowUpRight size={13} aria-hidden="true" />
    </Link>
  );
}
