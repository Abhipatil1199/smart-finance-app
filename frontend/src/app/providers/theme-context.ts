import { createContext } from "react";

export const THEME_STORAGE_KEY = "smart-finance.theme";

export const THEMES = ["light", "dark", "system"] as const;
export type Theme = (typeof THEMES)[number];

export interface ThemeContextValue {
  theme: Theme;
  /** The theme actually painted, with "system" already resolved. */
  resolvedTheme: Exclude<Theme, "system">;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
