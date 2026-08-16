"use client";
// features/projects/DomainSidebar.jsx
//
// use client — router.push for URL-based filter state. (DEC-025)
//
// FIXES (this version):
//   ✓ DomainRow hoisted to module scope — was defined inside DomainSidebar's
//     render function, causing React to treat it as a new component type on
//     every render. onSelect passed as prop instead of closing over setDomain.
//   ✓ Panel uses flex-1 — fills the remaining vertical height of the sidebar
//     column when the flex-row parent uses default stretch alignment.
//
// Design contract:
//   Mobile  — horizontal scrollable pill row, full width, above project list
//   Desktop — vertical panel, fills column height, left of project grid

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// DOMAIN ROW — module scope (React requirement for stable component identity)
//
// Renders two layouts via responsive visibility:
//   Desktop: full-width row — left accent border + truncated label + count badge
//   Mobile:  compact rounded pill
//
// onSelect(value: string | null) — called with the domain value on click.
// ─────────────────────────────────────────────────────────────────────────────

function DomainRow({ value, label, count, isActive, onSelect }) {
  return (
    <li>
      {/* ── Desktop row ──────────────────────────────────────────────────── */}
      <button
        onClick={() => onSelect(value)}
        title={label}
        aria-current={isActive ? "true" : undefined}
        className={cn(
          "hidden lg:flex w-full items-center justify-between gap-3",
          "px-4 py-2.5 border-l-2",
          "transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset",
          "focus-visible:ring-[var(--color-accent)]",
          isActive ? "border-[var(--color-accent)]" : "border-transparent",
        )}
        style={{
          background: isActive ? "var(--color-accent-bg)" : "transparent",
        }}
        onMouseEnter={(e) => {
          if (!isActive)
            e.currentTarget.style.background = "var(--color-surface-2)";
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.background = "transparent";
        }}
      >
        <span
          className="truncate text-left"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-sm)",
            fontWeight: isActive ? 600 : 400,
            color: isActive ? "var(--color-fg)" : "var(--color-muted)",
            lineHeight: "var(--leading-snug)",
          }}
        >
          {label}
        </span>

        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.5625rem",
            letterSpacing: "0.06em",
            flexShrink: 0,
            padding: "2px 6px",
            borderRadius: "3px",
            lineHeight: 1.6,
            color: isActive ? "var(--color-accent)" : "var(--color-faint)",
            background: isActive
              ? "rgba(181,242,61,0.1)"
              : "var(--color-surface-2)",
            border: `1px solid ${isActive ? "rgba(181,242,61,0.2)" : "var(--color-border)"}`,
          }}
        >
          {count}
        </span>
      </button>

      {/* ── Mobile pill ──────────────────────────────────────────────────── */}
      <button
        onClick={() => onSelect(value)}
        className={cn(
          "lg:hidden flex items-center gap-1.5 shrink-0",
          "px-3 py-1.5 rounded-full border",
          "transition-all duration-150 whitespace-nowrap",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1",
          isActive
            ? "border-[rgba(181,242,61,0.4)]"
            : "border-[var(--color-border)]",
        )}
        style={{
          background: isActive
            ? "var(--color-accent-bg)"
            : "var(--color-surface)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            letterSpacing: "0.04em",
            color: isActive ? "var(--color-accent)" : "var(--color-muted)",
            fontWeight: isActive ? 600 : 400,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.5625rem",
            color: isActive ? "var(--color-accent)" : "var(--color-faint)",
          }}
        >
          {count}
        </span>
      </button>
    </li>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DOMAIN SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * DomainSidebar
 *
 * @param {{ value: string, label: string, count: number }[]} domains
 * @param {string|null}  activeFilter
 * @param {number}       totalCount
 * @param {string}       [className]
 */
export function DomainSidebar({
  domains,
  activeFilter,
  totalCount,
  className,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function buildUrl(domain) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (domain) params.set("domain", domain);
    else params.delete("domain");
    const query = params.toString();
    return `${pathname}${query ? `?${query}` : ""}`;
  }

  function setDomain(value) {
    router.push(buildUrl(value), { scroll: false });
  }

  const allIsActive = !activeFilter;

  return (
    // nav is a flex column so the desktop panel can use flex-1 to fill height.
    // The parent flex row in page.jsx uses default stretch (no items-start),
    // which makes this nav stretch to the height of the right column.
    <nav
      aria-label="Filter projects by domain"
      className={cn("flex flex-col", className)}
    >
      {/* ── Desktop sidebar panel ─────────────────────────────────────────── */}
      {/*
          flex-1 expands this panel to fill the nav's full height.
          The nav stretches to the right column's height via the parent flex row.
          Result: sidebar panel always matches the section height.
      */}
      <div
        className="hidden lg:flex flex-col flex-1 overflow-hidden"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-sub)",
          borderRadius: "0.75rem",
        }}
      >
        {/* Panel header */}
        <div
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{ borderBottom: "1px solid var(--color-border-sub)" }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.5625rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-faint)",
              fontWeight: 600,
            }}
          >
            Domain
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.5625rem",
              letterSpacing: "0.06em",
              color: "var(--color-faint)",
            }}
          >
            {totalCount} total
          </span>
        </div>

        {/* Domain list */}
        <ul className="flex flex-col py-1 flex-1 overflow-y-auto" role="list">
          <DomainRow
            value={null}
            label="All projects"
            count={totalCount}
            isActive={allIsActive}
            onSelect={setDomain}
          />

          <li
            aria-hidden
            className="mx-4 my-1 shrink-0"
            style={{ height: "1px", background: "var(--color-border-sub)" }}
          />

          {domains.map(({ value, label, count }) => (
            <DomainRow 
              key={value}
              value={value}
              label={label}
              count={count}
              isActive={activeFilter === value}
              onSelect={setDomain}
            />
          ))}
        </ul>

        {/* Footer — clear affordance, only when a filter is active */}
        {activeFilter && (
          <div
            className="px-4 py-2.5 shrink-0"
            style={{ borderTop: "1px solid var(--color-border-sub)" }}
          >
            <button
              onClick={() => setDomain(null)}
              className="transition-colors duration-150 focus-visible:outline-none"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.5625rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-faint)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-faint)";
              }}
            >
              Clear filter ×
            </button>
          </div>
        )}
      </div>

      {/* ── Mobile horizontal scroll row ──────────────────────────────────── */}
      <div
        className="lg:hidden overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <ul className="flex items-center gap-1.5 flex-nowrap py-1" role="list">
          <DomainRow
            value={null}
            label="All"
            count={totalCount}
            isActive={allIsActive}
            onSelect={setDomain}
          />
          {domains.map(({ value, label, count }) => (
            <DomainRow
              key={value}
              value={value}
              label={label}
              count={count}
              isActive={activeFilter === value}
              onSelect={setDomain}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
}

// "use client";
// // features/projects/DomainSidebar.jsx
// //
// // use client — router.push for URL-based filter state. (DEC-025)
// // Replaces the domain filter portion of FilterControls.jsx (now superseded).
// //
// // Design contract:
// //   Mobile  — horizontal scrollable pill row (full width, above project list)
// //   Desktop — vertical sticky sidebar, fixed width, left of project grid
// //
// // Each domain row: left accent border (active) + truncated label + count badge.
// // Count badge reflects ALL_PROJECTS totals — not filtered totals — so users
// // can see what is available before filtering. (DEC-031)

// import { useRouter, usePathname, useSearchParams } from "next/navigation";
// import { cn } from "@/lib/utils";

// /**
//  * DomainSidebar
//  *
//  * @param {{ value: string, label: string, count: number }[]} domains
//  * @param {string|null}  activeFilter  — currently active domain value
//  * @param {number}       totalCount    — total unfiltered project count
//  * @param {string}       [className]   — layout overrides (width, sticky, etc.)
//  */
// export function DomainSidebar({
//   domains,
//   activeFilter,
//   totalCount,
//   className,
// }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   function buildUrl(domain) {
//     const params = new URLSearchParams(searchParams.toString());
//     params.delete("page");
//     if (domain) params.set("domain", domain);
//     else params.delete("domain");
//     const query = params.toString();
//     return `${pathname}${query ? `?${query}` : ""}`;
//   }

//   function setDomain(value) {
//     router.push(buildUrl(value), { scroll: false });
//   }

//   const allIsActive = !activeFilter;

//   // ── Row renderer ────────────────────────────────────────────────────────────
//   // Shared between "All" and individual domain rows to avoid duplication.

//   function DomainRow({ value, label, count, isActive }) {
//     return (
//       <li>
//         <button
//           onClick={() => setDomain(value)}
//           title={label}
//           aria-current={isActive ? "true" : undefined}
//           className={cn(
//             // Desktop: full-width horizontal row with left border
//             "hidden lg:flex w-full items-center justify-between gap-3",
//             "px-4 py-2.5 border-l-2",
//             "transition-all duration-150",
//             "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset",
//             "focus-visible:ring-[var(--color-accent)]",
//             isActive ? "border-[var(--color-accent)]" : "border-transparent",
//           )}
//           style={{
//             background: isActive ? "var(--color-accent-bg)" : "transparent",
//           }}
//           onMouseEnter={(e) => {
//             if (!isActive)
//               e.currentTarget.style.background = "var(--color-surface-2)";
//           }}
//           onMouseLeave={(e) => {
//             if (!isActive) e.currentTarget.style.background = "transparent";
//           }}
//         >
//           <span
//             className="truncate text-left"
//             style={{
//               fontFamily: "var(--font-display)",
//               fontSize: "var(--text-sm)",
//               fontWeight: isActive ? 600 : 400,
//               color: isActive ? "var(--color-fg)" : "var(--color-muted)",
//               lineHeight: "var(--leading-snug)",
//             }}
//           >
//             {label}
//           </span>

//           {/* Count badge */}
//           <span
//             style={{
//               fontFamily: "var(--font-mono)",
//               fontSize: "0.5625rem",
//               letterSpacing: "0.06em",
//               flexShrink: 0,
//               padding: "2px 6px",
//               borderRadius: "3px",
//               lineHeight: 1.6,
//               color: isActive ? "var(--color-accent)" : "var(--color-faint)",
//               background: isActive
//                 ? "rgba(181,242,61,0.1)"
//                 : "var(--color-surface-2)",
//               border: `1px solid ${isActive ? "rgba(181,242,61,0.2)" : "var(--color-border)"}`,
//             }}
//           >
//             {count}
//           </span>
//         </button>

//         {/* Mobile: compact pill */}
//         <button
//           onClick={() => setDomain(value)}
//           className={cn(
//             "lg:hidden flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full",
//             "border transition-all duration-150 whitespace-nowrap",
//             "focus-visible:outline-none focus-visible:ring-2",
//             "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1",
//             isActive
//               ? "border-[rgba(181,242,61,0.4)]"
//               : "border-[var(--color-border)]",
//           )}
//           style={{
//             background: isActive
//               ? "var(--color-accent-bg)"
//               : "var(--color-surface)",
//           }}
//         >
//           <span
//             style={{
//               fontFamily: "var(--font-mono)",
//               fontSize: "var(--text-xs)",
//               letterSpacing: "0.04em",
//               color: isActive ? "var(--color-accent)" : "var(--color-muted)",
//               fontWeight: isActive ? 600 : 400,
//             }}
//           >
//             {label}
//           </span>
//           <span
//             style={{
//               fontFamily: "var(--font-mono)",
//               fontSize: "0.5625rem",
//               color: isActive ? "var(--color-accent)" : "var(--color-faint)",
//             }}
//           >
//             {count}
//           </span>
//         </button>
//       </li>
//     );
//   }

//   return (
//     <nav aria-label="Filter projects by domain" className={className}>
//       {/* ── Desktop sidebar panel ──────────────────────────────────────────── */}
//       <div
//         className="hidden lg:flex flex-col overflow-hidden"
//         style={{
//           background: "var(--color-surface)",
//           border: "1px solid var(--color-border-sub)",
//           borderRadius: "0.75rem",
//         }}
//       >
//         {/* Panel header */}
//         <div
//           className="flex items-center justify-between px-4 py-3"
//           style={{ borderBottom: "1px solid var(--color-border-sub)" }}
//         >
//           <span
//             style={{
//               fontFamily: "var(--font-mono)",
//               fontSize: "0.5625rem",
//               letterSpacing: "0.12em",
//               textTransform: "uppercase",
//               color: "var(--color-faint)",
//               fontWeight: 600,
//             }}
//           >
//             Domain
//           </span>
//           <span
//             style={{
//               fontFamily: "var(--font-mono)",
//               fontSize: "0.5625rem",
//               letterSpacing: "0.06em",
//               color: "var(--color-faint)",
//             }}
//           >
//             {totalCount} total
//           </span>
//         </div>

//         {/* Domain list */}
//         <ul className="flex flex-col py-1" role="list">
//           <DomainRow
//             value={null}
//             label="All projects"
//             count={totalCount}
//             isActive={allIsActive}
//           />

//           {/* Divider between "All" and individual domains */}
//           <li
//             aria-hidden
//             className="mx-4 my-1"
//             style={{
//               height: "1px",
//               background: "var(--color-border-sub)",
//             }}
//           />

//           {domains.map(({ value, label, count }) => (
//             <DomainRow
//               key={value}
//               value={value}
//               label={label}
//               count={count}
//               isActive={activeFilter === value}
//             />
//           ))}
//         </ul>

//         {/* Panel footer — quiet reset affordance when filter is active */}
//         {activeFilter && (
//           <div
//             className="px-4 py-2.5"
//             style={{ borderTop: "1px solid var(--color-border-sub)" }}
//           >
//             <button
//               onClick={() => setDomain(null)}
//               className="flex items-center gap-1 transition-colors duration-150 focus-visible:outline-none"
//               style={{
//                 fontFamily: "var(--font-mono)",
//                 fontSize: "0.5625rem",
//                 letterSpacing: "0.08em",
//                 textTransform: "uppercase",
//                 color: "var(--color-faint)",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.color = "var(--color-accent)";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.color = "var(--color-faint)";
//               }}
//             >
//               Clear filter ×
//             </button>
//           </div>
//         )}
//       </div>

//       {/* ── Mobile horizontal scroll row ──────────────────────────────────── */}
//       <div className="lg:hidden">
//         <div
//           className="flex items-center gap-1 px-0.5 py-1 overflow-x-auto"
//           style={{ scrollbarWidth: "none" }}
//         >
//           <ul className="flex items-center gap-1.5 flex-nowrap" role="list">
//             <DomainRow
//               value={null}
//               label="All"
//               count={totalCount}
//               isActive={allIsActive}
//             />
//             {domains.map(({ value, label, count }) => (
//               <DomainRow
//                 key={value}
//                 value={value}
//                 label={label}
//                 count={count}
//                 isActive={activeFilter === value}
//               />
//             ))}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }
