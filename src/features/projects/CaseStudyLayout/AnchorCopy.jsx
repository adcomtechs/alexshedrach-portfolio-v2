// features/projects/AnchorCopy/AnchorCopy.jsx
"use client";
//
// use client justified — navigator.clipboard.writeText is a browser API.
// This is the minimum client boundary: clipboard write only.
// The hover reveal (opacity-0 → opacity-100) is CSS-only via Tailwind's
// group modifier — no JS is involved in showing or hiding the button.
// The section label, anchor ID, and heading are all RSC-rendered. (DEC-036)
//
// PARENT CONTRACT
// ───────────────
// The parent element that contains this component must have className="group"
// for the hover reveal to work. That parent is the label row in CaseStudySection.
// The section element must have id={sectionId} for anchor scrolling and
// IntersectionObserver targeting. (DEC-036)
//
// CLIPBOARD FALLBACK
// ──────────────────
// navigator.clipboard is unavailable in non-secure contexts and some
// older browsers. The catch block silently swallows the failure — the
// section is still readable and scrollable, just not copyable. (DEC-036)

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * AnchorCopy
 *
 * Copy icon button that writes a direct section URL to the clipboard.
 * Appears on hover of the parent group element. Keyboard-accessible via
 * focus-visible (focus makes the button visible regardless of hover state).
 *
 * On copy: icon switches to a checkmark for 2 seconds, then resets.
 * URL format: origin + pathname + "#" + sectionId
 *   e.g. https://alexshedrach.dev/projects/scholarhive#architecture
 *
 * @param {string} sectionId - The anchor ID of the target section element.
 *   Must match the `id` attribute on the section's root DOM element.
 */
export function AnchorCopy({ sectionId }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      // Reset after 2 seconds — matches typical "copied" confirmation patterns
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silent fail.
      // The section remains fully functional; only the copy shortcut is absent.
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Link copied" : "Copy link to this section"}
      // opacity-0 by default — revealed by parent's group-hover state (CSS only).
      // focus-visible:opacity-100 ensures keyboard users can always reach it.
      className={cn(
        "inline-flex items-center justify-center",
        "w-4 h-4 rounded-sm shrink-0",
        "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
        "transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1",
        "focus-visible:ring-offset-[var(--color-bg)]",
        copied
          ? "text-[var(--color-success)]"
          : "text-[var(--color-faint)] hover:text-[var(--color-muted)]",
      )}
    >
      {copied ? (
        <Check size={11} aria-hidden strokeWidth={2.5} />
      ) : (
        <Link2 size={11} aria-hidden strokeWidth={2} />
      )}
    </button>
  );
}
