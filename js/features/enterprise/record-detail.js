import { createElement, Fragment } from '../../runtime/dom.js';
import { createId } from "../../lib/id.js";
import { Link as Link } from "../../runtime/navigation.js";
import { useState, useEffect } from "../../runtime/dom.js";
import { Pencil, Printer, Send, ArrowRight } from "../../vendor/icons.js";
import {
  modules
} from "../../config/modules.js";
import { serviceFor } from "../../services/modules.js";
import { readDemo, recordActivity, subscribeDemo } from "../../services/repository.js";
import { useRepository } from "../../hooks/use-repository.js";
import { useAuth } from "../../hooks/use-auth.js";
import { usePersistentState } from "../../lib/client-store.js";
import { workflowTransitions, availableStock } from "../../lib/workflows.js";
import { useI18n } from "../../i18n/provider.js";
import { useUI } from "../../components/ui-provider.js";
import { Button, Card, PageHeader, Badge } from "../../components/primitives.js";
import { Modal } from "../../components/interactions.js";
import { ActivityTimeline, WorkflowTimeline } from "../../components/data/timeline.js";
import { Confirmation } from "../../components/data/confirmation.js";
import { RecordForm } from "./record-form.js";
export function RecordDetail({
  module,
  record,
  manage,
  compact = false
}) {
  const { t, currency, date, number } = useI18n();
  const { notify } = useUI();
  const { has, user } = useAuth();
  const [edit, setEdit] = useState(false);
  const [tab, setTab] = useState("Details");
  const [note, setNote] = useState("");
  const [confirm, setConfirm] = useState("");
  const [activity, setActivity] = useState([]);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const service = serviceFor(module);
  const relatedModule = modules.find(
    (item) => item.path === (module.kind === "customers" ? "commerce/orders" : "commerce/customers")
  );
  const { data: related } = useRepository(serviceFor(relatedModule));
  useEffect(() => {
    const update = () => setActivity(readDemo("activity:" + module.path + ":" + record.id, []));
    const unsubscribe = subscribeDemo(update);
    Promise.resolve().then(update);
    return unsubscribe;
  }, [module.path, record.id]);
  const appointmentsModule = modules.find(
    (item) => item.path === "doctors/appointments"
  );
  const ticketsModule = modules.find(
    (item) => item.path === "support/tickets"
  );
  const { data: appointments } = useRepository(serviceFor(appointmentsModule));
  const { data: tickets } = useRepository(serviceFor(ticketsModule));
  const [messages, setMessages] = usePersistentState(
    "conversation:" + module.path + ":" + record.id,
    [
      {
        id: "initial",
        text: String(record.notes),
        internal: false,
        actor: String(record.customer ?? "Demo customer"),
        timestamp: record.createdAt,
        attachments: []
      }
    ]
  );
  const [attachments, setAttachments] = useState([]);
  const [internal, setInternal] = useState(false);
  async function updateStatus(status) {
    if (!manage && !(status === "Cancelled" && has("orders.cancel")) && !(status === "Refunded" && has("finance.manage")))
      return;
    setBusy(true);
    setActionError("");
    try {
      await service.update(record.id, {
        status,
        ...module.kind === "orders" && status === "Refunded" ? { paymentStatus: "Refunded" } : {}
      });
      notify(t("Saved successfully"));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      setActionError(message);
      notify(t(message), "error");
      throw error;
    } finally {
      setBusy(false);
    }
  }
  const nextStatuses = workflowTransitions(
    module.kind,
    record.status,
    module.statuses
  );
  const tabs = module.kind === "customers" ? [
    "Details",
    "Addresses",
    "Orders",
    "Appointments",
    "Support History",
    "Wallet",
    "Loyalty",
    "Activity"
  ] : module.kind === "tickets" ? ["Conversation", "Details", "Activity"] : ["Details", "Activity"];
  const selected = tab === "Details" && module.kind === "tickets" ? "Conversation" : tab;
  return createElement("div", { className: "space-y-5" }, createElement(
    PageHeader,
    {
      title: compact ? t("Details") : record.name,
      description: record.id + " \xB7 " + date(record.createdAt),
      actions: createElement(Fragment, null, manage && createElement(Button, { variant: "secondary", onClick: () => setEdit(true) }, createElement(Pencil, { size: 14 }), t("Edit")), !compact && createElement(Button, { variant: "secondary", onClick: () => window.print() }, createElement(Printer, { size: 14 }), t("Print")), compact && createElement(
        Link,
        {
          href: `/${module.path}/${record.id}`,
          className: "inline-flex items-center gap-1 px-3 text-xs text-brand"
        },
        t("View"),
        createElement(ArrowRight, { size: 14 })
      ))
    }
  ), createElement("div", { className: "flex flex-wrap gap-2" }, createElement(Badge, { tone: "brand" }, t(record.status)), nextStatuses.filter(
    (status) => status === "Cancelled" ? has("orders.cancel") || module.kind !== "orders" && manage : status === "Refunded" && module.kind === "orders" ? has("finance.manage") : manage
  ).map((status) => createElement(
    Button,
    {
      key: status,
      disabled: busy,
      variant: status === "Rejected" || status === "Cancelled" ? "danger" : "secondary",
      onClick: () => {
        if (["Rejected", "Cancelled", "Refunded"].includes(status) || ["transfers", "adjustments"].includes(module.kind) && status === "Completed")
          setConfirm(status);
        else void updateStatus(status).catch(() => {
        });
      }
    },
    t(
      module.kind === "prescriptions" && status === "Approved" ? "Approve" : module.kind === "prescriptions" && status === "Rejected" ? "Reject" : status
    )
  ))), actionError && createElement("p", { role: "alert", className: "text-danger" }, t(actionError)), module.workflow && createElement(Card, { className: "p-4" }, createElement(WorkflowTimeline, { stages: module.statuses, current: record.status })), createElement(
    "div",
    {
      role: "tablist",
      "aria-label": t("Details"),
      className: "flex flex-wrap gap-2 border-b border-ui"
    },
    tabs.map((item) => createElement(
      "button",
      {
        key: item,
        type: "button",
        role: "tab",
        "aria-selected": selected === item,
        className: `border-b-2 px-3 py-3 text-xs ${selected === item ? "border-brand text-brand" : "border-transparent text-muted"}`,
        onClick: () => setTab(item)
      },
      t(item)
    ))
  ), selected === "Details" && createElement(
    "div",
    {
      className: `grid gap-4 ${compact ? "" : "xl:grid-cols-[2fr_1fr]"}`
    },
    createElement(Card, { className: "p-5" }, createElement("dl", { className: "grid gap-5 sm:grid-cols-2" }, module.fields.filter((field) => field.key !== "media").map((field) => createElement(
      "div",
      {
        key: field.key,
        className: field.kind === "textarea" ? "sm:col-span-2" : ""
      },
      createElement("dt", { className: "text-xs text-muted" }, t(field.label)),
      createElement("dd", { className: "mt-1 whitespace-pre-wrap break-words text-sm" }, field.kind === "currency" ? currency(Number(record[field.key])) : field.kind === "date" ? date(String(record[field.key])) : field.kind === "boolean" ? t(record[field.key] ? "Yes" : "No") : typeof record[field.key] === "number" ? number(Number(record[field.key])) : String(record[field.key] || "\u2014"))
    ))), module.kind === "inventory" && createElement("p", { className: "mt-4 border-t border-ui pt-4 font-semibold" }, t("Available quantity"), ":", " ", number(
      availableStock(
        Number(record.quantity),
        Number(record.reserved)
      )
    ))),
    createElement("div", { className: "space-y-4" }, module.kind === "prescriptions" && createElement(Card, { className: "border-dashed p-5" }, createElement(Badge, { tone: "warning" }, t("Synthetic document")), createElement("pre", { className: "mt-4 whitespace-pre-wrap text-xs leading-6" }, String(record.document)), createElement("p", { className: "mt-4 text-xs text-muted" }, t("No clinical recommendations are generated."))), module.kind === "content" && createElement(Card, { className: "p-5" }, createElement("h2", { className: "mb-3 font-semibold" }, t("Preview")), createElement("div", { className: "whitespace-pre-wrap text-sm leading-7" }, String(record.content))), record.customer && createElement(Card, { className: "p-5" }, createElement("h2", { className: "mb-3 font-semibold" }, t("Customer")), related.filter((row) => row.name.startsWith(String(record.customer))).slice(0, 1).map((customer) => createElement(
      Link,
      {
        key: customer.id,
        href: `/commerce/customers/${customer.id}`,
        className: "text-brand"
      },
      customer.name
    )), createElement("p", { className: "mt-2 text-xs text-muted" }, String(record.email ?? record.customer))), createElement(Card, { className: "p-5" }, createElement("h2", { className: "mb-4 font-semibold" }, t("Activity")), createElement(
      ActivityTimeline,
      {
        entries: [
          {
            id: "created",
            text: t("Created"),
            timestamp: record.createdAt,
            actor: "Demo system"
          },
          ...activity
        ]
      }
    )))
  ), selected === "Orders" && createElement(Card, { className: "divide-y divide-[var(--line)]" }, related.filter(
    (row) => String(record.name).startsWith(String(row.customer))
  ).map((order) => createElement(
    Link,
    {
      key: order.id,
      href: `/commerce/orders/${order.id}`,
      className: "flex items-center justify-between gap-3 p-4 text-sm"
    },
    createElement("span", null, order.id, " \xB7 ", t(order.status)),
    createElement("span", null, currency(Number(order.amount)))
  ))), selected === "Addresses" && createElement(Card, { className: "p-5" }, createElement("h2", { className: "mb-3 font-semibold" }, t("Address")), createElement("p", { className: "text-sm" }, String(record.address || "\u2014")), createElement("p", { className: "mt-2 text-xs text-muted" }, String(record.city), " \xB7 ", String(record.pincode || "\u2014"))), ["Appointments", "Support History"].includes(selected) && createElement(Card, null, (selected === "Appointments" ? appointments : tickets).filter((row) => record.name.startsWith(String(row.customer))).map((row) => createElement(
    Link,
    {
      key: row.id,
      href: `/${selected === "Appointments" ? "doctors/appointments" : "support/tickets"}/${row.id}`,
      className: "flex flex-wrap justify-between gap-3 border-b border-ui p-4 text-sm"
    },
    createElement("span", { className: "text-brand" }, row.name),
    createElement("span", { className: "text-muted" }, t(row.status))
  ))), ["Wallet", "Loyalty"].includes(selected) && createElement(Card, { className: "p-6" }, createElement("p", { className: "text-xs text-muted" }, t(selected)), createElement("p", { className: "mt-3 text-2xl font-semibold" }, selected === "Wallet" ? currency(Number(record.wallet)) : number(Number(record.loyalty)))), selected === "Activity" && createElement(Card, { className: "p-5" }, createElement(
    ActivityTimeline,
    {
      entries: [
        {
          id: "created",
          text: t("Created"),
          timestamp: record.createdAt,
          actor: "Demo system"
        },
        ...activity
      ]
    }
  )), selected === "Conversation" && createElement(Card, { className: "p-5" }, createElement("div", { className: "space-y-4" }, messages.map((message) => createElement(
    "article",
    {
      key: message.id,
      className: `rounded border border-ui p-4 ${message.internal ? "bg-warning/5" : "bg-[var(--panel-2)]"}`
    },
    createElement("div", { className: "mb-2 flex flex-wrap justify-between gap-2 text-xs text-muted" }, createElement("span", null, message.actor, " ", message.internal ? "\xB7 " + t("Internal note") : ""), createElement("time", null, date(message.timestamp, true))),
    createElement("p", { className: "whitespace-pre-wrap text-sm" }, message.text),
    message.attachments.map((file) => createElement("p", { key: file, className: "mt-2 text-xs text-brand" }, t("Attachment"), ": ", file))
  ))), manage && createElement(
    "form",
    {
      className: "mt-5 space-y-3",
      onSubmit: async (event) => {
        event.preventDefault();
        if (!note.trim()) return;
        const entry = {
          id: createId(),
          text: note.trim(),
          internal,
          actor: user?.name ?? "Demo agent",
          timestamp: (new Date()).toISOString(),
          attachments
        };
        setMessages((prev) => [...prev, entry]);
        recordActivity(
          module.path,
          record.id,
          internal ? "Internal note" : "Reply",
          entry.text
        );
        setNote("");
        setAttachments([]);
        notify(t("Saved successfully"));
      }
    },
    createElement("label", { className: "block" }, createElement("span", { className: "field-label" }, t(internal ? "Internal note" : "Reply")), createElement(
      "textarea",
      {
        required: true,
        className: "field",
        rows: 4,
        value: note,
        onChange: (event) => setNote(event.target.value)
      }
    )),
    createElement("label", { className: "flex items-center gap-2 text-xs" }, createElement(
      "input",
      {
        type: "checkbox",
        checked: internal,
        onChange: (event) => setInternal(event.target.checked)
      }
    ), t("Internal note")),
    createElement("label", { className: "block" }, createElement("span", { className: "field-label" }, t("Attachments")), createElement(
      "input",
      {
        type: "file",
        multiple: true,
        className: "max-w-full text-xs",
        onChange: (event) => setAttachments(
          Array.from(event.target.files ?? []).map(
            (file) => file.name
          )
        )
      }
    )),
    createElement(Button, { type: "submit" }, createElement(Send, { size: 14 }), t("Reply"))
  )), manage && module.kind !== "tickets" && createElement(
    "form",
    {
      className: "surface flex flex-wrap gap-3 p-4",
      onSubmit: async (event) => {
        event.preventDefault();
        if (!note.trim()) return;
        try {
          await service.update(record.id, {
            notes: String(record.notes || "") + "\n" + note.trim()
          });
          recordActivity(module.path, record.id, "Add note", note.trim());
          setNote("");
          notify(t("Saved successfully"));
        } catch (error) {
          notify(
            error instanceof Error ? t(error.message) : t("Something went wrong"),
            "error"
          );
        }
      }
    },
    createElement("label", { className: "min-w-0 flex-1 basis-48" }, createElement("span", { className: "field-label" }, t("Internal note")), createElement(
      "input",
      {
        required: true,
        className: "field",
        value: note,
        onChange: (event) => setNote(event.target.value)
      }
    )),
    createElement(Button, { className: "self-end", type: "submit" }, t("Add note"))
  ), edit && createElement(
    Modal,
    {
      drawer: true,
      title: t("Edit") + " \xB7 " + record.name,
      onClose: () => setEdit(false)
    },
    createElement(
      RecordForm,
      {
        module,
        record,
        onCancel: () => setEdit(false),
        onSave: async (value) => {
          await service.update(record.id, value);
          setEdit(false);
          notify(t("Saved successfully"));
        }
      }
    )
  ), confirm && createElement(
    Confirmation,
    {
      title: confirm,
      description: module.kind === "orders" && confirm === "Refunded" ? t("Record a synthetic refund. No money will be transferred.") : void 0,
      onClose: () => setConfirm(""),
      onConfirm: () => updateStatus(confirm)
    }
  ));
}
