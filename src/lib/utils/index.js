import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging Tailwind + conditional classes
 * Safe for large-scale component systems
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// lib/utils/parse-bold.jsx
//
// Converts **bold** markers in a string to React <strong> elements.
// Both philosophy-section and principles had identical local copies.
// Extracted once — imported everywhere.
//
// Usage:
//   import { parseBold } from "@/lib/utils/parse-bold";
//   <p>{parseBold("Some **highlighted** text")}</p>

/**
 * @param {string} text — string containing **bold** markers
 * @returns {(string | React.ReactElement)[]}
 */
export function parseBold(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 0 ? (
      part
    ) : (
      <strong
        key={i}
        style={{ color: "var(--color-fg)", fontWeight: 600 }}
        className="not-italic"
      >
        {part}
      </strong>
    ),
  );
}
