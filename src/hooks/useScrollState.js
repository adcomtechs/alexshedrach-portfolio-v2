// hooks/useScrollState.js
"use client";

import { useState, useEffect, useRef } from "react";

/**
 * useScrollState
 *
 * Tracks vertical scroll position, rAF-batched so rapid scroll events
 * don't trigger a setState per frame-fraction — one measurement per
 * paint, matching how the browser actually schedules work.
 *
 * Returns:
 *   scrolled  — true past `threshold`. Drives header background/border.
 *   progress  — scroll percentage through the page [0–100].
 *
 * @param {number} threshold - Minimum scrollY to set scrolled=true. Default: 10.
 */
export function useScrollState(threshold = 10) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const frame = useRef(null);

  useEffect(() => {
    function measure() {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;

      setScrolled(y > threshold);
      setProgress(max > 0 ? Math.min((y / max) * 100, 100) : 0);
      frame.current = null;
    }

    function onScroll() {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(measure);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    measure(); // sync on mount — avoids a flash of "unscrolled" state on refresh mid-page

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [threshold]);

  return { scrolled, progress };
}