// features/about/AboutTeaser.jsx
"use client";
//
// Client boundary: useState for modal open/close. Add to the use-client
// ledger (AI_CONTEXT.md §4) before this merges — "AboutTeaser — local UI
// state for the About modal open/close" — per DESIGN_SYSTEM.md §4.2 rule 3.
//
// Fixes in this pass:
//   - Restored the pullquote blockquote. It was commented out — the data
//     file itself calls it "the most memorable sentence on the entire
//     about section," and it wasn't rendering at all. Content regression,
//     not a style choice.
//   - Fixed the ProfilePanel import. It pointed at
//     "@/components/ui/ProfileImage", which doesn't match where that file
//     actually lives ("features/about/ProfilePanel") — corrected, and that
//     location is also the architecturally right one per DESIGN_SYSTEM.md
//     §4.1 (feature-scoped, not a shared ui/ primitive).
//   - Removed dead commented-out style blocks — AI_CONTEXT.md §7.
//   - All inline style micro-copy converted to .text-label + token-backed
//     Tailwind utilities. .text-label no longer bakes in letter-spacing or
//     color (see utilities.css) — this file needs 0.16em tracking on the
//     section eyebrow, a different value than the token default, which is
//     exactly why those were pulled out of the utility in the first place.
//   - Hand-rolled ArrowRightIcon replaced with lucide-react's ArrowRight —
//     lucide is already a project dependency; the removed component's own
//     comment flagged it as a placeholder pending exactly this.
//   - Hardcoded accent rgba (glow overlays, grid pattern already used the
//     token correctly and is untouched) moved to color-mix() — theme-safe.
//   - Resume Button: explicit download filename instead of relying on the
//     server path's raw filename, plus target="_blank" as a fallback for
//     platforms (iOS Safari, notably) that ignore the `download` attribute
//     and navigate instead of downloading. This assumes Button forwards
//     unrecognized anchor props (target, rel) through to the underlying
//     <a> when `href` is set — verify against Button's actual prop list;
//     if it has an explicit allow-list, add target/rel there too.

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ProfilePanel } from "@/components/ui/ProfilePanel";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { AboutModal } from "./AboutModal";
import { ABOUT_INTRO } from "@/lib/data/about";

export default function AboutTeaser() {
  const [modalOpen, setModalOpen] = useState(false);

  // ── CONFIGURE HERE ─────────────────────────────────────────────────────────
  // Toggle between "stats" and "image" to switch the left column mode.
  const panelMode = "image"; // "stats" | "image"
  const primarySrc = "/images/alex-profile.png";
  const secondarySrc = "/images/alex-profile-2.png";
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <>
      <Section
        as="section"
        id="about"
        spacing="md"
        aria-labelledby="about-teaser-heading"
        className="relative overflow-hidden border-t border-(--color-border-sub)"
      >
        {/* Background: subtle architectural grid — already token-driven, no change needed */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-border) 1px, transparent 1px), " +
              "linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Left accent bar — already token-driven, no change needed */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[10%] left-0 top-[10%] w-0.5 opacity-50"
          style={{
            background:
              "linear-gradient(180deg, transparent, var(--color-accent) 30%, var(--color-accent) 70%, transparent)",
          }}
        />

        <Container size="wide" className="relative">
          {/* Section label */}
          <div className="mb-14 flex items-center gap-4">
            <span className="text-label tracking-[0.16em] text-(--color-accent) font-bold">
              [Builder]
            </span>
            <span className="text-label tracking-[0.16em] text-(--color-faint)">
              A note on how I build.
            </span>
            <span aria-hidden className="h-px flex-1 bg-(--color-border-sub)" />
          </div>

          {/* Two-column layout */}
          <div className="grid items-start gap-14 lg:grid-cols-[320px_1fr]">
            {/* ── Left: ProfilePanel ──────────────────────────────────────── */}
            <div className="flex flex-col gap-4">
              <ProfilePanel
                primarySrc={primarySrc}
                primaryAlt={ABOUT_INTRO.imageAlt}
                secondarySrc={secondarySrc}
                secondaryAlt="Alex Shedrach — alternate portrait"
                mode={panelMode}
              />

              <Button
                href="/about"
                variant="ghost"
                size="sm"
                className="w-full justify-center"
                rightIcon={<ArrowRight size={14} aria-hidden />}
              >
                {ABOUT_INTRO.fullPageLabel}
              </Button>
            </div>

            {/* ── Right: copy column ──────────────────────────────────────── */}
            <div className="flex flex-col gap-8">
              {/* Headline + subheading */}
              <div className="flex flex-col gap-3">
                <Heading as="h2" size="3" balance id="about-teaser-heading">
                  {ABOUT_INTRO.headline}
                </Heading>
                {/* Plain element, not <Text> — this is a mono eyebrow label,
                    not body copy, which is Text's stated scope. Combining
                    Text's own size classes with .text-label would leave two
                    conflicting font-size/line-height declarations resolved
                    only by @layer source order — fragile. */}
                <p className="text-label tracking-wide text-(--color-accent) font-bold">
                  {ABOUT_INTRO.subheading}
                </p>
              </div>

              {/* Body */}
              <Text size="base" color="muted" className="max-w-[58ch]">
                {ABOUT_INTRO.body}
              </Text>

              <div aria-hidden className="h-px w-full bg-(--color-border-sub)" />

              {/* Blockquote — the field this component exists to surface.
                  Was commented out in the previous version; restored. */}
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div
                    aria-hidden
                    className="mt-1 w-0.5 shrink-0 self-stretch rounded-full bg-(--color-accent) opacity-60"
                  />
                  <blockquote
                    className="text-md font-semibold italic leading-snug tracking-tight text-(--color-fg)"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    &ldquo;{ABOUT_INTRO.pullquote}&rdquo;
                  </blockquote>
                </div>

                <p className="max-w-[52ch] text-sm leading-relaxed text-(--color-muted)">
                  {ABOUT_INTRO.pullquoteContext}
                </p>
              </div>

              {/* CTA row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setModalOpen(true)}
                  rightIcon={<ArrowRight size={14} aria-hidden />}
                  aria-label={`${ABOUT_INTRO.modalButtonLabel} — read my full process`}
                >
                  {ABOUT_INTRO.modalButtonLabel}
                </Button>

                <Button
                  href={ABOUT_INTRO.resumePath}
                  variant="secondary"
                  size="sm"
                  download="Alex-Shedrach-Uchenna-Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${ABOUT_INTRO.resumeLabel} — PDF`}
                >
                  {ABOUT_INTRO.resumeLabel}
                </Button>
              </div>

              {/* Signature line */}
              <div className="flex items-center gap-4 border-t border-(--color-border-sub) pt-4">
                <div className="flex flex-col gap-0.5">
                  <span
                    className="text-sm font-bold tracking-[-0.01em] text-(--color-fg)"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {ABOUT_INTRO.name}
                  </span>
                  <span className="text-label tracking-wide text-(--color-faint)">
                    {ABOUT_INTRO.brandHandle}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Modal outside section — renders through a portal, see AboutModal.jsx */}
      <AboutModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}