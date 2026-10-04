import { createElement, Fragment } from '../../runtime/dom.js';
import { Link as Link } from "../../runtime/navigation.js";
import { useRouter } from "../../runtime/navigation.js";
import { useMemo, useState } from "../../runtime/dom.js";
import { Plus, Download, LayoutGrid, CalendarDays } from "../../vendor/icons.js";
import {
  modules
} from "../../config/modules.js";
import { serviceFor } from "../../services/modules.js";
import { useRepository } from "../../hooks/use-repository.js";
import { useAuth } from "../../hooks/use-auth.js";
import { useI18n } from "../../i18n/provider.js";
import { useUI } from "../../components/ui-provider.js";
import { ResponsiveFilters } from "../../components/data/responsive-filters.js";
import { DataTable } from "../../components/data/data-table.js";
import { Confirmation } from "../../components/data/confirmation.js";
import {
  LoadingState,
  ErrorState,
  DataEmptyState
} from "../../components/data/states.js";
import { Modal } from "../../components/interactions.js";
import { PageHeader, Button, Badge, Card } from "../../components/primitives.js";
import { RecordForm } from "./record-form.js";
import { RecordDetail } from "./record-detail.js";
import { PipelineBoard, AppointmentCalendar } from "./special-views.js";
import { availableStock, expirySeverity } from "../../lib/workflows.js";
import { Unauthorized } from "../../components/layout/access-guard.js";
import { CsvImporter } from "../../components/record-editor.js";
export function ModulePage({
  modulePath,
  recordId,
  action,
  view,
  initialStatus
}) {
  const definition = modules.find(
    (definition2) => definition2.path === modulePath
  );
  const service = serviceFor(definition);
  const { data, loading, error, reload } = useRepository(service);
  const { has } = useAuth();
  const { t, currency, date, number } = useI18n();
  const { notify } = useUI();
  const router = useRouter();
  const [editor, setEditor] = useState(
    action === "new" ? "new" : null
  );
  const [quick, setQuick] = useState(null);
  const [remove, setRemove] = useState([]);
  const [importOpen, setImportOpen] = useState(false);
  const [status, setStatus] = useState(initialStatus ?? "");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [mode, setMode] = useState(view ?? "list");
  const manage = definition.kind !== "movements" && has(definition.manage);
  const createPermission = definition.kind === "products" ? "products.create" : definition.kind === "customers" ? "customers.create" : definition.kind === "orders" ? "orders.create" : definition.manage;
  const canCreate = definition.kind !== "movements" && has(createPermission);
  const deletePermission = definition.kind === "products" ? "products.delete" : definition.kind === "customers" ? "customers.delete" : definition.manage;
  const canDelete = definition.kind !== "movements" && !definition.workflow && has(deletePermission);
  const record = recordId ? data.find((row) => row.id === recordId) : void 0;
  const filtered = data.filter(
    (row) => (!status || row.status === status) && (!from || String(row.date ?? row.createdAt).slice(0, 10) >= from) && (!to || String(row.date ?? row.createdAt).slice(0, 10) <= to) && (view !== "expiry" || expirySeverity(String(row.expiryDate)) !== "success") && (view !== "low-stock" || Number(row.quantity) < 50)
  );
  const columns = useMemo(() => {
    const keys = definition.kind === "products" ? ["sku", "category", "price", "stock"] : definition.kind === "inventory" ? ["warehouse", "quantity", "reserved", "expiryDate"] : definition.fields.filter(
      (field) => !["textarea", "media", "boolean"].includes(field.kind)
    ).slice(0, 4).map((field) => field.key);
    return [
      { accessorKey: "id", header: "ID", size: 140 },
      {
        accessorKey: "name",
        header: t("Name"),
        size: 250,
        cell: ({ row }) => createElement(
          Link,
          {
            className: "font-medium text-brand",
            href: `/${definition.path}/${row.id}`
          },
          row.original.name
        )
      },
      ...keys.map((key) => {
        const field = definition.fields.find((field2) => field2.key === key);
        return {
          accessorKey: key,
          header: t(field.label),
          size: field.kind === "currency" ? 140 : 165,
          cell: ({ row }) => field.kind === "currency" ? currency(Number(row.original[key])) : field.kind === "date" ? key === "expiryDate" ? createElement(Badge, { tone: expirySeverity(String(row.original[key])) }, date(String(row.original[key]))) : date(String(row.original[key])) : typeof row.original[key] === "number" ? number(Number(row.original[key])) : t(String(row.original[key]))
        };
      }),
      {
        accessorKey: "status",
        header: t("Status"),
        size: 155,
        cell: ({ row }) => createElement(StatusBadge, { status: row.original.status })
      },
      {
        accessorKey: "createdAt",
        header: t("Date"),
        size: 160,
        cell: ({ row }) => date(row.original.createdAt)
      }
    ];
  }, [definition, t, currency, date, number]);
  async function save(value) {
    if (value.id ? !manage : !canCreate) throw new Error("Unauthorized");
    if (value.id) await service.update(value.id, value);
    else await service.create(value);
    notify(t("Saved successfully"));
    setEditor(null);
    if (action) router.push("/" + definition.path);
  }
  if (loading && recordId) return createElement(LoadingState, null);
  if (error && recordId) return createElement(ErrorState, { message: error, retry: reload });
  if (recordId && !record && !loading) return createElement(DataEmptyState, null);
  if (action === "edit" && !manage || action === "new" && !canCreate)
    return createElement(Unauthorized, null);
  if (record && action === "edit")
    return createElement(Fragment, null, createElement(PageHeader, { title: t("Edit") + " \xB7 " + record.name }), createElement(Card, { className: "p-5" }, createElement(
      RecordForm,
      {
        module: definition,
        record,
        onSave: save,
        onCancel: () => router.push(`/${definition.path}/${record.id}`)
      }
    )));
  if (record)
    return createElement(RecordDetail, { module: definition, record, manage });
  return createElement(Fragment, null, createElement(
    PageHeader,
    {
      title: t(definition.title),
      description: t(
        "Persistent synthetic records \xB7 filter, export and manage your workspace."
      ),
      actions: createElement(Fragment, null, definition.kind === "crm" && createElement(
        Button,
        {
          variant: "secondary",
          onClick: () => setMode(mode === "pipeline" ? "list" : "pipeline")
        },
        createElement(LayoutGrid, { size: 14 }),
        t("Pipeline")
      ), definition.kind === "appointments" && createElement(
        Button,
        {
          variant: "secondary",
          onClick: () => setMode(mode === "calendar" ? "list" : "calendar")
        },
        createElement(CalendarDays, { size: 14 }),
        t("Calendar")
      ), canCreate && createElement(Fragment, null, createElement(Button, { variant: "secondary", onClick: () => setImportOpen(true) }, createElement(Download, { size: 14 }), t("Import CSV")), createElement(Button, { onClick: () => setEditor("new") }, createElement(Plus, { size: 14 }), t("Create"))))
    }
  ), createElement("div", { className: "mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4" }, [
    { label: "Total", value: number(data.length) },
    {
      label: "Active",
      value: number(
        data.filter(
          (row) => ![
            "Cancelled",
            "Rejected",
            "Inactive",
            "Closed",
            "Refunded"
          ].includes(row.status)
        ).length
      )
    },
    {
      label: definition.kind === "inventory" ? "Available quantity" : ["transfers", "adjustments", "movements"].includes(
        definition.kind
      ) ? "Quantity" : definition.kind === "directory" ? "Categories" : "Amount",
      value: definition.kind === "inventory" ? number(
        data.reduce(
          (sum, row) => sum + availableStock(
            Number(row.quantity),
            Number(row.reserved)
          ),
          0
        )
      ) : ["transfers", "adjustments", "movements"].includes(
        definition.kind
      ) ? number(
        data.reduce(
          (sum, row) => sum + Number(row.quantity ?? 0),
          0
        )
      ) : definition.kind === "directory" ? number(new Set(data.map((row) => row.category)).size) : currency(
        data.reduce(
          (sum, row) => sum + Number(
            row.amount ?? row.value ?? row.price ?? row.budget ?? 0
          ),
          0
        )
      )
    },
    {
      label: "Pending",
      value: number(
        data.filter(
          (row) => ["New", "Pending", "Draft", "Open", "Booked"].includes(
            row.status
          )
        ).length
      )
    }
  ].map((metric) => createElement(Card, { key: metric.label, className: "density-card p-5" }, createElement("p", { className: "text-xs text-muted" }, t(metric.label)), createElement("p", { className: "mt-2 text-xl font-semibold" }, metric.value)))), createElement(ResponsiveFilters, { count: [status, from, to].filter(Boolean).length }, createElement("label", { className: "min-w-32 flex-1" }, createElement("span", { className: "field-label" }, t("Status")), createElement(
    "select",
    {
      className: "field",
      value: status,
      onChange: (event) => setStatus(event.target.value)
    },
    createElement("option", { value: "" }, t("All")),
    definition.statuses.map((item) => createElement("option", { key: item, value: item }, t(item)))
  )), createElement("label", { className: "min-w-32 flex-1" }, createElement("span", { className: "field-label" }, t("Start date")), createElement(
    "input",
    {
      type: "date",
      className: "field",
      value: from,
      onChange: (event) => setFrom(event.target.value)
    }
  )), createElement("label", { className: "min-w-32 flex-1" }, createElement("span", { className: "field-label" }, t("End date")), createElement(
    "input",
    {
      type: "date",
      className: "field",
      value: to,
      onChange: (event) => setTo(event.target.value)
    }
  )), createElement(
    Button,
    {
      variant: "secondary",
      onClick: () => {
        setStatus("");
        setFrom("");
        setTo("");
      }
    },
    t("Reset filters")
  )), mode === "pipeline" ? createElement(
    PipelineBoard,
    {
      module: definition,
      rows: filtered,
      manage,
      onView: setQuick
    }
  ) : mode === "calendar" ? createElement(AppointmentCalendar, { rows: filtered, onView: setQuick }) : createElement(
    DataTable,
    {
      storageKey: definition.path,
      data: filtered,
      columns,
      loading,
      error,
      retry: reload,
      onView: setQuick,
      onDelete: canDelete ? setRemove : void 0
    }
  ), editor && createElement(
    Modal,
    {
      title: t(editor === "new" ? "Create" : "Edit") + " \xB7 " + t(definition.title),
      drawer: true,
      onClose: () => {
        setEditor(null);
        if (action) router.push("/" + definition.path);
      }
    },
    createElement(
      RecordForm,
      {
        module: definition,
        record: editor === "new" ? void 0 : editor,
        onSave: save,
        onCancel: () => {
          setEditor(null);
          if (action) router.push("/" + definition.path);
        }
      }
    )
  ), quick && createElement(Modal, { title: quick.name, drawer: true, onClose: () => setQuick(null) }, createElement(
    RecordDetail,
    {
      module: definition,
      record: data.find((row) => row.id === quick.id) ?? quick,
      manage,
      compact: true
    }
  )), remove.length > 0 && createElement(
    Confirmation,
    {
      title: "Delete",
      onClose: () => setRemove([]),
      onConfirm: async () => {
        if (!canDelete) throw new Error("Unauthorized");
        for (const id of remove) await service.delete(id);
        notify(t("Deleted successfully"));
      }
    }
  ), importOpen && createElement(
    CsvImporter,
    {
      title: t("Import CSV"),
      headers: [
        "name",
        "status",
        ...definition.fields.filter((field) => field.required).map((field) => field.key)
      ],
      onClose: () => setImportOpen(false),
      validate: (row) => {
        const value = { ...emptyForImport(definition), ...row };
        for (const field of definition.fields) {
          if (["number", "currency"].includes(field.kind))
            value[field.key] = Number(row[field.key] ?? 0);
          if (field.kind === "boolean")
            value[field.key] = row[field.key] === "true";
        }
        const result = importSchema(definition, value);
        return result;
      },
      onImport: async (rows) => {
        for (const row of rows) {
          const value = { ...emptyForImport(definition), ...row };
          for (const field of definition.fields) {
            if (["number", "currency"].includes(field.kind))
              value[field.key] = Number(row[field.key] ?? 0);
            if (field.kind === "boolean")
              value[field.key] = row[field.key] === "true";
          }
          await service.create(value);
        }
        setImportOpen(false);
        notify(t("Saved successfully"));
        return rows.length;
      }
    }
  ));
}
import { emptyRecord, moduleSchema } from "../../config/modules.js";
function emptyForImport(definition) {
  return emptyRecord(definition);
}
function importSchema(definition, value) {
  const result = moduleSchema(definition).safeParse(value);
  if (!result.success) throw new Error(result.error.issues[0].message);
  return Object.fromEntries(
    Object.entries(result.data).map(([key, value2]) => [key, String(value2)])
  );
}
export function StatusBadge({ status }) {
  const { t } = useI18n();
  const tone = [
    "Active",
    "Approved",
    "Delivered",
    "Paid",
    "Completed",
    "Won",
    "Reconciled",
    "Published"
  ].includes(status) ? "success" : ["Rejected", "Cancelled", "Failed", "Lost", "Out of stock"].includes(
    status
  ) ? "danger" : ["Pending", "Open", "New", "Low stock", "Needs clarification"].includes(
    status
  ) ? "warning" : "neutral";
  return createElement(Badge, { tone }, t(status));
}
