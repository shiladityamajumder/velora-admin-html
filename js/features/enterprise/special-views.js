import { createElement, Fragment } from '../../runtime/dom.js';
import { useState } from "../../runtime/dom.js";
import {
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format
} from "../../vendor/dates.js";
import { useI18n } from "../../i18n/provider.js";
import { useUI } from "../../components/ui-provider.js";
import { serviceFor } from "../../services/modules.js";
import { Button, Badge } from "../../components/primitives.js";
export function PipelineBoard({
  module,
  rows,
  manage,
  onView
}) {
  const { t, currency } = useI18n();
  const { notify } = useUI();
  async function move(id, stage) {
    if (!manage || !rows.some((row) => row.id === id)) return;
    try {
      await serviceFor(module).update(id, { status: stage });
      notify(t("Saved successfully"));
    } catch (error) {
      notify(
        error instanceof Error ? error.message : t("Something went wrong"),
        "error"
      );
    }
  }
  return createElement("div", { className: "thin-scrollbar overflow-x-auto pb-4" }, createElement("div", { className: "grid min-w-[1200px] grid-cols-6 gap-3" }, module.statuses.map((stage) => {
    const cards = rows.filter((row) => row.status === stage);
    return createElement(
      "section",
      {
        key: stage,
        className: "surface-soft min-h-80 p-3",
        onDragOver: (event) => {
          if (manage) event.preventDefault();
        },
        onDrop: (event) => {
          event.preventDefault();
          void move(event.dataTransfer.getData("text/plain"), stage);
        }
      },
      createElement("div", { className: "mb-4 flex items-center justify-between" }, createElement("h2", { className: "text-xs font-semibold" }, t(stage)), createElement(Badge, null, cards.length)),
      createElement("p", { className: "mb-3 text-xs text-muted" }, currency(
        cards.reduce((sum, row) => sum + Number(row.value), 0)
      )),
      createElement("div", { className: "space-y-3" }, cards.map((row) => createElement(
        "article",
        {
          key: row.id,
          draggable: manage,
          onDragStart: (event) => event.dataTransfer.setData("text/plain", row.id),
          className: "surface space-y-3 p-3"
        },
        createElement(
          "button",
          {
            onClick: () => onView(row),
            className: "text-start text-xs font-medium text-brand"
          },
          row.name
        ),
        createElement("p", { className: "text-sm font-semibold" }, currency(Number(row.value))),
        createElement("p", { className: "text-xs text-muted" }, String(row.owner)),
        manage && createElement(
          "select",
          {
            "aria-label": t("Stage") + " " + row.name,
            className: "field text-xs",
            value: row.status,
            onChange: (event) => void move(row.id, event.target.value)
          },
          module.statuses.map((stage2) => createElement("option", { key: stage2, value: stage2 }, t(stage2)))
        )
      )))
    );
  })));
}
export function AppointmentCalendar({
  rows,
  onView
}) {
  const { t, date } = useI18n();
  const [month, setMonth] = useState(new Date(2026, 9, 1));
  const days = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month)
  });
  return createElement("div", { className: "surface p-4" }, createElement("div", { className: "mb-4 flex flex-wrap items-center justify-between gap-2" }, createElement("h2", { className: "font-semibold" }, date(month)), createElement("div", { className: "flex gap-2" }, createElement(
    Button,
    {
      variant: "secondary",
      onClick: () => setMonth(addMonths(month, -1))
    },
    t("Previous")
  ), createElement(
    Button,
    {
      variant: "secondary",
      onClick: () => setMonth(addMonths(month, 1))
    },
    t("Next")
  ))), createElement("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7" }, days.map((day) => createElement(
    "section",
    {
      key: day.toISOString(),
      className: "min-h-24 rounded border border-ui p-2"
    },
    createElement("p", { className: "mb-2 text-xs text-muted" }, date(day)),
    rows.filter((row) => row.date === format(day, "yyyy-MM-dd")).map((row) => createElement(
      "button",
      {
        key: row.id,
        onClick: () => onView(row),
        className: "mb-1 block w-full rounded bg-brand/10 p-1.5 text-start text-[10px] text-brand"
      },
      String(row.time),
      " \xB7 ",
      String(row.customer),
      createElement("span", { className: "block" }, String(row.doctor))
    ))
  ))));
}
