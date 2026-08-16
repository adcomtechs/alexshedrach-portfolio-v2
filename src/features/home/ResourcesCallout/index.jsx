// features/home/ResourcesCallout/index.jsx
// RSC — no client directive required.
//
// WHAT CHANGED FROM PREVIOUS VERSION:
//   ✓ RESOURCE_CATEGORIES — completely rewritten to reflect Adcomtechs' actual domain:
//       Before: Generic "System Architecture / Production Tooling / Engineering Communication"
//               (could belong to any senior Western developer's blog)
//       After:  "Architecture & Decisions / Full-Stack Patterns / Build for Nigeria"
//               (specific to this stack, this methodology, and this market)
//   ✓ Headline: "Engineering knowledge, made useful" → "Resources built by someone
//       building in Nigeria. For developers doing the same."
//               (specific over generic — names the audience immediately)
//   ✓ Description: generic "not a link dump" → explains the specific value: these
//       are the references that survive Nigerian deployment constraints, not
//       Western developer lists republished for a different audience
//   ✓ Eyebrow label: "Resources" → "Adcomtechs Resources" — brand-anchored
//   ✓ CTA label: "Explore resources" → "Browse the resources" (softer, less aggressive)
//
// ALL COMPONENT CODE IS UNCHANGED.
// Only the data (RESOURCE_CATEGORIES) and copy (headline, description, CTA label)
// were updated. The component structure, background, CategoryCard, GradientCTA,
// and layout are identical to the previous version.

import Link from "next/link";
import { ArrowRight, Layers, Code2, Globe } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// RESOURCE_CATEGORIES
//
// Three categories that reflect what Adcomtechs' /resources page actually contains.
//
// SELECTION LOGIC:
//   Category 01 — Architecture & Decisions
//     The domain-first methodology is the core of everything at Adcomtechs.
//     This category holds the templates, decision record formats, and domain
//     modelling guides used across all six products. Practical not theoretical —
//     every resource links directly to a decision made in a real project.
//
//   Category 02 — Full-Stack Patterns
//     The specific stack: Spring Boot 3 + Java 21 + Next.js 16 + TypeScript +
//     PostgreSQL. Not a generic backend-frontend guide — the exact patterns,
//     configurations, and integration approaches from the Adcomtechs codebase.
//     This is the resource Nigerian developers building on this stack can't
//     find in one place anywhere else.
//
//   Category 03 — Build for Nigeria
//     Genuinely unique in the developer resource space. Nigerian-specific:
//     Paystack integration guides, offline-first architecture for unstable
//     power and connectivity, FIRS VAT compliance, NUC academic formatting,
//     and the real-world constraints that shaped every product in this portfolio.
//     No Western developer resource list has this category. Adcomtechs does.
//
// WHY THESE THREE:
//   They map exactly to the three most differentiating things about this
//   portfolio — domain-first process, the Spring Boot + Next.js stack, and
//   the Nigerian deployment context. A visitor who came from a YouTube tutorial
//   on one of those topics will recognise immediately that this resource page
//   is for them.
//
// Icon choices:
//   Layers  → architecture, layered decisions, domain above framework
//   Code2   → the specific stack, real code patterns
//   Globe   → Nigerian/African market, local context, deployment environment
// ─────────────────────────────────────────────────────────────────────────────

const RESOURCE_CATEGORIES = [
  {
    id: "architecture",
    icon: Layers,
    label: "Architecture & Decisions",
    description:
      "ADR templates, domain modelling guides, and the exact module-boundary " +
      "patterns used across AttendIQ, GradeForge, and UniCore. " +
      "Every resource maps to a documented decision in a real Adcomtechs project.",
    // Amber — warmest, leftmost. Matches the section gradient start.
    accentColor: "#f59e0b",
    accentBg: "rgba(245,158,11,0.08)",
    accentBorder: "rgba(245,158,11,0.2)",
  },

  {
    id: "stack",
    icon: Code2,
    label: "Full-Stack Patterns",
    description:
      "Spring Boot 3 + Java 21 + Next.js 16 + TypeScript + PostgreSQL — " +
      "the specific configurations, integration approaches, and project " +
      "structures from the Adcomtechs codebase. Not generic guides. Actual patterns.",
    // Mid amber-lime — gradient midpoint, warm-to-cool transition
    accentColor: "#c8d62a",
    accentBg: "rgba(200,214,42,0.08)",
    accentBorder: "rgba(200,214,42,0.2)",
  },

  {
    id: "nigeria",
    icon: Globe,
    label: "Build for Nigeria",
    description:
      "Paystack integration, offline-first architecture for unstable connectivity, " +
      "FIRS VAT compliance, NUC academic formatting, and the Nigerian deployment " +
      "constraints that no Western developer resource list accounts for.",
    // Lime — coolest, rightmost. Matches the section gradient end.
    accentColor: "var(--color-accent)",
    accentBg: "var(--color-accent-bg)",
    accentBorder: "rgba(181,242,61,0.2)",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS — identical to previous version, no changes
// ─────────────────────────────────────────────────────────────────────────────

function CalloutBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Diagonal amber → lime wash */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #f59e0b 0%, #b5f23d 100%)",
          opacity: 0.055,
        }}
      />

      {/* Amber pool — bottom-left */}
      <div
        className="absolute rounded-full blur-[100px]"
        style={{
          width: "50%",
          height: "150%",
          bottom: "-25%",
          left: "-10%",
          background: "var(--color-warning)",
          opacity: 0.07,
        }}
      />

      {/* Lime pool — top-right */}
      <div
        className="absolute rounded-full blur-[90px]"
        style={{
          width: "40%",
          height: "130%",
          top: "-15%",
          right: "-5%",
          background: "var(--color-accent)",
          opacity: 0.06,
        }}
      />

      {/* Top accent bar — gradient, full width */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, #f59e0b 0%, #b5f23d 55%, transparent 100%)",
        }}
      />

      {/* Bottom separator */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "var(--color-border-sub)" }}
      />
    </div>
  );
}

function CategoryCard({ category }) {
  const {
    icon: Icon,
    label,
    description,
    accentColor,
    accentBg,
    accentBorder,
  } = category;

  return (
    <div
      className={cn(
        "group/card flex items-start gap-3.5",
        "rounded-xl p-4",
        "border border-[var(--color-border-sub)]",
        "bg-[var(--color-surface)]",
        "transition-[border-color,background,transform] duration-200",
        "hover:bg-[var(--color-surface-2)]",
        "hover:-translate-y-0.5",
        "hover:border-[var(--color-border)]",
        "cursor-default",
      )}
    >
      {/* Icon container */}
      <div
        className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
        aria-hidden="true"
      >
        <Icon size={16} strokeWidth={1.75} style={{ color: accentColor }} />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 min-w-0">
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            color: "var(--color-fg)",
            letterSpacing: "-0.01em",
            lineHeight: "var(--leading-snug)",
          }}
        >
          {label}
        </span>
        <Text size="sm" color="muted" className="line-clamp-2">
          {description}
        </Text>
      </div>
    </div>
  );
}

function GradientCTA({ href, label }) {
  return (
    <Link
      href={href}
      className={cn(
        "group/cta relative inline-flex items-center gap-2",
        "px-6 py-2.5 rounded-full font-semibold overflow-hidden",
        "transition-[transform,box-shadow] duration-200",
        "hover:-translate-y-px",
        "hover:shadow-[0_0_28px_rgba(245,158,11,0.2)]",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[#f59e0b] focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[var(--color-bg)]",
      )}
      style={{
        background: "var(--color-bg)",
        border: "2px solid transparent",
        backgroundImage:
          "linear-gradient(var(--color-bg), var(--color-bg)), linear-gradient(90deg, #f59e0b, #b5f23d)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      {/* Gradient fill overlay — revealed on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-200"
        style={{ background: "linear-gradient(90deg, #f59e0b, #b5f23d)" }}
      />

      {/* Label — inverts on hover */}
      <span
        className="relative z-10 transition-colors duration-200"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-sm)",
          color: "var(--color-fg)",
        }}
      >
        <span className="group-hover/cta:[color:var(--color-bg)]">{label}</span>
      </span>

      {/* Arrow — moves right on hover */}
      <ArrowRight
        size={14}
        strokeWidth={2.5}
        aria-hidden="true"
        className="relative z-10 text-[var(--color-fg)] group-hover/cta:text-[var(--color-bg)] group-hover/cta:translate-x-0.5 transition-[color,transform] duration-200"
      />
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT EXPORT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ResourcesCallout
 *
 * Compact amber → lime callout directing engineers to /resources.
 *
 * CONTENT CHANGE RATIONALE:
 *   The previous headline ("Engineering knowledge, made useful") and category
 *   labels ("System Architecture / Production Tooling / Engineering Communication")
 *   described a generic senior developer's resource collection. They communicated
 *   nothing about Adcomtechs, the Nigerian market, the Spring Boot + Next.js stack,
 *   or the domain-first methodology — the three things that differentiate this
 *   portfolio from every other developer site.
 *
 *   The updated content names the audience immediately (Nigerian developers,
 *   CS students building on this stack), describes resources that only
 *   Adcomtechs would publish (FIRS compliance, offline-first for NEPA, NUC
 *   formatting), and anchors all three categories to real projects the visitor
 *   has already read about in the case studies section above.
 */
 function ResourcesCallout() {
  return (
    <Section
      spacing="md"
      id="resources"
      aria-label="Adcomtechs engineering resources"
      className="relative border-t border-[var(--color-border-sub)]"
    >
      <CalloutBackground />

      <Container size="wide" className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ── Left: positioning copy ──────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Eyebrow — brand-anchored, not generic */}
            <div className="inline-flex items-center gap-2 w-fit">
              <span
                aria-hidden="true"
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: "#f59e0b" }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                  color: "#f59e0b",
                }}
              >
                Adcomtechs Resources
              </span>
            </div>

            {/* Headline — names the audience, not just the category */}
            <Heading as="h2" size="2" balance>
              Built by someone building{" "}
              <span
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #f59e0b 0%, #b5f23d 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                in Nigeria.
              </span>
            </Heading>

            
            <Text size="base" color="muted" style={{ maxWidth: "42ch" }}>
              Architecture decisions from real Adcomtechs projects. Spring Boot
              + Next.js 16 patterns that exist nowhere else in one place. And a
              resource category no Western developer list has ever published
              building software that works within Nigerian infrastructure.
            </Text>

            {/* CTA */}
            <div>
              <GradientCTA href="/resources" label="Browse the resources" />
            </div>
          </div>

          {/* ── Right: category cards ───────────────────────────────────── */}
          <div className="flex flex-col gap-3">
            {RESOURCE_CATEGORIES.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default ResourcesCallout;
