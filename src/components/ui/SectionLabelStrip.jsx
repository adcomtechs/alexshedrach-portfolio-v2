
// ─────────────────────────────────────────────────────────────────────────────
// SECTION LABEL STRIP
//
// A slim bordered strip above the main header.
// The "PROOF OF WORK" label uses the same mono ticker pattern as
// SectionLabel in philosophy-section.jsx — visual language consistency.
//
// "Proof of work" means exactly what it says: cryptographic-style verification
// that real work was done. The term works on two levels here — software and
// engineering credibility. It is a stronger frame than "testimonials."
// ─────────────────────────────────────────────────────────────────────────────

import { PHILOSOPHY_TESTIMONIALS } from "@/lib/data/philosophy";
import { Container } from "../layout/Container";

export function SectionLabelStrip() {
  return (
    <div
      className="border-y border-[var(--color-border-sub)] mb-16"
      style={{
        background: "color-mix(in srgb, var(--color-surface) 80%, transparent)",
      }}
    >
      <Container>
        <div
          className="flex items-center gap-3 py-3"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-faint)",
          }}
        >
          {/* Accent prefix — matches philosophy-section.jsx section label */}
          <span style={{ color: "var(--color-accent)", fontWeight: 700 }}>
            {"//"}
          </span>
          <span>Proof of work</span>

          {/* Repeating dots fill — adds visual rhythm without extra components */}
          <span
            aria-hidden="true"
            className="hidden md:block flex-1 overflow-hidden"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, var(--color-border-sub) 0, var(--color-border-sub) 1px, transparent 1px, transparent 12px)",
              height: "1px",
              marginTop: "1px",
            }}
          />

          {/* Count — number of testimonials, right-aligned */}
          <span
            className="hidden md:block ml-auto"
            style={{ color: "var(--color-faint)" }}
          >
            {String(PHILOSOPHY_TESTIMONIALS.length).padStart(2, "0")} entries
          </span>
        </div>
      </Container>
    </div>
  );
}