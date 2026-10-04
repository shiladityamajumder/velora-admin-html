import { createElement, Fragment } from '../../../../runtime/dom.js';
import { FileManager } from "../../../../features/enterprise/file-manager.js";
import { ModulePage } from "../../../../features/enterprise/module-page.js";
import { DashboardPage } from "../../../../components/dashboard-page.js";
import { AppsPage } from "../../../../components/apps-page.js";
import { notFound } from "../../../../runtime/navigation.js";
const supported = new Set([
  "pos",
  "chat",
  "email",
  "todo",
  "calendar",
  "products",
  "invoices"
]);
export default function Page({
  params
}) {
  const { slug } = params;
  if (["files", "file-manager"].includes(slug)) return createElement(FileManager, null);
  if (slug === "kanban")
    return createElement(ModulePage, { modulePath: "crm/deals", view: "pipeline" });
  if (slug === "projects") return createElement(DashboardPage, { slug: "projects" });
  if (!supported.has(slug)) notFound();
  return createElement(AppsPage, { slug });
}
