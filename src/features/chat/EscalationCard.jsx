// features/chat/EscalationCard.jsx
"use client";
//
// Surfaces automatically when the AI detects buying intent.
// Rendered inside the chat panel — below the messages, above the input.
//
// The card presents the WhatsApp CTA as the primary action.
// Dismiss closes the card without ending the conversation.

import { cn } from "@/lib/utils";
import { ESCALATION_REASON_LABEL } from "@/lib/chat/constants";
import { DIRECT_CHANNELS } from "@/features/contact/contact-data";

function WhatsAppIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

export function EscalationCard({ escalation, onDismiss }) {
  if (!escalation) return null;

  const { reason } = escalation;
  const reasonLabel = ESCALATION_REASON_LABEL[reason] ?? "continuing";
  const wa = DIRECT_CHANNELS.whatsapp;

  if (!wa) return null;

  const waUrl = `https://wa.me/${wa.number.replace(/\D/g, "")}?text=${encodeURIComponent(wa.message)}`;

  return (
    <div
      className="mx-3 mb-3 rounded-xl overflow-hidden animate-slide-up"
      style={{
        background:
          "linear-gradient(135deg, rgba(37,211,102,0.08) 0%, rgba(37,211,102,0.04) 100%)",
        border: "1px solid rgba(37,211,102,0.25)",
      }}
      role="complementary"
      aria-label="Contact Alex directly"
    >
      <div className="p-3.5 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#25D366",
              }}
            >
              Ready to talk?
            </p>
            <p
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-fg)",
                lineHeight: "var(--leading-snug)",
                fontWeight: 500,
              }}
            >
              It looks like you&apos;re interested in {reasonLabel}. Alex
              responds within 2 hours on WhatsApp.
            </p>
          </div>

          {/* Dismiss */}
          <button
            onClick={onDismiss}
            className={cn(
              "shrink-0 w-6 h-6 rounded-lg flex items-center justify-center",
              "transition-[background] duration-150",
              "hover:bg-[var(--color-surface-2)]",
              "focus-visible:outline-none focus-visible:ring-1",
              "focus-visible:ring-[var(--color-accent)]",
            )}
            style={{ color: "var(--color-faint)" }}
            aria-label="Dismiss"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* WhatsApp CTA */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center justify-center gap-2",
            "w-full h-9 rounded-lg font-semibold",
            "transition-[filter,transform] duration-150",
            "hover:brightness-110 hover:-translate-y-px",
            "active:translate-y-0",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-[#25D366] focus-visible:ring-offset-2",
            "focus-visible:ring-offset-[var(--color-bg)]",
          )}
          style={{
            background: "#25D366",
            color: "#0a0a0a",
            fontSize: "var(--text-xs)",
          }}
          aria-label="Message Alex on WhatsApp"
        >
          <WhatsAppIcon />
          Message on WhatsApp
        </a>
      </div>
    </div>
  );
}
