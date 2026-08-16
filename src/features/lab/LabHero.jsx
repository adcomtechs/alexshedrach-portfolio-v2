// features/lab/LabHero.jsx
// RSC — no client directive required. No interactivity, no browser APIs,
// no local state. Adding "use client" here would violate the rendering
// strategy in AI_CONTEXT.md §4 (client boundaries are a ledger entry,
// not a default) and DESIGN_SYSTEM.md §7.
//
// Establishes the Lab as distinct from /projects before the visitor
// reaches the entry grid. Cold arrivals (from search, shared links)
// must understand the purpose of this section without Home page context.
//
// SectionBackground variant: "aurora" — per DEC-043.
// Verify "aurora" exists in SECTION_BACKGROUND_VARIANTS before deploying
// (blocking prerequisite, ROADMAP.md Phase 5).
//
// Entrance motion follows the DEC-008 pattern (CSS-only staggered
// entrance via the `.hero-animate` utility in animations.css) so this
// hero reads consistently with the Home hero rather than as a bespoke
// treatment. Reduced-motion is handled globally in animations.css —
// no local media query needed here.

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

/**
 * LabHero
 *
 * @param {number} [entryCount=0] - Total lab entries. Renders the count
 *   signal below the framing copy. In practice this is always >= 1,
 *   since the spec requires at least one complete entry live before
 *   /lab links in navigation (PORTFOLIO_V2_SPEC.md §6.5) — the guard
 *   exists purely so this component doesn't assume that invariant.
 */
export function LabHero({ entryCount = 0 }) {
  return (
    <Section spacing="sm" className="relative">
      <SectionBackground variant="aurora" />

      {/* Prose-only hero content — default Container (896px), not wide.
          Wide is reserved for grid/card sections per the Container
          Sizing Reference (DESIGN_SYSTEM.md §3) and the precedent set
          by every other hero in the system. */}
      <Container size="default" className="relative z-10">
        {/* Eyebrow */}
        <div
          className="mb-5 flex items-center gap-2 hero-animate sm:mb-6"
          style={{ animationDelay: "0ms" }}
        >
          <span
            aria-hidden
            className="size-1.5 shrink-0 rounded-full bg-(--color-accent) animate-pulse-soft"
          />
          <span className="font-mono text-xs uppercase tracking-wide text-(--color-accent)">
            The Lab
          </span>
        </div>

        {/* Heading */}
        <Heading
          as="h1"
          size="1"
          balance
          className="mb-4 max-w-2xl hero-animate sm:mb-5"
          style={{ animationDelay: "80ms" }}
        >
          Where ideas are tested,{" "}
          <span className="text-(--color-muted)">not just shipped.</span>
        </Heading>

        {/* Framing copy — establishes what the lab is and is not.
            This is the load-bearing content for cold arrivals: it must
            work with zero Home page context. */}
        <div
          className="mb-7 flex max-w-xl flex-col gap-3 hero-animate sm:mb-8"
          style={{ animationDelay: "160ms" }}
        >
          <Text size="lg" color="muted">
            Not every idea becomes a product. These are the experiments,
            explorations, and tools built outside of production constraints —
            where the goal is to learn, not to ship.
          </Text>
          <Text size="base">
            Failed experiments are documented here alongside complete ones. The
            findings are the output, not the demo.
          </Text>
        </div>

        {/* Entry count signal */}
        {entryCount > 0 && (
          <div
            className="flex flex-wrap items-center gap-3 hero-animate"
            style={{ animationDelay: "240ms" }}
          >
            <span className="font-mono text-xs tracking-wide text-(--color-accent-dim)">
              {entryCount} {entryCount === 1 ? "entry" : "entries"}
            </span>
            <span
              aria-hidden
              className="h-px w-10 shrink-0 bg-(--color-border)"
            />
            <span className="font-mono text-xs tracking-wide text-(--color-muted)">
              experiments · tools · explorations
            </span>
          </div>
        )}
      </Container>
    </Section>
  );
}
