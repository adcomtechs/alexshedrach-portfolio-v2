// features/command-palette/CommandPalette.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  SunMoon,
  Mail,
  CornerDownLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/app/providers";
import { NAV_LINKS } from "@/components/layout/site-header/constants";
import { useCommandPaletteState } from "./useCommandPaletteState";
import { closeCommandPalette, openCommandPalette } from "./store";

// ASSUMPTION: lib/config/site.js wasn't in the reviewed file set. Replace
// with `siteConfig.email` (per DEC-029) once that file is available.
const CONTACT_EMAIL = "hello@alexshedrach.dev";

/**
 * CommandPalette
 *
 * Mounted once in app/layout.jsx alongside <ChatWidget />.
 *
 * State-reset fix: query/activeIndex used to be reset in a
 * `useEffect(() => { setQuery(""); setActiveIndex(0); }, [isOpen])` —
 * flagged, because it's reacting to a value (isOpen) that already
 * changed rather than syncing an external system. Replaced with the
 * same render-time comparison pattern used in MobileNav
 * (DESIGN_SYSTEM.md §6.2): direct comparison against `isOpen`, bails
 * after one adjustment, resolves before paint.
 *
 * activeIndex clamping fix: `filtered.length` changing used to trigger
 * a dedicated effect that re-clamped stored state — a textbook case of
 * "derived value stored as state instead of computed" (§6.3, row 1).
 * `safeActiveIndex` below is computed at render time instead; nothing
 * is stored, nothing needs syncing.
 *
 * The body-scroll-lock + autofocus effect remains an effect — it's
 * genuine synchronization with the DOM/focus system, not derived state.
 */
export function CommandPalette() {
  const router = useRouter();
  const { isOpen } = useCommandPaletteState();
  const { theme, toggleTheme } = useTheme();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const inputRef = useRef(null);

  // Render-time reset — replaces the old effect-based
  // `setQuery("") / setActiveIndex(0)` pair.
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
    }
  }

  const commands = useMemo(() => {
    const navigate = NAV_LINKS.map(({ label, href }) => ({
      id: `nav-${href}`,
      group: "Navigate",
      label,
      hint: href,
      icon: ArrowRight,
      run: () => router.push(href),
    }));

    const actions = [
      {
        id: "action-theme",
        group: "Actions",
        label:
          theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        hint: "Toggle appearance",
        icon: SunMoon,
        run: () => toggleTheme(),
      },
      {
        id: "action-email",
        group: "Actions",
        label: "Copy email address",
        hint: CONTACT_EMAIL,
        icon: Mail,
        run: () => navigator.clipboard.writeText(CONTACT_EMAIL),
      },
    ];

    return [...navigate, ...actions];
  }, [router, theme, toggleTheme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q),
    );
  }, [commands, query]);

  // Computed, not stored — never drifts out of range, no clamp effect needed.
  const safeActiveIndex =
    filtered.length === 0 ? -1 : Math.min(activeIndex, filtered.length - 1);

  // The real shortcut — legitimate effect, subscribes to a browser event.
  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openCommandPalette();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

 // Body scroll lock + autofocus + Escape — one effect, one external-system sync.
// Escape moved out of handleKeyDown deliberately: that handler only fires
// for keydowns that bubble through the dialog subtree, which depends on
// focus staying inside it. A stray mousedown on a non-focusable element
// (e.g. the backdrop) blurs the input to <body> and silently breaks that
// path. A window-level listener, gated on isOpen, closes regardless of
// where focus currently sits — same reasoning as the Cmd+K listener above.
useEffect(() => {
  if (!isOpen) return;

  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  inputRef.current?.focus();

  function onKeyDown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeCommandPalette();
    }
  }
  window.addEventListener("keydown", onKeyDown);

  return () => {
    document.body.style.overflow = previousOverflow;
    window.removeEventListener("keydown", onKeyDown);
  };
}, [isOpen]);

  function runCommand(command) {
    if (!command) return;
    command.run();
    closeCommandPalette();
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filtered.length === 0) return;
      setActiveIndex((safeActiveIndex + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filtered.length === 0) return;
      setActiveIndex((safeActiveIndex - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      runCommand(filtered[safeActiveIndex]);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-100 flex items-start justify-center px-3 pt-20 sm:px-4 sm:pt-[15vh]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeCommandPalette();
      }}
    >
      <div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 animate-fade-in"
  style={{
    background: "color-mix(in srgb, var(--color-bg) 70%, transparent)",
  }}
/>

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={handleKeyDown}
        className={cn(
          "relative w-full max-w-lg overflow-hidden rounded-xl",
          "border border-(--color-border) bg-(--color-surface)",
          "animate-scale-in",
        )}
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
        <div className="flex items-center gap-2.5 px-4 border-b border-(--color-border-sub)">
          <Search
            size={15}
            aria-hidden="true"
            style={{ color: "var(--color-faint)" }}
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages and actions…"
            aria-label="Search commands"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-list"
            aria-activedescendant={filtered[safeActiveIndex]?.id}
            className="flex-1 bg-transparent border-0 outline-none py-3.5"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              color: "var(--color-fg)",
            }}
          />
          <kbd
            className="px-1.5 py-0.5 rounded border border-(--color-border) shrink-0"
            style={{ fontSize: "var(--text-xs)", color: "var(--color-faint)" }}
          >
            Esc
          </kbd>
        </div>

        <div
          id="command-palette-list"
          role="listbox"
          aria-label="Commands"
          className="max-h-80 overflow-y-auto py-2"
        >
          {filtered.length === 0 && (
            <p
              className="px-4 py-6 text-center"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-faint)",
              }}
            >
              No matches for &ldquo;{query}&rdquo;
            </p>
          )}

          {["Navigate", "Actions"].map((group) => {
            const items = filtered.filter((c) => c.group === group);
            if (items.length === 0) return null;

            return (
              <div key={group} className="mb-1 last:mb-0">
                <p
                  className="px-4 pt-2 pb-1"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--color-faint)",
                  }}
                >
                  {group}
                </p>

                {items.map((command) => {
                  const index = filtered.indexOf(command);
                  const isActive = index === safeActiveIndex;
                  const Icon = command.icon;

                  return (
                    <button
                      key={command.id}
                      id={command.id}
                      role="option"
                      aria-selected={isActive}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => runCommand(command)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 text-left",
                        "transition-colors duration-100",
                        isActive && "bg-(--color-surface-2)",
                      )}
                    >
                      <Icon
                        size={14}
                        aria-hidden="true"
                        className="shrink-0"
                        style={{
                          color: isActive
                            ? "var(--color-accent)"
                            : "var(--color-faint)",
                        }}
                      />
                      <span
                        className="min-w-0 flex-1 truncate"
                        style={{
                          fontSize: "var(--text-sm)",
                          color: "var(--color-fg)",
                        }}
                      >
                        {command.label}
                      </span>
                      <span
                        className="hidden max-w-36 shrink-0 truncate text-right sm:inline"
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--color-faint)",
                        }}
                      >
                        {command.hint}
                      </span>
                      {isActive && (
                        <CornerDownLeft
                          size={12}
                          aria-hidden="true"
                          style={{ color: "var(--color-faint)" }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
