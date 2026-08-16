// hooks/useOnScreen.js
"use client";

import { useState, useEffect } from "react";

/**
 * useOnScreen
 *
 * Returns true when the observed element enters the viewport.
 * By default, once visible it stays visible — suitable for entrance
 * animations that should not re-trigger on scroll-back.
 *
 * @param {RefObject} ref       - React ref attached to the target element.
 * @param {object}    options   - IntersectionObserver options.
 * @param {number}    options.threshold  - Visibility fraction to trigger. Default: 0.05.
 * @param {boolean}   options.once      - If true (default), stops observing after first trigger.
 *
 * Usage:
 *   const ref = useRef(null);
 *   const visible = useOnScreen(ref, { threshold: 0.1 });
 *   <div ref={ref} style={{ opacity: visible ? 1 : 0 }}>...</div>
 */
export function useOnScreen(ref, { threshold = 0.05, once = true } = {}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold, once]);

  return visible;
}

// "use client";

// import { useEffect, useState } from "react";

// /** Returns true when element is in viewport */
// export function useOnScreen(ref, options = {}) {
//   const [visible, setVisible] = useState(false);
//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     const obs = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setVisible(true);
//           obs.disconnect();
//         }
//       },
//       { threshold: 0.15, ...options },
//     );
//     obs.observe(el);
//     return () => obs.disconnect();
//   }, [ref]);
//   return visible;
// }
