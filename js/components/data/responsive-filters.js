import { createElement, Fragment } from '../../runtime/dom.js';
import { useState } from "../../runtime/dom.js";
import { SlidersHorizontal } from "../../vendor/icons.js";
import { useI18n } from "../../i18n/provider.js";
import { Button } from "../primitives.js";
import { Modal } from "../interactions.js";
export function ResponsiveFilters({
  children,
  count
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return createElement("div", { className: "mb-4" }, createElement("div", { className: "surface hidden flex-wrap items-end gap-3 p-4 md:flex" }, children), createElement(
    Button,
    {
      variant: "secondary",
      className: "w-full md:hidden",
      onClick: () => setOpen(true)
    },
    createElement(SlidersHorizontal, { size: 14 }),
    t("Filters"),
    count > 0 && createElement("span", null, "(", count, ")")
  ), open && createElement(Modal, { title: t("Filters"), drawer: true, onClose: () => setOpen(false) }, createElement("div", { className: "space-y-4" }, children, createElement(Button, { className: "w-full", onClick: () => setOpen(false) }, t("Apply filters")))));
}
