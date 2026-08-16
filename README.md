# alexshedrach.dev — Portfolio V2

**Version:** 2.0.0
**Status:** Active Development
**Deployment:** [alexshedrach.dev](https://alexshedrach.dev) · Vercel

---

## Overview

Portfolio V2 is a **productized developer portfolio** — engineered as a software system, not assembled as a personal website.

It is designed to communicate one thing clearly:

> How this engineer thinks, designs systems, and ships software.

This repository is the complete source for alexshedrach.dev — built on Next.js App Router, JavaScript, and TailwindCSS, with a strict Design System and feature-based architecture that mirrors production frontend standards.

---

## Stack

| Layer      | Technology                                               |
| ---------- | -------------------------------------------------------- |
| Framework  | Next.js 16 App Router                                    |
| Language   | JavaScript                                               |
| Styling    | Tailwind CSS v4, CSS-first tokens                        |
| Rendering  | React Server Components — client-side only when required |
| Deployment | Vercel — preview on every branch, production from `main` |

---

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10.15.1+

### Install

```bash
pnpm install
```

### Develop

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The server reloads on file changes.

### Build

```bash
pnpm build          # Production build
pnpm start          # Serve production build locally
pnpm lint           # Lint entire project
pnpm deploy:check   # Lint + production build
```

---

## Project Architecture

```
src/
│
├── app/                          # Routing and application wiring
│   ├── layout.jsx                # Root layout, metadata, global shell
│   ├── page.jsx                  # Home route
│   ├── providers.jsx             # Theme provider and client context
│   ├── robots.js                 # robots.txt metadata route
│   ├── sitemap.js                # sitemap.xml metadata route
│   ├── manifest.js               # manifest.webmanifest metadata route
│   ├── about/
│   ├── projects/
│   │   └── [slug]/               # Dynamic case study routes
│   ├── writing/
│   │   └── [slug]/               # Technical writing routes
│   ├── lab/
│   └── contact/

│
├── components/
│   ├── layout/                   # Structural layout primitives
│   │   ├── RootLayout/
│   │   ├── Section/
│   │   └── Container/
│   │
│   └── ui/                       # Design System components
│       ├── Button/
│       ├── Card/
│       ├── Heading/
│       ├── Text/
│       ├── Badge/
│       ├── SectionHeader/
│       └── MetricBadge/
│
├── features/                     # Feature-scoped modules
│   ├── home/
│   ├── projects/
│   ├── about/
│   ├── writing/
│   ├── lab/
│   └── contact/
│
├── hooks/                        # Custom React hooks
├── lib/                          # Utilities, helpers, constants
├── content/                      # Markdown writing content
└── styles/                       # Global styles and design tokens
```

---

## Architectural Principles

### Layout Contract

Every page follows a strict, non-negotiable layout hierarchy:

```
RootLayout
  └── Section
        └── Container
              └── [Feature Content]
```

This guarantees consistent spacing, alignment, and responsive behavior across all routes without per-page style decisions.

### Design System First

UI is built entirely from reusable Design System primitives.

```
✅  Pages compose components
❌  Pages do not contain raw Tailwind or styling logic
```

All visual decisions live inside the Design System. This is a closed architectural decision.

### Feature-Based Structure

Code is organized by feature domain, not file type. Each feature owns its components, logic, and data requirements.

```
features/home/
features/projects/
features/about/
features/lab/
```

This mirrors real production frontend architecture and keeps feature boundaries explicit.

### Rendering Strategy

Server Components are the default. Client Components are introduced only when interactivity strictly requires it. Every `use client` directive is a deliberate decision, not a default.

---

## Project Intelligence

Portfolio V2 is developed using a structured AI collaboration model. Project context is maintained across sessions through four documents:

| Document               | Purpose                                                    |
| ---------------------- | ---------------------------------------------------------- |
| `AI_CONTEXT.md`        | Persistent project intelligence and AI behavioral contract |
| `DECISIONS.md`         | Architectural and product decision log                     |
| `PORTFOLIO_V2_SPEC.md` | Full product specification and page requirements           |
| `ROADMAP.md`           | Execution milestones and current progress state            |

These documents are the source of truth for all architectural decisions. AI collaborators load them before every session.

---

## Performance Targets

| Metric                   | Target |
| ------------------------ | ------ |
| Lighthouse Performance   | ≥ 95   |
| Lighthouse Accessibility | ≥ 95   |
| Cumulative Layout Shift  | ≤ 0.1  |
| First Contentful Paint   | ≤ 1.2s |
| Time to Interactive      | ≤ 2.5s |

Performance is a product requirement — not an afterthought.

---

## Site Structure

| Route              | Purpose                                                                  |
| ------------------ | ------------------------------------------------------------------------ |
| `/`                | Identity and positioning — first impression                              |
| `/projects`        | Curated engineering case studies                                         |
| `/projects/[slug]` | Full case study — problem, constraints, architecture, tradeoffs, outcome |
| `/about`           | Engineering philosophy — not biography                                   |
| `/writing`         | Technical writing rooted in real engineering decisions                   |
| `/writing/[slug]`  | Full technical post                                                      |
| `/lab`             | Experiments and technical exploration                                    |
| `/lab/[slug]`      | Full lab entry                                                           |
| `/contact`         | Deliberate, low-friction contact entry point                             |

---

## Deployment

Deployed on **Vercel**.

- Every branch push generates a **preview deployment**
- Production deploys automatically from the `main` branch
- `vercel.json` defines install/build/dev commands
- `robots.txt`, `sitemap.xml`, and `manifest.webmanifest` are generated by App Router metadata files
- Run `pnpm deploy:check` before production deploys

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the production checklist.

---

## Evolution from V1

Portfolio V2 is a **clean rebuild**, not a migration. V1 serves as reference material only — its architecture, structure, and patterns are not carried forward.

The rebuild was chosen deliberately. V1 could not support the architectural standards required by V2 without accumulating structural debt faster than it could be resolved. See `DECISIONS.md → DEC-001` for full reasoning.

---

## Philosophy

> Build systems, not pages.

Every decision in this repository — folder structure, component API, rendering strategy, content hierarchy — is made at the system level. The goal is not a website that looks good. It is an engineering artifact that communicates how software is conceived, designed, and shipped.

---

## Author

**Alex Shedrach**
Frontend Engineer · System Thinker · Builder
[alexshedrach.dev](https://alexshedrach.dev)

---

## License

MIT License
