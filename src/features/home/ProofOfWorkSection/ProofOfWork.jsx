// features/home/ProofOfWork/ProofOfWork.jsx
// RSC — no client directive required.
//
// FILE SPLIT:
//   ProofOfWork.jsx        (this file) — section shell, data, layout
//   TelemetryPanel.jsx                 — left panel, RSC
//     └── ScreenshotCarousel.jsx       — use client, nested inside left panel
//   SignalPanel.jsx                    — right panel, RSC
//
// LAYOUT CONTRACT:
//   Section → Container → SectionHeader + OpenBook
//
// The standalone ProjectCarousel that previously sat below the panels
// has been removed. The screenshot carousel now lives inside TelemetryPanel,
// filling the vertical space below the metrics grid.

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { TelemetryPanel } from "./TelemetryPanel";
import { SignalPanel } from "./SignalPanel";
import { Children } from "react";

// ─── Static data ─────────────────────────────────────────────────────────────
//
// Move to /data/proofOfWork.js once content matures.
// screenshot: path relative to /public — swap in real paths when ready.

export const METRICS = [
  {
    value: "2",
    label: "Vanilla JS domain models that became Spring Boot service specs",
    trend: "neutral",
    project: "GradeForge + Ledgera",
  },
  {
    value: "5+",
    label: "Nigerian university grading scale variants",
    trend: "up",
    project: "GradeForge",
  },
  {
    value: "100%",
    label: "Offline transaction recovery in simulated scenarios",
    trend: "up",
    project: "VendaCore",
  },
  {
    value: "<400ms",
    label: "Semantic search response — design target",
    trend: "up",
    project: "ScholarSync",
  },
];

export const SIGNALS = [
  {
    project: "AttendIQ",
    category: "architecture",
    text: "Zero duplicate attendance records are architecturally possible. Single-use nonce enforcement operates at the PostgreSQL unique constraint level, not application code a forwarded QR code cannot register a second student regardless of when or where it is scanned.",
  },
  {
    project: "VendaCore",
    category: "tested behaviour",
    text: "Every sale is written to IndexedDB before the network is consulted. The POS terminal continues processing transactions through full power outages. When connectivity returns, the queue flushes in FIFO order with idempotency key deduplication no sale is recorded twice.",
  },
  {
    project: "GradeForge + Ledgera",
    category: "architecture",
    text: "Both had complete, correctly behaving domain models in plain vanilla JavaScript no framework, no database, no dependencies before Spring Boot or Next.js was introduced. Those prototypes became the specification documents for the subsequent backend services.",
  },
  {
    project: "GradeForge",
    category: "architecture",
    text: "Handles five Nigerian university grading scale variants (UNN 5-point, UNILAG 4-point, UI, OAU, NOUN) from one configurable engine with grade scales stored as institution records in the database adding a new institution requires no application code change.",
  },
];

// screenshot: null until real screenshots are captured.
// When ready: set screenshot to "/images/projects/{id}.png"
// and replace PlaceholderSlide with next/image in ScreenshotCarousel.jsx.
export const PROJECTS = [
  {
    id: "attendiq",
    name: "AttendIQ",
    slug: "attendiq",
    screenshot: null,
    category: "architecture fact",
  },
  {
    id: "vendacore",
    name: "VendaCore",
    slug: "vendacore",
    screenshot: null,
    category: "tested behaviour",
  },
  {
    id: "gradeforge",
    name: "GradeForge",
    slug: "gradeforge",
    screenshot: null,
    category: "architecture fact",
  },
  {
    id: "ledgera",
    name: "Ledgera",
    slug: "ledgera",
    screenshot: null,
    category: "architecture fact",
  },
  {
    id: "scholarsync",
    name: "ScholarSync",
    slug: "scholarsync",
    screenshot: null,
    category: "design target",
  },
];

const FOOTNOTE =
  "Metrics are categorised by type: architecture facts (verifiable from codebase structure), tested behaviours (confirmed in controlled scenarios), or documented design targets (stated explicitly as targets not production measurements).";

// ─── ProofOfWork ─────────────────────────────────────────────────────────────

export function ProofOfWork() {
  return (
    <Section id="proof-of-work" spacing="sm">
      <Container size="full">
        {/* Header row — label/title/description left, CTA right */}
        <div className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            label="Proof of work"
            title="Output measured, not claimed."
            description="Architecture facts, tested behaviours, and documented design targets every number is sourced, categorised, and honest about what it measures."
            className="mb-0"
          />
          <div className="shrink-0">
            <Button variant="outline" size="md" href="/projects">
              See the work
              <span aria-hidden style={{ marginLeft: "4px" }}>
                →
              </span>
            </Button>
          </div>
        </div>

        {/* Open-book two-panel layout */}
        <OpenBook>
          <TelemetryPanel metrics={METRICS} projects={PROJECTS} />
          <SignalPanel signals={SIGNALS} footnote={FOOTNOTE} />
        </OpenBook>
      </Container>
    </Section>
  );
}

// ─── OpenBook ────────────────────────────────────────────────────────────────
//
// Single bordered container housing both panels side by side.
// Vertical spine sits between them: a 1px column whose gradient
// fades at top/bottom and peaks at accent midway — structural, not decorative.
//
// gridTemplateColumns: "1fr auto 1fr" — panels share space equally.
// The spine column is `auto` so it takes only its own 1px width.

function OpenBook({ children }) {
  const panels = Children.toArray(children);

  return (
    <div
      className="grid grid-cols-1 overflow-hidden rounded-xl border lg:rounded-2xl lg:[grid-template-columns:minmax(0,1fr)_auto_minmax(0,1fr)]"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow:
          "0 0 0 1px var(--color-border-sub), 0 1px 40px rgba(0,0,0,0.4)",
      }}
    >
      <div className="min-w-0">{panels[0]}</div>
      <Spine />
      <div className="min-w-0 border-t border-[var(--color-border-sub)] lg:border-t-0">
        {panels[1]}
      </div>
    </div>
  );
}

function Spine() {
  return (
    <div
      aria-hidden
      className="hidden lg:block"
      style={{
        width: "1px",
        alignSelf: "stretch",
        background:
          "linear-gradient(to bottom, var(--color-border-sub) 0%, var(--color-border) 15%, var(--color-accent) 45%, var(--color-border) 85%, var(--color-border-sub) 100%)",
        opacity: 0.45,
        flexShrink: 0,
      }}
    />
  );
}

export default ProofOfWork;
