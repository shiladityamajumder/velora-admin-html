import { createElement, Fragment } from '../../runtime/dom.js';
import { useState } from "../../runtime/dom.js";
import {
  BriefcaseBusiness,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Download,
  Pencil,
  Plus,
  Target,
  Trophy
} from "../../vendor/icons.js";
import { Button, Card, CardHeader, Progress } from "../primitives.js";
import { GoalGauge, TrendAreaChart } from "../charts.js";
import { RecordEditor } from "../record-editor.js";
import { useUI } from "../ui-provider.js";
import { exportCsv, usePersistentState } from "../../lib/client-store.js";
import { projects } from "../../lib/mock-data.js";
import { StatusBadge, DashboardTitle, Tabs } from "./shared.js";
export function ProjectsDashboard() {
  const [rows, setRows] = usePersistentState("projects", projects);
  const [year, setYear] = useState("2026");
  const [view, setView] = useState("Table");
  const [editor, setEditor] = useState(null);
  const { notify } = useUI();
  const trend = [8, 20, 38, 55, 63, 71, 95, 115, 121, 139, 172, 201].map(
    (value, index) => ({
      name: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ][index],
      value: Math.round(
        value * (year === "2026" ? 1 : year === "2025" ? 0.8 : 0.64)
      )
    })
  );
  return createElement(Fragment, null, createElement(DashboardTitle, { title: "Projects" }), createElement(Card, { className: "mb-6" }, createElement("div", { className: "grid divide-y divide-[var(--line)] sm:grid-cols-2 sm:divide-y-0 xl:grid-cols-4" }, [
    ["ACTIVE PROJECTS", "45", "3 new this week", BriefcaseBusiness],
    ["TASKS COMPLETED", "1,280", "48 tasks remaining", CheckCircle2],
    ["HOURS LOGGED", "1,420 h", "Billable hours", Clock3],
    ["BUDGET SPENT", "$52,400", "60% budget spent", CircleDollarSign]
  ].map(([label, value, hint, icon]) => {
    const Icon = icon;
    return createElement(
      "div",
      {
        key: String(label),
        className: "border-e border-ui p-5 last:border-0"
      },
      createElement("p", { className: "flex items-center justify-between text-[11px] uppercase tracking-wide text-muted" }, String(label), createElement(Icon, { size: 20 })),
      createElement("p", { className: "mt-2 text-2xl font-medium" }, String(value)),
      createElement("p", { className: "mt-3 text-xs text-muted" }, String(hint))
    );
  }))), createElement("div", { className: "mb-6 grid gap-6 lg:grid-cols-3" }, createElement(Card, { className: "lg:col-span-2" }, createElement(
    CardHeader,
    {
      title: "Revenue Statistics",
      action: createElement(
        Tabs,
        {
          options: ["2024", "2025", "2026"],
          value: year,
          onChange: setYear
        }
      )
    }
  ), createElement("div", { className: "grid grid-cols-4 px-6 pt-6 text-xs" }, [
    ["Q1", "30", "$45K"],
    ["Q2", "60", "$85K"],
    ["Q3", "100", "$120K"],
    ["Q4", "150", "$210K"]
  ].map(([quarter, count, value]) => createElement(
    "div",
    {
      key: quarter,
      className: "border-e border-ui ps-3 last:border-0"
    },
    createElement("p", { className: "text-muted" }, quarter),
    createElement("p", { className: "mt-1 font-semibold" }, count, " ", createElement("span", { className: "font-normal text-muted" }, value))
  ))), createElement("div", { className: "p-5" }, createElement(
    TrendAreaChart,
    {
      data: trend,
      height: 280,
      names: ["Project revenue"],
      unit: "k"
    }
  ))), createElement(Card, null, createElement(
    CardHeader,
    {
      title: "Yearly Goal",
      subtitle: "You've completed 85% of your yearly goal"
    }
  ), createElement("div", { className: "p-6" }, createElement(GoalGauge, { value: 85 }), createElement("div", { className: "mt-4 divide-y divide-[var(--line)]" }, [
    ["Won Deals", "170", Trophy],
    ["Total Deals", "200", BriefcaseBusiness],
    ["Target", "85%", Target],
    ["Cycle Length", "45 days", Clock3]
  ].map(([label, value, icon]) => {
    const Icon = icon;
    return createElement(
      "div",
      {
        key: String(label),
        className: "flex items-center gap-2 py-2.5 text-xs"
      },
      createElement(Icon, { size: 17, className: "text-brand" }),
      createElement("span", { className: "text-muted" }, String(label)),
      createElement("b", { className: "ms-auto" }, String(value))
    );
  }))))), createElement(Card, null, createElement(
    CardHeader,
    {
      title: "Recent Projects",
      action: createElement("div", { className: "flex flex-wrap gap-2" }, createElement(
        Tabs,
        {
          options: ["Table", "Portfolio"],
          value: view,
          onChange: setView
        }
      ), createElement(
        Button,
        {
          variant: "secondary",
          onClick: () => exportCsv(
            "projects.csv",
            ["Name", "Owner", "Due", "Progress", "Status"],
            rows.map((row) => [
              row.name,
              row.owner,
              row.due,
              row.progress,
              row.status
            ])
          )
        },
        createElement(Download, { size: 14 }),
        "Report"
      ), createElement(Button, { onClick: () => setEditor("new") }, createElement(Plus, { size: 14 }), "New project"))
    }
  ), view === "Portfolio" ? createElement("div", { className: "grid gap-4 p-5 md:grid-cols-2" }, rows.map((project) => createElement(
    "div",
    {
      key: project.name,
      className: "rounded-md border border-ui p-4"
    },
    createElement("div", { className: "flex justify-between" }, createElement("p", { className: "font-semibold" }, project.name), createElement(
      "button",
      {
        "aria-label": `Edit ${project.name}`,
        onClick: () => setEditor(project),
        className: "text-muted"
      },
      createElement(Pencil, { size: 14 })
    )),
    createElement("p", { className: "my-3 text-xs text-muted" }, project.owner, " \xB7 Due ", project.due),
    createElement(Progress, { value: project.progress }),
    createElement("div", { className: "mt-3 flex justify-between" }, createElement(StatusBadge, { status: project.status }), createElement("span", { className: "text-xs" }, project.progress, "%"))
  ))) : createElement("div", { className: "overflow-x-auto" }, createElement("table", { className: "table-ui min-w-[780px]" }, createElement("thead", null, createElement("tr", null, ["Name", "Status", "Team", "Due", "Progress", "Actions"].map(
    (header) => createElement("th", { key: header }, header)
  ))), createElement("tbody", null, rows.map((project) => createElement("tr", { key: project.name }, createElement("td", null, createElement("div", { className: "flex items-center gap-3" }, createElement("span", { className: "grid size-9 shrink-0 place-items-center rounded-full bg-brand/10 text-brand" }, project.name[0]), createElement("b", { className: "text-xs" }, project.name))), createElement("td", null, createElement(StatusBadge, { status: project.status })), createElement("td", null, project.owner), createElement("td", null, project.due), createElement("td", null, createElement("div", { className: "flex items-center gap-3" }, createElement("div", { className: "w-20" }, createElement(Progress, { value: project.progress })), project.progress, "%")), createElement("td", null, createElement(
    "button",
    {
      "aria-label": `Edit ${project.name}`,
      className: "text-muted hover:text-brand",
      onClick: () => setEditor(project)
    },
    createElement(Pencil, { size: 14 })
  )))))))), editor ? createElement(
    RecordEditor,
    {
      title: editor === "new" ? "New project" : "Edit project",
      onClose: () => setEditor(null),
      fields: [
        {
          name: "name",
          label: "Project name",
          initial: editor === "new" ? "" : editor.name
        },
        {
          name: "owner",
          label: "Team",
          initial: editor === "new" ? "" : editor.owner
        },
        {
          name: "due",
          label: "Due date",
          initial: editor === "new" ? "" : editor.due
        },
        {
          name: "progress",
          label: "Progress (%)",
          type: "number",
          min: 0,
          max: 100,
          initial: editor === "new" ? 0 : editor.progress
        },
        {
          name: "status",
          label: "Status",
          options: ["On Track", "At Risk", "Blocked", "Completed"],
          initial: editor === "new" ? "On Track" : editor.status
        }
      ],
      onSubmit: (values) => {
        if (rows.some(
          (row) => row.name === values.name && (editor === "new" || row.name !== editor.name)
        ))
          throw new Error("A project with this name already exists.");
        const saved = {
          name: values.name,
          owner: values.owner,
          due: values.due,
          progress: Number(values.progress),
          status: values.status
        };
        setRows(
          (items) => editor === "new" ? [...items, saved] : items.map(
            (item) => item.name === editor.name ? saved : item
          )
        );
        setEditor(null);
        notify("Project saved.");
      }
    }
  ) : null);
}
