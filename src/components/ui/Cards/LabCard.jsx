// components/ui/LabCard.jsx
// RSC — no client directive required.
//
// Shared Design System primitive per DEC-039.
// Serves /lab index and the Home page Lab teaser.
//
// Distinct from ProjectCard:
//   ProjectCard → production systems, outcome-oriented, architectural depth
//   LabCard     → experiments, learning-oriented, type and status are primary signals
//
// The `variant` prop governs layout orientation:
//   "card"  → vertical, grid layout (default — /lab index)
//   "inline"→ horizontal, compact (Home page teaser, dense lists)

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Tag } from "@/components/ui/Tag";
import { Text } from "@/components/ui/Text";

// ─── Type configuration ───────────────────────────────────────────────────────
// Each lab entry type has a distinct label and glyph.
// The glyph is monospace — it renders in the mono font as a quick visual scan.
const TYPE_CONFIG = {
  experiment: { label: "Experiment", glyph: "⬡" },
  tool: { label: "Tool", glyph: "⬢" },
  visualization: { label: "Visualization", glyph: "◈" },
  exploration: { label: "Exploration", glyph: "◎" },
};

// ─── Status configuration ─────────────────────────────────────────────────────
// "abandoned" is a first-class status — not hidden, not de-emphasised to invisibility.
// An engineer who documents dead ends reads as more credible than one who only shows
// clean wins. It renders muted, not missing.
const STATUS_CONFIG = {
  active: { variant: "accent", label: "Active", dot: true },
  complete: { variant: "success", label: "Complete", dot: false },
  abandoned: { variant: "muted", label: "Abandoned", dot: false },
};

// ─── LabCard ─────────────────────────────────────────────────────────────────

/**
 * LabCard
 *
 * @param {Object}  entry    - Lab entry object from lab.js
 * @param {string}  variant  - "card" | "inline". Default: "card"
 * @param {string}  className - Layout overrides only.
 */
export function LabCard({ entry, variant = "card", className }) {
  const typeConfig = TYPE_CONFIG[entry.type] ?? TYPE_CONFIG.experiment;
  const statusConfig = STATUS_CONFIG[entry.status] ?? STATUS_CONFIG.complete;

  if (variant === "inline") {
    return (
      <LabCardInline
        entry={entry}
        typeConfig={typeConfig}
        statusConfig={statusConfig}
        className={className}
      />
    );
  }

  return (
    <LabCardGrid
      entry={entry}
      typeConfig={typeConfig}
      statusConfig={statusConfig}
      className={className}
    />
  );
}

// ─── Card (grid) variant ─────────────────────────────────────────────────────

function LabCardGrid({ entry, typeConfig, statusConfig, className }) {
  const isAbandoned = entry.status === "abandoned";

  return (
    <Link
      href={`/lab/${entry.slug}`}
      className={cn(
        "group flex flex-col gap-0",
        "rounded-xl border border-[var(--color-border-sub)]",
        "bg-[var(--color-surface)]",
        "overflow-hidden",
        // Hover — lift with accent glow on border
        "transition-[border-color,box-shadow,transform] duration-200",
        "hover:-translate-y-px",
        "hover:border-[rgba(181,242,61,0.2)]",
        "hover:shadow-[0_4px_24px_rgba(0,0,0,0.4),0_0_0_1px_rgba(181,242,61,0.08)]",
        isAbandoned && "opacity-70 hover:opacity-90",
        className,
      )}
    >
      {/* Top bar — type indicator */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border-sub)]"
        style={{ background: "var(--color-surface-2)" }}
      >
        {/* Type glyph + label */}
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-sm)",
              color: "var(--color-accent)",
              lineHeight: 1,
            }}
          >
            {typeConfig.glyph}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
            }}
          >
            {typeConfig.label}
          </span>
        </div>

        {/* Year */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-faint)",
          }}
        >
          {entry.year}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-4 p-5 flex-1">
        {/* Title + status */}
        <div className="flex items-start justify-between gap-3">
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-md)",
              lineHeight: "var(--leading-snug)",
              fontWeight: 600,
              color: isAbandoned ? "var(--color-muted)" : "var(--color-fg)",
            }}
            className="group-hover:text-[var(--color-fg)] transition-colors duration-150"
          >
            {entry.title}
          </h3>
          <Badge
            variant={statusConfig.variant}
            dot={statusConfig.dot}
            className="shrink-0 mt-0.5"
          >
            {statusConfig.label}
          </Badge>
        </div>

        {/* Summary */}
        <Text size="sm" color="muted" className="leading-relaxed">
          {entry.summary}
        </Text>

        {/* Influenced signal — bottom of body */}
        <InfluencedSignal influenced={entry.entry.influenced} />
      </div>

      {/* Footer — tags */}
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-5 py-4 border-t border-[var(--color-border-sub)]">
          {entry.tags.slice(0, 5).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
          {entry.tags.length > 5 && <Tag>+{entry.tags.length - 5}</Tag>}
        </div>
      )}
    </Link>
  );
}

// ─── Inline variant ──────────────────────────────────────────────────────────
// Used by the Home page Lab teaser. Horizontal, compact.

function LabCardInline({ entry, typeConfig, statusConfig, className }) {
  const isAbandoned = entry.status === "abandoned";

  return (
    <Link
      href={`/lab/${entry.slug}`}
      className={cn(
        "group flex items-start gap-4 p-4 rounded-xl",
        "border border-[var(--color-border-sub)] bg-[var(--color-surface)]",
        "transition-[border-color,background] duration-200",
        "hover:border-[rgba(181,242,61,0.15)] hover:bg-[var(--color-surface-2)]",
        isAbandoned && "opacity-70 hover:opacity-90",
        className,
      )}
    >
      {/* Glyph — type visual anchor */}
      <span
        aria-hidden
        className="shrink-0 mt-0.5"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-lg)",
          color: "var(--color-accent)",
          lineHeight: 1,
          opacity: isAbandoned ? 0.5 : 1,
        }}
      >
        {typeConfig.glyph}
      </span>

      {/* Content */}
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              color: "var(--color-fg)",
            }}
            className="group-hover:text-[var(--color-fg)] transition-colors duration-150"
          >
            {entry.title}
          </span>
          <Badge
            variant={statusConfig.variant}
            size="sm"
            dot={statusConfig.dot}
          >
            {statusConfig.label}
          </Badge>
        </div>
        <Text size="sm" color="muted">
          {entry.summary}
        </Text>
      </div>

      {/* Arrow — navigation signal */}
      <span
        aria-hidden
        className="shrink-0 mt-0.5 text-[var(--color-faint)] group-hover:text-[var(--color-accent)] transition-colors duration-150"
        style={{ fontSize: "var(--text-sm)" }}
      >
        →
      </span>
    </Link>
  );
}

// ─── InfluencedSignal ─────────────────────────────────────────────────────────
// Renders at the bottom of the card body.
// Communicates whether the experiment had production impact.
// When `influenced` is empty/falsy — renders an explicit null state.
// An absent section would silently drop a key signal.

function InfluencedSignal({ influenced }) {
  const hasInfluence = influenced && influenced.trim().length > 0;

  return (
    <div className="flex items-start gap-2 mt-auto pt-4 border-t border-[var(--color-border-sub)]">
      <span
        aria-hidden
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          color: hasInfluence ? "var(--color-accent)" : "var(--color-faint)",
          lineHeight: "var(--leading-normal)",
          flexShrink: 0,
          marginTop: "1px",
        }}
      >
        {hasInfluence ? "↳" : "○"}
      </span>
      <Text size="sm" color={hasInfluence ? "default" : "faint"}>
        {hasInfluence
          ? influenced
          : "No production influence — learning was the output."}
      </Text>
    </div>
  );
}

export default LabCard;
