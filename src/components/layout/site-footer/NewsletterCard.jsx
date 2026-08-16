// components/layout/site-footer/NewsletterCard.jsx
"use client";

/**
 * NewsletterCard
 *
 * Self-contained newsletter subscription card.
 * Moved from components/sections/ to site-footer/ — it is a footer-specific
 * component with no consumers outside the footer.
 *
 * State machine:
 *   idle → typing → invalid | loading → success | error
 *
 * The check-draw animation for the success checkmark is defined inline
 * via a <style> tag. It belongs here rather than animations.css because
 * it is only consumed by this one component.
 *
 * Replace the mock submit handler with a real API call to /api/newsletter.
 */

import { useCallback, useState } from "react";
import { ArrowUpRight, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CHECK_DRAW_STYLE = `
  @keyframes check-draw {
    to { stroke-dashoffset: 0; }
  }
`;

// ── State machine hook ─────────────────────────────────────────
function useNewsletterForm() {
  const [state, setState] = useState("idle");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const isValid = EMAIL_RE.test(email);
  const showErr =
    touched && !isValid && state !== "loading" && state !== "success";

  const handleChange = useCallback(
    (e) => {
      setEmail(e.target.value);
      if (state === "invalid" || state === "error") setState("typing");
    },
    [state],
  );

  const handleBlur = useCallback(() => {
    setTouched(true);
    if (email && !isValid) setState("invalid");
  }, [email, isValid]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setTouched(true);
      if (!isValid) {
        setState("invalid");
        return;
      }

      setState("loading");
      try {
        // TODO: replace with real endpoint
        await new Promise((res) => setTimeout(res, 1400));
        // await fetch("/api/newsletter", { method: "POST", body: JSON.stringify({ email }) });
        setState("success");
        setEmail("");
        setTouched(false);
      } catch (err) {
        setState("error");
        setErrMsg(err.message || "Something went wrong. Please try again.");
      }
    },
    [isValid],
  );

  return {
    state,
    email,
    showErr,
    errMsg,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}

// ── Component ──────────────────────────────────────────────────
export function NewsletterCard({ className }) {
  const {
    state,
    email,
    showErr,
    errMsg,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useNewsletterForm();

  const isLoading = state === "loading";
  const isSuccess = state === "success";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CHECK_DRAW_STYLE }} />

      <div
        className={cn(
          "relative flex flex-col rounded-xl overflow-hidden",
          "border border-[var(--color-border-sub)]",
          className,
        )}
        style={{ background: "var(--color-surface)" }}
      >
        {/* Accent top bar */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
          }}
        />

        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full pointer-events-none"
          style={{
            background: "var(--color-accent)",
            opacity: 0.05,
            filter: "blur(55px)",
          }}
        />

        <div className="relative flex flex-col flex-1 px-7 py-8 gap-6">
          {isSuccess ? (
            /* ── Success state ── */
            <div
              className="flex flex-col items-center justify-center text-center gap-4 flex-1 py-4"
              aria-live="assertive"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background: "var(--color-accent-bg)",
                  border: "1px solid rgba(181,242,61,0.3)",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline
                    points="20 6 9 17 4 12"
                    strokeDasharray="30"
                    strokeDashoffset="30"
                    style={{ animation: "check-draw 0.45s ease forwards 0.1s" }}
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <p
                  className="font-bold"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-base)",
                    color: "var(--color-fg)",
                  }}
                >
                  You&apos;re in.
                </p>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-muted)",
                    lineHeight: "var(--leading-relaxed)",
                  }}
                >
                  I&apos;ll send updates when I ship something worth reading. No
                  noise, ever.
                </p>
              </div>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              {/* Header */}
              <div className="flex flex-col gap-2">
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--color-accent)",
                  }}
                >
                  Newsletter
                </p>
                <h3
                  className="font-bold leading-snug"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-md)",
                    letterSpacing: "-0.02em",
                    color: "var(--color-fg)",
                  }}
                >
                  Engineering updates,
                  <br />
                  shipped to your inbox.
                </h3>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-muted)",
                    lineHeight: "var(--leading-relaxed)",
                  }}
                >
                  Case studies, architecture deep-dives, and lessons from real
                  production systems. No noise.
                </p>
              </div>

              <div
                aria-hidden="true"
                className="h-px"
                style={{ background: "var(--color-border-sub)" }}
              />

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label="Newsletter subscription"
                className="flex flex-col gap-3"
              >
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="newsletter-email"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      fontWeight: 500,
                      letterSpacing: "0.05em",
                      color: "var(--color-muted)",
                    }}
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <input
                      id="newsletter-email"
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                      autoComplete="email"
                      placeholder="you@domain.com"
                      aria-invalid={showErr || state === "error"}
                      aria-describedby={
                        showErr || state === "error"
                          ? "newsletter-error"
                          : undefined
                      }
                      className={cn(
                        "w-full h-10 px-3.5 pr-10 rounded-lg",
                        "border bg-[var(--color-bg)]",
                        "placeholder:text-[var(--color-faint)]",
                        "transition-[border-color,box-shadow] duration-150 outline-none",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        showErr || state === "error"
                          ? "border-[var(--color-danger)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
                          : "border-[var(--color-border)] focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-bg)]",
                      )}
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-fg)",
                      }}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "var(--color-faint)" }}
                    >
                      <Send size={13} />
                    </span>
                  </div>

                  {(showErr || state === "error") && (
                    <p
                      id="newsletter-error"
                      role="alert"
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--color-danger)",
                      }}
                    >
                      {state === "error"
                        ? errMsg
                        : "Please enter a valid email address."}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "relative w-full h-10 px-5 rounded-lg font-bold overflow-hidden",
                    "transition-[background,transform,box-shadow] duration-150",
                    "focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
                    "focus-visible:ring-offset-[var(--color-bg)]",
                    isLoading
                      ? "bg-[var(--color-accent-dim)] cursor-not-allowed"
                      : "bg-[var(--color-accent)] hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,white)] hover:-translate-y-px hover:shadow-[var(--shadow-glow)] active:translate-y-0",
                  )}
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-accent-contrast)",
                  }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                          opacity="0.25"
                        />
                        <path
                          d="M4 12a8 8 0 0 1 8-8"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      Subscribing…
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1.5">
                      Subscribe
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </span>
                  )}
                </button>

                <p
                  className="text-center"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-faint)",
                  }}
                >
                  No spam · Unsubscribe anytime
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
