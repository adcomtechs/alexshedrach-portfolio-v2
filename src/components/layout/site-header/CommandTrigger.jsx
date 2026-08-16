// components/layout/site-header/CommandTrigger.jsx
"use client";

import { useSyncExternalStore } from "react";
import { Command } from "lucide-react";
import { cn } from "@/lib/utils";
import { openCommandPalette } from "@/features/command-palette/store";

// The platform label differs between server render ("⌘K", always) and
// client render (Mac vs. everything else) but never changes again once
// the client has mounted — there's no event to subscribe to, so
// `subscribe` is a no-op unsubscribe. This is the textbook
// useSyncExternalStore case for a browser-only value that disagrees
// with the server snapshot: it replaces the old
// `useState + useEffect(() => setLabel(...), [])` pair entirely, so
// there's no setState-in-effect to flag and no extra render — React
// resolves the correct value in the same commit that hydrates.
function subscribe() {
  return () => {};
}

function getClientLabel() {
  const isMac = /mac/i.test(navigator.platform ?? navigator.userAgent);
  return isMac ? "⌘K" : "Ctrl K";
}

function getServerLabel() {
  return "⌘K";
}

/**
 * CommandTrigger
 *
 * Opens the real command palette via the shared store. `use client` is
 * required regardless — a native <button onClick> can't live inside a
 * Server Component — but no effect is needed for the label anymore.
 */
export function CommandTrigger() {
  const label = useSyncExternalStore(subscribe, getClientLabel, getServerLabel);

  return (
    <button
      onClick={openCommandPalette}
      aria-label="Open command palette"
      aria-keyshortcuts="Meta+K Control+K"
      className={cn(
        "hidden lg:inline-flex items-center gap-2",
        "h-7 px-2.5 rounded-md",
        "border border-(--color-border) bg-(--color-surface)",
        "transition-[border-color,background,color] duration-150",
        "hover:bg-(--color-surface-2) hover:text-(--color-fg)",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)",
      )}
      style={{
        fontSize: "var(--text-xs)",
        fontWeight: 500,
        color: "var(--color-faint)",
      }}
    >
      <Command size={11} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
