# DECISIONS-PHASE5.md — Phase 5 Decisions: Lab

**Project:** alexshedrach.dev
**Version:** 2.0.0
**Last Updated:** 2026
**Classification:** Phase 5 Engineering Memory — Load When Working on Lab Page or Lab Entries

---

## 0. About This File

This file contains decisions made during **Phase 5 — Lab** development. It covers individual entry routing, the lab data schema, `LabCard` component scope, and `SectionBackground` variant assignment across all lab surfaces.

**Prerequisites:** Load `DECISIONS.md` and `DECISIONS-CORE.md` before this file. For component scope decisions, cross-reference DEC-006 (ProjectCard scope) and DEC-016 (CaseStudyLayout location) in `DECISIONS-PHASE2.md` and `DECISIONS-PHASE3.md` respectively — the lab decisions follow the same reasoning chain.

**Scope:** DEC-040 to DEC-043

**Numbering note:** The lab planning session originally proposed DEC-037 through DEC-040. Those IDs were already assigned to Phase 6 Contact decisions (DEC-037 to DEC-039) before this file was created. The lab decisions are renumbered DEC-040 through DEC-043 to preserve index integrity. The master `DECISIONS.md` index reflects the correct numbering.

For the complete decision index and protocol, see `DECISIONS.md`.

---

## 1. Quick Reference — Lab Page Architecture

```
Lab System
│
├── /lab                          Index — surfaces and filters all entries
│   ├── Hero (aurora variant)     DEC-043
│   ├── Entry type / status       DEC-040, DEC-041
│   └── LabCard grid              DEC-042, DEC-043
│
└── /lab/[slug]                   Detail — full entry depth  DEC-040
    ├── Hero (editorial variant)  DEC-043
    │   ├── Entry type eyebrow
    │   ├── Title
    │   ├── Summary
    │   ├── Tags
    │   ├── Status badge
    │   ├── Year
    │   ├── sourceUrl (conditional)   DEC-041
    │   ├── demoUrl (conditional)
    │   └── repoUrl (conditional)
    │
    ├── Exploration section        DEC-041
    ├── Findings section           DEC-041
    ├── Production Influence       DEC-041
    └── (No Next/Previous — lab entries are non-sequential)
```

---

## 2. Quick Reference — Lab Conditional UI

| Feature                      | Condition                      | Checked In                                   |
| ---------------------------- | ------------------------------ | -------------------------------------------- |
| `sourceUrl` reference link   | `entry.sourceUrl` non-empty    | Lab entry hero                               |
| `demoUrl` link               | `entry.demoUrl` non-empty      | Lab entry hero                               |
| `repoUrl` link               | `entry.repoUrl` non-empty      | Lab entry hero                               |
| Production influence section | Always renders                 | Lab entry page — null state shown explicitly |
| Status: abandoned treatment  | `entry.status === "abandoned"` | `LabCard` + entry hero                       |
| Entry type indicator         | Always present                 | `LabCard` — no entries without a type        |
| Featured entries on `/`      | `entry.featured === true`      | Home page — Phase 8 or Lab Teaser section    |

---

## 3. Resolved Content Prerequisite

**First live lab entry:** `offline-sync-conflict-resolution`

| Field  | Value                                                   |
| ------ | ------------------------------------------------------- |
| slug   | `offline-sync-conflict-resolution`                      |
| title  | `Conflict Resolution Strategies for Offline-First Sync` |
| type   | `experiment`                                            |
| status | `complete`                                              |

The Phase 5 Definition of Done required at least one complete, real lab entry before `/lab` linked in navigation. That prerequisite is resolved in `src/lib/data/lab.js`.

---

## 4. Definition of Done

The Phase 5 DoD extends the three-item list in `ROADMAP.md`. A lab entry is complete when all of the following are true. The phase is complete when all entries meet this standard.

### Entry Level

- [ ] Content is real — no stubs, no placeholder copy
- [ ] All three narrative fields populated: `exploration`, `findings`, `influenced`
- [ ] `influenced` null state renders explicitly — "No production influence" or equivalent, not a missing section
- [ ] `status: "abandoned"` renders with distinct muted visual treatment — not hidden
- [ ] Entry type indicator renders on the `LabCard`
- [ ] `sourceUrl` renders as a reference link in the entry hero when populated
- [ ] `demoUrl` and `repoUrl` render conditionally — absent when empty

### Page Level

- [ ] `/lab/[slug]` routes resolve correctly for all entry slugs
- [ ] `/lab` index hero copy explicitly frames the lab as distinct from `/projects`
- [ ] `SectionBackground` variants match DEC-043 across all surfaces
- [ ] Zero raw Tailwind in page files
- [ ] `LabCard` composes from Design System tokens only

### Release Level

- [ ] At least one complete entry is live before `/lab` links in navigation
- [ ] `aurora` variant confirmed in `SECTION_BACKGROUND_VARIANTS` before hero is built
- [ ] All four decisions in this file are logged in the master index

---

## 5. Decision Records

---

### DEC-040 — Individual Lab Entry Routes

**Date:** 2026
**Status:** `Accepted`
**Area:** Architecture

#### Context

The spec defines `/lab` but is silent on `/lab/[slug]`. This is the most consequential architectural gap in Phase 5. The routing decision constrains what lab entries can contain and how much depth they can carry. It must be resolved before any component is built.

#### Options Considered

| Option                             | Consequence                                                                                                                                                                                                    |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Index-only — all content on `/lab` | Entries are constrained to card-length content. No space for deep technical writeups. The "what was learned" requirement from `PORTFOLIO_V2_SPEC.md` becomes a truncated paragraph. Lab fails its own purpose. |
| Index + `/lab/[slug]` per entry    | Full depth per entry. Lab entries carry the same narrative weight as case studies without polluting `/projects`. Matches the pattern already established in the projects system.                               |

#### Decision

**`/lab/[slug]` individual entry routes are implemented.** The lab follows the same two-surface pattern as the projects system: the index surfaces and filters entries, the detail page delivers depth.

#### Routing Structure

```
/lab                    Entry index — grid of LabCards
/lab/[slug]             Individual entry — full narrative depth
```

Both routes are React Server Components. Dynamic routing via `generateStaticParams` — same implementation pattern as `/projects/[slug]`.

#### Reasoning

- An experiment with real depth — a performance study, a framework exploration, a tool with documented findings — cannot be communicated in a card. Without individual routes, the Lab fails its own stated purpose
- The "what was learned" requirement in `PORTFOLIO_V2_SPEC.md` is only satisfiable with a full-page format. A card truncates. A page does not
- Mirroring the projects pattern is not accidental — it signals that lab entries are first-class content, not overflow
- Index-only architecture would force a content quality ceiling on every entry. That ceiling is too low for the audience

#### Consequences

- ✅ Lab entries carry full narrative depth — exploration, findings, production influence
- ✅ Architecture mirrors the projects system — consistent mental model for the evaluator
- ✅ Card length is not a constraint on content quality
- ✅ `generateStaticParams` pattern already established — no new routing concepts
- ⚠️ Each entry requires real content across all three narrative fields — the routing decision raises the content standard
- ⚠️ `/lab` index becomes a navigation surface, not a content surface — LabCard design must carry enough signal to earn the click to `/lab/[slug]`

---

### DEC-041 — Lab Entry Data Schema

**Date:** 2026
**Status:** `Accepted`
**Area:** Data

#### Context

No lab data schema exists. The projects schema took five decisions to stabilise across Phases 2 and 3. Defining the lab schema now — before any component is built — prevents mid-build amendments and ensures the first real entry can be used to validate the shape immediately.

#### Schema Decision

```js
// /lib/data/lab.js
export const labEntries = [
  {
    // Core identity
    slug: "", // URL slug for /lab/[slug]
    title: "", // Entry title
    summary: "", // One sentence — what was being explored
    year: "", // Year of the experiment

    // Classification
    type: "", // "experiment" | "tool" | "visualization" | "exploration"
    status: "", // "active" | "complete" | "abandoned"
    tags: [], // Tech stack / tools / concepts involved
    featured: false, // Whether surfaced on Home page or Lab teaser

    // Narrative — three required fields
    entry: {
      exploration: "", // What was being explored and why
      findings: "", // What was learned — including if the experiment failed
      influenced: "", // How it influenced production decisions
      // Empty string = no production influence (valid and expected)
    },

    // Optional links
    demoUrl: "", // Live demo — renders when non-empty
    repoUrl: "", // Repository — renders when non-empty
    sourceUrl: "", // Reference material — paper, post, or spec that prompted the experiment
    // Renders as a subtle reference link in the entry hero
  },
];
```

#### Type Values

| Value             | Meaning                                         |
| ----------------- | ----------------------------------------------- |
| `"experiment"`    | A hypothesis tested — outcome unknown at start  |
| `"tool"`          | A utility built for a specific purpose          |
| `"visualization"` | A visual representation of a concept or dataset |
| `"exploration"`   | Investigation of a technology, pattern, or idea |

#### Status Values

| Value         | Visual Treatment                                                             |
| ------------- | ---------------------------------------------------------------------------- |
| `"active"`    | Standard rendering — experiment in progress                                  |
| `"complete"`  | Standard rendering — experiment concluded                                    |
| `"abandoned"` | Muted rendering — not hidden. Documented dead ends are a credibility signal. |

#### The `influenced` Field

This field is architecturally important. It is the primary differentiator from `/projects` — lab entries do not require production outcomes. An empty `influenced` field is a valid and expected state. It renders explicitly as a null state — "No production influence" or equivalent. A missing section is not acceptable.

#### The `sourceUrl` Field

When an experiment was prompted by a paper, a specification, or another engineer's post, linking the source signals intellectual honesty and genuine curiosity — the idea was engaged with, not invented. Optional. Renders as a subtle reference link in the entry hero when populated.

#### `status: "abandoned"` as a Content Signal

An engineer who documents dead ends reads as more credible than one who only shows successes. The `abandoned` status is first-class — it renders with a distinct muted visual treatment on `LabCard` and in the entry hero. It is never hidden.

#### Reasoning

- The projects schema took five decisions to stabilise — a clean lab schema defined upfront eliminates that iteration cost
- The three narrative fields (`exploration`, `findings`, `influenced`) map directly to the three questions every lab entry must answer per `PORTFOLIO_V2_SPEC.md`
- `influenced` renders a null state rather than omitting the section — consistency across all entries, honest documentation of experiments without production impact
- `sourceUrl` is optional but logged at the schema level — it cannot be added per-entry without a schema decision

#### Consequences

- ✅ Schema is stable before any component is built — no mid-build amendments
- ✅ Three narrative fields enforce content completeness — no entry ships with missing sections
- ✅ `influenced` null state is explicit — honest documentation, consistent rendering
- ✅ `status: "abandoned"` is first-class — dead ends are credibility signals, not hidden failures
- ✅ `sourceUrl` enables intellectual honesty — sources acknowledged, not obscured
- ⚠️ `entry.influenced` empty string must render a null state — not a missing section. Implementation must handle this explicitly
- ⚠️ First real entry must be used to validate this schema during build — a stub entry cannot catch shape errors
- ⚠️ Only one project should carry `featured: true` on the lab index at a time — same discipline as `currentlyBuilding` in the projects schema

---

### DEC-042 — LabCard Component Location

**Date:** 2026
**Status:** `Accepted`
**Area:** Architecture

#### Context

`ProjectCard` lives in `components/ui/` per DEC-006 because it serves both the Home page and the Projects index. `LabCard` faces the same scoping question — and the same future multi-surface risk.

#### Options Considered

| Option                   | Rationale                                                                      |
| ------------------------ | ------------------------------------------------------------------------------ |
| `components/ui/LabCard/` | Shared primitive — usable on `/lab` index and potentially Home page Lab Teaser |
| `features/lab/LabCard/`  | Data-coupled, lab-domain only — same logic as DEC-016 for `CaseStudyLayout`    |

#### Decision

**`LabCard` lives in `components/ui/LabCard/` as a shared Design System primitive.**

#### Reasoning

- The Home page will surface 1–2 featured lab entries — either in Phase 8 (Advanced Differentiation) or as a Lab Teaser section added to Home. Building `LabCard` as a feature-scoped component would require extraction when that surface arrives — the same technical debt DEC-006 was written to prevent
- `ProjectCard` is the precedent: when a card serves two or more surfaces, it belongs in `components/ui/`
- `LabCard` is distinct from `CaseStudyLayout` (DEC-016) — `CaseStudyLayout` is tightly coupled to the six-field prose schema and will never render outside the projects domain. `LabCard` is a summary component with a stable, minimal API that can serve multiple surfaces
- The API can be designed now to serve both `/lab` index and Home page — Phase 8 or the Lab Teaser section adds a consumer without requiring a migration

#### Component API

```js
// components/ui/LabCard/LabCard.jsx

<LabCard
  slug="" // required — links to /lab/[slug]
  title="" // required
  summary="" // required — one sentence
  type="" // required — "experiment" | "tool" | "visualization" | "exploration"
  status="" // required — "active" | "complete" | "abandoned"
  tags={[]} // optional — renders tag badges
  year="" // optional
  featured={false} // optional — visual treatment for featured entries
/>
```

#### Consequences

- ✅ No duplication when the Home page surfaces lab entries
- ✅ Design System boundary stays clean — shared primitives in `components/ui/`
- ✅ API is designed once to serve multiple consumers — no future migration
- ✅ Consistent with DEC-006 precedent — card components that serve multiple surfaces belong in `components/ui/`
- ⚠️ API must be designed to serve both the `/lab` index and a potential Home page teaser — over-specialising it for the index creates the same problem DEC-006 solved
- ⚠️ `status: "abandoned"` must produce a visibly distinct rendering on the card — muted, not hidden

---

### DEC-043 — Lab SectionBackground Variant Assignment

**Date:** 2026
**Status:** `Accepted`
**Area:** UX / Design System

#### Context

DEC-020 covers `/projects` surfaces only. Lab surfaces need explicit variant assignment before build begins — per the pattern DEC-020 established. Unlogged variant choices become inconsistent as new pages are added.

#### Decision

| Surface                        | Variant     | Rationale                                                                                                     |
| ------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------- |
| `/lab` index hero              | `aurora`    | Distinct from projects (`mesh`) and editorial sections — signals experimental character. Lab is not projects. |
| `/lab` entry grid              | `minimal`   | Content competes with decorative backgrounds at this density                                                  |
| `/lab/[slug]` entry hero       | `editorial` | Lab detail pages are documentation, not identity surfaces — editorial matches the evidence character          |
| `/lab/[slug]` content sections | `minimal`   | Consistent with case study prose treatment in DEC-020                                                         |

#### Blocking Prerequisite

**The `aurora` variant must exist in `SECTION_BACKGROUND_VARIANTS` before the `/lab` hero is built.** This is the same blocking prerequisite DEC-020 noted for `mesh` on the case study hero. Verify before beginning the hero implementation. If `aurora` is absent, add it before proceeding — do not build the hero against a variant that does not exist.

#### Reasoning

- `aurora` on the `/lab` hero creates deliberate visual distinction from `/projects` — a visitor who has seen both sections immediately understands they are different kinds of content
- `mesh` is reserved for identity hero surfaces (case studies, projects index hero per DEC-020) — using it on the lab hero blurs that distinction
- `editorial` on `/lab/[slug]` matches the evidence and documentation character of lab entry content — consistent with its use on the projects index hero (DEC-020)
- `minimal` on dense content areas is established pattern — no deviation without a formal amendment

#### Variant Assignment Map — Full System After This Entry

| Surface                            | Variant       | Decision |
| ---------------------------------- | ------------- | -------- |
| Home hero                          | TBD — Phase 2 | —        |
| `/projects` index hero             | `editorial`   | DEC-020  |
| `/projects` grid section           | `minimal`     | DEC-020  |
| `/projects/[slug]` case study hero | `mesh`        | DEC-020  |
| `/projects/[slug]` prose sections  | `minimal`     | DEC-020  |
| `/lab` index hero                  | `aurora`      | DEC-043  |
| `/lab` entry grid                  | `minimal`     | DEC-043  |
| `/lab/[slug]` entry hero           | `editorial`   | DEC-043  |
| `/lab/[slug]` content sections     | `minimal`     | DEC-043  |
| `/contact` hero                    | `editorial`   | DEC-037  |
| `/contact` form grid               | none          | DEC-037  |

#### Consequences

- ✅ Visual language is distinct across all three primary sections — projects, lab, contact
- ✅ Variant assignment is logged — future pages reference this map without re-litigating
- ✅ `aurora` signals experimental character — consistent with the Lab's purpose
- ⚠️ `aurora` variant must exist in `SECTION_BACKGROUND_VARIANTS` before Step 1 — blocking prerequisite
- ⚠️ Any future lab surface that deviates from this variant pattern requires a new `DECISIONS.md` entry

---

## 6. Proposed Amendments

> No amendments currently proposed.

---

## 7. Superseded Decisions

> None at this time.

---

## 8. Deprecated Decisions

> None at this time.
