# DECISIONS-PHASE2.md — Phase 2 Decisions: Home Page

**Project:** alexshedrach.dev
**Version:** 2.0.0
**Last Updated:** 2026
**Classification:** Phase 2 Engineering Memory — Load When Working on Home Page or Design System

---

## 0. About This File

This file contains decisions made during **Phase 2 — Home Page** development. It covers the Hero, Design System extensions, page sections added during build, and the data strategy that bridges Phase 2 and Phase 3.

**Prerequisites:** Load `DECISIONS.md` and `DECISIONS-CORE.md` before this file. Core decisions govern everything in this file.

**Scope:** DEC-006 to DEC-015

For the complete decision index and protocol, see `DECISIONS.md`.
For projects system decisions, see `DECISIONS-PHASE3.md`.

---

## 1. Decision Records

---

### DEC-006 — ProjectCard Scope: Design System vs Feature

**Date:** 2026
**Status:** `Accepted`
**Area:** Architecture

#### Context

The Home page Phase 2 "Selected Systems" section requires a `ProjectCard` component. `ProjectCard` is also listed as a Phase 3 requirement for the projects index. The question is whether to build it now as a shared Design System primitive or defer a proper abstraction until Phase 3 forces it.

#### Options Considered

| Option                                        | Summary                                                                 |
| --------------------------------------------- | ----------------------------------------------------------------------- |
| Build in `components/ui/` now                 | Single shared primitive serving both Home and Projects — no duplication |
| Build home-scoped variant in `features/home/` | Faster now, requires abstraction and migration when Phase 3 lands       |

#### Decision

**`ProjectCard` lives in `components/ui/` as a shared Design System primitive.** Built once with an API designed to serve both the Home summary view and the Phase 3 project index without breaking changes.

#### Reasoning

- Building a home-scoped variant creates deliberate duplication that must be undone in Phase 3 — technical debt by design
- The component API can be designed now to accept the minimal props needed for Home, with Phase 3 props added non-breakingly later
- Design System principle: reusable primitives live in `components/ui/` — page-scoped variants are an anti-pattern unless the use cases genuinely diverge

#### Consequences

- ✅ No duplication between Phase 2 and Phase 3
- ✅ Phase 3 composes from an already-stable component
- ✅ Design System boundary stays clean
- ⚠️ API must be designed carefully upfront — it will serve two contexts
- ⚠️ Phase 3 props not yet needed must be anticipated but not over-engineered

---

### DEC-007 — Hero Viewport Treatment

**Date:** 2026
**Status:** `Accepted`
**Area:** UX / Layout

#### Context

The spec requires the primary credibility signal above the fold with no scroll required. Two valid layout interpretations exist: `min-h-screen` (full viewport lockup) or a content-height hero that is sufficiently prominent on typical viewports without being locked to screen height.

#### Options Considered

| Option                         | Strengths                          | Weaknesses                                                         |
| ------------------------------ | ---------------------------------- | ------------------------------------------------------------------ |
| `min-h-screen` full lockup     | Strongest above-the-fold guarantee | Creates layout dependency on nav height — fragile across viewports |
| Content-height with prominence | Flexible, viewport-agnostic        | Relies on content weight and typography — less controlled          |

#### Decision

**Content-height hero with a prominence guarantee.** The hero section uses typography scale, spacing, and visual weight from the Design System to ensure the credibility signal reads immediately — without coupling the layout to `min-h-screen`.

#### Reasoning

- `min-h-screen` creates a hard dependency on nav height that breaks across device heights and requires defensive CSS to maintain
- The spec requires the signal to be above the fold — it does not require a full viewport lockup to achieve it
- Strong typography hierarchy and spacing achieve the same perceptual result with more layout flexibility
- Content-height scales correctly across mobile, tablet, and desktop without viewport-specific overrides

#### Consequences

- ✅ Layout is viewport-agnostic and resilient across device sizes
- ✅ No nav height dependency
- ✅ Easier to maintain and extend
- ⚠️ Prominence relies entirely on typography and spacing execution — Design System tokens must be applied with discipline
- ⚠️ Must be reviewed on real device sizes before Phase 2 is marked done

---

### DEC-008 — Hero Animation Client Boundary

**Date:** 2026
**Status:** `Accepted`
**Area:** Rendering

#### Context

`animations.css` defines `hero-animate` and `hero-fade-up` classes. CSS-only staggered entrance animations are achievable without a client component using `animation-delay` on static class names. However if any animation depends on scroll position, viewport entry, or runtime state, `use client` is required and `HeroSection` becomes a Client Component.

#### Options Considered

| Option                           | Summary                                                             |
| -------------------------------- | ------------------------------------------------------------------- |
| CSS-only staggered entrance      | Static `animation-delay` values on class names — no client boundary |
| Client wrapper with `use client` | Enables scroll-aware and state-driven animation — adds client JS    |

#### Decision

**`HeroSection` is a React Server Component.** Animations are CSS-only using `animation-delay` staggered on static class names from `animations.css`. No scroll-aware or runtime-state animation is introduced on the hero.

#### Reasoning

- Server-first rendering is a closed architectural decision — client boundaries require justification, not the reverse
- CSS-only staggered entrance achieves the visual intent of the hero animation without shipping any client JS for the purpose
- Scroll-aware animation on the hero is decorative — it does not explain hierarchy or state, which is the only permitted use of motion per `AI_CONTEXT.md`
- The performance budget is protected by keeping the hero RSC

#### Consequences

- ✅ Hero ships zero client JS
- ✅ Server-first rendering principle upheld
- ✅ Animation is performant — pure CSS, no runtime overhead
- ⚠️ Animation is entrance-only — no scroll-triggered or interactive motion on the hero without a new DECISIONS.md amendment
- ⚠️ Stagger timing must be handled via static `animation-delay` values in the CSS — dynamic stagger requires revisiting this decision

---

### DEC-009 — Home Page Data Strategy

**Date:** 2026
**Status:** `Accepted`
**Area:** Data Strategy

#### Context

The Home "Selected Systems" section requires real project data. Phase 3 is pending and the full case study content — decisions, constraints, outcomes — does not yet exist as structured data. The behavioral contract prohibits placeholder logic, but shipping Phase 2 without any project data makes the section non-functional.

#### Options Considered

| Option                                  | Summary                                                                      |
| --------------------------------------- | ---------------------------------------------------------------------------- |
| Wait for Phase 3 content                | Home page delayed until case study copy is written                           |
| Stub data with lorem ipsum              | Violates behavioral contract — prohibited                                    |
| Define schema now with structured stubs | Correct shape, typed fields, real field names — content populated in Phase 3 |

#### Decision

**Define the project data schema now as structured objects in `/lib/data/projects.js`.** Entries are architecturally complete — correct shape, all required fields present, typed correctly — but content fields contain minimal placeholder values clearly marked as Phase 3 content stubs. No lorem ipsum. No untyped objects.

#### Data Schema

```js
// /lib/data/projects.js
export const projects = [
  {
    slug: "", // URL slug for /projects/[slug]
    title: "", // Project name
    summary: "", // One-sentence problem statement — Phase 3
    domain: "", // Problem domain / industry
    constraint: "", // Key constraint navigated — Phase 3
    outcome: "", // Primary measurable outcome — Phase 3
    stack: [], // Technology array
    status: "wip", // "live" | "wip" | "archived" — per DEC-015
    featured: true, // Whether shown on Home
    currentlyBuilding: false, // Per DEC-030
    demoUrl: "", // Optional — per DEC-032
    repoUrl: "", // Optional — per DEC-032
    metrics: [], // Optional — per DEC-018 amendment
    challenges: [], // Optional — per DEC-033
    testimonial: null, // Optional — per DEC-022
  },
];
```

#### Reasoning

- Waiting for Phase 3 content blocks Phase 2 delivery unnecessarily — the layout and component work can be completed and reviewed with stub data in place
- Lorem ipsum violates the behavioral contract and produces outputs that cannot be reviewed meaningfully
- Defining the schema now means Phase 3 content population requires no structural changes — only field values are updated
- This is a deliberate, logged tradeoff between delivery sequencing and content completeness — not a shortcut

#### Consequences

- ✅ Phase 2 ships without blocking on Phase 3 content
- ✅ Schema is correct and typed — Phase 3 is content-only work
- ✅ `ProjectCard` component API is validated against real data shape
- ⚠️ Content fields are stubs until Phase 3 — Home "Selected Systems" section is not content-complete at Phase 2 close
- ⚠️ Phase 3 prerequisite: all content fields must be populated before the Projects page ships

---

### DEC-010 — Writing / Blog Section Added as Core Section

**Date:** 2026
**Status:** `Accepted`
**Area:** Product Strategy

#### Context

The original spec and roadmap did not include a writing or blog section. After architectural review, a writing section was identified as a high-value addition that code alone cannot replicate — it demonstrates both depth of understanding and communication ability, two signals senior engineering evaluators specifically look for.

#### Options Considered

| Option                              | Summary                                                    |
| ----------------------------------- | ---------------------------------------------------------- |
| Exclude writing entirely            | Portfolio remains code-focused only                        |
| Add as a Lab sub-section            | Writing buried under experimentation — wrong signal        |
| Add as a dedicated route `/writing` | First-class section with its own page and content strategy |

#### Decision

**Add `/writing` as a dedicated, first-class portfolio section.** Writing is not a blog in the traditional sense — it is a technical communication layer that extends the case study depth already established in `/projects`.

#### Content Direction

Posts are technical explanations rooted in real project decisions:

| Post Topic                                                    | Source Project        |
| ------------------------------------------------------------- | --------------------- |
| Why I chose a modular monolith over microservices             | Marketplace build     |
| Double-entry bookkeeping explained for engineers              | Fintech project       |
| The real architecture of Nigerian university CGPA calculation | University system     |
| Building offline-first apps for unreliable connectivity       | Offline-first project |

#### Reasoning

- Writing proves understanding — you cannot clearly explain what you do not deeply understand
- Communication ability is a senior engineer signal — demonstrates ability to work with non-technical stakeholders
- Each post indexes on search engines, compounding portfolio reach over time without additional effort
- Topics map directly from existing projects — no content invented from scratch, just explained at a different depth
- A writing section differentiates from portfolios that are purely visual

#### Consequences

- ✅ Portfolio communicates at two levels — code and communication
- ✅ Writing compounds SEO reach over time
- ✅ Differentiates from purely visual portfolios
- ⚠️ Requires content investment — posts must meet the writing standard in `PORTFOLIO_V2_SPEC.md Section 8`
- ⚠️ Do not launch the section empty — minimum one published post before `/writing` is linked in navigation

---

### DEC-011 — About Teaser Section Added to Home

**Date:** 2026
**Status:** `Accepted`
**Area:** UX / Product

#### Context

Phase 2 Home page build revealed a navigation gap — visitors who resonated with the hero and project work had no lightweight path to understand the person and engineer behind the work without committing to a full `/about` page visit. A teaser section on the Home page bridges this gap within the same scroll context.

#### Options Considered

| Option                        | Summary                                                          |
| ----------------------------- | ---------------------------------------------------------------- |
| Omit — let /about stand alone | Visitors must navigate away to learn more — higher drop-off risk |
| Add About Teaser to Home      | Brief identity signal on Home with a clear path to /about        |

#### Decision

**Add an About Teaser section to the Home page.** The section is a compressed identity signal — not a biography — that creates a human connection point and routes interested visitors to `/about`.

#### Reasoning

- The 60-second evaluation window requires credibility signals at multiple levels — engineering depth via projects, human context via the About Teaser
- A teaser creates continuity across the page without duplicating `/about` content
- Keeps the Home page self-contained for visitors who do not navigate further

#### Consequences

- ✅ Home page communicates at two levels — engineering depth and human identity
- ✅ Creates a clear navigation path to `/about`
- ⚠️ Content must be distinct from `/about` — compressed signal only, no duplication

---

### DEC-012 — Resource Callout Section Added to Home

**Date:** 2026
**Status:** `Accepted`
**Area:** UX / Product

#### Context

During Phase 2 build a Resource Callout section was identified as a high-value addition to the Home page. The portfolio's audience includes developers exploring architecture ideas — a secondary audience defined in `PORTFOLIO_V2_SPEC.md Section 2`. A resource callout serves this audience directly while reinforcing the portfolio's positioning as a knowledge-sharing engineering system.

#### Options Considered

| Option                                      | Summary                                                         |
| ------------------------------------------- | --------------------------------------------------------------- |
| Omit — resources belong in /lab or /writing | Cleaner Home page, secondary audience underserved               |
| Add Resource Callout to Home                | Surfaces value immediately, reinforces engineering depth signal |

#### Decision

**Add a Resource Callout section to the Home page.** The section highlights a specific resource, writing piece, or tool that demonstrates engineering thinking — not a generic links list.

#### Reasoning

- Resources on the Home page serve the secondary developer audience without requiring navigation
- A callout — singular, intentional — is high-signal. A links list is noise
- Reinforces the portfolio's differentiation from generic personal sites

#### Consequences

- ✅ Secondary developer audience served on the Home page
- ✅ Reinforces engineering depth positioning
- ⚠️ Must remain a single intentional callout — not a links section
- ⚠️ Content must be kept current — a stale resource callout signals neglect

---

### DEC-013 — Hire Me / Contact Section Added to Home

**Date:** 2026
**Status:** `Accepted`
**Area:** UX / Product

#### Context

The original spec placed contact exclusively at `/contact`. During Phase 2 build it became clear that visitors who complete the Home page scroll have already formed a credibility impression and are at peak intent — the highest-value conversion moment on the site. Routing them away to `/contact` at that moment introduces unnecessary friction.

#### Options Considered

| Option                      | Summary                                                   |
| --------------------------- | --------------------------------------------------------- |
| Contact at /contact only    | Clean separation — lower Home page conversion             |
| Add Hire Me section to Home | Captures peak-intent visitors without navigation friction |

#### Decision

**Add a Hire Me / Contact section at the bottom of the Home page.** This is a conversion section — not a form — that communicates what kind of work is welcome and provides a direct low-friction path to reaching out.

#### Home Page Section Order — Final

```
Hero
↓
Selected Systems
↓
Engineering Principles
↓
Proof of Work
↓
About Teaser         ← DEC-012
↓
Resource Callout     ← DEC-013
↓
Hire Me / Contact    ← DEC-014
```

#### Reasoning

- Peak intent occurs at the end of the Home page scroll — highest-value conversion moment on the site
- Routing peak-intent visitors away to `/contact` loses momentum
- The section is not a duplicate of `/contact` — it is a CTA with enough context to qualify intent before the visitor commits to writing a message
- `/contact` remains the full entry point — this section feeds into it

#### Consequences

- ✅ Peak-intent visitors converted without navigation friction
- ✅ Home page has a complete narrative arc — identity, work, human context, resources, call to action
- ⚠️ Must not duplicate `/contact` — CTA and intent framing only, no full form on the Home page
- ⚠️ Copy must be specific about what kind of work is welcome — generic "get in touch" language is prohibited

---

### DEC-014 — Status Field Canonicalisation

**Date:** 2026
**Status:** `Accepted`
**Area:** Data

#### Context

All six project records in `projects.js` carried `status: "in-progress"`. `ProjectCard.STATUS_CONFIG` maps `"live" | "wip" | "archived"` only. The mismatch caused all six projects to silently render no status badge. One side was wrong — the enum spec or the data records.

#### Options Considered

| Option                               | Summary                                                 |
| ------------------------------------ | ------------------------------------------------------- |
| Update data records to `"wip"`       | Data conforms to the documented enum — enum is the spec |
| Add `"in-progress"` to STATUS_CONFIG | Enum expands to accommodate the data error              |

#### Decision

**Update all six project records from `"in-progress"` to `"wip"`.** The enum is the spec. The data records were the error.

#### Reasoning

- `"in-progress"` is vague as a display label — `"wip"` is the established, documented term
- The enum in `STATUS_CONFIG` was the intentional design decision — data records that deviate from it are incorrect, not the enum
- Expanding the enum to accommodate a data error sets a precedent for the enum growing to cover mistakes rather than data conforming to the contract

#### Valid Status Values

```js
"live"; // Deployed and publicly accessible
"wip"; // Work in progress — actively being built
"archived"; // Completed but no longer maintained
```

`"in-progress"` is not a valid status value. Any record carrying it is a data error.

#### Consequences

- ✅ All six projects render status badges correctly
- ✅ Enum remains clean — three states only
- ⚠️ Any future project records must use `"live"` | `"wip"` | `"archived"` — no other values are valid

---

## 2. Proposed Amendments

> No amendments currently proposed.

Use this section to formally propose changes to any Phase 2 decision before acting on it.

---

## 3. Superseded Decisions

> None at this time.

---

## 4. Deprecated Decisions

> None at this time.
