import { createElement, Fragment } from '../runtime/dom.js';
import { appConfig } from "../config/app.js";
import { createContext, useContext, useEffect } from "../runtime/dom.js";
import { usePreference, setPreference } from "../lib/client-store.js";
import {
  formatCurrency,
  formatDate,
  formatNumber
} from "./format.js";
import en from "../messages/en.js";
import hi from "../messages/hi.js";
import bn from "../messages/bn.js";
import ar from "../messages/ar.js";
import es from "../messages/es.js";
import fr from "../messages/fr.js";
import de from "../messages/de.js";
import ptBR from "../messages/pt-BR.js";
import it from "../messages/it.js";
import zhCN from "../messages/zh-CN.js";
import ja from "../messages/ja.js";
import ko from "../messages/ko.js";
const dictionaries = {
  en,
  es,
  fr,
  de,
  "pt-BR": ptBR,
  it,
  ar,
  hi,
  bn,
  "zh-CN": zhCN,
  ja,
  ko
};
export const locales = [
  { value: "en", label: "\u{1F1FA}\u{1F1F8} English" },
  { value: "es", label: "\u{1F1EA}\u{1F1F8} Espa\xF1ol" },
  { value: "fr", label: "\u{1F1EB}\u{1F1F7} Fran\xE7ais" },
  { value: "de", label: "\u{1F1E9}\u{1F1EA} Deutsch" },
  { value: "pt-BR", label: "\u{1F1E7}\u{1F1F7} Portugu\xEAs (Brasil)" },
  { value: "it", label: "\u{1F1EE}\u{1F1F9} Italiano" },
  { value: "ar", label: "\u{1F1F8}\u{1F1E6} \u0627\u0644\u0639\u0631\u0628\u064A\u0629" },
  { value: "hi", label: "\u{1F1EE}\u{1F1F3} \u0939\u093F\u0928\u094D\u0926\u0940" },
  { value: "bn", label: "\u{1F1E7}\u{1F1E9} \u09AC\u09BE\u0982\u09B2\u09BE" },
  { value: "zh-CN", label: "\u{1F1E8}\u{1F1F3} \u7B80\u4F53\u4E2D\u6587" },
  { value: "ja", label: "\u{1F1EF}\u{1F1F5} \u65E5\u672C\u8A9E" },
  { value: "ko", label: "\u{1F1F0}\u{1F1F7} \uD55C\uAD6D\uC5B4" }
];
const canonicalKeys = new Map(
  Object.keys(en).map((key) => [key.toLowerCase(), key])
);
const allowed = locales.map(({ value }) => value);
const Context = createContext(null);
export function LocaleProvider({ children }) {
  const [locale, updateLocale, readLocale] = usePreference(
    "nexa-locale",
    appConfig.defaultLocale,
    allowed
  );
  const [currencyCode] = usePreference(
    "nexa-currency",
    appConfig.defaultCurrency,
    ["INR", "USD", "EUR", "AED"]
  );
  useEffect(() => {
    document.documentElement.lang = readLocale();
  }, [locale, readLocale]);
  const setLocale = (next) => {
    const direction = next === "ar" ? "rtl" : "ltr";
    setPreference("nexa-direction", direction);
    document.documentElement.lang = next;
    document.documentElement.dir = direction;
    updateLocale(next);
  };
  const t = (key) => dictionaries[locale][key] ?? dictionaries[locale][canonicalKeys.get(key.toLowerCase()) ?? key] ?? dictionaries.en[key] ?? key;
  return createElement(
    Context.Provider,
    {
      value: {
        locale,
        setLocale,
        t,
        currency: (value) => formatCurrency(value, locale, currencyCode),
        number: (value) => formatNumber(value, locale),
        date: (value, time) => formatDate(value, locale, time)
      }
    },
    children
  );
}
export function useI18n() {
  const value = useContext(Context);
  if (!value) throw new Error("LocaleProvider is required");
  return value;
}
