// features/projects/PaginationControls.jsx
// RSC — no client directive required.
//
// URL-based pagination — /projects?page=2. (DEC-027)
// All page links are <Link> components — zero client JS.
// Active filters (domain, status) are preserved in every page URL.
// Page 1 omits the page param to keep the URL clean.
//
// Renders only when conditions.showPagination is true — that check lives
// in page.jsx. This component always renders when called. (DEC-031)

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ── URL builder ────────────────────────────────────────────────────────────────
//
// Preserves active filters when building page links.
// Page 1 is the clean default — param omitted to avoid /projects?page=1.

function buildPageUrl(page, filters) {
  const params = new URLSearchParams();

  if (filters.domain) params.set("domain", filters.domain);
  if (filters.status) params.set("status", filters.status);
  if (page > 1) params.set("page", String(page));

  const query = params.toString();
  return `/projects${query ? `?${query}` : ""}`;
}

// ── Page range ─────────────────────────────────────────────────────────────────
//
// Returns an array of page numbers and "ellipsis" markers to render.
// For ≤ 7 total pages: show all. For more: show first, last, and a
// window of ±1 around the current page, with ellipsis gaps between.

function getPageItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items = [];
  const winStart = Math.max(2, currentPage - 1);
  const winEnd = Math.min(totalPages - 1, currentPage + 1);

  items.push(1);
  if (winStart > 2) items.push("ellipsis-start");
  for (let i = winStart; i <= winEnd; i++) items.push(i);
  if (winEnd < totalPages - 1) items.push("ellipsis-end");
  items.push(totalPages);

  return items;
}

// ── Shared styles ──────────────────────────────────────────────────────────────

const cellBase = cn(
  "inline-flex items-center justify-center",
  "h-8 min-w-[2rem] px-2 rounded-md",
  "transition-colors duration-150",
  "focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1",
  "focus-visible:ring-offset-[var(--color-bg)]",
);

// ── Sub-components ─────────────────────────────────────────────────────────────

function PageLink({ page, currentPage, filters }) {
  const isActive = page === currentPage;

  return (
    <Link
      href={buildPageUrl(page, filters)}
      aria-label={`Page ${page}`}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        cellBase,
        isActive
          ? "bg-[var(--color-accent-bg)] text-[var(--color-accent)] border border-[rgba(181,242,61,0.3)] font-semibold"
          : "text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]",
      )}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-xs)",
        letterSpacing: "0.04em",
      }}
    >
      {page}
    </Link>
  );
}

function Ellipsis() {
  return (
    <span
      aria-hidden
      className={cn(cellBase, "cursor-default")}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-xs)",
        color: "var(--color-faint)",
      }}
    >
      …
    </span>
  );
}

function NavLink({ href, label, icon: Icon, disabled }) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        aria-label={label}
        className={cn(cellBase, "cursor-not-allowed opacity-30")}
        style={{ color: "var(--color-faint)" }}
      >
        <Icon size={14} aria-hidden />
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        cellBase,
        "text-[var(--color-muted)]",
        "hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]",
      )}
    >
      <Icon size={14} aria-hidden />
    </Link>
  );
}

// ── PaginationControls ─────────────────────────────────────────────────────────

/**
 * PaginationControls
 *
 * Renders previous, page number, and next links as a centered row.
 * All links are RSC-safe — no client JS, no router.push.
 * Active filters are threaded through every page URL so filtering
 * and pagination compose correctly. (DEC-027)
 *
 * @param {number}  currentPage  - Current page number (1-indexed).
 * @param {number}  totalPages   - Total page count.
 * @param {boolean} hasNext      - Whether a next page exists.
 * @param {boolean} hasPrev      - Whether a previous page exists.
 * @param {{ domain: string|null, status: string|null, page: number }} filters
 *   Active filters — preserved in all page links.
 */
export function PaginationControls({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  filters,
}) {
  const pageItems = getPageItems(currentPage, totalPages);

  return (
    <nav
      aria-label="Project pagination"
      className={cn(
        "flex items-center justify-center gap-1 mt-8 mb-1",
        "bg-[var(--color-surface)] rounded-md",
        "px-3 py-2",
      )}
      // className="flex items-center justify-center gap-1 mt-8 bg-amber-400"
    >
      {/* Previous */}
      <NavLink
        href={buildPageUrl(currentPage - 1, filters)}
        label="Previous page"
        icon={ChevronLeft}
        disabled={!hasPrev}
      />

      {/* Page numbers */}
      {pageItems.map((item, i) => {
        if (item === "ellipsis-start" || item === "ellipsis-end") {
          return <Ellipsis key={item} />;
        }
        return (
          <PageLink
            key={item}
            page={item}
            currentPage={currentPage}
            filters={filters}
          />
        );
      })}

      {/* Next */}
      <NavLink
        href={buildPageUrl(currentPage + 1, filters)}
        label="Next page"
        icon={ChevronRight}
        disabled={!hasNext}
      />
    </nav>
  );
}
