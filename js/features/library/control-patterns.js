import { createElement, Fragment } from '../../runtime/dom.js';
import { useState } from "../../runtime/dom.js";
import {
  Bell,
  CalendarDays,
  ChartNoAxesCombined,
  CheckCircle2,
  ClipboardList,
  Cloud,
  Code2,
  CreditCard,
  Download,
  FileText,
  Folder,
  Heart,
  Home,
  Image,
  Info,
  Layers3,
  LayoutDashboard,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Search,
  Settings,
  Shield,
  ShoppingBag,
  Star,
  Truck,
  User,
  Users,
  Wallet,
  X
} from "../../vendor/icons.js";
import { Card, Button, Badge } from "../../components/primitives.js";
import { Toggle } from "../../components/interactions.js";
import { usePersistentState, downloadText } from "../../lib/client-store.js";
import { useI18n } from "../../i18n/provider.js";
const icons = {
  Bell,
  CalendarDays,
  ChartNoAxesCombined,
  CheckCircle2,
  ClipboardList,
  Cloud,
  Code2,
  CreditCard,
  Download,
  FileText,
  Folder,
  Heart,
  Home,
  Image,
  Info,
  Layers3,
  LayoutDashboard,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Search,
  Settings,
  Shield,
  ShoppingBag,
  Star,
  Truck,
  User,
  Users,
  Wallet,
  X
};
export function ControlPatterns({ variant }) {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Layers3");
  const [size, setSize] = useState(24);
  const [selected, setSelected] = usePersistentState(
    "library-selected-tags",
    ["Design"]
  );
  const [updates, setUpdates] = usePersistentState(
    "library-updates-enabled",
    true
  );
  const [priority, setPriority] = useState("Normal");
  const Icon = icons[selectedIcon];
  if (variant === "icons")
    return createElement("div", { className: "grid items-start gap-5 xl:grid-cols-[1fr_280px]" }, createElement(Card, { className: "p-5" }, createElement(
      "input",
      {
        className: "field mb-5",
        "aria-label": t("Search icons"),
        placeholder: t("Search icons"),
        value: search,
        onChange: (event) => setSearch(event.target.value)
      }
    ), createElement("div", { className: "grid grid-cols-3 gap-3 sm:grid-cols-4 xl:grid-cols-5" }, Object.entries(icons).filter(
      ([name]) => name.toLowerCase().includes(search.toLowerCase())
    ).map(([name, Item]) => createElement(
      "button",
      {
        key: name,
        type: "button",
        "aria-pressed": selectedIcon === name,
        onClick: () => setSelectedIcon(name),
        className: `flex min-w-0 flex-col items-center gap-3 rounded border p-3 text-center text-[10px] ${name === selectedIcon ? "border-brand bg-brand/10 text-brand" : "border-ui hover:border-brand"}`
      },
      createElement(Item, { size: 24 }),
      createElement("span", { className: "max-w-full break-all" }, name)
    ))), !Object.keys(icons).some(
      (name) => name.toLowerCase().includes(search.toLowerCase())
    ) && createElement("p", { className: "py-8 text-center text-xs text-muted" }, t("No results"))), createElement(Card, { className: "space-y-5 p-5" }, createElement("div", { className: "grid h-32 place-items-center rounded bg-brand/10 text-brand" }, createElement(Icon, { size })), createElement("h2", { className: "text-sm font-semibold" }, selectedIcon), createElement("label", { className: "block" }, createElement("span", { className: "field-label" }, t("Icon size"), " \xB7 ", size, "px"), createElement(
      "input",
      {
        type: "range",
        "aria-label": t("Icon size"),
        min: 16,
        max: 64,
        value: size,
        onChange: (event) => setSize(Number(event.target.value)),
        className: "w-full"
      }
    )), createElement(
      Button,
      {
        variant: "secondary",
        className: "w-full",
        onClick: () => downloadText(
          selectedIcon + "-example.js",
          `import { createElement } from "/js/runtime/dom.js";
import { ${selectedIcon} } from "/js/vendor/icons.js";

export function IconExample() { return createElement(${selectedIcon}, { size: ${size} }); }
`
        )
      },
      createElement(Download, { size: 14 }),
      t("Download example")
    )));
  if (variant === "selections")
    return createElement(Card, { className: "space-y-6 p-5" }, createElement("label", { className: "block max-w-md" }, createElement("span", { className: "field-label" }, t("Search choices")), createElement(
      "input",
      {
        className: "field",
        value: search,
        onChange: (event) => setSearch(event.target.value),
        "aria-label": t("Search choices")
      }
    )), createElement(
      "div",
      {
        role: "group",
        "aria-label": t("Team interests"),
        className: "flex flex-wrap gap-3"
      },
      [
        "Design",
        "Engineering",
        "Analytics",
        "Marketing",
        "Operations",
        "Support"
      ].filter(
        (item) => t(item).toLowerCase().includes(search.toLowerCase())
      ).map((item) => createElement(
        Button,
        {
          key: item,
          variant: selected.includes(item) ? "primary" : "secondary",
          "aria-pressed": selected.includes(item),
          onClick: () => setSelected(
            (current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]
          )
        },
        t(item),
        selected.includes(item) && createElement(CheckCircle2, { size: 14 })
      ))
    ), createElement("div", { className: "rounded border border-ui p-4" }, createElement("p", { className: "mb-3 text-xs text-muted" }, t("Selected interests"), ": ", selected.length), createElement("div", { className: "flex flex-wrap gap-2" }, selected.map((item) => createElement(Badge, { key: item, tone: "brand" }, t(item), createElement(
      "button",
      {
        className: "ms-2",
        "aria-label": t("Remove") + " " + t(item),
        onClick: () => setSelected(
          (current) => current.filter((value) => value !== item)
        )
      },
      createElement(X, { size: 12 })
    ))))), createElement("div", { className: "flex items-center justify-between gap-3 border-t border-ui pt-4" }, createElement("span", { className: "text-sm" }, t("Enable demo updates")), createElement(
      Toggle,
      {
        label: t("Enable demo updates"),
        checked: updates,
        onChange: setUpdates
      }
    )), createElement("fieldset", null, createElement("legend", { className: "mb-3 text-xs font-medium" }, t("Priority")), createElement("div", { className: "flex flex-wrap gap-2" }, ["Low", "Normal", "High"].map((item) => createElement(
      Button,
      {
        key: item,
        variant: priority === item ? "primary" : "secondary",
        "aria-pressed": priority === item,
        onClick: () => setPriority(item)
      },
      t(item)
    )))));
  return createElement("div", { className: "space-y-5" }, createElement(Card, { className: "p-5" }, createElement("h2", { className: "mb-4 text-sm font-semibold" }, t("Live semantic colors")), createElement("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4" }, [
    "brand",
    "info",
    "success",
    "warning",
    "danger",
    "panel",
    "panel-2",
    "text"
  ].map((token) => createElement(
    "div",
    {
      key: token,
      className: "overflow-hidden rounded border border-ui"
    },
    createElement("div", { className: "h-16", style: { background: `var(--${token})` } }),
    createElement("code", { className: "block p-3 text-[11px]" }, "--", token)
  ))), createElement("div", { className: "mt-5 grid grid-cols-6 gap-2" }, Array.from({ length: 6 }, (_, index) => createElement(
    "div",
    {
      key: index,
      className: "h-12 rounded",
      style: { background: `var(--chart-${index + 1})` }
    }
  )))), createElement(Card, { className: "space-y-4 p-5" }, createElement("h2", { className: "text-3xl font-semibold" }, t("Typography preview")), createElement("h3", { className: "text-xl font-semibold" }, t("A clear visual hierarchy")), createElement("p", { className: "text-sm leading-7" }, t(
    "Change fonts and text size in the customizer to preview your design system."
  )), createElement("p", { className: "text-xs text-muted" }, t("Muted text stays readable on the AMOLED black background."))));
}
