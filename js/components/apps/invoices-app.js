import { createElement, Fragment } from '../../runtime/dom.js';
import { appConfig } from "../../config/app.js";
import { useState } from "../../runtime/dom.js";
import { Check, Download, Pencil, Plus, Search } from "../../vendor/icons.js";
import { Badge, Button, Card, PageHeader } from "../primitives.js";
import { EmptyState } from "../interactions.js";
import { InvoiceEditor } from "../catalog-editors.js";
import { useUI } from "../ui-provider.js";
import {
  usePersistentState,
  downloadText,
  exportCsv
} from "../../lib/client-store.js";
import { initialInvoices, money } from "../../lib/records.js";
export function InvoicesApp() {
  const [invoices, setInvoices] = usePersistentState(
    "invoices",
    initialInvoices
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [editor, setEditor] = useState(null);
  const { notify } = useUI();
  const filtered = invoices.filter(
    (invoice) => `${invoice.id} ${invoice.client}`.toLowerCase().includes(query.toLowerCase()) && (status === "All statuses" || invoice.status === status)
  );
  const outstanding = invoices.filter((invoice) => invoice.status !== "Paid").reduce((sum, invoice) => sum + invoice.amount, 0);
  const paid = invoices.filter((invoice) => invoice.status === "Paid").reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdue = invoices.filter((invoice) => invoice.status === "Overdue").reduce((sum, invoice) => sum + invoice.amount, 0);
  return createElement(Fragment, null, createElement(
    PageHeader,
    {
      title: "Invoices",
      description: "Client invoices and settlement status.",
      actions: createElement(Fragment, null, createElement(
        Button,
        {
          variant: "secondary",
          onClick: () => exportCsv(
            "invoices.csv",
            ["Invoice", "Client", "Date", "Amount", "Status"],
            filtered.map((invoice) => [
              invoice.id,
              invoice.client,
              invoice.date,
              invoice.amount,
              invoice.status
            ])
          )
        },
        createElement(Download, { size: 14 }),
        "Export"
      ), createElement(Button, { onClick: () => setEditor("new") }, createElement(Plus, { size: 14 }), "Create invoice"))
    }
  ), createElement("div", { className: "mb-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4" }, [
    ["Outstanding", money(outstanding), "warning"],
    ["Paid", money(paid), "success"],
    ["Overdue", money(overdue), "danger"],
    ["Invoices", String(invoices.length), "brand"]
  ].map(([label, value, tone]) => createElement(Card, { key: label, className: "p-5" }, createElement("p", { className: "text-xs text-muted" }, label), createElement("p", { className: "mt-3 text-2xl font-semibold" }, value), createElement("div", { className: "mt-3" }, createElement(Badge, { tone }, label === "Invoices" ? "All clients" : "Current balance"))))), createElement(Card, null, createElement("div", { className: "flex flex-wrap gap-3 border-b border-ui p-4" }, createElement("div", { className: "relative min-w-40 flex-1" }, createElement(Search, { size: 16, className: "absolute start-3 top-3 text-muted" }), createElement(
    "input",
    {
      "aria-label": "Search invoices",
      className: "field ps-9",
      placeholder: "Search invoice or client...",
      value: query,
      onChange: (event) => setQuery(event.target.value)
    }
  )), createElement(
    "select",
    {
      "aria-label": "Invoice status",
      className: "field w-auto",
      value: status,
      onChange: (event) => setStatus(event.target.value)
    },
    ["All statuses", "Paid", "Pending", "Overdue"].map((value) => createElement("option", { key: value }, value))
  )), createElement("div", { className: "overflow-x-auto" }, createElement("table", { className: "table-ui min-w-[740px]" }, createElement("thead", null, createElement("tr", null, [
    "Invoice",
    "Client",
    "Date",
    "Amount",
    "Status",
    "Actions"
  ].map((header) => createElement("th", { key: header }, header)))), createElement("tbody", null, filtered.map((invoice) => createElement("tr", { key: invoice.id }, createElement("td", { className: "font-medium" }, invoice.id), createElement("td", null, invoice.client), createElement("td", { className: "text-xs text-muted" }, invoice.date), createElement("td", { className: "font-semibold" }, money(invoice.amount)), createElement("td", null, createElement(
    Badge,
    {
      tone: invoice.status === "Paid" ? "success" : invoice.status === "Pending" ? "warning" : "danger"
    },
    invoice.status
  )), createElement("td", null, createElement("div", { className: "flex gap-1" }, createElement(
    "button",
    {
      "aria-label": `Edit ${invoice.id}`,
      className: "p-1.5 text-muted hover:text-brand",
      onClick: () => setEditor(invoice)
    },
    createElement(Pencil, { size: 14 })
  ), createElement(
    "button",
    {
      "aria-label": `Download ${invoice.id}`,
      className: "p-1.5 text-muted hover:text-brand",
      onClick: () => downloadText(
        `${invoice.id}.txt`,
        [
          `${appConfig.name} Invoice`,
          invoice.id,
          `Client: ${invoice.client}`,
          `Date: ${invoice.date}`,
          `Amount: ${money(invoice.amount)}`,
          `Status: ${invoice.status}`
        ].join("\n")
      )
    },
    createElement(Download, { size: 14 })
  ), invoice.status !== "Paid" ? createElement(
    "button",
    {
      "aria-label": `Mark ${invoice.id} paid`,
      title: "Mark paid",
      className: "p-1.5 text-muted hover:text-success",
      onClick: () => {
        setInvoices(
          (items) => items.map(
            (item) => item.id === invoice.id ? { ...item, status: "Paid" } : item
          )
        );
        notify(`${invoice.id} marked paid.`);
      }
    },
    createElement(Check, { size: 15 })
  ) : null)))))), !filtered.length ? createElement(EmptyState, { description: "No invoices match these filters." }) : null)), editor ? createElement(
    InvoiceEditor,
    {
      invoice: editor === "new" ? void 0 : editor,
      onClose: () => setEditor(null)
    }
  ) : null);
}
