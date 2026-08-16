# AI_CONTEXT.md

**Project:** alexshedrach.dev
**Version:** 2.1.0
**Last Updated:** 2026
**Classification:** Persistent AI Session Context — Load Before Every Session

---

## 0. Preface — How to Use This Document

This file is the **single source of truth** for all AI collaboration on this project.

Before producing any output, the AI must:

1. Read this document in full
2. Load `DECISIONS.md` and the relevant phase sub-file — these are ground truth
3. Cross-reference `ROADMAP.md` for current execution state
4. Never contradict a logged decision without explicitly flagging it as a proposed amendment

This document does not expire. It evolves. Every major project shift must be reflected here.

---

## 1. Project Identity

| Field              | Value                                                                       |
| ------------------ | --------------------------------------------------------------------------- |
| **Product Name**   | alexshedrach.dev                                                            |
| **Classification** | Productized Developer Portfolio                                             |
| **Version**        | V2 — Clean Rebuild                                                          |
| **Owner**          | Alex Shedrach                                                               |
| **Role Signal**    | Senior Frontend Engineer                                                    |
| **Stack**          | Next.js 16 App Router · JavaScript · Tailwind CSS v4 · Vercel               |
| **Rendering**      | Server-first. Client-side only when strictly required                       |
| **Deployment**     | Vercel. Preview on branch push. Production from `main`. See `DEPLOYMENT.md` |

---

## 2. Product Positioning

### Core Statement

> This portfolio exists to demonstrate how I architect, engineer, and ship software — not merely what I have built.

### What This Is

A **software product** functioning as a developer identity system. It communicates engineering thinking, system design fluency, and production-grade execution.

### What This Is Not

| ❌ Avoid                | ✅ Instead                       |
| ----------------------- | -------------------------------- |
| Resume dump             | Curated case studies with depth  |
| Skills-list page        | Systems and decisions on display |
| Animation showcase      | Purposeful, minimal motion       |
| Template portfolio      | Differentiated product thinking  |
| Trend-driven experiment | Timeless, structured engineering |

### Target Audience

| Audience                  | Primary Signal Needed                            |
| ------------------------- | ------------------------------------------------ |
| Technical Hiring Managers | Architectural depth · Reasoning quality          |
| Recruiters                | Clear positioning · Fast comprehension           |
| Engineering Collaborators | System thinking · Code quality standards         |
| Technical Clients         | Problem-solving approach · Delivery track record |

### Evaluation Window

**First 5–10 seconds** must establish credibility. The layout, hierarchy, and language must do this without requiring any user action.

---

## 3. Objectives

### Primary

1. Demonstrate senior-level frontend engineering capability
2. Communicate systems thinking, not isolated component work
3. Deliver structured, intentional UX that respects the user's time
4. Differentiate clearly from generic portfolio patterns
5. Maintain measurable performance as a product requirement

### Success Criteria

- A technical hiring manager understands seniority level within **60 seconds**
- Projects communicate **decisions and tradeoffs**, not just outcomes
- The site reads as a **real product**, not a personal homepage
- Performance is **measurable, fast, and documented**
- The experience is **memorable** without being decorative

---

## 4. Architecture

### Application Structure

```
src/
│
├── app/                               # Routing and application wiring
│   ├── layout.jsx                     # Root layout
│   ├── page.jsx                       # Home — positioning and identity
│   ├── providers.jsx                  # Client providers
│   ├── robots.js                      # robots.txt metadata route
│   ├── sitemap.js                     # sitemap.xml metadata route
│   ├── manifest.js                    # manifest.webmanifest metadata route
│   ├── about/                         # Engineering philosophy — not biography
│   ├── projects/                      # Project index — curated case studies
│   │   └── [slug]/                    # Individual case study
│   ├── writing/                       # Technical writing — per DEC-010
│   │   └── [slug]/                    # Individual post
│   ├── lab/                           # Experiments — per DEC-040
│   │   └── [slug]/                    # Individual lab entry — per DEC-040
│   └── contact/                       # Intentional entry point — not a footer form
│
├── components/
│   ├── layout/                        # Structural layout primitives
│   │   ├── RootLayout/
│   │   ├── Section/
│   │   └── Container/
│   │
│   └── ui/                            # Design System components
│       ├── Button/
│       ├── Card/
│       ├── Heading/
│       ├── Text/
│       ├── Badge/
│       ├── Tag/
│       ├── Avatar/
│       ├── SectionHeader/
│       ├── MetricBadge/
│       ├── ProjectCard/               # Shared — Home + Projects index, per DEC-006
│       ├── LabCard/                   # Shared — Lab index + Home teaser, per DEC-042
│       └── AvailabilitySignal/        # Shared — Nav + Projects hero + Contact hero, per DEC-038
│
├── features/                          # Feature-scoped modules
│   ├── home/
│   ├── projects/
│   │   ├── CaseStudyLayout/           # Data-coupled — per DEC-016
│   │   ├── StickyOutline/             # use client — per DEC-034
│   │   └── AnchorCopy/               # use client — per DEC-036
│   ├── about/
│   ├── lab/
│   ├── writing/
│   └── contact/
│
├── hooks/                             # Custom React hooks
├── lib/                               # Utilities, helpers, constants
│   ├── data/
│   │   ├── projects.js                # Project records — per DEC-009
│   │   ├── lab.js                     # Lab entry records — per DEC-041
│   │   └── posts.js                   # Writing post records — per DEC-010
│   ├── config/
│   │   └── site.js                    # siteConfig — availability signal, per DEC-029
│   └── utils/
│       └── projects.js                # Condition evaluation functions — per DEC-031
├── content/                           # Markdown writing content
└── styles/                            # Global styles and design tokens
```

### Layout Contract

Every page must conform to this hierarchy — no exceptions:

```
RootLayout
  └── Section (× n — one per content area)
        └── Container (size: default | wide | full — chosen per section)
              └── [Feature Content]
```

Container size is a **per-section decision**, not a per-page decision. See DEC-024.

### Container Sizing Reference

| Size      | Width  | Use For                                                         |
| --------- | ------ | --------------------------------------------------------------- |
| `default` | 896px  | Prose-heavy sections — hero copy, about content, writing        |
| `wide`    | 1152px | Grid sections — project index, card layouts, two-column layouts |
| `full`    | 100%   | Full-bleed sections — only when content explicitly requires it  |

### Rendering Strategy

| Context        | Strategy                                                                 |
| -------------- | ------------------------------------------------------------------------ |
| Default        | React Server Components (RSC)                                            |
| Interactive UI | `use client` — scoped to the minimum boundary, never the page            |
| Data fetching  | Server-side via async RSC                                                |
| State          | Local-first. No global state unless strictly justified in `DECISIONS.md` |

### use client Ledger — All Justified Client Boundaries

| Component / module | Justification                                                | Decision     |
| ------------------ | ------------------------------------------------------------ | ------------ |
| `Providers`        | Theme store bridges DOM theme attribute, localStorage, React | Global shell |
| `HeaderChrome`     | Sticky header scroll state and progress bar                  | Global shell |
| `DesktopNav`       | Active route and hover indicator via `usePathname`           | Global shell |
| `MobileNav`        | Drawer state, focus management, scroll lock, route reset     | Global shell |
| `CommandTrigger`   | Opens command palette external store                         | Global shell |
| `CommandPalette`   | Keyboard shortcut, search state, route actions               | Global shell |
| `ThemeToggle`      | User-triggered theme writes                                  | Global shell |
| `StatusBadge`      | Tooltip visibility                                           | Global shell |
| `ChatWidget`       | Floating assistant panel and streamed conversation UI        | Global shell |
| `FilterControls`   | Pill click → router.push with searchParams                   | DEC-025      |
| `ViewToggle`       | Grid/list state, localStorage persistence                    | DEC-028      |
| `StickyOutline`    | IntersectionObserver for scroll-tracked active section       | DEC-034      |
| `AnchorCopy`       | navigator.clipboard.writeText                                | DEC-036      |
| `ContactForm`      | Form submission interaction                                  | DEC-039      |

Any new `use client` component must be added to this ledger with its justification before implementation begins.

---

## 5. Design System

### Philosophy

The Design System is the **only** permitted source of UI decisions. Pages compose components. Pages do not style directly.

> No raw Tailwind in page files. Ever. This is a closed decision — see DEC-004.

### Visual Language

| Token          | Specification                                                                        |
| -------------- | ------------------------------------------------------------------------------------ |
| **Style**      | Minimal · Structured · Professional · Modern (2026 standard)                         |
| **Spacing**    | 4px/8px base grid — consistent across all components                                 |
| **Color**      | Semantic usage only · WCAG AA accessibility required · dark and refined light themes |
| **Typography** | Fixed rem token scale · Clear hierarchy · Readability first                          |
| **Motion**     | Subtle · Intentional · Purpose-driven — never decorative                             |

### Current Theme Contract

- Dark mode is the default identity.
- Light mode is a warm editorial companion, not a simple inversion.
- Accent-backed controls use `--color-accent-contrast`, never `--color-bg`.
- `SectionBackground` uses ambient opacity multipliers so mesh, grid, ruled lines, vignette, and noise are tuned per theme.
- Font variables are CSS stacks in `base.css`; the app does not use `next/font/google` because production builds must not depend on Google Fonts network fetches.

### SectionBackground Variant System

All variant assignments are logged decisions — not implementation judgment calls.

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
| `/about` ValuesInPractice          | `grid`      | DEC-045  |
| `/about` CurrentlyExploring        | `editorial` | DEC-045  |
| `/about` ConnectToWork             | `mesh`      | DEC-045  |
| `/writing` index hero              | `editorial` | DEC-048  |
| `/writing` index body              | `minimal`   | DEC-048  |
| `/writing/[slug]` hero             | `editorial` | DEC-048  |
| `/writing/[slug]` body             | `minimal`   | DEC-048  |

**Unassigned surfaces:** None blocking. Home sections that render the default `SectionBackground` use the component default (`minimal`) unless a phase decision assigns a stronger variant.

**Blocking prerequisites:**

- `mesh` must exist in `SECTION_BACKGROUND_VARIANTS` before Phase 3 case study hero — DEC-020
- `aurora` must exist in `SECTION_BACKGROUND_VARIANTS` before Phase 5 lab hero — DEC-043

### Core Component Inventory

| Component               | Location             | Responsibility                                       | Decision         |
| ----------------------- | -------------------- | ---------------------------------------------------- | ---------------- |
| `RootLayout`            | `components/layout/` | Global shell — nav, footer, providers                | —                |
| `Section`               | `components/layout/` | Vertical rhythm and spacing unit                     | —                |
| `Container`             | `components/layout/` | Horizontal constraint and content alignment          | DEC-024          |
| `SectionHeader`         | `components/ui/`     | Consistent section titles and subtitles              | —                |
| `Button`                | `components/ui/`     | Primary, secondary, ghost variants                   | —                |
| `Badge`                 | `components/ui/`     | Label and tag display                                | —                |
| `Tag`                   | `components/ui/`     | Filter pill and taxonomy display                     | —                |
| `Card`                  | `components/ui/`     | Structured content container                         | —                |
| `Heading`               | `components/ui/`     | Typography hierarchy H1–H4                           | —                |
| `Text`                  | `components/ui/`     | Body copy with size and weight variants              | —                |
| `Avatar`                | `components/ui/`     | Person display with initials fallback                | —                |
| `MetricBadge`           | `components/ui/`     | Outcome-oriented data display                        | DEC-018          |
| `ProjectCard`           | `components/ui/`     | Project summary — grid and list variants             | DEC-006, DEC-028 |
| `LabCard`               | `components/ui/`     | Lab entry summary — shared across /lab and Home      | DEC-042          |
| `AvailabilitySignal`    | `components/ui/`     | Pulsing dot + label — three surfaces                 | DEC-038          |
| `ProjectsIndexSections` | `features/projects/` | Projects index visual shell — hero, filters, grid    | DEC-024          |
| `CaseStudySections`     | `features/projects/` | Case study page visual shell — hero, outline, prose  | DEC-034          |
| `CaseStudyLayout`       | `features/projects/` | Full case study page structure — data-coupled        | DEC-016          |
| `StickyOutline`         | `features/projects/` | Scroll-tracked section outline — wide viewport only  | DEC-034          |
| `AnchorCopy`            | `features/projects/` | Copy anchor link — clipboard write only              | DEC-036          |
| `WritingPageSections`   | `features/writing/`  | Writing index visual shell — hero and filtered body  | DEC-048          |
| `ContactFormGrid`       | `features/contact/`  | Contact form/sidebar section with mobile-first stack | DEC-037          |

All components must expose stable, predictable APIs and support long-term extension without breaking changes.

---

## 6. Content Architecture

### UX Model — Progressive Disclosure

Information is layered. Never front-load depth.

```
Layer 1 — Overview       →  Cards · Summaries · Fast comprehension
Layer 2 — Expansion      →  Previews · Key details · Signal zones
Layer 3 — Deep Dive      →  Case studies · Full reasoning · Tradeoffs
```

### Content Standards

Every piece of content must pass this test:

| ✅ Include                        | ❌ Exclude                        |
| --------------------------------- | --------------------------------- |
| Decisions made and why            | Vague descriptions of work        |
| Tradeoffs evaluated               | Technology lists without context  |
| Measurable outcomes               | Generic achievement language      |
| Engineering constraints navigated | Decorative copy                   |
| What would be done differently    | Skills lists and tool inventories |

### Site Sections

| Route              | Purpose                                                  |
| ------------------ | -------------------------------------------------------- |
| `/`                | Identity · positioning · first impression                |
| `/projects`        | Curated project index — engineering case studies         |
| `/projects/[slug]` | Full case study — decisions, tradeoffs, outcomes         |
| `/writing`         | Technical communication layer — per DEC-010              |
| `/writing/[slug]`  | Individual post — rooted in real project decisions       |
| `/about`           | Engineering philosophy · working approach                |
| `/lab`             | Experiments · technical exploration                      |
| `/lab/[slug]`      | Individual lab entry — full narrative depth, per DEC-040 |
| `/contact`         | Deliberate, low-friction inbound entry point             |

---

## 7. Engineering Standards

### Code Quality Non-Negotiables

- Production-ready on first commit — no placeholder logic
- Readable before clever
- Modular by default — components are isolated units
- No premature abstraction — extract only when the pattern repeats
- No `any` — JavaScript must be clean and intentional throughout

### Performance Requirements

| Metric                   | Target                    |
| ------------------------ | ------------------------- |
| Lighthouse Performance   | ≥ 95                      |
| Lighthouse Accessibility | ≥ 95                      |
| Cumulative Layout Shift  | ≤ 0.1                     |
| First Contentful Paint   | ≤ 1.2s                    |
| Time to Interactive      | ≤ 2.5s                    |
| JS Payload               | Lean — every KB justified |

### Dependency Discipline

Every new dependency requires justification before it is added:

1. What does this solve that a native solution cannot?
2. What is the bundle size impact?
3. Is this actively maintained?

---

## 8. AI Behavioral Contract

### Role

AI operates as a **Senior Frontend Architect and Engineering Collaborator** — not an assistant that executes without judgment.

### Mandatory Behaviors

| Situation                              | Required Behavior                                                         |
| -------------------------------------- | ------------------------------------------------------------------------- |
| Producing UI                           | Prioritize hierarchy, clarity, and accessibility                          |
| Writing code                           | Production-quality, modular, no shortcuts                                 |
| Suggesting improvements                | Be opinionated. Reject weak solutions. Propose stronger ones              |
| Explaining decisions                   | Concise engineering reasoning. No tutorial padding                        |
| Encountering a logged decision         | Follow it. Flag disagreement explicitly with proposed amendment           |
| Encountering ambiguity                 | Ask one targeted question. Do not assume and proceed                      |
| Adding a `use client` component        | Add it to the use client ledger in Section 4 before implementing          |
| Adding a new SectionBackground variant | Verify it exists in `SECTION_BACKGROUND_VARIANTS` — blocking prerequisite |

### Prohibited Behaviors

- Generating boilerplate without architectural consideration
- Suggesting heavy dependencies for problems with lightweight solutions
- Producing decorative UI that serves no communication purpose
- Adding `use client` without justification against the rendering strategy
- Reverting to tutorial-style explanations unless explicitly requested
- Ignoring `DECISIONS.md` entries
- Assuming Container size is a page-level decision — it is per-section

### Communication Style

| Attribute    | Standard                                                |
| ------------ | ------------------------------------------------------- |
| Tone         | Professional · Direct · Opinionated                     |
| Length       | Concise — no motivational filler, no summary repetition |
| Structure    | Reasoning first, then implementation                    |
| Disagreement | State the objection clearly, propose the alternative    |

---

## 9. Decision Heuristics

When facing a judgment call, apply in order:

1. **Clarity over cleverness** — if it needs explanation, simplify it
2. **Performance over complexity** — measure before adding
3. **Simplicity over feature bloat** — build what is needed, nothing more
4. **Real usefulness over visual novelty** — does this serve the user or the ego?

---

## 10. Anti-Patterns — Strictly Prohibited

These patterns are closed decisions. Do not reopen without a formal `DECISIONS.md` amendment.

| Anti-Pattern                                               | Reason                                                    |
| ---------------------------------------------------------- | --------------------------------------------------------- |
| Raw Tailwind in page files                                 | Violates Design System contract — DEC-004                 |
| Over-animated interfaces                                   | Obscures content, signals immaturity                      |
| Endless scroll layout                                      | Reduces comprehension, generic                            |
| Heavy dependencies without justification                   | Bundle bloat, maintenance debt                            |
| Generic portfolio template aesthetic                       | Fails differentiation objective                           |
| Decorative UI without communication purpose                | Contradicts clarity principle                             |
| Deep nesting without abstraction                           | Reduces maintainability                                   |
| `use client` on a page or index component                  | Violates server-first principle — minimum boundary always |
| Container size as a page-level decision                    | Violates DEC-024 — per-section sizing is the contract     |
| SectionBackground variant chosen without a logged decision | Violates the pattern established in DEC-020               |
| Bespoke form controls alongside form-controls.jsx          | Violates DEC-039 — form-controls.jsx is canonical         |

---

## 11. Open Questions — Blocking

No blocking product questions remain for the current deployed route set. New questions should be added here only when they block implementation or launch.

---

## 12. Linked Documents

| Document               | Purpose                                         |
| ---------------------- | ----------------------------------------------- |
| `AI_CONTEXT.md`        | This file — persistent project intelligence     |
| `DECISIONS.md`         | Master index — load every session               |
| `DECISIONS-CORE.md`    | DEC-001 to DEC-005 — load every session         |
| `DECISIONS-PHASE2.md`  | DEC-006 to DEC-015 — Home page decisions        |
| `DECISIONS-PHASE3.md`  | DEC-016 to DEC-036 — Projects system decisions  |
| `DECISIONS-PHASE5.md`  | DEC-040 to DEC-043 — Lab decisions              |
| `DECISIONS-PHASE6.md`  | DEC-037 to DEC-039 — Contact page decisions     |
| `ROADMAP.md`           | Execution milestones and current progress       |
| `PORTFOLIO_V2_SPEC.md` | Full product specification                      |
| `DEPLOYMENT.md`        | Vercel deployment contract and launch checklist |

---

## 13. Final Directive

> Every contribution — code, design, copy, or architecture — must advance one goal: demonstrating that this engineer thinks in systems, ships with intention, and builds software that works.

Nothing ships that contradicts this.
