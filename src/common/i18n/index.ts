import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const LANGUAGE_STORAGE_KEY = "app.language";

export const SUPPORTED_LANGUAGES = ["es", "en"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  es: "Español",
  en: "English",
};

type LocaleModule = { default: Record<string, unknown> };

const localeModules = import.meta.glob<LocaleModule>("./locales/*/*.json", {
  eager: true,
});

const resources = Object.entries(localeModules).reduce<
  Record<string, Record<string, Record<string, unknown>>>
>((acc, [path, module]) => {
  const match = path.match(/\.\/locales\/([^/]+)\/([^/]+)\.json$/);
  if (!match) return acc;
  const [, language, namespace] = match;
  acc[language] = acc[language] ?? {};
  acc[language][namespace] = module.default;
  return acc;
}, {});

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "es",
    supportedLngs: SUPPORTED_LANGUAGES,
    load: "languageOnly",
    nonExplicitSupportedLngs: true,
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ["localStorage"],
      convertDetectedLanguage: (language: string) => language.split("-")[0],
    },
    saveMissing: import.meta.env.DEV,
    missingKeyHandler: import.meta.env.DEV
      ? (lngs: readonly string[], ns: string, key: string) => {
          console.warn(
            `[i18n] clave faltante: "${ns}:${key}" (idiomas: ${lngs.join(", ")})`,
          );
        }
      : undefined,
  });

const applyDocumentLanguage = (language: string) => {
  document.documentElement.lang = language;
};

applyDocumentLanguage(i18n.resolvedLanguage ?? "es");
i18n.on("languageChanged", applyDocumentLanguage);

export default i18n;
