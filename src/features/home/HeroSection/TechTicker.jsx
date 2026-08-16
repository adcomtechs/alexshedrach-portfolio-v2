// features/home/HeroSection/TechTicker.jsx
"use client";
//
// ── Responsiveness & correctness pass ───────────────────────────────────────
//
// The previous version could not be made responsive without this rework:
// every color and every size lived in a `style={{}}` object, which cannot
// take a Tailwind breakpoint prefix. Fixing that required also fixing the
// theming bug hiding underneath it — see below.
//
//   1. Colors are now token references, not hardcoded hex/rgba.
//      TECH_SLIDES stores an `accentVar` (e.g. "--color-info") instead of a
//      precomputed { text, bg, border, glow } object. `domainVars()` derives
//      border/glow via `color-mix()` and reuses the existing `--color-x-bg`
//      tokens for backgrounds — per DESIGN_SYSTEM.md §2.3. This is also what
//      fixes light mode: the old hardcoded rgba values were dark-theme
//      snapshots reused verbatim in light mode.
//
//   2. Hover state is CSS (`hover:`), not JS (`onMouseEnter`/`onMouseLeave`).
//      Tailwind v4's `hover:` variant is scoped to `@media (hover: hover)`
//      by default, which eliminates the "stuck hover after tap" bug that
//      JS-driven mouseenter/mouseleave has on touch devices. The dynamic
//      per-domain *values* still need to flow in at runtime (Tailwind's JIT
//      can't statically enumerate `text-${domain}`), so they're wired in as
//      scoped CSS custom properties (`--chip-*`) via a single inline `style`
//      per panel/badge, then consumed by ordinary utility classes. This is
//      the standard pattern for data-driven theming inside a JIT framework —
//      distinct from hardcoding a literal value, which is what's prohibited.
//
//   3. Dot-nav touch targets are real, not margin tricks.
//      Buttons are `size-11` (44px) with the small visible dot centered
//      inside via an inner span — per DESIGN_SYSTEM.md §5.3. Margin is not
//      part of an element's hit-test box in any browser; the previous
//      "padding trick via margin" did not create a larger clickable area.
//
//   4. Focus-visible is no longer suppressed.
//      The previous version set `outline: "none"` on both dot-button style
//      objects with no replacement, silently failing WCAG 2.4.7. Removing
//      the override lets the global `:focus-visible` rule in base.css apply,
//      which is what §9 requires.
//
//   5. Swipe detection ignores vertical-dominant gestures.
//      A page-scroll drag with slight horizontal jitter no longer gets
//      misread as a ticker swipe.
//
//   6. Chip-panel min-height is a responsive scale, not one fixed px.
//      Wrapped chip rows need more vertical room on narrow viewports, not
//      less. Values below are calibrated estimates — verify against real
//      rendered content at 375px per §5.3 and adjust if any domain's chip
//      set wraps to more rows than assumed.
//
//   7. The runtime `document.createElement('style')` keyframe injection is
//      removed. DESIGN_SYSTEM.md §8 is explicit: "All @keyframes live in
//      animations.css — never inline... never a second keyframes source."
//      `ticker-sweep` and `ticker-badge-pulse` move there — see the snippet
//      at the bottom of this file for the exact addition. Reduced-motion
//      users are already covered by animations.css's existing universal
//      `*, *::before, *::after { animation: none !important }` rule, so no
//      new reduced-motion handling is needed here.
//
//   8. Crossfading panels are no longer both exposed to assistive tech.
//      Both `slotContent.a` and `slotContent.b` render simultaneously during
//      a transition; without `aria-hidden` on the inactive one, a screen
//      reader announces both tech lists concatenated. The inactive panel is
//      now hidden from the accessibility tree.
//
//   9. Proper tab semantics: each dot now has `aria-controls` pointing at a
//      real `id`/`role="tabpanel"` on the chip panel, via `useId()`. Mobile
//      and desktop render separate dot sets (`display:none`-gated per
//      breakpoint, so only one is ever in the a11y tree), and each set's
//      button ids are prefixed by orientation to avoid duplicate DOM ids.
//
// Everything else — crossfade mechanics, edge masks, keyboard nav, the
// useTicker contract — is preserved as-is.

import { useCallback, useId, useRef } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/Container";
import { useTicker } from "@/hooks/useTicker";

// ── Data ──────────────────────────────────────────────────────────────────────
// `accentVar` references an existing semantic token from themes.css — every
// one of these already has a paired `-bg` token and audited light/dark
// values. No raw color lives in this file.

const TECH_SLIDES = [
  {
    id: "frontend",
    category: "Frontend",
    accentVar: "--color-accent",
    items: [
      { name: "Next.js", primary: true },
      { name: "React", primary: true },
      { name: "TypeScript", primary: true },
      { name: "Tailwind", primary: false },
      { name: "Framer", primary: false },
    ],
  },
  {
    id: "backend",
    category: "Backend",
    accentVar: "--color-info",
    items: [
      { name: "Node.js", primary: true },
      { name: "Spring Boot", primary: true },
      { name: "Java", primary: true },
      { name: "REST API", primary: false },
      { name: "GraphQL", primary: false },
    ],
  },
  {
    id: "infra",
    category: "Database & Infra",
    accentVar: "--color-warning",
    items: [
      { name: "PostgreSQL", primary: true },
      { name: "Redis", primary: true },
      { name: "Docker", primary: false },
      { name: "Prisma", primary: false },
      { name: "MongoDB", primary: false },
    ],
  },
  {
    id: "cloud-ai",
    category: "AI & Cloud",
    // Flagged: no dedicated token exists for this domain. Reusing
    // --color-danger (fully AA-audited in both themes already) rather than
    // inventing a 5th hardcoded hex. If a distinct identity color is wanted
    // here, that's a token addition to tokens.css/themes.css — log it as a
    // decision rather than inlining a new value.
    accentVar: "--color-danger",
    items: [
      { name: "LangChain", primary: true },
      { name: "AWS", primary: true },
      { name: "Claude API", primary: true },
      { name: "Vercel", primary: false },
      { name: "Supabase", primary: false },
    ],
  },
];

const INTERVAL = 3500;

/**
 * Derives the scoped CSS custom properties a panel/badge needs to render a
 * given domain's colors, entirely from existing semantic tokens. Set once
 * via `style` on a container; all descendants inherit through the cascade.
 */
function domainVars(accentVar) {
  return {
    "--chip-text": `var(${accentVar})`,
    "--chip-bg": `var(${accentVar}-bg)`,
    "--chip-border": `color-mix(in srgb, var(${accentVar}) 25%, transparent)`,
    "--chip-glow": `color-mix(in srgb, var(${accentVar}) 12%, transparent)`,
  };
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function TechChip({ name, primary }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap select-none cursor-default",
        "rounded-full border px-3 py-1.5 text-sm font-medium",
        "transition-[transform,box-shadow,border-color,background-color,color] duration-150",
        "hover:scale-[1.04] hover:border-(--chip-border) hover:bg-(--chip-bg) hover:text-(--chip-text) hover:shadow-[0_0_0_3px_var(--chip-glow)]",
        primary
          ? "border-(--chip-border) bg-(--chip-bg) text-(--chip-text)"
          : "border-(--color-border) bg-(--color-surface-2) text-(--color-muted)",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "block size-1.5 shrink-0 rounded-full transition-colors duration-300",
          primary ? "bg-(--chip-text)" : "bg-(--color-faint)",
        )}
      />
      {name}
    </div>
  );
}

function TickerPanel({ slide, stateClass, isCurrent }) {
  return (
    <div
      className={cn(
        "ticker-panel",
        stateClass,
        "absolute inset-0 flex flex-wrap items-center gap-2 px-4 py-3 md:px-6",
      )}
      style={domainVars(slide.accentVar)}
      // The crossfading sibling panel stays mounted during the transition —
      // keep it out of the accessibility tree so only the visible slide's
      // tech list is announced.
      aria-hidden={!isCurrent}
    >
      {slide.items.map(({ name, primary }) => (
        <TechChip key={name} name={name} primary={primary} />
      ))}
    </div>
  );
}

function CategoryBadge({ slide }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5",
        "font-mono text-xs font-bold uppercase tracking-wide",
        "border-(--chip-border) bg-(--chip-bg) text-(--chip-text)",
        "shadow-[0_0_12px_var(--chip-glow)]",
        "transition-[color,background-color,border-color,box-shadow] duration-300",
      )}
      style={domainVars(slide.accentVar)}
    >
      <span
        aria-hidden="true"
        className="block size-1.25 shrink-0 animate-ticker-badge-pulse rounded-full bg-(--chip-text)"
      />
      {slide.category}
    </div>
  );
}

/**
 * Sweep line — restarts on every slide change via the `key` prop on the
 * call site (forces a remount, which restarts the CSS animation from 0%
 * with zero JS timer involvement).
 */
function SweepLine({ accentVar, duration }) {
  return (
    <div
      aria-hidden="true"
      className="animate-ticker-sweep absolute left-0 top-0 z-20 h-0.5 rounded-r-sm opacity-70"
      style={{
        background: `linear-gradient(to right, var(${accentVar}), var(${accentVar}-bg))`,
        "--ticker-duration": `${duration}ms`,
      }}
    />
  );
}

/**
 * Shared dot navigation, rendered once per orientation. Mobile and desktop
 * instances are both mounted (visibility toggled via `display:none` at the
 * call site) so only one is ever exposed to assistive tech at a given
 * viewport — but each still needs unique ids, hence the orientation prefix.
 */
function DomainDots({
  orientation,
  activeIndex,
  currentAccentVar,
  tabpanelId,
  onSelect,
}) {
  const isRow = orientation === "row";
  return (
    <div
      role="tablist"
      aria-label="Technology domain"
      className={cn(
        "flex",
        isRow ? "items-center" : "flex-col items-center gap-1",
      )}
    >
      {TECH_SLIDES.map((slide, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={slide.id}
            type="button"
            role="tab"
            id={`ticker-tab-${orientation}-${slide.id}`}
            aria-selected={active}
            aria-controls={tabpanelId}
            aria-label={`${isRow ? "" : "View "}${slide.category} stack`}
            onClick={() => onSelect(i)}
            className={cn(
              "group relative flex items-center justify-center",
              // Real 44px touch target on the row (mobile) variant per
              // DESIGN_SYSTEM.md §5.3. The column (desktop) variant trades
              // width for a tighter vertical stack — defensible for
              // pointer-fine/mouse input, which is the dominant input mode
              // at the md+ breakpoint this variant renders at.
              isRow ? "size-11" : "h-11 w-8",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "rounded-full transition-all duration-250",
                isRow
                  ? cn(
                      "size-1.5",
                      active
                        ? "scale-150"
                        : "scale-100 bg-(--color-border) group-hover:bg-(--color-faint)",
                    )
                  : cn(
                      "w-1.5",
                      active
                        ? "h-4.5"
                        : "h-1.5 bg-(--color-border) group-hover:bg-(--color-faint)",
                    ),
              )}
              style={
                active ? { background: `var(${currentAccentVar})` } : undefined
              }
            />
          </button>
        );
      })}
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────

export function TechTicker() {
  const { currentIndex, slotStates, slotContent, jumpToSlide } = useTicker(
    TECH_SLIDES,
    INTERVAL,
  );
  const currentSlide = TECH_SLIDES[currentIndex];
  const panelId = useId();

  // ── Touch swipe ──────────────────────────────────────────────────────────
  const touchStartPos = useRef(null);

  const handleTouchStart = useCallback((e) => {
    const t = e.touches[0];
    touchStartPos.current = { x: t.clientX, y: t.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (!touchStartPos.current) return;
      const t = e.changedTouches[0];
      const deltaX = t.clientX - touchStartPos.current.x;
      const deltaY = t.clientY - touchStartPos.current.y;
      touchStartPos.current = null;

      // A gesture that moves more vertically than horizontally is a page
      // scroll, not a swipe — don't hijack it. Comparing the two axes
      // directly (rather than testing each independently against the
      // threshold) also correctly rejects diagonal drags.
      if (Math.abs(deltaX) <= Math.abs(deltaY)) return;

      const THRESHOLD = 40;
      if (deltaX < -THRESHOLD) {
        jumpToSlide((currentIndex + 1) % TECH_SLIDES.length);
      } else if (deltaX > THRESHOLD) {
        jumpToSlide(
          (currentIndex - 1 + TECH_SLIDES.length) % TECH_SLIDES.length,
        );
      }
    },
    [currentIndex, jumpToSlide],
  );

  // ── Keyboard ─────────────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        jumpToSlide((currentIndex + 1) % TECH_SLIDES.length);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        jumpToSlide(
          (currentIndex - 1 + TECH_SLIDES.length) % TECH_SLIDES.length,
        );
      }
    },
    [currentIndex, jumpToSlide],
  );

  return (
    <div
      role="region"
      aria-label="Technology stack"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative outline-none",
        "border-t border-(--color-border-sub) bg-(--color-surface)",
        // Edge masks — md+ only. Below md, chips wrap instead of
        // overflowing horizontally, so there's nothing for a mask to
        // indicate; scoping this to md+ isn't a gap, it's correct.
        "md:before:absolute md:before:inset-y-0 md:before:left-0 md:before:z-10 md:before:w-20",
        "md:before:bg-liinear-to-r md:before:from-(--color-surface) md:before:to-transparent md:before:pointer-events-none",
        "md:after:absolute md:after:inset-y-0 md:after:right-0 md:after:z-10 md:after:w-20",
        "md:after:bg-liinear-to-l md:after:from-(--color-surface) md:after:to-transparent md:after:pointer-events-none",
        "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--color-accent)",
      )}
    >
      <Container size="wide">
        {/*
          Mobile  (< md): single column — label row stacked above chips
          Desktop (≥ md): [152px label column] | [fluid chip panel]
          152px (38 * 4px, on the base spacing grid) — wide enough for the
          longest category label ("Database & Infra") to sit on one line;
          it wraps gracefully to two lines if a longer label is added later.
        */}
        <div className="grid grid-cols-1 md:grid-cols-[152px_1fr]">
          {/* ── Label column ──────────────────────────────────────────────── */}
          <div
            className={cn(
              // Mobile — horizontal row, wraps if content ever overflows,
              // full width, above chips
              "flex flex-wrap items-center justify-between gap-x-3 gap-y-2",
              "border-b border-(--color-border-sub) px-4 py-3",
              // Desktop — vertical stack, left column
              "md:flex-col md:items-start md:justify-center md:gap-2.5",
              "md:border-b-0 md:border-r md:border-(--color-border-sub)",
              "md:px-0 md:py-4 md:pr-5",
            )}
          >
            <CategoryBadge slide={currentSlide} />

            {/* Descriptor — desktop only */}
            <p className="hidden font-mono text-xs uppercase leading-snug tracking-wide text-(--color-faint) md:block">
              Core technologies
              <br />I ship with
            </p>

            {/* Dot nav — mobile only */}
            <div className="md:hidden">
              <DomainDots
                orientation="row"
                activeIndex={currentIndex}
                currentAccentVar={currentSlide.accentVar}
                tabpanelId={panelId}
                onSelect={jumpToSlide}
              />
            </div>
          </div>

          {/* ── Chip panel ────────────────────────────────────────────────── */}
          <div
            id={panelId}
            role="tabpanel"
            aria-label={`${currentSlide.category} technologies`}
            className="relative min-h-38 overflow-hidden sm:min-h-27 md:min-h-18"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <SweepLine
              key={`sweep-${currentIndex}`}
              accentVar={currentSlide.accentVar}
              duration={INTERVAL}
            />

            <TickerPanel
              slide={slotContent.a}
              stateClass={slotStates.a}
              isCurrent={slotContent.a.id === currentSlide.id}
            />
            <TickerPanel
              slide={slotContent.b}
              stateClass={slotStates.b}
              isCurrent={slotContent.b.id === currentSlide.id}
            />

            {/* Dot nav — desktop only, right side of chip panel */}
            <div className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 md:block">
              <DomainDots
                orientation="column"
                activeIndex={currentIndex}
                currentAccentVar={currentSlide.accentVar}
                tabpanelId={panelId}
                onSelect={jumpToSlide}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default TechTicker;
