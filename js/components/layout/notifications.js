import { createElement, Fragment } from '../../runtime/dom.js';
import { Link as Link } from "../../runtime/navigation.js";
import { useState } from "../../runtime/dom.js";
import { usePersistentState } from "../../lib/client-store.js";
import { useI18n } from "../../i18n/provider.js";
import { Modal } from "../interactions.js";
import { Button, Badge } from "../primitives.js";
import { Confirmation } from "../data/confirmation.js";
import { Bell, RotateCcw } from "../../vendor/icons.js";
export const initialNotifications = [
  {
    id: 1,
    title: "New order received",
    category: "Orders",
    timestamp: "2026-10-03T08:00:00Z",
    href: "/commerce/orders/NX-O1001",
    read: false
  },
  {
    id: 2,
    title: "Low stock",
    category: "Inventory",
    timestamp: "2026-10-03T07:20:00Z",
    href: "/inventory/low-stock",
    read: false
  },
  {
    id: 3,
    title: "Payment settled",
    category: "Payments",
    timestamp: "2026-10-03T06:30:00Z",
    href: "/finance/transactions",
    read: false
  },
  {
    id: 4,
    title: "New support ticket",
    category: "Support",
    timestamp: "2026-10-03T05:30:00Z",
    href: "/support/tickets",
    read: false
  },
  {
    id: 5,
    title: "Appointment reminder",
    category: "Appointments",
    timestamp: "2026-10-02T08:30:00Z",
    href: "/doctors/appointments",
    read: true
  },
  {
    id: 6,
    title: "Demo workspace ready",
    category: "System",
    timestamp: "2026-10-01T08:30:00Z",
    href: "/template",
    read: true
  }
];
export function Notifications({ onClose }) {
  const { t, date } = useI18n();
  const [notifications, setNotifications] = usePersistentState(
    "notifications-v2",
    initialNotifications
  );
  const [clearedNotifications, setClearedNotifications] = usePersistentState(
    "notifications-cleared-v1",
    []
  );
  const resetFilters = () => {
    setUnread(false);
    setCategory("");
  };
  const [unread, setUnread] = useState(false);
  const [category, setCategory] = useState("");
  const [clear, setClear] = useState(false);
  const filtered = notifications.filter(
    (item) => (!unread || !item.read) && (!category || category === item.category)
  );
  return createElement(Modal, { title: t("Notifications"), drawer: true, onClose }, createElement("div", { className: "mb-4 flex flex-wrap gap-2" }, createElement(
    Button,
    {
      variant: unread ? "primary" : "secondary",
      onClick: () => setUnread((value) => !value)
    },
    t("Unread"),
    " (",
    notifications.filter((item) => !item.read).length,
    ")"
  ), createElement(
    Button,
    {
      variant: "ghost",
      disabled: !notifications.some((item) => !item.read),
      onClick: () => setNotifications(
        (prev) => prev.map((item) => ({ ...item, read: true }))
      )
    },
    t("Mark all read")
  ), createElement(
    Button,
    {
      variant: "ghost",
      disabled: !notifications.length,
      onClick: () => setClear(true)
    },
    t("Clear")
  ), createElement(
    "select",
    {
      "aria-label": t("Category"),
      className: "field",
      value: category,
      onChange: (e) => setCategory(e.target.value)
    },
    createElement("option", { value: "" }, t("All")),
    [...new Set(initialNotifications.map((item) => item.category))].map(
      (item) => createElement("option", { key: item, value: item }, t(item))
    )
  )), clearedNotifications.length > 0 && createElement(
    "div",
    {
      role: "status",
      className: "mb-4 flex items-center justify-between gap-3 rounded border border-ui bg-[var(--panel-2)] p-3 text-xs"
    },
    createElement("span", null, t("Notifications cleared")),
    createElement(
      Button,
      {
        variant: "secondary",
        onClick: () => {
          setNotifications((current) => [
            ...clearedNotifications.filter(
              (item) => !current.some((row) => row.id === item.id)
            ),
            ...current
          ]);
          setClearedNotifications([]);
          resetFilters();
        }
      },
      createElement(RotateCcw, { size: 14 }),
      t("Undo")
    )
  ), createElement("div", { className: "space-y-2" }, filtered.map((item) => createElement(
    "div",
    {
      key: item.id,
      className: `rounded border border-ui p-4 ${!item.read ? "bg-brand/5" : ""}`
    },
    createElement(Badge, null, t(item.category)),
    createElement(
      Link,
      {
        href: item.href,
        onClick: () => {
          setNotifications(
            (prev) => prev.map(
              (row) => row.id === item.id ? { ...row, read: true } : row
            )
          );
          onClose();
        },
        className: "mt-2 block text-sm font-medium"
      },
      t(item.title)
    ),
    createElement("p", { className: "mt-1 text-xs text-muted" }, date(item.timestamp, true)),
    createElement(
      "button",
      {
        className: "mt-2 text-xs text-brand",
        onClick: () => setNotifications(
          (prev) => prev.map(
            (row) => row.id === item.id ? { ...row, read: !row.read } : row
          )
        )
      },
      t(item.read ? "Mark unread" : "Mark read")
    )
  )), !filtered.length && createElement("div", { className: "rounded border border-dashed border-ui px-4 py-10 text-center" }, createElement(Bell, { className: "mx-auto mb-3 text-muted", size: 26 }), createElement("p", { className: "text-sm font-medium" }, t(
    notifications.length ? "No matching notifications" : "No notifications"
  )), createElement("p", { className: "mt-2 text-xs text-muted" }, t(
    notifications.length ? "Try another category or show all notifications." : "Your notification center is ready for new updates."
  )), notifications.length > 0 && createElement(
    Button,
    {
      className: "mt-4",
      variant: "secondary",
      onClick: resetFilters
    },
    t("Reset filters")
  ))), createElement("div", { className: "mt-5 border-t border-ui pt-4" }, createElement(
    Button,
    {
      variant: "secondary",
      onClick: () => {
        setNotifications(initialNotifications);
        setClearedNotifications([]);
        resetFilters();
      }
    },
    createElement(RotateCcw, { size: 14 }),
    t("Restore demo notifications")
  ), createElement("p", { className: "mt-2 text-xs text-muted" }, t("Restore the sample inbox without resetting your workspace."))), clear && createElement(
    Confirmation,
    {
      title: "Clear notifications",
      description: t(
        "Clear the inbox? You can undo this or restore the demo notifications."
      ),
      onClose: () => setClear(false),
      onConfirm: async () => {
        setClearedNotifications(notifications);
        setNotifications([]);
        resetFilters();
      }
    }
  ));
}
