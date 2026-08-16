// components/layout/site-footer/BottomBar.jsx
// RSC — no client directive required

import Link from "next/link";
import { BUILT_WITH } from "./constants";

/**
 * BottomBar
 *
 * Footer bottom strip: copyright, built-with tech tags, attribution.
 * Fully static — no client state needed.
 *
 * `year` is computed at request time on the server, which is correct.
 * It will not drift within a page session.
 */
export function BottomBar() {
  const year = new Date().getFullYear();

  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-between gap-3 py-5"
      style={{ borderTop: "1px solid var(--color-border-sub)" }}
    >
      {/* Copyright */}
      <p
        className="text-center sm:text-left"
        style={{ fontSize: "var(--text-xs)", color: "var(--color-faint)" }}
      >
        &copy; {year} Alex Shedrach. All rights reserved.
      </p>

      {/* Built-with strip */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.625rem",
            color: "var(--color-faint)",
          }}
        >
          Built with
        </span>

        {BUILT_WITH.map((tech, i) => (
          <span key={tech} className="flex items-center gap-1.5">
            <span
              className="font-medium px-1.5 py-0.5 rounded border"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.625rem",
                background: "var(--color-surface)",
                borderColor: "var(--color-border-sub)",
                color: "var(--color-muted)",
              }}
            >
              {tech}
            </span>
            {i < BUILT_WITH.length - 1 && (
              <span
                aria-hidden="true"
                style={{ color: "var(--color-border)", fontSize: "0.5rem" }}
              >
                ·
              </span>
            )}
          </span>
        ))}

        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.625rem",
            color: "var(--color-faint)",
          }}
        >
          · deployed on{" "}
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[var(--color-fg)] transition-colors duration-150"
          >
            Vercel
          </a>
        </span>
      </div>

      {/* Attribution */}
      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-faint)" }}>
        Designed &amp; built by{" "}
        <Link
          href="/about"
          className="underline underline-offset-2 hover:text-[var(--color-fg)] transition-colors duration-150"
        >
          Alex Shedrach
        </Link>
      </p>
    </div>
  );
}
