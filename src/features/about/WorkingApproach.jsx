// features/about/WorkingApproach.jsx
// use client — justifications:
//   1. IntersectionObserver for section entrance animation.
//   2. useState for active annotation — phrase ↔ annotation sync.
//   3. useSyncExternalStore subscribing to `(hover: none)` — determines
//      touch vs. pointer input so the interaction model can diverge safely
//      (see correction #2 below). Matches the canonical pattern already
//      established in DESIGN_SYSTEM.md §6.5 for OS-preference media queries.
// Logged in AI_CONTEXT.md use client ledger as
// "WorkingApproach — IntersectionObserver + annotation hover/tap state".
//
// PROPOSED AMENDMENT — DEC-045 (unchanged, carried forward):
//   Original: "minimal" SectionBackground.
//   Proposed: custom atmospheric background (unchanged from prior implementation).
//   Container: wide (1152px) — document + sidebar layout needs the room.
//   Log before commit.
//
// CORRECTIONS APPLIED IN THIS PASS (flagged per AI_CONTEXT.md §8 — not
// silent overrides):
//
//   1. DESIGN_SYSTEM.md §2.3 — the entire COLOR map and
//      WorkingApproachBackground were built from hardcoded
//      rgba(181,242,61,…) / rgba(245,158,11,…) literals. Replaced with a
//      tint() helper resolving through color-mix() against --color-accent
//      / --color-warning, so light theme's darker hexes apply correctly
//      instead of dark-theme lime/amber bleeding through.
//
//   2. Functional bug, not a style bug — the annotation sidebar was
//      `hidden lg:flex`, and the ONLY way to reach an annotation was
//      hovering its inline phrase. Below `lg` (i.e. every touch device)
//      the annotations — the actual content this section exists to
//      surface — were unreachable. Fixed two ways:
//        a. A `lg:hidden` stacked annotation list now renders below the
//           document body, so all annotations are always readable on
//           mobile/tablet without depending on interaction at all.
//        b. Phrase ↔ annotation sync now also works via tap, gated behind
//           a `useIsTouchDevice()` check so desktop hover behavior is
//           unchanged (no double-toggle from click-after-hover on mouse).
//
//   3. Removed a stale commented-out duplicate paragraph render (dead
//      code left over from the per-paragraph splitting change).
//
// Layout: annotated working document.
//
// Desktop (lg+): document body (left, ~fluid) + annotation sidebar (right, 280px).
// Below lg:      document body full width, all annotations render as a
//                stacked list beneath it — content-equivalent, not hidden.
//
// Phrase highlighting: narrative is split at known annotation phrases.
// Matching spans render with color treatment and trigger annotation sync
// on hover (pointer) or tap (touch).

"use client";

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useSyncExternalStore,
} from "react";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/ui/Heading";
import { aboutData } from "./about-data";

// ── useIsTouchDevice ───────────────────────────────────────────────────────────
//
// Subscribes to `(hover: none)` — mirrors the reduced-motion media-query
// pattern already canonical in this codebase (DESIGN_SYSTEM.md §6.5).
// Used only to decide whether phrase/annotation activation should also
// respond to click — hover handlers are unconditional and unaffected.

function subscribeHoverCapability(callback) {
  const mq = window.matchMedia("(hover: none)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getHoverSnapshot() {
  return window.matchMedia("(hover: none)").matches;
}
function getHoverServerSnapshot() {
  return false;
}
function useIsTouchDevice() {
  return useSyncExternalStore(
    subscribeHoverCapability,
    getHoverSnapshot,
    getHoverServerSnapshot,
  );
}

// Resolves a tint through the active theme's accent/warning color instead
// of a hardcoded literal — see correction #1 above.
function tint(colorVar, percent) {
  return `color-mix(in srgb, var(${colorVar}) ${percent}%, transparent)`;
}

// ── Annotation config — design-layer, not editorial ───────────────────────────
//
// phrase     — exact substring in aboutData.workingApproach.narrative.
//              Must match character-for-character.
// label      — short mono tag shown in highlighted span and annotation card.
// color      — "accent" | "warning" — two-tone palette from the background.
// annotation — the margin annotation: what this practice produces in practice.
//              This is content, not the narrative itself. Keep to two lines max.

const ANNOTATIONS = [
  {
    phrase: "making reasoning visible early",
    label: "Documentation-first",
    color: "accent",
    annotation:
      "Architectural intent is legible before the first line of implementation — collaborators inherit context, not confusion.",
  },
  {
    phrase: "iterative delivery with working vertical slices",
    label: "Vertical slice delivery",
    color: "warning",
    annotation:
      "Each slice ships end-to-end and is usable on its own. Progress is measurable, not just committed.",
  },
  {
    phrase: "domain logic isolated from framework logic",
    label: "Domain isolation",
    color: "accent",
    annotation:
      "Framework rewrites don't touch business rules. Debugging stays scoped. Future engineers inherit intention, not entanglement.",
  },
  {
    phrase: "Teaching alongside development",
    label: "Context-forward collaboration",
    color: "warning",
    annotation:
      "Decisions are explained as they happen. Another engineer can continue the work without reverse-engineering intent from the codebase.",
  },
];

// Color maps for accent and warning — resolved through tint(), theme-aware.
const COLOR = {
  accent: {
    highlight: tint("--color-accent", 12),
    border: tint("--color-accent", 35),
    borderActive: tint("--color-accent", 70),
    text: "var(--color-accent)",
    tag: tint("--color-accent", 8),
    tagBorder: tint("--color-accent", 20),
    annotationBg: tint("--color-accent", 4),
    annotationBorder: tint("--color-accent", 18),
    annotationBorderLeft: "var(--color-accent)",
  },
  warning: {
    highlight: tint("--color-warning", 10),
    border: tint("--color-warning", 30),
    borderActive: tint("--color-warning", 65),
    text: "var(--color-warning)",
    tag: tint("--color-warning", 7),
    tagBorder: tint("--color-warning", 20),
    annotationBg: tint("--color-warning", 4),
    annotationBorder: tint("--color-warning", 16),
    annotationBorderLeft: "var(--color-warning)",
  },
};

// ── parseNarrative ────────────────────────────────────────────────────────────
//
// Splits the narrative string at every annotation phrase, returning an array
// of segments: { text, annotation? }.
// Plain text segments have no annotation. Annotated segments carry the full
// annotation config object.
// Order matters — phrases are applied sequentially. No phrase may be a
// substring of another phrase in this array.

function parseNarrative(narrative) {
  let remaining = narrative;
  const segments = [];

  const ordered = [...ANNOTATIONS].sort(
    (a, b) => narrative.indexOf(a.phrase) - narrative.indexOf(b.phrase),
  );

  for (const ann of ordered) {
    const idx = remaining.indexOf(ann.phrase);
    if (idx === -1) continue;

    if (idx > 0) {
      segments.push({ text: remaining.slice(0, idx) });
    }
    segments.push({ text: ann.phrase, annotation: ann });
    remaining = remaining.slice(idx + ann.phrase.length);
  }

  if (remaining.length > 0) {
    segments.push({ text: remaining });
  }

  return segments;
}

// ── WorkingApproachBackground ─────────────────────────────────────────────────
// Decorative, aria-hidden. Sizing stays fixed across breakpoints — it's a
// background wash behind a bounded document window, not content that can
// overflow or clip.

function WorkingApproachBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        style={{
          position: "absolute",
          width: "560px",
          height: "560px",
          top: "-120px",
          left: "-100px",
          background: `radial-gradient(circle, ${tint("--color-accent", 9)} 0%, transparent 65%)`,
          filter: "blur(90px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "460px",
          height: "460px",
          bottom: "-100px",
          right: "-80px",
          background: `radial-gradient(circle, ${tint("--color-warning", 8)} 0%, transparent 65%)`,
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "280px",
          height: "280px",
          top: "38%",
          right: "20%",
          background: `radial-gradient(circle, ${tint("--color-accent", 4)} 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 90% at 50% 50%, transparent 25%, var(--color-bg) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(to right, transparent 0%, var(--color-accent) 20%, ${tint("--color-accent", 60)} 42%, ${tint("--color-warning", 60)} 58%, var(--color-warning) 80%, transparent 100%)`,
          opacity: 0.45,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
          opacity: 0.015,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}

// ── DocumentHeader ─────────────────────────────────────────────────────────────
//
// Left:   traffic lights (IDE / system convention) — always visible.
// Center: document filename — decorative labeling, hidden below `sm` where
//         three groups can't share one line without wrapping awkwardly.
// Right:  annotation count — informational, always visible.

function DocumentHeader({ annotationCount }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-(--color-border) bg-(--color-surface-2) px-4 py-3 sm:px-6">
      <div className="flex items-center gap-2">
        {[
          "var(--color-danger)",
          "var(--color-warning)",
          "var(--color-success)",
        ].map((color, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="size-2.5 rounded-full"
            style={{ background: color, opacity: 0.45 }}
          />
        ))}
      </div>

      <span
        className="hidden sm:block"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          color: "var(--color-faint)",
          letterSpacing: "0.06em",
        }}
      >
        working-approach.md
      </span>

      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          color: "var(--color-faint)",
        }}
      >
        {annotationCount} annotations
      </span>
    </div>
  );
}

// ── HighlightedPhrase ──────────────────────────────────────────────────────────
//
// An annotated phrase rendered inline within the document body.
// Pointer devices: hover activates it (underline intensifies, bg brightens,
// label chip fades in). Touch devices: tap toggles activation instead —
// hover events don't fire meaningfully on touch, so this is the only way
// touch users can trigger the inline sync at all.
//
// role="button" + aria-pressed reflects that this is genuinely interactive
// now (tap-toggle on touch, keyboard-focusable everywhere) rather than a
// passive text mark.

function HighlightedPhrase({ ann, isActive, isTouch, onEnter, onLeave }) {
  const c = COLOR[ann.color];

  return (
    <span
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      onClick={isTouch ? () => (isActive ? onLeave() : onEnter()) : undefined}
      tabIndex={0}
      role="button"
      aria-pressed={isActive}
      aria-label={`${ann.phrase} — ${ann.label}`}
      style={{
        position: "relative",
        display: "inline",
        borderRadius: "3px",
        background: isActive ? c.highlight : "transparent",
        borderBottom: `2px solid ${isActive ? c.borderActive : c.border}`,
        paddingBottom: "1px",
        cursor: "default",
        transition: "background 200ms ease, border-bottom-color 200ms ease",
        outline: "none",
      }}
    >
      {ann.phrase}

      {/* Inline label chip — floats BELOW the phrase (not above) so it can
          never clip against the document window's rounded/overflow-hidden
          top edge when an early phrase in the first line is active. */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          marginTop: "4px",
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          letterSpacing: "0.04em",
          color: c.text,
          background: c.tag,
          border: `1px solid ${c.tagBorder}`,
          borderRadius: "4px",
          padding: "1px 5px",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          opacity: isActive ? 1 : 0,
          transform: isActive ? "translateY(0)" : "translateY(-4px)",
          transition: "opacity 180ms ease, transform 180ms ease",
          zIndex: 10,
        }}
      >
        {ann.label}
      </span>
    </span>
  );
}

// ── AnnotationCard ─────────────────────────────────────────────────────────────
//
// A single annotation. Used both in the lg+ sidebar and the mobile/tablet
// stacked list — identical component, just a different container around it.
// Active when the corresponding phrase is hovered (pointer) or tapped
// (touch) — or when the card itself receives that interaction, syncing
// back to the phrase.

function AnnotationCard({ ann, isActive, isTouch, onEnter, onLeave }) {
  const c = COLOR[ann.color];

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      onClick={isTouch ? () => (isActive ? onLeave() : onEnter()) : undefined}
      tabIndex={0}
      role="button"
      aria-pressed={isActive}
      className="rounded-lg p-4"
      style={{
        border: `1px solid ${isActive ? c.annotationBorder : "transparent"}`,
        borderLeft: `2px solid ${isActive ? c.annotationBorderLeft : "var(--color-border-sub)"}`,
        background: isActive ? c.annotationBg : "transparent",
        cursor: "default",
        outline: "none",
        transition:
          "background 200ms ease, border-color 200ms ease, border-left-color 200ms ease",
      }}
    >
      <div className="mb-2 flex items-center gap-1.5">
        <span
          aria-hidden="true"
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: c.text,
            flexShrink: 0,
            opacity: isActive ? 1 : 0.4,
            transition: "opacity 200ms ease",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            letterSpacing: "0.06em",
            color: isActive ? c.text : "var(--color-faint)",
            fontWeight: 500,
            transition: "color 200ms ease",
          }}
        >
          {ann.label}
        </span>
      </div>

      <p
        style={{
          fontSize: "var(--text-xs)",
          lineHeight: "var(--leading-relaxed)",
          color: isActive ? "var(--color-muted)" : "var(--color-faint)",
          textWrap: "pretty",
          transition: "color 200ms ease",
        }}
      >
        {ann.annotation}
      </p>
    </div>
  );
}

// ── LineNumbers ────────────────────────────────────────────────────────────────
//
// Mono line numbers in the left gutter — engineering aesthetic. Hidden
// below `md`: at narrow widths the gutter competes directly with the prose
// column for space that the prose needs more.

function LineNumbers({ count = 20 }) {
  return (
    <div
      aria-hidden="true"
      className="hidden flex-col items-end md:flex"
      style={{
        paddingTop: "0.125rem",
        minWidth: "2rem",
        userSelect: "none",
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            lineHeight: "1.75",
            color: "var(--color-border)",
            display: "block",
          }}
        >
          {String(i + 1).padStart(2, "0")}
        </span>
      ))}
    </div>
  );
}

// ── WorkingApproach ───────────────────────────────────────────────────────────

export function WorkingApproach() {
  const { narrative } = aboutData.workingApproach;
  const paragraphs = narrative.split("\n\n");

  const wrapperRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activePhrase, setActivePhrase] = useState(null);
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.06 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handlePhraseEnter = useCallback((phrase) => {
    setActivePhrase(phrase);
  }, []);

  const handlePhraseLeave = useCallback(() => {
    setActivePhrase(null);
  }, []);

  const fadeUp = (delayMs) => ({
    transition: `opacity 640ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms, transform 640ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms`,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(18px)",
  });

  const activeAnnotation = ANNOTATIONS.find((a) => a.phrase === activePhrase);

  return (
    <div ref={wrapperRef}>
      <Section spacing="lg" id="working-approach" className="relative">
        <WorkingApproachBackground />

        <Container size="wide">
          {/* ── Section header — outside document frame ──────────────────── */}
          <div style={fadeUp(0)}>
            <div className="mb-6 flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full"
                style={{ background: "var(--color-accent)" }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                }}
              >
                Working approach
              </span>
            </div>

            <Heading as="h2" size="2" balance className="mb-8 sm:mb-10">
              Making reasoning visible early
            </Heading>
          </div>

          {/* ── Annotated document window ─────────────────────────────────── */}
          <div
            className="overflow-hidden rounded-xl"
            style={{
              ...fadeUp(120),
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-lg), 0 0 0 1px var(--color-border-sub)",
            }}
          >
            <DocumentHeader annotationCount={ANNOTATIONS.length} />

            {/* Document interior — body + sidebar. Single column below lg;
                min-height only applies once the two-page layout exists. */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] lg:min-h-70">
              {/* ── Document body ────────────────────────────────────────── */}
              <div className="flex gap-4 border-b border-(--color-border) p-5 sm:gap-5 sm:p-6 lg:border-b-0 lg:border-r lg:p-8">
                <LineNumbers count={22} />

                <div className="min-w-0 flex-1">
                  {paragraphs.map((para, paraIndex) => {
                    const paraSegments = parseNarrative(para);
                    return (
                      <p
                        key={paraIndex}
                        style={{
                          fontSize: "var(--text-sm)",
                          lineHeight: "1.75",
                          color: "var(--color-muted)",
                          textWrap: "pretty",
                          position: "relative",
                          paddingTop: paraIndex === 0 ? "0.125rem" : 0,
                          marginTop: paraIndex > 0 ? "1em" : 0,
                        }}
                      >
                        {paraSegments.map((seg, i) =>
                          seg.annotation ? (
                            <HighlightedPhrase
                              key={i}
                              ann={seg.annotation}
                              isActive={activePhrase === seg.annotation.phrase}
                              isTouch={isTouch}
                              onEnter={() =>
                                handlePhraseEnter(seg.annotation.phrase)
                              }
                              onLeave={handlePhraseLeave}
                            />
                          ) : (
                            <span key={i}>{seg.text}</span>
                          ),
                        )}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* ── Annotation sidebar — lg+ only ────────────────────────── */}
              <div className="hidden flex-col justify-center gap-2 p-5 lg:flex">
                <span
                  className="mb-2 pl-4"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-faint)",
                    letterSpacing: "0.06em",
                  }}
                >
                  Annotations
                </span>

                {ANNOTATIONS.map((ann) => (
                  <AnnotationCard
                    key={ann.phrase}
                    ann={ann}
                    isActive={activePhrase === ann.phrase}
                    isTouch={isTouch}
                    onEnter={() => handlePhraseEnter(ann.phrase)}
                    onLeave={handlePhraseLeave}
                  />
                ))}
              </div>

              {/* ── Annotation list — below lg only ──────────────────────── */}
              {/*
               * Content-equivalent to the sidebar, not a stripped-down
               * substitute — every annotation renders here unconditionally.
               * This is what makes the section's actual content (the
               * reasoning behind each practice) reachable on touch devices
               * at all; see correction #2 in the file header.
               */}
              <div className="flex flex-col gap-3 p-5 sm:p-6 lg:hidden">
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-faint)",
                    letterSpacing: "0.06em",
                  }}
                >
                  Annotations
                </span>

                {ANNOTATIONS.map((ann) => (
                  <AnnotationCard
                    key={ann.phrase}
                    ann={ann}
                    isActive={activePhrase === ann.phrase}
                    isTouch={isTouch}
                    onEnter={() => handlePhraseEnter(ann.phrase)}
                    onLeave={handlePhraseLeave}
                  />
                ))}
              </div>
            </div>

            {/* ── Document footer — status bar ─────────────────────────────── */}
            {/*
             * Reflects the active annotation regardless of source (hover,
             * tap on an inline phrase, or tap on a card in either the
             * sidebar or the mobile list). Wraps rather than overflows at
             * narrow widths; the secondary "X of X" counter is dropped
             * below `sm` since the primary state (active label, or the
             * prompt) already communicates what matters.
             */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-(--color-border) bg-(--color-surface-2) px-4 py-2 sm:px-6">
              <div className="flex min-w-0 items-center gap-1.5">
                {activeAnnotation ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="shrink-0"
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background:
                          activeAnnotation.color === "warning"
                            ? "var(--color-warning)"
                            : "var(--color-accent)",
                      }}
                    />
                    <span
                      className="truncate"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "var(--text-xs)",
                        color: "var(--color-muted)",
                      }}
                    >
                      {activeAnnotation.label}
                    </span>
                  </>
                ) : (
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      color: "var(--color-faint)",
                    }}
                  >
                    {isTouch
                      ? "Tap a highlighted phrase to explore"
                      : "Hover a highlighted phrase to explore"}
                  </span>
                )}
              </div>

              <span
                className="hidden shrink-0 sm:inline"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-faint)",
                }}
              >
                {ANNOTATIONS.length} of {ANNOTATIONS.length} annotated
              </span>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
