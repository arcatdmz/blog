// Framework-independent contract, compatible with anime-aist.vercel.app.
export type ThemePreference = "system" | "light" | "dark";
export const THEME_KEY = "theme";
export const THEME_QUERY = "(prefers-color-scheme: dark)";
export function readTheme(): ThemePreference {
  try {
    const value = localStorage.getItem(THEME_KEY);
    if (value === "light" || value === "dark") return value;
  } catch {
    /* Storage may be disabled; OS remains the default. */
  }
  return "system";
}
export function applyTheme(preference: ThemePreference) {
  const resolved =
    preference === "system"
      ? window.matchMedia(THEME_QUERY).matches
        ? "dark"
        : "light"
      : preference;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
  return resolved;
}
export function storeTheme(preference: ThemePreference) {
  try {
    if (preference === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, preference);
  } catch {
    /* The selection still works for this page. */
  }
  applyTheme(preference);
}
