import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import website from "../../website.json";

export type Locale = "en" | "ja";
type I18n = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (en: string, ja: string) => string;
};

const preferenceKey = "blog-editor-ui-language";
const I18nContext = createContext<I18n>({
  locale: "en",
  setLocale: () => {},
  t: en => en
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    try {
      return localStorage.getItem(preferenceKey) === "ja" ? "ja" : "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    document.documentElement.lang = locale;
    const site = website.languages[locale === "ja" ? "ja" : "default"];
    document.title = `${locale === "ja" ? "編集室" : "Writing room"} · ${site.title}`;
    try {
      localStorage.setItem(preferenceKey, locale);
    } catch {
      // Language switching still works when browser storage is unavailable.
    }
  }, [locale]);

  const value = useMemo<I18n>(
    () => ({ locale, setLocale, t: (en, ja) => (locale === "ja" ? ja : en) }),
    [locale]
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
