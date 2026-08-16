// features/lab/LabEntryLayout.jsx
// RSC — no client directive required.
//
// Detail page layout for individual lab entries. Lives in features/lab/
// per DEC-016 logic — data-coupled, lab-domain only. Not a shared primitive.
//
// Deliberately lighter than CaseStudyLayout:
//   - No StickyOutline — three sections do not warrant sidebar navigation
//   - No Testimonial — lab entries are personal learning records, not client work
//   - No MetricsStrip — lab outcomes are findings, not KPIs
//
// Section order:
//   Hero (type · title · summary · status · tags · year · links)
//   Exploration (what was explored and why)
//   Findings    (what was learned — failed experiments included)
//   Influenced  (production impact, or explicit null state)
//   Prev/Next navigation

import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";

// ─── Status / type config (mirrors LabCard) ───────────────────────────────────

const TYPE_CONFIG = {
  experiment: { label: "Experiment", glyph: "⬡" },
  tool: { label: "Tool", glyph: "⬢" },
  visualization: { label: "Visualization", glyph: "◈" },
  exploration: { label: "Exploration", glyph: "◎" },
};

const STATUS_CONFIG = {
  active: { variant: "accent", label: "Active", dot: true },
  complete: { variant: "success", label: "Complete", dot: false },
  abandoned: { variant: "muted", label: "Abandoned", dot: false },
};

// ─── LabEntryLayout ───────────────────────────────────────────────────────────

/**
 * LabEntryLayout
 *
 * @param {Object}      entry    - Single lab entry object from lab.js
 * @param {Object|null} previous - Adjacent entry (lower index) or null
 * @param {Object|null} next     - Adjacent entry (higher index) or null
 */
export function LabEntryLayout({ entry, previous, next }) {
  const typeConfig = TYPE_CONFIG[entry.type] ?? TYPE_CONFIG.experiment;
  const statusConfig = STATUS_CONFIG[entry.status] ?? STATUS_CONFIG.complete;
  const hasInfluence =
    entry.entry.influenced && entry.entry.influenced.trim().length > 0;

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <Section spacing="sm" className="relative">
        <SectionBackground variant="editorial" />

        <Container size="wide" className="relative z-10">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb
              items={[{ label: "Lab", href: "/lab" }, { label: entry.title }]}
            />
          </div>

          {/* Type eyebrow */}
          <div className="flex items-center gap-2 mb-4">
            <span
              aria-hidden
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-md)",
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
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
              }}
            >
              {typeConfig.label}
            </span>
          </div>

          {/* Title */}
          <Heading as="h1" size="1" balance className="mb-4 max-w-2xl">
            {entry.title}
          </Heading>

          {/* Summary */}
          <Text size="lg" color="muted" className="mb-6 max-w-xl">
            {entry.summary}
          </Text>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge variant={statusConfig.variant} dot={statusConfig.dot}>
              {statusConfig.label}
            </Badge>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-faint)",
              }}
            >
              {entry.year}
            </span>

            {/* Divider */}
            {(entry.demoUrl || entry.repoUrl || entry.sourceUrl) && (
              <span aria-hidden className="h-3 w-px bg-[var(--color-border)]" />
            )}

            {/* Links — renders only when fields are populated per DEC-032 pattern */}
            {entry.demoUrl && (
              <Button variant="ghost" size="sm" href={entry.demoUrl} external>
                Live Demo ↗
              </Button>
            )}
            {entry.repoUrl && (
              <Button variant="ghost" size="sm" href={entry.repoUrl} external>
                Repository ↗
              </Button>
            )}
            {entry.sourceUrl && (
              <Button variant="ghost" size="sm" href={entry.sourceUrl} external>
                Reference ↗
              </Button>
            )}
          </div>

          {/* Tags */}
          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {entry.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* ── Prose sections ────────────────────────────────────────────────── */}
      <Section spacing="sm" className="relative">
        <SectionBackground variant="minimal" />

        <Container size="default" className="relative z-10">
          <div className="flex flex-col gap-14">
            <LabSection
              id="exploration"
              label="Exploration"
              glyph="01"
              content={entry.entry.exploration}
            />
            <LabSection
              id="findings"
              label="Findings"
              glyph="02"
              content={entry.entry.findings}
            />
            <InfluencedSection
              id="influenced"
              content={entry.entry.influenced}
              hasInfluence={hasInfluence}
            />
          </div>
        </Container>
      </Section>

      {/* ── Prev / Next navigation ────────────────────────────────────────── */}
      {(previous || next) && (
        <Section
          spacing="md"
          className="relative border-t border-[var(--color-border-sub)]"
        >
          <Container size="default" className="relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Previous */}
              <div>
                {previous ? (
                  <AdjacentLink direction="previous" entry={previous} />
                ) : null}
              </div>
              {/* Next */}
              <div className="sm:text-right">
                {next ? <AdjacentLink direction="next" entry={next} /> : null}
              </div>
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}

// ─── LabSection ───────────────────────────────────────────────────────────────
// Internal sub-component. Not exported — not a shared primitive.

function LabSection({ id, label, glyph, content }) {
  return (
    <div id={id} className="flex flex-col gap-4">
      {/* Section label row */}
      <div className="flex items-baseline gap-3">
        <span
          aria-hidden
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-faint)",
            letterSpacing: "0.06em",
          }}
        >
          {glyph}
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
          }}
        >
          {label}
        </h2>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-[var(--color-border-sub)]" />

      {/* Content */}
      <Text size="base" color="default" className="leading-relaxed">
        {content}
      </Text>
    </div>
  );
}

// ─── InfluencedSection ────────────────────────────────────────────────────────
// Renders the production influence section with an explicit null state.
// When empty — renders clearly, not silently absent.

function InfluencedSection({ id, content, hasInfluence }) {
  return (
    <div id="influenced" className="flex flex-col gap-4">
      {/* Section label row */}
      <div className="flex items-baseline gap-3">
        <span
          aria-hidden
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-faint)",
            letterSpacing: "0.06em",
          }}
        >
          03
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
          }}
        >
          Production Influence
        </h2>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-[var(--color-border-sub)]" />

      {/* Content or explicit null state */}
      {hasInfluence ? (
        <Text size="base" color="default" className="leading-relaxed">
          {content}
        </Text>
      ) : (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-sub)]">
          <span
            aria-hidden
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-sm)",
              color: "var(--color-faint)",
              lineHeight: "var(--leading-normal)",
              flexShrink: 0,
            }}
          >
            ○
          </span>
          <Text size="sm" color="faint">
            This experiment did not influence any production system. Learning
            was the output.
          </Text>
        </div>
      )}
    </div>
  );
}

// ─── AdjacentLink ─────────────────────────────────────────────────────────────

function AdjacentLink({ direction, entry }) {
  const isPrev = direction === "previous";

  return (
    <Link
      href={`/lab/${entry.slug}`}
      className="group flex flex-col gap-1 p-4 rounded-xl border border-[var(--color-border-sub)] hover:border-[rgba(181,242,61,0.2)] transition-[border-color] duration-200"
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          letterSpacing: "0.06em",
          color: "var(--color-faint)",
        }}
      >
        {isPrev ? "← Previous" : "Next →"}
      </span>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-sm)",
          fontWeight: 600,
          color: "var(--color-muted)",
        }}
        className="group-hover:text-[var(--color-fg)] transition-colors duration-150"
      >
        {entry.title}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          color: "var(--color-faint)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {TYPE_CONFIG[entry.type]?.label ?? entry.type}
      </span>
    </Link>
  );
}
