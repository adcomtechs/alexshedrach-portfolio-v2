# DECISIONS-PHASE4.md — Phase 4 Decisions: About Page

**Project:** alexshedrach.dev
**Version:** 2.0.0
**Last Updated:** 2026
**Classification:** Phase 4 Engineering Memory — Load When Working on About Page

---

## 0. About This File

This file contains decisions made during **Phase 4 — About** development. It covers the page layout approach, SectionBackground variant assignments, data file location, and the CurrentlyExploring update mechanism.

**Prerequisites:** Load `DECISIONS.md` and `DECISIONS-CORE.md` before this file. Cross-reference DEC-020 (`DECISIONS-PHASE3.md`) for SectionBackground variant precedent — the About page variant assignments follow the same pattern.

**Scope:** DEC-044 to DEC-047

**Numbering note:** The About page planning session originally proposed DEC-040 through DEC-043. Those IDs were already assigned to Phase 5 Lab decisions before this file was created. The About page decisions are renumbered DEC-044 through DEC-047 to preserve index integrity. The master `DECISIONS.md` index reflects the correct numbering.

For the complete decision index and protocol, see `DECISIONS.md`.

---

## 1. Quick Reference — About Page Architecture

```
About Page — Section Order and Variant Assignments

Section                   Variant      Container    Rendering
─────────────────────────────────────────────────────────────
AboutHero                 editorial    default      RSC
EngineeringPhilosophy     minimal      default      RSC
DecisionMaking            minimal      default      RSC
WorkingApproach           minimal      default      RSC
ValuesInPractice          grid         default      RSC
CurrentlyExploring        editorial    default      RSC
ConnectToWork             mesh         default      RSC
```

---

## 2. What Does Not Ship With Phase 4

These are closed questions. Do not reopen without a formal amendment.

| Feature                             | Status          | Reason                                   |
| ----------------------------------- | --------------- | ---------------------------------------- |
| Career timeline or work history     | ❌ Not shipping | Explicit spec non-goal                   |
| Skills list or technology inventory | ❌ Not shipping | Explicit spec non-goal                   |
| Biography or personal backstory     | ❌ Not shipping | Explicit spec non-goal                   |
| Testimonial quotes                  | ❌ Not shipping | Belong on case study pages — per DEC-022 |
| Social media feed integration       | ❌ Not shipping | No audience justification                |
| Animated counters or statistics     | ❌ Not shipping | Belong on Home Proof of Work section     |

If any of the above appear during content writing, they are cut before the data file is finalised.

---

## 3. Build Order — Enforced Sequence

The sequence below is non-negotiable. No component is built before its prerequisite is complete.

```
Step 1   features/about/about-data.js        ← content written in full before Step 2
Step 2   AboutHero                           ← editorial variant, default Container
Step 3   EngineeringPhilosophy               ← prose narrative, two to three examples
Step 4   DecisionMaking                      ← tradeoff scenarios, not personality traits
Step 5   WorkingApproach                     ← collaboration and delivery in practice
Step 6   ValuesInPractice                    ← behaviors, not aspirational statements
Step 7   CurrentlyExploring                  ← dated entries, two to three items max
Step 8   ConnectToWork                       ← closing CTA, projects + contact paths
Step 9   app/about/page.jsx                  ← thin shell, layout contract, no raw Tailwind
```

**Critical:** `about-data.js` must be complete — all fields written to the writing standard — before any component is built. No stubs. No placeholders. This is the production-ready on first commit requirement from `AI_CONTEXT.md`.

---

## 4. Decision Records

---

### DEC-044 — About Page Layout Approach

**Date:** 2026
**Status:** `Accepted`
**Area:** UX / Layout

#### Context

The spec defines four required content areas for the About page — all prose-heavy and deliberately non-visual. The question is whether the page is strictly single-column throughout, or whether discrete-item sections (`ValuesInPractice`, `CurrentlyExploring`) benefit from a structured card or list layout rather than continuous prose.

This decision shapes every component's internal structure and must be logged before Step 3 begins.

#### Options Considered

| Option                                                                     | Description                                          | Tradeoff                                                                                             |
| -------------------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Single-column prose throughout                                             | Maximum readability, consistent register             | `ValuesInPractice` and `CurrentlyExploring` may read as walls of text without visual differentiation |
| Prose for narrative sections, structured layout for discrete-item sections | Each section uses the format that serves its content | Requires per-section internal structure decisions — more implementation scope                        |

#### Decision

**Prose for narrative sections. Structured layout for discrete-item sections.**

Specifically:

| Section                 | Internal Structure                                                               |
| ----------------------- | -------------------------------------------------------------------------------- |
| `AboutHero`             | Prose — single positioning statement                                             |
| `EngineeringPhilosophy` | Prose — structured narrative with concrete examples                              |
| `DecisionMaking`        | Prose — two to three tradeoff scenarios                                          |
| `WorkingApproach`       | Prose — collaboration and delivery in practice                                   |
| `ValuesInPractice`      | Structured — three to four discrete behavior items with brief prose explanations |
| `CurrentlyExploring`    | Structured — two to three dated items                                            |
| `ConnectToWork`         | Compact — four lines of copy maximum, two Button components                      |

#### Reasoning

- Continuous prose across seven sections creates a reading experience that requires sustained attention without visual relief — at the wrong moments this feels like work, not like discovery
- `ValuesInPractice` and `CurrentlyExploring` contain discrete enumerable items — prose is not the natural format for a list of three behaviors or three current interests
- The structured format for discrete sections creates visual rhythm without introducing decorative UI — structure is earned by the content type, not imposed on it
- Narrative sections (`EngineeringPhilosophy`, `DecisionMaking`, `WorkingApproach`) are genuinely continuous arguments — prose is correct for those
- This is consistent with the spec principle: clarity over decoration. The format serves the content.

#### Container Sizing

All sections use `default` Container (896px). The About page is entirely prose and discrete-item content — no grid surfaces require the `wide` Container. Per DEC-024, this is a per-section decision, not a page-level one.

#### Consequences

- ✅ Reading experience has rhythm — prose sections and structured sections alternate naturally
- ✅ `ValuesInPractice` items are scannable — a technical evaluator can assess three behaviors quickly
- ✅ `CurrentlyExploring` entries are distinct — date signals the page is maintained
- ✅ No decorative UI introduced — structure is earned by content type
- ⚠️ `ValuesInPractice` and `CurrentlyExploring` require bespoke internal structure — not pure prose blocks
- ⚠️ Each behavior in `ValuesInPractice` must pass the specificity test: could a generic developer claim this? If yes, it is not specific enough

---

### DEC-045 — SectionBackground Variant Assignment: About Page

**Date:** 2026
**Status:** `Accepted`
**Area:** UX / Design System

#### Context

Per the precedent established in DEC-020 (`/projects`) and DEC-043 (`/lab`), SectionBackground variant assignment must be explicit and logged before implementation begins. The About page has seven sections with distinct visual character. Unlogged assignments create inconsistency over time as new pages are added.

This decision also updates the system-wide variant map maintained in `DECISIONS.md` Section 6 and `AI_CONTEXT.md` Section 5.

#### Options Evaluated Per Section

| Section                 | Options Evaluated       | Selected    |
| ----------------------- | ----------------------- | ----------- |
| `AboutHero`             | `editorial` · `mesh`    | `editorial` |
| `EngineeringPhilosophy` | `minimal` · `editorial` | `minimal`   |
| `DecisionMaking`        | `minimal` · `editorial` | `minimal`   |
| `WorkingApproach`       | `minimal` · `editorial` | `minimal`   |
| `ValuesInPractice`      | `grid` · `minimal`      | `grid`      |
| `CurrentlyExploring`    | `editorial` · `minimal` | `editorial` |
| `ConnectToWork`         | `mesh` · `editorial`    | `mesh`      |

#### Decision

| Section                 | Variant     | Rationale                                                                                                                                                                               |
| ----------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AboutHero`             | `editorial` | Document character — establishes the About page as authored, evidence-based content. Consistent with the Contact hero (DEC-037) and the projects index hero (DEC-020)                   |
| `EngineeringPhilosophy` | `minimal`   | Dense continuous prose — any background competes with the reading experience. The content carries the weight                                                                            |
| `DecisionMaking`        | `minimal`   | Same rationale — prose-heavy, argument-driven content                                                                                                                                   |
| `WorkingApproach`       | `minimal`   | Same rationale                                                                                                                                                                          |
| `ValuesInPractice`      | `grid`      | Discrete structured items benefit from subtle grid treatment — creates visual separation between behavior entries without heavy decoration                                              |
| `CurrentlyExploring`    | `editorial` | Active, living content — slight visual elevation signals this section changes over time, distinct from the stable prose sections above it                                               |
| `ConnectToWork`         | `mesh`      | Closing CTA — highest visual weight on the page. Consistent with the intent of `mesh` as the variant for surfaces where action is the primary goal. Mirrors the Home page CTA treatment |

#### Blocking Prerequisite

Verify that `grid` variant exists in `SECTION_BACKGROUND_VARIANTS` before `ValuesInPractice` is built. If absent, add it before proceeding — same blocking prerequisite pattern as `mesh` (DEC-020) and `aurora` (DEC-043).

#### System-Wide Variant Map Update

After this decision, the complete variant assignment across the portfolio is:

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
| `/about` hero                      | `mesh`      | DEC-045  |
| `/about` EngineeringPhilosophy     | `minimal`   | DEC-045  |
| `/about` DecisionMaking            | `minimal`   | DEC-045  |
| `/about` WorkingApproach           | `minimal`   | DEC-045  |
| `/about` ValuesInPractice          | `grid`      | DEC-045  |
| `/about` CurrentlyExploring        | `editorial` | DEC-045  |
| `/about` ConnectToWork             | `mesh`      | DEC-045  |

**Remaining unassigned surfaces:** None blocking. Writing surfaces are assigned in DEC-048; home sections that render the default `SectionBackground` use the component default (`minimal`) unless a future decision assigns a stronger variant.

#### Consequences

- ✅ Visual language is deliberate and consistent across all seven sections
- ✅ `mesh` used purposefully — closing CTA only, consistent with its designation
- ✅ `editorial` bookends the page — hero and CurrentlyExploring — signalling authored, living content
- ✅ Variant assignment is logged — future sessions have a reference without re-litigating
- ⚠️ `grid` variant must exist in `SECTION_BACKGROUND_VARIANTS` before `ValuesInPractice` is built — blocking prerequisite
- ⚠️ Any deviation from this assignment requires a formal amendment — not an implementation judgment call
- ⚠️ `DECISIONS.md` Section 6 and `AI_CONTEXT.md` Section 5 variant maps must be updated to reflect this decision

---

### DEC-046 — about-data.js File Location

**Date:** 2026
**Status:** `Accepted`
**Area:** Architecture / Data

#### Context

Content data for the About page must live somewhere. Two defensible locations exist, and the project has established a precedent with `contact-data.js` that may or may not apply here. The deviation — if any — must be explicit.

The early roadmap documents referenced `lib/data/` as the location for data files. The contact page data lives in `features/contact/contact-data.js`. About page data must be assigned a canonical location before Step 1 begins.

#### The Distinction Between Content Types

Not all data is the same kind of data:

| Data Type        | Examples                                       | Character                                                |
| ---------------- | ---------------------------------------------- | -------------------------------------------------------- |
| Operational data | `siteConfig`, availability flags, channel URLs | Config — governs runtime behavior                        |
| Content data     | Project records, post records, lab entries     | Authored content — could come from a CMS                 |
| Feature data     | Contact channels, looking-for entries          | Feature-specific content tied to a specific page's logic |

`about-data.js` contains authored prose — engineering philosophy, decision-making narrative, working approach, values, current explorations. It is not operational config. It is not feature-specific logic. It is authored content.

#### Options Considered

| Option                         | Rationale                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------ |
| `features/about/about-data.js` | Consistent with `contact-data.js` pattern — feature-scoped, self-contained                       |
| `lib/data/about-data.js`       | Content data belongs with other content data — `projects.js`, `lab.js`, `posts.js` all live here |

#### Decision

**`features/about/about-data.js`** — feature-scoped, consistent with the contact pattern.

#### Reasoning

- `contact-data.js` is in `features/contact/` — consistency with this pattern prevents a split convention where some feature content is in `lib/data/` and some is in `features/`
- The About page content is not content in the same sense as project records or post files — it is not individually addressable, not indexed, not paginated, and not sourced from a filesystem. It is a single structured object that one page consumes entirely
- `lib/data/` is the location for addressable content records: `projects.js` (indexed by slug), `lab.js` (indexed by slug), `posts.js` (indexed by slug). `about-data.js` has no slug, no index, no dynamic routing — it does not belong in the same category
- Feature-scoped placement keeps the About feature self-contained. If the About page is ever refactored, its data moves with it

#### What `about-data.js` Exports

```js
// features/about/about-data.js

export const aboutData = {
  hero: {
    positioning: "", // One sentence — survives a 5-second test
  },
  engineeringPhilosophy: {
    narrative: "", // Continuous prose — how problems are approached
    examples: [
      // Two to three concrete examples from real decisions
      { principle: "", implication: "" },
    ],
  },
  decisionMaking: {
    narrative: "", // How tradeoffs are evaluated
    scenarios: [
      // Two to three real tradeoff scenarios
      { situation: "", reasoning: "", outcome: "" },
    ],
  },
  workingApproach: {
    narrative: "", // Collaboration and delivery in practice
  },
  valuesInPractice: [
    // Three to four discrete behaviors — per DEC-044
    { behavior: "", explanation: "" },
  ],
  currentlyExploring: [
    // Two to three dated entries — per DEC-047
    { topic: "", detail: "", date: "" },
  ],
  connectToWork: {
    projectsCopy: "", // Specific — what the projects section contains
    contactCopy: "", // Specific — what kind of engagement is welcome
  },
};
```

#### Content Standard for Every Field

Every string in `aboutData` must pass the writing standard from `PORTFOLIO_V2_SPEC.md Section 8`:

- **Precise** — no word that does not carry meaning
- **Concrete** — every claim supported by evidence or example
- **Direct** — no hedging, no passive voice
- **First person** — authored work, not a company report

No field ships as a placeholder. No field ships as a generic statement a hundred other developers could claim.

#### Consequences

- ✅ Consistent with `contact-data.js` pattern — no split convention
- ✅ About feature is self-contained — data and components co-located
- ✅ Clean separation from addressable content records in `lib/data/`
- ⚠️ If About content is ever migrated to a CMS, this file is the extraction point — the schema above is the data contract
- ⚠️ All fields must be written to the writing standard before any component is built — no exceptions

---

### DEC-047 — CurrentlyExploring Update Mechanism

**Date:** 2026
**Status:** `Accepted`
**Area:** UX / Data

#### Context

The spec requires the `CurrentlyExploring` section to be "active, specific, not vague." Active implies the content changes over time. A static section that never updates reads as abandoned — the opposite of the signal it is meant to send.

Two approaches exist, with different implications for the data schema and the visible output.

#### Options Considered

| Option                                                         | Implication                                                                                                                                            |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Static strings in `about-data.js` — developer updates manually | Simple, no infrastructure, no visible timestamp. Relies entirely on the developer remembering to update                                                |
| Dated entries with a visible timestamp per item                | Each entry carries a date. The rendered output shows when the interest was logged. Signals the page is maintained without requiring any infrastructure |

#### Decision

**Dated entries with a visible timestamp per item.**

Each `currentlyExploring` entry carries a `date` field rendered visibly alongside the topic. The date signals recency to the evaluator — it is the difference between "this person is actively exploring this" and "this was written once and forgotten."

#### Schema — Per DEC-046

```js
currentlyExploring: [
  {
    topic:       "",    // Short label — "Vector search degradation at scale"
    detail:      "",    // One to two sentences — specific and concrete
    date:        "",    // "Q2 2026" or "May 2026" — rendered visibly
  }
],
```

#### Content Standard for CurrentlyExploring Entries

Each entry must pass this specificity test before it ships:

| Test            | Pass                                                                                                                       | Fail                                          |
| --------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Specific enough | "Exploring how vector search degrades at scale on commodity hardware and what the practical embedding size thresholds are" | "Interested in AI"                            |
| Distinct        | Something a collaborator who has worked with Alex would recognise as current and genuine                                   | A topic that has been "current" for two years |
| Dated           | "Q2 2026" — visible, specific enough to signal recency                                                                     | No date, or a year only                       |

#### Maximum Entry Count

Two to three entries. More than three signals breadth over depth — the opposite of this portfolio's positioning.

#### Update Protocol

When `currentlyExploring` entries change:

1. Update `features/about/about-data.js`
2. Update the `date` field on any entry that has changed
3. Remove entries that are no longer genuinely current
4. Commit — no deployment config change required

This is a one-file update. Zero infrastructure overhead.

#### Why Not a Timestamp System or CMS Field

- A CMS field or automated timestamp adds infrastructure for a section that changes at most quarterly — the overhead is not justified
- An automated `updatedAt` timestamp on the page level is misleading — it reflects when any file changed, not when the exploration content changed
- Per-entry dates are more honest: they show when each specific interest was logged, not when the page was last touched

#### Consequences

- ✅ Visible recency signal per entry — evaluator knows this is maintained
- ✅ Zero infrastructure — one file, one commit to update
- ✅ Per-entry dating is more precise than page-level timestamps
- ✅ Maximum three entries enforces depth over breadth
- ⚠️ Entries must be updated when interests genuinely change — a stale date with a "current" framing damages credibility
- ⚠️ Date format must be consistent — "Q2 2026" or "May 2026" — decide one format and apply it across all entries

---

## 5. Proposed Amendments

> No amendments currently proposed.

---

## 6. Superseded Decisions

> None at this time.

---

## 7. Deprecated Decisions

> None at this time.
