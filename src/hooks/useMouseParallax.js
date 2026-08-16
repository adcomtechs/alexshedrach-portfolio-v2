import { useCallback, useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Subtle mouse-parallax for ambient background elements.
 * Clamps at ±maxPx to avoid large shifts.
 */
export function useMouseParallax(maxPx = 28) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduced = usePrefersReducedMotion();

  const handler = useCallback(
    (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * maxPx * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * maxPx * 2;
      setOffset({ x, y });
    },
    [maxPx],
  );

  useEffect(() => {
    if (reduced) return;
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [handler, reduced]);

  return offset;
}
