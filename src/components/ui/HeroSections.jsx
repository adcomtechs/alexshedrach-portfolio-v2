// components/ui/HeroSection/HeroSection.jsx
// RSC — no client directive required.
//
// Two layout variants:
//   "centered" — full-width centered heading, description, and optional CTAs.
//                Reference: Image 1 (large bold hero, two-button CTA row).
//   "split"    — left text column + right identity card.
//                Reference: Image 2 (contact/hire hero with profile card).
//
// SectionBackground variant is passed by the consumer — not hardcoded here.
// Container sizing follows DEC-024: per-section, not per-page.
//   centered → default (896px)   — prose-weight content
//   split    → wide (1152px)     — two-column grid
//
// Internal sub-components (Eyebrow, CenteredLayout, SplitLayout, IdentityCard)
// are not exported. Consumers compose via props, not sub-component assembly.

import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// ── Shared: Eyebrow ──────────────────────────────────────────────────────────
//
// Mono-label treatment — accent dot + uppercase tracking.
// Consistent with SectionHeader and CaseStudy label patterns across the system.

function Eyebrow({ label }) {
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full shrink-0"
        style={{ background: "var(--color-accent)" }}
      />
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          letterSpacing: "0.09em",
          textTransform: "uppercase",
          color: "var(--color-accent)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Centered Layout ──────────────────────────────────────────────────────────
//
// Large centered heading — designed for pages where the primary job is
// immediate positioning with no competing information structure.
// Vertical rhythm: eyebrow → heading → description → CTAs → trust line.
//
// @param {string}   eyebrow          - Mono label (optional)
// @param {string}   heading          - Primary heading text
// @param {string}   description      - Supporting paragraph (optional)
// @param {{label:string, href:string}} primaryCta   - Primary CTA (optional)
// @param {{label:string, href:string}} secondaryCta - Secondary CTA (optional)
// @param {string}   trustLine        - Sub-CTA trust signal text (optional)

function CenteredLayout({
  eyebrow,
  heading,
  description,
  primaryCta,
  secondaryCta,
  trustLine,
}) {
  return (
    <div
      className="flex flex-col items-center text-center"
      style={{ paddingTop: "5rem", paddingBottom: "5rem", gap: "2rem" }}
    >
      {eyebrow && <Eyebrow label={eyebrow} />}

      {/* Primary heading — display scale, balanced text wrapping */}
      <Heading as="h1" size="display" balance style={{ maxWidth: "52rem" }}>
        {heading}
      </Heading>

      {/* Description — muted, readable line length */}
      {description && (
        <p
          style={{
            fontSize: "var(--text-lg)",
            lineHeight: "var(--leading-relaxed)",
            color: "var(--color-muted)",
            maxWidth: "38rem",
            textWrap: "pretty",
          }}
        >
          {description}
        </p>
      )}

      {/* CTA row — primary fills, secondary outlines */}
      {(primaryCta || secondaryCta) && (
        <div
          className="flex items-center flex-wrap justify-center"
          style={{ gap: "1rem" }}
        >
          {primaryCta && (
            <Button asChild variant="primary" size="lg">
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
          )}
          {secondaryCta && (
            <Button asChild variant="secondary" size="lg">
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          )}
        </div>
      )}

      {/* Trust / meta line — smallest text, faint, below CTAs */}
      {trustLine && (
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-faint)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {trustLine}
        </p>
      )}
    </div>
  );
}

// ── Identity Card ────────────────────────────────────────────────────────────
//
// Right column of the split layout.
// Surface: --color-surface with border — elevated one level from bg.
// Structure (top to bottom):
//   Header  — avatar with availability dot, name, mono role title
//   Bio     — short prose statement
//   Metrics — 2–3 rows: accent value + divider + muted label
//   Stack   — pill badges, bottom border-top section
//
// @param {{
//   initials: string,
//   name: string,
//   title: string,
//   bio: string,
//   metrics: { value: string, label: string }[],
//   stack: string[],
//   available: boolean
// }} card

function IdentityCard({ card }) {
  const {
    initials,
    name,
    title,
    bio,
    metrics = [],
    stack = [],
    available,
  } = card;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        // Subtle shadow lifts the card off the section
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* ── Header: avatar + identity ──────────────────────────────────── */}
      <div
        className="flex items-center gap-4 p-6"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        {/* Avatar — accent fill, initials, availability dot */}
        <div className="relative shrink-0">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: "3.5rem",
              height: "3.5rem",
              background: "var(--color-accent)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-md)",
                fontWeight: 700,
                color: "#000",
                letterSpacing: "0.02em",
              }}
            >
              {initials}
            </span>
          </div>

          {/* Availability dot — renders regardless of state, color indicates status */}
          <span
            aria-hidden="true"
            className="absolute -bottom-0.5 -right-0.5 rounded-full"
            style={{
              width: "0.75rem",
              height: "0.75rem",
              background: available
                ? "var(--color-success)"
                : "var(--color-faint)",
              border: "2px solid var(--color-surface)",
            }}
          />
        </div>

        {/* Name + mono role */}
        <div className="min-w-0 flex-1">
          <p
            style={{
              fontWeight: 600,
              fontSize: "var(--text-md)",
              color: "var(--color-fg)",
              lineHeight: "var(--leading-snug)",
            }}
          >
            {name}
          </p>
          <p
            className="truncate"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--color-muted)",
              marginTop: "0.25rem",
            }}
          >
            {title}
          </p>
        </div>
      </div>

      {/* ── Bio ───────────────────────────────────────────────────────────── */}
      {bio && (
        <p
          className="px-6 pt-5 pb-4"
          style={{
            fontSize: "var(--text-sm)",
            lineHeight: "var(--leading-relaxed)",
            color: "var(--color-fg)",
          }}
        >
          {bio}
        </p>
      )}

      {/* ── Metrics ───────────────────────────────────────────────────────── */}
      {metrics.length > 0 && (
        <div
          className="px-6 pb-5"
          style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}
        >
          {metrics.map((metric, i) => (
            <div key={i} className="flex items-baseline gap-3">
              {/* Accent value — mono, heavy */}
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xl)",
                  fontWeight: 700,
                  color: "var(--color-accent)",
                  minWidth: "3.5rem",
                  lineHeight: 1,
                }}
              >
                {metric.value}
              </span>

              {/* Thin vertical divider */}
              <span
                aria-hidden="true"
                style={{
                  width: "1px",
                  height: "1.125rem",
                  background: "var(--color-border)",
                  flexShrink: 0,
                  alignSelf: "center",
                }}
              />

              {/* Label — muted, wraps on narrow card */}
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-muted)",
                  lineHeight: "var(--leading-snug)",
                }}
              >
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Stack badges ──────────────────────────────────────────────────── */}
      {stack.length > 0 && (
        <div
          className="px-6 py-4 flex flex-wrap gap-2"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          {stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full px-3 py-1"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-muted)",
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Availability Signal (split layout inline) ────────────────────────────────
//
// Distinct from the shared AvailabilitySignal component (DEC-038).
// This inline version is local to the split hero — it does not carry the
// pulse animation to avoid competing with the hero heading.

function InlineAvailabilitySignal({ available, label }) {
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="size-2 rounded-full shrink-0"
        style={{
          background: available ? "var(--color-success)" : "var(--color-faint)",
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-sm)",
          color: available ? "var(--color-accent)" : "var(--color-muted)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Meta Strip ───────────────────────────────────────────────────────────────
//
// Dot-separated metadata below the availability signal.
// Accepts two optional groups, separated by a pipe character.
// Example: ["Product Licensing", "Custom Builds"] | ["WAT", "UTC+1", "Nsukka, NG"]

function MetaStrip({ groupA = [], groupB = [] }) {
  const hasA = groupA.length > 0;
  const hasB = groupB.length > 0;
  if (!hasA && !hasB) return null;

  return (
    <p
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-xs)",
        color: "var(--color-faint)",
        lineHeight: "var(--leading-normal)",
      }}
    >
      {hasA && groupA.join(" · ")}
      {hasA && hasB && (
        <span
          style={{
            margin: "0 0.5rem",
            color: "var(--color-border)",
          }}
          aria-hidden="true"
        >
          |
        </span>
      )}
      {hasB && groupB.join(" · ")}
    </p>
  );
}

// ── Callout Box ───────────────────────────────────────────────────────────────
//
// Accent left-border callout — surfaces response time or a key trust signal.
// Not a full Alert component; intentionally minimal and inline with the split layout.

function CalloutBox({ heading, description }) {
  return (
    <div
      className="rounded-lg p-4"
      style={{
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-border-sub)",
        borderRight: "1px solid var(--color-border-sub)",
        borderBottom: "1px solid var(--color-border-sub)",
        borderLeft: "2px solid var(--color-accent)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-sm)",
          fontWeight: 600,
          color: "var(--color-fg)",
          lineHeight: "var(--leading-snug)",
        }}
      >
        {heading}
      </p>
      {description && (
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-muted)",
            marginTop: "0.25rem",
            lineHeight: "var(--leading-normal)",
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

// ── Split Layout ─────────────────────────────────────────────────────────────
//
// Two-column at lg+, stacked on mobile.
// Left column (wider): eyebrow → heading → description → availability →
//                      meta strip → callout box
// Right column: IdentityCard
//
// @param {string}   eyebrow           - Mono label (optional)
// @param {string}   heading           - Primary heading text
// @param {string}   description       - Supporting paragraph (optional)
// @param {{ available: boolean, label: string }} availability - (optional)
// @param {{ groupA: string[], groupB: string[] }} meta - (optional)
// @param {{ heading: string, description: string }} callout - (optional)
// @param {object}   card              - IdentityCard data (optional)

function SplitLayout({
  eyebrow,
  heading,
  description,
  availability,
  meta,
  callout,
  card,
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 items-start",
        card ? "lg:grid-cols-[1fr_400px]" : "lg:grid-cols-1",
        "gap-12 lg:gap-16",
      )}
      style={{ paddingTop: "5rem", paddingBottom: "5rem" }}
    >
      {/* ── Left column: text content ────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {eyebrow && <Eyebrow label={eyebrow} />}

        {/* Heading — h1 scale in split layout; narrower column handles width */}
        <Heading as="h1" size="1">
          {heading}
        </Heading>

        {description && (
          <p
            style={{
              fontSize: "var(--text-base)",
              lineHeight: "var(--leading-relaxed)",
              color: "var(--color-muted)",
              maxWidth: "42rem",
              textWrap: "pretty",
            }}
          >
            {description}
          </p>
        )}

        {/* Availability + meta strip — grouped, tighter internal spacing */}
        {(availability || meta) && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.625rem",
            }}
          >
            {availability && (
              <InlineAvailabilitySignal
                available={availability.available}
                label={availability.label}
              />
            )}
            {meta && <MetaStrip groupA={meta.groupA} groupB={meta.groupB} />}
          </div>
        )}

        {/* Callout box — response time or key trust signal */}
        {callout && (
          <CalloutBox
            heading={callout.heading}
            description={callout.description}
          />
        )}
      </div>

      {/* ── Right column: identity card ──────────────────────────────────── */}
      {card && <IdentityCard card={card} />}
    </div>
  );
}

// ── HeroSection ──────────────────────────────────────────────────────────────
//
// Public API. Consumers pass layout + backgroundVariant + layout-specific props.
//
// @param {"centered"|"split"} layout
//   Controls the internal layout structure. Defaults to "centered".
//
// @param {string} backgroundVariant
//   Passed through to SectionBackground. Must exist in SECTION_BACKGROUND_VARIANTS.
//   No default — consumers must declare a variant per the decision log.
//
// @param {boolean} glow
//   Passed through to SectionBackground. Defaults to true.
//
// @param {number} noiseOpacity
//   Override for SectionBackground noise layer (optional).
//
// Centered-specific props:
//   eyebrow, heading, description, primaryCta, secondaryCta, trustLine
//
// Split-specific props:
//   eyebrow, heading, description, availability, meta, callout, card
//
// Usage (centered):
//   <HeroSection
//     layout="centered"
//     backgroundVariant="aurora"
//     eyebrow="About"
//     heading="Built for systems that hold."
//     description="Engineering decisions, not biography."
//     primaryCta={{ label: "View Projects", href: "/projects" }}
//     secondaryCta={{ label: "Read Writing", href: "/writing" }}
//     trustLine="100% decisions, 0% personality tests."
//   />
//
// Usage (split):
//   <HeroSection
//     layout="split"
//     backgroundVariant="editorial"
//     eyebrow="Contact"
//     heading="Let's work together."
//     description="Open to product licensing, custom builds, and consulting."
//     availability={{ available: true, label: "Open for new work" }}
//     meta={{ groupA: ["Product Licensing", "Consulting"], groupB: ["WAT", "Nsukka, NG"] }}
//     callout={{ heading: "Replies within 24 hours", description: "Every message gets a specific answer — not a template." }}
//     card={{ initials: "AS", name: "Alex Shedrach", title: "Full-stack software developer", ... }}
//   />

export function HeroSections({
  layout = "centered",
  backgroundVariant,
  glow = true,
  noiseOpacity,
  ...props
}) {
  return (
    <Section className="relative">
      {backgroundVariant && (
        <SectionBackground
          variant={backgroundVariant}
          glow={glow}
          noiseOpacity={noiseOpacity}
        />
      )}

      {/*
        Container sizing per DEC-024 (per-section, not per-page):
          centered → default (896px) — the heading is the content, no grid
          split    → wide (1152px)  — two-column grid needs room
      */}
      <Container size={layout === "split" ? "wide" : "default"}>
        {layout === "centered" ? (
          <CenteredLayout {...props} />
        ) : (
          <SplitLayout {...props} />
        )}
      </Container>
    </Section>
  );
}
