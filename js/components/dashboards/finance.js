import { createElement, Fragment } from '../../runtime/dom.js';
import { createId } from "../../lib/id.js";
import { useState } from "../../runtime/dom.js";
import {
  Activity,
  CircleDollarSign,
  CreditCard,
  Download,
  FileText,
  WalletCards
} from "../../vendor/icons.js";
import { Button, Card, CardHeader } from "../primitives.js";
import { CompactBarChart, DonutChart, SparkBars } from "../charts.js";
import { Modal } from "../interactions.js";
import { RecordEditor } from "../record-editor.js";
import { useUI } from "../ui-provider.js";
import {
  exportCsv,
  downloadText,
  usePersistentState
} from "../../lib/client-store.js";
import { money, localDate } from "../../lib/records.js";
import { transactions } from "../../lib/mock-data.js";
import { StatusBadge, DashboardTitle, Tabs } from "./shared.js";
export function FinanceDashboard() {
  const [rows, setRows] = usePersistentState("transactions", transactions);
  const [year, setYear] = useState("2026");
  const [allocationPeriod, setAllocationPeriod] = useState("Last Month");
  const [transferOpen, setTransferOpen] = useState(false);
  const [detail, setDetail] = useState(
    null
  );
  const { notify } = useUI();
  const factor = year === "2026" ? 1 : year === "2025" ? 0.83 : 0.69;
  const returns = [
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
    income: Math.round((40 + index * 5) * factor),
    expense: Math.round((25 + index * 2.5) * factor),
    profit: Math.round((14 + index * 2.5) * factor)
  }));
  const allocationFactor = allocationPeriod === "Last Month" ? 1 : 0.86;
  const allocation = [
    { name: "Equities", value: 154102 },
    { name: "Bonds", value: 102735 },
    { name: "Cash", value: 48613 },
    { name: "Real Estate", value: 37e3 }
  ].map((item) => ({
    ...item,
    value: Math.round(item.value * allocationFactor)
  }));
  return createElement(Fragment, null, createElement(DashboardTitle, { title: "Finance" }), createElement("div", { className: "mb-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4" }, [
    [
      "Net Revenue",
      "$128,420",
      "12.8% above plan",
      CircleDollarSign,
      "#0ac074"
    ],
    [
      "Total Expenses",
      "$14,860.00",
      "Increased spend",
      CreditCard,
      "#ff3d60"
    ],
    [
      "Investments",
      "$33,399.50",
      "Portfolio growth",
      Activity,
      "#0ac074"
    ],
    ["Total Savings", "$9,250.00", "On track", WalletCards, "#0ac074"]
  ].map(([label, value, hint, icon, color]) => {
    const Icon = icon;
    return createElement(Card, { key: String(label), className: "p-5" }, createElement("div", { className: "flex items-center gap-3" }, createElement("span", { className: "grid size-9 shrink-0 place-items-center rounded border border-ui" }, createElement(Icon, { size: 18 })), createElement("div", null, createElement("p", { className: "text-xs font-semibold" }, String(label)), createElement("p", { className: "mt-1 text-[11px] text-muted" }, String(hint)))), createElement("div", { className: "mt-5 flex items-end justify-between gap-2" }, createElement("p", { className: "text-xl font-semibold" }, String(value)), createElement(
      SparkBars,
      {
        compact: true,
        color: String(color),
        values: [25, 29, 36, 33, 40, 45, 39, 48, 60]
      }
    )));
  })), createElement("div", { className: "mb-6 grid gap-6 lg:grid-cols-3" }, createElement(Card, { className: "lg:col-span-2" }, createElement(
    CardHeader,
    {
      title: "Portfolio Returns",
      action: createElement(
        Tabs,
        {
          options: ["2024", "2025", "2026"],
          value: year,
          onChange: setYear
        }
      )
    }
  ), createElement("div", { className: "grid grid-cols-3 divide-x divide-[var(--line)] border-b border-ui p-5" }, [
    ["Total income", 78224.68, "#0ac074"],
    ["Total expenses", 8541, "#fcb92c"],
    ["Net profit", 25300, "#4aa3ff"]
  ].map(([label, value, color]) => createElement("div", { key: String(label), className: "px-3 first:ps-0" }, createElement("p", { className: "flex items-center gap-2 text-xs text-muted" }, createElement(
    "span",
    {
      className: "size-2 rounded-full",
      style: { background: String(color) }
    }
  ), String(label)), createElement("p", { className: "mt-2 text-lg font-semibold" }, money(Number(value) * factor))))), createElement("div", { className: "p-5" }, createElement(
    CompactBarChart,
    {
      data: returns,
      dataKey: "income",
      secondaryKey: "expense",
      tertiaryKey: "profit",
      names: ["Income", "Expenses", "Profit"]
    }
  ))), createElement(Card, null, createElement(
    CardHeader,
    {
      title: "Asset Allocation",
      action: createElement(
        "select",
        {
          "aria-label": "Allocation period",
          className: "field min-h-8 py-1 text-xs",
          value: allocationPeriod,
          onChange: (event) => setAllocationPeriod(event.target.value)
        },
        createElement("option", null, "Last Month"),
        createElement("option", null, "Last Quarter")
      )
    }
  ), createElement("div", { className: "p-5" }, createElement(
    DonutChart,
    {
      data: allocation,
      totalLabel: money(
        allocation.reduce((sum, item) => sum + item.value, 0),
        0
      ),
      centerLabel: "Portfolio",
      colors: ["#0bb197", "#45c3b2", "#81d8cd", "#b5e9e2"]
    }
  )))), createElement("div", { className: "grid gap-6 xl:grid-cols-[1fr_2.3fr]" }, createElement(Card, null, createElement(CardHeader, { title: "Market & Account Alerts" }), createElement("div", { className: "space-y-6 p-6" }, [
    [
      "Price alert triggered",
      "Apple Inc. crossed the $185.00 threshold.",
      "5 mins ago"
    ],
    [
      "Dividend payment received",
      "+$45.00 from Microsoft deposited.",
      "1 hour ago"
    ],
    [
      "Large transaction detected",
      "$10,000.00 wire to external brokerage.",
      "3 hours ago"
    ]
  ].map(([title, description, time], index) => createElement("div", { key: title, className: "flex gap-3" }, createElement(
    "span",
    {
      className: `grid size-8 shrink-0 place-items-center rounded-full ${index === 0 ? "bg-success/10 text-success" : index === 1 ? "bg-info/10 text-info" : "bg-warning/10 text-warning"}`
    },
    createElement(Activity, { size: 15 })
  ), createElement("div", null, createElement("p", { className: "text-sm font-medium" }, title), createElement("p", { className: "mt-1 text-xs text-muted" }, description), createElement("p", { className: "mt-1 text-[10px] text-muted" }, time))))), createElement("div", { className: "flex flex-wrap gap-2 px-5 pb-5" }, createElement(
    Button,
    {
      variant: "secondary",
      onClick: () => exportCsv(
        "statements.csv",
        ["Transaction", "Asset", "Date", "Type", "Amount", "Status"],
        rows.map((row) => [
          row.id,
          row.asset,
          row.date,
          row.type,
          row.amount,
          row.status
        ])
      )
    },
    createElement(Download, { size: 14 }),
    "Statements"
  ), createElement(Button, { onClick: () => setTransferOpen(true) }, "Transfer"))), createElement(Card, null, createElement(CardHeader, { title: "Recent Transactions" }), createElement("div", { className: "overflow-x-auto" }, createElement("table", { className: "table-ui min-w-[630px]" }, createElement("thead", null, createElement("tr", null, [
    "TX Hash",
    "Asset",
    "Date",
    "Type",
    "Amount",
    "Status",
    "Actions"
  ].map((header) => createElement("th", { key: header }, header)))), createElement("tbody", null, rows.map((row) => createElement("tr", { key: row.id }, createElement("td", { className: "font-medium" }, "#", row.id), createElement("td", null, row.asset), createElement("td", { className: "text-xs text-muted" }, row.date), createElement("td", null, row.type), createElement("td", { className: "font-semibold" }, row.amount), createElement("td", null, createElement(StatusBadge, { status: row.status })), createElement("td", null, createElement(
    "button",
    {
      "aria-label": `View transaction ${row.id}`,
      onClick: () => setDetail(row),
      className: "p-1.5 text-muted hover:text-brand"
    },
    createElement(FileText, { size: 15 })
  ))))))))), transferOpen ? createElement(
    RecordEditor,
    {
      title: "Record a transfer",
      description: "Add a transfer to the workspace ledger.",
      fields: [
        { name: "asset", label: "Recipient / account" },
        { name: "amount", label: "Amount ($)", type: "number", min: 0.01 },
        { name: "date", label: "Date", type: "date", initial: localDate() }
      ],
      onClose: () => setTransferOpen(false),
      onSubmit: (values) => {
        setRows((items) => [
          {
            id: `TX-${createId().slice(0, 8).toUpperCase()}`,
            asset: values.asset,
            date: values.date,
            type: "Transfer",
            amount: money(Number(values.amount)),
            status: "Pending"
          },
          ...items
        ]);
        setTransferOpen(false);
        notify("Transfer recorded as pending.");
      }
    }
  ) : null, detail ? createElement(
    Modal,
    {
      title: `Transaction ${detail.id}`,
      onClose: () => setDetail(null)
    },
    createElement("dl", { className: "space-y-3 text-sm" }, Object.entries(detail).map(([key, value]) => createElement("div", { key, className: "flex justify-between gap-4" }, createElement("dt", { className: "capitalize text-muted" }, key), createElement("dd", null, value)))),
    createElement("div", { className: "mt-6 flex flex-wrap justify-end gap-2" }, createElement(
      Button,
      {
        variant: "secondary",
        onClick: () => downloadText(
          `${detail.id}.txt`,
          Object.entries(detail).map(([key, value]) => `${key}: ${value}`).join("\n")
        )
      },
      createElement(Download, { size: 14 }),
      "Download"
    ), detail.status === "Pending" ? createElement(
      Button,
      {
        onClick: () => {
          setRows(
            (items) => items.map(
              (item) => item.id === detail.id ? { ...item, status: "Completed" } : item
            )
          );
          setDetail(null);
          notify("Transaction marked completed.");
        }
      },
      "Mark completed"
    ) : null)
  ) : null);
}
