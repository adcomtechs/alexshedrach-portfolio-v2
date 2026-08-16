// components/layout/site-header/DesktopNav.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "./constants";

/**
 * DesktopNav
 *
 * Horizontal nav with an animated sliding underline that tracks mouse
 * position across links and snaps back to the active route on leave.
 *
 * Sources its own pathname — no longer prop-drilled from a client parent,
 * since SiteHeader is now an RSC and can't hold that state itself.
 *
 * The indicator's inline `transition` is still caught by the global
 * `prefers-reduced-motion` rule in animations.css (`!important` on a
 * universal selector beats inline style specificity), so no separate
 * reduced-motion branch is needed here.
 *
 * Hidden below md — MobileNav takes over.
 */
export function DesktopNav() {
  const pathname = usePathname();
  const navRef = useRef(null);
  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
    visible: false,
  });

  const syncToActive = useCallback(() => {
    const activeEl = navRef.current?.querySelector("[data-active='true']");
    if (activeEl) {
      setIndicator({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        visible: true,
      });
    } else {
      setIndicator((prev) => ({ ...prev, visible: false }));
    }
  }, []);

  useEffect(() => {
    syncToActive();
  }, [pathname, syncToActive]);

  function handleMouseEnter(e) {
    const el = e.currentTarget;
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth, visible: true });
  }

  return (
    <nav
      ref={navRef}
      aria-label="Primary navigation"
      className="relative hidden md:flex items-center gap-0"
      onMouseLeave={syncToActive}
    >
      <span
        aria-hidden="true"
        className="absolute bottom-0 h-[1.5px] rounded-full pointer-events-none"
        style={{
          left: indicator.left,
          width: indicator.width,
          background: "var(--color-accent)",
          opacity: indicator.visible ? 1 : 0,
          transition:
            "left 0.22s cubic-bezier(0.22,1,0.36,1), width 0.22s cubic-bezier(0.22,1,0.36,1), opacity 0.15s",
        }}
      />

      {NAV_LINKS.map(({ label, href }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");

        return (
          <Link
            key={href}
            href={href}
            data-active={isActive}
            aria-current={isActive ? "page" : undefined}
            onMouseEnter={handleMouseEnter}
            className={cn(
              "relative px-3.5 py-5 font-medium",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-(--color-accent) focus-visible:rounded-sm",
              isActive
                ? "text-(--color-fg)"
                : "text-(--color-muted) hover:text-(--color-fg)",
            )}
            style={{ fontSize: "var(--text-sm)" }}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}