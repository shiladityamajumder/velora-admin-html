import { createElement, Fragment } from '../../runtime/dom.js';
import { Link as Link } from "../../runtime/navigation.js";
import {
  Layers3,
  LayoutDashboard,
  Table2,
  Palette,
  Globe2,
  ShieldCheck,
  ArrowUpRight
} from "../../vendor/icons.js";
import { useI18n } from "../../i18n/provider.js";
import { useUI } from "../../components/ui-provider.js";
import { useAuth } from "../../hooks/use-auth.js";
import { modules } from "../../config/modules.js";
import { navigation } from "../../config/navigation.js";
import {
  PageHeader,
  Card,
  CardHeader,
  Badge,
  Button
} from "../../components/primitives.js";
export function TemplateHome() {
  const { t, number } = useI18n();
  const ui = useUI();
  const auth = useAuth();
  const groups = [...new Set(modules.map((module) => module.group))];
  return createElement(Fragment, null, createElement(
    PageHeader,
    {
      title: t("Template overview"),
      description: t(
        "Reusable admin framework, enterprise workflows and a synthetic healthcare commerce demonstration."
      ),
      actions: createElement(Fragment, null, createElement(
        Button,
        {
          variant: "secondary",
          onClick: () => ui.setCustomizerOpen(true)
        },
        createElement(Palette, { size: 14 }),
        t("Appearance")
      ), createElement(
        Link,
        {
          className: "inline-flex items-center rounded bg-brand px-3 py-2 text-xs text-white",
          href: auth.user ? "/dashboard/executive" : "/auth/login"
        },
        t(auth.user ? "Executive" : "Sign in")
      ))
    }
  ), createElement("div", { className: "mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4" }, [
    { label: "Dashboards", value: "14", icon: LayoutDashboard },
    { label: "Modules", value: number(modules.length), icon: Layers3 },
    { label: "Languages", value: "4", icon: Globe2 },
    { label: "Roles", value: "18", icon: ShieldCheck }
  ].map((item) => createElement(Card, { key: item.label, className: "p-5" }, createElement(item.icon, { size: 21, className: "mb-4 text-brand" }), createElement("p", { className: "text-2xl font-semibold" }, item.value), createElement("p", { className: "mt-1 text-xs text-muted" }, t(item.label))))), createElement("div", { className: "mb-5 grid gap-5 lg:grid-cols-2" }, createElement(Card, null, createElement(CardHeader, { title: t("Dashboards") }), createElement("div", { className: "grid grid-cols-2 gap-2 p-4 sm:grid-cols-3" }, navigation.find((group) => group.label === "Dashboards")?.items.map((item) => createElement(
    Link,
    {
      key: item.href,
      href: item.href,
      className: "flex items-center gap-2 rounded border border-ui p-3 text-xs hover:border-brand hover:text-brand"
    },
    createElement(LayoutDashboard, { size: 15 }),
    t(item.label)
  )))), createElement(Card, null, createElement(CardHeader, { title: t("Reusable framework") }), createElement("div", { className: "space-y-4 p-5" }, [
    {
      title: "UI Library",
      href: "/library",
      description: "Browse working examples and choose patterns to reuse in your next project.",
      icon: Layers3
    },
    {
      title: "Advanced Tables",
      href: "/tables/advanced",
      description: "Search, filters, sorting, selection, saved views and CSV export.",
      icon: Table2
    },
    {
      title: "Appearance",
      href: "/settings/appearance",
      description: "System theme, accents, density, radius and navigation layouts.",
      icon: Palette
    },
    {
      title: "Roles & Permissions",
      href: "/settings/roles",
      description: "Demo roles, route authorization and action permissions.",
      icon: ShieldCheck
    },
    {
      title: "Documentation",
      href: "/docs",
      description: "Services, architecture, configuration and extension guides.",
      icon: Layers3
    }
  ].map((item) => createElement(
    Link,
    {
      key: item.href,
      href: item.href,
      className: "flex items-start gap-3"
    },
    createElement(item.icon, { size: 18, className: "mt-1 text-brand" }),
    createElement("span", { className: "flex-1" }, createElement("span", { className: "block text-sm font-medium" }, t(item.title)), createElement("span", { className: "text-xs text-muted" }, t(item.description))),
    createElement(ArrowUpRight, { size: 16 })
  ))))), createElement(Card, null, createElement(
    CardHeader,
    {
      title: t("Enterprise modules"),
      subtitle: t("Synthetic data only")
    }
  ), createElement("div", { className: "grid gap-5 p-5 sm:grid-cols-2 xl:grid-cols-4" }, groups.map((group) => createElement("section", { key: group }, createElement("h2", { className: "mb-3 flex items-center justify-between text-sm font-semibold" }, t(group), createElement(Badge, null, modules.filter((module) => module.group === group).length)), createElement("div", { className: "space-y-2" }, modules.filter((module) => module.group === group).slice(0, 5).map((module) => createElement(
    Link,
    {
      key: module.path,
      href: "/" + module.path,
      className: "block text-xs text-muted hover:text-brand"
    },
    t(module.title)
  ))))))));
}
