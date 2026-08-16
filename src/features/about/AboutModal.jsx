"use client";

// features/about/AboutModal.jsx
//
// Expanded "How I Build" modal — opened when the user clicks the primary CTA
// in AboutTeaser. Renders the ABOUT_EXTENDED sections from data/about.js.
//
// Client boundary: focus management, keyboard handling, body scroll lock,
// and the portal itself all require it. Add to the use-client ledger
// (AI_CONTEXT.md §4) — "AboutModal — modal focus trap, scroll lock, and
// portal mount" — alongside AboutTeaser's entry. Both are legitimate per
// DESIGN_SYSTEM.md §6.4's own list: "Body scroll lock and focus management
// for modal/drawer surfaces."
//
// ── Fixes in this pass ──────────────────────────────────────────────────
//   - Real focus trap. The previous version's header comment claimed one
//     existed; it didn't — Tab could escape into the page behind the
//     modal. Tab/Shift+Tab now wrap within the dialog's focusable elements.
//   - Focus actually returns to the trigger on close. Previously claimed,
//     not implemented. The element that had focus at open time is now
//     captured and restored on close.
//   - Renders through createPortal to document.body instead of inline in
//     the tree — makes the "avoids stacking context issues" comment in
//     AboutTeaser actually true instead of aspirational.
//   - Scroll lock compensates for scrollbar width so the page doesn't
//     shift when the lock engages/releases.
//   - Footer link hover converted from onMouseEnter/onMouseLeave to CSS
//     hover: — same class of bug fixed in TechTicker.jsx.
//   - Hand-rolled inline SVG arrow replaced with lucide-react's ArrowRight
//     — lucide is already imported here for the close icon (X); no reason
//     to hand-roll a second icon system in the same file.
//   - Inline style micro-copy converted to .text-label + font-display
//     utility (now registered in tokens.css) + token-backed Tailwind
//     classes throughout.

import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ABOUT_EXTENDED, ABOUT_INTRO } from "@/lib/data/about";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * AboutModal
 *
 * @param {boolean}  isOpen  — controlled by parent useState
 * @param {Function} onClose — called when the modal should close
 */
export function AboutModal({ isOpen, onClose }) {
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const triggerRef = useRef(null);

  // ── Focus management: move in on open, trap while open, restore on close ──
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
      const t = setTimeout(() => closeBtnRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
    triggerRef.current?.focus?.();
    triggerRef.current = null;
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // ── Body scroll lock — compensates for scrollbar width to prevent the
  //    page shifting when the lock engages/releases. ──────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm md:p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-modal-heading"
        className="relative flex max-h-[90vh] w-full max-w-[680px] flex-col overflow-hidden rounded-2xl border border-(--color-border-sub) bg-(--color-bg)"
      >
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex shrink-0 items-center justify-between border-b border-(--color-border-sub) bg-(--color-surface) px-8 py-5">
          <div className="flex flex-col gap-0.5">
            <h2
              id="about-modal-heading"
              className="text-base font-bold tracking-tight text-(--color-fg)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {ABOUT_INTRO.modalButtonLabel}
            </h2>
            <span className="text-label tracking-wide text-(--color-faint)">
              {ABOUT_INTRO.brandHandle}
            </span>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close — How I Build"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              "border border-(--color-border) bg-(--color-surface-2) text-(--color-muted)",
              "transition-all duration-150",
              "hover:border-(--color-muted) hover:text-(--color-fg)",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent)",
            )}
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>

        {/* ── Scrollable content ─────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="flex flex-col gap-10">
            {ABOUT_EXTENDED.map((section, i) => (
              <div key={section.id} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-label tracking-wide text-(--color-accent) font-bold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="text-base font-bold tracking-tight text-(--color-fg)"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {section.heading}
                  </h3>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    aria-hidden="true"
                    className="mt-1 w-[2px] shrink-0 self-stretch rounded-full bg-(--color-border-sub)"
                  />
                  <p className="text-sm leading-relaxed text-(--color-muted)">
                    {section.content}
                  </p>
                </div>

                {i < ABOUT_EXTENDED.length - 1 && (
                  <div aria-hidden="true" className="mt-2 h-px w-full bg-(--color-border-sub)" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-(--color-border-sub) bg-(--color-surface) px-8 py-5">
          <span className="text-label tracking-wide text-(--color-faint)">
            {ABOUT_EXTENDED.length} sections ·{" "}
            <span className="text-(--color-accent)">
              {ABOUT_INTRO.brandHandle.split(" · ")[1]}
            </span>
          </span>

          <a
            href="/about"
            onClick={onClose}
            className="text-label inline-flex items-center gap-1.5 tracking-wide text-(--color-faint) no-underline transition-colors duration-150 hover:text-(--color-accent)"
          >
            {ABOUT_INTRO.fullPageLabel}
            <ArrowRight size={10} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}