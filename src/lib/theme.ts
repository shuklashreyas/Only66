export const THEME_STORAGE_KEY = "only66_theme";

export type AppTheme = "bloodline" | "neon-arena" | "iron-mode" | "gold-run";

export const DEFAULT_THEME: AppTheme = "bloodline";

export const THEMES: { id: AppTheme; name: string; description: string }[] = [
  {
    id: "bloodline",
    name: "BLOODLINE",
    description: "Default black and red Only 66 theme.",
  },
  {
    id: "neon-arena",
    name: "NEON ARENA",
    description: "Black, purple, and cyan arcade signal.",
  },
  {
    id: "iron-mode",
    name: "IRON MODE",
    description: "Brutal black, gray, and white minimalism.",
  },
  {
    id: "gold-run",
    name: "GOLD RUN",
    description: "Black and gold victory-focused palette.",
  },
];

function isTheme(value: string): value is AppTheme {
  return value === "bloodline" || value === "neon-arena" || value === "iron-mode" || value === "gold-run";
}

export function getStoredTheme(): AppTheme {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value && isTheme(value) ? value : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function applyTheme(theme: AppTheme): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
}

export function setStoredTheme(theme: AppTheme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // no-op
  }
  applyTheme(theme);
}

export function initTheme(): AppTheme {
  const theme = getStoredTheme();
  applyTheme(theme);
  return theme;
}