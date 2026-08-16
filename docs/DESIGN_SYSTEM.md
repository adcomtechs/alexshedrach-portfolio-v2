# DESIGN_SYSTEM.md — Engineering & Styling Contract

**Project:** alexshedrach.dev (Portfolio V2)
**Scope:** Governs every component, style, and state-management pattern in the codebase.
**Status:** Binding. Deviations require a `DECISIONS.md` entry — not a judgment call.
**Load order:** `AI_CONTEXT.md` → `DECISIONS-CORE.md` → this file → phase decisions.

This document exists because a design system is not a folder of CSS — it's a set of rules that make five different sessions (human or AI) produce code that looks like it came from one engineer. Every rule below is enforceable and reviewable. If a rule can't be checked in a PR, it doesn't belong here.

---

## 1. Token Architecture (Tailwind v4, CSS-first)

The project uses Tailwind v4's CSS-first config — there is no `tailwind.config.js` token source. `@theme` in `tokens.css` **is** the config.

### 1.1 Import order is load-bearing

```css 
/* global.css */
@import "./tokens.css";   /* @theme MUST precede Tailwind's own @theme injection */
@import "tailwindcss";
@import "./themes.css";
@import "./base.css";
@import "./utilities.css";
@import "./animations.css";
```

**Rule:** Never reorder these imports. `tokens.css` before `tailwindcss` is required for Tailwind to pick up custom tokens as first-class utilities (e.g. `text-md`, `shadow-glow`). If a new global stylesheet is added, decide its layer and position explicitly — don't append to the bottom by default.

### 1.2 Token vs. hardcoded value

| Never write                          | Always write                    |
| ------------------------------------- | -------------------------------- |
| `font-size: 18px`                     | `var(--text-md)` / `text-md`    |
| `color: #b5f23d`                      | `var(--color-accent)`           |
| `box-shadow: 0 4px 16px rgba(0,0,0,.5)` | `var(--shadow-md)`              |
| `line-height: 1.6`                    | `var(--leading-normal)`         |

If a value isn't in `tokens.css` or `themes.css`, it doesn't exist yet — add the token, don't inline the value. This is what "every component uses global.css tokens — no hardcoded values" (Phase 1 DoD) actually means in practice.

### 1.3 Typography tokens are fixed and predictable

`--text-*` tokens are fixed rem values, not viewport-scaled `clamp()` values. This is intentional after the mobile-first layout pass: fixed type prevents text from growing unpredictably inside dense cards, controls, drawers, command rows, and chat panels.

**Rule:** Do not scale font size with viewport width. Use the semantic text tokens and component-level hierarchy instead:

| Use case                     | Token                       |
| ---------------------------- | --------------------------- |
| Metadata, captions, chips    | `--text-xs` / `--text-sm`   |
| Body copy                    | `--text-base`               |
| Compact section headings     | `--text-lg` / `--text-xl`   |
| Page and hero headings       | `--text-2xl` to `--text-4xl` |

If text does not fit, fix layout constraints, wrapping, truncation, or content length. Do not introduce `vw`-based font sizing.

### 1.4 Shadows and glow

`--shadow-sm`, `--shadow-md`, `--shadow-lg`, and `--shadow-glow` are theme-aware. Dark mode uses deeper elevation; light mode uses softer warm-neutral shadows so cards do not look smoky or heavy.

`--shadow-glow` exists for accent-colored emphasis without hardcoding an accent RGBA value. Use it for focus/hover emphasis on accent-backed or accent-adjacent elements only — not as a generic "make it pop" utility.

---

## 2. Theming

### 2.1 Dark is default, light is the override

```css
:root { /* dark tokens */ }
[data-theme="light"] { /* light tokens */ }
```

**Rule:** Every new semantic color token must be defined in **both** blocks in the same commit. A token that exists only in `:root` silently breaks light mode — this is not caught by TypeScript or ESLint, only by review discipline.

### 2.2 Semantic tokens only — no raw hex in components

Components reference `--color-fg`, `--color-muted`, `--color-danger-bg`, etc. — never a hex value, never `text-zinc-400`. Tailwind's default palette utilities (`text-gray-500`, `bg-slate-900`) are **prohibited** in this project; they bypass the theme system entirely and won't respond to `[data-theme]` toggling.

### 2.3 Accent consistency and contrast

Accent is the brand anchor, but it is not the same hex in both themes:

| Token                   | Dark role                                           | Light role                                                 |
| ----------------------- | --------------------------------------------------- | ---------------------------------------------------------- |
| `--color-accent`        | Bright lime signal on dark surfaces                 | Darker readable green on warm-light surfaces               |
| `--color-accent-dim`    | Lower-emphasis accent                               | Deeper green for borders, gradients, and code tokens       |
| `--color-accent-bg`     | Low-opacity accent surface                          | Low-opacity green wash that stays readable on light        |
| `--color-accent-contrast` | Text/icon color on accent-backed controls         | White/off-white text on the darker light-theme accent      |

**Rule:** Any control with `background: var(--color-accent)` must use `var(--color-accent-contrast)` for foreground content. Do not use `var(--color-bg)` as accent text; it is not guaranteed to meet contrast in both themes.

Do not invent a second green or hardcode old dark-theme lime values like `#c6f554` or `rgba(181,242,61,...)` in new components. Use `color-mix()` against `--color-accent`, `--color-accent-bg`, or `--shadow-glow`.

### 2.4 Current theme character

Dark mode is the default identity: black/zinc surfaces, bright lime signal, high contrast, and deeper elevation.

Light mode is not an inversion. It is an editorial companion theme:

- warm-neutral page background (`--color-bg`)
- near-white content surfaces (`--color-surface`)
- green-tinted secondary surfaces (`--color-surface-2`)
- muted olive-gray text tokens
- darker accent green for accessible links, buttons, code, and focus states
- softer warm shadows defined inside `[data-theme="light"]`

This prevents the light theme from feeling washed out, overly gray, or like the dark theme effects were pasted onto a white canvas.

### 2.5 Ambient background controls

`SectionBackground` variants are theme-aware through ambient multipliers:

| Token                         | Purpose                                                  |
| ----------------------------- | -------------------------------------------------------- |
| `--ambient-line-opacity`      | Scales editorial ruled lines, grids, and dot patterns    |
| `--ambient-glow-opacity`      | Scales mesh layers, glows, and gradient overlays         |
| `--ambient-vignette-opacity`  | Scales edge vignette strength                            |
| `--ambient-noise-opacity`     | Scales grain/noise overlays                              |

Dark mode keeps these at full strength. Light mode reduces them so section backgrounds retain depth without becoming dirty, smoky, or overly dramatic.

**Rule:** Do not create separate `lightEditorial`, `lightMesh`, etc. variants. Tune shared variants through theme tokens first.

### 2.6 SectionBackground variant assignments

All `SectionBackground` variant choices are logged decisions. If a surface uses no `SectionBackground`, say `none` instead of inventing a neutral variant.

| Surface                            | Variant     | Decision |
| ---------------------------------- | ----------- | -------- |
| `/projects` index hero             | `editorial` | DEC-020  |
| `/projects` grid section           | `minimal`   | DEC-020  |
| `/projects/[slug]` case study hero | `mesh`      | DEC-020  |
| `/projects/[slug]` prose sections  | `minimal`   | DEC-020  |
| `/lab` index hero                  | `aurora`    | DEC-043  |
| `/lab` entry grid                  | `minimal`   | DEC-043  |
| `/lab/[slug]` entry hero           | `editorial` | DEC-043  |
| `/lab/[slug]` content sections     | `minimal`   | DEC-043  |
| `/contact` hero                    | `editorial` | DEC-037  |
| `/contact` form grid               | none        | DEC-037  |
| `/contact` QuickReach              | `mesh`      | DEC-037  |
| `/about` hero                      | `mesh`      | DEC-045  |
| `/about` EngineeringPhilosophy     | `minimal`   | DEC-045  |
| `/about` DecisionMaking            | feature-local | DEC-045 |
| `/about` WorkingApproach           | feature-local | DEC-045 |
| `/about` ValuesInPractice          | `grid`      | DEC-045  |
| `/about` CurrentlyExploring        | `editorial` | DEC-045  |
| `/about` ConnectToWork             | `mesh`      | DEC-045  |
| `/writing` index hero              | `editorial` | DEC-048  |
| `/writing` index body              | `minimal`   | DEC-048  |
| `/writing/[slug]` hero             | `editorial` | DEC-048  |
| `/writing/[slug]` body             | `minimal`   | DEC-048  |

Home sections that render `SectionBackground` use the component default (`minimal`) unless a future decision assigns a stronger variant.

---

## 3. Layout Contract

```
RootLayout
  └── Section (one per content area — vertical rhythm)
        └── Container (size: default | wide | full — per-section decision)
              └── Feature Content
```

| Container | Width  | Use for                                      |
| --------- | ------ | --------------------------------------------- |
| `narrow`  | 672px  | Tight prose and compact focused content       |
| `default` | 896px  | Prose — hero copy, about, writing, forms      |
| `wide`    | 1152px | Grids — card layouts, two-column sections     |
| `full`    | 100%   | Only when content explicitly requires bleed   |

**Rule:** Container size is chosen per `Section`, never per page. A page mixing `default` hero + `wide` grid is correct, not inconsistent — see DEC-024. Don't "simplify" a page to one container size; that's a regression, not a cleanup.

**Rule:** No raw Tailwind utility classes in `app/**/page.jsx` files. Pages compose `Section`, `Container`, and feature components. All spacing/color/layout decisions live inside components, where they're reusable and reviewable in one place. If a page needs one-off spacing, that's a signal the component API is missing a prop — extend the component, don't reach for `className="mt-12"` in the page.

### 3.1 Root shell contract

`src/app/layout.jsx` owns only global document wiring:

- metadata defaults and canonical base URL from `siteConfig`
- global CSS import
- pre-hydration theme bootstrap script
- skip link
- `Providers`
- `SiteHeader`
- `main#main-content`
- `SiteFooter`
- global overlays: `ChatWidget` and `CommandPalette`

**Rule:** Root layout is not a visual playground. Route-specific visuals live in feature components. Global overlays mount once in the root layout and must be fixed-position, pointer-safe, and responsive.

### 3.2 Font loading

The site does not use `next/font/google`. Font variables are defined in `base.css` as stable CSS stacks:

- `--font-display`
- `--font-body`
- `--font-mono`

This avoids build-time network fetches from Google Fonts and keeps Vercel/local builds deterministic in restricted network environments. Do not reintroduce `next/font/google` unless the deployment environment and build cache strategy are explicitly documented.

---

## 4. Component Architecture

### 4.1 Where things live

| Location              | Contents                                                        | Client boundary rule                          |
| ---------------------- | ----------------------------------------------------------------- | ----------------------------------------------- |
| `components/layout/`  | `RootLayout`, `Section`, `Container` — structural only            | RSC by default                                  |
| `components/ui/`      | Design-system primitives shared across ≥2 features (`Button`, `Card`, `ProjectCard`) | RSC unless the primitive itself owns interaction |
| `features/<name>/`    | Feature-scoped, often data-coupled (`CaseStudyLayout`, `StickyOutline`) | `use client` only at the leaf that needs it     |

Route-level section shells such as `ProjectsIndexSections`, `CaseStudySections`, `WritingPageSections`, and `ContactFormGrid` live in `features/`. They let `app/**/page.jsx` own data/metadata while feature modules own visual structure.

**Rule:** A component moves from `features/` to `components/ui/` the moment a second feature needs it — not before (YAGNI), not much after (duplication debt). `ProjectCard`, `LabCard`, and `AvailabilitySignal` are already shared primitives for exactly this reason.

### 4.2 `use client` is a ledger entry, not a keystroke

Every `use client` directive must be:
1. Scoped to the smallest possible leaf component — never a page, never an index.
2. Justified by one of: browser-only API (clipboard, `IntersectionObserver`, `localStorage`), event-driven local UI state, or a form library requirement.
3. Logged in the `use client` ledger (`AI_CONTEXT.md` §4) with its justification before the PR merges.

If you're tempted to add `use client` to make a `useEffect` compile, stop — that's usually the actual bug (see §6).

Current global client boundaries:

| Component / module       | Reason                                                                 |
| ------------------------ | ---------------------------------------------------------------------- |
| `Providers`              | Theme store bridges DOM theme attribute, localStorage, and React state |
| `HeaderChrome`           | Scroll state for sticky header background and progress bar             |
| `DesktopNav`             | Active route and hover indicator via `usePathname`                     |
| `MobileNav`              | Drawer open state, focus management, body scroll lock, route reset     |
| `CommandTrigger`         | Opens command palette external store                                   |
| `CommandPalette`         | Global keyboard shortcut, search state, route actions                  |
| `ThemeToggle`            | User-triggered theme writes                                            |
| `StatusBadge`            | Tooltip visibility                                                     |
| `ChatWidget`             | Floating assistant panel and streamed conversation UI                  |

These are allowed because they are global interactive surfaces. They do not make the entire header/footer/page client-rendered.

### 4.3 Component API stability

- Every component takes a `variant` prop for visual alternates (`ProjectCard variant="list" | "grid"`), not a second component (`ProjectCardList`).
- No component reaches outside its own props/children for data. `CaseStudyLayout` is explicitly allowed to be data-coupled (DEC-016) because it's a feature layout, not a `ui/` primitive — that distinction is what keeps `ui/` components portable.
- Breaking prop renames require updating every call site in the same PR — no deprecated-prop shims for a single-consumer codebase.

---

## 5. Mobile-First CSS Rules

### 5.1 Author for the smallest viewport first

Every utility stack and every custom rule starts from mobile and adds complexity upward:

```jsx
// Correct — mobile is the base case, desktop is the exception
<div className="flex flex-col gap-4 lg:flex-row lg:gap-8">

// Wrong — desktop-first, retrofitted down
<div className="flex flex-row gap-8 max-lg:flex-col max-lg:gap-4">
```

`max-*` variants are a signal the component was designed desktop-first and patched. Reserve `max-*` for genuine desktop-only overrides of an otherwise mobile-first stack — not as the primary responsive strategy.

### 5.2 Breakpoint discipline

Use Tailwind's default breakpoint scale (`sm` 640 / `md` 768 / `lg` 1024 / `xl` 1280) — do not introduce custom breakpoints without a token entry and a reason. Two-column grids (`ProjectCard`, `LabCard` per DEC-023/DEC-042) collapse to one column below `lg`, matching the layout contract's stated behavior — verify this explicitly when building a new grid, don't assume Tailwind's defaults happen to match spec intent.

### 5.3 Touch targets and content reflow

- Interactive elements ≥ 44×44px on touch viewports — check `Button`, `Tag`, filter pills specifically, since dense UI is where this regresses first.
- Content order in the DOM should match visual order at the smallest breakpoint. Don't use `order-*` to visually reorder content in a way that diverges from source order — it breaks screen-reader and keyboard-navigation flow.
- Test every new section at 375px width before 1440px. Desktop forgives layout mistakes that mobile doesn't.

### 5.4 CSS layer & specificity discipline

All custom CSS lives in a Tailwind `@layer` (`base`, `utilities`) — never unlayered. Unlayered custom CSS silently outranks Tailwind utilities regardless of source order, which is the single most common "why isn't my className working" bug in this stack.

Watch for selector collisions between type-based and class-based rules targeting the same element (e.g. a bare `section` rule in `base.css` fighting a `.cta` utility) — these cancel out unpredictably, especially around padding/margin. When adding a new base-layer element selector, grep for existing utility classes that target the same tag before assuming the cascade will resolve the way you expect.

---

## 6. React State & Effects — Rules and the Specific Bug Class

### 6.1 The rule

> Effects synchronize React with an **external system** (DOM, browser API, subscription, non-React widget). If your effect's only job is "when X changes, update some React state," you don't need an effect — compute it during render or update it in the event handler that caused X to change.
> — [react.dev: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

Calling `setState` synchronously in an effect body means: render → commit → effect fires → `setState` → React discards the just-committed screen and re-renders. That's a wasted render on every single state change the effect reacts to, and it compounds when multiple effects each do this in sequence ("cascading renders").

### 6.2 The reported bug, fixed

```jsx
// ❌ Before — effect exists solely to sync local state to a prop/route change
function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false); // fires an extra render on every navigation
  }, [pathname]);

  // ...
}
```

**Fix — adjust state during render, not in an effect.** This is the documented pattern for "resetting state when a prop changes" (same section of the React docs, "Resetting all state when a prop changes"):

```jsx
// ✅ After — state is adjusted synchronously during render
function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // ...
}
```

This looks like it mutates state during render, but it's the sanctioned exception: the condition is a **direct comparison against a value derived from props**, it bails out after one adjustment, and React re-runs the component body immediately with the new state *before* committing to the screen — so there's no extra paint, no effect round-trip, no cascading render.

**Even simpler alternative for this specific case:** if `MobileNav` only needs to close on navigation and doesn't need to preserve `open` across renders for any other reason, remount it on route change instead of tracking `open` at all:

```jsx
// ✅ Also valid — let React's reconciliation do the reset via `key`
<MobileNav key={pathname} />
```

Prefer the `key` remount when the component has no state worth preserving across the transition (menu open/closed is exactly this case). Prefer the render-time comparison when the component holds other state that must survive the prop change.

### 6.3 The broader anti-pattern catalog

| Symptom in a PR                                                             | Root cause                                                        | Fix                                                                                              |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `useEffect(() => setX(deriveFromY(y)), [y])`                                 | Derived value stored as state instead of computed                    | Compute `deriveFromY(y)` inline during render. No state, no effect, no stale-value risk.             |
| `useEffect(() => { setSubmitted(true); sendAnalytics(); }, [formData])`      | Effect reacting to a value that only ever changes via a user action  | Move the logic into the `onSubmit`/`onClick` handler that actually caused the change.                |
| `useEffect(() => { fetch(...).then(setData) }, [id])` with no cleanup       | Fetch-in-effect without race-condition guard                         | Add an `ignore` flag cleanup (`return () => { ignore = true }`) or use Next.js server-side data fetching per the rendering strategy in §7 — this is an RSC project, client-side fetching should be the exception. |
| Effect with a missing or over-broad dependency array, silenced with `eslint-disable` | Effect body references a value not declared as a dependency        | Never disable `react-hooks/exhaustive-deps`. Restructure the effect (often via the `useEffectEvent` pattern, or by moving logic to a handler) instead of lying to the linter. |
| Chained effects (`setA` in one effect triggers a second effect that sets `B`) | Each effect is one hop of a pipeline that should be one calculation | Collapse into a single computation during render, or a single event handler if the chain starts from a user action. |
| `useMemo`/`useCallback` wrapping every function and value "for performance" | Premature optimization without a measured re-render cost             | Only memoize when a dependency array of a downstream effect/render actually needs referential stability — verify with profiler, don't default to it. |

### 6.4 Effects that are legitimate — don't over-correct

Not all effects are wrong. These are correct uses per the same React docs:

- Subscribing to a browser API and cleaning up: `IntersectionObserver` in `StickyOutline` (DEC-034) — external system, correct effect usage.
- Imperatively syncing to a non-React widget (a chart library instance, a map instance).
- `AnchorCopy`'s `navigator.clipboard.writeText` — this belongs in the click handler, not an effect, since it's a direct response to a user action (verify this on review).
- Body scroll lock and focus management for modal/drawer surfaces (`MobileNav`, `CommandPalette`, `ChatWidget`) — these synchronize React state with DOM behavior.

The test: **"Is this effect updating an external system, or reacting to something that already happened in an event handler?"** If it's the latter, the logic belongs in the handler, not the effect.

### 6.5 External store pattern

Use `useSyncExternalStore` when React needs to read a browser or module-level value that is outside React state:

| Value                                  | Pattern                                            |
| -------------------------------------- | -------------------------------------------------- |
| OS reduced-motion preference           | `usePrefersReducedMotion` subscribes to media query |
| Current time display                   | status terminals subscribe to a clock interval     |
| Command palette open state             | minimal external store in `features/command-palette/store.js` |
| Theme value from `<html data-theme>`    | `Providers` reads the DOM-backed theme store       |

**Rule:** Do not copy these values into local state inside `useEffect`. Either subscribe with `useSyncExternalStore`, compute during render, or update in the event handler that caused the change.

### 6.6 Derived UI state

The following patterns are now canonical:

- Chat error banner derives from `error` plus `dismissedError`, not `useEffect(() => setLocalError(error))`.
- Reduced-motion branches return derived values (`target`, first typewriter word) instead of setting state synchronously in an effect.
- Carousel refs are updated after commit, not mutated during render.

Any future React Compiler lint issue should be treated as a design smell first and a lint problem second.

---

## 7. Rendering Strategy (Next.js App Router)

- Server Components are the default. A component is a client component only when it fails to work without one — not because it's convenient to co-locate a `useState`.
- Data fetching is server-side (`async` RSC) by default. Client-side `useEffect` fetching is a fallback for genuinely client-only data (e.g. reading from `localStorage`), not the default pattern.
- Verify every new `use client` boundary against the checklist in §4.2 before merging — this is the single highest-leverage review step for keeping the JS bundle within the performance budget (Lighthouse ≥ 95, TTI ≤ 2.5s per `PORTFOLIO_V2_SPEC.md` §3).

---

## 8. Motion Rules

- All `@keyframes` live in `animations.css` — never inline in a component's `style` prop, never a second keyframes source.
- Every animation utility has a `prefers-reduced-motion: reduce` fallback — `animations.css` already handles this globally; a new animation utility must be added to that media query block, not assumed to inherit it.
- Motion must explain state or hierarchy (entrance, active-state pulse, progress) — never decorative-only, per DEC-004. If you can't name what state change the motion communicates, cut it.

---

## 9. Accessibility Baseline (WCAG AA, non-negotiable)

- `:focus-visible` styling is global (`base.css`) — never suppress it with `outline: none` on a component without supplying an equivalent visible focus state.
- Color usage is semantic-token-only (§2.2), which is also what keeps contrast ratios centrally auditable — a component using raw hex can silently fail AA contrast in one theme without anyone noticing.
- Interactive elements use native semantics first (`<button>`, `<a href>`) — `div onClick` requires `role`, `tabIndex`, and keyboard handlers added explicitly, and is a last resort, not a default.
- Every image requires meaningful `alt` text or `alt=""` if purely decorative — never omitted.

---

## 10. Component Creation Checklist

Before opening a PR for a new component, confirm:

- [ ] Lives in the correct location per §4.1 (`layout/` / `ui/` / `features/<name>/`)
- [ ] Zero hardcoded colors, spacing, shadows, or font sizes — tokens only (§1.2)
- [ ] Mobile-first class ordering — base classes unprefixed, larger breakpoints added upward (§5.1)
- [ ] No `use client` unless justified and logged in the ledger (§4.2)
- [ ] No `useEffect` used to derive or sync local state from props/route/context — checked against §6.3 table
- [ ] Focus-visible and keyboard interaction verified, not just mouse-tested
- [ ] Verified in both `:root` (dark) and `[data-theme="light"]`
- [ ] Verified at 375px before 1440px
- [ ] No raw Tailwind color/spacing utilities that bypass tokens (e.g. `text-gray-400`, `p-[13px]`)
- [ ] `variant` prop used for visual alternates instead of a duplicate component

---

## 11. Production And Deployment Contract

### 11.1 Vercel readiness

The project is configured for Vercel deployment:

- `vercel.json` declares the Next.js framework, pnpm install/build/dev commands, frozen lockfile install, and region preference.
- `package.json` declares `packageManager: pnpm@10.15.1`, Node engine `>=22.0.0`, and `deploy:check`.
- `next.config.mjs` enables production-safe defaults: `reactStrictMode`, `poweredByHeader: false`, compression, optimized image formats, no production browser source maps, and security headers.

Run before deployment:

```bash
pnpm deploy:check
```

If using the local npm shim fails on Windows, use the local binaries directly:

```bash
.\node_modules\.bin\eslint.CMD
node .\node_modules\next\dist\bin\next build
```

### 11.2 Metadata routes

The App Router owns SEO/system metadata routes:

| File                  | Output                  | Purpose                                      |
| --------------------- | ----------------------- | -------------------------------------------- |
| `src/app/robots.js`   | `/robots.txt`           | Allows production indexing, blocks previews  |
| `src/app/sitemap.js`  | `/sitemap.xml`          | Includes static routes plus projects, lab, and writing entries |
| `src/app/manifest.js` | `/manifest.webmanifest` | PWA/browser install metadata and icons       |

`sitemap.js` imports data accessors from `lib/data/*`. Do not hand-maintain route lists when a data source already exists.

### 11.3 Metadata title rules

Root layout owns the title template:

```js
title: {
  default: `${siteConfig.name} | ${siteConfig.title}`,
  template: `%s | ${siteConfig.name}`,
}
```

Child pages provide only their local title (`"Projects"`, `"Writing"`, project title, post title). Do not include `"Alex Shedrach"` or decorative separators in child metadata titles.

### 11.4 Build-time network rule

Production builds must not depend on third-party network fetches for core rendering assets. This is why font stacks are local CSS variables instead of `next/font/google`.

---

## 12. Reference Documentation

Pull current guidance from these sources when a pattern isn't covered above — don't rely on memorized framework behavior for anything version-sensitive:

- React: [react.dev/learn/you-might-not-need-an-effect](https://react.dev/learn/you-might-not-need-an-effect) — canonical source for §6
- React: [react.dev/reference/react/useEffect](https://react.dev/reference/react/useEffect) — effect lifecycle and cleanup semantics
- Next.js App Router: [nextjs.org/docs/app](https://nextjs.org/docs/app) — Server/Client Component boundary rules, data fetching
- Tailwind CSS v4: [tailwindcss.com/docs](https://tailwindcss.com/docs) — CSS-first `@theme` config, `@layer` behavior
- WCAG 2.1 AA: [w3.org/WAI/WCAG21/quickref](https://www.w3.org/WAI/WCAG21/quickref/?levels=aa) — accessibility conformance target

This document supersedes ad-hoc style choices. If a PR conflicts with a rule here, either the PR changes or this document gets a logged amendment — it is never silently overridden.
