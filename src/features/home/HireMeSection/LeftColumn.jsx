import React from "react";
import { MapPin, Clock } from "lucide-react";
import { AVAILABILITY, LOOKING_FOR } from "@/features/contact/contact-data";
import { Text } from "@/components/ui/Text";
import { Heading } from "@/components/ui/Heading";

export default function LeftColumn() {
  return (
    <div className="flex flex-col gap-8">
      {/* ── Section overline + headline + description ─────────────────── */}
      <div className="flex flex-col gap-3">
        {/* Overline — brand-anchored */}
        <p
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em]"
          style={{
            color: "var(--color-accent)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <span
            aria-hidden="true"
            className="inline-block w-5 h-px"
            style={{ background: "var(--color-accent)", opacity: 0.6 }}
          />
          Work with Adcomtechs
        </p>

        {/* Headline — names the three actual engagement types */}
        {/* Headline — names the three actual engagement types */}
        <Heading
          as="h2"
          size="2"
          balance
          className="leading-[1.1] tracking-tight"
          // style={{
          //   fontFamily: "var(--font-display)",
          //   fontSize: "clamp(2rem, 3.5vw, 2.875rem)",
          //   fontWeight: 800,
          //   color: "var(--color-fg)",
          //   letterSpacing: "-0.035em",
          // }}
        >
          A project, a product enquiry,{" "}
          <span style={{ color: "var(--color-accent)" }}>
            or a build in mind?
          </span>
        </Heading>

        <Text
          size="base"
          color="muted"
          // className="text-[15px] leading-relaxed max-w-[440px]"
          style={{ color: "var(--color-muted)", maxWidth: "42ch" }}
        >
          Adcomtechs is open for product licensing, custom software development,
          and technical consulting specifically for Nigerian institutions,
          businesses, and developers building on the Spring Boot + Next.js 16
          stack. If what you need fits what is being built here, let&apos;s
          talk.
        </Text>
      </div>

      {/* ── Availability signal ───────────────────────────────────────── */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl border"
        style={{
          background: "var(--color-surface)",
          borderColor: AVAILABILITY.open
            ? "rgba(34,197,94,0.2)"
            : "var(--color-border-sub)",
        }}
      >
        {/* Pulsing availability dot */}
        <span
          className="relative flex w-2.5 h-2.5 mt-1 shrink-0"
          aria-hidden="true"
        >
          {AVAILABILITY.open && (
            <span
              className="building-pulse absolute inline-flex h-full w-full rounded-full"
              style={{ background: "var(--color-success)", opacity: 0.5 }}
            />
          )}
          <span
            className="relative inline-flex rounded-full w-2.5 h-2.5"
            style={{
              background: AVAILABILITY.open
                ? "var(--color-success)"
                : "var(--color-faint)",
            }}
          />
        </span>

        <div className="flex flex-col gap-1 min-w-0">
          {/* Status label */}
          <p
            className="text-[13px] font-semibold"
            style={{ color: "var(--color-fg)" }}
          >
            {AVAILABILITY.label}
          </p>

          {/* Engagement type pills */}
          <div className="flex flex-wrap gap-1.5 mt-0.5">
            {AVAILABILITY.types.map((type) => (
              <span
                key={type}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold"
                style={{
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  color: "var(--color-success)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {type}
              </span>
            ))}
          </div>

          {/* Response time + timezone */}
          <div
            className="flex items-center gap-4 mt-2 pt-2"
            style={{ borderTop: "1px solid var(--color-border-sub)" }}
          >
            <span
              className="flex items-center gap-1.5 text-[11px]"
              style={{
                color: "var(--color-faint)",
                fontFamily: "var(--font-mono)",
              }}
            >
              <Clock size={10} aria-hidden="true" />
              {AVAILABILITY.responseTime}
            </span>
            <span
              className="flex items-center gap-1.5 text-[11px]"
              style={{
                color: "var(--color-faint)",
                fontFamily: "var(--font-mono)",
              }}
            >
              <MapPin size={10} aria-hidden="true" />
              {AVAILABILITY.timezone}
            </span>
          </div>
        </div>
      </div>

      {/* ── What I'm open to ─────────────────────────────────────────── */}
      {/*
        Header changed from "What I'm looking for" (implies job hunting)
        to "What I'm open to" (neutral — accurate for a product builder
        who is not applying to companies but accepting inbound work).
      */}
      <div className="flex flex-col gap-3">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{
            color: "var(--color-faint)",
            fontFamily: "var(--font-mono)",
          }}
        >
          What I&apos;m open to
        </p>

        <div className="flex flex-col gap-2">
          {LOOKING_FOR.map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="flex items-start gap-3 px-3.5 py-3 rounded-lg border transition-[background] duration-150 hover:bg-[var(--color-surface-2)]"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border-sub)",
              }}
            >
              {/* Icon badge */}
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: "var(--color-accent-bg)",
                  border: "1px solid rgba(181,242,61,0.2)",
                  color: "var(--color-accent)",
                }}
              >
                <Icon size={13} aria-hidden="true" />
              </div>

              {/* Label + sub */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: "var(--color-fg)" }}
                >
                  {label}
                </span>
                <span
                  className="text-[11.5px]"
                  style={{ color: "var(--color-faint)" }}
                >
                  {sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick-reach links ─────────────────────────────────────────── */}
      {/* <div className="flex flex-col gap-3">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{
            color: "var(--color-faint)",
            fontFamily: "var(--font-mono)",
          }}
        >
          Or reach us directly
        </p>
        <div className="flex flex-col gap-2">
          {QUICK_LINKS.map((link) => (
            <QuickLink key={link.id} {...link} />
          ))}
        </div>
      </div> */}
    </div>
  );
}
