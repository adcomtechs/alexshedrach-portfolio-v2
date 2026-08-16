// components/layout/site-footer/index.jsx
// RSC — "use client" is NOT on this file.
// Client components (ScrollToTop, NewsletterCard) are imported as
// leaf nodes and carry their own "use client" directive. This keeps
// the footer shell as a Server Component, reducing client JS.

import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/Container";

import { FooterWordmark } from "./FooterWordmark";
import { SocialLinks } from "./SocialLinks";
import { NavColumn } from "./NavColumn";
import { ScrollToTop } from "./ScrollToTop";
import { NewsletterCard } from "./NewsletterCard";
import { BottomBar } from "./BottomBar";
import { NAV_COLUMNS } from "./constants";
import { Text } from "@/components/ui/Text";

/**
 * SiteFooter
 *
 * Orchestration layer. Three-column grid:
 *   Col 1 (300px) — brand identity, bio, current project, location, social
 *   Col 2 (1fr)   — newsletter card, fills fluid center
 *   Col 3 (auto)  — navigation columns
 *
 * The entrance animation is driven by useOnScreen. Because this shell is an
 * RSC, the animation is applied via a className that Tailwind compiles
 * statically — no JS needed for the initial reveal on scroll.
 * The footer's position near the bottom of the page means it will enter
 * the viewport intentionally; the Tailwind `animate-fade-in` class from
 * animations.css handles this without a client hook.
 */
export function SiteFooter() {
  return (
    <>
      {/* Client leaf — carries its own "use client" */}
      <ScrollToTop />

      <footer
        aria-label="Site footer"
        className="relative border-t border-[var(--color-border-sub)]"
        style={{ background: "var(--color-bg)" }}
      >
        {/* Ambient accent glow at the top edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2"
          style={{
            width: "700px",
            height: "220px",
            background: "var(--color-accent)",
            opacity: 0.022,
            filter: "blur(90px)",
            borderRadius: "50%",
          }}
        />

        <Container size="full" className="relative">
          {/*
            Three-column grid
            ─────────────────
            mobile  → single column stack
            tablet  → two columns: brand | newsletter
            desktop → [300px brand] [1fr newsletter] [auto nav]
          */}
          <div
            className={cn(
              "py-14",
              "grid grid-cols-1 gap-10",
              "md:grid-cols-[280px_1fr] md:gap-10",
              "lg:grid-cols-[300px_1fr_auto] lg:gap-12",
              "lg:items-stretch",
            )}
          >
            {/* Col 1 — Brand identity */}
            <div className="flex flex-col gap-5">
              <FooterWordmark />

              <Text color="muted"
                style={{
                  // fontSize: "var(--text-sm)",
                  // color: "var(--color-muted)",
                  lineHeight: "var(--leading-relaxed)",
                }}
              >
                Building platforms, not pages. Full-stack engineer focused on
                scalable architecture, AI integration, and production-grade
                systems.
              </Text>

              {/* Currently building widget */}
              <div
                className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg border w-fit"
                style={{
                  background: "var(--color-surface)",
                  borderColor: "var(--color-border-sub)",
                }}
              >
                {/* status-pulse defined in animations.css */}
                <span
                  className="status-pulse w-1.5 h-1.5 rounded-full mt-[3px] shrink-0"
                  style={{ background: "var(--color-success)" }}
                  aria-hidden="true"
                />
                <div className="flex flex-col gap-0.5">
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.5625rem",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--color-faint)",
                    }}
                  >
                    Currently building
                  </span>
                  <span
                    className="font-semibold"
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-fg)",
                    }}
                  >
                    AiAcadeVault
                  </span>
                  <span
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-faint)",
                    }}
                  >
                    Academic marketplace · Nigeria
                  </span>
                </div>
              </div>

              {/* Location */}
              <p
                className="inline-flex items-center gap-1.5"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-faint)",
                }}
              >
                <MapPin size={11} aria-hidden="true" />
                Enugu City, Nigeria · WAT UTC+1
              </p>

              <SocialLinks />
            </div>

            {/* Col 2 — Newsletter (fluid center) */}
            <NewsletterCard className="h-full" />

            {/* Col 3 — Navigation columns */}
            <div className="flex gap-10 lg:gap-12 items-start">
              {NAV_COLUMNS.map((col) => (
                <NavColumn key={col.label} {...col} />
              ))}
            </div>
          </div>

          <BottomBar />
        </Container>
      </footer>
    </>
  );
}

export default SiteFooter;
