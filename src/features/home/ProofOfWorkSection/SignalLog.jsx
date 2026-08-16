// features/home/ProofOfWorkSection/SignalLog.jsx
//
// WHAT CHANGED FROM PREVIOUS VERSION:
//
//     01 — AttendIQ nonce enforcement: the most technically specific
//          correctness claim in the portfolio. "Enforced at constraint level"
//          is a named, verifiable architectural fact.
//     02 — VendaCore offline-first: the single most differentiated product
//          in terms of deployment context. "Operates through full power outages"
//          is a concrete, testable claim about what the system actually does.
//     03 — Domain-first methodology: the process claim that appears in
//          PRINCIPLES, ABOUT_EXTENDED, and the case studies. Naming it
//          here in the signal log closes the loop across all four sections.
//     04 — GradeForge multi-institution: an architecture decision with a
//          specific technical consequence — one configurable engine with
//          zero special-casing. Verifiable from the calculation service code.
//
//   The SIGNAL_LOG constant is co-located with SignalLog because only this
//   component consumes it. Extract to lib/data when a second consumer appears.

import { Text } from "@/components/ui/Text";

// ── Data ──────────────────────────────────────────────────────────────────────
//
// Four proof statements — one per signal log row.
// Each corresponds to a verifiable architectural decision in a named project.
// href values will link to project case study anchors when available (Phase 3).
//
// Content standard:
//   - Every signal names a specific project
//   - Every signal names the specific mechanism, not just the outcome
//   - No generic "best practice" statements
//   - Nothing that cannot be verified in the codebase or architecture docs

const SIGNAL_LOG = [
  {
    id: "attendiq-nonce",
    signal:
      "AttendIQ — zero duplicate attendance records are architecturally possible. " +
      "Single-use nonce enforcement operates at the PostgreSQL unique constraint level, " +
      "not application code — a forwarded QR code cannot register a second student regardless " +
      "of when or where it is scanned.",
    // href: "/projects/attendiq#nonce-architecture" — enable in Phase 3
    href: null,
  },

  {
    id: "vendacore-offline",
    signal:
      "VendaCore — every sale is written to IndexedDB before the network is consulted. " +
      "The POS terminal continues processing transactions through full power outages. " +
      "When connectivity returns, the queue flushes in FIFO order with idempotency key " +
      "deduplication — no sale is recorded twice.",
    // href: "/projects/vendacore#offline-architecture" — enable in Phase 3
    href: null,
  },

  {
    id: "domain-first",
    signal:
      "GradeForge and Ledgera both had complete, correctly behaving domain models " +
      "in plain vanilla JavaScript — no framework, no database, no dependencies — " +
      "before Spring Boot or Next.js was introduced. Those prototypes became " +
      "the specification documents for the subsequent backend services.",
    // href: "/projects/gradeforge#domain-first" — enable in Phase 3
    href: null,
  },

  {
    id: "gradeforge-engine",
    signal:
      "GradeForge handles five Nigerian university grading scale variants " +
      "(UNN 5-point, UNILAG 4-point, UI, OAU, NOUN) from one configurable engine " +
      "with grade scales stored as institution records in the database — " +
      "adding a new institution requires no application code change.",
    // href: "/projects/gradeforge#grading-engine" — enable in Phase 3
    href: null,
  },
];

// ── SignalLogEntry ─────────────────────────────────────────────────────────────
//
// All component code below is unchanged from previous version.
// Only the SIGNAL_LOG data above was updated.

function SignalLogEntry({ entry, index }) {
  const isLinked = Boolean(entry.href);
  const Tag = isLinked ? "a" : "div";

  return (
    <Tag
      href={isLinked ? entry.href : undefined}
      className="group flex items-start gap-4 py-3.5"
      style={{
        borderTop: index > 0 ? "1px solid var(--color-border-sub)" : undefined,
        ...(isLinked && {
          cursor: "pointer",
          textDecoration: "none",
          borderRadius: "4px",
          transition: "background 150ms ease",
        }),
      }}
    >
      {/* Record number */}
      <span
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.5rem",
          color: "var(--color-faint)",
          letterSpacing: "0.1em",
          flexShrink: 0,
          marginTop: "3px",
          opacity: 0.5,
          minWidth: "18px",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Verified glyph — info blue */}
      <span
        aria-label="Verified"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          color: "var(--color-info)",
          flexShrink: 0,
          lineHeight: "var(--leading-normal)",
          opacity: 0.9,
        }}
      >
        ✓
      </span>

      {/* Signal text */}
      <Text
        as="span"
        size="sm"
        color="muted"
        style={{
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.01em",
          lineHeight: "var(--leading-relaxed)",
        }}
      >
        {entry.signal}
      </Text>
    </Tag>
  );
}

// ── SignalLog ──────────────────────────────────────────────────────────────────

export function SignalLog() {
  return (
    <div style={{ borderTop: "1px solid var(--color-border-sub)" }}>
      {/* Log header */}
      <div
        className="flex items-center gap-3 px-6 py-3"
        style={{ borderBottom: "1px solid var(--color-border-sub)" }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.5rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-info)",
            fontWeight: 600,
          }}
        >
          Signal log
        </span>

        {/* Count badge */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.5rem",
            letterSpacing: "0.06em",
            color: "var(--color-faint)",
            background: "var(--color-surface-2)",
            border: "1px solid var(--color-border)",
            padding: "1px 6px",
            borderRadius: "3px",
          }}
        >
          {SIGNAL_LOG.length} verified
        </span>

        <div className="flex-1" aria-hidden="true" />
      </div>

      {/* Log entries */}
      <div className="px-6 py-1">
        {SIGNAL_LOG.map((entry, i) => (
          <SignalLogEntry key={entry.id} entry={entry} index={i} />
        ))}
      </div>
    </div>
  );
}
