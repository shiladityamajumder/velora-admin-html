import { createElement, Fragment } from '../../runtime/dom.js';
import { createId } from "../../lib/id.js";
import { useState } from "../../runtime/dom.js";
import { Check, Circle, Pencil, Plus, Trash2 } from "../../vendor/icons.js";
import { Badge, Button, Card, CardHeader, PageHeader } from "../primitives.js";
import { EmptyState } from "../interactions.js";
import { RecordEditor } from "../record-editor.js";
import { useUI } from "../ui-provider.js";
import { usePersistentState } from "../../lib/client-store.js";
import { localDate } from "../../lib/records.js";
const initialTasks = [
  {
    id: "t1",
    title: "Review analytics dashboard",
    done: true,
    tag: "Design",
    due: "2026-10-03"
  },
  {
    id: "t2",
    title: "Ship authentication API",
    done: false,
    tag: "Backend",
    due: "2026-10-03"
  },
  {
    id: "t3",
    title: "Prepare client demo",
    done: false,
    tag: "Meeting",
    due: "2026-10-08"
  },
  {
    id: "t4",
    title: "Update component documentation",
    done: false,
    tag: "Docs",
    due: "2026-10-14"
  }
];
export function TodoApp() {
  const [tasks, setTasks] = usePersistentState("tasks", initialTasks);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("My Tasks");
  const [editor, setEditor] = useState(null);
  const { notify } = useUI();
  const today = localDate();
  const filtered = tasks.filter(
    (task) => filter === "Completed" ? task.done : filter === "Today" ? task.due === today && !task.done : filter === "Upcoming" ? task.due > today && !task.done : true
  );
  const add = () => {
    if (!text.trim()) return;
    setTasks((items) => [
      ...items,
      {
        id: createId(),
        title: text.trim(),
        done: false,
        tag: "General",
        due: today
      }
    ]);
    setText("");
    notify("Task added.");
  };
  return createElement(Fragment, null, createElement(
    PageHeader,
    {
      title: "Task Manager",
      description: "Plan work and track its progress.",
      actions: createElement(Badge, { tone: "brand" }, tasks.filter((task) => !task.done).length, " open")
    }
  ), createElement("div", { className: "grid gap-6 lg:grid-cols-[230px_1fr]" }, createElement(Card, { className: "h-fit p-4" }, createElement(Button, { className: "mb-4 w-full", onClick: () => setEditor("new") }, createElement(Plus, { size: 14 }), "New task"), createElement("div", { className: "flex flex-wrap lg:block" }, ["My Tasks", "Today", "Upcoming", "Completed"].map((value) => createElement(
    "button",
    {
      key: value,
      onClick: () => setFilter(value),
      className: `mb-1 flex items-center gap-2 rounded-md px-3 py-2.5 text-xs lg:w-full ${filter === value ? "bg-brand/10 text-brand" : "text-muted hover:bg-[var(--panel-2)]"}`
    },
    createElement(Circle, { size: 13 }),
    value
  )))), createElement(Card, null, createElement(
    CardHeader,
    {
      title: filter,
      subtitle: `${filtered.length} tasks in this view`
    }
  ), createElement(
    "form",
    {
      className: "flex gap-2 border-b border-ui p-4",
      onSubmit: (event) => {
        event.preventDefault();
        add();
      }
    },
    createElement(
      "input",
      {
        "aria-label": "New task title",
        className: "field min-w-0 flex-1",
        placeholder: "Add a task...",
        value: text,
        onChange: (event) => setText(event.target.value)
      }
    ),
    createElement(Button, { type: "submit", disabled: !text.trim() }, createElement(Plus, { size: 14 }), "Add")
  ), createElement("div", { className: "divide-y divide-[var(--line)]" }, filtered.map((task) => createElement("div", { key: task.id, className: "flex items-start gap-3 p-4" }, createElement(
    "button",
    {
      role: "checkbox",
      "aria-checked": task.done,
      "aria-label": `Complete ${task.title}`,
      onClick: () => setTasks(
        (items) => items.map(
          (item) => item.id === task.id ? { ...item, done: !item.done } : item
        )
      ),
      className: `mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border ${task.done ? "border-success bg-success text-white" : "border-ui"}`
    },
    task.done ? createElement(Check, { size: 12 }) : null
  ), createElement("div", { className: "min-w-0 flex-1" }, createElement(
    "p",
    {
      className: `text-sm ${task.done ? "text-muted line-through" : "font-medium"}`
    },
    task.title
  ), createElement("p", { className: "mt-1 text-[11px] text-muted" }, "Due ", task.due === today ? "today" : task.due)), createElement(Badge, { tone: "brand" }, task.tag), createElement(
    "button",
    {
      "aria-label": `Edit ${task.title}`,
      onClick: () => setEditor(task),
      className: "p-1 text-muted hover:text-brand"
    },
    createElement(Pencil, { size: 14 })
  ), createElement(
    "button",
    {
      "aria-label": `Delete ${task.title}`,
      onClick: () => {
        setTasks(
          (items) => items.filter((item) => item.id !== task.id)
        );
        notify("Task removed.");
      },
      className: "p-1 text-muted hover:text-danger"
    },
    createElement(Trash2, { size: 14 })
  ))), !filtered.length ? createElement(
    EmptyState,
    {
      title: "No tasks here",
      description: "Add a task or choose another view."
    }
  ) : null))), editor ? createElement(
    RecordEditor,
    {
      title: editor === "new" ? "New task" : "Edit task",
      onClose: () => setEditor(null),
      fields: [
        {
          name: "title",
          label: "Task title",
          initial: editor === "new" ? "" : editor.title
        },
        {
          name: "tag",
          label: "Category",
          options: ["General", "Design", "Backend", "Meeting", "Docs"],
          initial: editor === "new" ? "General" : editor.tag
        },
        {
          name: "due",
          label: "Due date",
          type: "date",
          initial: editor === "new" ? today : editor.due
        }
      ],
      onSubmit: (values) => {
        const saved = {
          id: editor === "new" ? createId() : editor.id,
          title: values.title,
          tag: values.tag,
          due: values.due,
          done: editor === "new" ? false : editor.done
        };
        setTasks(
          (items) => editor === "new" ? [...items, saved] : items.map((item) => item.id === editor.id ? saved : item)
        );
        setEditor(null);
        notify("Task saved.");
      }
    }
  ) : null);
}
