// hooks/useTicker.js
//
// Double-buffer swap logic for the TechTicker component.
// Extracted from TechTicker.jsx — if a second component needs animated
// panel swapping, this hook is the single source of that logic.
//
// FADE_DURATION is defined here — not in the consumer — because the timing
// contract belongs to the hook. The consumer should not need to know how
// long the CSS transition takes to manage reset timing correctly.
//
// If the .ticker-panel CSS transition duration in base.css changes,
// FADE_DURATION must be updated here to match.

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Must match the `transition-duration` on `.ticker-panel` in base.css.
 * The hook uses this value to reset the outgoing slot after the CSS
 * transition completes, preventing a flash of stale content.
 */
export const TICKER_FADE_DURATION = 380; // ms

/**
 * useTicker
 *
 * Manages the double-buffer swap logic for an animated panel sequence.
 *
 * MENTAL MODEL:
 *   Two DOM slots (A and B) alternate between three CSS states:
 *     panel-enter   — off-screen, positioned below visible area
 *     panel-visible — on-screen, full opacity
 *     panel-exit    — leaving, sliding up and fading out
 *
 *   On each cycle:
 *     1. Incoming slot is pre-loaded with next content while still off-screen
 *     2. Both slots fire their CSS transitions simultaneously via rAF
 *     3. After TICKER_FADE_DURATION, outgoing slot resets to panel-enter
 *
 * @param {Array}  slides   - Array of slide data objects
 * @param {number} interval - ms between auto-advance transitions
 *
 * @returns {{
 *   currentIndex: number,
 *   slotStates: { a: string, b: string },
 *   slotContent: { a: Object, b: Object },
 *   jumpToSlide: (index: number) => void
 * }}
 */
export function useTicker(slides, interval) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // "a" | "b" — which slot is currently visible
  const [activeSlot, setActiveSlot] = useState("a");

  // CSS state class for each slot
  const [slotStates, setSlotStates] = useState({
    a: "panel-visible",
    b: "panel-enter",
  });

  // Content rendered inside each slot — may differ from currentIndex mid-transition
  const [slotContent, setSlotContent] = useState({
    a: slides[0],
    b: slides[1] ?? slides[0],
  });

  // Prevents overlapping transitions from queuing
  const inTransition = useRef(false);

  const transition = useCallback(
    (nextIndex) => {
      if (inTransition.current) return;
      inTransition.current = true;

      const incomingSlot = activeSlot === "a" ? "b" : "a";
      const outgoingSlot = activeSlot;

      // Step 1: pre-load content into the off-screen slot before any visual change
      setSlotContent((prev) => ({
        ...prev,
        [incomingSlot]: slides[nextIndex],
      }));
      setCurrentIndex(nextIndex);

      // Step 2: trigger both CSS transitions on the next animation frame.
      // rAF ensures the pre-load render has committed before transitions fire.
      requestAnimationFrame(() => {
        setSlotStates({
          [outgoingSlot]: "panel-exit",
          [incomingSlot]: "panel-visible",
        });
        setActiveSlot(incomingSlot);

        // Step 3: after the CSS transition completes, reset the outgoing slot.
        // The +40ms buffer accounts for browser rendering variance.
        setTimeout(() => {
          setSlotStates((prev) => ({ ...prev, [outgoingSlot]: "panel-enter" }));
          inTransition.current = false;
        }, TICKER_FADE_DURATION + 40);
      });
    },
    [activeSlot, slides],
  );

  const jumpToSlide = useCallback(
    (targetIndex) => {
      if (targetIndex === currentIndex) return;
      transition(targetIndex);
    },
    [currentIndex, transition],
  );

  // Auto-advance
  useEffect(() => {
    const id = setInterval(() => {
      transition((currentIndex + 1) % slides.length);
    }, interval);
    return () => clearInterval(id);
  }, [currentIndex, interval, transition, slides.length]);

  return { currentIndex, slotStates, slotContent, jumpToSlide };
}
