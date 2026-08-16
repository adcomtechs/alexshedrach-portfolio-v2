// features/about/AboutTeaser.jsx
"use client";
//
// Client boundary is justified:
//   - useState for modal open/close
//
// Refinements vs. previous version:
//
//   1. ProfilePanel replaces the inline profile image + AboutStats composition.
//      `mode` prop controls whether stats or a secondary image renders below
//      the primary profile image. Change the prop at the call site — no code
//      changes inside this component.
//
//   2. onMouseEnter/onMouseLeave on Link and button elements → Button component.
//      All hover states are now CSS-only via Button's internal variant system.
//      No inline style mutations anywhere in this file.
//
//   3. max-w-[1200px] → Section + Container (wide).
//      Aligns with the established layout contract.
//      The AboutTeaser did not previously use the layout system — corrected here.
//
//   4. Secondary CTA (full page link) uses Button variant="ghost".
//      Primary CTA (modal open) uses Button variant="primary".
//      Resume download uses Button variant="secondary".
//      All three were previously raw anchor/button elements with inline hover.

import { useState } from "react";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { AboutModal } from "./AboutModal";
import { ABOUT_INTRO } from "@/lib/data/about";
import { ProfilePanel } from "@/components/ui/ProfileImage";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

// Inline ArrowRight — replace with lucide-react import if available
function ArrowRightIcon({ size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
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

// ── AboutTeaser ────────────────────────────────────────────────────────────────

/**
 * AboutTeaser
 *
 * Home-page entry point for /about. Left column is ProfilePanel — switch
 * `panelMode` between "stats" and "image" to change what renders below
 * the primary profile image.
 *
 * PROP TO CHANGE:
 *   panelMode="stats"   → shows AboutStats below the primary image
 *   panelMode="image"   → shows secondary image in 3D treatment
 *
 * Update `secondarySrc` to the second image path when ready.
 */
export default function AboutTeaser() {
  const [modalOpen, setModalOpen] = useState(false);

  // ── CONFIGURE HERE ─────────────────────────────────────────────────────────
  // Toggle between "stats" and "image" to switch the left column mode.
  const panelMode = "image"; // "stats" | "image"
  const primarySrc = "/images/alex-profile.png";
  const secondarySrc = "/images/alex-profile-2.png"; // update when ready
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <>
      <Section
        as="section"
        id="about"
        spacing="md"
        aria-labelledby="about-teaser-heading"
        className="relative border-t border-[var(--color-border-sub)] overflow-hidden"
      >
        {/* Background: subtle architectural grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-border) 1px, transparent 1px), " +
              "linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Left accent bar */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-[10%] bottom-[10%] w-[2px] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent, var(--color-accent) 30%, var(--color-accent) 70%, transparent)",
            opacity: 0.5,
          }}
        />

        <Container size="wide" className="relative">
          {/* Section label */}
          <div
            className="flex items-center gap-4 mb-14"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--color-faint)",
            }}
          >
            <span style={{ color: "var(--color-accent)", fontWeight: 700 }}>
              [Builder]
            </span>
            <span>A note on how I build.</span>
            <span
              aria-hidden="true"
              className="flex-1 h-px"
              style={{ background: "var(--color-border-sub)" }}
            />
          </div>

          {/* Two-column layout */}
          <div className="grid lg:grid-cols-[320px_1fr] gap-14 items-start">
            {/* ── Left: ProfilePanel ──────────────────────────────────────── */}
            {/*
              Change `panelMode` at the top of this component to switch between
              stats and the secondary image. No changes needed here.
            */}
            <div className="flex flex-col gap-4">
              <ProfilePanel
                primarySrc={primarySrc}
                primaryAlt={ABOUT_INTRO.imageAlt}
                secondarySrc={secondarySrc}
                secondaryAlt="Alex Shedrach — alternate"
                mode={panelMode}
              />

              {/* Full page CTA — below the panel, full width */}
              <Button
                href="/about"
                variant="ghost"
                size="sm"
                className="w-full justify-center"
                rightIcon={<ArrowRightIcon />}
              >
                {ABOUT_INTRO.fullPageLabel}
              </Button>
            </div>

            {/* ── Right: copy column ──────────────────────────────────────── */}
            <div className="flex flex-col gap-8">
              {/* Headline + subheading */}
              <div className="flex flex-col gap-3">
               <Heading
                  as="h2"
                  size="3"
                  balance
                  id="about-teaser-heading"
                  // style={{
                  //   fontFamily: "var(--font-display)",
                  //   fontSize: "var(--text-xl)",
                  //   fontWeight: 800,
                  //   color: "var(--color-fg)",
                  //   letterSpacing: "var(--tracking-tight)",
                  //   lineHeight: "var(--leading-tight)",
                  // }}
                >
                  {ABOUT_INTRO.headline}
                </Heading>
                <Text
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-accent)",
                    fontWeight: 700,
                  }}
                >
                  {ABOUT_INTRO.subheading}
                </Text>
              </div>

              {/* Body */}
              <Text
                size="base"
                color="muted"
                style={{
                  // fontSize: "var(--text-md)",
                  // color: "var(--color-muted)",
                  // lineHeight: "var(--leading-relaxed)",
                  maxWidth: "58ch",
                }}
              >
                {ABOUT_INTRO.body}
              </Text>

              {/* Divider */}
              <div
                aria-hidden="true"
                className="h-px w-full"
                style={{ background: "var(--color-border-sub)" }}
              />

              {/* Blockquote */}
              <div className="flex flex-col gap-4">
                {/* <div className="flex items-start gap-4">
                  <div
                    aria-hidden="true"
                    className="w-[2px] self-stretch rounded-full shrink-0"
                    style={{ background: "var(--color-accent)", opacity: 0.6 }}
                  />
                  <blockquote
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-md)",
                      fontWeight: 600,
                      color: "var(--color-fg)",
                      lineHeight: "var(--leading-snug)",
                      letterSpacing: "var(--tracking-tight)",
                      fontStyle: "italic",
                    }}
                  >
                    &ldquo;{ABOUT_INTRO.pullquote}&rdquo;
                  </blockquote>
                </div> */}

                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-muted)",
                    lineHeight: "var(--leading-relaxed)",
                    maxWidth: "52ch",
                  }}
                >
                  {ABOUT_INTRO.pullquoteContext}
                </p>
              </div>

              {/* CTA row — all three use Button, no inline hover handlers */}
              <div className="flex items-center gap-3 flex-wrap pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setModalOpen(true)}
                  rightIcon={<ArrowRightIcon />}
                  aria-label={`${ABOUT_INTRO.modalButtonLabel} — read my full process`}
                >
                  {ABOUT_INTRO.modalButtonLabel}
                </Button>

                <Button
                  href={ABOUT_INTRO.resumePath}
                  variant="secondary"
                  size="sm"
                  download
                  aria-label={`${ABOUT_INTRO.resumeLabel} — PDF`}
                >
                  {ABOUT_INTRO.resumeLabel}
                </Button>
              </div>

              {/* Signature line */}
              <div
                className="flex items-center gap-4 pt-4"
                style={{ borderTop: "1px solid var(--color-border-sub)" }}
              >
                <div className="flex flex-col gap-0.5">
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-sm)",
                      fontWeight: 700,
                      color: "var(--color-fg)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {ABOUT_INTRO.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      color: "var(--color-faint)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {ABOUT_INTRO.brandHandle}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Modal outside section — avoids stacking context issues */}
      <AboutModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
