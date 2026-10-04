import { createElement, Fragment } from '../../runtime/dom.js';
import { CircleAlert, Inbox, LoaderCircle } from "../../vendor/icons.js";
import { useI18n } from "../../i18n/provider.js";
import { Button } from "../primitives.js";
export function LoadingState() {
  const { t } = useI18n();
  return createElement(
    "div",
    {
      role: "status",
      className: "flex items-center justify-center gap-3 p-12 text-muted"
    },
    createElement(LoaderCircle, { className: "animate-spin", size: 20 }),
    t("Loading")
  );
}
export function TableSkeleton() {
  return createElement("div", { "aria-busy": "true", className: "space-y-4 p-5" }, [1, 2, 3, 4, 5].map((i) => createElement("div", { key: i, className: "pulse-soft h-8 rounded bg-[var(--panel-2)]" })));
}
export function CardSkeleton() {
  return createElement("div", { "aria-busy": "true", className: "surface pulse-soft h-32" });
}
export function ErrorState({
  message,
  retry
}) {
  const { t } = useI18n();
  return createElement("div", { role: "alert", className: "space-y-4 p-10 text-center" }, createElement(CircleAlert, { className: "mx-auto text-danger" }), createElement("p", null, t(message)), createElement(Button, { onClick: retry }, t("Try again")));
}
export function DataEmptyState() {
  const { t } = useI18n();
  return createElement("div", { className: "p-10 text-center" }, createElement(Inbox, { className: "mx-auto mb-3 text-muted" }), createElement("p", null, t("No results")), createElement("p", { className: "mt-1 text-xs text-muted" }, t("Try another search or add a new item.")));
}
