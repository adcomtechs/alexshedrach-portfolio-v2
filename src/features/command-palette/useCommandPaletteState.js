// features/command-palette/useCommandPaletteState.js
"use client";

import { useSyncExternalStore } from "react";
import { getSnapshot, subscribe } from "./store";

/**
 * Server and client snapshots are identical (both start closed), so
 * this is safe to read during hydration — no mismatch, no `mounted`
 * guard required, unlike ThemeToggle's genuinely stateful case.
 */
export function useCommandPaletteState() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
