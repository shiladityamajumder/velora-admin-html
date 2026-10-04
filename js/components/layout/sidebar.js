import { createElement, Fragment } from '../../runtime/dom.js';
import { Link as Link } from "../../runtime/navigation.js";
import { usePathname } from "../../runtime/navigation.js";
import { ChevronDown, Layers3, Star } from "../../vendor/icons.js";
import { usePersistentState } from "../../lib/client-store.js";
import { useNavigation } from "../../hooks/use-navigation.js";
import { useI18n } from "../../i18n/provider.js";
import { useUI } from "../ui-provider.js";
import { navigationColors } from "../../config/appearance.js";
import { appConfig } from "../../config/app.js";
export function SidebarContent({
  mini = false,
  mobile = false
}) {
  const groups = useNavigation();
  const pathname = usePathname();
  const { t } = useI18n();
  const ui = useUI();
  const [opened, setOpened] = usePersistentState(
    "nav-collapse",
    {}
  );
  const [favorites, setFavorites] = usePersistentState(
    "favorites",
    []
  );
  const items = Array.from(
    new Map(
      groups.flatMap((group) => group.items).map((item) => [item.href, item])
    ).values()
  );
  const compact = mini && !mobile;
  const hover = ui.sidebarVariant === "hover";
  return createElement(Fragment, null, createElement(
    Link,
    {
      href: "/template",
      onClick: () => ui.setMobileSidebarOpen(false),
      className: "flex h-[65px] shrink-0 items-center gap-3 border-b border-ui px-6 text-brand"
    },
    createElement(Layers3, { className: "shrink-0", size: 26 }),
    createElement(
      "span",
      {
        className: `${compact ? hover ? "hidden group-hover/sidebar:block group-focus-within/sidebar:block" : "hidden" : ""} text-sm font-semibold tracking-widest`
      },
      appConfig.name.toUpperCase()
    )
  ), createElement(
    "nav",
    {
      "aria-label": t("Navigation"),
      className: `thin-scrollbar min-h-0 flex-1 overflow-y-auto py-3 ${compact ? "px-3" : "px-3"}`
    },
    favorites.some((href) => items.some((item) => item.href === href)) && createElement(
      "div",
      {
        className: compact ? hover ? "hidden group-hover/sidebar:block group-focus-within/sidebar:block" : "hidden" : ""
      },
      createElement("p", { className: "px-3 py-2 text-[10px] uppercase tracking-wide text-muted" }, t("Favorites")),
      items.filter((item) => favorites.includes(item.href)).map((item) => createElement(
        Link,
        {
          key: item.href,
          href: item.href,
          onClick: () => ui.setMobileSidebarOpen(false),
          className: "flex items-center gap-2 rounded px-3 py-2 text-xs text-brand"
        },
        createElement(Star, { size: 13 }),
        t(item.label)
      ))
    ),
    groups.map((group, index) => {
      const active = group.items.some(
        (item) => pathname === item.href || pathname.startsWith(item.href + "/")
      );
      const open = opened[group.label] ?? active;
      return createElement("div", { key: group.label, className: "mb-1" }, group.section && groups[index - 1]?.section !== group.section && createElement(
        "p",
        {
          className: `mb-2 mt-5 border-t border-ui px-3 pt-5 text-[10px] font-semibold uppercase tracking-widest text-muted ${compact ? hover ? "hidden group-hover/sidebar:block group-focus-within/sidebar:block" : "sr-only" : ""}`
        },
        t(group.section)
      ), createElement(
        "button",
        {
          "data-nav-group": group.label,
          style: {
            "--nav-color": navigationColors[group.label] ?? "var(--brand)"
          },
          "aria-label": t(group.label),
          title: t(group.label),
          "aria-expanded": open,
          className: `nav-section-trigger flex min-h-10 w-full items-center gap-3 rounded px-3 text-start text-xs font-medium ${active ? "text-brand" : "text-[var(--sidebar-text)]"} hover:bg-[var(--panel-2)]`,
          onClick: () => {
            if (compact && ui.sidebarVariant !== "hover")
              ui.setSidebarVariant("default");
            setOpened((prev) => ({ ...prev, [group.label]: !open }));
          }
        },
        createElement(group.icon, { size: 18, className: "shrink-0" }),
        createElement(
          "span",
          {
            className: `${compact ? hover ? "hidden group-hover/sidebar:inline group-focus-within/sidebar:inline" : "hidden" : ""} min-w-0 flex-1`
          },
          t(group.label)
        ),
        createElement(
          ChevronDown,
          {
            size: 13,
            className: `${open ? "rotate-180" : ""} ${compact ? hover ? "hidden group-hover/sidebar:inline group-focus-within/sidebar:inline" : "hidden" : ""}`
          }
        )
      ), open && createElement(
        "div",
        {
          className: `${compact ? hover ? "hidden group-hover/sidebar:block group-focus-within/sidebar:block" : "hidden" : ""} ms-5 mt-1 border-s border-ui ps-2`
        },
        group.items.map((item) => createElement(
          "div",
          {
            key: item.href,
            className: "group/item flex items-center"
          },
          createElement(
            Link,
            {
              href: item.href,
              onClick: () => ui.setMobileSidebarOpen(false),
              "aria-current": pathname === item.href ? "page" : void 0,
              className: `min-w-0 flex-1 rounded px-3 py-2 text-xs ${pathname === item.href ? "bg-[var(--sidebar-active)] font-medium text-brand" : "text-[var(--sidebar-text)] hover:bg-[var(--panel-2)]"}`
            },
            t(item.label),
            item.badge && createElement("span", { className: "ms-2 rounded bg-brand/10 px-1 text-[10px] text-brand" }, item.badge)
          ),
          createElement(
            "button",
            {
              "aria-label": t("Favorites") + " \xB7 " + t(item.label),
              "aria-pressed": favorites.includes(item.href),
              onClick: () => setFavorites(
                (prev) => prev.includes(item.href) ? prev.filter((href) => href !== item.href) : [...prev, item.href]
              ),
              className: `shrink-0 p-1 ${favorites.includes(item.href) ? "text-brand" : "text-muted opacity-0 group-hover/item:opacity-100 focus:opacity-100"}`
            },
            createElement(
              Star,
              {
                size: 12,
                fill: favorites.includes(item.href) ? "currentColor" : "none"
              }
            )
          )
        ))
      ));
    })
  ), !compact && createElement("div", { className: "m-3 rounded border border-ui bg-[var(--panel-2)] p-3 text-xs" }, createElement("p", { className: "font-medium" }, t("Demo workspace")), createElement("p", { className: "mt-1 text-muted" }, t("Synthetic data only")), createElement(Link, { href: "/settings/demo", className: "mt-2 block text-brand" }, t("Developer / Demo"))));
}
