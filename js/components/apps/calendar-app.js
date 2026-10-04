import { createElement, Fragment } from '../../runtime/dom.js';
import { createId } from "../../lib/id.js";
import { useMemo, useState } from "../../runtime/dom.js";
import { addDays, format, startOfMonth, startOfWeek } from "../../vendor/dates.js";
import { ChevronLeft, ChevronRight, Plus } from "../../vendor/icons.js";
import { Button, Card, PageHeader } from "../primitives.js";
import { Modal } from "../interactions.js";
import { RecordEditor } from "../record-editor.js";
import { useUI } from "../ui-provider.js";
import { usePersistentState } from "../../lib/client-store.js";
import { localDate } from "../../lib/records.js";
import { initialEvents } from "../../lib/calendar.js";
export function CalendarApp() {
  const [month, setMonth] = useState(new Date(2026, 9, 1));
  const [events, setEvents] = usePersistentState(
    "calendar-events",
    initialEvents
  );
  const [editor, setEditor] = useState(null);
  const [detail, setDetail] = useState(null);
  const { notify } = useUI();
  const today = localDate();
  const days = useMemo(
    () => Array.from(
      { length: 42 },
      (_, index) => addDays(startOfWeek(startOfMonth(month)), index)
    ),
    [month]
  );
  return createElement(Fragment, null, createElement(
    PageHeader,
    {
      title: "Calendar",
      description: "Team events and upcoming milestones.",
      actions: createElement(Button, { onClick: () => setEditor({ date: today }) }, createElement(Plus, { size: 14 }), "New event")
    }
  ), createElement(Card, null, createElement("div", { className: "flex items-center justify-between gap-3 border-b border-ui p-4" }, createElement("h2", { className: "text-base font-semibold" }, format(month, "MMMM yyyy")), createElement("div", { className: "flex gap-2" }, createElement(
    Button,
    {
      variant: "secondary",
      "aria-label": "Previous month",
      onClick: () => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
    },
    createElement(ChevronLeft, { size: 15 })
  ), createElement(
    Button,
    {
      variant: "secondary",
      onClick: () => setMonth(startOfMonth(new Date()))
    },
    "Today"
  ), createElement(
    Button,
    {
      variant: "secondary",
      "aria-label": "Next month",
      onClick: () => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
    },
    createElement(ChevronRight, { size: 15 })
  ))), createElement("div", { className: "grid grid-cols-7 border-b border-ui text-center text-[10px] font-medium uppercase tracking-wide text-muted" }, ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => createElement("div", { key: day, className: "py-3" }, day))), createElement("div", { className: "grid grid-cols-7" }, days.map((day) => {
    const key = localDate(day), inMonth = day.getMonth() === month.getMonth();
    return createElement(
      "div",
      {
        key,
        className: `min-h-[92px] min-w-0 border-b border-e border-ui p-1.5 sm:min-h-[125px] sm:p-2 ${inMonth ? "" : "bg-[var(--panel-2)]"}`
      },
      createElement(
        "button",
        {
          "aria-label": `Add event on ${format(day, "MMMM d, yyyy")}`,
          className: `mb-2 grid size-6 place-items-center rounded-full text-[10px] ${key === today ? "bg-brand text-white" : inMonth ? "" : "text-muted"}`,
          onClick: () => setEditor({ date: key })
        },
        format(day, "d")
      ),
      events.filter((event) => event.date === key).sort((a, b) => a.time.localeCompare(b.time)).map((event, index) => createElement(
        "button",
        {
          key: event.id,
          title: `${event.time} ${event.title}`,
          onClick: () => setDetail(event),
          className: `mb-1 block w-full truncate rounded px-1 py-1 text-start text-[9px] sm:px-2 sm:text-[10px] ${index % 2 ? "bg-info/10 text-info" : "bg-brand/10 text-brand"}`
        },
        createElement("span", { className: "hidden sm:inline" }, event.time, " "),
        event.title
      ))
    );
  }))), editor ? createElement(
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
          required: false,
          initial: editor.event?.description
        }
      ],
      onSubmit: (values) => {
        const saved = {
          id: editor.event?.id ?? createId(),
          title: values.title,
          date: values.date,
          time: values.time,
          description: values.description
        };
        setEvents(
          (items) => editor.event ? items.map(
            (item) => item.id === editor.event.id ? saved : item
          ) : [...items, saved]
        );
        setMonth(startOfMonth(new Date(`${values.date}T12:00:00`)));
        setEditor(null);
        notify("Event saved.");
      }
    }
  ) : null, detail ? createElement(
    Modal,
    {
      title: detail.title,
      description: `${detail.date} \xB7 ${detail.time}`,
      onClose: () => setDetail(null)
    },
    createElement("p", { className: "text-sm text-muted" }, detail.description || "No description."),
    createElement("div", { className: "mt-5 flex justify-end gap-2" }, createElement(
      Button,
      {
        variant: "danger",
        onClick: () => {
          setEvents(
            (items) => items.filter((item) => item.id !== detail.id)
          );
          setDetail(null);
          notify("Event removed.");
        }
      },
      "Delete event"
    ), createElement(
      Button,
      {
        onClick: () => {
          setEditor({ event: detail, date: detail.date });
          setDetail(null);
        }
      },
      "Edit event"
    ))
  ) : null);
}
