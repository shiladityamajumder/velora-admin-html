import { createElement, Fragment } from '../../../../runtime/dom.js';
import { redirect } from "../../../../runtime/navigation.js";
import { notFound } from "../../../../runtime/navigation.js";
import { getModule } from "../../../../config/modules.js";
import { ModulePage } from "../../../../features/enterprise/module-page.js";
import { AuditPage } from "../../../../features/enterprise/audit-page.js";
const aliases = {
  "crm/pipeline": { path: "crm/deals", view: "pipeline" },
  "pharmacy/medicines": { path: "commerce/products" },
  "pharmacy/orders": { path: "commerce/orders" },
  "inventory/batches": { path: "inventory/stock" },
  "inventory/expiry": { path: "inventory/stock", view: "expiry" },
  "inventory/low-stock": { path: "inventory/stock", view: "low-stock" },
  "diagnostics/samples": { path: "diagnostics/bookings" }
};
export default function Page({
  params
}) {
  const { domain, segments = [] } = params;
  if (domain === "admin" && ["roles", "permissions"].includes(segments[0]))
    redirect("/settings/roles");
  if (domain === "admin" && segments[0] === "audit" && segments.length === 1)
    return createElement(AuditPage, null);
  if (segments.length < 1 || segments.length > 3) notFound();
  const root = domain + "/" + segments[0];
  const alias = aliases[root];
  const definition = getModule(alias?.path ?? root);
  if (!definition) notFound();
  const rest = segments.slice(1);
  const action = rest[0] === "new" ? "new" : rest[1];
  if (action && !["new", "edit"].includes(action) || rest.length === 2 && rest[1] !== "edit")
    notFound();
  return createElement(
    ModulePage,
    {
      key: root + "/" + rest.join("/"),
      modulePath: definition.path,
      recordId: rest[0] === "new" ? void 0 : rest[0],
      action,
      view: alias?.view
    }
  );
}
