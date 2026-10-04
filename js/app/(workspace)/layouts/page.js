import { createElement, Fragment } from '../../../runtime/dom.js';
import { Check, PanelTop, PanelsTopLeft } from "../../../vendor/icons.js";
import { PageHeader, Card, Button, Badge } from "../../../components/primitives.js";
import { useUI } from "../../../components/ui-provider.js";
const layouts = [
  {
    value: "default",
    title: "Default Sidenav",
    description: "Traditional full-width sidebar for large admin workspaces."
  },
  {
    value: "dark",
    title: "Dark Sidenav",
    description: "High-contrast navigation paired with light or dark content."
  },
  {
    value: "compact",
    title: "Compact Sidenav",
    description: "Icon-forward navigation that maximizes content width."
  },
  {
    value: "hover",
    title: "Hover Sidenav",
    description: "Compact at rest, expanding to reveal labels on hover."
  },
  {
    value: "hidden",
    title: "Hidden Sidenav",
    description: "Content-first layout with the menu available from the header."
  },
  {
    value: "offcanvas",
    title: "Off-canvas Sidenav",
    description: "Drawer-based navigation suitable for focused workspaces."
  }
];
export default function LayoutsPage() {
  const ui = useUI();
  return createElement(Fragment, null, createElement(
    PageHeader,
    {
      title: "Admin Layouts",
      description: "Switch the global navigation model at runtime. The selected layout persists across every dashboard and application.",
      actions: createElement(
        Button,
        {
          variant: "secondary",
          onClick: () => ui.setDirection(ui.direction === "ltr" ? "rtl" : "ltr")
        },
        "Toggle ",
        ui.direction === "ltr" ? "RTL" : "LTR"
      )
    }
  ), createElement("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3" }, layouts.map((layout) => {
    const active = ui.sidebarVariant === layout.value;
    return createElement(
      Card,
      {
        key: layout.value,
        className: `overflow-hidden ${active ? "ring-2 ring-brand" : ""}`
      },
      createElement("div", { className: "relative h-44 bg-[var(--panel-2)] p-4" }, createElement("div", { className: "flex h-full overflow-hidden rounded-xl border border-ui bg-[var(--panel)]" }, layout.value !== "hidden" && layout.value !== "offcanvas" ? createElement(
        "div",
        {
          className: `${layout.value === "compact" || layout.value === "hover" ? "w-10" : "w-20"} ${layout.value === "dark" ? "bg-slate-900" : "bg-brand/10"} border-e border-ui p-2`
        },
        createElement("div", { className: "mb-3 h-3 rounded bg-brand/40" }),
        createElement("div", { className: "space-y-2" }, Array.from({ length: 6 }, (_, i) => createElement(
          "div",
          {
            key: i,
            className: "h-2 rounded bg-slate-400/25"
          }
        )))
      ) : null, createElement("div", { className: "flex-1" }, createElement("div", { className: "h-8 border-b border-ui bg-[var(--panel)]" }), createElement("div", { className: "grid grid-cols-2 gap-2 p-3" }, createElement("div", { className: "h-12 rounded-lg bg-brand/10" }), createElement("div", { className: "h-12 rounded-lg bg-emerald-500/10" }), createElement("div", { className: "col-span-2 h-16 rounded-lg bg-slate-500/10" })))), active ? createElement("span", { className: "absolute end-3 top-3 grid size-7 place-items-center rounded-full bg-brand text-white" }, createElement(Check, { size: 15 })) : null),
      createElement("div", { className: "p-5" }, createElement("div", { className: "flex items-center gap-2" }, createElement(PanelsTopLeft, { size: 18, className: "text-brand" }), createElement("h2", { className: "font-semibold" }, layout.title), active ? createElement(Badge, { tone: "success" }, "Active") : null), createElement("p", { className: "mt-2 text-sm text-muted" }, layout.description), createElement(
        Button,
        {
          className: "mt-5 w-full",
          variant: active ? "secondary" : "primary",
          onClick: () => ui.setSidebarVariant(layout.value)
        },
        active ? "Currently Applied" : "Apply Layout"
      ))
    );
  })), createElement(Card, { className: "mt-4 p-5" }, createElement("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center" }, createElement("div", { className: "grid size-12 place-items-center rounded-xl bg-brand/10 text-brand" }, createElement(PanelTop, { size: 22 })), createElement("div", null, createElement("h3", { className: "font-semibold" }, "Right-to-left support"), createElement("p", { className: "mt-1 text-sm text-muted" }, "Direction is applied at the document root, so tables, sidebars, drawers, and spacing flip consistently.")), createElement(
    Button,
    {
      className: "sm:ms-auto",
      variant: "secondary",
      onClick: () => ui.setDirection(ui.direction === "ltr" ? "rtl" : "ltr")
    },
    ui.direction.toUpperCase(),
    " \u2192",
    " ",
    ui.direction === "ltr" ? "RTL" : "LTR"
  ))));
}
