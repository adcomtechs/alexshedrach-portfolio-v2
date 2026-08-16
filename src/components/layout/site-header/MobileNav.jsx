// components/layout/site-header/MobileNav.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Command, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "./constants";
import { ThemeToggle } from "./ThemeToggle";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Wordmark } from "@/components/ui/Wordmark";
import { openCommandPalette } from "@/features/command-palette/store";

/**
 * MobileNav
 *
 * Slide-in drawer for sub-md viewports. Sources its own pathname —
 * no longer prop-drilled, since SiteHeader is an RSC and can't hold
 * that state (DESIGN_SYSTEM.md §4.2).
 *
 * Closing on route change is adjusted DURING RENDER, not in an effect.
 * This is the sanctioned exception documented verbatim in
 * DESIGN_SYSTEM.md §6.2 "Resetting state when a prop changes": a direct
 * comparison against a value derived from a hook (pathname), bailing
 * out after one adjustment, with React re-running the body before
 * paint — no extra commit, no cascading render, no lint violation.
 *
 * The `key`-remount alternative mentioned in §6.2 was considered and
 * rejected here: MobileNav's `open` state is exactly the thing that
 * must NOT be blown away by remounting (a remount would also reset
 * ThemeToggle's internal mount-guard and drop the drawer's transition
 * state mid-animation on a fast route change).
 *
 * Accessibility:
 *   - Escape key closes the drawer
 *   - Focus moves to first link on open
 *   - Body scroll is locked while open
 *   - Backdrop click closes the drawer
 *   - aria-expanded on hamburger, aria-hidden on drawer when closed
 *
 * Known limitation: no full Tab focus-trap inside the open drawer —
 * matches the same deliberate, documented limitation on CommandPalette
 * (Escape + backdrop-click both close it, so keyboard users aren't
 * stranded). A real trap is a follow-up, not an oversight.
 */
export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const firstLinkRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  // Render-time reset — replaces the old
  // `useEffect(() => setOpen(false), [pathname])`.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Lock body scroll — legitimate effect, syncs React state to a
  // genuine external system (the DOM's scroll behavior).
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Focus first link on open — legitimate effect, imperative DOM focus
  // management can't be expressed any other way.
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => firstLinkRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Escape to close — legitimate effect, subscribes to a browser event.
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        aria-label={open ? "Close navigation" : "Open navigation"}
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-lg",
          "border border-(--color-border) bg-(--color-surface)",
          "text-(--color-muted) hover:text-(--color-fg)",
          "hover:bg-(--color-surface-2)",
          "transition-[background,border-color,color] duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)",
        )}
      >
        {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
      </button>

      {/* Backdrop — color-mix against --color-bg rather than a hardcoded
          rgba(0,0,0,...), matching CommandPalette's overlay treatment
          so both scrims respond to theme consistently (DESIGN_SYSTEM.md §2.2). */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: "color-mix(in srgb, var(--color-bg) 70%, transparent)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* Drawer */}
      <nav
        id="mobile-nav-drawer"
        aria-label="Mobile navigation"
        aria-hidden={!open}
        className={cn(
          "fixed top-0 right-0 z-50 h-dvh w-[min(22rem,calc(100vw-1rem))]",
          "flex flex-col",
          "border-l border-(--color-border) bg-(--color-surface)",
          "transition-transform duration-300 will-change-transform",
        )}
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between h-14 px-5 border-b border-(--color-border-sub)">
          <Wordmark />

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <button
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-md",
                "text-(--color-muted) hover:text-(--color-fg)",
                "hover:bg-(--color-surface-2) transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)",
              )}
            >
              <X size={17} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Nav links with staggered entrance */}
        <ul className="flex flex-col gap-1 p-4 flex-1" role="list">
          {NAV_LINKS.map(({ label, href }, i) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <li
                key={href}
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? "translateX(0)" : "translateX(12px)",
                  transition: reduced
                    ? "none"
                    : `opacity 0.3s ease ${i * 50 + 60}ms, transform 0.35s cubic-bezier(0.22,1,0.36,1) ${i * 50 + 60}ms`,
                }}
              >
                <Link
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-3 rounded-lg",
                    "font-medium transition-[background,color] duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)",
                    isActive
                      ? "text-(--color-fg) bg-(--color-accent-bg)"
                      : "text-(--color-muted) hover:text-(--color-fg) hover:bg-(--color-surface-2)",
                  )}
                  style={{ fontSize: "var(--text-md)" }}
                >
                  {label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="w-1.5 h-1.5 rounded-full shrink-0 bg-(--color-accent)"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Drawer footer */}
        <div className="p-4 space-y-3 border-t border-(--color-border-sub)">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openCommandPalette();
            }}
            className={cn(
              "flex h-11 w-full items-center justify-between gap-3 rounded-lg px-3.5",
              "border border-(--color-border) bg-(--color-surface-2)",
              "font-medium text-(--color-muted)",
              "transition-[background,color,border-color] duration-150",
              "hover:text-(--color-fg)",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)",
            )}
            style={{ fontSize: "var(--text-sm)" }}
          >
            <span className="inline-flex min-w-0 items-center gap-2">
              <Command size={15} aria-hidden="true" />
              <span>Command palette</span>
            </span>
            <kbd
              className="shrink-0 rounded border border-(--color-border) px-1.5 py-0.5"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-faint)",
              }}
            >
              Ctrl K
            </kbd>
          </button>

          <div
            className="flex items-center gap-2 px-1"
            style={{
              opacity: open ? 1 : 0,
              transition: reduced ? "none" : "opacity 0.4s ease 320ms",
            }}
          >
            <span className="relative flex w-2 h-2" aria-hidden="true">
              <span
                className="status-pulse absolute inline-flex h-full w-full rounded-full"
                style={{ background: "var(--color-success)", opacity: 0.5 }}
              />
              <span
                className="relative inline-flex rounded-full w-2 h-2"
                style={{ background: "var(--color-success)" }}
              />
            </span>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)" }}>
              Open to new opportunities
            </span>
          </div>

          {/* CTA — hover uses color-mix against the live accent token.
              Glow uses the active theme's --shadow-glow value. */}
          <Link
            href="/contact"
            className={cn(
              "flex items-center justify-center gap-2 w-full h-11 rounded-lg",
              "font-bold bg-(--color-accent)",
              "transition-[background,box-shadow,transform] duration-150",
              "hover:-translate-y-px",
              "hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,white)]",
              "hover:shadow-(--shadow-glow)",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)",
            )}
            style={{
              color: "var(--color-accent-contrast)",
              fontSize: "var(--text-sm)",
              opacity: open ? 1 : 0,
              transform: `translateY(${open ? 0 : 8}px)`,
              transition: reduced
                ? "none"
                : "opacity 0.35s ease 370ms, transform 0.35s ease 370ms, background 0.15s, box-shadow 0.15s",
            }}
          >
            Get in touch
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
