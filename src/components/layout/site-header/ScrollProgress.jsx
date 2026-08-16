// components/layout/site-header/ScrollProgress.jsx
// RSC-compatible — receives progress as a prop, no hooks

/**
 * ScrollProgress
 *
 * Thin accent bar pinned to the top edge of the header.
 * Visible only while the header is scrolled (parent controls render).
 * Width maps linearly to scroll percentage [0–100].
 *
 * @param {number} progress - Scroll percentage 0–100. From useScrollState.
 */
export function ScrollProgress({ progress }) {
  return (
    <div
      aria-hidden="true"
      className="absolute top-0 left-0 right-0 h-[2px] z-10"
      style={{ background: "var(--color-border-sub)" }}
    >
      <div
        className="h-full origin-left"
        style={{
          width: `${progress}%`,
          background:
            "linear-gradient(90deg, var(--color-accent-dim), var(--color-accent))",
          transition: "width 75ms linear",
        }}
      />
    </div>
  );
}
