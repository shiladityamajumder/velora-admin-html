import { createElement, Fragment } from '../runtime/dom.js';
import { useI18n } from "../i18n/provider.js";
import { Children } from "../runtime/dom.js";
import clsx from "../vendor/classes.js";
import { ArrowDownRight, ArrowUpRight } from "../vendor/icons.js";
export function Card({
  children,
  className = ""
}) {
  return createElement("section", { className: clsx("surface min-w-0 rounded-md", className) }, children);
}
export function CardHeader({
  title,
  subtitle,
  action
}) {
  const { t } = useI18n();
  return createElement("div", { className: "flex flex-wrap items-center justify-between gap-3 border-b border-ui px-5 py-4" }, createElement("div", null, createElement("h3", { className: "font-semibold tracking-tight" }, t(title)), subtitle ? createElement("p", { className: "mt-0.5 text-xs text-muted" }, t(subtitle)) : null), action ? createElement("div", { className: "min-w-0 max-w-full" }, action) : null);
}
export function StatCard({
  label,
  value,
  change,
  hint,
  icon
}) {
  const { t } = useI18n();
  const up = (change ?? 0) >= 0;
  return createElement(Card, { className: "metric-card p-5" }, createElement("div", { className: "flex items-center justify-between gap-3" }, createElement("p", { className: "text-sm font-medium text-muted" }, t(label)), icon ? createElement(
    "span",
    {
      style: {
        "--metric-color": `var(--chart-${1 + Array.from(label).reduce((sum, letter) => sum + letter.charCodeAt(0), 0) % 6})`
      },
      className: "metric-icon grid size-10 place-items-center rounded-xl"
    },
    icon
  ) : null), createElement("div", { className: "mt-5 flex items-end justify-between gap-3" }, createElement("div", null, createElement("p", { className: "text-2xl font-bold tracking-tight" }, value), hint ? createElement("p", { className: "mt-1 text-xs text-muted" }, t(hint)) : null), change !== void 0 && createElement(
    "span",
    {
      className: clsx(
        "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold",
        up ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
      )
    },
    up ? createElement(ArrowUpRight, { size: 13 }) : createElement(ArrowDownRight, { size: 13 }),
    Math.abs(change ?? 0),
    "%"
  )));
}
export function PageHeader({
  title,
  description,
  actions
}) {
  const { t } = useI18n();
  return createElement("div", { className: "mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" }, createElement("div", null, createElement("h1", { className: "text-lg font-semibold" }, t(title)), description ? createElement("p", { className: "mt-1 max-w-2xl text-xs text-muted" }, t(description)) : null), actions ? createElement("div", { className: "flex flex-wrap gap-2" }, actions) : null);
}
export function Badge({
  children,
  tone = "neutral"
}) {
  const { t } = useI18n();
  const tones = {
    neutral: "bg-[var(--panel-2)] text-muted",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
    brand: "bg-brand/10 text-brand"
  };
  return createElement(
    "span",
    {
      className: clsx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        tones[tone]
      )
    },
    Children.map(
      children,
      (child) => typeof child === "string" ? child.replace(child.trim(), t(child.trim())) : child
    )
  );
}
export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const { t } = useI18n();
  const styles = {
    primary: "bg-[var(--brand)] text-[var(--primary-foreground)] hover:opacity-90",
    secondary: "border border-ui bg-[var(--panel)] hover:bg-[var(--panel-2)]",
    ghost: "hover:bg-[var(--panel-2)]",
    danger: "bg-rose-600 text-white hover:bg-rose-700"
  };
  return createElement(
    "button",
    {
      type: "button",
      className: clsx(
        "button-ui inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-xs font-medium transition disabled:opacity-45",
        styles[variant],
        className
      ),
      ...props
    },
    Children.map(
      children,
      (child) => typeof child === "string" ? child.replace(child.trim(), t(child.trim())) : child
    )
  );
}
export function Progress({ value }) {
  return createElement("div", { className: "h-2 overflow-hidden rounded-full bg-[var(--panel-2)]" }, createElement(
    "div",
    {
      className: "h-full rounded-full bg-[var(--brand)]",
      style: { width: `${Math.max(0, Math.min(100, value))}%` }
    }
  ));
}
