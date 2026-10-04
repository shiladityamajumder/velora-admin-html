import { createElement, Fragment } from '../../runtime/dom.js';
import { Link as Link } from "../../runtime/navigation.js";
import { useState } from "../../runtime/dom.js";
import { authFlows, authDesigns, getAuthScreen } from "../../config/auth.js";
import { ArrowUpRight, ShieldCheck } from "../../vendor/icons.js";
import { Card } from "../../components/primitives.js";
import { libraryCategories, exampleHref } from "../../config/library.js";
import { useI18n } from "../../i18n/provider.js";
import { appConfig } from "../../config/app.js";
import { ExampleFrame } from "./example-frame.js";
export function AuthGallery() {
  const { t } = useI18n();
  const [design, setDesign] = useState("");
  const [flow, setFlow] = useState("");
  const examples = libraryCategories.find((category) => category.slug === "authentication").examples.filter((example) => {
    const screen = getAuthScreen(example.slug);
    return example.href && screen && (!design || screen.design.id === design) && (!flow || screen.flow.mode === flow);
  });
  return createElement(
    ExampleFrame,
    {
      category: "authentication",
      variant: "gallery",
      source: 'import { AuthScreen } from "../../components/auth-screen.js";\n\n<AuthScreen slug="login" />\n<AuthScreen slug="split-login" />\n// AuthService in services/auth.ts connects these forms to your provider.'
    },
    createElement("div", { className: "mb-5 flex flex-wrap items-end gap-4 rounded border border-ui bg-[var(--panel)] p-4" }, createElement("label", { className: "min-w-40 flex-1 text-xs" }, createElement("span", { className: "field-label" }, t("Auth design")), createElement(
      "select",
      {
        className: "field",
        "aria-label": t("Auth design"),
        value: design,
        onChange: (event) => setDesign(event.target.value)
      },
      createElement("option", { value: "" }, t("All designs")),
      authDesigns.map((item) => createElement("option", { key: item.id, value: item.id }, t(item.title)))
    )), createElement("label", { className: "min-w-40 flex-1 text-xs" }, createElement("span", { className: "field-label" }, t("Account flow")), createElement(
      "select",
      {
        className: "field",
        "aria-label": t("Account flow"),
        value: flow,
        onChange: (event) => setFlow(event.target.value)
      },
      createElement("option", { value: "" }, t("All flows")),
      authFlows.map((item) => createElement("option", { key: item.mode, value: item.mode }, t(item.title)))
    )), createElement("p", { role: "status", className: "pb-2 text-xs text-muted" }, examples.length, " ", t("screen previews"))),
    createElement("div", { className: "grid gap-5 sm:grid-cols-2 xl:grid-cols-3" }, examples.map((example) => createElement(Card, { key: example.slug, className: "overflow-hidden" }, createElement(
      "div",
      {
        "aria-hidden": "true",
        className: `m-4 flex h-36 items-center justify-center overflow-hidden rounded border border-ui bg-[var(--panel-2)] ${example.slug.startsWith("cover-") ? "bg-brand/15 bg-[radial-gradient(ellipse_at_top_left,color-mix(in_srgb,var(--brand)_18%,transparent),transparent_80%)]" : ""} ${example.slug.startsWith("split") ? "justify-between" : ""}`
      },
      example.slug.startsWith("split") && createElement("div", { className: "flex h-full w-1/2 flex-col items-center justify-center gap-2 bg-brand/15 text-brand" }, createElement(ShieldCheck, { size: 26 }), createElement("span", { className: "text-xs font-semibold" }, appConfig.name)),
      createElement(
        "div",
        {
          className: `m-4 w-28 border border-ui bg-[var(--panel)] p-3 ${example.slug.startsWith("cover-") ? "rounded-xl shadow-lg" : "rounded"}`
        },
        createElement("div", { className: "mb-3 h-1.5 w-16 rounded bg-[var(--muted)]/40" }),
        createElement("div", { className: "mb-2 h-4 rounded border border-ui" }),
        createElement("div", { className: "mb-3 h-4 rounded border border-ui" }),
        createElement("div", { className: "h-4 rounded bg-brand/70" })
      )
    ), createElement("div", { className: "p-5 pt-1" }, createElement("h2", { className: "text-sm font-semibold" }, t(example.title)), createElement("p", { className: "mb-4 mt-2 text-xs leading-5 text-muted" }, t(example.description)), createElement(
      Link,
      {
        href: exampleHref("authentication", example),
        className: "inline-flex items-center gap-2 rounded border border-ui px-3 py-2 text-xs text-brand hover:border-brand"
      },
      t("Open preview"),
      createElement(ArrowUpRight, { size: 13 }),
      createElement("span", { className: "sr-only" }, t(example.title))
    )))))
  );
}
