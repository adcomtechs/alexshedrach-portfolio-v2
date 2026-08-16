// components/layout/site-footer/SocialLinks.jsx
// RSC — no client directive required

import { cn } from "@/lib/utils";
import { SOCIAL_LINKS } from "./constants";

/**
 * SocialLinks
 *
 * Row of icon-only social buttons. Each opens in a new tab.
 * Icons are inline SVG defined in constants.js to avoid a
 * lucide dependency on brand glyphs that lucide doesn't carry.
 */
export function SocialLinks() {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {SOCIAL_LINKS.map(({ id, label, href, icon }) => (
        <a
          key={id}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={cn(
            "flex items-center justify-center w-9 h-9 rounded-lg",
            "border border-[var(--color-border)] bg-[var(--color-surface)]",
            "text-[var(--color-muted)]",
            "transition-all duration-150",
            "hover:text-[var(--color-fg)] hover:bg-[var(--color-surface-2)]",
            "hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
          )}
        >
          {icon}
        </a>
      ))}
    </div>
  );
}
