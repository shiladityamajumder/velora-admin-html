import { createElement, Fragment } from '../runtime/dom.js';
import { useI18n } from "../i18n/provider.js";
import { Link as Link } from "../runtime/navigation.js";
export default function NotFound() {
  const { t } = useI18n();
  return createElement("main", { className: "grid min-h-screen place-items-center p-6" }, createElement("div", { className: "text-center" }, createElement("p", { className: "text-7xl font-black text-brand" }, "404"), createElement("h1", { className: "mt-4 text-2xl font-bold" }, t("Page not found")), createElement("p", { className: "mt-2 text-sm text-muted" }, t("The route doesn\u2019t exist in this workspace.")), createElement(
    Link,
    {
      className: "mt-6 inline-block rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white",
      href: "/template"
    },
    t("Template overview")
  )));
}
