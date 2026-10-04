import { createElement, Fragment } from '../../runtime/dom.js';
import { Link as Link } from "../../runtime/navigation.js";
import { ArrowUpRight, ChevronRight } from "../../vendor/icons.js";
import { Badge, Card, PageHeader } from "../primitives.js";
import { appConfig } from "../../config/app.js";
export function StatusBadge({ status }) {
  return createElement(
    Badge,
    {
      tone: ["Paid", "Completed", "On Track", "Active", "Ready"].includes(status) ? "success" : [
        "Pending",
        "At Risk",
        "Negotiation",
        "Low stock",
        "Preparing"
      ].includes(status) ? "warning" : [
        "Failed",
        "Blocked",
        "Refunded",
        "Out of stock",
        "Overdue"
      ].includes(status) ? "danger" : "brand"
    },
    status
  );
}
export function DashboardTitle({ title }) {
  return createElement(
    PageHeader,
    {
      title,
      actions: createElement(
        "nav",
        {
          "aria-label": "Breadcrumb",
          className: "flex items-center gap-2 text-xs text-muted"
        },
        createElement(Link, { href: "/dashboard/analytics" }, appConfig.name),
        createElement(ChevronRight, { size: 12 }),
        createElement("span", null, "Dashboard"),
        createElement(ChevronRight, { size: 12 }),
        createElement("span", null, title)
      )
    }
  );
}
export function Tabs({
  options,
  value,
  onChange
}) {
  return createElement("div", { className: "inline-flex rounded-md bg-[var(--panel-2)] p-1" }, options.map((option) => createElement(
    "button",
    {
      key: option,
      "aria-pressed": value === option,
      onClick: () => onChange(option),
      className: `rounded px-3 py-1 text-[11px] transition ${value === option ? "bg-[var(--panel)] text-[var(--text)] shadow-sm" : "text-muted hover:text-brand"}`
    },
    option
  )));
}
export function TelemetryCard({
  label,
  value,
  badge,
  caption,
  hint,
  color,
  children
}) {
  return createElement(Card, { className: "flex min-h-[175px] flex-col justify-between p-6" }, createElement("div", { className: "flex items-start justify-between gap-3" }, createElement("div", null, createElement("p", { className: "text-xs text-muted" }, label), createElement("p", { className: "mt-1 text-2xl font-semibold" }, value)), createElement(
    "span",
    {
      className: "rounded-full px-2 py-1 text-[10px] font-medium",
      style: { color, background: `${color}15` }
    },
    badge
  )), createElement("div", { className: "mt-3 flex items-end gap-3" }, createElement("div", { className: "flex-1" }, createElement("p", { className: "flex items-center gap-1 text-sm", style: { color } }, caption, createElement(ArrowUpRight, { size: 12 })), createElement("p", { className: "mt-1 text-xs text-muted" }, hint)), children));
}
