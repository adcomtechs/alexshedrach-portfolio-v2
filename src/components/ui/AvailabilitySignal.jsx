// components/ui/AvailabilitySignal.jsx
// RSC — no client directive required.
//
// Shared primitive. Renders in three locations per DEC-029 and DEC-038:
//   1. Projects index hero
//   2. Site navigation
//   3. Contact page hero
//
// Renders nothing when available === false — no "unavailable" state,
// no placeholder. Absence is the signal.
//
// Data source: siteConfig from @/lib/config/site.js
// Caller is responsible for passing the config — this component does
// not import siteConfig directly, keeping it pure and testable.
//
// @param {boolean}  available    - Whether to render at all.
// @param {string}   label        - Status label. e.g. "Open for new work"
// @param {string[]} types        - Work types. Rendered as a compact list.
// @param {string}   timezone     - Timezone string. e.g. "WAT · UTC+1 · Nsukka, NG"
// @param {string}   size         - "sm" | "md" [default]
//                                  "sm" — nav usage, compact dot + label only
//                                  "md" — hero usage, dot + label + optional meta row

import { cn } from "@/lib/utils";

export function AvailabilitySignal({
  available,
  label,
  types = [],
  timezone,
  size = "md",
  className,
}) {
  if (!available) return null;

  const isCompact = size === "sm";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Primary signal — dot + label */}
      <div className="inline-flex items-center gap-2.5">
        {/* Pulsing dot — status-pulse keyframe in animations.css */}
        <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
          <span
            className="absolute inline-flex h-full w-full rounded-full status-pulse"
            style={{ background: "var(--color-success)", opacity: 0.6 }}
          />
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ background: "var(--color-success)" }}
          />
        </span>

        <span
          style={{
            fontSize: isCompact ? "var(--text-xs)" : "var(--text-sm)",
            color: "var(--color-success)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.02em",
          }}
        >
          {label}
        </span>
      </div>

      {/* Meta row — types + timezone. Hidden in compact (nav) mode. */}
      {!isCompact && (types.length > 0 || timezone) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {types.length > 0 && (
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-faint)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {types.join(" · ")}
            </span>
          )}

          {timezone && types.length > 0 && (
            <span
              aria-hidden="true"
              className="w-px h-3 shrink-0"
              style={{ background: "var(--color-border)" }}
            />
          )}

          {timezone && (
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-faint)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {timezone}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default AvailabilitySignal;
