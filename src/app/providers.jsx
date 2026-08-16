// app/providers.jsx
"use client";

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
  if (typeof document === "undefined") {
    return DARK;
  }

  return document.documentElement.getAttribute("data-theme") === LIGHT
    ? LIGHT
    : DARK;
}

function emitThemeChange() {
  for (const listener of themeListeners) {
    listener();
  }
}

function subscribeTheme(listener) {
  themeListeners.add(listener);

  const onStorage = (event) => {
    if (event.key === STORAGE_KEY) {
      const stored =
        event.newValue === LIGHT
          ? LIGHT
          : DARK;

      if (typeof document !== "undefined") {
        if (stored === LIGHT) {
          document.documentElement.setAttribute("data-theme", LIGHT);
        } else {
          document.documentElement.removeAttribute("data-theme");
        }
      }

      listener();
    }
  };

  window.addEventListener("storage", onStorage);

  return () => {
    themeListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

// ─── Theme Provider ────────────────────────────────────────────────────────────

function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    readDomTheme,
    () => DARK,
  );

  const setTheme = useCallback((next) => {
    const resolved = next === LIGHT ? LIGHT : DARK;

    try {
      localStorage.setItem(STORAGE_KEY, resolved);
    } catch {
      // localStorage may be unavailable.
    }

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
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// ─── useTheme ──────────────────────────────────────────────────────────────────

export function useTheme() {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error("useTheme must be used within <Providers>");
  }

  return ctx;
}

// ─── Providers ─────────────────────────────────────────────────────────────────

export function Providers({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}