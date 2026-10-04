import { createElement, Fragment } from '../../runtime/dom.js';
import { useEffect, useState } from "../../runtime/dom.js";
import { readDemo, subscribeDemo } from "../../services/repository.js";
import { DataTable } from "../../components/data/data-table.js";
import { PageHeader } from "../../components/primitives.js";
import { useI18n } from "../../i18n/provider.js";
export function AuditPage() {
  const { t, date } = useI18n();
  const [entries, setEntries] = useState([]);
  useEffect(() => {
    const update = () => setEntries(readDemo("audit", []));
    const off = subscribeDemo(update);
    Promise.resolve().then(update);
    return off;
  }, []);
  const data = entries.map((entry) => ({
    ...entry,
    name: entry.details,
    status: entry.action,
    createdAt: entry.timestamp
  }));
  return createElement(Fragment, null, createElement(
    PageHeader,
    {
      title: t("Audit Logs"),
      description: t("Local create, update, delete and workflow history.")
    }
  ), createElement(
    DataTable,
    {
      storageKey: "audit",
      data,
      columns: [
        {
          accessorKey: "timestamp",
          header: t("Date"),
          size: 220,
          cell: ({ row }) => date(row.original.timestamp, true)
        },
        { accessorKey: "actor", header: t("Actor"), size: 200 },
        { accessorKey: "action", header: t("Actions") },
        { accessorKey: "module", header: t("Module"), size: 200 },
        { accessorKey: "resource", header: t("Reference"), size: 250 },
        { accessorKey: "details", header: t("Details"), size: 300 }
      ]
    }
  ));
}
