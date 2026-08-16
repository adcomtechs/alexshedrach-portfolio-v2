// hooks/usePrefersReducedMotion.js
"use client";

import { useSyncExternalStore } from "react";

/**
 * usePrefersReducedMotion
 *
 * Returns true when the user's OS-level "reduce motion" preference is active.
 * Use to gate staggered animations, transitions, and entrance effects.
 *
 * Responds to live changes — if the user updates their preference while the
 * page is open, components re-render correctly.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}
