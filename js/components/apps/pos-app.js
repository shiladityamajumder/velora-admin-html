import { createElement, Fragment } from '../../runtime/dom.js';
import { appConfig } from "../../config/app.js";
import { createId } from "../../lib/id.js";
import { useState } from "../../runtime/dom.js";
import {
  CreditCard,
  Download,
  Minus,
  Plus,
  Search,
  Trash2,
  CheckCircle2
} from "../../vendor/icons.js";
import { Badge, Button, Card, CardHeader, PageHeader } from "../primitives.js";
import { Modal, EmptyState } from "../interactions.js";
import { RecordEditor } from "../record-editor.js";
import { useUI } from "../ui-provider.js";
import { usePersistentState, downloadText } from "../../lib/client-store.js";
import { money, initialKitchenOrders } from "../../lib/records.js";
const menuItems = [
  {
    id: 1,
    name: "Truffle Burger",
    category: "Burgers",
    price: 18,
    emoji: "\u{1F354}"
  },
  { id: 2, name: "Salmon Bowl", category: "Bowls", price: 22, emoji: "\u{1F957}" },
  { id: 3, name: "Pesto Pasta", category: "Pasta", price: 16, emoji: "\u{1F35D}" },
  {
    id: 4,
    name: "Berry Waffle",
    category: "Breakfast",
    price: 14,
    emoji: "\u{1F9C7}"
  },
  { id: 5, name: "Matcha Latte", category: "Drinks", price: 7, emoji: "\u{1F375}" },
  { id: 6, name: "Flat White", category: "Drinks", price: 6, emoji: "\u2615" },
  { id: 7, name: "Margherita", category: "Pizza", price: 19, emoji: "\u{1F355}" },
  { id: 8, name: "Tiramisu", category: "Dessert", price: 10, emoji: "\u{1F370}" }
];
export function PosApp() {
  const [cart, setCart] = usePersistentState(
    "pos-cart",
    { "1": 1, "5": 2 }
  );
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [table, setTable] = useState("08");
  const [checkout, setCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [, setOrders] = usePersistentState(
    "kitchen-orders",
    initialKitchenOrders
  );
  const { notify } = useUI();
  const filtered = menuItems.filter(
    (item) => item.name.toLowerCase().includes(query.toLowerCase()) && (category === "All categories" || item.category === category)
  );
  const items = menuItems.filter((item) => cart[item.id] > 0).map((item) => ({ ...item, quantity: cart[item.id] }));
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = Math.round(subtotal * 1.08 * 100) / 100;
  const update = (id, delta) => setCart((values) => ({
    ...values,
    [id]: Math.max(0, (values[id] ?? 0) + delta)
  }));
  return createElement(Fragment, null, createElement(
    PageHeader,
    {
      title: "Point of Sale",
      description: "Menu, current order, and checkout.",
      actions: createElement(Badge, { tone: "success" }, "Register Online")
    }
  ), createElement("div", { className: "grid gap-6 xl:grid-cols-[1fr_360px]" }, createElement(Card, null, createElement("div", { className: "flex flex-wrap gap-3 border-b border-ui p-4" }, createElement("div", { className: "relative min-w-40 flex-1" }, createElement(Search, { size: 16, className: "absolute start-3 top-3 text-muted" }), createElement(
    "input",
    {
      "aria-label": "Search menu",
      value: query,
      onChange: (event) => setQuery(event.target.value),
      placeholder: "Search menu items...",
      className: "field ps-9"
    }
  )), createElement(
    "select",
    {
      "aria-label": "Menu category",
      value: category,
      onChange: (event) => setCategory(event.target.value),
      className: "field w-auto"
    },
    createElement("option", null, "All categories"),
    [...new Set(menuItems.map((item) => item.category))].map(
      (value) => createElement("option", { key: value }, value)
    )
  )), createElement("div", { className: "grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3" }, filtered.map((item) => createElement(
    "button",
    {
      key: item.id,
      onClick: () => update(item.id, 1),
      className: "rounded-md border border-ui p-3 text-start transition hover:border-brand/40 hover:shadow-md"
    },
    createElement("div", { className: "mb-3 grid h-28 place-items-center rounded bg-[var(--panel-2)] text-5xl" }, item.emoji),
    createElement("p", { className: "text-sm font-medium" }, item.name),
    createElement("p", { className: "mt-1 text-xs text-muted" }, item.category),
    createElement("div", { className: "mt-4 flex items-center justify-between" }, createElement("b", null, money(item.price)), createElement("span", { className: "grid size-6 place-items-center rounded bg-brand/10 text-brand" }, createElement(Plus, { size: 15 })))
  ))), !filtered.length ? createElement(EmptyState, { description: "No menu items match these filters." }) : null), createElement(Card, { className: "h-fit" }, createElement(
    CardHeader,
    {
      title: "Current Order",
      subtitle: `${items.reduce((sum, item) => sum + item.quantity, 0)} items`,
      action: createElement(
        "button",
        {
          "aria-label": "Clear order",
          disabled: !items.length,
          onClick: () => {
            setCart({});
            notify("Order cleared.");
          },
          className: "rounded p-1.5 text-muted hover:text-danger disabled:opacity-40"
        },
        createElement(Trash2, { size: 16 })
      )
    }
  ), createElement("div", { className: "border-b border-ui p-4" }, createElement("label", { className: "flex items-center justify-between gap-4 text-xs text-muted" }, "Table", createElement(
    "select",
    {
      "aria-label": "Order table",
      className: "field w-24",
      value: table,
      onChange: (event) => setTable(event.target.value)
    },
    Array.from({ length: 28 }, (_, index) => createElement("option", { key: index }, String(index + 1).padStart(2, "0")))
  ))), createElement("div", { className: "thin-scrollbar max-h-[420px] overflow-y-auto p-4" }, items.map((item) => createElement(
    "div",
    {
      key: item.id,
      className: "mb-3 flex items-center gap-3 rounded bg-[var(--panel-2)] p-3"
    },
    createElement("span", { className: "text-2xl" }, item.emoji),
    createElement("div", { className: "min-w-0 flex-1" }, createElement("p", { className: "truncate text-xs font-medium" }, item.name), createElement("p", { className: "mt-1 text-[11px] text-muted" }, money(item.price))),
    createElement("div", { className: "flex items-center gap-1" }, createElement(
      "button",
      {
        "aria-label": `Decrease ${item.name}`,
        onClick: () => update(item.id, -1),
        className: "grid size-6 place-items-center rounded border border-ui"
      },
      createElement(Minus, { size: 12 })
    ), createElement("span", { className: "w-5 text-center text-xs" }, item.quantity), createElement(
      "button",
      {
        "aria-label": `Increase ${item.name}`,
        onClick: () => update(item.id, 1),
        className: "grid size-6 place-items-center rounded border border-ui"
      },
      createElement(Plus, { size: 12 })
    ))
  )), !items.length ? createElement(
    EmptyState,
    {
      title: "Your order is empty",
      description: "Select a menu item to get started."
    }
  ) : null), createElement("div", { className: "space-y-3 border-t border-ui p-4 text-sm" }, createElement("p", { className: "flex justify-between text-muted" }, createElement("span", null, "Subtotal"), createElement("span", null, money(subtotal))), createElement("p", { className: "flex justify-between text-muted" }, createElement("span", null, "Tax 8%"), createElement("span", null, money(total - subtotal))), createElement("p", { className: "flex justify-between border-t border-ui pt-3 text-lg font-semibold" }, createElement("span", null, "Total"), createElement("span", null, money(total))), createElement(
    Button,
    {
      disabled: !items.length,
      className: "w-full",
      onClick: () => setCheckout(true)
    },
    createElement(CreditCard, { size: 16 }),
    "Pay now"
  )))), checkout ? createElement(
    RecordEditor,
    {
      title: "Checkout",
      description: `Table ${table} \xB7 ${money(total)}. Record this order and its payment method.`,
      submitLabel: "Complete order",
      fields: [
        {
          name: "customer",
          label: "Customer name",
          initial: "Walk-in guest"
        },
        {
          name: "method",
          label: "Payment method",
          options: ["Cash", "Card (record only)"]
        }
      ],
      onClose: () => setCheckout(false),
      onSubmit: (values) => {
        const id = `ORD-${createId().slice(0, 6).toUpperCase()}`;
        const summary = items.map((item) => `${item.quantity}\xD7 ${item.name}`).join(", ");
        setOrders((orders) => [
          ...orders,
          {
            id,
            customer: values.customer,
            channel: `Dine-in \xB7 Table ${table}`,
            items: summary,
            status: "Placed"
          }
        ]);
        const text = [
          `${appConfig.name} receipt`,
          id,
          `Table ${table}`,
          `Customer: ${values.customer}`,
          "",
          ...items.map(
            (item) => `${item.quantity} x ${item.name}  ${money(item.price * item.quantity)}`
          ),
          "",
          `Subtotal: ${money(subtotal)}`,
          `Tax: ${money(total - subtotal)}`,
          `Total: ${money(total)}`,
          `Payment method: ${values.method}`
        ].join("\n");
        setReceipt({ id, text, total });
        setCheckout(false);
        setCart({});
        notify("Order saved and added to the kitchen pipeline.");
      }
    }
  ) : null, receipt ? createElement(Modal, { title: "Order complete", onClose: () => setReceipt(null) }, createElement("div", { className: "text-center" }, createElement(CheckCircle2, { className: "mx-auto text-success", size: 40 }), createElement("p", { className: "mt-3 text-2xl font-semibold" }, money(receipt.total)), createElement("p", { className: "mt-1 text-xs text-muted" }, receipt.id)), createElement("pre", { className: "my-5 overflow-auto whitespace-pre-wrap rounded bg-[var(--panel-2)] p-4 text-xs leading-6" }, receipt.text), createElement("div", { className: "flex justify-end gap-2" }, createElement(Button, { variant: "secondary", onClick: () => setReceipt(null) }, "Close"), createElement(
    Button,
    {
      onClick: () => downloadText(`${receipt.id}.txt`, receipt.text)
    },
    createElement(Download, { size: 14 }),
    "Download receipt"
  ))) : null);
}
