import { createElement, Fragment } from '../../../runtime/dom.js';
import { useState } from "../../../runtime/dom.js";
import { AlertCircle, Bell, Check, Info, Search, Trash2 } from "../../../vendor/icons.js";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  PageHeader,
  Progress
} from "../../../components/primitives.js";
import { FormField, Modal, Toggle } from "../../../components/interactions.js";
import { useUI } from "../../../components/ui-provider.js";
export default function ComponentsPage() {
  const [modal, setModal] = useState(null);
  const [tab, setTab] = useState("Preview");
  const [search, setSearch] = useState("");
  const [environment, setEnvironment] = useState("Production");
  const [enabled, setEnabled] = useState(true);
  const { notify } = useUI();
  return createElement(Fragment, null, createElement(
    PageHeader,
    {
      title: "UI Components",
      description: "Interactive examples of the shared interface components."
    }
  ), createElement("div", { className: "grid gap-6 xl:grid-cols-2" }, createElement(Card, null, createElement(
    CardHeader,
    {
      title: "Buttons & Badges",
      subtitle: "Action hierarchy and status indicators"
    }
  ), createElement("div", { className: "flex flex-wrap gap-3 p-5" }, createElement(Button, { onClick: () => notify("Primary action selected.") }, "Primary"), createElement(
    Button,
    {
      variant: "secondary",
      onClick: () => notify("Secondary action selected.", "info")
    },
    "Secondary"
  ), createElement(
    Button,
    {
      variant: "ghost",
      onClick: () => notify("Ghost action selected.", "info")
    },
    "Ghost"
  ), createElement(Button, { variant: "danger", onClick: () => setModal("delete") }, createElement(Trash2, { size: 14 }), "Delete"), createElement(Badge, { tone: "success" }, "Success"), createElement(Badge, { tone: "warning" }, "Warning"), createElement(Badge, { tone: "danger" }, "Danger"), createElement(Badge, { tone: "brand" }, "Brand"))), createElement(Card, null, createElement(CardHeader, { title: "Alerts", subtitle: "Inline contextual feedback" }), createElement("div", { className: "space-y-3 p-5" }, createElement(
    Alert,
    {
      tone: "info",
      title: "Heads up",
      text: "Your workspace settings were synchronized."
    }
  ), createElement(
    Alert,
    {
      tone: "success",
      title: "Saved successfully",
      text: "Your latest changes are available."
    }
  ), createElement(
    Alert,
    {
      tone: "warning",
      title: "Usage limit",
      text: "You have used 82% of your monthly quota."
    }
  ))), createElement(Card, null, createElement(
    CardHeader,
    {
      title: "Form Inputs",
      subtitle: "Text fields and selection controls"
    }
  ), createElement("div", { className: "grid gap-4 p-5 sm:grid-cols-2" }, createElement(FormField, { label: "Search" }, createElement("div", { className: "relative" }, createElement(
    Search,
    {
      size: 16,
      className: "absolute start-3 top-3 text-muted"
    }
  ), createElement(
    "input",
    {
      className: "field ps-9",
      placeholder: "Search...",
      value: search,
      onChange: (event) => setSearch(event.target.value)
    }
  ))), createElement(FormField, { label: "Environment" }, createElement(
    "select",
    {
      className: "field",
      value: environment,
      onChange: (event) => setEnvironment(event.target.value)
    },
    createElement("option", null, "Production"),
    createElement("option", null, "Staging"),
    createElement("option", null, "Development")
  )), createElement("p", { className: "text-xs text-muted sm:col-span-2" }, search ? `Search: ${search} \xB7 ` : "", "Selected environment:", " ", environment))), createElement(Card, null, createElement(
    CardHeader,
    {
      title: "Progress & Loading",
      subtitle: "System state visualization"
    }
  ), createElement("div", { className: "space-y-5 p-5" }, [
    ["Storage", 68],
    ["Monthly usage", 82],
    ["Project progress", 44]
  ].map(([label, value]) => createElement("div", { key: String(label) }, createElement("div", { className: "mb-2 flex justify-between text-xs" }, createElement("span", null, label), createElement("span", null, value, "%")), createElement(Progress, { value: Number(value) }))), createElement("div", { className: "flex items-center gap-3" }, createElement("div", { className: "size-5 animate-spin rounded-full border-2 border-brand border-t-transparent" }), createElement("span", { className: "text-xs text-muted" }, "Loading indicator")))), createElement(Card, null, createElement(CardHeader, { title: "Tabs", subtitle: "Segmented content navigation" }), createElement("div", { className: "p-5" }, createElement(
    "div",
    {
      role: "tablist",
      className: "inline-flex rounded-md bg-[var(--panel-2)] p-1"
    },
    ["Preview", "Analytics", "Settings"].map((value) => createElement(
      "button",
      {
        key: value,
        role: "tab",
        "aria-selected": tab === value,
        onClick: () => setTab(value),
        className: `rounded px-4 py-2 text-xs ${tab === value ? "bg-[var(--panel)] shadow-sm" : "text-muted"}`
      },
      value
    ))
  ), createElement(
    "div",
    {
      role: "tabpanel",
      className: "mt-4 rounded-md border border-ui p-5"
    },
    createElement("p", { className: "font-medium" }, tab),
    tab === "Settings" ? createElement("div", { className: "mt-3 flex items-center justify-between text-xs" }, createElement("span", null, "Email notifications"), createElement(
      Toggle,
      {
        label: "Example email notifications",
        checked: enabled,
        onChange: setEnabled
      }
    )) : createElement("p", { className: "mt-2 text-xs text-muted" }, tab === "Analytics" ? "3,240 active sessions \xB7 68% cache hit rate" : "Choose another tab to change this panel.")
  ))), createElement(Card, null, createElement(
    CardHeader,
    {
      title: "Modal & Toast",
      subtitle: "Dialogs and feedback messages"
    }
  ), createElement("div", { className: "flex flex-wrap gap-3 p-5" }, createElement(Button, { onClick: () => setModal("example") }, "Open modal"), createElement(
    Button,
    {
      variant: "secondary",
      onClick: () => notify("Your changes were saved successfully.")
    },
    createElement(Bell, { size: 14 }),
    "Show toast"
  )))), modal ? createElement(
    Modal,
    {
      title: modal === "delete" ? "Confirm deletion" : "Confirm action",
      onClose: () => setModal(null)
    },
    createElement("p", { className: "text-sm text-muted" }, modal === "delete" ? "This is a delete confirmation example. Confirm to see its feedback message." : "Press Confirm, Cancel, or Escape to close this dialog."),
    createElement("div", { className: "mt-5 flex justify-end gap-2" }, createElement(Button, { variant: "secondary", onClick: () => setModal(null) }, "Cancel"), createElement(
      Button,
      {
        variant: modal === "delete" ? "danger" : "primary",
        onClick: () => {
          setModal(null);
          notify(
            modal === "delete" ? "Delete action confirmed." : "Action confirmed."
          );
        }
      },
      modal === "delete" ? "Delete" : "Confirm"
    ))
  ) : null);
}
function Alert({
  tone,
  title,
  text
}) {
  const Icon = tone === "info" ? Info : tone === "success" ? Check : AlertCircle;
  const color = tone === "info" ? "bg-info/10 text-info" : tone === "success" ? "bg-success/10 text-success" : "bg-warning/10 text-warning";
  return createElement("div", { className: `flex gap-3 rounded-md p-4 ${color}` }, createElement(Icon, { size: 17, className: "shrink-0" }), createElement("div", null, createElement("p", { className: "text-xs font-semibold" }, title), createElement("p", { className: "mt-1 text-[11px] opacity-85" }, text)));
}
