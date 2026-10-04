import { createElement, Fragment } from '../../runtime/dom.js';
import { useI18n } from "../../i18n/provider.js";
export function ActivityTimeline({ entries }) {
  const { date, t } = useI18n();
  return createElement("ol", { className: "space-y-5 border-s border-ui ps-5" }, entries.map((entry) => createElement("li", { key: entry.id, className: "relative" }, createElement("span", { className: "absolute -start-[25px] top-1 size-2 rounded-full bg-brand" }), createElement("p", { className: "text-sm" }, entry.text), createElement("p", { className: "mt-1 text-xs text-muted" }, entry.actor, " \xB7 ", date(entry.timestamp, true)))), !entries.length && createElement("li", { className: "text-xs text-muted" }, t("No results")));
}
export function WorkflowTimeline({
  stages,
  current
}) {
  const { t } = useI18n();
  const index = stages.indexOf(current);
  return createElement("ol", { className: "flex flex-wrap gap-2" }, stages.map((stage, i) => createElement(
    "li",
    {
      key: stage,
      "aria-current": stage === current ? "step" : void 0,
      className: `rounded border px-3 py-2 text-xs ${i <= index ? "border-brand bg-brand/5 text-brand" : "border-ui text-muted"}`
    },
    createElement("span", { className: "me-2" }, i + 1, "."),
    t(stage)
  )));
}
