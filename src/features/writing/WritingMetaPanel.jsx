// features/writing/WritingMetaPanel.jsx
//
// use client — leaf boundary only, per DESIGN_SYSTEM.md §4.2. Owns:
//   1. Card tilt on pointer move (disabled under prefers-reduced-motion)
//   2. Count-up on mount for the published post count
//   3. Reading-depth bar fill on mount
//   4. Hover glow / accent transitions on interactive rows
//
// Add to the use client ledger (AI_CONTEXT.md §4) before merging:
//   | `WritingMetaPanel` | Pointer-driven tilt, count-up, and bar-fill
//   animation — browser-only rAF + pointer position, scoped to this leaf | DEC-048 |
//
// Design-system fixes applied vs. the previous version:
//   - Every `rgba(181,242,61,…)` hardcoded accent tint replaced with
//     `color-mix(in srgb, var(--color-accent) N%, transparent)` — DESIGN_SYSTEM.md
//     §2.3 explicitly names this exact rgba triplet as prohibited.
//   - Hover elevation now composes `var(--shadow-glow)` instead of a
//     hand-rolled accent-rgba box-shadow — same rule, theme-aware for free.
//   - All 10px/11px inline font sizes replaced with `var(--text-2xs)`
//     (see tokens.css note below) — raw pixel type sizes violate §1.2/§1.3.
//   - Tilt, count-up, and bar-fill are now gated behind
//     `usePrefersReducedMotion` — DESIGN_SYSTEM.md §8 requires a
//     reduced-motion fallback for every animation.
//   - No effect calls setState synchronously in its body anymore (the
//     compiler-flagged anti-pattern in DESIGN_SYSTEM.md §6.3, table row 1:
//     "derived value stored as state instead of computed"). `useCountUp`'s
//     disabled path and `barsReady`'s reduced-motion path are now derived
//     during render; the mount-reveal effect is gone entirely in favor of
//     a pure CSS `animate-fade-in` class (animations.css), which needs no
//     JS state at all and can't fight the tilt transform since it only
//     touches `opacity`.
//
// Import `usePrefersReducedMotion` from your existing hooks/ file — do not
// duplicate it here.
//
// Requires a new token in tokens.css (not yet present in the current
// typography scale — flagging per §1.2 "add the token, don't inline the
// value"). Recommend logging as the next decision, DEC-053:
//
//   --text-2xs: 0.6875rem; /* 11px — micro UI chrome: code-panel labels,
//                              timestamps, meta chips */
//
// Add it directly below --text-xs in the @theme block.

"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// Theme-safe accent tint — replaces every hardcoded rgba(181,242,61,…) value.
const accentTint = (pct) =>
  `color-mix(in srgb, var(--color-accent) ${pct}%, transparent)`;

// ── useCountUp ──────────────────────────────────────────────────────────────
//
// Animates a number from 0 to `target` over `duration` ms via rAF.
// Skips the animation entirely (jumps straight to `target`) when `disabled`
// is true — the reduced-motion path.

function useCountUp(
  target,
  { duration = 900, delay = 300, disabled = false } = {},
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    // Reduced motion (or nothing to count) — no animation to run. Return
    // early without touching state; the final value is derived below.
    if (disabled || target === 0) return;

    let start = null;
    let raf;

    const delayTimeout = setTimeout(() => {
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        setValue(Math.round(eased * target));
        if (progress < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(delayTimeout);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, delay, disabled]);

  // Derived, not stored — disabled always reads as the final target.
  return disabled ? target : value;
}

// ── ReadDepthBar ──────────────────────────────────────────────────────────

function ReadDepthBar({
  label,
  count,
  total,
  color,
  icon,
  delayMs,
  ready,
  reducedMotion,
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div>
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: "6px" }}
      >
        <div className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            style={{ fontSize: "var(--text-2xs)", lineHeight: 1 }}
          >
            {icon}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--color-muted)",
            }}
          >
            {label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              color,
            }}
          >
            {count}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-2xs)",
              color: "var(--color-faint)",
            }}
          >
            {pct}%
          </span>
        </div>
      </div>

      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        style={{
          height: "3px",
          borderRadius: "2px",
          background: "var(--color-surface-2)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: ready ? `${pct}%` : "0%",
            background: `linear-gradient(to right, ${color}, ${color}88)`,
            borderRadius: "2px",
            transition: reducedMotion
              ? "none"
              : `width 800ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms`,
          }}
        />
      </div>
    </div>
  );
}

// ── TopicChip ───────────────────────────────────────────────────────────

function TopicChip({ children }) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-block",
        paddingInline: "8px",
        paddingBlock: "3px",
        borderRadius: "4px",
        background: hovered ? accentTint(7) : "var(--color-surface-2)",
        border: `1px solid ${hovered ? accentTint(25) : "var(--color-border-sub)"}`,
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-2xs)",
        color: hovered ? "var(--color-accent)" : "var(--color-faint)",
        letterSpacing: "0.04em",
        cursor: "default",
        transition:
          "background 180ms ease, border-color 180ms ease, color 180ms ease",
        userSelect: "none",
      }}
    >
      {children}
    </span>
  );
}

// ── LatestPostCard ─────────────────────────────────────────────────────

function LatestPostCard({ post }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={`/writing/${post.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) rounded-md"
      style={{
        padding: "0.75rem",
        borderRadius: "6px",
        background: hovered ? accentTint(4) : "transparent",
        border: `1px solid ${hovered ? accentTint(18) : "var(--color-border-sub)"}`,
        transition: "background 180ms ease, border-color 180ms ease",
        textDecoration: "none",
      }}
    >
      <p
        style={{
          fontSize: "var(--text-sm)",
          fontWeight: 500,
          lineHeight: "var(--leading-snug)",
          color: hovered ? "var(--color-accent)" : "var(--color-fg)",
          marginBottom: "0.5rem",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          transition: "color 180ms ease",
        }}
      >
        {post.title}
      </p>

      <div
        className="flex items-center justify-between gap-2"
        style={{ marginTop: "0.375rem" }}
      >
        <div className="flex items-center gap-2">
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-2xs)",
              color: "var(--color-faint)",
              letterSpacing: "0.04em",
            }}
          >
            {post.publishedFormatted}
          </span>

          {post.readTime && (
            <>
              <span
                aria-hidden="true"
                style={{
                  width: "3px",
                  height: "3px",
                  borderRadius: "50%",
                  background: "var(--color-faint)",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-2xs)",
                  color: "var(--color-faint)",
                  letterSpacing: "0.04em",
                }}
              >
                {post.readTime}
              </span>
            </>
          )}
        </div>

        <span
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-accent)",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateX(0)" : "translateX(-4px)",
            transition: "opacity 180ms ease, transform 180ms ease",
            flexShrink: 0,
          }}
        >
          →
        </span>
      </div>
    </a>
  );
}

// ── WritingMetaPanel ───────────────────────────────────────────────────

export function WritingMetaPanel({
  postCount,
  quickCount,
  deepCount,
  topTags,
  latestPost,
  totalReadTime,
}) {
  const reducedMotion = usePrefersReducedMotion();

  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [barsReady, setBarsReady] = useState(false);

  const animatedCount = useCountUp(postCount, {
    duration: 800,
    delay: 350,
    disabled: reducedMotion,
  });

  // Reduced motion has nothing to animate toward — no timer needed, so the
  // effect returns early without a setState call. The actual "ready" value
  // used below is derived (`depthBarsReady`), not stored redundantly here.
  useEffect(() => {
    if (reducedMotion) return;
    const t = setTimeout(() => setBarsReady(true), 480);
    return () => clearTimeout(t);
  }, [reducedMotion]);

  // Derived: reduced motion means bars render at full width immediately,
  // with no separate "ready" state to track for that case.
  const depthBarsReady = reducedMotion || barsReady;

  const handleMouseMove = useCallback(
    (e) => {
      if (reducedMotion) return;
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      setTilt({ x: dy * -2.5, y: dx * 2.5 });
    },
    [reducedMotion],
  );

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  const isFlat = tilt.x === 0 && tilt.y === 0;
  const totalPosts = quickCount + deepCount;

  const readTimeLabel =
    totalReadTime && totalReadTime > 0
      ? totalReadTime >= 60
        ? `~${Math.round(totalReadTime / 60)} hr reading`
        : `~${totalReadTime} min reading`
      : null;

  return (
    <div
      ref={cardRef}
      role="region"
      aria-label="Writing statistics"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={reducedMotion ? undefined : "animate-fade-in"}
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: isHovered
          ? "var(--shadow-lg), var(--shadow-glow)"
          : "var(--shadow-md), 0 0 0 1px var(--color-border-sub)",
        transform: reducedMotion
          ? "none"
          : `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: reducedMotion
          ? "box-shadow 300ms ease"
          : `transform ${isFlat ? "500ms" : "80ms"} cubic-bezier(0.22,1,0.36,1), box-shadow 300ms ease`,
        willChange: reducedMotion ? undefined : "transform",
        position: "relative",
      }}
    >
      {/* Shine overlay — accent-tinted, theme-safe. Skipped under reduced motion. */}
      {!reducedMotion && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${accentTint(4)} 0%, transparent 50%, ${accentTint(2)} 100%)`,
            opacity: isHovered ? 1 : 0,
            transition: "opacity 300ms ease",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}

      {/* ── Header bar ───────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.625rem 1.125rem",
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-surface-2)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ display: "flex", gap: "6px" }} aria-hidden="true">
          {[
            "var(--color-danger)",
            "var(--color-warning)",
            "var(--color-success)",
          ].map((color, i) => (
            <span
              key={i}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: color,
                opacity: 0.45,
                display: "block",
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-2xs)",
            color: "var(--color-faint)",
            letterSpacing: "0.06em",
          }}
        >
          writing-index.json
        </span>

        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-2xs)",
            color: "var(--color-faint)",
          }}
        >
          {postCount} {postCount === 1 ? "post" : "posts"}
        </span>
      </div>

      {/* ── Stats row: count-up + total read time ───────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.125rem 1.125rem 1rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-3xl)",
              lineHeight: 1,
              letterSpacing: "var(--tracking-tight)",
              color: "var(--color-accent)",
              fontWeight: 700,
            }}
          >
            {String(animatedCount).padStart(2, "0")}
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-2xs)",
              letterSpacing: "0.06em",
              color: "var(--color-faint)",
              marginTop: "4px",
            }}
          >
            published
          </p>
        </div>

        {readTimeLabel && (
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                color: "var(--color-fg)",
                lineHeight: 1,
              }}
            >
              {readTimeLabel.split(" ")[0]}
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-2xs)",
                color: "var(--color-faint)",
                marginTop: "4px",
                letterSpacing: "0.04em",
              }}
            >
              {readTimeLabel.split(" ").slice(1).join(" ")}
            </p>
          </div>
        )}
      </div>

      {/* ── Read depth bars ──────────────────────────────────────────── */}
      {(quickCount > 0 || deepCount > 0) && (
        <>
          <div
            aria-hidden="true"
            style={{
              height: "1px",
              background: "var(--color-border-sub)",
              margin: "0 1.125rem",
            }}
          />
          <div
            style={{
              padding: "1rem 1.125rem",
              position: "relative",
              zIndex: 2,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-2xs)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-faint)",
                marginBottom: "0.875rem",
              }}
            >
              Reading depth
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {quickCount > 0 && (
                <ReadDepthBar
                  label="Quick reads"
                  count={quickCount}
                  total={totalPosts}
                  color="var(--color-accent)"
                  icon="⚡"
                  delayMs={0}
                  ready={depthBarsReady}
                  reducedMotion={reducedMotion}
                />
              )}
              {deepCount > 0 && (
                <ReadDepthBar
                  label="In-depth"
                  count={deepCount}
                  total={totalPosts}
                  color="var(--color-info)"
                  icon="◎"
                  delayMs={100}
                  ready={depthBarsReady}
                  reducedMotion={reducedMotion}
                />
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Topics ───────────────────────────────────────────────────── */}
      {topTags.length > 0 && (
        <>
          <div
            aria-hidden="true"
            style={{
              height: "1px",
              background: "var(--color-border-sub)",
              margin: "0 1.125rem",
            }}
          />
          <div
            style={{
              padding: "1rem 1.125rem",
              position: "relative",
              zIndex: 2,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-2xs)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-faint)",
                marginBottom: "0.625rem",
              }}
            >
              Topics
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
              {topTags.map((tag) => (
                <TopicChip key={tag}>{tag}</TopicChip>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Latest post ──────────────────────────────────────────────── */}
      {latestPost && (
        <>
          <div
            aria-hidden="true"
            style={{
              height: "1px",
              background: "var(--color-border-sub)",
              margin: "0 1.125rem",
            }}
          />
          <div
            style={{
              padding: "1rem 1.125rem",
              position: "relative",
              zIndex: 2,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-2xs)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-faint)",
                marginBottom: "0.625rem",
              }}
            >
              Latest
            </p>
            <LatestPostCard post={latestPost} />
          </div>
        </>
      )}

      {/* ── Status bar footer ────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5rem 1.125rem",
          borderTop: "1px solid var(--color-border)",
          background: "var(--color-surface-2)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className={reducedMotion ? undefined : "status-pulse"}
            style={{
              display: "block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "var(--color-accent)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-2xs)",
              color: "var(--color-faint)",
              letterSpacing: "0.04em",
            }}
          >
            Updated as work ships
          </span>
        </div>

        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-2xs)",
            color: "var(--color-faint)",
            letterSpacing: "0.04em",
          }}
        >
          {topTags.length > 0 ? `${topTags.length} topics` : ""}
        </span>
      </div>
    </div>
  );
}
