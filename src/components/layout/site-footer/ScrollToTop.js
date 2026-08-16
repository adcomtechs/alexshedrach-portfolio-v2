// components/layout/site-footer/ScrollToTop.jsx
"use client";

import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrolled } from "@/hooks/useScrolled";

/**
 * ScrollToTop
 *
 * Fixed button that fades in after the user scrolls 400px.
 * Smooth-scrolls to the top on click.
 * Pointer-events disabled when invisible — does not interfere with
 * content underneath.
 */
export function ScrollToTop() {
  const visible = useScrolled(400);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className={cn(
        "fixed bottom-2 right-6 z-40",
        "w-10 h-10 rounded-full",
        "border border-[var(--color-border)] bg-[var(--color-surface-2)]",
        "text-[var(--color-muted)]",
        "flex items-center justify-center",
        "transition-all duration-300",
        "hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)]",
        "hover:text-[var(--color-accent)]",
        "hover:shadow-[0_0_20px_rgba(181,242,61,0.25)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none",
      )}
    >
      <ArrowUp size={15} aria-hidden="true" />
    </button>
  );
}
