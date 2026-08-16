# PORTFOLIO_V2_SPEC.md — Product Specification

**Project:** alexshedrach.dev
**Version:** 2.1.0
**Last Updated:** 2026
**Classification:** Product Specification — Authoritative Requirements Document

---

## 0. How to Use This Document

This is the **canonical product specification** for Portfolio V2. It defines what is being built, why, and to what standard.

All AI contributions, design decisions, and engineering work must be traceable to a requirement in this document or a logged entry in `DECISIONS.md`.

| Document        | Relationship to This File                     |
| --------------- | --------------------------------------------- |
| `AI_CONTEXT.md` | Behavioral contract and engineering standards |
| `DECISIONS.md`  | Log of decisions made in service of this spec |
| `ROADMAP.md`    | Execution plan against these requirements     |

When this spec and another document conflict, raise it explicitly — do not silently resolve it.

---

## 1. Product Vision

### Statement

> alexshedrach.dev is a productized engineering portfolio — a software system designed to demonstrate how problems are approached, systems are architected, and products are shipped.

### What This Means in Practice

This is not a personal website with a projects section. It is a **software product** whose domain happens to be its own creator's engineering identity.

Every decision — information architecture, content hierarchy, component design, performance budget — is evaluated through that lens.

### Differentiation Mandate

The market is saturated with portfolios that share the same structure, the same sections, and the same generic copy. Portfolio V2 must be immediately distinguishable — not through visual novelty, but through the quality of thinking it surfaces.

A technical evaluator must feel, within the first 10 seconds, that they are looking at the work of a senior engineer — not a template.

---

## 2. Target Audience

### Primary Audiences

| Audience                  | What They Need to See                                                  | Evaluation Timeframe |
| ------------------------- | ---------------------------------------------------------------------- | -------------------- |
| Technical Hiring Managers | Architectural depth · Reasoning quality · Engineering standards        | 60 seconds           |
| Senior Engineers          | System thinking · Code quality · Depth of explanation                  | 2–5 minutes          |
| Technical Recruiters      | Clear positioning · Seniority signal · Memorable differentiation       | 5–10 seconds         |
| Startup Founders          | Problem-solving approach · Delivery capability · Technical credibility | 60–90 seconds        |

### Secondary Audiences

| Audience                          | Purpose                                        |
| --------------------------------- | ---------------------------------------------- |
| Engineering Collaborators         | Evaluate working style and technical standards |
| Developers Exploring Architecture | Reference for system design patterns           |

### Primary Evaluation Window

**First 5–10 seconds** must establish credibility through layout, hierarchy, and language — before the user has read a single sentence of content.

---

## 3. Success Criteria

### User Experience

| Criterion           | Standard                                                                             |
| ------------------- | ------------------------------------------------------------------------------------ |
| Positioning clarity | Visitor understands who Alex is and what he builds within 10 seconds                 |
| Seniority signal    | Technical evaluator recognizes senior-level thinking within 60 seconds               |
| Project depth       | Each case study communicates decisions, tradeoffs, and outcomes — not just results   |
| Navigation intent   | Every route transition feels deliberate — no dead ends, no confusion                 |
| Memorability        | The experience is distinct enough to be recalled after reviewing 10 other portfolios |

### Technical

| Metric                   | Target                       |
| ------------------------ | ---------------------------- |
| Lighthouse Performance   | ≥ 95                         |
| Lighthouse Accessibility | ≥ 95                         |
| Cumulative Layout Shift  | ≤ 0.1                        |
| First Contentful Paint   | ≤ 1.2s                       |
| Time to Interactive      | ≤ 2.5s                       |
| JS Payload               | Minimal — every KB justified |

---

## 4. Technology Stack

### Decisions Summary

All framework decisions are logged in `DECISIONS.md`. The table below reflects current accepted decisions only.

| Layer      | Choice                             | Rationale                                                |
| ---------- | ---------------------------------- | -------------------------------------------------------- |
| Framework  | Next.js App Router (latest stable) | RSC, built-in routing, Vercel-native, server-first       |
| Language   | JavaScript (ES2024+)               | ESLint as primary static analysis                        |
| Styling    | TailwindCSS (latest)               | Utility-first, consistent with design system token model |
| Deployment | Vercel                             | Preview deployments, Edge network, framework-native      |
| Rendering  | Server Components by default       | Minimum client JS, performance-first                     |

### Rendering Rules

| Context                                    | Strategy                                                                                      |
| ------------------------------------------ | --------------------------------------------------------------------------------------------- |
| Default                                    | React Server Components (RSC)                                                                 |
| Interactive UI (forms, modals, animations) | `use client` — scoped to minimum boundary, never the page                                     |
| Data fetching                              | Server-side async RSC — no client-side fetching unless justified                              |
| State                                      | Local component state first. No global state without explicit justification in `DECISIONS.md` |

---

## 5. Information Architecture

```
alexshedrach.dev/
│
├── /                        # Home — positioning and identity
├── /projects                # Project index — curated case studies
│   └── /projects/[slug]     # Individual case study — full engineering narrative
├── /writing                 # Technical writing — communication layer
│   └── /writing/[slug]      # Individual post — rooted in real project decisions
├── /about                   # Engineering philosophy — not biography
├── /lab                     # Experiments — technical exploration
│   └── /lab/[slug]          # Individual lab entry — full narrative depth
└── /contact                 # Deliberate entry point — not a footer form
```

### Route Intent

| Route              | Primary Goal                                                       | Secondary Goal                                       |
| ------------------ | ------------------------------------------------------------------ | ---------------------------------------------------- |
| `/`                | Establish credibility in < 10 seconds                              | Drive navigation to projects                         |
| `/projects`        | Surface engineering depth — hero frames curation, grid delivers it | Filter by domain when volume justifies it            |
| `/projects/[slug]` | Full case study — hero orients in 10 seconds, prose delivers depth | Evidence of senior-level thinking                    |
| `/writing`         | Surface technical communication depth                              | Drive SEO and return visits                          |
| `/writing/[slug]`  | Full technical post rooted in real project decisions               | Demonstrate explanation ability                      |
| `/about`           | Communicate engineering philosophy                                 | Establish trust and working style                    |
| `/lab`             | Demonstrate curiosity and technical range                          | Surface experimental work without diluting /projects |
| `/lab/[slug]`      | Full lab entry — exploration, findings, production influence       | Demonstrate intellectual honesty including dead ends |
| `/contact`         | Create a deliberate, low-friction contact path                     | Qualify intent before the message is written         |

---

## 6. Page Specifications

---

### 6.1 Home `/`

**Goal:** Establish immediate, accurate positioning. No scroll required for the primary credibility signal.

**Non-Goal:** Listing every skill, tool, or project.

#### Required Sections — In Order

| Section                | Purpose                                                       | Content Standard                                   |
| ---------------------- | ------------------------------------------------------------- | -------------------------------------------------- |
| Hero                   | Identity and positioning — who, what, why it matters          | One sentence that survives a 5-second test         |
| Selected Systems       | 2–3 projects demonstrating architectural thinking             | `ProjectCard` components — signal-optimized layout |
| Engineering Principles | How problems are approached — not values, not motivations     | 3–4 principles with concrete implications          |
| Proof of Work          | Quantified outcomes, metrics, or external validation          | Numbers over adjectives                            |
| Writing System         | Technical posts surface — minimum one published at launch     | Post cards — readable without visiting /writing    |
| About Teaser           | Compressed identity signal — human context, routes to /about  | Brief, distinct from /about — no duplication       |
| Resource Callout       | Single intentional resource that reinforces engineering depth | One callout only — not a links list, kept current  |
| Hire Me / Contact      | Peak-intent CTA — what work is welcome, path to /contact      | Specific about work type — no generic copy         |

#### Home Page Constraints

- No raw Tailwind in the page file
- Page follows `RootLayout → Section → Container → Content` without deviation
- `/writing` section does not render until minimum one published post exists
- Resource Callout is singular — never a links list

---

### 6.2 Projects `/projects`

**Goal:** A curated index of engineering case studies — not a portfolio gallery.

**Non-Goal:** Showing every project ever built. An FAQ section. Three-column grid at any breakpoint.

#### Project Index — Static Behaviour

Always present regardless of data state:

- Maximum 6 featured projects at launch — depth over breadth
- Each card surfaces: problem domain, key constraint, primary outcome
- Two-column grid at desktop, one column on mobile — per DEC-023
- List/grid view toggle — default grid, preference persisted — per DEC-028
- `AvailabilitySignal` in hero when `siteConfig.available === true` — per DEC-029

#### Project Index — Conditional Behaviour

All features built in Phase 3. Data drives visibility. No future implementation sessions required — per DEC-031.

| Feature                    | Activates When                                          |
| -------------------------- | ------------------------------------------------------- |
| Currently building callout | Any project has `currentlyBuilding: true` — per DEC-030 |
| Domain filter pills        | 2+ domains have 2+ projects each — per DEC-019          |
| Status filter toggle       | 2+ distinct status values exist — per DEC-019           |
| Stack filter               | 10+ total projects — per DEC-019                        |
| Clear filters link         | Any filter active in URL — per DEC-019                  |
| Empty state                | Active filters return zero results                      |
| Dynamic project count      | Any filter currently active                             |
| Pagination controls        | Total projects exceed 8 — per DEC-027                   |

#### Case Study `/projects/[slug]` — Section Order

Every section below is required unless marked conditional. No section is optional unless explicitly stated.

| Section                                                                                        | Renders                                            | Decision                  |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------- |
| Hero — breadcrumb, domain, title, summary, metrics strip, stack, status, year, demo/repo links | Always                                             | DEC-021, DEC-018, DEC-032 |
| Problem                                                                                        | Always                                             | DEC-017                   |
| Constraints                                                                                    | Always                                             | DEC-017                   |
| Architecture                                                                                   | Always                                             | DEC-017                   |
| Decisions                                                                                      | Always                                             | DEC-017                   |
| Tradeoffs                                                                                      | Always                                             | DEC-017                   |
| Outcome                                                                                        | Always                                             | DEC-017                   |
| Challenges and Solutions                                                                       | Conditional — when `challenges` array is populated | DEC-033                   |
| Testimonial                                                                                    | Conditional — when `testimonial` field is not null | DEC-022                   |
| Next / Previous navigation                                                                     | Always — edge cases handled, no empty UI states    | DEC-035                   |

#### Case Study Wide Viewport Layout

```
┌─────────────────┬────────────────────────────────────┐
│  StickyOutline  │  Hero                              │
│  (use client)   │  Problem · Constraints             │
│  wide viewport  │  Architecture · Decisions          │
│  only           │  Tradeoffs · Outcome               │
│                 │  Challenges & Solutions            │
│                 │  Testimonial                       │
│                 │  Next / Previous                   │
└─────────────────┴────────────────────────────────────┘
```

#### Project Schema — Complete Field Reference

```js
{
  // Core identity
  slug:              "",        // URL slug for /projects/[slug]
  title:             "",        // Project name
  summary:           "",        // One sentence — case study hero. Not a paragraph.
  domain:            "",        // Problem domain / industry
  year:              "",        // Project year
  status:            "wip",     // "live" | "wip" | "archived" — per DEC-015

  // Optional links — render conditionally when non-empty
  demoUrl:           "",        // Live demo — per DEC-032
  repoUrl:           "",        // Repository — per DEC-032

  // Card display fields
  constraint:        "",        // Key constraint navigated — ProjectCard
  outcome:           "",        // Prose outcome — preserved per DEC-018 amendment
  stack:             [],        // Technology array — rendered as badges
  featured:          false,     // Surfaces on Home page Selected Systems
  currentlyBuilding: false,     // One true at a time — per DEC-030

  // Hero metrics — optional, 3–4 max, per DEC-018 amendment
  metrics: [
    { value: "", label: "", trend: "" }  // trend: "up" | "down" | "neutral"
  ],

  // Case study prose — six required fields
  caseStudy: {
    problem:       "",
    constraints:   "",
    architecture:  "",
    decisions:     "",
    tradeoffs:     "",
    outcome:       "",
  },

  // Challenges — optional, 3–5 entries max, per DEC-033
  challenges: [
    { challenge: "", resolution: "" }
  ],

  // Testimonial — optional, per DEC-022
  testimonial: {
    quote:        "",   // No quotation marks in the string — component handles them
    name:         "",
    title:        "",
    organisation: "",
  } | null,
}
```

#### Case Study Content Standards

| Standard         | Requirement                                             |
| ---------------- | ------------------------------------------------------- |
| Metrics          | Real and verifiable — fabricated numbers are prohibited |
| Challenges       | Specific — not generic problem descriptions             |
| Resolutions      | Concrete — what was done, not that it was fixed         |
| Testimonials     | First person · specific · no generic praise language    |
| Demo links       | Verified live before populating `demoUrl`               |
| Summary field    | Single sentence — not a paragraph                       |
| Challenges count | Minimum 3, maximum 5 per project                        |
| Metrics count    | Maximum 3–4 per hero — space is constrained             |

---

### 6.3 Writing `/writing`

**Goal:** Demonstrate technical depth through explanation — not just execution. Writing proves understanding well enough to teach.

**Non-Goal:** A personal blog. Opinions, updates, or general commentary. Posts not rooted in real technical decisions.

#### Post Requirements

Every post must satisfy all of the following:

| Requirement            | Standard                                                     |
| ---------------------- | ------------------------------------------------------------ |
| Rooted in real work    | Tied to an actual project, decision, or system built         |
| Technical depth        | Explains the why, not just the what                          |
| Accessible             | A strong junior engineer can follow it without prior context |
| Standalone             | Readable without having seen the related case study          |
| Meets writing standard | Precise · Concrete · Direct — per Section 8                  |

#### Launch Requirement

The `/writing` route is not linked in navigation until **minimum one fully published post** exists. An empty writing section signals intention without evidence. 

#### Index Requirements

- Post cards surface: title, one-sentence summary, estimated read time
- No pagination until 6+ posts exist
- No categories until posts divide into genuinely distinct groups

#### Writing Schema

```js
{
  slug:        "",    // URL slug for /writing/[slug]
  title:       "",    // Post title
  summary:     "",    // One sentence — index card
  readTime:    "",    // Estimated read time — "8 min read"
  published:   "",    // Publication date
  project:     "",    // Related project slug — optional cross-reference
  tags:        [],    // Topics / technologies
}
```

---

### 6.4 About `/about`

**Goal:** Communicate engineering philosophy, decision-making style, and working approach.

**Non-Goal:** Biography, career timeline, or skills list.

#### Required Content

| Content Area           | Standard                                                 |
| ---------------------- | -------------------------------------------------------- |
| Engineering Philosophy | How problems are approached — with concrete implications |
| Decision-Making Style  | How tradeoffs are evaluated — not personality traits     |
| Working Approach       | How collaboration and delivery work in practice          |
| Currently Exploring    | Technical curiosity — active, specific, not vague        |

#### Definition of Done

- No biography, career timeline, or skills list exists on this page
- A reader understands how Alex thinks and works within 90 seconds
- Content meets the writing standard in Section 8

---

### 6.5 Lab `/lab`

**Goal:** Demonstrate intellectual curiosity, technical range, and willingness to explore outside production constraints.

**Non-Goal:** A dumping ground for unfinished work. A second projects page. Entries without documented learnings.

#### Lab Architecture

Two surfaces — per DEC-040:

```
/lab              Index — surfaces all entries via LabCard grid
/lab/[slug]       Detail — full entry narrative, three required fields
```

#### Lab Index Requirements

- `aurora` SectionBackground variant on hero — per DEC-043
- Hero copy explicitly frames the lab as distinct from `/projects`
- `LabCard` grid — two columns desktop, one column mobile
- Entry type indicator visible on every card
- `status: "abandoned"` renders with distinct muted treatment — not hidden
- At least one complete entry live before `/lab` links in navigation

#### Lab Entry `/lab/[slug]` — Required Sections

| Section                                                                      | Renders                      | Standard                                                    |
| ---------------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------- |
| Hero — type, title, summary, tags, status, year, sourceUrl, demoUrl, repoUrl | Always                       | Single sentence summary                                     |
| Exploration                                                                  | Always                       | What was being explored and why                             |
| Findings                                                                     | Always                       | What was learned — including if the experiment failed       |
| Production Influence                                                         | Always — null state explicit | "No production influence" when empty — section never absent |

#### Lab Schema — Complete Field Reference

```js
{
  // Core identity
  slug:     "",      // URL slug for /lab/[slug]
  title:    "",      // Entry title
  summary:  "",      // One sentence — what was being explored
  year:     "",      // Year of the experiment

  // Classification
  type:     "",      // "experiment" | "tool" | "visualization" | "exploration"
  status:   "",      // "active" | "complete" | "abandoned"
  tags:     [],      // Tech stack / tools / concepts
  featured: false,   // Surfaces on Home page or Lab teaser

  // Narrative — three required fields, per DEC-041
  entry: {
    exploration: "",   // What was being explored and why
    findings:    "",   // What was learned — including failed experiments
    influenced:  "",   // Production influence — empty string is valid, renders null state
  },

  // Optional links — render conditionally when non-empty
  demoUrl:   "",     // Live demo
  repoUrl:   "",     // Repository
  sourceUrl: "",     // Reference material — paper, post, or spec that prompted the experiment
}
```

#### Lab Content Standards

| Standard              | Requirement                                                                 |
| --------------------- | --------------------------------------------------------------------------- |
| `influenced` empty    | Renders "No production influence" — section never absent                    |
| `status: "abandoned"` | Muted visual treatment — never hidden                                       |
| `sourceUrl`           | Link to original source when experiment was prompted by external material   |
| Findings              | Honest — failed experiments are valid and expected                          |
| Entry count           | Minimum 3, maximum 5 challenges per entry — same discipline as case studies |

#### Resolved Content Prerequisite

The first live lab entry is `offline-sync-conflict-resolution` (`Conflict Resolution Strategies for Offline-First Sync`). It is defined in `src/lib/data/lab.js` and satisfies the Phase 5 requirement for a complete entry before `/lab` links in navigation.

---

### 6.6 Contact `/contact`

**Goal:** A deliberate, low-friction entry point for qualified inbound.

**Non-Goal:** A form that collects every possible field. A CAPTCHA-gated utility page.

#### Page Layout — Per DEC-037

```
Desktop (lg+)
┌──────────────────────────────────────────────────────┐
│  ContactHero  (default Container — 896px)            │
│  AvailabilitySignal                                  │
└──────────────────────────────────────────────────────┘
┌─────────────────────────────┬────────────────────────┐
│  ContactForm (60%)          │  LookingFor            │  wide Container — 1152px
│                             │  QuickReach            │
│                             │  AvailabilitySignal    │
└─────────────────────────────┴────────────────────────┘

Mobile / Tablet (stacked)
ContactHero → AvailabilitySignal → LookingFor → ContactForm → QuickReach
```

#### Requirements

| Requirement    | Standard                                                                      |
| -------------- | ----------------------------------------------------------------------------- |
| Form fields    | Name · Email · Message only — no additional fields                            |
| Intent framing | `LookingFor` section communicates what work is welcome                        |
| Response time  | `AVAILABILITY.responseTime` visible before submit — not only in success state |
| Direct email   | Surfaced in `QuickReach` — no friction alternative to the form                |
| CAPTCHA        | Not shipped unless spam is a documented post-launch problem                   |
| Honeypot       | Hidden field in server action — silent rejection when populated, per DEC-039  |

#### What Does Not Ship With Contact

| Feature                      | Status                                                 |
| ---------------------------- | ------------------------------------------------------ |
| CAPTCHA                      | Not shipping — per spec                                |
| Calendar booking integration | Not shipping — out of scope                            |
| Multi-step form              | Not shipping — field count does not justify complexity |

---

## 7. Design System

### Philosophy

The Design System is the **single permitted source of UI decisions**. Pages compose components. Pages do not contain styling logic.

> No raw Tailwind in page files. This is a closed decision — see DEC-004.

### Visual Language

| Token      | Specification                                                           |
| ---------- | ----------------------------------------------------------------------- |
| Style      | Minimal · Structured · Professional · Modern (2026 standard)            |
| Spacing    | 4px/8px base grid — applied consistently across all components          |
| Color      | Semantic only · WCAG AA accessibility required throughout               |
| Typography | Clear hierarchy · Limited scale variation · Readability over expression |
| Motion     | Subtle · Intentional · Explains hierarchy or state — never decorative   |

### Layout Contract

Every page must conform to this hierarchy:

```
RootLayout
  └── Section (× n — one per content area)
        └── Container (size: default | wide | full — chosen per section)
              └── [Feature Content]
```

Container size is a **per-section decision** — not a per-page decision. See DEC-024.

### Container Sizing

| Size      | Width  | Appropriate For                                                 |
| --------- | ------ | --------------------------------------------------------------- |
| `default` | 896px  | Prose-heavy sections — hero copy, about content, writing posts  |
| `wide`    | 1152px | Grid sections — project index, card layouts, two-column contact |
| `full`    | 100%   | Full-bleed sections — only when content explicitly requires it  |

### SectionBackground Variant Assignment

All variant assignments are logged decisions. Implementation follows the log — not judgment.

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

**Unassigned:** None blocking. Home sections that render the default `SectionBackground` use the component default (`minimal`) unless a future decision assigns a stronger variant.

### Core Component Inventory

| Component            | Location             | Responsibility                                         |
| -------------------- | -------------------- | ------------------------------------------------------ |
| `RootLayout`         | `components/layout/` | Global shell — nav, footer, providers                  |
| `Section`            | `components/layout/` | Vertical rhythm and spacing unit                       |
| `Container`          | `components/layout/` | Horizontal constraint — size per section               |
| `SectionHeader`      | `components/ui/`     | Consistent section titles and subtitles                |
| `Button`             | `components/ui/`     | Primary, secondary, ghost variants                     |
| `Badge`              | `components/ui/`     | Label and tag display                                  |
| `Tag`                | `components/ui/`     | Filter pill and taxonomy display                       |
| `Card`               | `components/ui/`     | Structured content container                           |
| `Heading`            | `components/ui/`     | Typography hierarchy H1–H4                             |
| `Text`               | `components/ui/`     | Body copy with size and weight variants                |
| `Avatar`             | `components/ui/`     | Person display with initials fallback                  |
| `MetricBadge`        | `components/ui/`     | Outcome-oriented data display                          |
| `ProjectCard`        | `components/ui/`     | Project summary — grid and list variants               |
| `LabCard`            | `components/ui/`     | Lab entry summary — shared across /lab and Home        |
| `AvailabilitySignal` | `components/ui/`     | Pulsing dot + label — nav, projects hero, contact hero |
| `ProjectsIndexSections` | `features/projects/` | Projects index visual shell — hero, filters, grid    |
| `CaseStudySections`  | `features/projects/` | Case study page visual shell — hero, outline, prose   |
| `CaseStudyLayout`    | `features/projects/` | Full case study structure — data-coupled               |
| `StickyOutline`      | `features/projects/` | Scroll-tracked section outline — wide viewport only    |
| `AnchorCopy`         | `features/projects/` | Copy anchor link — clipboard write only                |
| `WritingPageSections` | `features/writing/`  | Writing index visual shell — hero and filtered body    |
| `ContactFormGrid`    | `features/contact/`  | Contact form/sidebar section with mobile-first stack   |

All components must expose stable, predictable APIs and support long-term extension without breaking changes.

---

## 8. Content Strategy

### Content Hierarchy

Every piece of content must serve one of these purposes:

1. **Establish credibility** — demonstrate seniority without stating it
2. **Surface depth** — show how problems were approached, not just solved
3. **Create signal** — give evaluators something concrete to hold onto

### What to Prioritize

| ✅ Include                                       | ❌ Exclude                             |
| ------------------------------------------------ | -------------------------------------- |
| Specific decisions and why they were made        | Vague descriptions of project outcomes |
| Tradeoffs that were consciously accepted         | Technology lists without context       |
| Measurable outcomes — numbers, not adjectives    | Generic achievement language           |
| Engineering constraints that shaped the solution | Buzzwords and filler copy              |
| What would be done differently in retrospect     | Skills lists and tool inventories      |

### Writing Standard

- **Precise** — no word that does not carry meaning
- **Concrete** — every claim supported by evidence or example
- **Direct** — no hedging, no passive voice, no over-qualification
- **First person** — this is authored work, not a company report

---

## 9. Migration from Portfolio V1

### Position of V1

V1 is **reference material only** — not a foundation. Its code is not imported, its structure is not replicated.

### Migration Process

| Step | Action                                                                  |
| ---- | ----------------------------------------------------------------------- |
| 1    | Extract project ideas worth re-presenting                               |
| 2    | Re-evaluate each project against case study requirements in Section 6.2 |
| 3    | Rebuild content from scratch — do not copy V1 descriptions              |
| 4    | Evaluate V1 UI patterns — keep only what meets V2 design standards      |
| 5    | Archive V1 repository — preserve commit history as engineering record   |

### What Is Not Migrated

- Legacy component structure
- V1 design patterns
- Raw CSS or unstructured Tailwind
- Any page architecture that does not conform to the layout contract

---

## 10. AI Collaboration Contract

Full behavioral contract is defined in `AI_CONTEXT.md`. The following applies specifically to spec compliance.

### Mandatory Behaviors

| Situation                             | Required Behavior                                               |
| ------------------------------------- | --------------------------------------------------------------- |
| Producing any output                  | Verify it aligns with a stated requirement in this spec         |
| Proposing UI patterns                 | Confirm compliance with Design System and layout contract       |
| Suggesting new features               | Evaluate against product vision — does this serve the audience? |
| Generating content copy               | Apply writing standard from Section 8                           |
| Encountering a spec gap               | Flag it explicitly — do not fill gaps with assumptions          |
| Assigning a SectionBackground variant | Verify the assignment exists in the variant table above         |

### Prohibited Behaviors

- Generating UI that introduces raw Tailwind in page files
- Suggesting sections not justified by audience needs in Section 2
- Producing generic project descriptions that fail the content standard in Section 8
- Recommending dependencies without bundle size and maintenance justification
- Choosing a SectionBackground variant without a logged decision

---

## 11. Future Expansion

### Planned Capabilities

Future scope only — not current requirements. Must not influence current architecture beyond ensuring the foundation can support them.

| Capability                  | Trigger Condition                                  |
| --------------------------- | -------------------------------------------------- |
| Interactive Demos           | When a project warrants in-browser demonstration   |
| Technical Writeups (PDF)    | When case study depth exceeds web format           |
| AI-Assisted Lab Experiments | When a specific experiment is scoped and ready     |
| RSS / Content Feed          | When writing is active and audience is established |
| Lab Home Teaser             | When 3+ featured lab entries exist — Phase 8       |

### Architectural Constraint

Future expansion must not require structural changes to the current layout contract, routing system, or design system. If a new capability cannot be absorbed without breaking changes, it requires a decision log entry before implementation begins.

---

## 12. Definition of Done

### Feature Level

A feature is complete when all of the following are true:

- [ ] UX intent is clear without explanation
- [ ] Component follows the layout contract
- [ ] No raw Tailwind exists in page files
- [ ] Performance impact is understood and acceptable
- [ ] Accessibility requirements are met (WCAG AA)
- [ ] Code is readable without comments explaining what it does

### Page Level

A page is complete when:

- [ ] All required sections from Section 6 are implemented
- [ ] Content meets the writing standard in Section 8
- [ ] Mobile and desktop layouts are both intentional
- [ ] The page has been reviewed against its stated goal in the Route Intent table
- [ ] SectionBackground variants match the assignment table in Section 7

### Release Level

A release is complete when:

- [ ] Lighthouse scores meet targets in Section 3
- [ ] No console errors or warnings in production build
- [ ] All `DECISIONS.md` entries relevant to this release are logged
- [ ] Preview deployment has been reviewed before merging to `main`

---

## 13. Final Directive

> Every feature, component, and line of content must serve one purpose: demonstrating that this engineer thinks in systems, ships with intention, and builds software that works.

Nothing ships that cannot be traced to that purpose.
