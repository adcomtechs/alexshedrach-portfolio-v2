// features/projects/ViewToggle/ViewToggle.jsx
"use client";
//
// use client justified — localStorage and router.push cannot run server-side.
// Scoped to this component only. ProjectIndex remains RSC. (DEC-028)
//
// Receives `activeView` from page.jsx (derived from URL searchParams).
// On toggle: writes localStorage + pushes URL with updated view param.
// On mount: if no explicit view in URL, syncs localStorage preference to URL.
//   Uses router.replace (not push) to avoid polluting browser history.
//
// Grid is the URL default — omitted from the URL to keep it clean.
// "list" appears in the URL only when active: /projects?view=list
// All other active params (domain, status, page) are preserved on push.

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect } from "react";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "projects-view";

const TOGGLE_OPTIONS = [
  { key: "grid", Icon: LayoutGrid, label: "Grid view" },
  { key: "list", Icon: List, label: "List view" },
];

/**
 * ViewToggle
 *
 * Grid / list layout toggle for the projects index. Ships unconditionally —
 * not gated by data conditions. Always visible alongside the filter row. (DEC-028)
 *
 * State is URL-first. localStorage is a persistence layer for returning visitors
 * who have not set an explicit URL param. The server always wins on first paint —
 * no hydration mismatch because `activeView` comes from the server-rendered URL.
 *
 * @param {"grid"|"list"} activeView - Current view derived from URL in page.jsx.
 */
export function ViewToggle({ activeView = "grid" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Mount sync — runs once. If the URL has no explicit view param, check
  // localStorage. If it contains "list", redirect to preserve the preference.
  // router.replace keeps browser history clean — this is a preference restore,
  // not a user-initiated navigation.
  useEffect(() => {
    if (searchParams.has("view")) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "list") {
        const params = new URLSearchParams(searchParams.toString());
        params.set("view", "list");
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    } catch {
      // localStorage may be unavailable in privacy-restricted contexts.
      // Silent fail — the toggle still functions via URL state.
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleViewChange(view) {
    // Persist preference for future visits
    try {
      localStorage.setItem(STORAGE_KEY, view);
    } catch {
      // Silent fail — localStorage unavailable
    }

    // Build updated URL — preserve all existing params (domain, status, page).
    // Grid is the default: omit the param to keep URLs clean.
    // List is explicit: always present in the URL when active.
    const params = new URLSearchParams(searchParams.toString());
    if (view === "grid") {
      params.delete("view");
    } else {
      params.set("view", view);
    }

    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }

  return (
    <div
      className="flex items-center gap-0.5 p-1 rounded-lg shrink-0"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border-sub)",
      }}
      role="group"
      aria-label="View layout"
    >
      {TOGGLE_OPTIONS.map(({ key, Icon, label }) => {
        const isActive = activeView === key;
        return (
          <button
            key={key}
            onClick={() => handleViewChange(key)}
            aria-label={label}
            aria-pressed={isActive}
            className={cn(
              "flex items-center justify-center w-7 h-7 rounded-md",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1",
              "focus-visible:ring-offset-[var(--color-surface)]",
              isActive
                ? "bg-[var(--color-accent-bg)] text-[var(--color-accent)]"
                : [
                    "text-[var(--color-faint)]",
                    "hover:text-[var(--color-muted)]",
                    "hover:bg-[var(--color-surface-2)]",
                  ],
            )}
          >
            <Icon size={15} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
