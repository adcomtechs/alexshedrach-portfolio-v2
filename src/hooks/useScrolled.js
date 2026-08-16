// hooks/useScrolled.js
"use client";

import { useState, useEffect } from "react";

/**
 * useScrolled
 *
 * Returns true when scrollY exceeds the given threshold.
 * Lighter than useScrollState — no progress tracking.
 * Use for visibility gates like the scroll-to-top button.
 *
 * @param {number} threshold - Minimum scrollY in pixels. Default: 400.
 */
export function useScrolled(threshold = 400) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > threshold);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

// // ═══════════════════════════════════════════════════════════════
// // HOOKS
// // ═══════════════════════════════════════════════════════════════

// import { useEffect, useState } from "react";

// export function useScrolled(threshold = 400) {
//   const [above, setAbove] = useState(false);
//   useEffect(() => {
//     const h = () => setAbove(window.scrollY > threshold);
//     window.addEventListener("scroll", h, { passive: true });
//     h();
//     return () => window.removeEventListener("scroll", h);
//   }, [threshold]);
//   return above;
// }
