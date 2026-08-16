// components/layout/site-header/StatusBadge.jsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * StatusBadge
 *
 * Pulsing availability badge, sm+ only, with a hover/focus tooltip.
 *
 * Hover state now derives from --color-success via color-mix and the
 * existing --color-success-bg token, instead of hand-picked
 * rgba(34,197,94,...) literals — same visual result, but it responds
 * to the token system instead of bypassing it (DESIGN_SYSTEM.md §2.2).
 */
export function StatusBadge() {
  const [tipVisible, setTipVisible] = useState(false);

  return (
    <div className="relative hidden sm:block">
      <button
        onMouseEnter={() => setTipVisible(true)}
        onMouseLeave={() => setTipVisible(false)}
        onFocus={() => setTipVisible(true)}
        onBlur={() => setTipVisible(false)}
        aria-label="Currently available for new work"
        aria-describedby="status-tip"
        className={cn(
          "inline-flex items-center gap-1.5 cursor-default",
          "h-7 px-3 rounded-full",
          "border border-(--color-border) bg-(--color-surface)",
          "transition-[border-color,background] duration-150",
          "hover:border-[color-mix(in_srgb,var(--color-success)_35%,transparent)]",
          "hover:bg-(--color-success-bg)",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)",
        )}
        style={{
          fontSize: "var(--text-xs)",
          fontWeight: 500,
          color: "var(--color-muted)",
        }}
      >
        <span className="relative flex w-2 h-2" aria-hidden="true">
          <span
            className="status-pulse absolute inline-flex h-full w-full rounded-full"
            style={{ background: "var(--color-success)", opacity: 0.5 }}
          />
          <span
            className="relative inline-flex rounded-full w-2 h-2"
            style={{ background: "var(--color-success)" }}
          />
        </span>
        Available
      </button>

      <div
        id="status-tip"
        role="tooltip"
        className={cn(
          "absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50",
          "w-48 px-3 py-2 rounded-lg text-center leading-snug",
          "bg-(--color-surface-2) border border-(--color-border)",
          "pointer-events-none",
          "transition-[opacity,transform] duration-150",
          tipVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
        )}
        style={{
          fontSize: "var(--text-xs)",
          color: "var(--color-muted)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        Open to full-time &amp; contract roles
        <span
          aria-hidden="true"
          className="absolute -top-1.25 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 rounded-sm bg-(--color-surface-2) border-t border-l border-(--color-border)"
        />
      </div>
    </div>
  );
}
