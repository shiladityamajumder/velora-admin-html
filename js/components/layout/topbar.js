import { createElement, Fragment } from '../../runtime/dom.js';
import { Dropdown } from "./dropdown.js";
import { Link as Link } from "../../runtime/navigation.js";
import { useRouter } from "../../runtime/navigation.js";
import {
  Bell,
  Menu,
  Search,
  Sun,
  Moon,
  Settings2,
  Plus,
  Maximize,
  Grid2X2,
  UserRound
} from "../../vendor/icons.js";
import { useUI } from "../ui-provider.js";
import { useI18n, locales } from "../../i18n/provider.js";
import { useAuth } from "../../hooks/use-auth.js";
import { usePersistentState } from "../../lib/client-store.js";
import { initialNotifications } from "./notifications.js";
export function Topbar({
  onSearch,
  onNotifications
}) {
  const ui = useUI();
  const { t, locale, setLocale } = useI18n();
  const auth = useAuth();
  const router = useRouter();
  const [notifications] = usePersistentState(
    "notifications-v2",
    initialNotifications
  );
  const toggle = () => {
    if (window.matchMedia("(min-width: 1024px)").matches && !["hidden", "offcanvas"].includes(ui.sidebarVariant))
      ui.setSidebarVariant(ui.sidebarVariant === "mini" ? "default" : "mini");
    else ui.setMobileSidebarOpen(true);
  };
  const links = [
    {
      label: "Products",
      href: "/commerce/products/new",
      permission: "products.create"
    },
    {
      label: "Orders",
      href: "/commerce/orders/new",
      permission: "orders.create"
    },
    { label: "Tasks", href: "/apps/todo" },
    { label: "Invoices", href: "/apps/invoices" }
  ].filter((item) => auth.has(item.permission));
  return createElement(
    "header",
    {
      "data-workspace-header": true,
      className: `no-print top-0 z-30 border-b border-ui bg-[var(--panel)] ${ui.header === "fixed" ? "sticky" : "relative"}`
    },
    createElement("div", { className: "mx-auto flex h-[65px] max-w-[1800px] items-center gap-1.5 px-3 sm:gap-3 sm:px-6" }, createElement(
      "button",
      {
        "aria-label": t("Toggle navigation"),
        onClick: toggle,
        className: "grid size-8 shrink-0 place-items-center rounded hover:bg-[var(--panel-2)]"
      },
      createElement(Menu, { size: 19 })
    ), createElement(
      "button",
      {
        "aria-label": t("Search workspace"),
        onClick: onSearch,
        className: "flex min-w-0 items-center gap-2 rounded border border-ui px-2 py-2 text-muted"
      },
      createElement(Search, { size: 17 }),
      createElement("span", { className: "hidden text-xs md:inline" }, t("Search workspace")),
      createElement("kbd", { className: "hidden text-[10px] md:inline" }, "\u2318K")
    ), createElement(Dropdown, { className: "relative hidden sm:block" }, createElement(
      "summary",
      {
        "aria-label": t("Create"),
        className: "flex cursor-pointer list-none items-center gap-1 rounded bg-brand/10 px-2 py-2 text-xs text-brand"
      },
      createElement(Plus, { size: 17 }),
      createElement("span", { className: "hidden md:inline" }, t("Create"))
    ), createElement("div", { className: "surface absolute start-0 top-10 z-40 min-w-40 p-2" }, links.map((item) => createElement(
      Link,
      {
        key: item.href,
        href: item.href,
        onClick: (event) => event.currentTarget.closest("details")?.removeAttribute("open"),
        className: "block rounded px-3 py-2 text-xs hover:bg-brand/10"
      },
      t(item.label)
    )))), createElement("div", { className: "ms-auto flex items-center gap-1 sm:gap-2" }, createElement(
      "select",
      {
        "aria-label": t("Language"),
        className: "max-w-[125px] rounded border border-ui bg-[var(--panel)] p-1 text-[11px] sm:max-w-[180px]",
        value: locale,
        onChange: (event) => setLocale(event.target.value)
      },
      locales.map((item) => createElement("option", { key: item.value, value: item.value }, item.label))
    ), createElement(
      "button",
      {
        "aria-label": t("Toggle theme"),
        onClick: ui.toggleTheme,
        className: "grid size-8 place-items-center rounded hover:bg-[var(--panel-2)]"
      },
      ui.resolvedTheme === "dark" ? createElement(Sun, { size: 18 }) : createElement(Moon, { size: 18 })
    ), createElement(
      "button",
      {
        "aria-label": t("Fullscreen"),
        className: "hidden size-8 place-items-center rounded hover:bg-[var(--panel-2)] md:grid",
        onClick: async () => {
          try {
            if (document.fullscreenElement) await document.exitFullscreen();
            else await document.documentElement.requestFullscreen();
          } catch {
            ui.notify(t("Fullscreen unavailable"), "info");
          }
        }
      },
      createElement(Maximize, { size: 17 })
    ), createElement(
      "button",
      {
        "aria-label": t("Notifications"),
        onClick: onNotifications,
        className: "relative grid size-8 place-items-center rounded hover:bg-[var(--panel-2)]"
      },
      createElement(Bell, { size: 18 }),
      notifications.some((item) => !item.read) && createElement("span", { className: "absolute end-1 top-1 size-1.5 rounded-full bg-danger" })
    ), createElement(
      "button",
      {
        "aria-label": t("Theme customizer"),
        onClick: () => ui.setCustomizerOpen(true),
        className: "grid size-8 place-items-center rounded hover:bg-[var(--panel-2)]"
      },
      createElement(Settings2, { size: 18 })
    ), createElement(Dropdown, { className: "relative hidden lg:block" }, createElement(
      "summary",
      {
        "aria-label": t("Apps"),
        className: "grid size-8 cursor-pointer list-none place-items-center rounded"
      },
      createElement(Grid2X2, { size: 18 })
    ), createElement("div", { className: "surface absolute end-0 top-10 grid w-48 grid-cols-2 gap-1 p-2" }, ["email", "chat", "calendar", "todo", "pos", "files"].filter((slug) => slug !== "pos" || auth.has("orders.create")).filter((slug) => slug !== "files" || auth.has("products.view")).map((slug) => createElement(
      Link,
      {
        key: slug,
        href: "/apps/" + slug,
        className: "rounded p-2 text-xs capitalize hover:bg-brand/10",
        onClick: (event) => event.currentTarget.closest("details")?.removeAttribute("open")
      },
      t(
        {
          todo: "Tasks",
          files: "File Manager",
          pos: "POS"
        }[slug] ?? slug
      )
    )))), createElement(Dropdown, { className: "relative" }, createElement(
      "summary",
      {
        "aria-label": t("My Profile"),
        className: "grid size-8 cursor-pointer list-none place-items-center rounded-full bg-brand/10 text-brand"
      },
      createElement(UserRound, { size: 17 })
    ), createElement("div", { className: "surface absolute end-0 top-10 z-40 w-56 p-3" }, createElement("p", { className: "text-xs font-semibold" }, auth.user?.name ?? t("Demo workspace")), createElement("p", { className: "mb-3 mt-1 text-[10px] text-muted" }, auth.role), createElement(Link, { href: "/profile", className: "block rounded py-2 text-xs" }, t("My Profile")), createElement(
      Link,
      {
        href: "/settings/demo",
        className: "block rounded py-2 text-xs"
      },
      t("Developer / Demo")
    ), createElement(
      "button",
      {
        className: "w-full border-t border-ui py-2 text-start text-xs text-danger",
        onClick: () => {
          auth.logout();
          router.push("/auth/login");
        }
      },
      t("Sign out")
    )))))
  );
}
