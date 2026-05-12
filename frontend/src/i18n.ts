import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ru from "./locales/ru.json";
import en from "./locales/en.json";

const LANGUAGE_STORAGE_KEY = "wikimonorepo-ui-language";
const storedLanguage = () => typeof window !== "undefined" ? localStorage.getItem(LANGUAGE_STORAGE_KEY) : null;
const language = () => storedLanguage() === "en" ? "en" : "ru";


i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: language(),
  fallbackLng: "ru",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
