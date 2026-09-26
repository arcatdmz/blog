import { useEffect, useState } from "react";
import {
  applyTheme,
  readTheme,
  storeTheme,
  THEME_KEY,
  THEME_QUERY,
  type ThemePreference
} from "../../shared/theme";
import { useI18n } from "./i18n";

export default function ThemeSelect() {
  const { t } = useI18n();
  const [preference, setPreference] = useState(readTheme);
  useEffect(() => {
    applyTheme(preference);
    const query = window.matchMedia(THEME_QUERY);
    const onChange = () => {
      if (preference === "system") applyTheme(preference);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_KEY || event.key === null)
        setPreference(readTheme());
    };
    query.addEventListener("change", onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      query.removeEventListener("change", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [preference]);
  return (
    <select
      className="theme-select"
      aria-label={t("Color theme", "配色テーマ")}
      value={preference}
      onChange={event => {
        const next = event.target.value as ThemePreference;
        storeTheme(next);
        setPreference(next);
      }}
    >
      <option value="system">{t("System theme", "OSに合わせる")}</option>
      <option value="light">{t("Light", "ライト")}</option>
      <option value="dark">{t("Dark", "ダーク")}</option>
    </select>
  );
}
