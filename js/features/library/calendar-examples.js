import { createElement, Fragment } from '../../runtime/dom.js';
import { useMemo, useState } from "../../runtime/dom.js";
import {
  addDays,
  addMonths,
  startOfMonth,
  startOfWeek,
  format
} from "../../vendor/dates.js";
import { ChevronLeft, ChevronRight, Plus } from "../../vendor/icons.js";
import { Card, Button } from "../../components/primitives.js";
import { RecordEditor } from "../../components/record-editor.js";
import { usePersistentState } from "../../lib/client-store.js";
import { createId } from "../../lib/id.js";
import { localDate } from "../../lib/records.js";
import { initialEvents } from "../../lib/calendar.js";
import { useI18n } from "../../i18n/provider.js";
import { intlLocales } from "../../i18n/format.js";
import { ExampleFrame } from "./example-frame.js";
export function CalendarExamples({ variant }) {
  const { t, date, locale } = useI18n();
  const [focus, setFocus] = useState(new Date(2026, 9, 3));
  const [events, setEvents] = usePersistentState(
    "calendar-events",
    initialEvents
  );
  const [editor, setEditor] = useState(null);
  const week = variant === "week";
  const agenda = variant === "agenda";
  const days = useMemo(
    () => Array.from(
      { length: week ? 7 : 42 },
      (_, index) => addDays(
        startOfWeek(week ? focus : startOfMonth(focus), { weekStartsOn: 1 }),
        index
      )
    ),
    [focus, week]
  );
  const visibleEvents = events.filter((event) => event.date.startsWith(format(focus, "yyyy-MM"))).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const weekday = (day) => new Intl.DateTimeFormat(intlLocales[locale], { weekday: "short" }).format(
    day
  );
  function change(direction) {
    setFocus(
      (current) => week ? addDays(current, 7 * direction) : addMonths(current, direction)
    );
  }
  return createElement(
    ExampleFrame,
    {
      category: "calendars",
      variant,
      source: `import { CalendarExamples } from "./calendar-examples.js";

<CalendarExamples variant="${variant}" />
// Month, week and agenda share the calendar-events store.`
    },
    createElement(Card, { className: "overflow-hidden" }, createElement("div", { className: "flex flex-wrap items-center justify-between gap-3 border-b border-ui p-4" }, createElement("h2", { className: "text-sm font-semibold" }, new Intl.DateTimeFormat(intlLocales[locale], {
      month: "long",
      year: "numeric"
    }).format(focus)), createElement("div", { className: "flex flex-wrap gap-2" }, createElement(
      Button,
      {
        variant: "secondary",
        "aria-label": t("Previous period"),
        onClick: () => change(-1)
      },
      createElement(ChevronLeft, { size: 15 })
    ), createElement(Button, { variant: "secondary", onClick: () => setFocus(new Date()) }, t("Today")), createElement(
      Button,
      {
        variant: "secondary",
        "aria-label": t("Next period"),
        onClick: () => change(1)
      },
      createElement(ChevronRight, { size: 15 })
    ), createElement(Button, { onClick: () => setEditor({ date: localDate(focus) }) }, createElement(Plus, { size: 14 }), t("New event")))), agenda ? createElement("div", { className: "divide-y divide-[var(--line)]" }, visibleEvents.map((event) => createElement(
      "button",
      {
        key: event.id,
        className: "flex w-full flex-wrap items-center gap-4 p-4 text-start hover:bg-brand/5",
        onClick: () => setEditor({ event, date: event.date })
      },
      createElement("span", { className: "min-w-24 text-xs text-muted" }, date(event.date)),
      createElement("span", { className: "rounded bg-brand/10 px-2 py-1 text-xs text-brand" }, event.time),
      createElement("span", { className: "min-w-0 flex-1 text-xs font-medium" }, event.title),
      createElement("span", { className: "text-xs text-muted" }, t("Edit"))
    )), !visibleEvents.length && createElement("p", { className: "p-10 text-center text-xs text-muted" }, t("No events in this period"))) : createElement("div", { className: "overflow-x-auto" }, createElement("div", { className: week ? "min-w-0" : "min-w-[560px]" }, createElement(
      "div",
      {
        className: `${week ? "hidden sm:grid" : "grid"} grid-cols-7 border-b border-ui bg-[var(--panel-2)] text-center text-xs text-muted`
      },
      days.slice(0, 7).map((day) => createElement("div", { key: day.toISOString(), className: "py-3" }, weekday(day)))
    ), createElement(
      "div",
      {
        className: `grid ${week ? "grid-cols-1 sm:grid-cols-7" : "grid-cols-7"}`
      },
      days.map((day) => {
        const dayEvents = events.filter((event) => event.date === localDate(day)).sort((a, b) => a.time.localeCompare(b.time));
        return createElement(
          "div",
          {
            key: day.toISOString(),
            className: `min-w-0 border-b border-e border-ui p-2 ${week ? "min-h-[80px] sm:min-h-[380px]" : "min-h-[115px]"} ${day.getMonth() !== focus.getMonth() ? "bg-[var(--panel-2)]" : ""}`
          },
          createElement(
            "button",
            {
              "aria-label": t("Add event") + " \xB7 " + date(day),
              className: `mb-2 ${week ? "inline-flex min-w-14 items-center justify-center gap-1 rounded px-2 py-1" : "grid size-7 place-items-center rounded-full"} text-xs ${localDate(day) === localDate() ? "bg-brand text-[var(--primary-foreground)]" : "hover:bg-brand/10"}`,
              onClick: () => setEditor({ date: localDate(day) })
            },
            week && createElement("span", { className: "sm:hidden" }, weekday(day)),
            day.getDate()
          ),
          dayEvents.map((event) => createElement(
            "button",
            {
              key: event.id,
              onClick: () => setEditor({ event, date: event.date }),
              className: "mb-2 block w-full rounded bg-brand/10 px-2 py-2 text-start text-[10px] text-brand"
            },
            createElement("span", { className: "block font-medium" }, event.time),
            createElement("span", { className: "block break-words" }, event.title)
          ))
        );
      })
    )))),
    editor && createElement(
      RecordEditor,
      {
        title: editor.event ? "Edit event" : "New event",
        onClose: () => setEditor(null),
        fields: [
          {
            name: "title",
            label: "Event title",
            initial: editor.event?.title
          },
          { name: "date", label: "Date", type: "date", initial: editor.date },
          {
            name: "time",
            label: "Time",
            type: "time",
            initial: editor.event?.time ?? "10:00"
          },
          {
            name: "description",
            label: "Description",
            type: "textarea",
            initial: editor.event?.description,
            required: false
          }
        ],
        onSubmit: (values) => {
          const saved = {
            id: editor.event?.id ?? createId(),
            ...values
          };
          setEvents(
            (previous) => editor.event ? previous.map(
              (event) => event.id === saved.id ? saved : event
            ) : [...previous, saved]
          );
          setFocus(new Date(saved.date + "T12:00:00"));
          setEditor(null);
        }
      }
    )
  );
}
