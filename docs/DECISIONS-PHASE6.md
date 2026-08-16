# DECISIONS-PHASE6.md — Phase 6 Decisions: Contact Page

**Project:** alexshedrach.dev
**Version:** 2.0.0
**Last Updated:** 2026
**Classification:** Phase 6 Engineering Memory — Load When Working on Contact Page

---

## 0. About This File

This file contains decisions made during **Phase 6 — Contact** development. It covers the contact page layout, the `AvailabilitySignal` component scope, and form design system compliance.

**Prerequisites:** Load `DECISIONS.md` and `DECISIONS-CORE.md` before this file. For any component that also appears on the projects system, load `DECISIONS-PHASE3.md` as well — specifically DEC-029 (Availability Signal origin).

**Scope:** DEC-037 to DEC-039

For the complete decision index and protocol, see `DECISIONS.md`.

---

## 1. Quick Reference — Contact Page Architecture

```
Contact Page — Desktop (lg+)
┌──────────────────────────────────────────────────────┐
│  ContactHero  (default Container — 896px)            │
│  AvailabilitySignal                                  │
└──────────────────────────────────────────────────────┘
┌─────────────────────────────┬────────────────────────┐
│  ContactForm (60%)          │  LookingFor            │  wide Container — 1152px
│                             │  QuickReach            │
│                             │  AvailabilitySignal    │
└─────────────────────────────┴────────────────────────┘

Contact Page — Mobile / Tablet (stacked)
┌──────────────────────────────────────┐
│  ContactHero                         │
│  AvailabilitySignal                  │
│  LookingFor                          │
│  ContactForm                         │
│  QuickReach                          │
└──────────────────────────────────────┘
```

---

## 2. What Does Not Ship With Phase 6

These are closed questions — do not reopen without a formal amendment:

| Feature                      | Status          | Reason                                                           |
| ---------------------------- | --------------- | ---------------------------------------------------------------- |
| CAPTCHA                      | ❌ Not shipping | Per spec — unless spam is a documented post-launch problem       |
| Calendar booking integration | ❌ Not shipping | Out of scope — no data supports adding it                        |
| Multi-step form              | ❌ Not shipping | Field count does not justify it — adds complexity for no UX gain |

## 3. What Ships But Is Not in the Spec

| Addition                                            | Justification                                                                               |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Response time commitment visible before submit      | Visitors need this before investing time writing — not just in the success state            |
| Structured work type communication via `LookingFor` | Qualifies intent before the message is written — the difference between utility and product |
| Direct email as fallback in `QuickReach`            | Senior engineering audience will not all use a form — no additional friction                |
| Honeypot field in `actions.js`                      | Zero UX cost spam protection — production requirement for any public form                   |

---

## 4. Decision Records

---

### DEC-037 — Contact Page Layout

**Date:** 2026
**Status:** `Accepted`
**Area:** UX / Layout

#### Context

The contact page requires a layout ruling before any component is built. The layout decision shapes every subsequent component's spacing, Container sizing, and responsive behaviour. Two defensible options exist — each with a different tradeoff in information hierarchy and mobile experience.

#### Options Considered

| Option     | Description                           | Tradeoff                                                                  |
| ---------- | ------------------------------------- | ------------------------------------------------------------------------- |
| Two-column | Form left (60%), context right (40%)  | Denser, more information above fold, requires careful responsive handling |
| Stacked    | Hero → LookingFor → Form → QuickReach | Linear reading, cleaner on mobile, longer scroll to form on desktop       |

#### Decision

**Two-column at desktop (lg+). Stacked on mobile and tablet.**

```
Desktop (lg+)
┌─────────────────────────────┬──────────────────────┐
│  ContactForm (60%)          │  LookingFor          │
│                             │  QuickReach          │
│                             │  AvailabilitySignal  │
└─────────────────────────────┴──────────────────────┘

Mobile / Tablet
┌──────────────────────────────────────┐
│  ContactHero                         │
│  AvailabilitySignal                  │
│  LookingFor                          │
│  ContactForm                         │
│  QuickReach                          │
└──────────────────────────────────────┘
```

#### Container Sizing — Per DEC-024 Pattern

| Section         | Container Size | Width  | Rationale                                             |
| --------------- | -------------- | ------ | ----------------------------------------------------- |
| Hero            | `default`      | 896px  | Prose-heavy — line length constrained for readability |
| Two-column grid | `wide`         | 1152px | Form + sidebar need room to breathe side by side      |

#### Reasoning

- The form is the primary action. The right column qualifies intent and reduces friction before the visitor writes — that is its job
- Stacking on desktop forces the visitor to scroll past `LookingFor` to reach the form — wrong hierarchy when both fit side by side
- On mobile, stacking is correct — `LookingFor` above the form so context precedes commitment
- Container sizing follows the established DEC-024 pattern: prose sections at `default`, multi-column grids at `wide` — no new pattern introduced

#### Consequences

- ✅ Form is immediately accessible on desktop — primary action is above fold
- ✅ Context qualifies intent before the visitor commits to writing
- ✅ Mobile stacking follows correct reading hierarchy — context before action
- ✅ Container sizing is consistent with DEC-024 — no new layout conventions
- ⚠️ Two-column layout requires explicit responsive breakpoint handling — `lg:grid-cols-[60%_40%]` with `grid-cols-1` below
- ⚠️ Right column content order on mobile must be reviewed — `LookingFor` before `ContactForm`, `QuickReach` after

---

### DEC-038 — AvailabilitySignal Component Scope

**Date:** 2026
**Status:** `Accepted`
**Area:** Architecture

#### Context

DEC-029 established that the availability signal renders in two locations: the projects index hero and the site navigation. The contact hero is a third surface. Three surfaces require a scoping decision — shared `components/ui/` primitive or per-surface implementation.

#### Relationship to DEC-029

DEC-029 established the data source (`siteConfig.available`) and placement logic. This decision establishes the component architecture that serves those placements. DEC-029 is not amended — this entry extends it.

#### Options Considered

| Option                                                 | Summary                                                       |
| ------------------------------------------------------ | ------------------------------------------------------------- |
| `components/ui/AvailabilitySignal/` — shared primitive | Single component, stable API, three consumers                 |
| Per-surface implementation                             | Faster initially — duplication by Phase 6, inconsistency risk |

#### Decision

**`AvailabilitySignal` lives in `components/ui/AvailabilitySignal/` as a shared Design System primitive.**

#### Component API

```js
// components/ui/AvailabilitySignal/AvailabilitySignal.jsx

<AvailabilitySignal
  available={siteConfig.available}      // boolean — required
  availableFrom={siteConfig.availableFrom}  // string — shown when available
  size="sm" | "md"                      // optional — defaults to "md"
  showLabel={true}                      // optional — defaults to true
/>
```

#### Consumers

| Surface             | Props Used                      | Rendering                                          |
| ------------------- | ------------------------------- | -------------------------------------------------- |
| Site navigation     | `size="sm"`, `showLabel={true}` | Green dot + "Available" — subtle                   |
| Projects index hero | `size="md"`, `showLabel={true}` | Green dot + "Available for work · [availableFrom]" |
| Contact hero        | `size="md"`, `showLabel={true}` | Green dot + "Available for work · [availableFrom]" |

#### Component Inventory Update

`AvailabilitySignal` is added to the shared component inventory in `AI_CONTEXT.md`. Update Section 11 (Conceptual Component System) to include it before the next session that references that file.

#### Reasoning

- Three surfaces with independent implementations is duplication by definition — one change to the availability logic requires three updates
- The API is simple and stable — `siteConfig.available` is the single data source, the visual is a pulsing dot plus label
- Design System principle: when the same UI appears in three or more places, it is a primitive — not a feature-scoped component
- Consistent rendering across all three surfaces is only guaranteed by a single implementation

#### Consequences

- ✅ One component — three consumers — zero duplication
- ✅ Availability logic changes in one place, propagates everywhere
- ✅ Design System boundary stays clean — shared primitives in `components/ui/`
- ✅ `size` prop accommodates the nav (compact) vs hero (full) rendering difference
- ⚠️ `AI_CONTEXT.md` Section 11 component inventory must be updated to include `AvailabilitySignal`
- ⚠️ Any future surface that needs an availability signal must use this component — per-surface implementations are prohibited

---

### DEC-039 — ContactForm Design System Compliance

**Date:** 2026
**Status:** `Accepted`
**Area:** Architecture

#### Context

The existing `ContactForm` re-implements form controls that now exist in `form-controls.jsx` — specifically `Input`, `Select`, and `Textarea`. The bespoke implementation predates `form-controls.jsx` and includes a custom `Field` wrapper sub-component, an inline `inputCls()` utility function, and raw `<input>` elements styled outside the Design System. This is the only component in the codebase currently in violation of the Design System contract.

#### The Violation

| What Exists in ContactForm           | What Should Be Used                                                |
| ------------------------------------ | ------------------------------------------------------------------ |
| Custom `Field` wrapper sub-component | Label/error/hint handling built into `Input`, `Select`, `Textarea` |
| Inline `inputCls()` function         | Token-based styling inside `form-controls.jsx` components          |
| Raw `<input>` elements               | `Input` from `form-controls.jsx`                                   |
| Raw `<textarea>` element             | `Textarea` from `form-controls.jsx`                                |

#### Options Considered

| Option                                      | Summary                                                                      |
| ------------------------------------------- | ---------------------------------------------------------------------------- |
| Treat bespoke implementation as intentional | Requires documenting why this component is exempt — no valid reason exists   |
| Refactor before composing into the page     | Design System compliance restored before the violation gets embedded further |

#### Decision

**Refactor `ContactForm` to use `form-controls.jsx` components before it is composed into the contact page. The custom `Field` sub-component is deleted — not migrated. The inline `inputCls()` function is deleted. Raw form elements are replaced with `Input`, `Textarea` from `form-controls.jsx`.**

#### Refactor Scope

```
ContactForm.jsx — before
├── Field (custom sub-component)    → DELETE
├── inputCls() utility function     → DELETE
├── <input type="text" />           → <Input /> from form-controls.jsx
├── <input type="email" />          → <Input type="email" /> from form-controls.jsx
└── <textarea />                    → <Textarea /> from form-controls.jsx

ContactForm.jsx — after
├── imports: { Input, Textarea } from "@/components/ui/form-controls"
├── No custom Field wrapper
├── No inline styling utilities
└── All form controls token-compliant via form-controls.jsx
```

#### Honeypot Addition — `actions.js`

A honeypot field is added to the server action validation during this refactor. This is a production requirement for any public form — zero UX cost spam protection without CAPTCHA:

```js
// actions.js — server action
// Honeypot field: hidden input, tabIndex={-1}, aria-hidden="true"
// Bots fill it. Humans do not.
// If populated → reject silently, return success state (do not reveal the gate)

// ContactForm.jsx — honeypot field
<input
  type="text"
  name="_honey"
  tabIndex={-1}
  aria-hidden="true"
  style={{ display: "none" }}
/>
```

#### Why Honeypot — Not CAPTCHA

Per spec and DEC-039 context: no CAPTCHA unless spam is a documented post-launch problem. A honeypot field provides baseline production-grade spam protection with zero UX cost and zero implementation dependency on a third-party service.

#### Reasoning

- The Design System contract is explicit: all UI decisions flow through the component system — `ContactForm` is currently the only violation
- `form-controls.jsx` did not exist when `ContactForm` was written — the bespoke implementation was a timing issue, not an intentional design decision
- Composing a non-compliant form into the contact page embeds the violation further and makes it harder to refactor later
- The `Field` wrapper sub-component duplicates functionality already built into `form-controls.jsx` — there is no reason to preserve it

#### Consequences

- ✅ Design System contract fully restored — no component in violation
- ✅ `ContactForm` is token-compliant — styling changes propagate from `form-controls.jsx`
- ✅ Honeypot provides production-grade spam protection at zero UX cost
- ✅ No third-party dependency introduced for spam protection
- ⚠️ Refactor must be completed and reviewed before `ContactForm` is composed into the contact page — this is a blocking prerequisite for Step 7
- ⚠️ Honeypot field must be validated server-side in `actions.js` — client-side validation of the honeypot defeats its purpose
- ⚠️ Honeypot rejection must return a success response — revealing the gate to bots reduces its effectiveness

---

## 5. Proposed Amendments

> No amendments currently proposed.

---

## 6. Superseded Decisions

> None at this time.

---

## 7. Deprecated Decisions

> None at this time.
