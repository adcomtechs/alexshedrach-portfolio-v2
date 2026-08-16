// components/layout/site-header/ThemeToggle.jsx
"use client";

import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/app/providers";

/**
 * ThemeToggle
 *
 * Sun/Moon crossfade toggle, reading from ThemeContext.
 *
 * suppressHydrationWarning is correct and intentional: the server
 * always renders dark, and the anti-FOUC inline script in layout.jsx
 * may already have applied light before hydration — that's an expected
 * mismatch, not a bug to chase.
 *
 * Theme state is read from the DOM-backed theme store in providers.jsx.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      suppressHydrationWarning
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "relative flex items-center justify-center",
        "w-7 h-7 rounded-md",
        "border border-(--color-border) bg-(--color-surface)",
        "transition-[border-color,background,color] duration-150",
        "hover:bg-(--color-surface-2) hover:text-(--color-fg)",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)",
      )}
      style={{ color: "var(--color-faint)" }}
    >
      <Sun
        size={13}
        aria-hidden="true"
        className="absolute transition-[opacity,transform] duration-200"
        style={{
          opacity: isDark ? 1 : 0,
          transform: isDark
            ? "scale(1) rotate(0deg)"
            : "scale(0.6) rotate(45deg)",
        }}
      />
      <Moon
        size={13}
        aria-hidden="true"
        className="absolute transition-[opacity,transform] duration-200"
        style={{
          opacity: isDark ? 0 : 1,
          transform: isDark
            ? "scale(0.6) rotate(-45deg)"
            : "scale(1) rotate(0deg)",
        }}
      />
    </button>
  );
}
