import { useCallback, useEffect, useMemo, useState } from "react";

import {
  THEME_STORAGE_KEY,
  THEMES,
  ThemeContext,
  type Theme,
  type ThemeContextValue,
} from "@/app/providers/theme-context";

const DARK_QUERY = "(prefers-color-scheme: dark)";

function readStoredTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return THEMES.includes(stored as Theme) ? (stored as Theme) : "system";
  } catch {
    // Storage is unavailable in private mode and some WebViews.
    return "system";
  }
}

function prefersDark(): boolean {
  return window.matchMedia(DARK_QUERY).matches;
}

/**
 * Dark mode via the `.dark` class that `@custom-variant dark` keys off.
 *
 * The preference is a display setting, not user data, so localStorage is the
 * right store here. The inline script in `index.html` applies the same rule
 * before first paint to avoid a light-theme flash on load.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);
  const [systemIsDark, setSystemIsDark] = useState(prefersDark);

  useEffect(() => {
    const query = window.matchMedia(DARK_QUERY);
    const onChange = (event: MediaQueryListEvent) => setSystemIsDark(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const resolvedTheme = theme === "system" ? (systemIsDark ? "dark" : "light") : theme;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, [resolvedTheme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // A failed write only costs the preference on next load.
    }
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}
