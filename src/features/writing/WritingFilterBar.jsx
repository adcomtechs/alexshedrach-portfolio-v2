"use client";

// features/writing/WritingFilterBar.jsx
//
// Three named exports:
//
//   WritingTopBar   — Read time · Sort · count · clear (full-width bar)
//   WritingSidebar  — Tag list with density bars, active state, card shell
//   MobileTagRow    — Lightweight horizontal pill scroller (mobile only)
//
// MobileTagRow is NEW — it replaces the broken pattern of rendering
// WritingSidebar twice. It is a minimal horizontal scroll of tag pills
// using the same useWritingNav hook. It has no card shell, no density bars,
// no active filter summary — those belong to the desktop sidebar only.
// This eliminates the hydration mismatch that broke pagination clicks.

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// ── Shared: navigation hook ───────────────────────────────────────────────────

function useWritingNav({ tag, readTime, sort, basePath = "/writing" }) {
  const router = useRouter();

  function navigate(updates) {
    const merged = { tag, readTime, sort, ...updates };
    const params = new URLSearchParams();
    if (merged.tag) params.set("tag", merged.tag);
    if (merged.readTime) params.set("readTime", merged.readTime);
    if (merged.sort) params.set("sort", merged.sort);
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  function handleClear() {
    router.push(basePath);
  }

  return { navigate, handleClear };
}

// ── Shared: FilterPill ────────────────────────────────────────────────────────

function FilterPill({ active, onClick, children, "aria-label": ariaLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg shrink-0",
        "border transition-[background,border-color,color] duration-150",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[var(--color-bg)]",
        active
          ? "bg-[var(--color-accent-bg)] border-[rgba(181,242,61,0.35)] text-[var(--color-accent)]"
          : "bg-transparent border-[var(--color-border-sub)] text-[var(--color-faint)] hover:border-[var(--color-border)] hover:text-[var(--color-muted)] hover:bg-[var(--color-surface-2)]",
      )}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-xs)",
        letterSpacing: "0.04em",
      }}
    >
      {children}
    </button>
  );
}

// ── WritingTopBar ─────────────────────────────────────────────────────────────

export function WritingTopBar({
  activeFilters = {},
  conditions = {},
  totalCount = 0,
  allPostsCount = 0,
  filterDesc = null,
  filtersActive = false,
  basePath = "/writing",
}) {
  const { tag, readTime, sort } = activeFilters;
  const { showReadTimeFilter, showSortToggle } = conditions;
  const { navigate, handleClear } = useWritingNav({
    tag,
    readTime,
    sort,
    basePath,
  });

  const hasActive = Boolean(tag || readTime || sort);
  const showControls = showReadTimeFilter || showSortToggle;
  if (!showControls) return null;

  const postLabel = totalCount === 1 ? "post" : "posts";

  return (
    <div
      className="flex items-center justify-between gap-6 flex-wrap px-4 py-3 rounded-xl"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border-sub)",
      }}
    >
      {/* Left — controls */}
      <div className="flex items-center gap-3 flex-wrap">
        {showReadTimeFilter && (
          <div
            role="group"
            aria-label="Filter by reading time"
            className="flex items-center gap-1.5"
          >
            <FilterPill
              active={!readTime}
              onClick={() => navigate({ readTime: null })}
            >
              Any length
            </FilterPill>
            <FilterPill
              active={readTime === "quick"}
              onClick={() =>
                navigate({ readTime: readTime === "quick" ? null : "quick" })
              }
              aria-label="Quick reads — under 5 minutes"
            >
              ≤ 5 min
            </FilterPill>
            <FilterPill
              active={readTime === "deep"}
              onClick={() =>
                navigate({ readTime: readTime === "deep" ? null : "deep" })
              }
              aria-label="Deep reads — over 8 minutes"
            >
              &gt; 8 min
            </FilterPill>
          </div>
        )}

        {showReadTimeFilter && showSortToggle && (
          <span
            aria-hidden="true"
            className="w-px h-4 rounded-full shrink-0"
            style={{ background: "var(--color-border)" }}
          />
        )}

        {showSortToggle && (
          <div
            role="group"
            aria-label="Sort order"
            className="flex items-center gap-1.5"
          >
            <FilterPill
              active={!sort || sort === "newest"}
              onClick={() => navigate({ sort: null })}
            >
              ↓ Newest
            </FilterPill>
            <FilterPill
              active={sort === "oldest"}
              onClick={() =>
                navigate({ sort: sort === "oldest" ? null : "oldest" })
              }
            >
              ↑ Oldest
            </FilterPill>
          </div>
        )}
      </div>

      {/* Right — count + description + clear */}
      <div className="flex items-center gap-3 flex-wrap">
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            letterSpacing: "0.04em",
            color: "var(--color-muted)",
          }}
        >
          {filtersActive ? (
            <>
              <span style={{ color: "var(--color-fg)", fontWeight: 500 }}>
                {totalCount}
              </span>
              {" of "}
              {allPostsCount} {postLabel}
            </>
          ) : (
            <>
              <span style={{ color: "var(--color-fg)", fontWeight: 500 }}>
                {totalCount}
              </span>{" "}
              {postLabel}
            </>
          )}
        </span>

        {filtersActive && filterDesc && (
          <>
            <span
              aria-hidden="true"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-border)",
              }}
            >
              ·
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.04em",
                color: "var(--color-faint)",
              }}
            >
              {filterDesc}
            </span>
          </>
        )}

        {hasActive && (
          <>
            <span
              aria-hidden="true"
              className="w-px h-3 shrink-0"
              style={{ background: "var(--color-border)" }}
            />
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1 transition-colors duration-150 text-[var(--color-faint)] hover:text-[var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] rounded-sm"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.04em",
              }}
            >
              <span aria-hidden="true">×</span>
              Clear
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── MobileTagRow ──────────────────────────────────────────────────────────────
//
// Horizontal scrolling pill row for mobile viewports.
// Intentionally minimal — no card shell, no density bars, no active summary.
// Those belong to the desktop sidebar only.
//
// This component renders independently of WritingSidebar — it is NOT a
// stripped version of it. Keeping them separate prevents the hydration
// mismatch that broke pagination in the previous implementation.

export function MobileTagRow({
  uniqueTags = [],
  tagDistribution = {},
  activeFilters = {},
  basePath = "/writing",
}) {
  const { tag, readTime, sort } = activeFilters;
  const { navigate } = useWritingNav({ tag, readTime, sort, basePath });

  if (uniqueTags.length === 0) return null;

  return (
    <div
      className="flex items-center gap-2 overflow-x-auto pb-1"
      role="group"
      aria-label="Filter by topic"
      style={{ scrollbarWidth: "none" }}
    >
      {/* Fade hint — left edge */}
      <div
        aria-hidden="true"
        className="shrink-0 w-px h-6"
        style={{ background: "var(--color-border-sub)" }}
      />

      {/* All */}
      <FilterPill
        active={!tag}
        onClick={() => navigate({ tag: null })}
        aria-label="Show all topics"
      >
        All
      </FilterPill>

      {uniqueTags.map((t) => {
        const count = tagDistribution[t] ?? 0;
        return (
          <FilterPill
            key={t}
            active={tag === t}
            onClick={() => navigate({ tag: tag === t ? null : t })}
            aria-label={`Filter by ${t} — ${count} post${count !== 1 ? "s" : ""}`}
          >
            {t}
            {tag !== t && count > 0 && (
              <span
                aria-hidden="true"
                style={{ fontSize: "0.6rem", color: "var(--color-faint)" }}
              >
                {count}
              </span>
            )}
          </FilterPill>
        );
      })}
    </div>
  );
}

// ── TagButton (sidebar internal) ──────────────────────────────────────────────

function TagButton({
  label,
  count,
  maxCount,
  isActive,
  isAll,
  totalCount,
  index,
  onClick,
}) {
  const displayCount = isAll ? totalCount : count;
  const barWidth = isAll
    ? isActive
      ? 100
      : 0
    : maxCount > 0
      ? Math.round((count / maxCount) * 100)
      : 0;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={
        isAll
          ? `Show all posts — ${totalCount} total`
          : `Filter by ${label} — ${count} post${count !== 1 ? "s" : ""}`
      }
      className="group relative flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-left overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
      style={{
        animation: "hero-fade-up 0.4s cubic-bezier(0.22,1,0.36,1) forwards",
        animationDelay: `${index * 35}ms`,
        opacity: 0,
        background: isActive ? "var(--color-accent-bg)" : "transparent",
        border: isActive
          ? "1px solid rgba(181,242,61,0.25)"
          : "1px solid transparent",
        transition: "background 200ms ease, border-color 200ms ease",
      }}
    >
      {/* Density fill bar */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 rounded-xl pointer-events-none"
        style={{
          width: `${barWidth}%`,
          background: isActive
            ? "rgba(181,242,61,0.08)"
            : "rgba(181,242,61,0.035)",
          transition:
            "width 450ms cubic-bezier(0.22,1,0.36,1), background 200ms ease",
        }}
      />

      {/* Left-edge accent rule */}
      <div
        aria-hidden="true"
        className="absolute left-0 inset-y-2.5 w-[2px] rounded-full pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-accent), rgba(181,242,61,0.3))",
          opacity: isActive ? 1 : 0,
          transform: isActive ? "scaleY(1)" : "scaleY(0.4)",
          transformOrigin: "center",
          transition:
            "opacity 200ms ease, transform 200ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />

      {/* Label */}
      <span
        className="relative truncate"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          letterSpacing: "0.04em",
          color: isActive ? "var(--color-accent)" : "var(--color-muted)",
          transition: "color 200ms ease",
        }}
      >
        {label}
      </span>

      {/* Count chip */}
      <span
        aria-hidden="true"
        className="relative shrink-0 ml-2 px-1.5 py-0.5 rounded-md"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          letterSpacing: "0.04em",
          background: isActive
            ? "rgba(181,242,61,0.15)"
            : "var(--color-surface-2)",
          color: isActive ? "var(--color-accent)" : "var(--color-faint)",
          border: isActive
            ? "1px solid rgba(181,242,61,0.2)"
            : "1px solid var(--color-border-sub)",
          transition:
            "background 200ms ease, color 200ms ease, border-color 200ms ease",
        }}
      >
        {displayCount}
      </span>
    </button>
  );
}

// ── ActiveFilterChip (sidebar internal) ──────────────────────────────────────

function ActiveFilterChip({ label, onRemove }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg animate-scale-in"
      style={{
        background: "var(--color-accent-bg)",
        border: "1px solid rgba(181,242,61,0.25)",
        fontSize: "0.65rem",
        fontFamily: "var(--font-mono)",
        color: "var(--color-accent)",
        letterSpacing: "0.04em",
      }}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="flex items-center justify-center w-3.5 h-3.5 rounded hover:bg-[rgba(181,242,61,0.15)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent)]"
        style={{ color: "var(--color-accent)", opacity: 0.7 }}
      >
        <svg
          width="8"
          height="8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </span>
  );
}

// ── WritingSidebar ────────────────────────────────────────────────────────────
//
// Desktop only — hidden on mobile (WritingIndex applies hidden lg:flex).
// Rendered exactly once. Fixes the hydration mismatch from double-render.

export function WritingSidebar({
  uniqueTags = [],
  tagDistribution = {},
  activeFilters = {},
  conditions = {},
  basePath = "/writing",
}) {
  const { tag, readTime, sort } = activeFilters;
  const { showTagFilter } = conditions;
  const { navigate, handleClear } = useWritingNav({
    tag,
    readTime,
    sort,
    basePath,
  });

  const hasActive = Boolean(tag || readTime || sort);

  if (!showTagFilter) return null;

  const maxCount = Math.max(...Object.values(tagDistribution), 1);
  const totalPostCount = Object.values(tagDistribution).reduce(
    (a, b) => a + b,
    0,
  );

  return (
    <aside
      aria-label="Filter writing by topic"
      className="w-full flex flex-col"
    >
      {/* Card shell */}
      <div
        className="relative flex flex-col gap-5 rounded-2xl overflow-hidden p-4"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-sub)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* Top accent line */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-4 right-4 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(181,242,61,0.4), transparent)",
          }}
        />

        {/* Ambient corner glow */}
        <div
          aria-hidden="true"
          className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
          style={{
            background: "var(--color-accent)",
            opacity: 0.04,
            filter: "blur(24px)",
          }}
        />

        {/* Header */}
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="w-3 h-px shrink-0"
              style={{ background: "var(--color-accent)", opacity: 0.55 }}
            />
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
              }}
            >
              Topics
            </p>
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.06em",
              color: "var(--color-faint)",
            }}
          >
            {totalPostCount} total
          </span>
        </div>

        {/* Tag list */}
        <div
          role="group"
          aria-label="Filter by topic"
          className="relative flex flex-col gap-1"
        >
          {/* All posts */}
          <TagButton
            label="All posts"
            isAll
            isActive={!tag}
            totalCount={totalPostCount}
            count={totalPostCount}
            maxCount={maxCount}
            index={0}
            onClick={() => navigate({ tag: null })}
          />

          {/* Thin divider between All and individual tags */}
          <div
            aria-hidden="true"
            className="my-1 mx-1 h-px"
            style={{ background: "var(--color-border-sub)" }}
          />

          {uniqueTags.map((t, i) => {
            const count = tagDistribution[t] ?? 0;
            return (
              <TagButton
                key={t}
                label={t}
                count={count}
                maxCount={maxCount}
                isActive={tag === t}
                index={i + 1}
                onClick={() => navigate({ tag: tag === t ? null : t })}
              />
            );
          })}
        </div>

        {/* Active filters summary — appears when any filter is active */}
        {hasActive && (
          <div
            className="relative flex flex-col gap-3 pt-4 animate-slide-up"
            style={{ borderTop: "1px solid var(--color-border-sub)" }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                color: "var(--color-faint)",
              }}
            >
              Active filters
            </p>

            <div className="flex flex-wrap gap-1.5">
              {tag && (
                <ActiveFilterChip
                  label={tag}
                  onRemove={() => navigate({ tag: null })}
                />
              )}
              {readTime && (
                <ActiveFilterChip
                  label={readTime === "quick" ? "≤ 5 min" : "> 8 min"}
                  onRemove={() => navigate({ readTime: null })}
                />
              )}
              {sort && sort !== "newest" && (
                <ActiveFilterChip
                  label={sort}
                  onRemove={() => navigate({ sort: null })}
                />
              )}
            </div>

            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 w-fit transition-colors duration-150 text-[var(--color-faint)] hover:text-[var(--color-danger)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] rounded-sm"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.04em",
              }}
            >
              <span aria-hidden="true">×</span>
              Clear all
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

// "use client";

// // features/writing/WritingFilterBar.jsx
// //
// // WritingTopBar — unchanged from previous version (included for completeness)
// // WritingSidebar — ELEVATED redesign:
// //
// //   Visual upgrades:
// //   ─────────────────────────────────────────────────────────────────────
// //   1. Card shell with surface background, border, ambient accent glow,
// //      and a top accent gradient line — gives the sidebar physical presence
// //      as a navigation panel, not a floating list.
// //
// //   2. Proportional density fill bar behind each tag label.
// //      Bar width = (tagCount / maxTagCount) * 100%.
// //      Communicates relative post volume at a glance — no number reading required.
// //      CSS transition on width — smooth on active state change.
// //
// //   3. Active state left-edge accent rule — 2px accent bar on the left
// //      of the active tag. Slides in via CSS transition (opacity + scaleY).
// //      Inactive tags show it at opacity-0.
// //
// //   4. Tag entrance animation — each tag button staggers in on mount
// //      via animation-delay. Uses hero-fade-up keyframe from animations.css.
// //
// //   5. Active filters summary block — structured panel with individual
// //      dismissible chips. Each chip has its own × button for precise removal
// //      without clearing all filters.
// //
// //   6. Post count chip on "All posts" reflects total across all tags.
// //
// //   All motion is CSS-only — no additional useEffect, no framer-motion.
// //   prefers-reduced-motion is respected via global rule in animations.css.

// import { useRouter } from "next/navigation";
// import { cn } from "@/lib/utils";

// // ── Shared: URL navigation helper ────────────────────────────────────────────

// function useWritingNav({ tag, readTime, sort, basePath = "/writing" }) {
//   const router = useRouter();

//   function navigate(updates) {
//     const merged = { tag, readTime, sort, ...updates };
//     const params = new URLSearchParams();
//     if (merged.tag) params.set("tag", merged.tag);
//     if (merged.readTime) params.set("readTime", merged.readTime);
//     if (merged.sort) params.set("sort", merged.sort);
//     const qs = params.toString();
//     router.push(qs ? `${basePath}?${qs}` : basePath);
//   }

//   function handleClear() {
//     router.push(basePath);
//   }

//   return { navigate, handleClear };
// }

// // ── Shared: FilterPill (used by WritingTopBar) ───────────────────────────────

// function FilterPill({ active, onClick, children, "aria-label": ariaLabel }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       aria-pressed={active}
//       aria-label={ariaLabel}
//       className={cn(
//         "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
//         "border transition-[background,border-color,color] duration-150",
//         "focus-visible:outline-none focus-visible:ring-2",
//         "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
//         "focus-visible:ring-offset-[var(--color-bg)]",
//         active
//           ? "bg-[var(--color-accent-bg)] border-[rgba(181,242,61,0.35)] text-[var(--color-accent)]"
//           : "bg-transparent border-[var(--color-border-sub)] text-[var(--color-faint)] hover:border-[var(--color-border)] hover:text-[var(--color-muted)] hover:bg-[var(--color-surface-2)]",
//       )}
//       style={{
//         fontFamily: "var(--font-mono)",
//         fontSize: "var(--text-xs)",
//         letterSpacing: "0.04em",
//       }}
//     >
//       {children}
//     </button>
//   );
// }

// // ── WritingTopBar ─────────────────────────────────────────────────────────────
// // Unchanged structurally — included so the file remains self-contained.

// export function WritingTopBar({
//   activeFilters = {},
//   conditions = {},
//   totalCount = 0,
//   allPostsCount = 0,
//   filterDesc = null,
//   filtersActive = false,
//   basePath = "/writing",
// }) {
//   const { tag, readTime, sort } = activeFilters;
//   const { showReadTimeFilter, showSortToggle } = conditions;
//   const { navigate, handleClear } = useWritingNav({
//     tag,
//     readTime,
//     sort,
//     basePath,
//   });

//   const hasActive = Boolean(tag || readTime || sort);
//   const showControls = showReadTimeFilter || showSortToggle;
//   if (!showControls) return null;

//   const postLabel = totalCount === 1 ? "post" : "posts";

//   return (
//     <div
//       className="flex items-center justify-between gap-6 flex-wrap px-4 py-3 rounded-xl mb-6"
//       style={{
//         background: "var(--color-surface)",
//         border: "1px solid var(--color-border-sub)",
//       }}
//     >
//       <div className="flex items-center gap-3 flex-wrap">
//         {showReadTimeFilter && (
//           <div
//             role="group"
//             aria-label="Filter by reading time"
//             className="flex items-center gap-1.5"
//           >
//             <FilterPill
//               active={!readTime}
//               onClick={() => navigate({ readTime: null })}
//             >
//               Any length
//             </FilterPill>
//             <FilterPill
//               active={readTime === "quick"}
//               onClick={() =>
//                 navigate({ readTime: readTime === "quick" ? null : "quick" })
//               }
//             >
//               ≤ 5 min
//             </FilterPill>
//             <FilterPill
//               active={readTime === "deep"}
//               onClick={() =>
//                 navigate({ readTime: readTime === "deep" ? null : "deep" })
//               }
//             >
//               &gt; 8 min
//             </FilterPill>
//           </div>
//         )}
//         {showReadTimeFilter && showSortToggle && (
//           <span
//             aria-hidden="true"
//             className="w-px h-4 rounded-full shrink-0"
//             style={{ background: "var(--color-border)" }}
//           />
//         )}
//         {showSortToggle && (
//           <div
//             role="group"
//             aria-label="Sort order"
//             className="flex items-center gap-1.5"
//           >
//             <FilterPill
//               active={!sort || sort === "newest"}
//               onClick={() => navigate({ sort: null })}
//             >
//               ↓ Newest
//             </FilterPill>
//             <FilterPill
//               active={sort === "oldest"}
//               onClick={() =>
//                 navigate({ sort: sort === "oldest" ? null : "oldest" })
//               }
//             >
//               ↑ Oldest
//             </FilterPill>
//           </div>
//         )}
//       </div>

//       <div className="flex items-center gap-3 flex-wrap">
//         <span
//           style={{
//             fontFamily: "var(--font-mono)",
//             fontSize: "var(--text-xs)",
//             letterSpacing: "0.04em",
//             color: "var(--color-muted)",
//           }}
//         >
//           {filtersActive ? (
//             <>
//               <span style={{ color: "var(--color-fg)", fontWeight: 500 }}>
//                 {totalCount}
//               </span>{" "}
//               of {allPostsCount} {postLabel}
//             </>
//           ) : (
//             <>
//               <span style={{ color: "var(--color-fg)", fontWeight: 500 }}>
//                 {totalCount}
//               </span>{" "}
//               {postLabel}
//             </>
//           )}
//         </span>
//         {filtersActive && filterDesc && (
//           <>
//             <span
//               aria-hidden="true"
//               style={{
//                 fontSize: "var(--text-xs)",
//                 color: "var(--color-border)",
//               }}
//             >
//               ·
//             </span>
//             <span
//               style={{
//                 fontFamily: "var(--font-mono)",
//                 fontSize: "var(--text-xs)",
//                 letterSpacing: "0.04em",
//                 color: "var(--color-faint)",
//               }}
//             >
//               {filterDesc}
//             </span>
//           </>
//         )}
//         {hasActive && (
//           <>
//             <span
//               aria-hidden="true"
//               className="w-px h-3 shrink-0"
//               style={{ background: "var(--color-border)" }}
//             />
//             <button
//               type="button"
//               onClick={handleClear}
//               className="inline-flex items-center gap-1 transition-colors duration-150 text-[var(--color-faint)] hover:text-[var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] rounded-sm"
//               style={{
//                 fontFamily: "var(--font-mono)",
//                 fontSize: "var(--text-xs)",
//                 letterSpacing: "0.04em",
//               }}
//             >
//               <span aria-hidden="true">×</span>
//               Clear
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// // ── WritingSidebar ────────────────────────────────────────────────────────────

// /**
//  * TagButton
//  *
//  * Individual tag row inside the sidebar.
//  *
//  * Visual anatomy (back to front):
//  *   Layer 0 — density fill bar (absolute, behind everything)
//  *   Layer 1 — left-edge accent rule (absolute, transitions opacity)
//  *   Layer 2 — label + count chip (relative, above both layers)
//  *
//  * @param {string}  label       — Tag name or "All posts"
//  * @param {number}  count       — Post count for this tag
//  * @param {number}  maxCount    — Highest count in the set (for bar width ratio)
//  * @param {boolean} isActive    — Whether this tag is currently selected
//  * @param {boolean} isAll       — Whether this is the "All posts" row
//  * @param {number}  totalCount  — Total posts (used for "All posts" chip)
//  * @param {number}  index       — Position in list (drives animation-delay)
//  * @param {function} onClick
//  */
// function TagButton({
//   label,
//   count,
//   maxCount,
//   isActive,
//   isAll = false,
//   totalCount,
//   index,
//   onClick,
// }) {
//   // Density bar width as a percentage of the maximum tag count.
//   // "All posts" always fills 100% when active, 0 when inactive.
//   const barWidth = isAll
//     ? isActive
//       ? 100
//       : 0
//     : maxCount > 0
//       ? Math.round((count / maxCount) * 100)
//       : 0;

//   const displayCount = isAll ? totalCount : count;

//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       aria-pressed={isActive}
//       aria-label={
//         isAll
//           ? `Show all posts — ${totalCount} total`
//           : `Filter by ${label} — ${count} post${count !== 1 ? "s" : ""}`
//       }
//       // Staggered entrance — each button delays by 40ms × index
//       className="group relative flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-left overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
//       style={{
//         // Entrance animation — staggered via delay
//         animation: "hero-fade-up 0.4s cubic-bezier(0.22,1,0.36,1) forwards",
//         animationDelay: `${index * 40}ms`,
//         opacity: 0, // hero-fade-up fills to 1

//         // Background — active gets accent tint, inactive is transparent
//         background: isActive ? "var(--color-accent-bg)" : "transparent",

//         // Border — active gets accent border, inactive is subtle
//         border: isActive
//           ? "1px solid rgba(181,242,61,0.25)"
//           : "1px solid transparent",

//         transition: "background 200ms ease, border-color 200ms ease",
//       }}
//       // CSS-only hover via :hover pseudo — Tailwind group-hover
//     >
//       {/* ── Layer 0: Density fill bar ──────────────────────────────────────
//           Sits behind all content. Width transitions smoothly.
//           Visible at low opacity — never competes with text.          */}
//       <div
//         aria-hidden="true"
//         className="absolute inset-y-0 left-0 rounded-xl pointer-events-none"
//         style={{
//           width: `${barWidth}%`,
//           background: isActive
//             ? "rgba(181,242,61,0.08)"
//             : "rgba(181,242,61,0.04)",
//           transition:
//             "width 400ms cubic-bezier(0.22,1,0.36,1), background 200ms ease",
//         }}
//       />

//       {/* ── Layer 1: Left-edge accent rule ─────────────────────────────────
//           2px accent bar. Fades in when active, fades out when inactive.
//           scaleY(0.6) → scaleY(1) on activation — subtle grow-in.     */}
//       <div
//         aria-hidden="true"
//         className="absolute left-0 inset-y-2 w-[2px] rounded-full pointer-events-none"
//         style={{
//           background:
//             "linear-gradient(to bottom, var(--color-accent), rgba(181,242,61,0.3))",
//           opacity: isActive ? 1 : 0,
//           transform: isActive ? "scaleY(1)" : "scaleY(0.5)",
//           transformOrigin: "center",
//           transition:
//             "opacity 200ms ease, transform 200ms cubic-bezier(0.22,1,0.36,1)",
//         }}
//       />

//       {/* ── Layer 2: Label + count chip ────────────────────────────────────
//           Relative — sits above the fill bar and accent rule.          */}
//       <span
//         className="relative truncate"
//         style={{
//           fontFamily: "var(--font-mono)",
//           fontSize: "var(--text-xs)",
//           letterSpacing: "0.04em",
//           color: isActive ? "var(--color-accent)" : "var(--color-muted)",
//           transition: "color 200ms ease",
//         }}
//       >
//         {label}
//       </span>

//       {/* Count chip */}
//       <span
//         aria-hidden="true"
//         className="relative shrink-0 ml-2 px-1.5 py-0.5 rounded-md"
//         style={{
//           fontFamily: "var(--font-mono)",
//           fontSize: "0.6rem",
//           letterSpacing: "0.04em",
//           background: isActive
//             ? "rgba(181,242,61,0.15)"
//             : "var(--color-surface-2)",
//           color: isActive ? "var(--color-accent)" : "var(--color-faint)",
//           border: isActive
//             ? "1px solid rgba(181,242,61,0.2)"
//             : "1px solid var(--color-border-sub)",
//           transition:
//             "background 200ms ease, color 200ms ease, border-color 200ms ease",
//         }}
//       >
//         {displayCount}
//       </span>
//     </button>
//   );
// }

// // ── ActiveFilterChip ──────────────────────────────────────────────────────────
// // Individual dismissible chip for the active filters summary.

// function ActiveFilterChip({ label, onRemove }) {
//   return (
//     <span
//       className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg animate-scale-in"
//       style={{
//         background: "var(--color-accent-bg)",
//         border: "1px solid rgba(181,242,61,0.25)",
//         fontSize: "0.65rem",
//         fontFamily: "var(--font-mono)",
//         color: "var(--color-accent)",
//         letterSpacing: "0.04em",
//       }}
//     >
//       {label}
//       <button
//         type="button"
//         onClick={onRemove}
//         aria-label={`Remove ${label} filter`}
//         className="flex items-center justify-center w-3.5 h-3.5 rounded hover:bg-[rgba(181,242,61,0.15)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent)]"
//         style={{ color: "var(--color-accent)", opacity: 0.7 }}
//       >
//         <svg
//           width="8"
//           height="8"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="3"
//           strokeLinecap="round"
//         >
//           <line x1="18" y1="6" x2="6" y2="18" />
//           <line x1="6" y1="6" x2="18" y2="18" />
//         </svg>
//       </button>
//     </span>
//   );
// }

// // ── WritingSidebar ────────────────────────────────────────────────────────────

// export function WritingSidebar({
//   uniqueTags = [],
//   tagDistribution = {},
//   activeFilters = {},
//   conditions = {},
//   basePath = "/writing",
// }) {
//   const { tag, readTime, sort } = activeFilters;
//   const { showTagFilter } = conditions;
//   const { navigate, handleClear } = useWritingNav({
//     tag,
//     readTime,
//     sort,
//     basePath,
//   });

//   const hasActive = Boolean(tag || readTime || sort);

//   if (!showTagFilter) return null;

//   // Max count drives the density bar width ratio
//   const maxCount = Math.max(...Object.values(tagDistribution), 1);
//   const totalPostCount = Object.values(tagDistribution).reduce(
//     (a, b) => a + b,
//     0,
//   );

//   return (
//     <aside
//       aria-label="Filter writing by topic"
//       className="flex flex-col gap-0 animate-slide-up"
//     >
//       {/* ── Card shell ──────────────────────────────────────────────────────
//           Physical presence — surface background, border, glow, accent line. */}
//       <div
//         className="relative flex flex-col gap-5 rounded-2xl overflow-hidden p-4"
//         style={{
//           background: "var(--color-surface)",
//           border: "1px solid var(--color-border-sub)",
//           boxShadow: "var(--shadow-sm)",
//         }}
//       >
//         {/* Top accent gradient line — matches ContactForm / ChatWidget motif */}
//         <div
//           aria-hidden="true"
//           className="absolute top-0 left-4 right-4 h-px"
//           style={{
//             background:
//               "linear-gradient(90deg, transparent, rgba(181,242,61,0.4), transparent)",
//           }}
//         />

//         {/* Ambient glow — top-right corner, very subtle */}
//         <div
//           aria-hidden="true"
//           className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
//           style={{
//             background: "var(--color-accent)",
//             opacity: 0.04,
//             filter: "blur(24px)",
//           }}
//         />

//         {/* ── Section header ─────────────────────────────────────────────── */}
//         <div className="relative flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             {/* Lead-in dash — established motif from LookingFor, QuickReach */}
//             <span
//               aria-hidden="true"
//               className="w-3 h-px shrink-0"
//               style={{ background: "var(--color-accent)", opacity: 0.55 }}
//             />
//             <p
//               style={{
//                 fontFamily: "var(--font-mono)",
//                 fontSize: "var(--text-xs)",
//                 letterSpacing: "0.09em",
//                 textTransform: "uppercase",
//                 color: "var(--color-accent)",
//               }}
//             >
//               Topics
//             </p>
//           </div>

//           {/* Post count — total, always visible */}
//           <span
//             style={{
//               fontFamily: "var(--font-mono)",
//               fontSize: "0.6rem",
//               letterSpacing: "0.06em",
//               color: "var(--color-faint)",
//             }}
//           >
//             {totalPostCount} total
//           </span>
//         </div>

//         {/* ── Tag list ───────────────────────────────────────────────────── */}
//         <div
//           role="group"
//           aria-label="Filter by topic"
//           className="relative flex flex-col gap-1"
//         >
//           {/* All posts */}
//           <TagButton
//             label="All posts"
//             isAll
//             isActive={!tag}
//             totalCount={totalPostCount}
//             count={totalPostCount}
//             maxCount={maxCount}
//             index={0}
//             onClick={() => navigate({ tag: null })}
//           />

//           {/* Divider between All and individual tags */}
//           <div
//             aria-hidden="true"
//             className="my-1 mx-1 h-px"
//             style={{ background: "var(--color-border-sub)" }}
//           />

//           {/* Individual tags — staggered entrance via index */}
//           {uniqueTags.map((t, i) => {
//             const count = tagDistribution[t] ?? 0;
//             return (
//               <TagButton
//                 key={t}
//                 label={t}
//                 count={count}
//                 maxCount={maxCount}
//                 isActive={tag === t}
//                 index={i + 1} // +1 offset — All is index 0
//                 onClick={() => navigate({ tag: tag === t ? null : t })}
//               />
//             );
//           })}
//         </div>

//         {/* ── Active filters summary ─────────────────────────────────────────
//             Structured block — appears when any filter is active.
//             Each chip is individually dismissible.                          */}
//         {hasActive && (
//           <div
//             className="relative flex flex-col gap-3 pt-4 animate-slide-up"
//             style={{ borderTop: "1px solid var(--color-border-sub)" }}
//           >
//             {/* Label */}
//             <p
//               style={{
//                 fontFamily: "var(--font-mono)",
//                 fontSize: "0.6rem",
//                 letterSpacing: "0.09em",
//                 textTransform: "uppercase",
//                 color: "var(--color-faint)",
//               }}
//             >
//               Active filters
//             </p>

//             {/* Chips */}
//             <div className="flex flex-wrap gap-1.5">
//               {tag && (
//                 <ActiveFilterChip
//                   label={tag}
//                   onRemove={() => navigate({ tag: null })}
//                 />
//               )}
//               {readTime && (
//                 <ActiveFilterChip
//                   label={readTime === "quick" ? "≤ 5 min" : "> 8 min"}
//                   onRemove={() => navigate({ readTime: null })}
//                 />
//               )}
//               {sort && sort !== "newest" && (
//                 <ActiveFilterChip
//                   label={sort}
//                   onRemove={() => navigate({ sort: null })}
//                 />
//               )}
//             </div>

//             {/* Clear all — text link, below chips */}
//             <button
//               type="button"
//               onClick={handleClear}
//               className="inline-flex items-center gap-1.5 w-fit transition-colors duration-150 text-[var(--color-faint)] hover:text-[var(--color-danger)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] rounded-sm"
//               style={{
//                 fontFamily: "var(--font-mono)",
//                 fontSize: "var(--text-xs)",
//                 letterSpacing: "0.04em",
//               }}
//             >
//               <span aria-hidden="true">×</span>
//               Clear all
//             </button>
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// }
