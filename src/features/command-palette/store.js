// features/command-palette/store.js
//
// Minimal external store for command-palette open state. Not a React
// Context: CommandTrigger (header) and CommandPalette (root layout)
// don't share a client ancestor by design, since SiteHeader is an RSC
// per DESIGN_SYSTEM.md §4.2. This is plain JS — no "use client" needed,
// it never touches window/document itself; only components that read
// or call into it do.

let state = { isOpen: false };
const listeners = new Set();

function emit() {
  for (const listener of listeners) listener(state);
}

export function getSnapshot() {
  return state;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function openCommandPalette() {
  if (state.isOpen) return;
  state = { isOpen: true };
  emit();
}

export function closeCommandPalette() {
  if (!state.isOpen) return;
  state = { isOpen: false };
  emit();
}
