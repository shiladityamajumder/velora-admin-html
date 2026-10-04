import { createElement, Fragment } from '../runtime/dom.js';
import { Link as Link } from "../runtime/navigation.js";
import { Layers3, Moon, Sun, ShieldCheck } from "../vendor/icons.js";
import { useUI } from "./ui-provider.js";
import { useI18n, locales } from "../i18n/provider.js";
import { appConfig } from "../config/app.js";
import { authDesigns, authSlug, getAuthScreen } from "../config/auth.js";
import { AuthVisual } from "./auth/auth-visual.js";
import { AuthForm } from "./auth/auth-form.js";
export function AuthScreen({ slug }) {
  const screen = getAuthScreen(slug);
  const { design, flow } = screen;
  const split = design.id === "split", cover = design.id === "cover";
  const ui = useUI();
  const { t, locale, setLocale } = useI18n();
  return createElement(
    "main",
    {
      className: `relative min-h-screen ${cover ? "bg-[var(--panel-2)]" : ""}`
    },
    cover && createElement(
      "div",
      {
        "aria-hidden": "true",
        className: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,color-mix(in_srgb,var(--brand)_18%,transparent),transparent_65%),radial-gradient(ellipse_at_bottom_right,color-mix(in_srgb,var(--brand)_18%,transparent),transparent_65%)]"
      }
    ),
    createElement("header", { className: "relative z-10 flex min-h-20 flex-wrap items-center justify-between gap-3 border-b border-ui bg-[var(--panel)]/95 px-4 py-3 sm:px-6" }, createElement(
      "select",
      {
        "aria-label": t("Language"),
        value: locale,
        onChange: (event) => setLocale(event.target.value),
        className: "field !w-auto max-w-[180px] text-xs"
      },
      locales.map((item) => createElement("option", { key: item.value, value: item.value }, item.label))
    ), createElement(
      Link,
      {
        href: "/library/authentication/gallery",
        className: "rounded border border-ui px-3 py-2 text-xs text-brand"
      },
      t("UI Library")
    ), createElement(
      "button",
      {
        "aria-label": t(
          ui.resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"
        ),
        onClick: ui.toggleTheme,
        className: "rounded-md border border-ui p-2"
      },
      ui.resolvedTheme === "dark" ? createElement(Sun, { size: 18 }) : createElement(Moon, { size: 18 })
    )),
    createElement(
      "div",
      {
        className: `relative min-h-[calc(100svh-5rem)] ${split ? "grid lg:grid-cols-2" : "grid place-items-center p-4 py-8 sm:py-12"}`
      },
      split && createElement(AuthVisual, null),
      createElement(
        "section",
        {
          className: split ? "grid place-items-center px-4 py-8 sm:p-10" : "w-full max-w-md"
        },
        createElement("div", { className: "w-full max-w-md" }, createElement(
          Link,
          {
            href: "/dashboard/analytics",
            className: "mb-6 flex items-center justify-center gap-3"
          },
          createElement("span", { className: "grid size-10 place-items-center rounded-lg bg-brand/10 text-brand" }, createElement(Layers3, { size: 24 })),
          createElement("div", null, createElement("p", { className: "font-semibold tracking-wide" }, appConfig.name.toUpperCase()), createElement("p", { className: "mt-1 text-[10px] text-muted" }, t("Admin workspace")))
        ), createElement(
          "nav",
          {
            "aria-label": t("Auth design"),
            className: "mb-4 flex justify-center gap-2"
          },
          authDesigns.map((item) => createElement(
            Link,
            {
              key: item.id,
              href: `/auth/${authSlug(flow.mode, item.id)}`,
              "aria-current": item.id === design.id ? "page" : void 0,
              className: `rounded-full border px-3 py-1.5 text-xs ${item.id === design.id ? "border-brand bg-brand/10 text-brand" : "border-ui bg-[var(--panel)] text-muted"}`
            },
            t(item.title)
          ))
        ), createElement(
          "div",
          {
            className: `surface overflow-hidden ${cover ? "rounded-2xl shadow-xl" : "rounded-lg"}`
          },
          cover && createElement("div", { className: "flex items-center gap-2 border-b border-ui bg-brand/10 px-6 py-3 text-xs font-medium text-brand" }, createElement(ShieldCheck, { size: 16 }), t("Secure account access")),
          createElement("div", { className: "p-6 sm:p-8" }, createElement(AuthForm, { key: slug, mode: flow.mode, design: design.id }))
        ), createElement("p", { className: "mt-5 text-center text-[11px] leading-5 text-muted" }, t(
          "This is a local demo. No email or real account change is performed."
        )))
      )
    )
  );
}
