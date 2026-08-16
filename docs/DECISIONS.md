# DECISIONS.md — Architectural Decision Record

**Project:** alexshedrach.dev
**Version:** 2.3.0
**Last Updated:** 2026
**Classification:** Persistent Engineering Memory — AI Must Load Before Every Session

---

## 0. Purpose & Protocol

This document is the **authoritative index** of all significant product and engineering decisions made during development of Portfolio V2.

The full decision records are split across sub-files by phase. This file is the entry point — load it first, then load the sub-file relevant to the current work.

### Why It Is Split

The decision log has grown beyond a single-file context window. Splitting by phase keeps each file focused, scannable, and within the token budget of any AI session. The master index preserves the complete decision inventory — no decision is ever lost.

### File Structure

| File                    | Contents                                                | Load When                               |
| ----------------------- | ------------------------------------------------------- | --------------------------------------- |
| `DECISIONS.md`          | This file — index, protocol, format, status definitions | Every session                           |
| `DECISIONS-CORE.md`     | DEC-001 to DEC-005 — Foundation decisions               | Every session — these govern everything |
| `DECISIONS-PHASE2.md`   | DEC-006 to DEC-015 — Home page decisions                | Working on Home or Design System        |
| `DECISIONS-PHASE3.md`   | DEC-016 to DEC-036 — Projects system decisions          | Working on Projects or Case Studies     |
| `DECISIONS-PHASE3.5.md` | DEC-048 to DEC-051 — Writing system decisions           | Working on Writing system or posts      |
| `DECISIONS-PHASE4.md`   | DEC-044 to DEC-047 — About page decisions               | Working on About page                   |
| `DECISIONS-PHASE5.md`   | DEC-040 to DEC-043 — Lab decisions                      | Working on Lab page or Lab entries      |
| `DECISIONS-PHASE6.md`   | DEC-037 to DEC-039 — Contact page decisions             | Working on Contact page                 |

**Note on numbering:** Decision IDs were assigned in implementation order, not phase order. Phase 6 (DEC-037–039) and Phase 5 (DEC-040–043) were logged before Phase 4 (DEC-044–047). Phase 3.5 (DEC-048–051) was logged last. The index below reflects actual assignment order. File names reflect phase sequence for navigation clarity.

---

## 1. AI Protocol

When this document is loaded, the AI must:

1. Load `DECISIONS-CORE.md` immediately — core decisions govern every session regardless of phase
2. Load the phase-specific sub-file relevant to the current work
3. Treat every `Accepted` decision as **ground truth** — do not contradict without flagging
4. When proposing something that conflicts with a logged decision, **explicitly state the conflict** and submit it as a proposed amendment using the format in Section 3
5. Never silently override a decision by producing non-compliant output

### Sub-File Loading Rules

| Current Work                               | Load                                          |
| ------------------------------------------ | --------------------------------------------- |
| Any architectural or foundational work     | `DECISIONS-CORE.md`                           |
| Home page, Hero, Design System components  | `DECISIONS-CORE.md` + `DECISIONS-PHASE2.md`   |
| Projects index, Case studies               | `DECISIONS-CORE.md` + `DECISIONS-PHASE3.md`   |
| Writing system, posts, syntax highlighting | `DECISIONS-CORE.md` + `DECISIONS-PHASE3.5.md` |
| About page                                 | `DECISIONS-CORE.md` + `DECISIONS-PHASE4.md`   |
| Lab page, Lab entries                      | `DECISIONS-CORE.md` + `DECISIONS-PHASE5.md`   |
| Contact page                               | `DECISIONS-CORE.md` + `DECISIONS-PHASE6.md`   |
| Full project audit or architecture session | All sub-files                                 |

---

## 2. Decision Format

Each record in the sub-files follows this structure:

```
Decision ID   — Unique identifier (e.g., DEC-006)
Date          — Year or full date
Status        — Accepted | Superseded | Deprecated | Under Review
Area          — Domain affected (Architecture, UX, Performance, etc.)
Context       — What situation prompted this decision
Options       — Alternatives that were seriously considered
Decision      — What was chosen
Reasoning     — Why this option won
Consequences  — What this decision enables, constrains, or closes
```

---

## 3. Status Definitions

| Status         | Meaning                                                 |
| -------------- | ------------------------------------------------------- |
| `Accepted`     | Active. Governs current development. Do not contradict. |
| `Under Review` | Active but being reconsidered. Flag if relevant.        |
| `Superseded`   | Replaced by a newer decision. Reference provided.       |
| `Deprecated`   | No longer applicable. Preserved for historical record.  |

---

## 4. How to Propose an Amendment

If a logged decision should be reconsidered, open a new entry under **Proposed Amendments** in the relevant sub-file with:

- Reference to the original Decision ID
- Clear rationale for why the decision no longer holds
- Proposed replacement decision
- Expected consequences

Do not modify or delete existing accepted entries.

---

## 5. Complete Decision Index

| ID      | Area                  | Decision Summary                                                                        | Status   | File                  |
| ------- | --------------------- | --------------------------------------------------------------------------------------- | -------- | --------------------- |
| DEC-001 | Architecture          | Clean rebuild over incremental refactor                                                 | Accepted | DECISIONS-CORE.md     |
| DEC-002 | Frontend Architecture | Next.js App Router as framework                                                         | Accepted | DECISIONS-CORE.md     |
| DEC-003 | Product Strategy      | Portfolio positioned as productized engineering system                                  | Accepted | DECISIONS-CORE.md     |
| DEC-004 | UX / UI               | Minimal, structured, high-signal design philosophy                                      | Accepted | DECISIONS-CORE.md     |
| DEC-005 | Workflow              | Structured AI collaboration via persistent context files                                | Accepted | DECISIONS-CORE.md     |
| DEC-006 | Architecture          | ProjectCard lives in components/ui/ as a shared primitive                               | Accepted | DECISIONS-PHASE2.md   |
| DEC-007 | UX / Layout           | Hero uses content-height with prominence guarantee                                      | Accepted | DECISIONS-PHASE2.md   |
| DEC-008 | Rendering             | HeroSection is RSC — CSS-only staggered entrance                                        | Accepted | DECISIONS-PHASE2.md   |
| DEC-009 | Data Strategy         | Project data schema defined now, content stubbed in /lib/data/projects.js               | Accepted | DECISIONS-PHASE2.md   |
| DEC-010 | Product Strategy      | Writing/Blog section added as a core portfolio section                                  | Accepted | DECISIONS-PHASE2.md   |
| DEC-011 | Design System         | Code syntax tokens extended in themes.css — no Shiki preset                             | Accepted | DECISIONS-PHASE2.md   |
| DEC-012 | UX / Product          | About Teaser section added to Home page                                                 | Accepted | DECISIONS-PHASE2.md   |
| DEC-013 | UX / Product          | Resource Callout section added to Home page                                             | Accepted | DECISIONS-PHASE2.md   |
| DEC-014 | UX / Product          | Hire Me / Contact section added to Home page                                            | Accepted | DECISIONS-PHASE2.md   |
| DEC-015 | Data                  | Status field canonicalised — data records updated to match enum spec                    | Accepted | DECISIONS-PHASE2.md   |
| DEC-016 | Architecture          | CaseStudyLayout lives in features/projects/ — data-coupled component                    | Accepted | DECISIONS-PHASE3.md   |
| DEC-017 | UX / Layout           | CaseStudy prose renders as flat vertical stack of labeled sections                      | Accepted | DECISIONS-PHASE3.md   |
| DEC-018 | Data / UX             | AMENDED — Hero metrics strip added to case study — prose outcome preserved              | Accepted | DECISIONS-PHASE3.md   |
| DEC-019 | UX / Architecture     | AMENDED — Filter system built now, UI gates on runtime conditions                       | Accepted | DECISIONS-PHASE3.md   |
| DEC-020 | UX / Design System    | SectionBackground variants assigned across all projects pages                           | Accepted | DECISIONS-PHASE3.md   |
| DEC-021 | UX / Layout           | Hero sections added to /projects index and /projects/[slug]                             | Accepted | DECISIONS-PHASE3.md   |
| DEC-022 | UX / Data             | Testimonial section added to case study pages — optional schema field                   | Accepted | DECISIONS-PHASE3.md   |
| DEC-023 | UX / Layout           | ProjectIndex grid — two columns desktop, one column mobile                              | Accepted | DECISIONS-PHASE3.md   |
| DEC-024 | Architecture          | Mixed Container sizes permitted within a single page — per-section sizing               | Accepted | DECISIONS-PHASE3.md   |
| DEC-025 | Architecture          | Filter state via URL searchParams — RSC-compatible, no use client on index              | Accepted | DECISIONS-PHASE3.md   |
| DEC-026 | UX                    | Filter UI — horizontal pill row, domain first, status gated on data distribution        | Accepted | DECISIONS-PHASE3.md   |
| DEC-027 | Architecture          | Pagination via URL — RSC-compatible, page size 6, gates at 8+ projects                  | Accepted | DECISIONS-PHASE3.md   |
| DEC-028 | UX / Architecture     | View toggle — list and grid — DEC-023 amended, use client scoped to toggle control      | Accepted | DECISIONS-PHASE3.md   |
| DEC-029 | UX / Data             | Availability signal — boolean in site.js, renders in hero and nav                       | Accepted | DECISIONS-PHASE3.md   |
| DEC-030 | UX / Data             | Currently building callout — boolean field on project record, renders above grid        | Accepted | DECISIONS-PHASE3.md   |
| DEC-031 | Architecture          | Conditional UI pattern — all gated features built now, activated by runtime data checks | Accepted | DECISIONS-PHASE3.md   |
| DEC-032 | Data                  | Demo and repo URL fields added to project schema — optional                             | Accepted | DECISIONS-PHASE3.md   |
| DEC-033 | UX / Data             | Challenges and Solutions section added to case study — flat list, new schema field      | Accepted | DECISIONS-PHASE3.md   |
| DEC-034 | UX / Architecture     | Sticky sidebar outline — use client justified on case study page                        | Accepted | DECISIONS-PHASE3.md   |
| DEC-035 | UX / Architecture     | Next/Previous case study navigation — RSC, computed at build time                       | Accepted | DECISIONS-PHASE3.md   |
| DEC-036 | UX / Architecture     | Copy anchor links on prose section labels — scoped use client, clipboard only           | Accepted | DECISIONS-PHASE3.md   |
| DEC-037 | UX / Layout           | Contact page layout — two-column desktop, stacked mobile                                | Accepted | DECISIONS-PHASE6.md   |
| DEC-038 | Architecture          | AvailabilitySignal lives in components/ui/ as shared primitive                          | Accepted | DECISIONS-PHASE6.md   |
| DEC-039 | Architecture          | ContactForm refactored to use form-controls.jsx before page composition                 | Accepted | DECISIONS-PHASE6.md   |
| DEC-040 | Architecture          | Individual lab entry routes — /lab/[slug] implemented                                   | Accepted | DECISIONS-PHASE5.md   |
| DEC-041 | Data                  | Lab entry data schema defined — three narrative fields, sourceUrl, abandoned status     | Accepted | DECISIONS-PHASE5.md   |
| DEC-042 | Architecture          | LabCard lives in components/ui/ as a shared primitive                                   | Accepted | DECISIONS-PHASE5.md   |
| DEC-043 | UX / Design System    | SectionBackground variants assigned across all lab surfaces                             | Accepted | DECISIONS-PHASE5.md   |
| DEC-044 | UX / Layout           | About page layout — prose for narrative sections, structured for discrete-item sections | Accepted | DECISIONS-PHASE4.md   |
| DEC-045 | UX / Design System    | SectionBackground variants assigned across all About page sections                      | Accepted | DECISIONS-PHASE4.md   |
| DEC-046 | Architecture / Data   | about-data.js lives in features/about/ — feature-scoped, not lib/data/                  | Accepted | DECISIONS-PHASE4.md   |
| DEC-047 | UX / Data             | CurrentlyExploring uses dated entries — visible timestamp per item, two to three max    | Accepted | DECISIONS-PHASE4.md   |
| DEC-048 | Architecture / Data   | Content rendering strategy — Markdown with remark/rehype pipeline, MDX rejected         | Accepted | DECISIONS-PHASE3.5.md |
| DEC-049 | Data                  | Post schema and frontmatter specification — slug and readTime derived, not stored       | Accepted | DECISIONS-PHASE3.5.md |
| DEC-050 | Architecture          | Dependency selection and pipeline order for writing system                              | Accepted | DECISIONS-PHASE3.5.md |
| DEC-051 | Design System         | themes.css code token block and Shiki integration — implements DEC-011                  | Accepted | DECISIONS-PHASE3.5.md |
| DEC-052 | Deployment / Operations | Production deployment contract owned in repo — Vercel config, metadata routes, deterministic build rules | Accepted | DECISIONS-CORE.md     |
| DEC-053 | Deployment / Operations | V1 → V2 hosting cutover — new repo, new Vercel project, domain migrates after validation | Accepted | DECISIONS-CORE.md     |
---

## 6. SectionBackground Variant Map — Full System

All variant assignments across the entire site in one place. Sub-file entries are the source — this table is the index.

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
| `/about` DecisionMaking            | `minimal`   | DEC-045  |
| `/about` WorkingApproach           | `minimal`   | DEC-045  |
| `/about` ValuesInPractice          | `grid`      | DEC-045  |
| `/about` CurrentlyExploring        | `editorial` | DEC-045  |
| `/about` ConnectToWork             | `mesh`      | DEC-045  |
| `/writing` index hero              | `editorial` | DEC-048  |
| `/writing` index body              | `minimal`   | DEC-048  |
| `/writing/[slug]` hero             | `editorial` | DEC-048  |
| `/writing/[slug]` body             | `minimal`   | DEC-048  |

**Blocking prerequisites:**

- `mesh` must exist in `SECTION_BACKGROUND_VARIANTS` before Phase 3 case study hero — DEC-020
- `aurora` must exist in `SECTION_BACKGROUND_VARIANTS` before Phase 5 lab hero — DEC-043
- `grid` must exist in `SECTION_BACKGROUND_VARIANTS` before Phase 4 ValuesInPractice — DEC-045

**Remaining unassigned surfaces:** None blocking. Home sections that render the default `SectionBackground` use the component default (`minimal`) unless a future phase assigns a stronger variant.

---

## 7. Open Questions — Blocking

No blocking product questions remain for the current deployed route set.

---

## 8. Adding New Decisions

A decision should be logged when it:

- Affects project architecture, structure, or folder organisation
- Establishes a pattern that other code will follow
- Resolves a meaningful debate between two or more approaches
- Closes a door that should not be silently reopened

A decision does **not** need to be logged for:

- Implementation details that don't constrain future decisions
- Minor style or naming choices within an established pattern
- Decisions that are trivially reversible with no downstream consequences

### Which Sub-File to Add To

| Decision Area                                    | Add To                                                      |
| ------------------------------------------------ | ----------------------------------------------------------- |
| Framework, rendering strategy, core architecture | `DECISIONS-CORE.md`                                         |
| Home page, Design System, global UX patterns     | `DECISIONS-PHASE2.md`                                       |
| Projects, case studies                           | `DECISIONS-PHASE3.md`                                       |
| Writing system, posts, syntax highlighting       | `DECISIONS-PHASE3.5.md`                                     |
| About page                                       | `DECISIONS-PHASE4.md`                                       |
| Lab page, lab entries                            | `DECISIONS-PHASE5.md`                                       |
| Contact page                                     | `DECISIONS-PHASE6.md`                                       |
| New phase begins                                 | Create `DECISIONS-PHASE[N].md` following the same structure |

### Next Decision ID

**DEC-053** — assign this to the next decision logged.

---

## 9. Linked Documents

| Document                | Purpose                                                    |
| ----------------------- | ---------------------------------------------------------- |
| `DECISIONS.md`          | This file — master index and protocol                      |
| `DECISIONS-CORE.md`     | DEC-001 to DEC-005 — Foundation decisions                  |
| `DECISIONS-PHASE2.md`   | DEC-006 to DEC-015 — Home page decisions                   |
| `DECISIONS-PHASE3.md`   | DEC-016 to DEC-036 — Projects system decisions             |
| `DECISIONS-PHASE3.5.md` | DEC-048 to DEC-051 — Writing system decisions              |
| `DECISIONS-PHASE4.md`   | DEC-044 to DEC-047 — About page decisions                  |
| `DECISIONS-PHASE5.md`   | DEC-040 to DEC-043 — Lab decisions                         |
| `DECISIONS-PHASE6.md`   | DEC-037 to DEC-039 — Contact page decisions                |
| `AI_CONTEXT.md`         | Behavioral contract and engineering standards              |
| `PORTFOLIO_V2_SPEC.md`  | Product specification — requirements these decisions serve |
| `ROADMAP.md`            | Execution plan — phases these decisions belong to          |
| `DEPLOYMENT.md`         | Vercel deployment contract and launch checklist            |
