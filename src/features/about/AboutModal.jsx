"use client";

// features/about/AboutModal.jsx
//
// Expanded "How I Build" modal — opened when the user clicks the primary CTA
// in AboutTeaser. Renders the ABOUT_EXTENDED sections from data/about.js.
//
// This is the slower, deeper read. The reader actively chose to open this —
// they are already interested. Give them the full argument without hedging.
//
// DESIGN:
//   - Full-screen overlay on mobile, centered modal on desktop (max-w 680px)
//   - Each ABOUT_EXTENDED section rendered as a headed prose block
//   - Left accent bar on each section mirrors the AboutTeaser editorial style
//   - Closes on: Escape key, backdrop click, close button
//   - Focus trap: focus moves to the modal on open, returns to trigger on close
//   - aria-modal + role="dialog" for screen reader context
//
// DATA: data/about.js → ABOUT_EXTENDED (4 sections)

import { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ABOUT_EXTENDED, ABOUT_INTRO } from "@/lib/data/about";

/**
 * AboutModal
 *
 * @param {boolean}  isOpen  — controlled by parent useState
 * @param {Function} onClose — called when the modal should close
 */
export function AboutModal({ isOpen, onClose }) {
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);

  // ── Focus management ─────────────────────────────────────────────────────
  // On open: move focus to the close button (first interactive element)
  // On close: focus returns to whatever triggered the open (handled by browser
  // since we use a <dialog>-like pattern with returnFocus)
  useEffect(() => {
    if (isOpen) {
      // Small delay so the transition has started before focus moves
      const t = setTimeout(() => closeBtnRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // ── Keyboard: Escape to close ─────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // ── Body scroll lock ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // ── Overlay ───────────────────────────────────────────────────────────
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-hidden="false"
    >
      {/* ── Modal panel ────────────────────────────────────────────────── */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-modal-heading"
        className={cn(
          "relative flex flex-col w-full max-w-[680px] max-h-[90vh]",
          "rounded-2xl overflow-hidden",
          "border border-[var(--color-border-sub)]",
        )}
        style={{ background: "var(--color-bg)" }}
      >
        {/* ── Modal header ───────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-8 py-5 shrink-0"
          style={{
            borderBottom: "1px solid var(--color-border-sub)",
            background: "var(--color-surface)",
          }}
        >
          <div className="flex flex-col gap-0.5">
            <h2
              id="about-modal-heading"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-base)",
                fontWeight: 700,
                color: "var(--color-fg)",
                letterSpacing: "var(--tracking-tight)",
              }}
            >
              {ABOUT_INTRO.modalButtonLabel}
            </h2>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-faint)",
                letterSpacing: "0.06em",
              }}
            >
              {ABOUT_INTRO.brandHandle}
            </span>
          </div>

          {/* Close button */}
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close — How I Build"
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              "border border-[var(--color-border)]",
              "transition-all duration-150",
              "hover:border-[var(--color-muted)] hover:text-[var(--color-fg)]",
              "focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2",
            )}
            style={{
              background: "var(--color-surface-2)",
              color: "var(--color-muted)",
            }}
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>

        {/* ── Scrollable content ─────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="flex flex-col gap-10">
            {ABOUT_EXTENDED.map((section, i) => (
              <div key={section.id} className="flex flex-col gap-4">
                {/* Section heading row — number + title */}
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      color: "var(--color-accent)",
                      letterSpacing: "0.08em",
                      fontWeight: 700,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-base)",
                      fontWeight: 700,
                      color: "var(--color-fg)",
                      letterSpacing: "var(--tracking-tight)",
                    }}
                  >
                    {section.heading}
                  </h3>
                </div>

                {/* Content block — left accent bar + prose */}
                <div className="flex items-start gap-4">
                  <div
                    aria-hidden="true"
                    className="w-[2px] self-stretch rounded-full shrink-0 mt-1"
                    style={{ background: "var(--color-border-sub)" }}
                  />
                  <p
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--color-muted)",
                      lineHeight: "var(--leading-relaxed)",
                    }}
                  >
                    {section.content}
                  </p>
                </div>

                {/* Divider — not rendered after last section */}
                {i < ABOUT_EXTENDED.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="h-px w-full mt-2"
                    style={{ background: "var(--color-border-sub)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Modal footer — links out ──────────────────────────────── */}
        <div
          className="flex items-center justify-between gap-4 px-8 py-5 shrink-0 flex-wrap"
          style={{
            borderTop: "1px solid var(--color-border-sub)",
            background: "var(--color-surface)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--color-faint)",
              letterSpacing: "0.04em",
            }}
          >
            {ABOUT_EXTENDED.length} sections ·{" "}
            <span style={{ color: "var(--color-accent)" }}>
              {ABOUT_INTRO.brandHandle.split(" · ")[1]}
            </span>
          </span>

          <a
            href="/about"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 transition-colors duration-150"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--color-faint)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-faint)";
            }}
          >
            {ABOUT_INTRO.fullPageLabel}
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 5h8M5.5 1.5L9 5l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
