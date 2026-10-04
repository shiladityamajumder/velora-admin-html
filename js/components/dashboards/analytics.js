import { createElement, Fragment } from '../../runtime/dom.js';
import { useState } from "../../runtime/dom.js";
import {
  Bot,
  CreditCard,
  Download,
  Github,
  Hash,
  Info,
  Mic2,
  MoreHorizontal,
  Plus,
  Video
} from "../../vendor/icons.js";
import { Card, CardHeader } from "../primitives.js";
import {
  DonutChart,
  InferenceChart,
  MiniRing,
  SparkBars
} from "../charts.js";
import { Toggle, EmptyState } from "../interactions.js";
import { RecordEditor } from "../record-editor.js";
import { useUI } from "../ui-provider.js";
import { exportCsv, usePersistentState } from "../../lib/client-store.js";
import { DashboardTitle, Tabs, TelemetryCard } from "./shared.js";
const successful = [190, 220, 185, 230, 210, 200, 175, 190, 220, 205, 190, 210];
const cached = [15, 20, 24, 15, 19, 25, 19, 16, 20, 25, 20, 14];
const capacity = [220, 250, 230, 260, 250, 240, 220, 230, 260, 250, 230, 245];
const loadData = {
  Month: [
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
  ].map((name, index) => ({
    name,
    successful: successful[index],
    cached: cached[index],
    capacity: capacity[index]
  })),
  Week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
    (name, index) => ({
      name,
      successful: [164, 208, 189, 245, 230, 176, 195][index],
      cached: [18, 29, 32, 20, 27, 15, 24][index],
      capacity: [200, 260, 250, 290, 275, 230, 245][index]
    })
  ),
  Today: [
    "00:00",
    "03:00",
    "06:00",
    "09:00",
    "12:00",
    "15:00",
    "18:00",
    "21:00"
  ].map((name, index) => ({
    name,
    successful: [70, 45, 82, 190, 245, 212, 180, 125][index],
    cached: [10, 8, 14, 25, 32, 27, 21, 16][index],
    capacity: [120, 100, 130, 240, 300, 275, 250, 190][index]
  }))
};
const agentRows = [
  {
    initials: "AA",
    name: "Support Agent Alpha",
    status: "Active",
    rating: 98,
    calls: 7420,
    color: "#0bb197"
  },
  {
    initials: "SR",
    name: "Sales Representative Beta",
    status: "Active",
    rating: 95,
    calls: 4820,
    color: "#74788d"
  },
  {
    initials: "BG",
    name: "Billing Assistant Gamma",
    status: "Away",
    rating: 92,
    calls: 3210,
    color: "#fcb92c"
  },
  {
    initials: "CD",
    name: "Acme Concierge Delta",
    status: "Active",
    rating: 99,
    calls: 2190,
    color: "#4aa3ff"
  },
  {
    initials: "RZ",
    name: "Returns Assistant Zeta",
    status: "Offline",
    rating: 94,
    calls: 1220,
    color: "#ff3d60"
  },
  {
    initials: "DA",
    name: "Database Assistant Eta",
    status: "Active",
    rating: 97,
    calls: 950,
    color: "#906cf4"
  }
];
const integrations = [
  { name: "OpenAI", description: "Transcripts and response traces", icon: Bot },
  { name: "Slack", description: "Escalation alerts and handoffs", icon: Hash },
  {
    name: "Voice Gateway",
    description: "SIP routing and failover",
    icon: Mic2
  },
  {
    name: "Google Meet",
    description: "Meetings and call context",
    icon: Video
  },
  {
    name: "GitHub",
    description: "Deployments and CI/CD webhooks",
    icon: Github
  },
  {
    name: "Stripe",
    description: "Process payments and invoices",
    icon: CreditCard
  }
];
export function AnalyticsDashboard() {
  const [period, setPeriod] = useState("Month");
  const [filter, setFilter] = useState("All");
  const [toolsOpen, setToolsOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [enabled, setEnabled] = usePersistentState("integrations", [
    true,
    true,
    true,
    true,
    true,
    false
  ]);
  const { notify } = useUI();
  const exportReport = (name = `inference-${period.toLowerCase()}`) => {
    exportCsv(
      `${name}.csv`,
      ["Time", "Successful requests", "Cached requests", "Target capacity"],
      loadData[period].map((row) => [
        row.name,
        row.successful,
        row.cached,
        row.capacity
      ])
    );
    notify("Inference report exported.");
    setToolsOpen(false);
  };
  return createElement(Fragment, null, createElement(DashboardTitle, { title: "Analytics" }), createElement("div", { className: "mb-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4" }, createElement(
    TelemetryCard,
    {
      label: "Cache Hit Rate",
      value: "68.0%",
      badge: "Optimal",
      caption: "High efficiency",
      hint: "Response cache rate",
      color: "#0ac074"
    },
    createElement(MiniRing, { value: 68 })
  ), createElement(
    TelemetryCard,
    {
      label: "Active Sessions",
      value: "3,240",
      badge: "Live",
      caption: "High activity",
      hint: "Concurrent sessions",
      color: "#0bb197"
    },
    createElement(SparkBars, { values: [28, 44, 26, 52, 66] })
  ), createElement(
    TelemetryCard,
    {
      label: "Token Utilization",
      value: "74.0%",
      badge: "Steady",
      caption: "Normal usage",
      hint: "Context window load",
      color: "#4aa3ff"
    },
    createElement(MiniRing, { value: 74, color: "#4aa3ff" })
  ), createElement(
    TelemetryCard,
    {
      label: "Token Spend",
      value: "$89.25K",
      badge: "Budget",
      caption: "Cost managed",
      hint: "API spend",
      color: "#e9a31b"
    },
    createElement(SparkBars, { color: "#fcb92c", values: [46, 32, 58, 44, 75] })
  )), createElement("div", { className: "mb-6 grid gap-6 lg:grid-cols-3" }, createElement(Card, { className: "lg:col-span-2" }, createElement(
    CardHeader,
    {
      title: "Inference Load",
      subtitle: "Successful vs cached requests against capacity",
      action: createElement("div", { className: "flex items-center gap-2" }, createElement("div", { className: "inline-flex rounded-full border border-ui p-0.5" }, ["Today", "Week", "Month"].map((value) => createElement(
        "button",
        {
          key: value,
          onClick: () => setPeriod(value),
          "aria-pressed": period === value,
          className: `rounded-full px-3 py-1 text-[10px] font-medium ${period === value ? "bg-brand/10 text-brand" : "hover:bg-[var(--panel-2)]"}`
        },
        value
      ))), createElement("div", { className: "relative" }, createElement(
        "button",
        {
          "aria-label": "Report actions",
          "aria-expanded": toolsOpen,
          onClick: () => setToolsOpen((value) => !value),
          className: "rounded p-1 text-muted hover:text-brand"
        },
        createElement(MoreHorizontal, { size: 15 })
      ), toolsOpen ? createElement("div", { className: "surface absolute end-0 top-7 z-10 w-40 rounded-md p-1" }, createElement(
        "button",
        {
          className: "flex w-full items-center gap-2 rounded p-2.5 text-xs hover:bg-[var(--panel-2)]",
          onClick: () => exportReport()
        },
        createElement(Download, { size: 13 }),
        "Export CSV"
      ), createElement(
        "button",
        {
          className: "flex w-full items-center gap-2 rounded p-2.5 text-xs hover:bg-[var(--panel-2)]",
          onClick: () => {
            setReportOpen(true);
            setToolsOpen(false);
          }
        },
        createElement(Plus, { size: 13 }),
        "New report"
      )) : null))
    }
  ), createElement("div", { className: "p-5" }, createElement(InferenceChart, { data: loadData[period] }))), createElement(Card, null, createElement(
    CardHeader,
    {
      title: "Top Countries",
      subtitle: "Geographic request volume",
      action: createElement(
        Info,
        {
          size: 15,
          className: "text-muted",
          "aria-label": "Request distribution by country"
        }
      )
    }
  ), createElement("div", { className: "p-5" }, createElement(
    DonutChart,
    {
      height: 215,
      totalLabel: "10.2K",
      percentages: true,
      data: [
        { name: "United States", value: 5304 },
        { name: "Italy", value: 2856 },
        { name: "Other", value: 2040 }
      ]
    }
  )))), createElement("div", { className: "grid gap-6 lg:grid-cols-2" }, createElement(Card, null, createElement(
    CardHeader,
    {
      title: "Most Called Agents",
      subtitle: "Top performing agents by call volume and rating."
    }
  ), createElement("div", { className: "p-2" }, agentRows.map((agent) => createElement(
    "div",
    {
      key: agent.name,
      className: "flex items-center gap-3 rounded-md px-3 py-3 hover:bg-[var(--panel-2)]"
    },
    createElement(
      "span",
      {
        className: "grid size-8 shrink-0 place-items-center rounded-full text-[10px] font-semibold",
        style: { color: agent.color, background: `${agent.color}15` }
      },
      agent.initials
    ),
    createElement("div", { className: "min-w-0" }, createElement("p", { className: "truncate text-sm font-medium" }, agent.name), createElement("p", { className: "mt-0.5 flex items-center gap-2 text-[11px] text-muted" }, createElement(
      "i",
      {
        className: `size-1.5 rounded-full ${agent.status === "Active" ? "bg-success" : agent.status === "Away" ? "bg-warning" : "bg-[var(--muted)]"}`
      }
    ), agent.status, createElement("span", null, "\xB7"), agent.rating, "% Satisf.")),
    createElement("div", { className: "ms-auto shrink-0 text-end" }, createElement("p", { className: "text-xs font-semibold" }, agent.calls.toLocaleString(), " calls"), createElement("div", { className: "mt-1 h-1 w-16 rounded-full bg-[var(--panel-2)]" }, createElement(
      "div",
      {
        className: "h-full rounded-full",
        style: {
          background: agent.color,
          width: `${agent.calls / 7420 * 100}%`
        }
      }
    )))
  )))), createElement(Card, null, createElement(
    CardHeader,
    {
      title: "Integrations",
      subtitle: "Manage third-party services and webhooks.",
      action: createElement(
        Tabs,
        {
          options: ["All", "Connected", "Available"],
          value: filter,
          onChange: setFilter
        }
      )
    }
  ), createElement("div", { className: "px-5" }, filter === "Available" && enabled.every(Boolean) || filter === "Connected" && enabled.every((value) => !value) ? createElement(
    EmptyState,
    {
      title: "No integrations",
      description: "Choose another filter to see your integrations."
    }
  ) : null, integrations.map(
    (integration, index) => filter === "Connected" && !enabled[index] || filter === "Available" && enabled[index] ? null : createElement(
      "div",
      {
        key: integration.name,
        className: "flex items-center gap-3 border-b border-ui py-3 last:border-0"
      },
      createElement("span", { className: "grid size-9 shrink-0 place-items-center rounded-md border border-ui bg-[var(--panel-2)]" }, createElement(
        integration.icon,
        {
          size: 19,
          className: index === 1 || index === 3 ? "text-info" : "text-[var(--text)]"
        }
      )),
      createElement("div", { className: "min-w-0" }, createElement("p", { className: "flex flex-wrap items-center gap-2 text-sm" }, createElement("span", { className: "font-medium" }, integration.name), createElement(
        "span",
        {
          className: `text-[11px] ${enabled[index] ? "text-success" : "text-muted"}`
        },
        "\u2022 ",
        enabled[index] ? "Active" : "Inactive"
      )), createElement("p", { className: "truncate text-[10px] text-muted" }, integration.description)),
      createElement("div", { className: "ms-auto" }, createElement(
        Toggle,
        {
          label: `${enabled[index] ? "Disable" : "Enable"} ${integration.name}`,
          checked: enabled[index],
          onChange: (checked) => {
            setEnabled(
              (values) => values.map(
                (value, position) => position === index ? checked : value
              )
            );
            notify(
              `${integration.name} ${checked ? "enabled" : "disabled"} in this workspace.`
            );
          }
        }
      ))
    )
  )))), reportOpen ? createElement(
    RecordEditor,
    {
      title: "New report",
      description: `Export the current ${period.toLowerCase()} inference data.`,
      fields: [
        {
          name: "name",
          label: "Report name",
          initial: "Inference load report"
        }
      ],
      submitLabel: "Create & export",
      onClose: () => setReportOpen(false),
      onSubmit: (values) => {
        exportReport(
          values.name.replace(/[^a-zA-Z0-9_-]/g, "-") || "inference-report"
        );
        setReportOpen(false);
      }
    }
  ) : null);
}
