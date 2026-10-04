import { appConfig } from "../config/app.js";
export const intlLocales = {
  en: "en-IN",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  "pt-BR": "pt-BR",
  it: "it-IT",
  ar: "ar-AE",
  hi: "hi-IN",
  bn: "bn-IN",
  "zh-CN": "zh-CN",
  ja: "ja-JP",
  ko: "ko-KR"
};
export function formatNumber(value, locale = "en", options) {
  return new Intl.NumberFormat(intlLocales[locale], options).format(value);
}
export function formatCurrency(value, locale = "en", currency = appConfig.defaultCurrency) {
  return formatNumber(value, locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  });
}
export function formatPercent(value, locale = "en") {
  return formatNumber(value, locale, {
    style: "percent",
    maximumFractionDigits: 1
  });
}
export function formatDate(value, locale = "en", time = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "\u2014";
  return new Intl.DateTimeFormat(intlLocales[locale], {
    dateStyle: "medium",
    ...time ? { timeStyle: "short" } : {},
    timeZone: appConfig.defaultTimeZone
  }).format(date);
}
