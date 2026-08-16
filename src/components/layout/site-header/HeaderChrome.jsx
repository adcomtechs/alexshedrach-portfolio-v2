// components/layout/site-header/HeaderChrome.jsx
"use client";

import { cn } from "@/lib/utils";
import { useScrollState } from "@/hooks/useScrollState";
import { ScrollProgress } from "./ScrollProgress";

/**
 * HeaderChrome
 *
 * Owns the single piece of client-only state the header needs: scroll
 * position. Everything else in the header tree is static markup and
 * stays server-rendered — this is the smallest possible client boundary,
 * not the whole header. See DESIGN_SYSTEM.md §4.2.
 *
 * Background is a token-derived translucency, not a hardcoded rgba —
 * `color-mix` keeps it correct across both themes without a second
 * hardcoded value in [data-theme="light"].
 */
export function HeaderChrome({ children }) {
  const { scrolled, progress } = useScrollState();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        "border-b transition-[background-color,border-color] duration-200",
        scrolled ? "border-(--color-border-sub)" : "border-transparent",
      )}
      style={{
        backgroundColor: scrolled
          ? "color-mix(in srgb, var(--color-bg) 88%, transparent)"
          : "transparent",
        backdropFilter: scrolled ? "blur(14px) saturate(1.4)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px) saturate(1.4)" : "none",
      }}
    >
      {scrolled && <ScrollProgress progress={progress} />}
      {children}
    </header>
  );
}
