import { createElement, Fragment } from '../../../../../runtime/dom.js';
import { notFound } from "../../../../../runtime/navigation.js";
import { ModulePage } from "../../../../../features/enterprise/module-page.js";
export default function Page({
  params
}) {
  const { segments = [] } = params;
  if (segments.length > 2 || segments.length === 2 && segments[1] !== "edit")
    notFound();
  return createElement(
    ModulePage,
    {
      modulePath: "apps/tasks",
      recordId: segments[0] === "new" ? void 0 : segments[0],
      action: segments[0] === "new" ? "new" : segments[1]
    }
  );
}
