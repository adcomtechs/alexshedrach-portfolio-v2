// features/contact/QuickReach.jsx
// RSC — no client directive required.
//
// Elevated redesign — moves from a sidebar link list to a standalone
// full-width section. Serves as the final invitation on the contact page —
// a low-friction alternative for visitors who prefer direct communication
// over the form.
//
// Channel hierarchy (by response speed):
//   1. WhatsApp — fastest, most direct, prominent CTA
//   2. Phone    — synchronous, secondary
//   3. Email    — async, compact row
//   4. GitHub   — reference, compact row
//
// Background: mesh variant — per DEC-020, used for hero-character surfaces.
// The card sits inside a Section with SectionBackground mesh — gives the
// section visual weight distinct from the form section above it.
//
// All channels are optional — set to null in contact-data.js to hide.

import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { DIRECT_CHANNELS } from "./contact-data";

// ─── WhatsApp icon ────────────────────────────────────────────────────────────
function WhatsAppIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

// ─── Phone icon ───────────────────────────────────────────────────────────────
function PhoneIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.32 6.32l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

// ─── Mail icon ────────────────────────────────────────────────────────────────
function MailIcon({ size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

// ─── GitHub icon ──────────────────────────────────────────────────────────────
function GitHubIcon({ size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

// ─── WhatsApp CTA ─────────────────────────────────────────────────────────────
function WhatsAppCTA({ channel }) {
  const waUrl = `https://wa.me/${channel.number.replace(/\D/g, "")}?text=${encodeURIComponent(channel.message)}`;

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 flex flex-col gap-5"
      style={{
        background:
          "linear-gradient(135deg, rgba(37,211,102,0.08) 0%, rgba(37,211,102,0.03) 50%, transparent 100%)",
        border: "1px solid rgba(37,211,102,0.2)",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
        style={{
          background: "rgba(37,211,102,0.12)",
          filter: "blur(40px)",
        }}
      />

      {/* Header */}
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {/* WhatsApp brand dot */}
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: "#25D366" }}
              aria-hidden="true"
            />
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#25D366",
              }}
            >
              WhatsApp
            </p>
          </div>
          <Heading as="p" size="3">
            Fastest way to reach me
          </Heading>
          <Text size="sm" color="muted" className="mt-0.5">
            Send a direct message. Pre-filled context so you don&apos;t have to
            start from scratch.
          </Text>
        </div>

        {/* Large WhatsApp icon — decorative */}
        <div
          className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: "rgba(37,211,102,0.1)",
            border: "1px solid rgba(37,211,102,0.2)",
            color: "#25D366",
          }}
          aria-hidden="true"
        >
          <WhatsAppIcon size={22} />
        </div>
      </div>

      {/* Number + availability */}
      <div className="relative flex flex-col gap-1">
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-sm)",
            color: "var(--color-fg)",
            letterSpacing: "0.02em",
          }}
        >
          {channel.display}
        </p>
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-faint)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {channel.availability}
        </p>
      </div>

      {/* CTA button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "relative group inline-flex items-center justify-center gap-2.5",
          "w-full h-11 rounded-xl font-semibold overflow-hidden",
          "transition-[transform,box-shadow,filter] duration-200",
          "hover:-translate-y-px",
          "hover:shadow-[0_8px_24px_rgba(37,211,102,0.3)]",
          "active:translate-y-0",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[#25D366] focus-visible:ring-offset-2",
          "focus-visible:ring-offset-[var(--color-bg)]",
        )}
        style={{
          background: "#25D366",
          color: "#0a0a0a",
          fontSize: "var(--text-sm)",
        }}
        aria-label={`Open WhatsApp chat with ${channel.display}`}
      >
        {/* Shimmer sweep */}
        <span
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
            transform: "translateX(-100%)",
            transition: "transform 500ms ease",
          }}
        />
        <WhatsAppIcon size={17} />
        Message on WhatsApp
      </a>
    </div>
  );
}

// ─── Phone channel ────────────────────────────────────────────────────────────
function PhoneChannel({ channel }) {
  return (
    <div
      className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border-sub)",
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Icon */}
        <div
          className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
          style={{
            background: "var(--color-surface-2)",
            border: "1px solid var(--color-border)",
            color: "var(--color-muted)",
          }}
          aria-hidden="true"
        >
          <PhoneIcon size={15} />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-0.5 min-w-0">
          <p
            className="truncate"
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-fg)",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.02em",
            }}
          >
            {channel.display}
          </p>
          <p
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-faint)",
            }}
          >
            {channel.availability}
          </p>
        </div>
      </div>

      {/* Call link */}
      <a
        href={channel.href}
        className={cn(
          "shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg",
          "border border-[var(--color-border)]",
          "transition-[border-color,background,color] duration-150",
          "hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]",
          "hover:bg-[var(--color-accent-bg)]",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
          "focus-visible:ring-offset-[var(--color-bg)]",
        )}
        style={{
          fontSize: "var(--text-xs)",
          fontFamily: "var(--font-mono)",
          color: "var(--color-muted)",
          letterSpacing: "0.04em",
        }}
        aria-label={`Call ${channel.display}`}
      >
        <PhoneIcon size={11} />
        Call
      </a>
    </div>
  );
}

// ─── Async channels row ───────────────────────────────────────────────────────
// Email + GitHub in a compact two-column grid
function AsyncChannels({ email, github }) {
  const channels = [
    email && {
      key: "email",
      href: email.href,
      label: email.label,
      icon: <MailIcon size={13} />,
      ariaLabel: `Send email to ${email.label}`,
      external: false,
    },
    github && {
      key: "github",
      href: github.href,
      label: github.label,
      icon: <GitHubIcon size={13} />,
      ariaLabel: "View GitHub profile",
      external: true,
    },
  ].filter(Boolean);

  if (channels.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.62rem",
          letterSpacing: "0.09em",
          textTransform: "uppercase",
          color: "var(--color-faint)",
        }}
      >
        Async channels
      </p>

      <div className="grid grid-cols-2 gap-2">
        {channels.map(({ key, href, label, icon, ariaLabel, external }) => (
          <a
            key={key}
            href={href}
            aria-label={ariaLabel}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className={cn(
              "group flex items-center gap-2 px-3 py-2.5 rounded-lg min-w-0",
              "border border-[var(--color-border-sub)]",
              "transition-[border-color,background] duration-150",
              "hover:border-[var(--color-border)] hover:bg-[var(--color-surface-2)]",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
              "focus-visible:ring-offset-[var(--color-bg)]",
            )}
          >
            <span
              className="shrink-0 transition-colors duration-150"
              style={{ color: "var(--color-faint)" }}
              aria-hidden="true"
            >
              {icon}
            </span>
            <span
              className="truncate transition-colors duration-150 group-hover:text-[var(--color-fg)]"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-muted)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── QuickReach ───────────────────────────────────────────────────────────────

export function QuickReach() {
  const { whatsapp, phone, email, github } = DIRECT_CHANNELS;

  // Do not render the section at all if no channels are configured
  const hasContent = whatsapp || phone || email || github;
  if (!hasContent) return null;

  return (
    <Section spacing="md" className="relative overflow-hidden">
      <SectionBackground variant="mesh" />

      <Container size="wide" className="relative">
        {/* Section header */}
        <div className="flex flex-col items-center text-center gap-2 mb-10">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="w-4 h-px"
              style={{ background: "var(--color-accent)", opacity: 0.55 }}
            />
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
              }}
            >
              Prefer to skip the form?
            </p>
            <span
              aria-hidden="true"
              className="w-4 h-px"
              style={{ background: "var(--color-accent)", opacity: 0.55 }}
            />
          </div>

          <Heading as="h2" size="2" balance>
            Reach out directly
          </Heading>
          <Text size="base" color="muted" balance className="max-w-md">
            Every channel leads to the same person. Pick whichever fits how you
            work.
          </Text>
        </div>

        {/* Channel card */}
        <div className="mx-auto max-w-2xl">
          <div
            className="relative overflow-hidden rounded-2xl flex flex-col gap-4 p-6"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border-sub)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            {/* Top accent line — mirrors ContactForm */}
            <div
              aria-hidden="true"
              className="absolute top-0 left-8 right-8 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(181,242,61,0.4), transparent)",
              }}
            />

            {/* WhatsApp — primary */}
            {whatsapp && <WhatsAppCTA channel={whatsapp} />}

            {/* Divider */}
            {whatsapp && (phone || email || github) && (
              <div className="flex items-center gap-3" aria-hidden="true">
                <div
                  className="flex-1 h-px"
                  style={{ background: "var(--color-border-sub)" }}
                />
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--color-faint)",
                  }}
                >
                  or
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "var(--color-border-sub)" }}
                />
              </div>
            )}

            {/* Phone — secondary */}
            {phone && <PhoneChannel channel={phone} />}

            {/* Async — tertiary */}
            {(email || github) && (
              <AsyncChannels email={email} github={github} />
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default QuickReach;
