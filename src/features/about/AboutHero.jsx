// features/about/AboutHero.jsx
// RSC — no client directive required.
//
// editorial variant — SectionBackground per DEC-045.
// default Container (896px) — all About sections use default. Per DEC-044.
// Centered layout: eyebrow → heading → description → CTAs.

import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { aboutData } from "./about-data";

export function AboutHero() {
  const { positioning } = aboutData.hero;

  return (
    <Section spacing="md" className="relative">
      <SectionBackground variant="mesh" />

      <Container size="wide">
        <div
          className="flex flex-col items-center text-center"
          // style={{ paddingTop: "5rem", paddingBottom: "5rem", gap: "2rem" }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-5">
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
              About
            </span>
          </div>

          {/* Positioning statement — display scale, balanced line breaks */}
          <Heading as="h3" size="3" balance>
            {positioning}
          </Heading>

          {/* Anchor line — sets expectation for what follows below the fold */}
          <p
            style={{
              marginTop: "2rem",
              fontSize: "var(--text-md)",
              lineHeight: "var(--leading-relaxed)",
              color: "var(--color-muted)",
              maxWidth: "38rem",
              textWrap: "pretty",
            }}
          >
            The philosophy behind that statement, the decisions it produced, and
            the systems it shaped are documented below.
          </p>

          {/* CTAs */}
          <div className="flex items-center flex-wrap justify-center gap-4 mt-8">
            <Button asChild variant="primary" size="lg">
              <Link href="/projects">View Projects</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/contact">Work Together</Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
