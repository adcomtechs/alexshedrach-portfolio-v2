"use client";

/** Live clock — used in the status terminal card */
import { useEffect, useState } from "react";

export function useLiveClock() {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      setClock(
        now.toLocaleTimeString("en-GB", {
          hour12: false,
        }),
      );
    };

    updateClock(); // initial value

    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  return clock;
}
