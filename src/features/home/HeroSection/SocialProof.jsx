// features/home/HeroSection/SocialProof.jsx
// RSC — no client directive required.
//
// Replaces two removed components:
//
//   AvatarGroup — placeholder initials with hardcoded hex background colors
//                 are decorative, not credible. Token violation (hardcoded colors).
//
//   StarRating  — an unattributed 4.7/5 rating communicates nothing to a
//                 technical evaluator. It reads as self-assessed, which is worse
//                 than no social proof at all.
//
// Replacement: three real, verifiable metrics pulled from the HOME_METRICS data
// source — the same data feeding the Proof of Work section. Single source of truth.

import { Text } from "@/components/ui/Text";
import { HOME_METRICS } from "@/lib/data/home";

// Use the first three metrics from the shared HOME_METRICS source.
// If HOME_METRICS order changes, this component reflects that change automatically.
// The hero uses a max of 3 — the full set of 4 lives in ProofOfWorkSection.
const HERO_STATS = HOME_METRICS.slice(0, 3);

/**
 * StatItem
 *
 * A single metric: large value + small label.
 * Not a MetricBadge — MetricBadge is a surfaced panel component.
 * This is an inline stat for dense horizontal display.
 */
function StatItem({ value, label }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-md)",
          fontWeight: 700,
          color: "var(--color-fg)",
          lineHeight: "var(--leading-tight)",
          letterSpacing: "var(--tracking-tight)",
        }}
      >
        {value}
      </span>
      <Text as="span" size="sm" color="muted">
        {label}
      </Text>
    </div>
  );
}

/**
 * SocialProof
 *
 * Three horizontal stat items with separator lines.
 * Layout: [value + label] | [value + label] | [value + label]
 *
 * Entrance: hero-animate at 260ms delay — last element in the left column.
 */
export function SocialProof() {
  return (
    <div
      className="flex items-center gap-0 justify-center lg:justify-start hero-animate"
      style={{ animationDelay: "260ms" }}
    >
      {HERO_STATS.map((stat, i) => (
        <div key={stat.label} className="flex items-center">
          <div className="px-4 first:pl-0">
            <StatItem value={stat.value} label={stat.label} />
          </div>

          {/* Vertical separator — not rendered after the last item */}
          {i < HERO_STATS.length - 1 && (
            <div
              aria-hidden="true"
              className="h-8 w-px shrink-0"
              style={{ background: "var(--color-border)" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
