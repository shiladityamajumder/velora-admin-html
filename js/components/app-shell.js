import { createElement, Fragment } from '../runtime/dom.js';
import { useEffect, useState } from "../runtime/dom.js";
import { useUI } from "./ui-provider.js";
import { usePathname } from "../runtime/navigation.js";
import { Link as Link } from "../runtime/navigation.js";
import { ChevronRight } from "../vendor/icons.js";
import { SidebarContent } from "./layout/sidebar.js";
import { Topbar } from "./layout/topbar.js";
import { CommandPalette } from "./layout/command-palette.js";
import { Notifications } from "./layout/notifications.js";
import { Customizer } from "./layout/customizer.js";
import { AccessGuard } from "./layout/access-guard.js";
import { Modal } from "./interactions.js";
import { useNavigation } from "../hooks/use-navigation.js";
import { useI18n } from "../i18n/provider.js";
import { appConfig } from "../config/app.js";
export function AppShell({ children }) {
  const ui = useUI();
  const { t } = useI18n();
  const pathname = usePathname();
  const groups = useNavigation();
  const [search, setSearch] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const visible = !["hidden", "offcanvas"].includes(ui.sidebarVariant);
  const mini = ["mini", "hover"].includes(ui.sidebarVariant);
  const active = groups.flatMap(
    (group) => group.items.map((item) => ({ ...item, group: group.label }))
  ).filter(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  ).sort((a, b) => b.href.length - a.href.length)[0];
  useEffect(() => {
    const onKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearch((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return createElement("div", { className: "min-h-screen" }, visible && createElement(
    "aside",
    {
      className: `no-print group/sidebar fixed inset-y-0 start-0 z-40 hidden flex-col border-e border-ui bg-[var(--sidebar)] lg:flex ${mini ? "w-20" : ui.sidebarVariant === "compact" ? "w-[220px]" : "sidebar-expanded"} ${ui.sidebarVariant === "hover" ? "hover:w-[var(--sidebar-width)] focus-within:w-[var(--sidebar-width)]" : ""} ${ui.sidebarVariant === "dark" ? "sidebar-dark" : ""}`
    },
    createElement(SidebarContent, { mini })
  ), createElement(
    "div",
    {
      className: `workspace-main min-w-0 transition-[padding] ${visible ? mini ? "lg:ps-20" : ui.sidebarVariant === "compact" ? "lg:ps-[220px]" : "lg:ps-[var(--sidebar-width)]" : ""}`
    },
    createElement(
      Topbar,
      {
        onSearch: () => setSearch(true),
        onNotifications: () => setNotifications(true)
      }
    ),
    createElement(
      "main",
      {
        className: `mx-auto min-w-0 px-3 py-5 sm:px-6 ${ui.width === "boxed" ? "max-w-[1200px]" : "max-w-[1800px]"}`
      },
      createElement(
        "nav",
        {
          "aria-label": "Breadcrumb",
          className: "no-print mb-4 flex flex-wrap items-center gap-2 text-xs text-muted"
        },
        createElement(Link, { href: "/template" }, appConfig.name),
        active && createElement(Fragment, null, createElement(ChevronRight, { size: 12 }), createElement("span", null, t(active.group)), createElement(ChevronRight, { size: 12 }), createElement(
          Link,
          {
            href: active.href,
            "aria-current": pathname === active.href ? "page" : void 0
          },
          t(active.label)
        ))
      ),
      createElement(AccessGuard, null, children)
    ),
    createElement("footer", { className: "no-print flex flex-wrap justify-between gap-2 px-6 py-5 text-xs text-muted" }, createElement("span", null, "\xA9 2026 ", appConfig.name), createElement(Link, { href: "/docs" }, t("Documentation")))
  ), ui.mobileSidebarOpen && createElement(
    Modal,
    {
      title: t("Navigation"),
      drawer: true,
      side: "start",
      onClose: () => ui.setMobileSidebarOpen(false)
    },
    createElement(SidebarContent, { mobile: true })
  ), ui.customizerOpen && createElement(Customizer, null), search && createElement(CommandPalette, { onClose: () => setSearch(false) }), notifications && createElement(Notifications, { onClose: () => setNotifications(false) }));
}
