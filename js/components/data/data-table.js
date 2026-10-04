import { createElement, Fragment } from '../../runtime/dom.js';
import { useMemo, useState, useEffect, useRef } from "../../runtime/dom.js";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  useReactTable
} from "../../vendor/table.js";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Download,
  SlidersHorizontal,
  Search,
  ChevronDown,
  ChevronRight
} from "../../vendor/icons.js";
import { useI18n } from "../../i18n/provider.js";
import { exportCsv, usePersistentState } from "../../lib/client-store.js";
import { useUI } from "../ui-provider.js";
import { Button } from "../primitives.js";
import { DataEmptyState, TableSkeleton, ErrorState } from "./states.js";
function Checkbox({
  checked,
  mixed,
  label,
  onChange
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!mixed;
  }, [mixed]);
  return createElement(
    "input",
    {
      ref,
      type: "checkbox",
      "aria-label": label,
      checked,
      onChange
    }
  );
}
export function DataTable({
  data,
  columns,
  storageKey,
  loading = false,
  error,
  retry = () => {
  },
  onView,
  onDelete
}) {
  const { t, number } = useI18n();
  const { notify, direction } = useUI();
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [sorting, setSorting] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selection, setSelection] = useState({});
  const [visibility, setVisibility] = useState({});
  const [pin, setPin] = useState(false);
  const [views, setViews] = usePersistentState(
    "views:" + storageKey,
    []
  );
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search), 200);
    return () => clearTimeout(timer);
  }, [search]);
  const tableColumns = useMemo(
    () => [
      {
        id: "select",
        size: 46,
        minSize: 46,
        maxSize: 46,
        enableSorting: false,
        enableColumnFilter: false,
        enableHiding: false,
        header: ({ table: table2 }) => createElement(
          Checkbox,
          {
            label: t("Select all"),
            checked: table2.getIsAllPageRowsSelected(),
            mixed: table2.getIsSomePageRowsSelected(),
            onChange: () => table2.toggleAllPageRowsSelected()
          }
        ),
        cell: ({ row }) => createElement(
          Checkbox,
          {
            label: t("Selected") + " " + row.original.name,
            checked: row.getIsSelected(),
            onChange: () => row.toggleSelected()
          }
        )
      },
      ...columns,
      {
        id: "actions",
        size: 118,
        enableSorting: false,
        enableColumnFilter: false,
        header: t("Actions"),
        cell: ({ row }) => createElement("div", { className: "flex items-center gap-1" }, createElement(
          Button,
          {
            variant: "ghost",
            "aria-label": t("Details") + " " + row.original.name,
            onClick: () => row.toggleExpanded()
          },
          row.getIsExpanded() ? createElement(ChevronDown, { size: 14 }) : createElement(ChevronRight, { size: 14 })
        ), onView && createElement(Button, { variant: "ghost", onClick: () => onView(row.original) }, t("View")))
      }
    ],
    [columns, t, onView]
  );
  const table = useReactTable({
    data,
    columns: tableColumns,
    getRowId: (row) => row.id,
    state: {
      sorting,
      columnFilters: filters,
      globalFilter: debounced,
      rowSelection: selection,
      columnVisibility: visibility
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setFilters,
    onGlobalFilterChange: setDebounced,
    onRowSelectionChange: setSelection,
    onColumnVisibilityChange: setVisibility,
    globalFilterFn: (row, _columnId, value) => Object.values(row.original).join(" ").toLowerCase().includes(value.toLowerCase()),
    enableRowSelection: true,
    enableMultiSort: true,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    columnResizeDirection: direction,
    getRowCanExpand: () => true,
    defaultColumn: {
      minSize: 80,
      size: 160,
      filterFn: (row, id, value) => {
        const cell = row.getValue(id);
        if (!value) return true;
        const match = value.match(/^(>=|<=|>|<)\s*(\d+(?:\.\d+)?)/);
        if (match) {
          const a = Number(cell), b = Number(match[2]);
          return match[1] === ">=" ? a >= b : match[1] === "<=" ? a <= b : match[1] === ">" ? a > b : a < b;
        }
        return String(cell).toLowerCase().includes(value.toLowerCase());
      }
    },
    initialState: { pagination: { pageSize: 10 } },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel()
  });
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const exportRows = () => table.getFilteredRowModel().rows;
  const exportColumns = () => table.getVisibleLeafColumns().filter((col) => !["select", "actions"].includes(col.id));
  const exportData = () => exportCsv(
    storageKey.replaceAll("/", "-") + ".csv",
    exportColumns().map(
      (col) => typeof col.columnDef.header === "string" ? col.columnDef.header : col.id
    ),
    exportRows().map(
      (row) => exportColumns().map((col) => String(row.getValue(col.id) ?? ""))
    )
  );
  if (error) return createElement(ErrorState, { message: error, retry });
  if (loading) return createElement(TableSkeleton, null);
  return createElement("div", { className: "surface overflow-hidden" }, createElement("div", { className: "flex flex-wrap items-center gap-2 border-b border-ui p-4" }, createElement("label", { className: "relative min-w-0 flex-1 basis-48" }, createElement(Search, { size: 15, className: "absolute start-3 top-3 text-muted" }), createElement(
    "input",
    {
      className: "field ps-9",
      "aria-label": t("Search"),
      placeholder: t("Search"),
      value: search,
      onChange: (event) => setSearch(event.target.value)
    }
  )), createElement("details", { className: "relative" }, createElement("summary", { className: "flex cursor-pointer items-center gap-2 rounded border border-ui px-3 py-2 text-xs" }, createElement(SlidersHorizontal, { size: 14 }), t("Columns")), createElement("div", { className: "surface absolute end-0 top-10 z-20 min-w-48 space-y-2 p-3" }, table.getAllLeafColumns().filter((col) => col.getCanHide()).map((col) => createElement("label", { key: col.id, className: "flex items-center gap-2 text-xs" }, createElement(
    "input",
    {
      type: "checkbox",
      checked: col.getIsVisible(),
      onChange: col.getToggleVisibilityHandler()
    }
  ), typeof col.columnDef.header === "string" ? col.columnDef.header : col.id)), createElement("label", { className: "flex items-center gap-2 border-t border-ui pt-2 text-xs" }, createElement(
    "input",
    {
      type: "checkbox",
      checked: pin,
      onChange: (e) => setPin(e.target.checked)
    }
  ), t("Pin first column")))), createElement(Button, { variant: "secondary", onClick: exportData }, createElement(Download, { size: 14 }), t("Export CSV")), createElement(
    Button,
    {
      variant: "ghost",
      onClick: () => {
        setSearch("");
        setFilters([]);
        setSorting([]);
        setSelection({});
      }
    },
    t("Reset filters")
  ), createElement(
    Button,
    {
      variant: "ghost",
      onClick: () => {
        const name = window.prompt(t("Name"));
        if (name?.trim())
          setViews((prev) => [
            ...prev.filter((view) => view.name !== name),
            { name: name.trim(), search, filters, sorting, visibility }
          ]);
      }
    },
    t("Save view")
  ), views.length > 0 && createElement(
    "select",
    {
      "aria-label": t("Saved views"),
      className: "field !w-auto",
      value: "",
      onChange: (event) => {
        const view = views.find(
          (view2) => view2.name === event.target.value
        );
        if (view) {
          setSearch(view.search);
          setFilters(view.filters);
          setSorting(view.sorting);
          setVisibility(view.visibility);
        }
      }
    },
    createElement("option", { value: "" }, t("Saved views")),
    views.map((view) => createElement("option", { key: view.name }, view.name))
  )), (filters.length > 0 || selectedRows.length > 0) && createElement("div", { className: "flex flex-wrap items-center gap-2 border-b border-ui px-4 py-3 text-xs" }, filters.map((filter) => createElement(
    Button,
    {
      key: filter.id,
      variant: "secondary",
      onClick: () => table.getColumn(filter.id)?.setFilterValue(void 0)
    },
    filter.id,
    ": ",
    String(filter.value),
    " \xD7"
  )), selectedRows.length > 0 && createElement(Fragment, null, createElement("span", null, number(selectedRows.length), " ", t("Selected")), createElement(
    Button,
    {
      variant: "secondary",
      onClick: async () => {
        try {
          await navigator.clipboard.writeText(
            selectedRows.map(
              (row) => exportColumns().map((col) => String(row.getValue(col.id) ?? "")).join("	")
            ).join("\n")
          );
          notify(t("Copied"));
        } catch {
          notify(t("Copy failed"), "error");
        }
      }
    },
    t("Copy selected")
  ), onDelete && createElement(
    Button,
    {
      variant: "danger",
      onClick: () => onDelete(selectedRows.map((row) => row.id))
    },
    t("Delete")
  ))), createElement("div", { className: "thin-scrollbar max-h-[650px] overflow-auto" }, createElement(
    "table",
    {
      className: "table-ui enterprise-table",
      style: { width: table.getTotalSize(), minWidth: "100%" }
    },
    createElement("thead", null, table.getHeaderGroups().map((group) => createElement("tr", { key: group.id }, group.headers.map((header, index) => createElement(
      "th",
      {
        key: header.id,
        style: { width: header.getSize() },
        className: pin && index === 0 ? "pinned" : ""
      },
      createElement("div", { className: "relative" }, createElement(
        "button",
        {
          disabled: !header.column.getCanSort(),
          onClick: header.column.getToggleSortingHandler(),
          className: "flex w-full items-center gap-1 text-start",
          "aria-label": t("Sort") + " " + header.column.id
        },
        flexRender(
          header.column.columnDef.header,
          header.getContext()
        ),
        header.column.getCanSort() && (header.column.getIsSorted() === "asc" ? createElement(ArrowUp, { size: 12 }) : header.column.getIsSorted() === "desc" ? createElement(ArrowDown, { size: 12 }) : createElement(ChevronsUpDown, { size: 12 }))
      ), header.column.getCanFilter() && createElement(
        "input",
        {
          className: "mt-2 rounded border border-ui bg-[var(--panel)] px-2 py-1 text-[10px] normal-case",
          "aria-label": t("Filters") + " " + header.column.id,
          placeholder: t("Filters"),
          value: String(header.column.getFilterValue() ?? ""),
          onChange: (event) => header.column.setFilterValue(event.target.value)
        }
      )),
      header.column.getCanResize() && createElement(
        "div",
        {
          className: "resizer",
          onMouseDown: header.getResizeHandler(),
          onTouchStart: header.getResizeHandler(),
          onDoubleClick: () => header.column.resetSize()
        }
      )
    ))))),
    createElement("tbody", null, table.getRowModel().rows.map((row) => createElement(TableRow, { key: row.id, row, pin, t })))
  ), !table.getRowModel().rows.length && createElement(DataEmptyState, null)), createElement("div", { className: "flex flex-wrap items-center justify-between gap-3 border-t border-ui p-4 text-xs" }, createElement("span", null, number(table.getFilteredRowModel().rows.length), " ", t("Total"), " \xB7", " ", t("Page"), " ", number(table.getState().pagination.pageIndex + 1), " ", t("of"), " ", number(Math.max(1, table.getPageCount()))), createElement("label", { className: "flex items-center gap-2" }, t("Rows per page"), createElement(
    "select",
    {
      className: "rounded border border-ui bg-[var(--panel)] p-1",
      value: table.getState().pagination.pageSize,
      onChange: (event) => table.setPageSize(Number(event.target.value))
    },
    [5, 10, 20, 50].map((value) => createElement("option", { key: value }, value))
  )), createElement("div", { className: "flex gap-2" }, createElement(
    Button,
    {
      variant: "secondary",
      disabled: !table.getCanPreviousPage(),
      onClick: () => table.previousPage()
    },
    t("Previous")
  ), createElement(
    Button,
    {
      variant: "secondary",
      disabled: !table.getCanNextPage(),
      onClick: () => table.nextPage()
    },
    t("Next")
  ))));
}
function TableRow({
  row,
  pin,
  t
}) {
  return createElement(Fragment, null, createElement("tr", { "data-selected": row.getIsSelected() }, row.getVisibleCells().map((cell, index) => createElement("td", { key: cell.id, className: pin && index === 0 ? "pinned" : "" }, flexRender(cell.column.columnDef.cell, cell.getContext())))), row.getIsExpanded() && createElement("tr", null, createElement("td", { colSpan: row.getVisibleCells().length }, createElement("dl", { className: "grid max-w-4xl gap-3 whitespace-normal sm:grid-cols-3" }, Object.entries(row.original).filter(([key]) => key !== "media").map(([key, value]) => createElement("div", { key }, createElement("dt", { className: "text-xs text-muted" }, t(
    key === "id" ? "ID" : key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (char) => char.toUpperCase())
  )), createElement("dd", { className: "break-words text-sm" }, typeof value === "boolean" ? t(value ? "Yes" : "No") : String(value))))))));
}
