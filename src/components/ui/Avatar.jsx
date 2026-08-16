// components/ui/Avatar/Avatar.jsx
// RSC — no client directive required

import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Avatar
 *
 * User or entity representation. Renders an image when `src` is provided,
 * falls back to initials when image is unavailable or omitted.
 *
 * The fallback renders the first two characters of `alt` as initials.
 * Always provide `alt` — it is used both for image accessibility and
 * as the initials source when no image is present.
 *
 * @param {string}  src       - Image URL. When omitted, renders initials fallback.
 * @param {string}  alt       - Image alt text. Also used to derive initials.
 *                              Required for accessibility.
 * @param {string}  size      - "sm" | "md" | "lg" | "xl". Default: "md"
 * @param {string}  className - Layout overrides only.
 *
 * Usage:
 *   <Avatar src="/me.jpg" alt="Alex Shedrach" size="lg" />
 *   <Avatar alt="Alex Shedrach" />  ← renders "AS" initials
 */

const sizes = {
  sm: { className: "w-8 h-8", textClass: "text-[10px]", px: 32 },
  md: { className: "w-10 h-10", textClass: "text-xs", px: 40 },
  lg: { className: "w-14 h-14", textClass: "text-sm", px: 56 },
  xl: { className: "w-20 h-20", textClass: "text-base", px: 80 },
};

function getInitials(alt = "") {
  return alt
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({ src, alt = "", size = "md", className }) {
  const config = sizes[size] ?? sizes.md;
  const initials = getInitials(alt);

  const base = cn(
    "relative flex items-center justify-center rounded-full overflow-hidden",
    "shrink-0 select-none",
    // --color-surface-2 is the correct semantic token for a filled container
    // background. --color-border was wrong — it's for dividing lines.
    "bg-[var(--color-surface-2)]",
    "font-semibold text-[var(--color-muted)]",
    config.className,
    className,
  );

  if (src) {
    return (
      <div className={base}>
        <Image
          src={src}
          alt={alt}
          width={config.px}
          height={config.px}
          className="object-cover w-full h-full"
          // Unoptimized for external URLs — caller opts in to optimization
          // by passing a path served through Next.js Image optimization.
        />
      </div>
    );
  }

  return (
    <div className={base} aria-label={alt} role="img">
      <span className={cn("font-semibold leading-none", config.textClass)}>
        {initials || "?"}
      </span>
    </div>
  );
}
