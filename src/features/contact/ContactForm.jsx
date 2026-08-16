// features/contact/ContactForm.jsx
// "use client" — form state and server action binding require client context.
//
// REFACTOR NOTE (DEC-039):
//   The previous implementation re-implemented Input, Select, and Textarea
//   with bespoke styling. This version composes the design system components
//   from components/ui/form-controls/form-controls.jsx exclusively.
//   The custom Field wrapper, inputCls(), and raw <input> elements are removed.
//
//   The card shell (border, background, glow) is intentionally moved to the
//   feature level — ContactForm is responsible for form logic only.

"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { Send, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Input,
  Select,
  Textarea,
} from "@/components/ui/form-controls";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { submitContactForm } from "@/app/contact/actions";
import { AVAILABILITY, SUBJECT_OPTIONS } from "./contact-data";

// ─── Initial state ────────────────────────────────────────────────────────────
const initialState = {
  status: "idle", // "idle" | "loading" | "success" | "error"
  errors: {},
  values: {},
};

// ─── Success state ────────────────────────────────────────────────────────────
function SuccessState({ onReset }) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center gap-6 rounded-2xl border p-12 min-h-[520px]"
      style={{
        background: "var(--color-surface)",
        borderColor: "rgba(34,197,94,0.2)",
      }}
      aria-live="polite"
    >
      {/* Animated check */}
      <div
        className="relative w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          background: "rgba(34,197,94,0.08)",
          border: "1px solid rgba(34,197,94,0.25)",
        }}
      >
        <div
          className="absolute inset-0 rounded-full status-pulse"
          style={{ border: "1px solid rgba(34,197,94,0.3)" }}
          aria-hidden="true"
        />
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-success)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline
            points="20 6 9 17 4 12"
            strokeDasharray="30"
            strokeDashoffset="30"
            style={{ animation: "check-draw 0.5s ease forwards 0.2s" }}
          />
        </svg>
      </div>

      <div className="flex flex-col gap-2">
        <h3
          className="text-2xl font-bold tracking-tight"
          style={{
            color: "var(--color-fg)",
            fontFamily: "var(--font-display)",
            letterSpacing: "var(--tracking-tight)",
          }}
        >
          Message sent.
        </h3>
        <Text size="sm" color="muted" className="max-w-[300px] mx-auto">
          It will be read carefully. A response specific to what you asked
          will come within 24 hours.
        </Text>
      </div>

      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          background: "var(--color-surface-2)",
          border: "1px solid var(--color-border-sub)",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          color: "var(--color-faint)",
        }}
      >
        <Clock size={10} aria-hidden="true" />
        Response within {AVAILABILITY.responseTime.toLowerCase()}
      </div>

      <button
        onClick={onReset}
        className={cn(
          "inline-flex items-center gap-1.5 transition-colors duration-150 z-50",
          "hover:text-[var(--color-accent)]",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
          "focus-visible:ring-offset-[var(--color-bg)]",
        )}
        style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}
      >
        Send another message
      </button>
    </div>
  );
}

// ─── ContactForm ──────────────────────────────────────────────────────────────
export function ContactForm() {
  // formKey — incrementing this remounts the form and resets useActionState
  // back to initialState without a page navigation.
  const [formKey, setFormKey] = useState(0);
  const reset = useCallback(() => setFormKey((k) => k + 1), []);

  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState,
  );

  const errorRef = useRef(null);
  useEffect(() => {
    if (state.status === "error" && state.errors?._form) {
      errorRef.current?.focus();
    }
  }, [state]);

  if (state.status === "success") return <SuccessState onReset={reset} />;

  const errors = state.errors ?? {};
  const values = state.values ?? {};

  return (
    <div
      key={formKey}
      className="relative rounded-2xl border p-8"
      style={{
        background: "var(--color-surface)",
        borderColor:
          state.status === "error"
            ? "rgba(239,68,68,0.25)"
            : "var(--color-border-sub)",
      }}
    >
      {/* Top accent line */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-8 right-8 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
          opacity: 0.5,
        }}
      />

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -right-12 w-52 h-52 rounded-full"
        style={{
          background: "var(--color-accent)",
          opacity: 0.04,
          filter: "blur(55px)",
        }}
      />

      <form
        action={formAction}
        noValidate
        aria-label="Contact form"
        className="relative flex flex-col gap-5"
      >
        {/* Honeypot — bots fill this, humans do not */}
        <input
          type="text"
          name="_trap"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute opacity-0 w-0 h-0 pointer-events-none"
          autoComplete="off"
        />

        {/* Heading */}
        <div className="flex flex-col gap-1 mb-1">
          <p
            className="text-[9.5px] font-bold uppercase tracking-[0.16em] mb-1"
            style={{
              color: "var(--color-accent)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Send a message
          </p>
          <Text size="sm" color="muted">
            Tell me about the institution, project, or build. The more context
            you give, the more specific the response.
          </Text>
        </div>

        {/* Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Your Name"
            name="name"
            id="contact-name"
            required
            placeholder="Chidi Okeke"
            autoComplete="name"
            defaultValue={values.name ?? ""}
            error={errors.name}
            disabled={isPending}
          />
          <Input
            label="Email Address"
            name="email"
            id="contact-email"
            type="email"
            required
            placeholder="chidi@institution.edu.ng"
            autoComplete="email"
            defaultValue={values.email ?? ""}
            error={errors.email}
            disabled={isPending}
          />
        </div>

        {/* Subject */}
        <Select
          label="Subject"
          name="subject"
          id="contact-subject"
          required
          defaultValue={values.subject ?? ""}
          error={errors.subject}
          hint="What are you reaching out about? Helps route to the right response."
          disabled={isPending}
        >
          {SUBJECT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value} disabled={!value}>
              {label}
            </option>
          ))}
        </Select>

        {/* Message */}
        <Textarea
          label="Message"
          name="message"
          id="contact-message"
          required
          rows={5}
          maxLength={1200}
          placeholder="Hi, I'm reaching out about licensing AttendIQ for our institution..."
          defaultValue={values.message ?? ""}
          error={errors.message}
          hint="Min. 20 characters — give enough context for a useful response."
          disabled={isPending}
        />

        {/* Server-level error */}
        {state.status === "error" && errors._form && (
          <div
            ref={errorRef}
            tabIndex={-1}
            role="alert"
            className="flex items-start gap-2.5 px-4 py-3 rounded-lg outline-none"
            style={{
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "var(--color-danger)",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <Text size="sm" className="text-[var(--color-danger)]">
              {errors._form}
            </Text>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="glow"
          size="lg"
          loading={isPending}
          disabled={isPending}
          leftIcon={!isPending ? <Send size={14} aria-hidden="true" /> : null}
          className="w-full"
        >
          {isPending ? "Sending…" : "Send Message"}
        </Button>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span
            className="flex items-center gap-1.5"
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-faint)",
              fontFamily: "var(--font-mono)",
            }}
          >
            <Clock size={10} aria-hidden="true" />
            Reply within 24 hrs
          </span>

          <span
            aria-hidden="true"
            className="w-1 h-1 rounded-full"
            style={{ background: "var(--color-border)" }}
          />

          <span
            className="flex items-center gap-1.5"
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-faint)",
              fontFamily: "var(--font-mono)",
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            No spam, ever
          </span>
        </div>
      </form>
    </div>
  );
}

export default ContactForm;
