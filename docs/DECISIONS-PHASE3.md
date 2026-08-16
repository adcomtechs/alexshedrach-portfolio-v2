# DECISIONS-PHASE3.md — Phase 3 Decisions: Projects System

**Project:** alexshedrach.dev
**Version:** 2.0.0
**Last Updated:** 2026
**Classification:** Phase 3 Engineering Memory — Load When Working on Projects, Case Studies, or Writing System

---

## 0. About This File

This file contains decisions made during **Phase 3 — Projects System** development. It covers the projects index, case study layout, data architecture, conditional UI patterns, and all component decisions specific to the projects domain.

**Prerequisites:** Load `DECISIONS.md` and `DECISIONS-CORE.md` before this file. Core decisions govern everything in this file.

**Scope:** DEC-016 to DEC-036

For the complete decision index and protocol, see `DECISIONS.md`.
For Home page decisions, see `DECISIONS-PHASE2.md`.

---

## 1. Quick Reference — Case Study Page Anatomy

The full case study page structure — in render order — as established by decisions in this file:

```
Case Study Page
│
├── Hero                              DEC-021
│   ├── Breadcrumb
│   ├── Domain eyebrow
│   ├── Project title
│   ├── One-sentence summary
│   ├── Metrics strip (conditional)   DEC-018 amendment
│   └── Stack · Status · Year · Demo · Repo  DEC-032
│
├── Six prose sections                DEC-017
│   ├── Problem
│   ├── Constraints
│   ├── Architecture
│   ├── Decisions
│   ├── Tradeoffs
│   └── Outcome
│
├── Challenges and Solutions          DEC-033
│
├── Testimonial (conditional)         DEC-022
│
└── Next / Previous navigation        DEC-035

Sticky sidebar outline (lg+ only)     DEC-034
Copy anchor links on section labels   DEC-036
```

---

## 2. Quick Reference — Conditional UI Registry

All conditionally-rendered features in the projects system — per DEC-031:

| Feature                    | Condition                                 | Checked In        |
| -------------------------- | ----------------------------------------- | ----------------- |
| Domain filter pills        | 2+ domains with 2+ projects each          | `page.jsx`        |
| Status filter toggle       | 2+ distinct status values                 | `page.jsx`        |
| Stack filter               | 10+ projects total                        | `page.jsx`        |
| Clear filters link         | Any active filter in searchParams         | `page.jsx`        |
| Empty state                | Filtered results return 0 projects        | `ProjectIndex`    |
| Pagination controls        | Total projects > 8                        | `page.jsx`        |
| Currently building callout | Any project has `currentlyBuilding: true` | `page.jsx`        |
| Availability signal        | `siteConfig.available === true`           | `page.jsx`        |
| Metrics strip              | `project.metrics?.length > 0`             | `CaseStudyHero`   |
| Testimonial section        | `project.testimonial !== null`            | `CaseStudyLayout` |
| Demo link                  | `project.demoUrl` non-empty               | `CaseStudyHero`   |
| Repo link                  | `project.repoUrl` non-empty               | `CaseStudyHero`   |
| Challenges section         | `project.challenges?.length > 0`          | `CaseStudyLayout` |
| Next navigation            | Next project exists in index              | `CaseStudyLayout` |
| Previous navigation        | Previous project exists in index          | `CaseStudyLayout` |

---

## 3. Decision Records

---

### DEC-016 — CaseStudyLayout File Location

**Date:** 2026
**Status:** `Accepted`
**Area:** Architecture

#### Context

`CaseStudyLayout` has two defensible locations. `components/layout/` is where structural layout primitives live. `features/projects/` is where data-aware, domain-coupled components live. The component consumes the full `caseStudy` object — six prose fields tied directly to the project data schema — and will never be reused outside the projects domain.

#### Options Considered

| Option                               | Summary                                                           |
| ------------------------------------ | ----------------------------------------------------------------- |
| `components/layout/CaseStudyLayout/` | Structurally a layout — but data-schema-coupled                   |
| `features/projects/CaseStudyLayout/` | Data-aware, domain-specific — matches feature boundary convention |

#### Decision

**`CaseStudyLayout` lives in `features/projects/CaseStudyLayout/`.**

#### Reasoning

- The established convention is explicit: generic structural layouts live in `components/layout/`, data-aware feature layouts live in `features/`
- `CaseStudyLayout` is tightly coupled to the project data schema — it is not a generic structural primitive
- Placing a schema-coupled component in `components/layout/` breaks the separation of concerns boundary that the entire architecture is built on
- The component will never be reused outside the projects domain

#### Consequences

- ✅ Feature boundary convention upheld — no schema-coupled component in the shared layout directory
- ✅ `components/layout/` remains generic structural primitives only
- ⚠️ Any future layout component that couples to a data schema must follow the same rule — belongs in its feature directory

---

### DEC-017 — CaseStudy Prose Section Rendering Strategy

**Date:** 2026
**Status:** `Accepted`
**Area:** UX / Layout

#### Context

The six `caseStudy` fields — problem, constraints, architecture, decisions, tradeoffs, outcome — are unstructured prose strings. Three rendering strategies are available, each shaping the component's internal structure significantly. This cannot be refactored cheaply after the fact.

#### Options Considered

| Option                                          | Summary                                                             |
| ----------------------------------------------- | ------------------------------------------------------------------- |
| Flat vertical stack of labeled sections         | Cheapest, most readable for long-form prose                         |
| Two-column sticky label rail                    | Higher visual weight — label left, prose right                      |
| Progressive disclosure with expandable sections | Reduces scroll length, adds interaction complexity and `use client` |

#### Decision

**Flat vertical stack of labeled sections.** Each of the six fields renders as a labeled prose block stacked vertically.

#### Internal Structure

An internal `CaseStudySection` sub-component handles the labeled section pattern. It lives inside `features/projects/CaseStudyLayout/` — not in `components/ui/` as it is not a shared primitive.

#### Reasoning

- Long-form prose is most readable in a single continuous column — the two-column label rail adds visual complexity that competes with the content
- Progressive disclosure requires `use client` for the expand interaction — violates the server-first rendering principle for no meaningful gain
- A reader evaluating a case study wants all sections available, not hidden behind clicks
- Clarity over decoration — the prose is the product, not the layout

#### Consequences

- ✅ Server Component — no `use client` required
- ✅ Long-form prose reads cleanly without layout competition
- ✅ Simplest internal structure — easiest to maintain
- ⚠️ Visual differentiation relies entirely on typography and spacing execution
- ⚠️ If a two-column treatment is ever reconsidered, this decision must be formally amended — do not change mid-build without logging it

---

### DEC-018 — AMENDMENT: Hero Metrics Strip Added

**Date:** 2026
**Status:** `Accepted` — Amends original DEC-018
**Area:** Data / UX

#### Original Decision

`outcome` renders as prose. No `metrics` array. `MetricBadge` not used in `CaseStudyLayout`. Schema change deferred until content maturity justifies it.

#### Why This Is Being Amended

The original decision correctly preserved prose outcome as the primary narrative. The amendment does not replace it. A metrics strip in the hero — three to four quantified data points surfaced before the evaluator reads the prose — adds a high-signal layer at the exact moment of first impression. This is additive, not a replacement.

#### Amended Decision

**Add an optional `metrics` array to the project schema. When present, a metrics strip renders in the case study hero between the one-sentence summary and the metadata row, using `MetricBadge` components. The prose `outcome` field is preserved and unchanged.**

#### Schema Addition

```js
metrics: [
  {
    value: "",    // The quantified data point — "200 documents"
    label: "",    // What it measures — "Corpus seeded"
    trend: "",    // Optional — "up" | "down" | "neutral"
  },
  // 3–4 entries maximum — hero space is constrained
],
```

#### Hero Anatomy After Amendment

```
[Domain eyebrow]
[Project title]
[One-sentence summary]
[MetricBadge] [MetricBadge] [MetricBadge]   ← metrics strip — conditional
[Stack tags] [Status] [Year] [Demo ↗] [Repo ↗]
```

#### Rendering Logic

```js
{
  project.metrics?.length > 0 && <MetricsStrip metrics={project.metrics} />;
}
```

#### Preservation of Original Decision

- The prose `outcome` field is unchanged
- `MetricBadge` is not introduced inside the six prose sections
- The metrics strip is hero-only — the prose narrative is still the complete record
- Projects without a `metrics` array render no strip — no empty state

#### Consequences

- ✅ Quantified signal surfaces in the first 10 seconds — before prose commitment
- ✅ Prose outcome field preserved and unchanged
- ✅ Optional — no project blocked from shipping without metrics
- ✅ `MetricBadge` component used correctly — structured data display
- ⚠️ Maximum 3–4 metrics per hero — space is constrained
- ⚠️ Metrics must be real and verifiable — fabricated numbers damage credibility irreparably
- ⚠️ `value` must be human-readable at a glance — avoid raw decimals or unprefixed large numbers

---

### DEC-019 — AMENDMENT: Filter System Built Now, UI Gates on Runtime Conditions

**Date:** 2026
**Status:** `Accepted` — Supersedes original DEC-019
**Area:** UX / Architecture

#### Original Decision

Phase 3 ships a static sorted list. No filter UI. Filters introduced only when trigger conditions are met in a future session.

#### Why This Is Being Amended

Deferral creates a future implementation cost and a future decision session that can be eliminated entirely. The correct approach is to build the complete filter infrastructure now with runtime condition checks — the UI gates itself based on the data, with no manual activation required.

#### Amended Decision

**Build the complete filter infrastructure in Phase 3. The filter UI renders conditionally based on runtime data checks evaluated server-side.**

#### Trigger Conditions — Evaluated Automatically at Runtime

| Filter Control       | Renders When                                    | Hidden When                               |
| -------------------- | ----------------------------------------------- | ----------------------------------------- |
| Domain filter pills  | 2+ distinct domains have 2+ projects each       | Data distribution does not meet threshold |
| Status filter toggle | 2+ distinct status values exist across projects | All projects share the same status        |
| Stack filter         | 10+ projects exist in the index                 | Project count below threshold             |
| Clear filters link   | Any filter is currently active                  | No active filters                         |
| Filter row container | Any single filter control is visible            | All controls hidden — row renders nothing |

#### Condition Check Pattern

```js
// page.jsx — server-side condition evaluation
const projects = getAllProjects();
const domains = getDomainDistribution(projects); // { domain: count }
const statuses = getStatusDistribution(projects); // { status: count }

const showDomainFilter =
  Object.values(domains).filter((count) => count >= 2).length >= 2;

const showStatusFilter = Object.keys(statuses).length >= 2;
const showStackFilter = projects.length >= 10;
```

#### Consequences

- ✅ Filter UI activates automatically as the project index grows
- ✅ No future implementation session required to enable filters
- ✅ Filter infrastructure is built correctly once — not retrofitted later
- ✅ Server-side condition checks — zero client JS for the gate logic
- ⚠️ Condition logic must be maintained in sync with the data schema
- ⚠️ If trigger thresholds need adjustment, update this entry and the condition functions — not the component rendering logic

---

### DEC-020 — SectionBackground Variant Assignment: Projects Pages

**Date:** 2026
**Status:** `Accepted`
**Area:** UX / Design System

#### Context

`SectionBackground` supports multiple visual variants. As Phase 3 introduces two new surfaces — `/projects` index and `/projects/[slug]` — variant assignment must be explicit and logged before implementation begins. Unlogged variant choices become inconsistent over time as new pages are added.

#### Decision

| Surface                                  | Variant     |
| ---------------------------------------- | ----------- |
| `/projects` index — page hero            | `editorial` |
| `/projects` index — project grid section | `minimal`   |
| `/projects/[slug]` — case study hero     | `mesh`      |
| `/projects/[slug]` — prose sections      | `minimal`   |

#### Reasoning

- `mesh` is designated for hero surfaces — cinematic treatment is appropriate for the primary landing surface of a specific project
- `editorial` on the projects index hero creates the document and evidence feel that reinforces the case study framing
- `minimal` on dense content areas keeps visual noise from competing with the content where the signal lives
- Assignment is consistent with Phase 2 section background usage patterns

#### Implementation Prerequisite

The `mesh` variant config must exist in `SECTION_BACKGROUND_VARIANTS` before the case study hero is built. Verify before implementation begins.

#### Consequences

- ✅ Visual language is consistent and purposeful across all surfaces
- ✅ Variant assignment is logged — future pages reference this pattern
- ⚠️ `mesh` variant must exist in `SECTION_BACKGROUND_VARIANTS` before Step 4 — blocking prerequisite
- ⚠️ Any future page that deviates from this variant pattern requires a new `DECISIONS.md` entry

---

### DEC-021 — Hero Sections on Projects Pages

**Date:** 2026
**Status:** `Accepted`
**Area:** UX / Layout

#### Context

Both `/projects` and `/projects/[slug]` require dedicated hero sections. Without one, each page opens cold — `SectionHeader` alone does not establish sufficient visual weight or contextual framing for visitors arriving directly from search or a shared link.

#### Decision

**Both `/projects` and `/projects/[slug]` ship with dedicated hero sections. Both are React Server Components. Both use the `SectionBackground` variant assigned in DEC-020.**

#### Hero Specifications

**`/projects` Index Hero**

| Element              | Detail                                                                          |
| -------------------- | ------------------------------------------------------------------------------- |
| Eyebrow label        | Section identifier                                                              |
| Heading              | Primary page heading                                                            |
| Subheading           | Frames the curation philosophy — projects as engineering records, not a gallery |
| Project count signal | Quantifies the index — sets expectation before the grid                         |
| Background           | `editorial` variant — per DEC-020                                               |
| Rendering            | RSC                                                                             |

**`/projects/[slug]` Case Study Hero**

| Element              | Detail                                       |
| -------------------- | -------------------------------------------- |
| Breadcrumb           | Navigation path — Projects → [Project Name]  |
| Domain eyebrow       | Project domain / category                    |
| Project title        | Primary heading                              |
| One-sentence summary | `description` field — tight, not a paragraph |
| Metrics strip        | Conditional — per DEC-018 amendment          |
| Stack tags           | Technology array rendered as badges          |
| Status badge         | `STATUS_CONFIG` mapped value — per DEC-015   |
| Year                 | Project year                                 |
| Demo / Repo links    | Conditional — per DEC-032                    |
| Background           | `mesh` variant — per DEC-020                 |
| Rendering            | RSC                                          |

#### Reasoning

- The index hero frames the entire section before the visitor reaches the grid — curation philosophy must be stated, not assumed
- The case study hero must front-load enough signal that a technical evaluator can orient in under 10 seconds before committing to reading six prose sections
- Both heroes are RSC — no interaction, no client boundary required

#### Consequences

- ✅ Both pages are self-orienting for cold arrivals
- ✅ Case study hero front-loads the project identity signal
- ⚠️ Index hero must not duplicate the `SectionHeader` that introduces the project grid below
- ⚠️ Case study hero `description` field must be a single sentence — content discipline required

---

### DEC-022 — Testimonial Section on Case Study Pages

**Date:** 2026
**Status:** `Accepted`
**Area:** UX / Data

#### Context

Case study pages currently end at the `outcome` prose section. A testimonial from a collaborator, client, or institutional contact provides third-party validation that the engineering narrative alone cannot. The data does not exist in the current schema and requires a definition before `CaseStudyLayout` is built.

#### Options Considered

| Option                     | Summary                                                  |
| -------------------------- | -------------------------------------------------------- |
| No testimonial             | Cleaner structure, no third-party signal                 |
| Required testimonial field | Every project blocked until testimonial is sourced       |
| Optional testimonial field | Projects without one render no section — nothing blocked |

#### Decision

**Testimonial section lives on `/projects/[slug]` only — rendered below the six prose sections and Challenges, above Next/Previous navigation. The field is optional. If absent, the section does not render.**

#### Schema

```js
testimonial: {
  quote:        "",    // The testimonial text — no quotation marks in the string
  name:         "",    // Person's name
  title:        "",    // Role or title
  organisation: "",    // Company or institution
} | null,              // null = section does not render
```

#### Content Standard

Testimonial quotes must be:

- **Specific** — references something concrete about the work
- **Not generic praise** — "great developer" does not pass the content standard
- **First person** — written as the person's own words
- No quotation marks in the string — the component handles typographic quotes

#### Consequences

- ✅ Case study pages gain third-party credibility signal without blocking any project
- ✅ `Avatar` component reused — no new primitives required
- ✅ Schema is optional and minimal
- ⚠️ Replace sample data with verified real contacts before production deployment
- ⚠️ Quotes must meet `PORTFOLIO_V2_SPEC.md Section 8` writing standard

---

### DEC-023 — ProjectIndex Grid Column Layout

**Date:** 2026
**Status:** `Accepted` — Amended by DEC-028 (view toggle added)
**Area:** UX / Layout

#### Context

The projects index renders up to six `ProjectCard` components. Column count at each breakpoint directly determines visual density and reading experience. A card compressed past a readable width loses the signal value it exists to deliver.

#### Options Considered

| Option                          | Summary                                                     |
| ------------------------------- | ----------------------------------------------------------- |
| Three columns desktop           | Maximum density — signal body compressed past readability   |
| Two columns desktop, one mobile | Balanced density — signal zones readable at all breakpoints |
| One column throughout           | Maximum readability — underutilises wide viewport           |

#### Decision

**Two columns at desktop within the `wide` container (1152px). One column on mobile. No three-column layout at any breakpoint.**

#### Implementation

```css
grid-template-columns: 1fr; /* mobile */
grid-template-columns: repeat(2, 1fr); /* md+ desktop */
```

#### Reasoning

- Three columns at 1152px compresses each card to approximately 360px — the constraint and outcome rows lose readability
- Two columns gives each card approximately 560px — enough width for signal zones to breathe
- One column on mobile is the only defensible choice at small viewports

#### Consequences

- ✅ Signal zones remain readable at all breakpoints
- ✅ Grid pattern is logged — future index surfaces have a reference
- ⚠️ Three-column layout is explicitly prohibited at any breakpoint without a formal amendment
- ⚠️ DEC-028 adds a list view alternative — two-column grid remains the default

---

### DEC-024 — Mixed Container Sizes Within a Single Page

**Date:** 2026
**Status:** `Accepted`
**Area:** Architecture

#### Context

The `/projects` index page contains two surfaces with different optimal width requirements. The hero section is prose-heavy and benefits from the `default` container (896px). The project grid benefits from the `wide` container (1152px). These are two different `Container` sizes within one page — the layout contract needed an explicit ruling.

#### Decision

**Mixed Container sizes within a single page are explicitly permitted. Each `Section` independently selects the `Container` size that serves its content.**

#### Layout Contract Amendment

```
RootLayout
  └── Section (× n — one per content area)
        └── Container (size: default | wide | full — chosen per section)
              └── [Feature Content]
```

#### Permitted Size Assignments — `/projects` Index

| Section      | Container Size | Width  | Rationale                                             |
| ------------ | -------------- | ------ | ----------------------------------------------------- |
| Hero         | `default`      | 896px  | Prose-heavy — line length constrained for readability |
| Project grid | `wide`         | 1152px | Six cards — two-column grid needs room per DEC-023    |

#### Reasoning

- A single Container size per page forces a width compromise — the hero is either too wide for prose or the grid is unnecessarily constrained
- The `Section → Container` pairing already exists precisely to allow independent control of each content area
- This pattern recurs on other pages — logging it prevents re-litigation every time

#### Consequences

- ✅ Each section uses the Container size that serves its content
- ✅ Layout contract is clarified — future pages have an explicit ruling
- ⚠️ Container size must be a conscious decision per section — unspecified sizes fall back to `default`
- ⚠️ This amendment supersedes any prior interpretation of Container as a page-level decision

---

### DEC-025 — Filter State via URL SearchParams

**Date:** 2026
**Status:** `Accepted`
**Area:** Architecture

#### Context

When the filter system activates per DEC-019, filter state requires a home. Two options: component state via `useState` (requires `use client` on `ProjectIndex`) or URL-based state via `searchParams` (RSC-compatible).

#### Options Considered

| Option                       | Summary                                                                  |
| ---------------------------- | ------------------------------------------------------------------------ |
| Component state — `useState` | Requires `use client` on `ProjectIndex` — client JS for the entire index |
| URL searchParams             | Filter state in the URL — RSC-compatible, bookmarkable, shareable        |

#### Decision

**Filter state lives in the URL via `searchParams`. `ProjectIndex` remains a Server Component. Only the filter pill controls require `use client` — scoped to the `FilterControls` component only.**

#### Implementation Pattern

```
URL: /projects?domain=EdTech&status=wip

page.jsx (RSC)
├── reads searchParams.domain, searchParams.status
├── runs filter logic server-side
├── passes filtered projects + filter state to ProjectIndex
└── ProjectIndex (RSC) renders filtered grid

FilterControls (use client — scoped)
└── handles pill click → router.push with updated searchParams
```

#### Consequences

- ✅ `ProjectIndex` stays RSC — no client JS on the index itself
- ✅ Filter state is bookmarkable and shareable — URL is the source of truth
- ✅ Search engines index filtered views correctly
- ⚠️ Filter pill interaction requires `use client` on `FilterControls` only — minimum client boundary
- ⚠️ `router.push` on filter change causes a server round-trip — acceptable and consistent with the RSC model

---

### DEC-026 — Filter UI Pattern

**Date:** 2026
**Status:** `Accepted`
**Area:** UX

#### Context

When filter controls render per DEC-019 trigger conditions, the UI pattern determines scannability and interaction speed.

#### Options Considered

| Option               | Summary                                                                 |
| -------------------- | ----------------------------------------------------------------------- |
| Dropdown menus       | Compact — requires click to reveal options, slower to scan              |
| Horizontal pill row  | All options visible at a glance — faster to scan at this project volume |
| Sidebar filter panel | Appropriate for e-commerce — wrong surface for a curated index          |

#### Decision

**Horizontal pill row above the project grid. Domain pills render first. Status toggle renders second, only when condition is met. Active pills render with accent treatment. A "clear filters" link appears when any filter is active.**

#### Pill Row Anatomy

```
[All] [EdTech] [Fintech] [Retail]   [Live] [WIP]   Clear filters ×
 ↑ domain pills (conditional)        ↑ status        ↑ active only
```

#### Keyboard Navigation

Filter pills require full keyboard navigation — arrow keys move between pills, Enter toggles the active state. This is an accessibility requirement, not an enhancement. Ships with the filter UI component.

#### Consequences

- ✅ All filter options visible without interaction — faster evaluation
- ✅ Consistent with existing Tag component API and accent treatment
- ✅ Keyboard navigation ships with the component — not deferred
- ⚠️ Pill row becomes visually crowded beyond 6 domain values — re-evaluate if domain count exceeds 8

---

### DEC-027 — Pagination Approach

**Date:** 2026
**Status:** `Accepted`
**Area:** Architecture

#### Context

Pagination becomes necessary when the project index grows beyond a scannable length. Two approaches: URL-based page numbers (RSC-compatible) or a "load more" button (requires `use client`).

#### Options Considered

| Option                                      | Summary                                                                 |
| ------------------------------------------- | ----------------------------------------------------------------------- |
| URL-based page numbers — `/projects?page=2` | RSC-compatible, bookmarkable, zero client JS                            |
| Load more button                            | Better browsing UX — requires `use client`, conflicts with server-first |

#### Decision

**URL-based pagination. `/projects?page=2`. Page size: 6 projects. Pagination controls render automatically when project count exceeds 8.**

#### Automatic Activation

```js
// page.jsx — evaluated server-side
const showPagination = projects.length > 8;
const page = parseInt(searchParams.page ?? "1");
const pageSize = 6;
const paginated = projects.slice((page - 1) * pageSize, page * pageSize);
```

#### Consequences

- ✅ Pagination is RSC-compatible — zero client JS
- ✅ Paginated views are bookmarkable and shareable
- ✅ Activates automatically at 8+ projects
- ⚠️ Full page navigation between pages — acceptable tradeoff for RSC compatibility
- ⚠️ Page size of 6 may produce odd numbers at page boundaries — evaluate increasing to 9 if needed

---

### DEC-028 — View Toggle: List and Grid — DEC-023 Amendment

**Date:** 2026
**Status:** `Accepted` — Amends DEC-023
**Area:** UX / Architecture

#### Original Decision (DEC-023)

Two-column grid is the singular layout pattern. No list view.

#### Amendment

**A list/grid view toggle is added to the projects index. `use client` is scoped to the view toggle control only. `ProjectIndex` receives the active view as a prop and renders the appropriate layout.**

#### View Specifications

| View           | Layout                                | When to Use                                |
| -------------- | ------------------------------------- | ------------------------------------------ |
| Grid (default) | Two-column — per DEC-023              | Scanning by visual weight and signal zones |
| List           | Single column, horizontal card layout | Reading titles and summaries quickly       |

#### Implementation

```js
// ViewToggle.jsx — use client (scoped)
// Manages grid | list state
// Persists preference to localStorage
// Passes activeView to ProjectIndex via prop

// ProjectIndex.jsx — RSC
// Receives activeView prop
// Renders grid or list layout accordingly
```

#### DEC-023 Preservation

The two-column grid remains the default view. The list view is an alternative — it does not replace the grid. The prohibition on three-column layout stands.

#### Consequences

- ✅ Evaluators can switch between scanning (grid) and reading (list)
- ✅ `use client` scoped to toggle control only — index stays RSC
- ✅ View preference persisted — returning visitors see their last choice
- ⚠️ List view requires a horizontal card variant — `ProjectCard` must support both orientations via a `variant` prop
- ⚠️ Two-column grid remains the default — list view is secondary, not a replacement

---

### DEC-029 — Availability Signal

**Date:** 2026
**Status:** `Accepted`
**Area:** UX / Data

#### Context

Recruiters and founders evaluating the projects index are at peak intent. An availability signal at that moment — before they navigate away — is the highest-value placement on the site.

#### Decision

**Availability signal renders in two locations: the projects index hero and the site navigation. Data source: a single boolean field in `/lib/config/site.js`.**

#### Data Source

```js
// /lib/config/site.js
export const siteConfig = {
  available: true, // true | false
  availableFrom: "June 2026", // human-readable — shown when available: true
  availableFor: [
    // types of work currently open to
    "Full-time roles",
    "Contract projects",
    "Technical consulting",
  ],
};
```

#### Rendering Logic

```js
// Renders when siteConfig.available === true
// Renders nothing when siteConfig.available === false
// No "currently unavailable" state — simply absent when false
```

#### Placement

| Location            | Treatment                                                                 |
| ------------------- | ------------------------------------------------------------------------- |
| Projects index hero | Green dot + "Available for work · [availableFrom]" — below the subheading |
| Site navigation     | Green dot + "Available" — right side of nav, subtle                       |

#### Consequences

- ✅ Zero ongoing maintenance cost — one boolean field update
- ✅ High signal at the highest-intent moment on the site
- ✅ Renders nothing when unavailable — no awkward unavailable state
- ⚠️ `availableFrom` and `availableFor` must be kept current — stale availability information damages credibility

---

### DEC-030 — Currently Building Callout

**Date:** 2026
**Status:** `Accepted`
**Area:** UX / Data

#### Context

Returning visitors to the projects index have already seen the full project grid. A "currently building" signal gives them a reason to return and creates a sense of active engineering momentum.

#### Decision

**A "Currently building" callout renders above the project grid when a project record has `currentlyBuilding: true`. It renders as a single terse line — not a full card. One project carries this flag at a time.**

#### Schema Addition

```js
currentlyBuilding: false,  // boolean — only one project true at a time
```

#### Rendering

```js
// Automatic — page.jsx finds the project where currentlyBuilding === true
// Renders: "Currently building → [project title]"
// Links directly to the project case study
// Renders nothing if no project has currentlyBuilding: true
```

#### Consequences

- ✅ Gives returning visitors a reason to come back
- ✅ Signals active engineering momentum — portfolio is live
- ⚠️ Only one project should have `currentlyBuilding: true` at a time — the schema does not enforce this, discipline in the data does
- ⚠️ If nothing is actively being built, leave all fields false — callout simply does not render

---

### DEC-031 — Conditional UI Pattern: Build Now, Activate by Data

**Date:** 2026
**Status:** `Accepted`
**Area:** Architecture

#### Context

Multiple Phase 3 features have trigger conditions — they should not render until the data justifies them. The original approach deferred implementation to a future session. The amended approach builds everything now with server-side condition checks that activate UI automatically.

#### Decision

**All conditionally-rendered features are built in Phase 3. Activation is governed by server-side data checks in `page.jsx`. When data meets the condition, the UI appears. When it does not, the UI is absent — no empty states, no placeholders.**

#### Condition Check Pattern

```js
// page.jsx — all checks server-side, zero client JS
const condition = evaluateCondition(data);
// Passed as prop to child components
// Component renders feature when condition === true
// Component renders nothing when condition === false
```

All condition functions live in `/lib/utils/projects.js` — not inline in `page.jsx`.

#### Full Condition Registry

See Quick Reference table in Section 2 of this file.

#### Consequences

- ✅ No future implementation sessions for conditionally-rendered features
- ✅ Portfolio evolves automatically as the project index grows
- ✅ All condition logic centralised in `/lib/utils/projects.js`
- ⚠️ Every new conditionally-rendered feature must be added to the Condition Registry in this file and in Section 2
- ⚠️ Condition functions must be maintained in sync with the data schema

---

### DEC-032 — Demo and Repository URL Fields in Project Schema

**Date:** 2026
**Status:** `Accepted`
**Area:** Data

#### Context

The project schema carried no URL fields. Case study pages had no way to surface live demos or source repositories even when they exist. When a project reaches live status, the links should appear automatically without a template change.

#### Decision

**Add two optional URL fields to the project schema: `demoUrl` and `repoUrl`. When present, they render as `ghost` variant `Button` components in the case study hero metadata row. When absent, nothing renders.**

#### Schema Addition

```js
demoUrl: "",    // Optional — live deployment URL. Renders when non-empty
repoUrl: "",    // Optional — repository URL. Renders when non-empty
```

#### Rendering Logic

```js
{
  project.demoUrl && (
    <Button variant="ghost" href={project.demoUrl} external>
      Live Demo
    </Button>
  );
}
{
  project.repoUrl && (
    <Button variant="ghost" href={project.repoUrl} external>
      Repository
    </Button>
  );
}
```

#### Security Requirement

External links must render with `target="_blank"` and `rel="noopener noreferrer"` — both are security requirements, not preferences.

#### Consequences

- ✅ Demo and repo links appear automatically when fields are populated
- ✅ No template change required when a WIP project goes live
- ✅ Both fields are optional — no project blocked from shipping
- ⚠️ URLs must be verified as live before populating — a broken demo link damages credibility
- ⚠️ External links must include `rel="noopener noreferrer"` — security requirement

---

### DEC-033 — Challenges and Solutions Section

**Date:** 2026
**Status:** `Accepted`
**Area:** UX / Data

#### Context

Problem-solving approach — one of the highest-signal attributes for a technical evaluator — is distributed across the `constraints` and `decisions` prose fields. It is present but not immediately scannable. A dedicated Challenges and Solutions section surfaces this signal in a structured, faster-to-scan format.

#### Relationship to DEC-017

DEC-017 established flat vertical stack rendering — no progressive disclosure, no accordion. The Challenges and Solutions section is consistent: it renders as a flat numbered list. DEC-017 is not amended by this entry.

#### Decision

**Add a dedicated Challenges and Solutions section to the case study page. Schema addition: a `challenges` array on each project record. Rendering: flat numbered list — RSC.**

#### Schema Addition

```js
challenges: [
  {
    challenge:  "",   // The specific problem encountered
    resolution: "",   // How it was resolved — concrete, not generic
  },
  // 3–5 entries maximum per project
],
```

#### Visual Pattern

```
Challenges & Solutions

01  [Challenge statement]
    [Resolution — muted text, one to two sentences]

02  [Challenge statement]
    [Resolution — muted text, one to two sentences]
```

#### Content Standard

- Minimum 3 entries, maximum 5 per project
- Challenge statements are specific — not "performance was slow" but "pgvector queries exceeded 800ms on the document corpus"
- Resolutions are concrete — what was done, not that it was fixed
- Entries must not duplicate content already in the prose fields — structured extraction, not repetition

#### Section Placement

```
Six prose sections (Problem → Outcome)
↓
Challenges and Solutions    ← this section
↓
Testimonial
↓
Next / Previous navigation
```

#### Consequences

- ✅ Problem-solving approach is immediately scannable
- ✅ RSC — no client boundary introduced
- ✅ Content discipline enforced by the 3–5 entry limit
- ⚠️ If `challenges` array is empty or absent, the section does not render
- ⚠️ Challenges must not duplicate constraints or decisions prose

---

### DEC-034 — Sticky Sidebar Outline on Case Study Pages

**Date:** 2026
**Status:** `Accepted`
**Area:** UX / Architecture

#### Context

The case study page is intentionally long-form. A sticky sidebar outline — visible on wider viewports — surfaces the section structure and highlights the active section as the user scrolls. This requires `use client` for scroll position tracking.

#### Use Client Justification

Scroll position tracking cannot be replicated server-side. The sidebar outline is non-functional without it — a static list with no active state would add visual noise without navigation value. The client boundary is strictly scoped to the sidebar component. All case study content remains RSC.

#### Decision

**`StickyOutline` is a client component scoped to wide viewports only (1024px+). It renders the case study section list and highlights the active section via `IntersectionObserver`. Hidden on mobile and tablet.**

#### Implementation

```js
// features/projects/StickyOutline/StickyOutline.jsx
"use client";
// IntersectionObserver tracks section visibility
// Active section highlighted via accent token
// Renders only at lg+ breakpoint via CSS
// Sections: Problem · Constraints · Architecture · Decisions
//           Tradeoffs · Outcome · Challenges · [Testimonial if present]
```

#### Layout Impact

```
[Wide viewport]
Sidebar (sticky, left)  |  Main content (right, 65% width)
StickyOutline           |  Hero
                        |  Six prose sections
                        |  Challenges & Solutions
                        |  Testimonial
                        |  Next / Previous

[Mobile / Tablet]
Sidebar absent — main content full width
```

#### Consequences

- ✅ Long-form navigation provided on wide viewports
- ✅ Client boundary strictly scoped — case study content stays RSC
- ✅ `IntersectionObserver` is performant — no scroll event listeners
- ⚠️ First `use client` on the case study page — any future client component here requires the same justification standard
- ⚠️ Section IDs must be consistent between RSC content and the outline — anchor ID generation must be centralised
- ⚠️ `StickyOutline` must be visually subtle — it navigates, it does not compete with content

---

### DEC-035 — Next/Previous Case Study Navigation

**Date:** 2026
**Status:** `Accepted`
**Area:** UX / Architecture

#### Context

Evaluators who finish reading a case study face a navigation decision: return to the index or navigate away. A Next/Previous strip at the bottom keeps evaluators inside the projects system without requiring a return trip to the index.

#### Decision

**A Next/Previous navigation strip renders at the bottom of every case study page — below the testimonial, above the footer. Computed from `ALL_PROJECTS` sorted by index at build time. RSC.**

#### Implementation

```js
// app/projects/[slug]/page.jsx
const allProjects = getAllProjects();
const currentIndex = allProjects.findIndex((p) => p.slug === params.slug);
const previous = allProjects[currentIndex - 1] ?? null;
const next = allProjects[currentIndex + 1] ?? null;
```

#### Visual Pattern

```
← Previous                          Next →
GradeForge                          AttendIQ
EdTech / Academic Tools             EdTech / Productivity
```

#### Edge Cases

| Condition                   | Behaviour                                                 |
| --------------------------- | --------------------------------------------------------- |
| First project — no previous | Previous slot renders nothing — no empty state            |
| Last project — no next      | Next slot renders nothing — layout adjusts to single item |
| Only one project            | Neither slot renders                                      |

#### Consequences

- ✅ Evaluators stay in the projects system — index round-trip eliminated
- ✅ RSC — no client boundary, no JS overhead
- ✅ Edge cases handled cleanly — no empty UI states
- ⚠️ Navigation order is index order in `projects.js` — reordering projects changes navigation adjacency

---

### DEC-036 — Copy Anchor Links on Prose Section Labels

**Date:** 2026
**Status:** `Accepted`
**Area:** UX / Architecture

#### Context

A recruiter or hiring manager may want to share a direct link to a specific case study section with a colleague. Without anchor IDs and a copy mechanism, this is not possible.

#### Decision

**Each prose section label gets an auto-generated anchor ID rendered server-side. A copy icon appears on hover via CSS — no JS required for the hover state. The clipboard write interaction requires a minimal `use client` scope, isolated to an `AnchorCopy` component that wraps only the copy icon button.**

#### Anchor IDs

```
/projects/scholarhive#problem
/projects/scholarhive#constraints
/projects/scholarhive#architecture
/projects/scholarhive#decisions
/projects/scholarhive#tradeoffs
/projects/scholarhive#outcome
/projects/scholarhive#challenges
```

#### Implementation

```js
// AnchorCopy.jsx — use client, scoped to copy icon only
"use client";
// navigator.clipboard.writeText(canonicalUrl + '#' + sectionId)
// Renders a transient "Copied" confirmation — 2 seconds, then resets
// Must handle clipboard API absence gracefully
```

#### Hover Pattern

```
Problem  #   ← copy icon, visible on hover only via CSS
```

#### Client Boundary Scope

The `use client` directive applies only to `AnchorCopy` — the copy icon button. The section label, heading, and anchor ID are all RSC. The hover reveal is CSS-only.

#### Consequences

- ✅ Direct section linking enabled — shareable, precise
- ✅ Client boundary is minimum viable — clipboard write only
- ✅ Hover reveal is CSS — no JS for the show/hide interaction
- ✅ Anchor IDs are RSC-rendered — stable, indexable by search engines
- ⚠️ Anchor IDs must be stable across rebuilds — slugified section names, not positional indexes
- ⚠️ `AnchorCopy` must handle clipboard API absence gracefully — not all contexts support `navigator.clipboard`

---

## 4. Proposed Amendments

> No amendments currently proposed.

Use this section to formally propose changes to any Phase 3 decision before acting on it.

---

## 5. Superseded Decisions

> None at this time.

---

## 6. Deprecated Decisions

> None at this time.
