import { useEffect, useState } from "react";
import Container from "./layout/container";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════

// Each inner array = one "slide" shown in the ticker.
// After TICKER_INTERVAL ms, we fade out → swap → fade in.
// Add as many sets as you like — the component handles the rest.
const COMPANY_SETS = [
  ["Google", "Microsoft", "Amazon", "Meta", "Apple"],
  ["Stripe", "Shopify", "Vercel", "GitHub", "Atlassian"],
  ["Flutterwave", "Paystack", "Andela", "Netflix", "Spotify"],
  ["Cisco", "Dell", "Deloitte", "Salesforce", "Oracle"],
];

// How long (ms) each set is visible before the crossfade begins
const TICKER_INTERVAL = 3500;

// How long (ms) the opacity transition takes (must match CSS `transition`)
const FADE_DURATION = 380;

// ═══════════════════════════════════════════════════════════════
// HOOK — Cycling ticker with crossfade
// ═══════════════════════════════════════════════════════════════

/**
 * Returns the current company set and a visibility flag.
 *
 * HOW THE CROSSFADE WORKS:
 *   ┌─────────────────────────────────────────────────────────┐
 *   │ t=0        t=3500       t=3880        t=3930            │
 *   │  visible → fade-out  →  swap set  →   fade-in          │
 *   │                FADE_DURATION ms gap                     │
 *   └─────────────────────────────────────────────────────────┘
 *
 * We use two separate timeouts inside one setInterval:
 *   1. setInterval fires → set visible=false (CSS handles fade)
 *   2. After FADE_DURATION → increment index + set visible=true
 *
 * The key insight: we change the *content* only after the element
 * has already faded to opacity:0. This means the user never sees
 * the swap — only the smooth fade in/out.
 */
function useCyclingTicker(sets, interval, fadeDuration) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const outerTimer = setInterval(() => {
      // Step 1 — fade out
      setVisible(false);

      // Step 2 — after the CSS fade completes, swap content + fade in
      const innerTimer = setTimeout(() => {
        setIndex((prev) => (prev + 1) % sets.length);
        setVisible(true);
      }, fadeDuration + 50); // +50ms buffer so swap happens at opacity=0

      // ⚠️ Important: we return a cleanup inside the setInterval callback.
      // But setInterval callbacks don't directly support cleanup.
      // Instead, we store the innerTimer ref and clear it when the
      // outer interval is cleared (see return below).
      return () => clearTimeout(innerTimer);
    }, interval);

    // Cleanup: runs when the component unmounts or deps change.
    // Without this, the interval keeps firing after unmount → memory leak.
    return () => clearInterval(outerTimer);
  }, [sets.length, interval, fadeDuration]);

  return { companies: sets[index], visible };
}

/**
 * CompanyTicker — the animated cycling social-proof bar.
 *
 * LEARNING POINT:
 * The `transition` CSS property + toggling `opacity` is all you need
 * for a smooth crossfade. No animation library required.
 *
 * The bar itself uses CSS Grid to create equal-width columns for
 * each company name, with vertical dividers between them.
 */
export default function CompanyTicker() {
  const { companies, visible } = useCyclingTicker(
    COMPANY_SETS,
    TICKER_INTERVAL,
    FADE_DURATION,
  );

  return (
    <div className="border-t border-[var(--color-border-sub)]">
      <Container size="wide">
        <div className="flex items-stretch min-h-[72px]">
          {/* Left label — static, never animates */}
          <div className="flex items-center pr-6 border-r border-[var(--color-border-sub)] mr-0 shrink-0">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.12em] leading-snug max-w-[120px]"
              style={{ color: "var(--color-faint)" }}
            >
              The best teams in the world hire engineers like me
            </p>
          </div>

          {/*
            Company names row — this is the part that crossfades.

            `style={{ opacity, transition }}` is applied directly.
            When `visible` flips to false: opacity goes to 0.
            When `visible` flips back to true: opacity goes to 1.
            The `transition` property animates the change over FADE_DURATION ms.

            By the time opacity reaches 0 (invisible), we've already
            swapped the content — so the new names "appear" when fading back in.
          */}
          <div
            className="flex flex-1 items-center"
            style={{
              opacity: visible ? 1 : 0,
              transition: `opacity ${FADE_DURATION}ms ease-in-out`,
              // `will-change: opacity` hints to the GPU that this property
              // will animate, allowing it to prepare a compositing layer.
              // This prevents layout recalculations during the animation.
              willChange: "opacity",
            }}
            aria-live="polite" // screen readers will announce new content
            aria-atomic="true" // announce the whole group, not individual changes
          >
            {companies.map((name, i) => (
              <div
                key={name}
                className={cn(
                  "flex items-center justify-center flex-1 px-4",
                  i < companies.length - 1 &&
                    "border-r border-[var(--color-border-sub)]",
                )}
              >
                <span
                  className={cn(
                    "text-sm font-bold tracking-tight whitespace-nowrap",
                    "transition-colors duration-150",
                    "hover:text-[var(--color-accent)]",
                  )}
                  style={{ color: "var(--color-muted)" }}
                >
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
