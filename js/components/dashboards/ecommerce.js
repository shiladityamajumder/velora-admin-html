import { createElement, Fragment } from '../../runtime/dom.js';
import { Link as Link } from "../../runtime/navigation.js";
import { useState } from "../../runtime/dom.js";
import {
  Activity,
  Boxes,
  ChevronRight,
  Clock3,
  Download,
  Info,
  Pencil,
  Plus,
  ShoppingCart,
  Star,
  Trash2
} from "../../vendor/icons.js";
import { Button, Card, CardHeader } from "../primitives.js";
import { TrendAreaChart } from "../charts.js";
import { Modal, EmptyState } from "../interactions.js";
import { ProductEditor, ProductImporter } from "../catalog-editors.js";
import { useUI } from "../ui-provider.js";
import { exportCsv, usePersistentState } from "../../lib/client-store.js";
import {
  initialProducts,
  money,
  productStatus
} from "../../lib/records.js";
import { StatusBadge, DashboardTitle, Tabs } from "./shared.js";
const salesValues = [
  120,
  160,
  205,
  450,
  310,
  245,
  190,
  380,
  290,
  410,
  500,
  340,
  290,
  320,
  295,
  380,
  410,
  350,
  280,
  310,
  430,
  380,
  300,
  290,
  390,
  425,
  480,
  350,
  295,
  315
];
export function EcommerceDashboard() {
  const [period, setPeriod] = useState("Week");
  const [range, setRange] = useState("30");
  const [products, setProducts] = usePersistentState(
    "products",
    initialProducts
  );
  const [editor, setEditor] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [remove, setRemove] = useState(null);
  const { notify } = useUI();
  const sales = Array.from({ length: Number(range) }, (_, index) => ({
    name: String(index + 1).padStart(2, "0"),
    value: salesValues[index % 30],
    views: Math.round(salesValues[index % 30] * 0.68 + index % 5 * 8)
  }));
  const factor = period === "Week" ? 1 : period === "Month" ? 1.14 : 1.32;
  const inventoryStats = [
    {
      label: "In Stock",
      value: 14250,
      icon: Boxes,
      change: "+6.8%",
      color: "#0ac074"
    },
    {
      label: "Out-of-Stock",
      value: 640,
      icon: Activity,
      change: "-8.2%",
      color: "#ff3d60"
    },
    {
      label: "Pending Restock",
      value: 1280,
      icon: ShoppingCart,
      change: "+11.4%",
      color: "#0bb197"
    },
    {
      label: "Slow Movers",
      value: 1150,
      icon: Clock3,
      change: "-3.5%",
      color: "#fcb92c"
    }
  ];
  return createElement(Fragment, null, createElement(DashboardTitle, { title: "E-Commerce" }), createElement(Card, { className: "mb-6" }, createElement(
    CardHeader,
    {
      title: "Inventory Status",
      subtitle: "Real-time monitoring of stock levels, pending restocks, and warehouse velocity.",
      action: createElement(
        Tabs,
        {
          options: ["Week", "Month", "Year"],
          value: period,
          onChange: setPeriod
        }
      )
    }
  ), createElement("div", { className: "grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4" }, inventoryStats.map((stat) => createElement("div", { key: stat.label, className: "rounded bg-[var(--panel-2)] p-4" }, createElement("p", { className: "flex items-center gap-2 text-xs font-medium text-muted" }, createElement(stat.icon, { size: 15, style: { color: stat.color } }), stat.label), createElement("p", { className: "mt-3 text-2xl font-semibold" }, Math.round(stat.value * factor).toLocaleString()), createElement("div", { className: "mt-1 flex items-center gap-2 text-[10px]" }, createElement(
    "span",
    {
      className: "rounded px-1.5",
      style: { color: stat.color, background: `${stat.color}12` }
    },
    stat.change
  ), createElement("span", { className: "text-muted" }, "vs. previous ", period.toLowerCase()))))), createElement("div", { className: "flex flex-wrap items-center justify-between gap-3 border-t border-ui bg-[var(--panel-2)] px-5 py-3 text-xs" }, createElement("span", { className: "flex items-center gap-2 text-muted" }, createElement(Info, { size: 15, className: "text-info" }), "17,320 products tracked. 82% currently available in stock."), createElement(
    Link,
    {
      href: "/apps/products",
      className: "flex items-center gap-1 font-medium text-brand"
    },
    "Show full inventory ",
    createElement(ChevronRight, { size: 13 })
  ))), createElement(Card, { className: "mb-6" }, createElement(
    CardHeader,
    {
      title: "E-commerce Sales",
      subtitle: "Sales and product views performance over time.",
      action: createElement(
        "select",
        {
          "aria-label": "Sales time range",
          className: "field min-h-8 py-1 text-xs",
          value: range,
          onChange: (event) => setRange(event.target.value)
        },
        createElement("option", { value: "7" }, "Last 7 days"),
        createElement("option", { value: "30" }, "Last 30 days"),
        createElement("option", { value: "90" }, "Last 90 days")
      )
    }
  ), createElement("div", { className: "p-5" }, createElement(
    TrendAreaChart,
    {
      data: sales,
      tertiaryKey: "views",
      height: 310,
      names: ["Sales", "", "Product views"],
      unit: "k"
    }
  ))), createElement("div", { className: "grid gap-6 xl:grid-cols-[1fr_2.3fr]" }, createElement(Card, null, createElement(CardHeader, { title: "Capacity Allocation" }), createElement("div", { className: "p-6" }, createElement("p", { className: "text-4xl font-semibold" }, "86% ", createElement("span", { className: "text-xs text-success" }, "+5.8%")), createElement("p", { className: "mt-1 text-xs text-muted" }, "vs. labor plan"), createElement("div", { className: "my-4 flex gap-1" }, Array.from({ length: 29 }, (_, index) => createElement(
    "div",
    {
      key: index,
      className: `h-7 flex-1 rounded-full ${index < 25 ? "bg-success" : "bg-[var(--line)]"}`
    }
  ))), createElement("div", { className: "space-y-4 text-xs" }, createElement("p", { className: "flex justify-between" }, createElement("span", { className: "text-muted" }, "Queued Orders"), createElement("b", null, "3,840 orders")), createElement("p", { className: "flex justify-between" }, createElement("span", { className: "text-muted" }, "Available capacity"), createElement("b", null, "14%")), createElement("p", { className: "flex justify-between" }, createElement("span", { className: "text-muted" }, "Labor utilization"), createElement("b", null, "86%"))), createElement(
    Button,
    {
      className: "mt-6 w-full",
      variant: "secondary",
      onClick: () => setImportOpen(true)
    },
    "Import inventory"
  ))), createElement(Card, null, createElement(
    CardHeader,
    {
      title: "Product Inventory",
      subtitle: "Stock status and details",
      action: createElement("div", { className: "flex gap-2" }, createElement(Button, { variant: "secondary", onClick: () => setEditor("new") }, createElement(Plus, { size: 14 }), "Add Product"), createElement(
        Button,
        {
          onClick: () => exportCsv(
            "products.csv",
            ["name", "category", "price", "stock"],
            products.map((product) => [
              product.name,
              product.category,
              product.price,
              product.stock
            ])
          )
        },
        createElement(Download, { size: 14 }),
        "Export"
      ))
    }
  ), createElement("div", { className: "overflow-x-auto" }, createElement("table", { className: "table-ui min-w-[620px]" }, createElement("thead", null, createElement("tr", null, [
    "Product",
    "Stock",
    "Price",
    "Ratings",
    "Status",
    "Actions"
  ].map((header) => createElement("th", { key: header }, header)))), createElement("tbody", null, products.map((product) => createElement("tr", { key: product.id }, createElement("td", null, createElement("div", { className: "flex items-center gap-3" }, createElement("span", { className: "grid size-9 shrink-0 place-items-center rounded-full bg-warning/10 text-xl" }, product.emoji), createElement("div", null, createElement("p", { className: "font-medium" }, product.name), createElement("p", { className: "text-[10px] text-muted" }, product.category)))), createElement("td", null, product.stock, createElement("span", { className: "block text-[10px] text-muted" }, "units")), createElement("td", { className: "font-semibold" }, money(product.price)), createElement("td", null, createElement("span", { className: "flex items-center gap-1 text-warning" }, createElement(Star, { size: 13, fill: "currentColor" }), product.rating || "\u2014")), createElement("td", null, createElement(StatusBadge, { status: productStatus(product) })), createElement("td", null, createElement("div", { className: "flex gap-1" }, createElement(
    "button",
    {
      "aria-label": `Edit ${product.name}`,
      onClick: () => setEditor(product),
      className: "rounded p-1.5 text-muted hover:text-brand"
    },
    createElement(Pencil, { size: 14 })
  ), createElement(
    "button",
    {
      "aria-label": `Remove ${product.name}`,
      onClick: () => setRemove(product),
      className: "rounded p-1.5 text-muted hover:text-danger"
    },
    createElement(Trash2, { size: 14 })
  ))))))), !products.length ? createElement(EmptyState, { title: "No products yet" }) : null))), editor ? createElement(
    ProductEditor,
    {
      product: editor === "new" ? void 0 : editor,
      onClose: () => setEditor(null)
    }
  ) : null, importOpen ? createElement(ProductImporter, { onClose: () => setImportOpen(false) }) : null, remove ? createElement(Modal, { title: "Remove product", onClose: () => setRemove(null) }, createElement("p", { className: "text-sm" }, "Remove ", remove.name, " from the catalog?"), createElement("div", { className: "mt-5 flex justify-end gap-2" }, createElement(Button, { variant: "secondary", onClick: () => setRemove(null) }, "Cancel"), createElement(
    Button,
    {
      variant: "danger",
      onClick: () => {
        setProducts(
          (items) => items.filter((item) => item.id !== remove.id)
        );
        setRemove(null);
        notify("Product removed.");
      }
    },
    "Remove product"
  ))) : null);
}
