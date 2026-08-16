// app/not-found.jsx
// RSC — no client directive required.
//
// Global not-found page. Next.js renders this automatically when notFound()
// is called or when a route cannot be matched.
//
// Design intent: the 404 is a product surface, not an error dump.
// It communicates with the same standards as every other page —
// minimal, structured, high-signal. It does not apologise excessively
// or render a cartoon. It orients the visitor and provides a clear exit.
//
// Layout contract: RootLayout → Section → Container → [Feature Content]
// The RootLayout wraps this page automatically — nav and footer are present.

import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

// Navigation paths — gives the visitor a structured exit, not a dead end.
const EXIT_PATHS = [
  { label: "Home", href: "/", description: "Start from the beginning" },
  {
    label: "Projects",
    href: "/projects",
    description: "Engineering case studies",
  },
  { label: "Lab", href: "/lab", description: "Experiments and explorations" },
  { label: "About", href: "/about", description: "Engineering philosophy" },
];

export const metadata = {
  title: "404 | Page Not Found",
};

export default function NotFound() {
  return (
    <Section spacing="sm" className="relative min-h-[70vh] flex items-center">
      <SectionBackground variant="editorial" />

      <Container size="wide" className="relative z-10">
        <div className="flex flex-col gap-10 max-w-xl">
          {/* Status line */}
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-faint)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              404
            </span>
            <span aria-hidden className="h-px w-8 bg-(--color-border)" />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-faint)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Page not found
            </span>
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-4">
            <Heading as="h1" size="1" balance>
              This route doesn&apos;t exist.
            </Heading>
            <Text size="base" color="muted" balance>
              The page you requested isn&apos;t here it may have moved, been
              removed, or the URL may be incorrect.
            </Text>
          </div>

          {/* Exit paths */}
          <div className="flex flex-col gap-2">
            <Text size="sm" color="faint" className="mb-1">
              Where to go instead
            </Text>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EXIT_PATHS.map((path) => (
                <Link
                  key={path.href}
                  href={path.href}
                  className="group flex items-start justify-between gap-3 px-4 py-3 rounded-lg border border-(--color-border-sub) bg-(--color-surface) hover:border-[rgba(181,242,61,0.2)] hover:bg-(--color-surface-2) transition-[border-color,background] duration-150"
                >
                  <div className="flex flex-col gap-0.5">
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--text-sm)",
                        fontWeight: 600,
                        color: "var(--color-fg)",
                      }}
                    >
                      {path.label}
                    </span>
                    <span
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--color-faint)",
                      }}
                    >
                      {path.description}
                    </span>
                  </div>
                  <span
                    aria-hidden
                    className="shrink-0 mt-0.5 text-(--color-faint) group-hover:text-(--color-accent) transition-colors duration-150"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Primary CTA — back to home */}
          <div>
            <Button variant="outline" size="md" href="/">
              Back to home
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
