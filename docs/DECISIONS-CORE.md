# DECISIONS-CORE.md — Foundation Decisions

**Project:** alexshedrach.dev
**Version:** 2.0.0
**Last Updated:** 2026
**Classification:** Core Engineering Memory — Load Every Session Without Exception

---

## 0. About This File

This file contains the foundation decisions that govern every aspect of Portfolio V2 — architecture, framework, product strategy, design philosophy, AI collaboration model, and deployment readiness.

These decisions are not phase-specific. They apply to every session, every feature, and every line of code regardless of which phase is active.

**Load this file every session. No exceptions.**

For the complete decision index and protocol, see `DECISIONS.md`.
For phase-specific decisions, see `DECISIONS-PHASE2.md` and `DECISIONS-PHASE3.md`.

---

## 1. Decision Records

---

### DEC-001 — Rebuild Over Refactor

**Date:** 2026
**Status:** `Accepted`
**Area:** Architecture

#### Context

The original portfolio (V1) was built with React 18, an evolving folder structure, and no enforced design system. As architectural requirements matured, the gap between what V1 could support and what V2 required became too wide to bridge incrementally. Continuing to refactor risked accumulating structural debt faster than it could be resolved.

#### Options Considered

| Option               | Summary                                       |
| -------------------- | --------------------------------------------- |
| Incremental Refactor | Migrate V1 piece-by-piece to modern patterns  |
| Clean Rebuild        | Start fresh with V2 architecture from day one |

#### Decision

**Perform a clean rebuild.** V1 is preserved as a reference-only repository. V2 starts from zero with correct architecture.

#### Reasoning

- Refactoring legacy constraints into a new architecture produces hybrid systems — neither clean nor legacy, but worse than both
- A rebuild allows the design system, layout contract, and feature structure to be established correctly from the start
- The portfolio is a representation of current engineering capability — V1 no longer reflects that standard
- Long-term iteration velocity is higher when the foundation is sound

#### Consequences

- ✅ Clean architecture from day one — no legacy compromises
- ✅ Faster long-term iteration
- ✅ Portfolio accurately reflects current engineering standards
- ⚠️ V1 commit history is not carried forward — intentional tradeoff

---

### DEC-002 — Next.js App Router as Framework

**Date:** 2026
**Status:** `Accepted`
**Area:** Frontend Architecture

#### Context

The project requires a modern rendering strategy, file-system routing, and deployment optimisation. Multiple frameworks were evaluated against these requirements.

#### Options Considered

| Option             | Strengths                                         | Weaknesses                                                        |
| ------------------ | ------------------------------------------------- | ----------------------------------------------------------------- |
| Vite + React       | Fast dev experience, flexible                     | No SSR, routing requires manual setup, no deployment optimisation |
| Next.js App Router | RSC, SSR, built-in routing, Vercel-native         | Steeper learning curve, evolving APIs                             |
| Astro              | Excellent static performance, island architecture | Less suited for interactive features, smaller ecosystem           |

#### Decision

**Adopt Next.js App Router** as the primary framework.

#### Reasoning

- React Server Components reduce client-side JS by default
- Built-in routing eliminates manual configuration overhead
- Vercel-native deployment enables instant preview environments
- Industry alignment — relevant signal for hiring evaluators
- App Router architecture enforces server-first thinking, which aligns with performance goals

#### Consequences

- ✅ Server rendering as the default — client JS only when justified
- ✅ Structured app architecture enforced by the framework
- ✅ Preview deployments on every branch push
- ⚠️ Must audit every component for unnecessary `use client` directives
- ⚠️ App Router APIs are still maturing — monitor for breaking changes

---

### DEC-003 — Portfolio as Productized Engineering System

**Date:** 2026
**Status:** `Accepted`
**Area:** Product Strategy

#### Context

The majority of developer portfolios share the same structure: hero section, skills list, project cards, contact form. This pattern signals competence at a junior level but fails to differentiate at a senior level. A portfolio that looks like every other portfolio communicates nothing about engineering thinking.

#### Options Considered

| Option                         | Summary                                                             |
| ------------------------------ | ------------------------------------------------------------------- |
| Standard portfolio format      | Fast to build, widely understood, forgettable                       |
| Productized engineering system | Slower to build, requires more content depth, highly differentiated |

#### Decision

**Position the portfolio as a productized engineering system** — a software product that demonstrates how software is designed and shipped, not merely what was built.

#### Reasoning

- Differentiation is a product requirement, not a preference — the market is saturated with generic portfolios
- Technical hiring managers evaluate thinking quality — the portfolio must surface that directly
- A productized approach forces content discipline: every section must earn its place
- Case studies with decisions and tradeoffs communicate seniority more effectively than any design or animation

#### Consequences

- ✅ Clearly differentiated from generic portfolio patterns
- ✅ Content strategy becomes a forcing function for quality
- ✅ Memorable to the target audience
- ⚠️ Requires deeper content investment per project — breadth is sacrificed for depth
- ⚠️ Fewer projects presented — quality over quantity is a deliberate constraint

---

### DEC-004 — Minimal, Structured, High-Signal Design

**Date:** 2026
**Status:** `Accepted`
**Area:** UX / UI

#### Context

Visual complexity is often used to compensate for shallow content. For a portfolio targeting technical evaluators, excessive animation and decoration creates noise that works against the core communication goal: fast comprehension of engineering depth.

#### Options Considered

| Option                        | Summary                                                               |
| ----------------------------- | --------------------------------------------------------------------- |
| Rich visual / heavy animation | High visual impact, high distraction risk, trend-dependent            |
| Minimal, structured design    | Lower visual impact initially, higher signal-to-noise ratio, timeless |

#### Decision

**Adopt minimal, structured, high-signal design** as the governing visual philosophy.

#### Reasoning

- Clarity communicates seniority better than visual complexity
- Strong typography hierarchy does more for credibility than motion
- Minimal interfaces age better — design trends change, structure does not
- Animation must explain hierarchy or state — decorative motion is prohibited
- Performance is a product requirement; heavy visual libraries work against it

#### Consequences

- ✅ Content surfaces faster — less visual competition
- ✅ Performance budget preserved
- ✅ Design ages well — not trend-dependent
- ⚠️ Visual impact relies entirely on content quality and typographic execution
- ⚠️ Motion must be used precisely — absence of decoration raises the standard for the motion that is used

---

### DEC-005 — Structured AI Collaboration Model

**Date:** 2026
**Status:** `Accepted`
**Area:** Workflow

#### Context

AI-assisted development is most effective when context is persistent and structured. Without a defined collaboration model, each AI session starts from zero — requiring repeated briefing, producing inconsistent outputs, and risking architectural drift.

#### Options Considered

| Option                   | Summary                                                               |
| ------------------------ | --------------------------------------------------------------------- |
| Ad-hoc prompting         | Fast to start, inconsistent results, no memory across sessions        |
| Structured context files | Slower to set up, consistent results, persistent architectural memory |

#### Decision

**Adopt structured AI collaboration** via persistent context files:

| File                   | Purpose                                                    |
| ---------------------- | ---------------------------------------------------------- |
| `AI_CONTEXT.md`        | Persistent project intelligence and AI behavioral contract |
| `DECISIONS.md`         | Master index — entry point for all decision records        |
| `DECISIONS-CORE.md`    | Foundation decisions — this file                           |
| `DECISIONS-PHASE2.md`  | Home page decisions                                        |
| `DECISIONS-PHASE3.md`  | Projects system decisions                                  |
| `DECISIONS-PHASE3.5.md` | Writing system decisions                                  |
| `DECISIONS-PHASE4.md`  | About page decisions                                       |
| `DECISIONS-PHASE5.md`  | Lab decisions                                              |
| `DECISIONS-PHASE6.md`  | Contact page decisions                                     |
| `ROADMAP.md`           | Execution milestones and current progress state            |
| `PORTFOLIO_V2_SPEC.md` | Full product specification and requirements                |
| `DEPLOYMENT.md`        | Vercel deployment contract and launch checklist            |

#### Reasoning

- Context persistence eliminates repeated briefing — AI inherits full project memory on load
- Structured behavioral contracts produce more consistent, higher-quality outputs
- Logged decisions prevent architectural drift across sessions
- Splitting the decision log by phase keeps each file within the AI context window budget
- The collaboration model itself demonstrates engineering process maturity — a relevant signal for the portfolio's audience

#### Consequences

- ✅ Consistent AI output quality across sessions
- ✅ Architectural decisions enforced, not re-debated
- ✅ Faster onboarding for every new AI session
- ✅ Decision log scales across phases without hitting context limits
- ⚠️ Context files must be actively maintained — stale context produces stale outputs
- ⚠️ Requires discipline to log decisions at the time they are made
- ⚠️ When DECISIONS.md is split further, update the file structure table in this entry

---

### DEC-052 — Production Deployment Contract

**Date:** 2026
**Status:** `Accepted`
**Area:** Deployment / Operations

#### Context

Portfolio V2 is approaching Vercel hosting. The site needed explicit production configuration so deployment behavior is reproducible, preview environments are safe for indexing, and build validation does not depend on local machine assumptions.

#### Options Considered

| Option                    | Summary                                                        |
| ------------------------- | -------------------------------------------------------------- |
| Dashboard-only settings   | Fast to configure, invisible in code review, easy to drift     |
| Repo-owned deployment config | Slower upfront, reviewable, portable, repeatable            |

#### Decision

**Own deployment behavior in the repository.**

The production contract is:

- `vercel.json` defines install, build, dev, framework, and region settings
- `package.json` pins pnpm and Node expectations and exposes `deploy:check`
- `next.config.mjs` owns security headers, image defaults, and production build defaults
- App Router metadata files own `/robots.txt`, `/sitemap.xml`, and `/manifest.webmanifest`
- Font variables are CSS stacks, not `next/font/google`, so builds do not depend on Google Fonts network fetches
- `DEPLOYMENT.md` documents the launch checklist and operational expectations

#### Reasoning

- Vercel dashboard settings are easy to forget and hard to audit
- Preview deployments should not be indexed accidentally
- Sitemap and manifest routes are product surfaces and should be generated from source data
- Build-time remote font fetching failed in restricted environments and slowed feedback
- A single `deploy:check` command makes pre-deploy validation explicit

#### Consequences

- ✅ Deployment configuration is reviewable and portable
- ✅ Preview/production robots behavior is explicit
- ✅ Metadata routes are generated from route/content data
- ✅ Builds are more deterministic without Google Fonts network fetches
- ⚠️ Any future CSP must account for the required inline theme bootstrap script
- ⚠️ Dashboard overrides must be mirrored back into repo config or they are considered drift

---

### DEC-053 — V1 → V2 Hosting Cutover Strategy

**Date:** 2026
**Status:** `Accepted`
**Area:** Deployment / Operations

#### Context

Portfolio V2 has no git repository yet. V1 is currently live on Vercel at `alexshedrach.dev` with its own repository. V2 needs to go from local, unversioned code to a production deployment serving the live domain, without an uncontrolled cutover or loss of the V1 engineering record. This decision governs repo strategy, Vercel project strategy, and domain migration — not CI/CD mechanics, which are already covered by DEC-052.

#### Options Considered

| Option                                              | Summary                                                                 |
| ---------------------------------------------------- | ------------------------------------------------------------------------ |
| Reuse V1 repo (force-push or history merge)          | Fewer repos to manage; contaminates or discards V1's actual history     |
| Repoint existing V1 Vercel project at new repo       | Fewer dashboard steps; no rollback path, inherits stale project config  |
| New repo + new Vercel project, domain migrates last  | More setup steps; clean history, safe rollback, matches DEC-001 intent  |

#### Decision

**V2 gets a new GitHub repository and a new Vercel project.** The domain migrates from the V1 Vercel project to the V2 Vercel project only after the V2 preview build passes the full `DEPLOYMENT.md` §7 checklist. V1's repository is preserved permanently as a read-only archive. V1's Vercel project is kept alive, domain-less, for a defined burn-in period before decommissioning.

Sequence:

1. Initialize a new repo for V2 — no shared history with V1
2. Create a new Vercel project connected to that repo
3. Deploy to preview; validate against `DEPLOYMENT.md` §7 Pre-Launch Checklist
4. Remove `alexshedrach.dev` from the V1 Vercel project; add it to the V2 Vercel project
5. Keep the V1 Vercel project running, domain-less, for a burn-in window
6. Decommission the V1 Vercel project after burn-in; rename the V1 repo to signal archive status (e.g. `-v1-archive`) and leave it public/private as-is, read-only

#### Reasoning

- DEC-001 already established V1 as reference-only, not a foundation — reusing its repo or Vercel project for V2 would silently reopen that decision
- A fresh Vercel project avoids inheriting stale env vars, integrations, and build-cache assumptions from V1
- Keeping the V1 project alive but domain-less is a zero-cost rollback path during cutover — domain reassignment in Vercel is a dashboard operation, effectively instant, so rollback is equally fast if needed
- Deleting the V1 repo would contradict DEC-001's stated consequence that V1 history is intentionally preserved, not discarded
- This is a repeatable pattern — the same sequence applies to any future major version cutover, so it's worth codifying once rather than re-deciding informally

#### Consequences

- ✅ Clean deployment and analytics history for V2 from day one
- ✅ Safe, fast rollback path during cutover window
- ✅ V1 preserved as an engineering record, consistent with DEC-001
- ✅ Pattern is reusable for future major-version cutovers
- ⚠️ Requires manual domain reassignment step in Vercel dashboard — not automated by DEC-052's repo-owned config
- ⚠️ V1 Vercel project incurs no meaningful cost but must not be forgotten — set a concrete decommission date, don't leave it indefinitely

## 2. Proposed Amendments

> No amendments currently proposed.

Use this section to formally propose changes to any core decision before acting on it.

---

## 3. Superseded Decisions

> None at this time.

---

## 4. Deprecated Decisions

> None at this time.
