import { createElement, Fragment } from '../../runtime/dom.js';
import { useState } from "../../runtime/dom.js";
import { Link as Link } from "../../runtime/navigation.js";
import { Info, Keyboard, ShieldCheck } from "../../vendor/icons.js";
import { Accordion, Tabs, TooltipHint } from "../../components/ui/patterns.js";
import { Card, Button } from "../../components/primitives.js";
import { useI18n } from "../../i18n/provider.js";
export function NavigationPatterns({ variant }) {
  const { t } = useI18n();
  const [help, setHelp] = useState(true);
  return createElement(Card, { className: "p-5 sm:p-6" }, variant === "tabs" && createElement(
    Tabs,
    {
      label: t("Example tabs"),
      items: [
        {
          id: "overview",
          label: t("Overview"),
          content: createElement("div", null, createElement("h2", { className: "font-semibold" }, t("Workspace overview")), createElement("p", { className: "mt-2 text-muted" }, t("Use arrow keys, Home and End to move between tabs.")))
        },
        {
          id: "activity",
          label: t("Activity"),
          content: createElement("p", null, t("Three demo updates are ready for review."))
        },
        {
          id: "settings",
          label: t("Settings"),
          content: createElement(Link, { className: "text-brand", href: "/settings/appearance" }, t("Open appearance settings"))
        }
      ]
    }
  ), variant === "accordion" && createElement(
    Accordion,
    {
      items: [
        {
          title: t("Can I reuse these components?"),
          content: t(
            "Yes. Replace the synthetic content with your own application data."
          )
        },
        {
          title: t("Do these patterns support dark mode?"),
          content: t(
            "All examples use the shared theme tokens and support RTL layouts."
          )
        },
        {
          title: t("Where are my preferences stored?"),
          content: t(
            "Theme preferences are saved locally in this browser."
          )
        }
      ]
    }
  ), variant === "tooltips" && createElement("div", { className: "space-y-8 pt-8" }, createElement("div", { className: "flex flex-wrap gap-4" }, createElement(
    TooltipHint,
    {
      text: t("Focus or hover to see help. Press Escape to dismiss.")
    },
    createElement(Info, { size: 16 }),
    t("Contextual help")
  ), createElement(
    TooltipHint,
    {
      text: t("Use Ctrl or Command + K to search the workspace.")
    },
    createElement(Keyboard, { size: 16 }),
    t("Keyboard shortcut")
  ), createElement(TooltipHint, { text: t("This example uses synthetic data only.") }, createElement(ShieldCheck, { size: 16 }), t("Demo notice"))), help ? createElement("div", { className: "rounded border border-ui bg-info/10 p-4 text-sm" }, createElement("p", { className: "mb-3" }, t("Inline help stays visible until you dismiss it.")), createElement(Button, { variant: "secondary", onClick: () => setHelp(false) }, t("Dismiss help"))) : createElement(Button, { variant: "secondary", onClick: () => setHelp(true) }, t("Show help"))));
}
