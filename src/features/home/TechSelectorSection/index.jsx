"use client";

// features/home/TechSelectorSection/index.jsx
//
//     "Six products across the JavaScript ecosystem, Java and Spring Boot,
//      offline-first architecture, and semantic AI — built for Nigerian
//      institutions and businesses. Select a domain to explore the decisions."
//
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TechList } from "./TechList";
import { ProjectCardViewport } from "./ProjectCardViewport";
import { TestimonialsColumn } from "./TestimonialsColumn";
import { TECH_CATEGORIES } from "@/lib/data/techSelector";
import { SelectorBottomBar } from "./SelectorBottomBar";

export default function TechSelectorSection() {
  const [activeId, setActiveId] = useState(TECH_CATEGORIES[0]?.id ?? null);

  return (
    <section
      className="relative border-t border-(--color-border-sub) overflow-hidden"
      aria-label="Work by technology domain"
    >
      {/* Ambient glow — decorative, aria-hidden */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-160 h-80 rounded-full"
        style={{
          background: "var(--color-accent)",
          opacity: 0.018,
          filter: "blur(110px)",
        }}
      />

      {/* ── Section header ──────────────────────────────────────────── */}
      <Section spacing="sm" as="div">
        <Container size="wide">
          <SectionHeader
            label="Stack"
            title="Built across the full stack."
            description="Six products across the JavaScript ecosystem, Java and Spring Boot, offline-first architecture, and semantic AI built for Nigerian institutions and businesses. Select a domain to explore the decisions."
            align="center"
          />
        </Container>
      </Section>

      {/* ── Three-column panel ──────────────────────────────────────── */}
      {/*
        No explicit height. No overflow-y-auto on any column.
        Grid height is determined by the tallest column (center project card).
        All columns stretch to fill that height via items-stretch.
        Content in each column is sized to fit without scroll.
      */}
      <div
        className="border-t border-(--color-border-sub)"
        style={{ background: "var(--color-surface)" }}
      >
        {/*
          Direct max-width div — not Container — because this panel is
          edge-to-edge within the max-width (no horizontal padding).
          Container's padding would break the column border alignment.
        */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
          <div
            className="grid items-stretch overflow-hidden rounded-xl border-x border-(--color-border-sub) lg:rounded-none lg:border-x-0 lg:grid-cols-[220px_minmax(0,1fr)_264px]"
          >
            {/* Left — category list */}
            <div className="border-b border-(--color-border-sub) lg:border-b-0 lg:border-r">
              <TechList activeId={activeId} onActivate={setActiveId} />
            </div>

            {/* Center — project card */}
            <ProjectCardViewport activeId={activeId} />

            {/* Right — testimonials */}
            <div className="border-t border-(--color-border-sub) lg:border-l lg:border-t-0">
              <TestimonialsColumn activeId={activeId} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────── */}
      <SelectorBottomBar activeId={activeId} />
    </section>
  );
}
