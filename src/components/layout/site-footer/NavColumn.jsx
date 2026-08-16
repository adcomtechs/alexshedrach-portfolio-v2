// components/layout/site-footer/NavColumn.jsx
// RSC — no client directive required

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * NavColumn
 *
 * A labelled list of footer navigation links.
 * Renders internal links as Next.js <Link> and external links as <a>
 * with appropriate rel attributes.
 *
 * @param {string} label - Column heading. Rendered in mono uppercase.
 * @param {Array}  links - Array of { label, href, external? }.
 */
export function NavColumn({ label, links }) {
  return (
    <div className="flex flex-col gap-4">
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--color-faint)",
        }}
      >
        {label}
      </p>

      <ul className="flex flex-col gap-2.5" role="list">
        {links.map(({ label: linkLabel, href, external }) => (
          <li key={href}>
            {external ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-1 transition-colors duration-150",
                  "hover:text-[var(--color-fg)]",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-[var(--color-accent)] rounded-sm",
                )}
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-muted)",
                }}
              >
                {linkLabel}
                <ArrowUpRight
                  size={11}
                  aria-hidden="true"
                  className="opacity-50"
                />
              </a>
            ) : (
              <Link
                href={href}
                className={cn(
                  "transition-colors duration-150",
                  "hover:text-[var(--color-fg)]",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-[var(--color-accent)] rounded-sm",
                )}
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-muted)",
                }}
              >
                {linkLabel}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
