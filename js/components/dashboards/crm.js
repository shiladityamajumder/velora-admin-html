import { createElement, Fragment } from '../../runtime/dom.js';
import { useState } from "../../runtime/dom.js";
import {
  BriefcaseBusiness,
  Pencil,
  Plus,
  Target,
  Users,
  WalletCards
} from "../../vendor/icons.js";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  Progress,
  StatCard
} from "../primitives.js";
import { TrendAreaChart } from "../charts.js";
import { EmptyState } from "../interactions.js";
import { RecordEditor, CsvImporter } from "../record-editor.js";
import { useUI } from "../ui-provider.js";
import { usePersistentState } from "../../lib/client-store.js";
import { money, numberFromInput } from "../../lib/records.js";
import { crmDeals } from "../../lib/mock-data.js";
import { DashboardTitle, Tabs } from "./shared.js";
export function CrmDashboard() {
  const [deals, setDeals] = usePersistentState("deals", crmDeals);
  const [editor, setEditor] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [period, setPeriod] = useState("Month");
  const { notify } = useUI();
  const revenue = [
    70,
    38,
    50,
    43,
    90,
    52,
    58,
    60,
    35,
    42,
    20,
    50,
    50,
    48,
    85
  ].map((value, index) => ({
    name: `W${index + 1}`,
    value: period === "Month" ? value : Math.round(value * 0.72),
    secondary: [30, 45, 28, 28, 29, 42, 38, 45, 48, 51, 90, 42, 42, 48, 64][index]
  }));
  return createElement(Fragment, null, createElement(DashboardTitle, { title: "CRM" }), createElement("div", { className: "mb-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4" }, createElement(
    StatCard,
    {
      label: "TOTAL DEALS",
      value: "842",
      change: 18.5,
      hint: "vs. 710 last month",
      icon: createElement(BriefcaseBusiness, { size: 18 })
    }
  ), createElement(
    StatCard,
    {
      label: "NEW LEADS",
      value: "3,124",
      change: 12.4,
      hint: "vs. 2,780 last month",
      icon: createElement(Users, { size: 18 })
    }
  ), createElement(
    StatCard,
    {
      label: "WIN RATE",
      value: "24.6%",
      change: 4.5,
      hint: "Steady acceleration",
      icon: createElement(Target, { size: 18 })
    }
  ), createElement(
    StatCard,
    {
      label: "AVG DEAL SIZE",
      value: "$4,850",
      change: -1.2,
      hint: "vs. $4,910 last month",
      icon: createElement(WalletCards, { size: 18 })
    }
  )), createElement("div", { className: "mb-6 grid gap-6 lg:grid-cols-3" }, createElement(Card, { className: "lg:col-span-2" }, createElement(
    CardHeader,
    {
      title: "Revenue & Sales Pipeline",
      action: createElement(
        Tabs,
        {
          options: ["Week", "Month"],
          value: period,
          onChange: setPeriod
        }
      )
    }
  ), createElement("div", { className: "grid grid-cols-3 divide-x divide-[var(--line)] border-b border-ui bg-[var(--panel-2)] px-3 py-4 text-center" }, [
    ["$84,250", "Current Month", "text-brand"],
    ["$63,400", "Previous Month", "text-info"],
    ["+32.8%", "YoY Growth", "text-success"]
  ].map(([value, label, color]) => createElement("div", { key: label }, createElement("p", { className: `text-xl font-semibold ${color}` }, value), createElement("p", { className: "mt-1 text-[11px] text-muted" }, label)))), createElement("div", { className: "p-4" }, createElement(
    TrendAreaChart,
    {
      data: revenue,
      secondaryKey: "secondary",
      names: ["Current revenue", "Previous revenue"],
      height: 310,
      unit: "k"
    }
  ))), createElement(Card, null, createElement(CardHeader, { title: "Deals by Segment" }), createElement("div", { className: "p-6" }, createElement("div", { className: "relative mx-auto h-64 max-w-[280px]" }, createElement(
    "svg",
    {
      viewBox: "0 0 240 240",
      className: "h-full w-full -rotate-90",
      role: "img",
      "aria-label": "Enterprise 78%, Mid-market 65%, SMB 42%"
    },
    [
      { radius: 98, value: 78, color: "#28c78b" },
      { radius: 78, value: 65, color: "#ffc14c" },
      { radius: 58, value: 42, color: "#ff3d60" }
    ].map((ring) => createElement("g", { key: ring.radius }, createElement(
      "circle",
      {
        cx: "120",
        cy: "120",
        r: ring.radius,
        fill: "none",
        stroke: "var(--line)",
        strokeWidth: "5"
      }
    ), createElement(
      "circle",
      {
        cx: "120",
        cy: "120",
        r: ring.radius,
        fill: "none",
        stroke: ring.color,
        strokeWidth: "6",
        strokeLinecap: "round",
        pathLength: "100",
        strokeDasharray: `${ring.value} 100`
      }
    )))
  ), createElement("div", { className: "absolute inset-0 grid place-items-center text-center" }, createElement("div", null, createElement("p", { className: "text-sm font-medium" }, "Total"), createElement("p", { className: "mt-1 text-xl font-semibold" }, "2,234")))), createElement("div", { className: "mt-8 flex flex-wrap justify-center gap-3 text-xs" }, [
    ["Enterprise", "#0bb197"],
    ["Mid-Market", "#fcb92c"],
    ["SMB", "#ff3d60"]
  ].map(([name, color]) => createElement("span", { key: name, className: "flex items-center gap-2" }, createElement(
    "i",
    {
      className: "size-2.5 rounded-full",
      style: { background: color }
    }
  ), name)))))), createElement(Card, null, createElement(
    CardHeader,
    {
      title: "Active Deals Pipeline",
      action: createElement("div", { className: "flex gap-2" }, createElement(Button, { variant: "secondary", onClick: () => setImportOpen(true) }, "Import leads"), createElement(Button, { onClick: () => setEditor("new") }, createElement(Plus, { size: 14 }), "New opportunity"))
    }
  ), createElement("div", { className: "overflow-x-auto" }, createElement("table", { className: "table-ui min-w-[760px]" }, createElement("thead", null, createElement("tr", null, [
    "Deal Name",
    "Owner",
    "Stage",
    "Value",
    "Confidence",
    "Status",
    "Actions"
  ].map((header) => createElement("th", { key: header }, header)))), createElement("tbody", null, deals.map((deal) => createElement("tr", { key: deal.company }, createElement("td", { className: "font-semibold" }, deal.company), createElement("td", null, deal.owner), createElement("td", null, createElement(Badge, { tone: "brand" }, deal.stage)), createElement("td", { className: "text-brand" }, deal.value), createElement("td", null, createElement("span", { className: "text-xs" }, deal.probability), createElement("div", { className: "mt-1 w-20" }, createElement(Progress, { value: parseFloat(deal.probability) }))), createElement("td", null, createElement(Badge, { tone: "success" }, "Active")), createElement("td", null, createElement(
    "button",
    {
      "aria-label": `Edit ${deal.company}`,
      onClick: () => setEditor(deal),
      className: "p-1.5 text-muted hover:text-brand"
    },
    createElement(Pencil, { size: 14 })
  )))))), !deals.length ? createElement(EmptyState, null) : null)), editor ? createElement(
    RecordEditor,
    {
      title: editor === "new" ? "New opportunity" : "Edit opportunity",
      onClose: () => setEditor(null),
      fields: [
        {
          name: "company",
          label: "Company",
          initial: editor === "new" ? "" : editor.company
        },
        {
          name: "owner",
          label: "Owner",
          initial: editor === "new" ? "" : editor.owner
        },
        {
          name: "value",
          label: "Value ($)",
          type: "number",
          min: 0,
          initial: editor === "new" ? "" : editor.value.replace(/[$,]/g, "")
        },
        {
          name: "stage",
          label: "Stage",
          options: [
            "Discovery",
            "Qualified",
            "Proposal",
            "Negotiation",
            "Closed Won"
          ],
          initial: editor === "new" ? "Discovery" : editor.stage
        },
        {
          name: "probability",
          label: "Probability (%)",
          type: "number",
          min: 0,
          max: 100,
          initial: editor === "new" ? 25 : parseFloat(editor.probability)
        }
      ],
      onSubmit: (values) => {
        if (deals.some(
          (deal) => deal.company === values.company && (editor === "new" || deal.company !== editor.company)
        ))
          throw new Error(
            "An opportunity for this company already exists."
          );
        const saved = {
          company: values.company,
          owner: values.owner,
          value: money(numberFromInput(values.value, "Value"), 0),
          stage: values.stage,
          probability: `${values.probability}%`
        };
        setDeals(
          (items) => editor === "new" ? [...items, saved] : items.map(
            (item) => item.company === editor.company ? saved : item
          )
        );
        setEditor(null);
        notify("Opportunity saved.");
      }
    }
  ) : null, importOpen ? createElement(
    CsvImporter,
    {
      title: "Import leads",
      headers: ["company", "owner", "value", "stage", "probability"],
      onClose: () => setImportOpen(false),
      onImport: (records) => {
        const rows = records.map((record) => {
          if (!record.company || !record.owner || !record.stage)
            throw new Error(
              "Company, owner and stage are required for each lead."
            );
          const probability = numberFromInput(
            record.probability.replace("%", ""),
            "Probability"
          );
          if (probability > 100)
            throw new Error("Probability cannot exceed 100%.");
          return {
            company: record.company,
            owner: record.owner,
            stage: record.stage,
            value: money(numberFromInput(record.value, "Value"), 0),
            probability: `${probability}%`
          };
        });
        if (new Set([...deals, ...rows].map((row) => row.company)).size !== deals.length + rows.length)
          throw new Error(
            "Duplicate company names were found. Please use unique company names."
          );
        setDeals((items) => [...items, ...rows]);
        return rows.length;
      }
    }
  ) : null);
}
