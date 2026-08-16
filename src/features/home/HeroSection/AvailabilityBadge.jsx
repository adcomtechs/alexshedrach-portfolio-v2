// features/home/HeroSection/AvailabilityBadge.jsx
// RSC — no client directive required.
//
// The pulse animation is driven by the status-pulse keyframe in animations.css —
// no JS state or useEffect needed. The component is purely declarative.

import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/Text";

/**
 * AvailabilityBadge
 *
 * Availability signal rendered above the hero headline.
 * Communicates open-to-work status without requiring user interaction.
 *
 * The `hero-animate` class is defined in animations.css and handles the
 * entrance animation. No animation state is managed here.
 */
export function AvailabilityBadge() {
  return (
    <div
      role="status"
      aria-label="Currently available for new work"
      className={cn(
        "inline-flex items-center gap-2 self-start",
        "px-3 py-1.5 rounded-full",
        "border border-[var(--color-border)]",
        "bg-[var(--color-surface)]",
        // Entrance animation — stagger delay 0ms (leads the sequence)
        "hero-animate",
      )}
      style={{ animationDelay: "0ms" }}
    >
      {/* Pulse indicator — status-pulse keyframe in animations.css */}
      <span aria-hidden="true" className="relative flex h-2 w-2 shrink-0">
        <span
          className="absolute inline-flex h-full w-full rounded-full opacity-75"
          style={{
            background: "var(--color-success)",
            animation: "status-pulse 2s ease-in-out infinite",
          }}
        />
        <span
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ background: "var(--color-success)" }}
        />
      </span>

      <Text
        as="span"
        size="sm"
        color="muted"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.03em" }}
      >
        Available for new work
      </Text>
    </div>
  );
}
