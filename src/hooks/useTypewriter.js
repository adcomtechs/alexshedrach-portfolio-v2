import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Typewriter that cycles through an array of words.
 * Respects reduced-motion by immediately showing the first word.
 */
export function useTypewriter(
  words,
  { typeSpeed = 75, eraseSpeed = 45, holdMs = 2400, startDelayMs = 700 } = {},
) {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState("await"); // await | type | hold | erase
  const [showCursor, setShowCursor] = useState(true);
  const reduced = usePrefersReducedMotion();

  // Cursor blink — independent of typewriter phase
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(id);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;

    let timer;
    const word = words[wordIdx % words.length];

    switch (phase) {
      case "await":
        timer = setTimeout(() => setPhase("type"), startDelayMs);
        break;

      case "type":
        if (text.length < word.length) {
          // Slight variance in typing speed for realism
          const variance = typeSpeed + Math.random() * 20 - 10;
          timer = setTimeout(
            () => setText(word.slice(0, text.length + 1)),
            variance,
          );
        } else {
          timer = setTimeout(() => setPhase("hold"), holdMs);
        }
        break;

      case "hold":
        // Pause at full word before erasing
        timer = setTimeout(() => setPhase("erase"), 0);
        break;

      case "erase":
        if (text.length > 0) {
          timer = setTimeout(() => setText((t) => t.slice(0, -1)), eraseSpeed);
        } else {
          timer = setTimeout(() => {
            setWordIdx((i) => i + 1);
            setPhase("type");
          }, 0);
        }
        break;
    }

    return () => clearTimeout(timer);
  }, [
    phase,
    text,
    wordIdx,
    words,
    typeSpeed,
    eraseSpeed,
    holdMs,
    startDelayMs,
    reduced,
  ]);

  return {
    text: reduced ? words[0] : text,
    showCursor: reduced ? false : showCursor,
  };
}
