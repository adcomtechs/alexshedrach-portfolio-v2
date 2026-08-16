import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * CountUp animation triggered when element enters the viewport.
 * Returns { count, ref } — attach ref to the element you want to observe.
 */
export function useCountUp(
  target,
  { duration = 1800, delay = 0, easing = "cubic" } = {},
) {
  const [animatedCount, setAnimatedCount] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const elementRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  // Intersection observer — fires once, then disconnects
  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Animation loop
  useEffect(() => {
    if (!triggered) return;
    if (reduced) return;

    let startTime = null;
    let rafId;

    const delayTimer = setTimeout(() => {
      const tick = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Cubic ease-out for natural deceleration
        const eased =
          easing === "cubic" ? 1 - Math.pow(1 - progress, 3) : progress;

        setAnimatedCount(Math.round(eased * target));
        if (progress < 1) rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(delayTimer);
      cancelAnimationFrame(rafId);
    };
  }, [triggered, target, duration, delay, easing, reduced]);

  const count = reduced && triggered ? target : animatedCount;

  return { count, ref: elementRef };
}
