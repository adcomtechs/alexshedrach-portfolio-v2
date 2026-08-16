// app/providers.jsx
"use client";

/**
 * Providers
 *
 * Client boundary for all React context providers. This is the only
 * "use client" wrapper at the app shell level — everything above this
 * in the tree remains a Server Component.
 *
 * Current providers:
 *   ThemeProvider — syncs React state with the data-theme attribute
 *                   set by the blocking inline script in layout.jsx.
 *
 * Adding a new provider:
 *   1. Define it in this file or import it from lib/
 *   2. Nest it inside <ThemeProvider> below
 *   3. Log the decision in DECISIONS.md if it introduces a new dependency
 */

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
} from "react";

// ─── Theme Context ─────────────────────────────────────────────────────────────

const ThemeContext = createContext(null);

const STORAGE_KEY = "theme";
const DARK = "dark";
const LIGHT = "light";
const themeListeners = new Set();

function readDomTheme() {
  if (typeof document === "undefined") return DARK;
  return document.documentElement.getAttribute("data-theme") === LIGHT
    ? LIGHT
    : DARK;
}

function emitThemeChange() {
  for (const listener of themeListeners) listener();
}

function subscribeTheme(listener) {
  themeListeners.add(listener);

  const onStorage = (event) => {
    if (event.key === STORAGE_KEY) emitThemeChange();
  };

  window.addEventListener("storage", onStorage);
  return () => {
    themeListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * ThemeProvider
 *
 * Reads the initial theme from the DOM — the blocking inline script in layout.jsx
 * has already set `data-theme` on <html> before React hydrates, preventing flash.
 * This provider syncs React state with that existing DOM state rather than
 * overwriting it, which avoids a hydration mismatch.
 *
 * On change, writes to localStorage and updates the data-theme attribute.
 * CSS variables in themes.css are tied to [data-theme="light"] — no class
 * switching, no JS-driven style injection.
 */
function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(subscribeTheme, readDomTheme, () => DARK);

  const setTheme = useCallback((next) => {
    const resolved = next === LIGHT ? LIGHT : DARK;

    // Persist preference
    try {
      localStorage.setItem(STORAGE_KEY, resolved);
    } catch {
      // localStorage may be unavailable in private browsing — non-fatal
    }

    // Update the DOM attribute CSS variables are scoped to
    if (resolved === LIGHT) {
      document.documentElement.setAttribute("data-theme", LIGHT);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    emitThemeChange();
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === DARK ? LIGHT : DARK);
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── useTheme hook ─────────────────────────────────────────────────────────────

/**
 * useTheme
 *
 * Consumes ThemeContext. Must be called inside a component rendered
 * within <Providers>.
 *
 * Returns:
 *   theme       — "dark" | "light"
 *   setTheme    — (theme: "dark" | "light") => void
 *   toggleTheme — () => void
 *
 * Usage:
 *   const { theme, toggleTheme } = useTheme();
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within <Providers>");
  }
  return ctx;
}

// ─── Providers shell ───────────────────────────────────────────────────────────

/**
 * Providers
 *
 * Drop this around {children} in RootLayout. Add new providers by nesting
 * them here — outermost providers have the broadest scope.
 */
export function Providers({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
