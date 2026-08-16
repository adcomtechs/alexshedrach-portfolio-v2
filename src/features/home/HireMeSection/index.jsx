"use client";

import { Container } from "@/components/layout/Container";
import { QUICK_LINKS } from "@/features/contact/contact-data";
import { cn } from "@/lib/utils";
import QuickLink from "./QuickLink";
import LeftColumn from "./LeftColumn";
import ContactForm from "@/features/contact/ContactForm";

export default function HireMeSection() {
  return (
    <section
      aria-labelledby="contact-heading"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ borderTop: "1px solid var(--color-border-sub)" }}
    >
      {/* Dot-grid atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-border-sub) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.25,
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 100%, black 30%, transparent 80%)",
        }}
      />

      {/* Accent glow — bottom-centre */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: "700px",
          height: "300px",
          background: "var(--color-accent)",
          opacity: 0.05,
          filter: "blur(100px)",
          borderRadius: "50%",
        }}
      />

      <Container size="wide">
        <div
          className={cn(
            "grid grid-cols-1 gap-12",
            "lg:grid-cols-[1fr_480px] lg:gap-16",
            "items-start",
          )}
        >
          <LeftColumn />

          {/* Sticky on desktop — form stays in view while user reads left column */}
          <div className="lg:sticky lg:top-24">
            <ContactForm />

            {/* ── Quick-reach links ─────────────────────────────────────────── */}
            <div className="flex flex-col gap-3 mt-8">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.12em]"
                style={{
                  color: "var(--color-faint)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                Or reach us directly
              </p>
              <div className="flex gap-2">
                {QUICK_LINKS.map((link) => (
                  <QuickLink key={link.id} {...link} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
