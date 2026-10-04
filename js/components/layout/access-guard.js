import { createElement, Fragment } from '../../runtime/dom.js';
import { Link as Link } from "../../runtime/navigation.js";
import { usePathname } from "../../runtime/navigation.js";
import { useSyncExternalStore } from "../../runtime/dom.js";
import { ShieldCheck } from "../../vendor/icons.js";
import { useAuth } from "../../hooks/use-auth.js";
import { useI18n } from "../../i18n/provider.js";
import { usePersistentState } from "../../lib/client-store.js";
import { defaultFlags } from "../../hooks/use-navigation.js";
import { modules } from "../../config/modules.js";
import { navigation } from "../../config/navigation.js";
import { LoadingState } from "../data/states.js";
const legacyPermissions = {
  "/apps/files": "products.view",
  "/apps/file-manager": "products.view",
  "/apps/kanban": "crm.view",
  "/apps/projects": "crm.manage",
  "/apps/products": "products.update",
  "/apps/invoices": "finance.manage",
  "/apps/pos": "orders.create",
  "/tables": "users.manage",
  "/tables/advanced": "customers.view",
  "/dashboard/ecommerce": "products.update",
  "/dashboard/crm": "crm.manage",
  "/dashboard/finance": "finance.manage",
  "/dashboard/projects": "crm.manage",
  "/dashboard/restaurant": "orders.update"
};
const subscribe = () => () => {
};
export function AccessGuard({ children }) {
  const path = usePathname();
  const { user, has } = useAuth();
  const { t } = useI18n();
  const [flags] = usePersistentState("feature-flags", defaultFlags);
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
  if (path === "/template" || path === "/docs" || path === "/library" || path.startsWith("/library/"))
    return children;
  if (!hydrated) return createElement(LoadingState, null);
  if (!user)
    return createElement("div", { className: "surface mx-auto max-w-lg space-y-5 p-8 text-center" }, createElement(ShieldCheck, { className: "mx-auto text-brand", size: 32 }), createElement("h1", { className: "text-lg font-semibold" }, t("Demo workspace")), createElement("p", { className: "text-sm text-muted" }, t("Sign in to use the workspace and role permissions.")), createElement(
      Link,
      {
        href: `/auth/login?next=${encodeURIComponent(path)}`,
        className: "inline-flex rounded bg-brand px-4 py-2 text-white"
      },
      t("Sign in")
    ));
  if (path.startsWith("/settings/") && path !== "/settings/demo" && !has("settings.manage"))
    return createElement(Unauthorized, null);
  if (!has(legacyPermissions[path]))
    return createElement(Unauthorized, null);
  const definition = modules.find(
    (definition2) => path === "/" + definition2.path || path.startsWith("/" + definition2.path + "/")
  );
  const item = navigation.flatMap((group) => group.items).filter((item2) => item2.href === path || path.startsWith(item2.href + "/")).sort((a, b) => b.href.length - a.href.length)[0];
  if (!has(
    path === "/settings/demo" ? void 0 : definition?.view ?? item?.permission
  ) || (definition?.feature ?? item?.feature) && !flags[definition?.feature ?? item?.feature])
    return createElement(Unauthorized, null);
  return children;
}
export function Unauthorized() {
  const { t } = useI18n();
  return createElement("div", { className: "surface space-y-4 p-10 text-center" }, createElement(ShieldCheck, { className: "mx-auto text-danger", size: 36 }), createElement("h1", { className: "text-xl font-semibold" }, t("Unauthorized")), createElement("p", { className: "text-sm text-muted" }, t("You do not have permission to view this page.")), createElement(Link, { href: "/template", className: "text-brand" }, t("Template overview")));
}
