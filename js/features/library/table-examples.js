import { createElement, Fragment } from '../../runtime/dom.js';
import { useMemo, useState } from "../../runtime/dom.js";
import { DataTable } from "../../components/data/data-table.js";
import { Card, Badge, Button } from "../../components/primitives.js";
import { useI18n } from "../../i18n/provider.js";
import { ExampleFrame } from "./example-frame.js";
const rows = Array.from({ length: 36 }, (_, index) => ({
  id: `EX-${String(index + 1).padStart(3, "0")}`,
  name: [
    "Demo Asha",
    "Demo Arjun",
    "Demo Mira",
    "Demo Ravi",
    "Demo Anika",
    "Demo Kabir"
  ][index % 6] + ` ${index + 1}`,
  team: ["Operations", "Finance", "Support"][index % 3],
  status: ["Active", "Pending", "Inactive"][index % 3],
  email: `demo${index + 1}@example.com`,
  city: ["Kolkata", "Mumbai", "Delhi"][index % 3],
  amount: 2400 + index * 375,
  createdAt: "2026-10-03"
}));
export function TableExamples({ variant }) {
  const { t, currency, number } = useI18n();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [descending, setDescending] = useState(false);
  const columns = useMemo(
    () => [
      { accessorKey: "name", header: t("Name") },
      { accessorKey: "team", header: t("Team") },
      { accessorKey: "email", header: t("Email") },
      {
        accessorKey: "status",
        header: t("Status"),
        cell: ({ row }) => createElement(
          Badge,
          {
            tone: row.original.status === "Active" ? "success" : "warning"
          },
          row.original.status
        )
      },
      {
        accessorKey: "amount",
        header: t("Amount"),
        cell: ({ row }) => currency(row.original.amount)
      }
    ],
    [t, currency]
  );
  const filtered = rows.filter(
    (row) => (!status || row.status === status) && Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => descending ? b.amount - a.amount : a.amount - b.amount);
  const advanced = ["advanced", "expandable"].includes(variant);
  return createElement(
    ExampleFrame,
    {
      category: "tables",
      variant,
      source: advanced ? 'import { DataTable } from "../../components/data/data-table.js";\n\n<DataTable data={records} columns={columns} storageKey="my-table" />' : `import { TableExamples } from "./table-examples.js";

<TableExamples variant="${variant}" />
// Replace DemoRow, rows and columns with your record model.`
    },
    advanced ? createElement(Fragment, null, createElement("p", { className: "mb-3 text-xs text-muted" }, t(
      variant === "expandable" ? "Use the row arrow to expand its details." : "Shift-click headers to sort by multiple columns."
    )), createElement(
      DataTable,
      {
        data: rows,
        columns,
        storageKey: `library-${variant}`
      }
    )) : createElement(
      Card,
      {
        className: `library-table library-table-${variant} overflow-hidden`
      },
      createElement("div", { className: "flex flex-wrap gap-3 border-b border-ui p-4" }, createElement("label", { className: "min-w-0 flex-1" }, createElement("span", { className: "sr-only" }, t("Search")), createElement(
        "input",
        {
          className: "field",
          value: search,
          onChange: (event) => {
            setSearch(event.target.value);
            setPage(0);
          },
          placeholder: t("Search")
        }
      )), createElement("label", null, createElement("span", { className: "sr-only" }, t("Status")), createElement(
        "select",
        {
          className: "field",
          value: status,
          onChange: (event) => {
            setStatus(event.target.value);
            setPage(0);
          }
        },
        createElement("option", { value: "" }, t("All")),
        ["Active", "Pending", "Inactive"].map((value) => createElement("option", { key: value, value }, t(value)))
      ))),
      createElement("div", { className: "overflow-x-auto" }, createElement("table", { className: "w-full text-start text-xs" }, createElement("caption", { className: "sr-only" }, t("Table Examples")), createElement("thead", { className: "bg-[var(--panel-2)] text-muted" }, createElement("tr", null, ["ID", "Name", "Team", "Status"].map((header) => createElement(
        "th",
        {
          key: header,
          scope: "col",
          className: "whitespace-nowrap px-5 py-3 text-start font-medium"
        },
        t(header)
      )), createElement("th", { scope: "col", className: "px-5 py-3 text-end" }, createElement(
        "button",
        {
          onClick: () => setDescending((value) => !value),
          "aria-label": t("Sort by amount")
        },
        t("Amount"),
        " ",
        descending ? "\u2193" : "\u2191"
      )))), createElement("tbody", null, filtered.slice(page * 8, page * 8 + 8).map((row) => createElement(
        "tr",
        {
          key: row.id,
          className: "border-t border-ui hover:bg-brand/5"
        },
        createElement("td", { className: "whitespace-nowrap px-5 py-4 text-muted" }, row.id),
        createElement("td", { className: "whitespace-nowrap px-5 py-4 font-medium" }, row.name),
        createElement("td", { className: "px-5 py-4" }, t(row.team)),
        createElement("td", { className: "px-5 py-4" }, createElement(
          Badge,
          {
            tone: row.status === "Active" ? "success" : "warning"
          },
          row.status
        )),
        createElement("td", { className: "whitespace-nowrap px-5 py-4 text-end" }, currency(row.amount))
      )))), !filtered.length && createElement("p", { className: "p-8 text-center text-xs text-muted" }, t("No results"))),
      createElement("div", { className: "flex flex-wrap items-center justify-between gap-3 border-t border-ui p-4 text-xs" }, createElement("span", null, number(filtered.length), " ", t("Total"), " \xB7 ", t("Page"), " ", number(page + 1)), createElement("div", { className: "flex gap-2" }, createElement(
        Button,
        {
          variant: "secondary",
          disabled: !page,
          onClick: () => setPage((value) => value - 1)
        },
        t("Previous")
      ), createElement(
        Button,
        {
          variant: "secondary",
          disabled: (page + 1) * 8 >= filtered.length,
          onClick: () => setPage((value) => value + 1)
        },
        t("Next")
      )))
    )
  );
}
