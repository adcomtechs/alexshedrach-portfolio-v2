import { useCountUp } from "@/hooks/useCountUp";
import React, { memo } from "react";

const PROOF_POINTS = [
  {
    icon: LayoutGrid,
    value: 12,
    display: "12",
    suffix: "+",
    label: "Products shipped to production",
    barWidth: "90%",
  },
  {
    icon: Code2,
    value: 5,
    display: "5",
    suffix: " yrs",
    label: "Industry engineering experience",
    barWidth: "75%",
  },
  {
    icon: Cpu,
    value: 3,
    display: "3",
    suffix: "×",
    label: "AI-integrated systems built",
    barWidth: "60%",
  },
  {
    icon: Users,
    value: 40,
    display: "40k",
    suffix: "+",
    label: "Users across shipped products",
    barWidth: "95%",
  },
];

/** Single proof-point stat with animated count and progress bar */
const ProofStat = memo(function ProofStat({
  icon: Icon,
  value,
  display,
  suffix,
  label,
  barWidth,
  index,
}) {
  const isRaw = display.includes("k");
  const numTarget = isRaw ? parseInt(display) : value;

  const { count, ref } = useCountUp(numTarget, {
    duration: 1600,
    delay: index * 120,
  });

  // Display: if original uses "k" shorthand, show "Xk"; else show raw count
  const formattedCount = isRaw ? `${count}k` : String(count);

  return (
    <div
      ref={ref}
      className={cn(
        "group relative flex flex-col gap-3 px-5 py-5",
        "bg-[var(--color-surface)]",
        "hover:bg-[var(--color-surface-2)] transition-colors duration-150",
        "focus-within:bg-[var(--color-surface-2)]",
      )}
    >
      {/* Icon chip */}
      <div className="w-7 h-7 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] flex items-center justify-center transition-colors duration-150 group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-accent-bg)]">
        <Icon
          size={13}
          className="text-[var(--color-muted)] transition-colors duration-150 group-hover:text-[var(--color-accent)]"
          aria-hidden="true"
        />
      </div>

      {/* Animated number */}
      <div
        aria-label={`${display}${suffix} — ${label}`}
        className="text-2xl font-semibold tracking-tight leading-none text-[var(--color-fg)]"
      >
        {formattedCount}
        <span className="text-sm text-[var(--color-accent)] ml-0.5">
          {suffix}
        </span>
      </div>

      {/* Label */}
      <p className="text-xs text-[var(--color-muted)] leading-snug">{label}</p>

      {/* Animated progress bar — subtle visual weight indicator */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px] origin-left rounded-full"
        style={{
          width: barWidth,
          background: "var(--color-accent)",
          opacity: 0.25,
          animation:
            "progress-fill 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards",
          animationDelay: `${200 + index * 120}ms`,
          animationFillMode: "both",
        }}
      />
    </div>
  );
});

function ProveBar() {
  return (
    <div className="mt-16 flex flex-col gap-5">
      {/* Section overline */}
      <p
        className="text-[11px] font-medium uppercase tracking-[0.09em] text-[var(--color-faint)] hero-animate-fade"
        style={{ animationDelay: "360ms" }}
        aria-hidden="true"
      >
        By the numbers
      </p>

      {/* Stat grid with animated count-up */}
      <div
        role="region"
        aria-label="Engineering statistics"
        className={cn(
          "grid grid-cols-2 md:grid-cols-4",
          "rounded-xl overflow-hidden",
          "border border-[var(--color-border-sub)]",
          "gap-px bg-[var(--color-border-sub)]",
          "hero-animate",
        )}
        style={{ animationDelay: "400ms" }}
      >
        {PROOF_POINTS.map((point, i) => (
          <ProofStat key={point.label} {...point} index={i} />
        ))}
      </div>
    </div>
  );
}

export default ProveBar;
