// features/home/ProofOfWorkSection/index.jsx

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { PROOF_HOME_METRICS } from "@/lib/data/home";

import { SectionBackground } from "./SectionBackground";
import { TelemetryHeader } from "./TelemetryHeader";
import { PrimaryMetric } from "./PrimaryMetric";
import { SecondaryMetric } from "./SecondaryMetric";
import { SignalLog } from "./SignalLog";

function ArrowRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

// ── PanelFootnote ──────────────────────────────────────────────────────────────

/**
 * PanelFootnote
 *
 * Closes the telemetry panel with an honest disclosure of the metric
 * classification system used in PROOF_HOME_METRICS.
 *
 * UPDATED: Removed "All metrics drawn from production systems" (inaccurate).
 * Replaced with the three-category standard: architecture facts, tested
 * behaviours, documented design targets.
 */
function PanelFootnote() {
  return (
    <div className="flex items-start gap-3 mt-6">
      <div
        aria-hidden="true"
        className="h-px w-8 shrink-0 rounded-full mt-[0.6em]"
        style={{
          background:
            "linear-gradient(to right, var(--color-info), transparent)",
        }}
      />
      <Text as="span" size="sm" color="faint">
        Metrics are categorised by type: architecture facts (verifiable from
        codebase structure), tested behaviours (confirmed in controlled
        scenarios), or documented design targets (stated explicitly as targets —
        not production measurements).
      </Text>
    </div>
  );
}

// ── ProofOfWorkSection ─────────────────────────────────────────────────────────

function ProofOfWorkSection() {
  const primaryMetric = PROOF_HOME_METRICS.find((m) => m.featured);
  const secondaryMetrics = PROOF_HOME_METRICS.filter((m) => !m.featured);

  return (
    <Section
      spacing="md"
      id="proof-of-work"
      aria-label="Proof of work and engineering output"
      className="relative"
    >
      <SectionBackground />

      <Container size="wide" className="relative">
        {/* ── Section header + CTA ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <SectionHeader
            label="Proof of Work"
            title="Output measured, not claimed."
            // UPDATED: removed "real systems in production" (inaccurate).
            // The description now names the three metric categories used in the data.
            description="Architecture facts, tested behaviours, and documented design targets — every number is sourced, categorised, and honest about what it measures."
            className="mb-0"
          />

          <div className="shrink-0">
            <Button
              href="/projects"
              variant="outline"
              size="sm"
              rightIcon={<ArrowRightIcon />}
            >
              See the work
            </Button>
          </div>
        </div>

        {/* ── Telemetry panel ───────────────────────────────────────────── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            border: "1px solid var(--color-border-sub)",
            background: "var(--color-surface)",
            boxShadow: [
              "0 0 0 1px var(--color-border-sub)",
              "0 24px 80px rgba(0,0,0,0.45)",
              "0 8px 24px rgba(0,0,0,0.3)",
              "inset 0 1px 0 rgba(96,165,250,0.07)",
              "inset 0 -1px 0 rgba(0,0,0,0.2)",
            ].join(", "),
          }}
        >
          <TelemetryHeader />

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr]">
            {primaryMetric && <PrimaryMetric metric={primaryMetric} />}

            <div className="flex flex-col border-t border-[var(--color-border-sub)] lg:border-t-0 lg:divide-y lg:divide-[var(--color-border-sub)]">
              {secondaryMetrics.map((metric, i) => (
                <SecondaryMetric
                  key={metric.label}
                  metric={metric}
                  isLast={i === secondaryMetrics.length - 1}
                />
              ))}
            </div>
          </div>

          <SignalLog />
        </div>

        <PanelFootnote />
      </Container>
    </Section>
  );
}

export default ProofOfWorkSection;
