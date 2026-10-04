import { createElement, Fragment } from '../../runtime/dom.js';
import {
  appearanceDefaults,
  appearanceOptions,
  themePresets
} from "../../config/appearance.js";
import { accents, darkAccents, fonts } from "../../config/app.js";
import { useUI } from "../ui-provider.js";
import { useI18n } from "../../i18n/provider.js";
import { Modal } from "../interactions.js";
import { Button } from "../primitives.js";
export function AppearanceControls() {
  const ui = useUI();
  const { t } = useI18n();
  return createElement("div", { className: "space-y-5" }, createElement("fieldset", null, createElement("legend", { className: "mb-2 text-xs font-semibold" }, t("Theme presets")), createElement("div", { className: "grid grid-cols-2 gap-2" }, themePresets.map((preset) => createElement(
    "button",
    {
      type: "button",
      key: preset.title,
      "aria-pressed": ui.theme === preset.theme && ui.accent === preset.accent && ui.appearance.chartPalette === preset.chartPalette && ui.appearance.surface === preset.surface,
      onClick: () => {
        ui.setTheme(preset.theme);
        ui.setAccent(preset.accent);
        ui.setAppearance("chartPalette", preset.chartPalette);
        ui.setAppearance("surface", preset.surface);
        ui.setAppearance("navigationColor", "colorful");
      },
      className: "rounded border border-ui p-3 text-start text-xs hover:border-brand"
    },
    createElement(
      "span",
      {
        className: "mb-2 flex h-8 gap-1 rounded p-2",
        style: {
          background: preset.theme === "dark" ? "#000" : "#f3f4f6"
        }
      },
      [preset.accent, "blue", "rose", "violet"].map(
        (color, index) => createElement(
          "span",
          {
            key: index,
            className: "flex-1 rounded",
            style: {
              background: (preset.theme === "dark" ? darkAccents : accents)[color]
            }
          }
        )
      )
    ),
    t(preset.title)
  )))), createElement("p", { className: "text-xs leading-5 text-muted" }, t("Dark mode uses an AMOLED black canvas with colorful navigation.")), createElement(
    Choice,
    {
      label: "Theme",
      value: ui.theme,
      values: ["light", "dark", "system"],
      change: ui.setTheme
    }
  ), createElement("div", null, createElement("h3", { className: "mb-2 text-xs font-semibold" }, t("Color scheme")), createElement("div", { className: "grid grid-cols-4 gap-2" }, Object.entries(accents).map(([key, color]) => createElement(
    "button",
    {
      key,
      "aria-pressed": ui.accent === key,
      onClick: () => ui.setAccent(key),
      className: `flex flex-col items-center gap-1 rounded border p-2 text-[10px] capitalize ${ui.accent === key ? "border-brand" : "border-ui"}`
    },
    createElement(
      "span",
      {
        className: "size-5 rounded-full",
        style: {
          background: ui.resolvedTheme === "dark" ? darkAccents[key] : color
        }
      }
    ),
    t(key[0].toUpperCase() + key.slice(1))
  )))), createElement(
    Choice,
    {
      label: "Font",
      value: ui.font,
      values: Object.keys(fonts),
      change: ui.setFont
    }
  ), createElement(
    Choice,
    {
      label: "Density",
      value: ui.density,
      values: ["comfortable", "compact", "dense"],
      change: ui.setDensity
    }
  ), createElement(
    Choice,
    {
      label: "Border radius",
      value: ui.radius,
      values: ["square", "small", "medium", "large"],
      change: ui.setRadius
    }
  ), createElement(
    Choice,
    {
      label: "Content width",
      value: ui.width,
      values: ["fluid", "boxed"],
      change: ui.setWidth
    }
  ), createElement(
    Choice,
    {
      label: "Navigation",
      value: ui.sidebarVariant,
      values: [
        "default",
        "dark",
        "compact",
        "mini",
        "hover",
        "hidden",
        "offcanvas"
      ],
      change: ui.setSidebarVariant
    }
  ), createElement(
    Choice,
    {
      label: "Header",
      value: ui.header,
      values: ["fixed", "static"],
      change: ui.setHeader
    }
  ), createElement(
    Choice,
    {
      label: "Direction",
      value: ui.direction,
      values: ["ltr", "rtl"],
      change: ui.setDirection
    }
  ), Object.entries(appearanceOptions).map(([key, values]) => {
    const labels = {
      surface: "Card style",
      navigationColor: "Navigation colors",
      chartPalette: "Chart palette",
      motion: "Motion",
      textSize: "Text size",
      sidebarSize: "Sidebar width",
      headerTone: "Header color"
    };
    const option = key;
    return createElement(
      Choice,
      {
        key,
        label: labels[option],
        value: ui.appearance[option],
        values,
        change: (value) => ui.setAppearance(option, value)
      }
    );
  }), createElement("div", { className: "surface space-y-3 p-4" }, createElement("p", { className: "text-xs font-semibold" }, t("Live preview")), createElement("div", { className: "flex gap-2" }, Array.from({ length: 6 }, (_, index) => createElement(
    "span",
    {
      key: index,
      className: "h-6 flex-1 rounded",
      style: { background: `var(--chart-${index + 1})` }
    }
  ))), createElement("p", { className: "text-xs text-muted" }, t(
    "Your preferences apply across the workspace and are saved automatically."
  ))), createElement(
    Button,
    {
      variant: "secondary",
      className: "w-full",
      onClick: () => {
        for (const key of Object.keys(
          appearanceDefaults
        ))
          ui.setAppearance(key, appearanceDefaults[key]);
        ui.setTheme("system");
        ui.setAccent("teal");
        ui.setFont("work");
        ui.setDensity("comfortable");
        ui.setRadius("medium");
        ui.setWidth("fluid");
        ui.setHeader("fixed");
        ui.setSidebarVariant("default");
        ui.setDirection("ltr");
      }
    },
    t("Reset customization")
  ));
}
function Choice({
  label,
  value,
  values,
  change
}) {
  const { t } = useI18n();
  return createElement("fieldset", null, createElement("legend", { className: "mb-2 text-xs font-semibold" }, t(label)), createElement("div", { className: "flex flex-wrap gap-2" }, values.map((item) => createElement(
    "button",
    {
      key: item,
      type: "button",
      "aria-pressed": value === item,
      onClick: () => change(item),
      className: `rounded border px-3 py-2 text-xs capitalize ${value === item ? "border-brand bg-brand/10 text-brand" : "border-ui"}`
    },
    t(
      {
        hover: "Hover-expand",
        offcanvas: "Off-canvas",
        work: "Work Sans",
        humanist: "Humanist",
        classic: "Classic",
        mono: "Monospace"
      }[item] ?? item[0].toUpperCase() + item.slice(1)
    )
  ))));
}
export function Customizer() {
  const ui = useUI();
  const { t } = useI18n();
  return createElement(
    Modal,
    {
      title: t("Theme customizer"),
      drawer: true,
      onClose: () => ui.setCustomizerOpen(false)
    },
    createElement(AppearanceControls, null)
  );
}
