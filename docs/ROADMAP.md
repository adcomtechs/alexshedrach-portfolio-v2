# ROADMAP.md — Execution Plan

**Project:** alexshedrach.dev
**Version:** 2.1.0
**Last Updated:** 2026
**Classification:** Execution Plan — AI Must Load Before Every Session

---

## 0. How to Use This Document

This is the **authoritative execution plan** for Portfolio V2. It defines what gets built, in what order, and to what standard of completion.

### AI Protocol

Before every session, the AI must:

1. Read the Phase Index — identify current phase and status
2. Identify the next incomplete task within the active phase
3. Prioritize unfinished roadmap items — never suggest new features ahead of incomplete ones
4. Flag any task that requires a `DECISIONS.md` entry before implementation begins
5. Update task status when work is completed and flag it for commit

### Document Relationships

| Document               | Relationship                                                           |
| ---------------------- | ---------------------------------------------------------------------- |
| `AI_CONTEXT.md`        | Behavioral contract governing how work is done                         |
| `DECISIONS.md`         | Decisions made during execution — updated after every planning session |
| `PORTFOLIO_V2_SPEC.md` | Requirements each phase must deliver against                           |
| `ROADMAP.md`           | This file — what gets built and when                                   |

---

## 1. Product Vision

Portfolio V2 is a **productized developer identity system** — engineered to demonstrate how software is conceived, architected, and shipped.

Success is measured by:

- A technical evaluator recognizing senior-level thinking within **60 seconds**
- Projects communicating decisions, tradeoffs, and outcomes — not just results
- The experience feeling like a **real software product**, not a personal website
- Performance that is **measurable, fast, and documented**

---

## 2. Development Principles

These govern every phase. They are constraints, not preferences.

| Principle                            | Application                                                           |
| ------------------------------------ | --------------------------------------------------------------------- |
| Ship incrementally                   | Every phase produces a deployable state — no phase is a dead end      |
| Foundations before polish            | Architecture is correct before aesthetics are refined                 |
| Architectural correctness over speed | A slow correct decision beats a fast wrong one                        |
| Performance is a feature             | Optimization is built in, not bolted on at the end                    |
| Decisions are logged                 | Anything resolved during a phase goes into `DECISIONS.md` immediately |

---

## 3. Phase Index

| Phase | Name                 | Status        | Deliverable                                  |
| ----- | -------------------- | ------------- | -------------------------------------------- |
| 0     | Foundation           | `Complete`    | Running app with clean architecture          |
| 1     | Design System        | `Complete`    | Scalable UI foundation across all pages      |
| 2     | Home                 | `Complete`    | Credibility established within 10 seconds    |
| 3     | Projects System      | `Complete`    | Engineering case studies — not a gallery     |
| 3.5   | Writing System       | `In Progress` | Technical communication layer live           |
| 4     | About                | `Pending`     | Engineering philosophy communicated clearly  |
| 5     | Lab                  | `Complete`    | Curiosity and technical range demonstrated   |
| 6     | Contact              | `Complete`    | Low-friction, qualified inbound entry point  |
| 7     | Performance          | `Pending`     | Performance as a measurable, visible feature |
| 8     | Differentiation      | `Pending`     | Portfolio elevated beyond industry standard  |
| 9     | Continuous Evolution | `Ongoing`     | Portfolio as a living engineering product    |

---

## 4. Open Questions — Blocking

These must be resolved before the relevant phase begins. They are not implementation questions — they are content or product decisions.

No blocking questions remain for the current route set.

---

## 5. Phase Records

---

### Phase 0 — Foundation

**Status:** `Complete`
**Goal:** Establish modern architecture, tooling, and AI collaboration workflow before any feature work begins.

#### Tasks

| Task                                    | Status                              |
| --------------------------------------- | ----------------------------------- |
| Initialize Next.js App Router project   | `Complete`                          |
| Configure TailwindCSS                   | `Complete`                          |
| Define and scaffold folder architecture | `Complete`                          |
| Establish global layout system          | `Complete`                          |
| Define design tokens in `global.css`    | `Complete`                          |
| Scaffold component structure            | `Complete`                          |
| Configure ESLint + Prettier             | `Complete`                          |
| Initialize GitHub repository            | `Complete`                          |
| Connect Vercel deployment               | `Pending — to be implemented later` |
| Create `AI_CONTEXT.md`                  | `Complete`                          |
| Create `DECISIONS.md`                   | `Complete`                          |
| Create `PORTFOLIO_V2_SPEC.md`           | `Complete`                          |
| Create `ROADMAP.md`                     | `Complete`                          |

#### Definition of Done

- [x] Application runs locally without errors
- [ ] Vercel preview deployment is live
- [x] Folder structure matches spec in `PORTFOLIO_V2_SPEC.md → Section 5`
- [x] All project intelligence documents are in place
- [x] No placeholder logic exists in committed code

---

### Phase 1 — Design System

**Status:** `Complete`
**Goal:** Build the complete UI foundation that every page and feature will compose from. Nothing is page-specific. Everything is reusable.

#### Layout Primitives

| Component    | Purpose                                              | Status     |
| ------------ | ---------------------------------------------------- | ---------- |
| `RootLayout` | Global shell — navigation, footer, providers         | `Complete` |
| `Section`    | Vertical rhythm and spacing unit                     | `Complete` |
| `Container`  | Horizontal constraint — size per section per DEC-024 | `Complete` |

#### UI Components

| Component       | Purpose                                 | Status     |
| --------------- | --------------------------------------- | ---------- |
| `Heading`       | Typography hierarchy H1–H4              | `Complete` |
| `Text`          | Body copy with size and weight variants | `Complete` |
| `Button`        | Primary, secondary, ghost variants      | `Complete` |
| `Badge`         | Label and tag display                   | `Complete` |
| `Tag`           | Filter pill and taxonomy display        | `Complete` |
| `Card`          | Structured content container            | `Complete` |
| `Avatar`        | Person display with initials fallback   | `Complete` |
| `SectionHeader` | Consistent section titles and subtitles | `Complete` |
| `MetricBadge`   | Outcome-oriented data display           | `Complete` |

#### Definition of Done

- [x] All layout primitives implemented and rendering correctly
- [x] All UI components implemented and rendering correctly
- [x] Every component uses `global.css` tokens — no hardcoded values
- [x] Component APIs are consistent across the system
- [x] WCAG AA baseline met on all components
- [x] Components render correctly when composed inside `Section → Container`

---

### Phase 2 — Home

**Status:** `Complete`
**Goal:** Establish credibility within the first 10 seconds. No scroll required for the primary positioning signal.

#### Sections

| Section                | Purpose                                                    | Status     |
| ---------------------- | ---------------------------------------------------------- | ---------- |
| Hero                   | Identity and positioning — who, what, why it matters       | `Complete` |
| Selected Systems       | 2–3 projects demonstrating architectural thinking          | `Complete` |
| Engineering Principles | How problems are approached — concrete, not generic        | `Complete` |
| Proof of Work          | Quantified outcomes — numbers, not adjectives              | `Complete` |
| Writing System         | Technical posts surface — minimum one published at launch  | `Complete` |
| About Teaser           | Compressed identity signal — routes to /about, per DEC-012 | `Complete` |
| Resource Callout       | Single intentional resource callout — per DEC-013          | `Complete` |
| Hire Me / Contact      | Peak-intent CTA — per DEC-014                              | `Complete` |

#### Decisions Logged During Phase 2

| Decision | Summary                                                     |
| -------- | ----------------------------------------------------------- |
| DEC-006  | ProjectCard in `components/ui/` — shared primitive          |
| DEC-007  | Hero uses content-height with prominence guarantee          |
| DEC-008  | HeroSection is RSC — CSS-only staggered entrance            |
| DEC-009  | Project data schema defined now, content stubbed            |
| DEC-010  | Writing/Blog section added as core section                  |
| DEC-011  | Code syntax tokens extended in themes.css — no Shiki preset |
| DEC-012  | About Teaser section added to Home                          |
| DEC-013  | Resource Callout section added to Home                      |
| DEC-014  | Hire Me / Contact section added to Home                     |
| DEC-015  | Status field canonicalised — `"wip"` is the correct value   |

#### Definition of Done

- [x] Visitor understands who Alex is and what he builds within 10 seconds
- [x] Technical evaluator recognizes senior-level thinking within 60 seconds
- [x] Navigation paths to deeper content are obvious without instruction
- [x] No raw Tailwind in the page file
- [x] Page follows layout contract without deviation

---

### Phase 3 — Projects System

**Status:** `Complete`
**Goal:** Present projects as structured engineering case studies — not a gallery of thumbnails.

#### Prerequisite — Before Any Code

Verify `mesh` variant exists in `SECTION_BACKGROUND_VARIANTS` — blocking prerequisite per DEC-020. Do not build the case study hero until this is confirmed.

#### Infrastructure Tasks

| Task                                                           | Decision          | Status    |
| -------------------------------------------------------------- | ----------------- | --------- |
| Fix status fields in `projects.js` — `"in-progress"` → `"wip"` | DEC-015           | `Pending` |
| Add `demoUrl`, `repoUrl` fields to `projects.js`               | DEC-032           | `Pending` |
| Add `metrics` array to `projects.js`                           | DEC-018 amendment | `Pending` |
| Add `challenges` array to `projects.js`                        | DEC-033           | `Pending` |
| Add `testimonial` field to `projects.js`                       | DEC-022           | `Pending` |
| `/lib/config/site.js` — `siteConfig` with availability fields  | DEC-029           | `Pending` |
| `/lib/utils/projects.js` — all condition evaluation functions  | DEC-031           | `Pending` |

#### Component Tasks

| Task                                                                     | Decision          | Status      |
| ------------------------------------------------------------------------ | ----------------- | ----------- |
| `ProjectCard` — list variant via `variant` prop                          | DEC-028           | `Completed` |
| `AvailabilitySignal` — `components/ui/`, three consumers                 | DEC-038           | `Completed` |
| `FilterControls` — `use client`, pill row, keyboard nav                  | DEC-025, DEC-026  | `Completed` |
| `ViewToggle` — `use client`, grid/list, localStorage                     | DEC-028           | `Completed` |
| `MetricsStrip` — hero metrics row, `MetricBadge` composition             | DEC-018 amendment | `Completed` |
| `CaseStudyLayout` — `features/projects/` — data-coupled                  | DEC-016           | `Completed` |
| `CaseStudySection` sub-component — internal to `CaseStudyLayout`         | DEC-017           | `Completed` |
| `ChallengesSolutions` section — flat numbered list, RSC                  | DEC-033           | `Completed` |
| `TestimonialSection` — optional render per schema field                  | DEC-022           | `Completed` |
| `StickyOutline` — `use client`, IntersectionObserver, wide viewport only | DEC-034           | `Completed` |
| `AnchorCopy` — `use client`, clipboard write, scoped to icon             | DEC-036           | `Completed` |
| Next/Previous navigation strip — RSC, computed from project index        | DEC-035           | `Completed` |
| Empty state component — zero filter results                              | DEC-019           | `Completed` |

#### Page Tasks

| Task                                                                   | Decision         | Status      |
| ---------------------------------------------------------------------- | ---------------- | ----------- |
| `app/projects/page.jsx` — thin shell, all condition checks server-side | DEC-031          | `Completed` |
| `app/projects/[slug]/page.jsx` — thin shell, `generateStaticParams`    | DEC-040 pattern  | `Completed` |
| `/projects` hero — `editorial` variant, `default` Container            | DEC-020, DEC-024 | `Completed` |
| `/projects` grid section — `minimal` variant, `wide` Container         | DEC-020, DEC-024 | `Completed` |
| `/projects/[slug]` hero — `mesh` variant                               | DEC-020          | `Completed` |

#### Conditional Features — Built Now, Activated by Data

All features built in Phase 3. No future implementation sessions required — per DEC-031.

| Feature                    | Activation Condition                    | Status      |
| -------------------------- | --------------------------------------- | ----------- |
| Currently building callout | `currentlyBuilding: true` on any record | `Completed` |
| Domain filter pills        | 2+ domains with 2+ projects each        | `Completed` |
| Status filter toggle       | 2+ distinct status values in data       | `Completed` |
| Stack filter               | 10+ total projects                      | `Completed` |
| Clear filters link         | Any filter active in searchParams       | `Completed` |
| Empty state                | Filtered results === 0                  | `Completed` |
| Dynamic project count      | Any filter active                       | `Completed` |
| Pagination controls        | Total projects > 8                      | `Completed` |
| Availability signal        | `siteConfig.available === true`         | `Completed` |
| View toggle                | Ships unconditionally — default grid    | `Completed` |
| Metrics strip in hero      | `project.metrics?.length > 0`           | `Completed` |
| Demo link in hero          | `project.demoUrl` non-empty             | `Completed` |
| Repo link in hero          | `project.repoUrl` non-empty             | `Completed` |
| Challenges section         | `project.challenges?.length > 0`        | `Completed` |
| Testimonial section        | `project.testimonial !== null`          | `Completed` |

#### Case Study Section Order

```
Hero
  ├── Breadcrumb
  ├── Domain eyebrow
  ├── Project title
  ├── One-sentence summary
  ├── Metrics strip (conditional — DEC-018)
  └── Stack · Status · Year · Demo link · Repo link (DEC-032)

Six prose sections — DEC-017
  ├── Problem
  ├── Constraints
  ├── Architecture
  ├── Decisions
  ├── Tradeoffs
  └── Outcome

Challenges and Solutions (conditional — DEC-033)

Testimonial (conditional — DEC-022)

Next / Previous navigation (DEC-035)
```

#### Decisions to Load for Phase 3

`DECISIONS-CORE.md` + `DECISIONS-PHASE2.md` + `DECISIONS-PHASE3.md`

#### Definition of Done

- [ ] Status fields corrected to `"wip"` across all project records
- [ ] All condition functions in `/lib/utils/projects.js` — not inline in `page.jsx`
- [ ] `ProjectIndex` is an RSC — no `use client` on the index itself
- [ ] `FilterControls` has full keyboard navigation — arrow keys + Enter
- [ ] Filter state lives in URL searchParams — bookmarkable and shareable
- [ ] View preference persisted to localStorage via `ViewToggle`
- [ ] `ProjectCard` renders correctly in both grid and list variants
- [ ] `CaseStudyLayout` lives in `features/projects/` — per DEC-016
- [ ] All six prose sections render in the correct order — per DEC-017
- [ ] Metrics strip renders conditionally — absent when array is empty
- [ ] Challenges section renders conditionally — absent when array is empty
- [ ] Testimonial section renders only when field is populated — per DEC-022
- [ ] Empty state renders when filtered results return zero projects
- [ ] Pagination renders automatically when project count exceeds 8
- [ ] Currently building callout renders when flag is set — absent otherwise
- [ ] Availability signal renders in hero and nav when `available: true`
- [ ] `/projects` hero uses `default` Container — per DEC-024
- [ ] Project grid uses `wide` Container — per DEC-024
- [ ] `mesh` variant confirmed in `SECTION_BACKGROUND_VARIANTS` before build
- [ ] Both pages have dedicated hero sections — per DEC-021
- [ ] `StickyOutline` renders on wide viewports only
- [ ] `StickyOutline` highlights active section via IntersectionObserver
- [ ] Prose section labels have stable anchor IDs — slugified, RSC-rendered
- [ ] Copy anchor interaction scoped to `AnchorCopy` — clipboard write only
- [ ] Next/Previous strip renders at bottom of every case study
- [ ] Previous absent on first project, Next absent on last — no empty states
- [ ] All schema fields are optional unless marked required — no project blocked
- [ ] Fabricated metrics data replaced with verified real data before production
- [ ] Zero raw Tailwind in page files
- [ ] Lighthouse scores meet targets across both routes

---

### Phase 3.5 — Writing System

**Status:** `Completed`
**Goal:** Build the writing infrastructure and publish the first post before the section links in navigation — per DEC-010.

#### Infrastructure Tasks

| Task                                                  | Status      |
| ----------------------------------------------------- | ----------- |
| `/writing` index page                                 | `Completed` |
| `/writing/[slug]` dynamic route                       | `Completed` |
| Post data schema in `/lib/data/posts.js`              | `Completed` |
| `PostCard` component for index                        | `Completed` |
| `PostLayout` component for individual posts           | `Completed` |
| MDX or content rendering strategy — decision required | `Completed` |
| Code syntax token block in `themes.css` — per DEC-011 | `Completed` |

#### Content Tasks

| Post                                                          | Status      |
| ------------------------------------------------------------- | ----------- |
| Why I chose a modular monolith over microservices             | `Completed` |
| Double-entry bookkeeping explained for engineers              | `Completed` |
| The real architecture of Nigerian university CGPA calculation | `Completed` |
| Building offline-first apps for unreliable connectivity       | `Completed` |

#### Definition of Done

- [ ] Infrastructure complete and rendering correctly
- [ ] Minimum one post fully written and published
- [ ] `/writing` linked in navigation only after first post is live
- [ ] Post meets writing standard in `PORTFOLIO_V2_SPEC.md Section 8`
- [ ] Dynamic routing resolves correctly for all post slugs
- [ ] Code syntax tokens defined in `themes.css` — per DEC-011
- [ ] Zero raw Tailwind in page files

---

### Phase 4 — About

**Status:** `Completed`
**Goal:** Communicate engineering philosophy and working approach — not biography.

#### Blocking Prerequisites — Before Any Code

- `grid` variant must exist in `SECTION_BACKGROUND_VARIANTS` before `ValuesInPractice` is built — per DEC-045
- `about-data.js` must be fully written to the writing standard before any component is built — per DEC-046
- No section ships with placeholder content — production-ready on first commit

#### Required Sections — In Build Order

| Step | Section                        | Internal Structure                              | Variant     | Status      |
| ---- | ------------------------------ | ----------------------------------------------- | ----------- | ----------- |
| 1    | `features/about/about-data.js` | All content fields written in full              | —           | `Completed` |
| 2    | `AboutHero`                    | Prose — one positioning statement               | `editorial` | `Completed` |
| 3    | `EngineeringPhilosophy`        | Prose narrative + 2–3 concrete examples         | `minimal`   | `Completed` |
| 4    | `DecisionMaking`               | 2–3 tradeoff scenarios — not personality traits | `minimal`   | `Completed` |
| 5    | `WorkingApproach`              | Prose — collaboration and delivery in practice  | `minimal`   | `Completed` |
| 6    | `ValuesInPractice`             | 3–4 discrete behavior items — structured layout | `grid`      | `Completed` |
| 7    | `CurrentlyExploring`           | 2–3 dated entries — per DEC-047                 | `editorial` | `Completed` |
| 8    | `ConnectToWork`                | 4 lines max + 2 Button components               | `mesh`      | `Completed` |
| 9    | `app/about/page.jsx`           | Thin shell — layout contract, no raw Tailwind   | —           | `Completed` |

#### SectionBackground Variants — Logged Per DEC-045

All assignments are closed decisions. Do not deviate without a formal amendment.

| Section                 | Variant     | Container         |
| ----------------------- | ----------- | ----------------- |
| `AboutHero`             | `editorial` | `default` (896px) |
| `EngineeringPhilosophy` | `minimal`   | `default` (896px) |
| `DecisionMaking`        | `minimal`   | `default` (896px) |
| `WorkingApproach`       | `minimal`   | `default` (896px) |
| `ValuesInPractice`      | `grid`      | `default` (896px) |
| `CurrentlyExploring`    | `editorial` | `default` (896px) |
| `ConnectToWork`         | `mesh`      | `default` (896px) |

All sections use `default` Container — the About page is entirely prose and discrete-item content, no grid surfaces require `wide`.

#### Data File — `features/about/about-data.js`

Location is `features/about/` not `lib/data/` — per DEC-046. About content is feature-scoped authored prose, not an addressable content record indexed by slug.

```js
export const aboutData = {
  hero: { positioning: "" },
  engineeringPhilosophy: {
    narrative: "",
    examples: [{ principle: "", implication: "" }],
  },
  decisionMaking: {
    narrative: "",
    scenarios: [{ situation: "", reasoning: "", outcome: "" }],
  },
  workingApproach: { narrative: "" },
  valuesInPractice: [{ behavior: "", explanation: "" }],
  currentlyExploring: [{ topic: "", detail: "", date: "" }],
  connectToWork: { projectsCopy: "", contactCopy: "" },
};
```

#### Content Standards — Enforced Before Step 2 Begins

| Section              | Specificity Test                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| `ValuesInPractice`   | Could a generic developer claim this behavior? If yes — not specific enough                       |
| `CurrentlyExploring` | Is the topic specific and dated? "Interested in AI" fails. "Q2 2026" date required per DEC-047    |
| `ConnectToWork`      | Is the copy specific about what each path contains? Generic "get in touch" language is prohibited |

#### What Does Not Ship With Phase 4

| Feature                             | Status                                      |
| ----------------------------------- | ------------------------------------------- |
| Career timeline or work history     | ❌ Explicit spec non-goal                   |
| Skills list or technology inventory | ❌ Explicit spec non-goal                   |
| Biography or personal backstory     | ❌ Explicit spec non-goal                   |
| Testimonial quotes                  | ❌ Belong on case study pages — per DEC-022 |
| Social media feed integration       | ❌ No audience justification                |
| Animated counters or statistics     | ❌ Belong on Home Proof of Work section     |

#### Decisions to Load for Phase 4

`DECISIONS-CORE.md` + `DECISIONS-PHASE4.md`

Cross-reference DEC-020 (`DECISIONS-PHASE3.md`) for SectionBackground variant precedent if needed.

#### Decisions Logged for Phase 4

| Decision | Summary                                                                                 |
| -------- | --------------------------------------------------------------------------------------- |
| DEC-044  | About page layout — prose for narrative sections, structured for discrete-item sections |
| DEC-045  | SectionBackground variants assigned across all seven About sections                     |
| DEC-046  | `about-data.js` lives in `features/about/` — feature-scoped, not `lib/data/`            |
| DEC-047  | `CurrentlyExploring` uses dated entries — visible timestamp per item, two to three max  |

#### Definition of Done

- [ ] `about-data.js` complete — all fields written to writing standard, zero placeholders
- [ ] `grid` variant confirmed in `SECTION_BACKGROUND_VARIANTS` before `ValuesInPractice` is built
- [ ] All seven sections built in the order defined above
- [ ] `ValuesInPractice` entries pass the specificity test — not claimable by a generic developer
- [ ] `CurrentlyExploring` entries are specific, concrete, and carry visible dates
- [ ] `ConnectToWork` copy is specific — no generic "get in touch" language
- [ ] No biography, career timeline, or skills list on this page
- [ ] A reader understands how Alex thinks and works within 90 seconds
- [ ] Content meets writing standard in `PORTFOLIO_V2_SPEC.md Section 8`
- [ ] SectionBackground variants match DEC-045 across all sections
- [ ] `mesh` variant on `ConnectToWork` — consistent with Home CTA treatment
- [ ] `app/about/page.jsx` is a thin shell — no raw Tailwind, follows layout contract
- [ ] Zero raw Tailwind in page files

---

### Phase 5 — Lab

**Status:** `Completed`
**Goal:** Demonstrate intellectual curiosity and technical range outside production constraints.

#### Completed Prerequisites

- First lab entries are defined in `src/lib/data/lab.js`.
- `aurora` exists in `SECTION_BACKGROUND_VARIANTS` and is used by the `/lab` hero — per DEC-043.

#### Infrastructure Tasks

| Task                                                    | Decision | Status      |
| ------------------------------------------------------- | -------- | ----------- |
| `/lib/data/lab.js` — lab entry schema and records       | DEC-041  | `Completed` |
| `/lab` index page — `app/lab/page.jsx`                  | DEC-040  | `Completed` |
| `/lab/[slug]` dynamic route — `app/lab/[slug]/page.jsx` | DEC-040  | `Completed` |
| `LabCard` — `components/ui/`, shared primitive          | DEC-042  | `Completed` |
| Lab entry hero component — `editorial` variant          | DEC-043  | `Completed` |
| Lab index hero — `aurora` variant                       | DEC-043  | `Completed` |
| Exploration section component — RSC                     | DEC-041  | `Completed` |
| Findings section component — RSC                        | DEC-041  | `Completed` |
| Production Influence section — RSC, explicit null state | DEC-041  | `Completed` |
| `generateStaticParams` for `/lab/[slug]`                | DEC-040  | `Completed` |

#### Lab Entry Requirements

| Requirement             | Standard                                               | Status      |
| ----------------------- | ------------------------------------------------------ | ----------- |
| Three narrative fields  | `exploration`, `findings`, `influenced` — all required | `Completed` |
| `influenced` null state | "No production influence" — section never absent       | `Completed` |
| `status: "abandoned"`   | Muted visual treatment — not hidden                    | `Completed` |
| Entry type indicator    | Visible on every `LabCard`                             | `Completed` |
| `sourceUrl`             | Reference link in entry hero when populated            | `Completed` |
| Hero framing copy       | Explicitly frames lab as distinct from `/projects`     | `Completed` |

#### Decisions to Load for Phase 5

`DECISIONS-CORE.md` + `DECISIONS-PHASE5.md`

Cross-reference DEC-006 (`ProjectCard` scope) and DEC-016 (`CaseStudyLayout` location) from `DECISIONS-PHASE2.md` and `DECISIONS-PHASE3.md` — `LabCard` and lab layout decisions follow the same reasoning.

#### Definition of Done

- [x] First lab entry named and confirmed before build begins
- [x] `aurora` variant confirmed in `SECTION_BACKGROUND_VARIANTS` before hero is built
- [x] `/lab/[slug]` routes resolve correctly for all entry slugs
- [x] All three narrative fields render — `influenced` shows null state when empty
- [x] `status: "abandoned"` renders with distinct muted visual treatment — not hidden
- [x] Entry type indicator renders on every `LabCard`
- [x] `sourceUrl` renders as reference link in entry hero when populated
- [ ] `/lab` index hero copy explicitly frames lab as distinct from `/projects`
- [ ] `SectionBackground` variants match DEC-043 across all lab surfaces
- [ ] `LabCard` composes from Design System tokens only
- [ ] At least one complete entry live before `/lab` links in navigation
- [ ] Zero raw Tailwind in page files

---

### Phase 6 — Contact

**Status:** `Completed`
**Goal:** A deliberate, low-friction entry point for qualified inbound — not a footer form.

#### Prerequisite — Before Any Code

Resolve DEC-037 through DEC-039. All three are logged in `DECISIONS-PHASE6.md`. Review before implementation begins.

#### Component Tasks

| Task                                                                       | Decision | Status      |
| -------------------------------------------------------------------------- | -------- | ----------- |
| `AvailabilitySignal` — if not already built in Phase 3                     | DEC-038  | `Completed` |
| Refactor `ContactForm` — replace bespoke controls with `form-controls.jsx` | DEC-039  | `Completed` |
| Delete custom `Field` sub-component from `ContactForm`                     | DEC-039  | `Completed` |
| Delete `inputCls()` utility from `ContactForm`                             | DEC-039  | `Completed` |
| `LookingFor` section component                                             | DEC-037  | `Completed` |
| `QuickReach` section component                                             | DEC-037  | `Completed` |
| `ContactHero` component                                                    | DEC-037  | `Completed` |

#### Server Action Tasks

| Task                                                                             | Decision | Status        |
| -------------------------------------------------------------------------------- | -------- | ------------- |
| `actions.js` — server action for form submission                                 | —        | `In Progress` |
| Honeypot field validation in `actions.js` — silent rejection                     | DEC-039  | `Pending`     |
| Response time from `siteConfig.AVAILABILITY.responseTime` surfaced before submit | DEC-037  | `Pending`     |
| Success state handling                                                           | —        | `Pending`     |

#### Page Tasks

| Task                                                          | Decision | Status      |
| ------------------------------------------------------------- | -------- | ----------- |
| `app/contact/page.jsx` — thin shell                           | —        | `Completed` |
| `ContactHero` with `AvailabilitySignal` — `default` Container | DEC-037  | `Completed` |
| Two-column grid section — `wide` Container, `minimal` variant | DEC-037  | `Completed` |
| Mobile stacked layout — `LookingFor` above `ContactForm`      | DEC-037  | `Completed` |

#### Contact Page Layout Reference — Per DEC-037

```
Desktop (lg+)
┌──────────────────────────────────────────────────────┐
│  ContactHero  (default Container — 896px)            │
│  AvailabilitySignal                                  │
└──────────────────────────────────────────────────────┘
┌─────────────────────────────┬────────────────────────┐
│  ContactForm (60%)          │  LookingFor            │  wide Container
│                             │  QuickReach            │
│                             │  AvailabilitySignal    │
└─────────────────────────────┴────────────────────────┘

Mobile / Tablet
ContactHero → AvailabilitySignal → LookingFor → ContactForm → QuickReach
```

#### What Does Not Ship

| Feature                      | Status                                                         |
| ---------------------------- | -------------------------------------------------------------- |
| CAPTCHA                      | Not shipping — per spec, unless spam is documented post-launch |
| Calendar booking integration | Not shipping — out of scope                                    |
| Multi-step form              | Not shipping — field count does not justify complexity         |

#### Decisions to Load for Phase 6

`DECISIONS-CORE.md` + `DECISIONS-PHASE6.md`

Cross-reference DEC-029 (`AvailabilitySignal` origin) from `DECISIONS-PHASE3.md` if `AvailabilitySignal` was not built in Phase 3.

#### Definition of Done

- [ ] `ContactForm` refactored — all controls use `form-controls.jsx` components
- [ ] Custom `Field` sub-component deleted — not migrated
- [ ] `inputCls()` utility deleted from `ContactForm`
- [ ] Honeypot field in server action — silent rejection, returns success
- [ ] Response time visible before submit — not only in success state
- [ ] Direct email surfaced in `QuickReach` — no friction
- [ ] Two-column layout at desktop — `LookingFor` in right column
- [ ] Mobile stacked — `LookingFor` above `ContactForm`
- [ ] `AvailabilitySignal` renders correctly in contact hero
- [ ] Form submits and delivers message correctly
- [ ] No unnecessary form fields
- [ ] Page communicates what kind of inbound is welcome
- [ ] Zero raw Tailwind in page files

---

### Phase 7 — Performance

**Status:** `In Progress`
**Goal:** Make performance a measurable, visible product feature — not a last-minute audit.

#### Targets

| Metric                   | Target                       |
| ------------------------ | ---------------------------- |
| Lighthouse Performance   | ≥ 95                         |
| Lighthouse Accessibility | ≥ 95                         |
| Cumulative Layout Shift  | ≤ 0.1                        |
| First Contentful Paint   | ≤ 1.2s                       |
| Time to Interactive      | ≤ 2.5s                       |
| JS Bundle                | Minimal — every KB justified |

#### Tasks

| Task                                                              | Status    |
| ----------------------------------------------------------------- | --------- |
| Image optimization audit                                          | `Pending` |
| Font optimization                                                 | `Pending` |
| Code splitting review                                             | `Pending` |
| Server Component audit — flag unnecessary `use client` directives | `Pending` |
| Audit `use client` ledger against `AI_CONTEXT.md Section 4`       | `Pending` |
| Lighthouse audit across all routes                                | `Pending` |
| Bundle size analysis and documentation                            | `Pending` |

#### Definition of Done

- [ ] All Lighthouse targets met across every route
- [ ] Every `use client` directive matches the ledger in `AI_CONTEXT.md Section 4`
- [ ] No unjustified `use client` directives remain
- [ ] Bundle size is documented and justified
- [ ] Image assets are optimized and lazy-loaded

---

### Phase 8 — Differentiation

**Status:** `Pending`
**Goal:** Elevate the portfolio beyond industry standard through features that demonstrate engineering depth directly.

#### Candidate Features

Evaluated at execution time. None committed until scoped and logged in `DECISIONS.md`.

| Feature                             | Signal It Communicates                                                    |
| ----------------------------------- | ------------------------------------------------------------------------- |
| Interactive architecture breakdowns | Systems thinking made visible                                             |
| Public system diagrams              | Design process on display                                                 |
| Performance dashboard               | Engineering rigor as content                                              |
| Live sandbox demos                  | Technical range and depth                                                 |
| Lab Home Teaser section             | Curiosity surfaced on Home — activates when 3+ featured lab entries exist |

#### Definition of Done

- [ ] At least one differentiation feature is live
- [ ] Feature decision is logged in `DECISIONS.md` before implementation
- [ ] Feature serves the audience — not the ego
- [ ] SectionBackground variant for any new surface is logged before build

---

### Phase 9 — Continuous Evolution

**Status:** `Ongoing`
**Goal:** Portfolio functions as a living engineering product — updated, measured, and improved over time.

#### Ongoing Tasks

| Task                                                 | Cadence                      |
| ---------------------------------------------------- | ---------------------------- |
| Add new case studies as projects ship                | Per project                  |
| Add new lab entries as experiments complete          | Per experiment               |
| Publish new writing posts                            | As content is ready          |
| Refine content based on feedback                     | Quarterly                    |
| Audit and update `DECISIONS.md` — next ID is DEC-044 | Per architectural change     |
| Review performance targets                           | Quarterly                    |
| Update `ROADMAP.md` phase statuses                   | Per phase completion         |
| Keep `AvailabilitySignal` data current               | When availability changes    |
| Keep Resource Callout current                        | When linked resource changes |

---

## 6. Deployment Strategy

| Rule                  | Standard                                                   |
| --------------------- | ---------------------------------------------------------- |
| Deployment platform   | Vercel — continuous deployment                             |
| Branch strategy       | Preview on every branch push · Production from `main` only |
| Release cadence       | Small, frequent — every phase produces a deployable state  |
| Pre-merge requirement | Preview deployment reviewed before merging to `main`       |

---

## 7. Definition of Project Completion

Portfolio V2 is complete when all of the following are true:

- [ ] Phases 0 through 7 are fully delivered
- [ ] All Lighthouse performance targets met across every route
- [ ] A technical evaluator recognizes senior-level thinking within 60 seconds
- [ ] Projects communicate decisions, tradeoffs, and outcomes — not just results
- [ ] The experience reads as a real software product
- [ ] All architectural decisions are logged in `DECISIONS.md`
- [ ] The open question in Section 4 is resolved and recorded

---

## 8. Final Directive

> This portfolio is not finished when it looks good. It is finished when it proves engineering mastery.

Nothing ships that cannot be traced to that standard.
