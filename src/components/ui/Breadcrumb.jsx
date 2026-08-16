// components/ui/Breadcrumb.jsx
// RSC — no client directive required

import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Breadcrumb
 *
 * Accessible navigation trail for nested routes.
 * Renders semantic <nav> with <ol> and proper aria attributes.
 *
 * @param {Array}  items - Array of { label: string, href?: string }.
 *                         The last item is treated as the current page —
 *                         `href` is ignored on the final item.
 *
 * Usage:
 *   <Breadcrumb items={[
 *     { label: "Projects", href: "/projects" },
 *     { label: "Case Study Name" }
 *   ]} />
 */

// Chevron inline — avoids lucide-react import at this primitive level.
// Lucide is acceptable in feature components; primitives stay dependency-free.
function ChevronRight() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-[var(--color-faint)]"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function Breadcrumb({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb">
      <ol role="list" className="flex items-center gap-1.5 flex-wrap">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;

          return (
            // Keyed by index — label is not guaranteed unique across routes
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight />}

              {isLast ? (
                <span
                  aria-current="page"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-fg)",
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  style={{ fontSize: "var(--text-sm)" }}
                  className={cn(
                    "text-[var(--color-muted)]",
                    "hover:text-[var(--color-fg)] transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-[var(--color-accent)] rounded-sm",
                  )}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
