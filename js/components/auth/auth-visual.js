import { createElement, Fragment } from '../../runtime/dom.js';
import { Layers3, ShieldCheck } from "../../vendor/icons.js";
import { appConfig } from "../../config/app.js";
import { useI18n } from "../../i18n/provider.js";
export function AuthVisual() {
  const { t } = useI18n();
  return createElement("section", { className: "relative hidden flex-col overflow-hidden bg-[#0d3430] p-12 text-white lg:flex" }, createElement("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(11,177,151,.32),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(74,163,255,.16),transparent_45%)]" }), createElement("div", { className: "relative flex items-center gap-3" }, createElement(Layers3, { size: 26 }), createElement("span", { className: "font-semibold tracking-wide" }, appConfig.name.toUpperCase())), createElement("div", { className: "relative my-auto max-w-lg" }, createElement("div", { className: "mb-7 grid size-14 place-items-center rounded-xl border border-white/15 bg-white/5" }, createElement(ShieldCheck, { size: 26 })), createElement("h2", { className: "text-4xl font-semibold leading-tight" }, t("One workspace. Every operational view.")), createElement("p", { className: "mt-5 text-sm leading-7 text-white/60" }, t(
    "Bring your analytics, projects, customers and operations together."
  )), createElement("div", { className: "mt-10 grid grid-cols-3 gap-4" }, ["14 dashboards", "11 applications", "Your workspace"].map(
    (text) => createElement(
      "div",
      {
        key: text,
        className: "rounded-lg border border-white/10 bg-white/5 p-4 text-xs text-white/70"
      },
      t(text)
    )
  ))), createElement("p", { className: "relative text-xs text-white/35" }, "\xA9 2026 ", appConfig.name, " Admin"));
}
