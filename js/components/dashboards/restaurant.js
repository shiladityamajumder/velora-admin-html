import { createElement, Fragment } from '../../runtime/dom.js';
import { Link as Link } from "../../runtime/navigation.js";
import { useState } from "../../runtime/dom.js";
import {
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  RefreshCw,
  ShoppingCart,
  Utensils
} from "../../vendor/icons.js";
import { Badge, Button, Card, CardHeader } from "../primitives.js";
import { DonutChart } from "../charts.js";
import { Modal, EmptyState } from "../interactions.js";
import { useUI } from "../ui-provider.js";
import { exportCsv, usePersistentState } from "../../lib/client-store.js";
import { initialKitchenOrders } from "../../lib/records.js";
import { DashboardTitle } from "./shared.js";
export function RestaurantDashboard() {
  const [orders, setOrders] = usePersistentState(
    "kitchen-orders",
    initialKitchenOrders
  );
  const [tables, setTables] = usePersistentState(
    "tables-occupancy",
    Array.from({ length: 28 }, (_, index) => index < 21)
  );
  const [floorplan, setFloorplan] = useState(false);
  const [resolved, setResolved] = usePersistentState(
    "restaurant-resolved",
    []
  );
  const [action, setAction] = useState(null);
  const [eventsDone, setEventsDone] = usePersistentState(
    "kitchen-events-done",
    []
  );
  const { notify } = useUI();
  const statuses = ["Placed", "Preparing", "Ready", "Completed"];
  const queue = [
    ["4 refund requests", "Review"],
    ["3 low stock items", "Reorder"],
    ["2 delayed orders", "Expedite"],
    ["1 voided ticket", "Verify"],
    ["Register mismatch", "Resolve"],
    ["2 VIP bookings", "Assign"]
  ];
  return createElement(Fragment, null, createElement(DashboardTitle, { title: "POS & Restaurant" }), createElement("div", { className: "mb-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4" }, [
    [
      "TOTAL REVENUE",
      "$14,892.50",
      "Today's net sales",
      CircleDollarSign,
      "#0ac074"
    ],
    [
      "ORDERS FILLED",
      "412",
      "Active & completed orders",
      ShoppingCart,
      "#4aa3ff"
    ],
    [
      "AVG. TICKET VALUE",
      "$36.15",
      "Average guest spend",
      Utensils,
      "#a855f7"
    ],
    [
      "AVG. PREP TIME",
      "12.8 m",
      "Cook time throughput",
      Clock3,
      "#fcb92c"
    ]
  ].map(([label, value, hint, icon, color]) => {
    const Icon = icon;
    return createElement(Card, { key: String(label), className: "p-5" }, createElement(
      "div",
      {
        style: { color: String(color) },
        className: "flex items-center justify-between"
      },
      createElement("span", { className: "text-[11px] text-muted" }, String(label)),
      createElement(Icon, { size: 20 })
    ), createElement("p", { className: "my-2 text-2xl font-medium" }, String(value)), createElement("p", { className: "text-xs text-muted" }, String(hint)));
  })), createElement("div", { className: "mb-6 grid gap-6 lg:grid-cols-[1fr_1.55fr_1fr]" }, createElement("div", { className: "space-y-4" }, createElement(Card, { className: "border-danger/15 bg-danger/5 p-5" }, createElement("p", { className: "text-[11px] text-muted" }, "TABLE OCCUPANCY"), createElement("p", { className: "mt-2 text-2xl font-medium" }, tables.filter(Boolean).length, " / 28"), createElement("div", { className: "mt-3 flex items-center justify-between" }, createElement("span", { className: "text-xs text-muted" }, Math.round(tables.filter(Boolean).length / 28 * 100), "% tables active"), createElement(
    "button",
    {
      className: "text-xs text-brand",
      onClick: () => setFloorplan(true)
    },
    "Floor plan"
  ))), createElement(Card, null, createElement(CardHeader, { title: "Orders by Channel" }), createElement("div", { className: "p-5" }, createElement(
    DonutChart,
    {
      data: [
        { name: "Dine-in", value: 206 },
        { name: "Takeaway", value: 124 },
        { name: "Delivery", value: 82 }
      ],
      totalLabel: "412",
      centerLabel: "Orders"
    }
  )))), createElement(Card, null, createElement(
    CardHeader,
    {
      title: "Kitchen Performance & Live Activity",
      action: createElement(Badge, { tone: "brand" }, "Live Monitor")
    }
  ), createElement("div", { className: "p-5" }, createElement("div", { className: "grid grid-cols-3 rounded-xl bg-[var(--panel-2)] px-2 py-4 text-center" }, [
    ["CLEARED ORDERS", "184"],
    ["SLA RECOVERY", "96.2%"],
    [
      "PENDING PREP",
      String(
        orders.filter((order) => order.status === "Preparing").length
      )
    ]
  ].map(([label, value], index) => createElement(
    "div",
    {
      key: label,
      className: "border-e border-ui px-2 last:border-0"
    },
    createElement("p", { className: "text-[10px] font-medium tracking-wide text-muted" }, label),
    createElement(
      "p",
      {
        className: `mt-2 text-xl font-semibold ${index === 1 ? "text-success" : index === 2 ? "text-warning" : ""}`
      },
      value
    )
  ))), createElement("h3", { className: "mt-7 mb-3 font-medium" }, "Live Kitchen Events"), [
    [
      "Table 4 Order Ready",
      "Chef cleared Grilled Salmon & Asparagus",
      "Just now"
    ],
    [
      "Delivery Rider Dispatched",
      "Order #ORD-1052 picked up by delivery partner",
      "3 mins ago"
    ],
    [
      "Preparation Delay Alert",
      "Table 12 Lobster Risotto is exceeding SLA",
      "8 mins ago"
    ]
  ].map(([title, description, time]) => createElement(
    "label",
    {
      key: title,
      className: "flex items-start gap-3 border-t border-ui py-4"
    },
    createElement(
      "input",
      {
        type: "checkbox",
        className: "mt-1 size-4 shrink-0",
        checked: eventsDone.includes(title),
        onChange: (event) => setEventsDone(
          (values) => event.target.checked ? [...values, title] : values.filter((value) => value !== title)
        )
      }
    ),
    createElement("div", null, createElement(
      "p",
      {
        className: `text-xs font-semibold ${eventsDone.includes(title) ? "text-muted line-through" : ""}`
      },
      title
    ), createElement("p", { className: "mt-1 text-[10px] text-muted" }, description)),
    createElement("span", { className: "ms-auto shrink-0 text-[10px] text-muted" }, time)
  )), createElement("div", { className: "mt-3 flex gap-2" }, createElement(
    Button,
    {
      variant: "secondary",
      className: "flex-1",
      onClick: () => document.getElementById("order-pipeline")?.scrollIntoView({ behavior: "smooth", block: "start" })
    },
    "View KDS Screen"
  ), createElement(
    Button,
    {
      className: "flex-1",
      onClick: () => exportCsv(
        "kitchen-log.csv",
        ["Order", "Customer", "Channel", "Items", "Status"],
        orders.map((order) => [
          order.id,
          order.customer,
          order.channel,
          order.items,
          order.status
        ])
      )
    },
    "View Kitchen Log"
  )))), createElement(Card, null, createElement(CardHeader, { title: "Action Queue", subtitle: "Issues before cutoff" }), createElement("div", { className: "px-5" }, queue.filter(([title]) => !resolved.includes(title)).map(([title, label], index) => createElement(
    "div",
    {
      key: title,
      className: "flex items-center gap-3 border-b border-ui py-4 last:border-0"
    },
    createElement(
      "span",
      {
        className: `grid size-9 shrink-0 place-items-center rounded-md ${index % 2 ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning"}`
      },
      createElement(RefreshCw, { size: 17 })
    ),
    createElement("p", { className: "text-xs font-semibold" }, title),
    createElement(
      Button,
      {
        variant: "secondary",
        className: "ms-auto h-7 shrink-0 px-2 text-[10px]",
        onClick: () => setAction(title)
      },
      label
    )
  )), resolved.length === queue.length ? createElement(
    EmptyState,
    {
      title: "Queue cleared",
      description: "All issues have been reviewed."
    }
  ) : null))), createElement(Card, null, createElement("div", { id: "order-pipeline", className: "scroll-mt-24" }, createElement(
    CardHeader,
    {
      title: "Order Pipeline",
      subtitle: "Manage real-time kitchen orders. Advance an order to its next stage.",
      action: createElement(
        Link,
        {
          href: "/apps/pos",
          className: "inline-flex items-center gap-2 rounded bg-brand px-3 py-2 text-xs font-medium text-white"
        },
        createElement(ShoppingCart, { size: 15 }),
        "POS Terminal"
      )
    }
  ), createElement("div", { className: "grid gap-5 p-5 sm:grid-cols-2 xl:grid-cols-4" }, statuses.map((status, index) => createElement("div", { key: status }, createElement("div", { className: "mb-3 flex items-center justify-between" }, createElement("span", { className: "flex items-center gap-2 text-[11px] font-medium uppercase text-muted" }, createElement(
    "i",
    {
      className: `size-2 rounded-full ${index === 0 ? "bg-info" : index === 1 ? "bg-warning" : index === 2 ? "bg-success" : "bg-[var(--muted)]"}`
    }
  ), status), createElement(Badge, null, orders.filter((order) => order.status === status).length)), createElement("div", { className: "space-y-3" }, orders.filter((order) => order.status === status).map((order) => createElement(
    "div",
    {
      key: order.id,
      className: "rounded-md border border-ui bg-[var(--panel-2)] p-3"
    },
    createElement("p", { className: "flex justify-between gap-2 text-xs" }, createElement("b", null, "#", order.id), createElement("span", { className: "text-[9px] text-muted" }, order.channel)),
    createElement(
      "p",
      {
        className: `mt-4 text-xs font-medium ${status === "Completed" ? "text-muted" : ""}`
      },
      order.customer
    ),
    createElement("p", { className: "mt-1 text-[11px] text-muted" }, order.items),
    status !== "Completed" ? createElement(
      Button,
      {
        className: "mt-4 w-full",
        variant: "secondary",
        onClick: () => {
          const next = statuses[index + 1];
          setOrders(
            (values) => values.map(
              (item) => item.id === order.id ? { ...item, status: next } : item
            )
          );
          notify(
            `${order.id} moved to ${next.toLowerCase()}.`
          );
        }
      },
      index === 0 ? "Start preparing" : index === 1 ? "Mark ready" : "Complete order"
    ) : createElement("p", { className: "mt-4 flex items-center gap-1 text-[11px] text-success" }, createElement(CheckCircle2, { size: 12 }), "Completed")
  )))))))), floorplan ? createElement(
    Modal,
    {
      title: "Floor plan",
      description: "Select a table to toggle its occupancy.",
      onClose: () => setFloorplan(false)
    },
    createElement("div", { className: "grid grid-cols-4 gap-3" }, tables.map((occupied, index) => createElement(
      "button",
      {
        key: index,
        "aria-pressed": occupied,
        onClick: () => setTables(
          (values) => values.map(
            (value, position) => position === index ? !value : value
          )
        ),
        className: `rounded-md border p-3 text-xs ${occupied ? "border-brand bg-brand/10 text-brand" : "border-ui"}`
      },
      "Table ",
      index + 1,
      createElement("span", { className: "mt-1 block text-[9px]" }, occupied ? "Occupied" : "Available")
    )))
  ) : null, action ? createElement(
    Modal,
    {
      title: action,
      description: "Review the operational issue and mark it resolved.",
      onClose: () => setAction(null)
    },
    createElement("p", { className: "text-sm text-muted" }, "This item will be removed from the action queue after you complete your review."),
    createElement("div", { className: "mt-5 flex justify-end gap-2" }, createElement(Button, { variant: "secondary", onClick: () => setAction(null) }, "Cancel"), createElement(
      Button,
      {
        onClick: () => {
          setResolved((values) => [...values, action]);
          setAction(null);
          notify("Issue marked resolved.");
        }
      },
      "Mark resolved"
    ))
  ) : null);
}
