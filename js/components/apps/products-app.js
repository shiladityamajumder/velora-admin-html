import { createElement, Fragment } from '../../runtime/dom.js';
import { useState } from "../../runtime/dom.js";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Pencil,
  Plus,
  Search,
  Trash2
} from "../../vendor/icons.js";
import { Button, Card, PageHeader } from "../primitives.js";
import { EmptyState, Modal } from "../interactions.js";
import { ProductEditor, ProductImporter } from "../catalog-editors.js";
import { useUI } from "../ui-provider.js";
import { usePersistentState, exportCsv } from "../../lib/client-store.js";
import {
  initialProducts,
  money,
  productStatus
} from "../../lib/records.js";
export function ProductsApp() {
  const [products, setProducts] = usePersistentState(
    "products",
    initialProducts
  );
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [status, setStatus] = useState("All statuses");
  const [page, setPage] = useState(1);
  const [editor, setEditor] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [remove, setRemove] = useState(null);
  const { notify } = useUI();
  const filtered = products.filter(
    (product) => `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase()) && (category === "All categories" || product.category === category) && (status === "All statuses" || productStatus(product) === status)
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / 6));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * 6, currentPage * 6);
  return createElement(Fragment, null, createElement(
    PageHeader,
    {
      title: "Products",
      description: `${products.length} products in your catalog.`,
      actions: createElement(Fragment, null, createElement(Button, { variant: "secondary", onClick: () => setImportOpen(true) }, "Import CSV"), createElement(
        Button,
        {
          variant: "secondary",
          onClick: () => exportCsv(
            "products.csv",
            ["name", "category", "price", "stock"],
            filtered.map((product) => [
              product.name,
              product.category,
              product.price,
              product.stock
            ])
          )
        },
        createElement(Download, { size: 14 }),
        "Export"
      ), createElement(Button, { onClick: () => setEditor("new") }, createElement(Plus, { size: 14 }), "Add product"))
    }
  ), createElement(Card, null, createElement("div", { className: "flex flex-wrap gap-3 border-b border-ui p-4" }, createElement("div", { className: "relative min-w-40 flex-1" }, createElement(Search, { className: "absolute start-3 top-3 text-muted", size: 16 }), createElement(
    "input",
    {
      "aria-label": "Search products",
      value: query,
      onChange: (event) => {
        setQuery(event.target.value);
        setPage(1);
      },
      className: "field ps-9",
      placeholder: "Search products..."
    }
  )), createElement(
    "select",
    {
      "aria-label": "Product category",
      className: "field w-auto",
      value: category,
      onChange: (event) => {
        setCategory(event.target.value);
        setPage(1);
      }
    },
    createElement("option", null, "All categories"),
    [...new Set(products.map((product) => product.category))].map(
      (value) => createElement("option", { key: value }, value)
    )
  ), createElement(
    "select",
    {
      "aria-label": "Product status",
      className: "field w-auto",
      value: status,
      onChange: (event) => {
        setStatus(event.target.value);
        setPage(1);
      }
    },
    ["All statuses", "Active", "Low stock", "Out of stock"].map(
      (value) => createElement("option", { key: value }, value)
    )
  )), createElement("div", { className: "overflow-x-auto" }, createElement("table", { className: "table-ui min-w-[700px]" }, createElement("thead", null, createElement("tr", null, [
    "Product",
    "Category",
    "Price",
    "Stock",
    "Status",
    "Actions"
  ].map((header) => createElement("th", { key: header }, header)))), createElement("tbody", null, visible.map((product) => createElement("tr", { key: product.id }, createElement("td", null, createElement("div", { className: "flex items-center gap-3" }, createElement("span", { className: "grid size-10 shrink-0 place-items-center rounded-md bg-brand/5 text-2xl" }, product.emoji), createElement("b", { className: "text-xs" }, product.name))), createElement("td", null, product.category), createElement("td", { className: "font-semibold" }, money(product.price)), createElement("td", null, product.stock.toLocaleString()), createElement("td", null, createElement(
    "span",
    {
      className: `rounded px-2 py-1 text-[10px] ${product.stock === 0 ? "bg-danger/10 text-danger" : product.stock < 25 ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`
    },
    productStatus(product)
  )), createElement("td", null, createElement("div", { className: "flex gap-2" }, createElement(
    "button",
    {
      "aria-label": `Edit ${product.name}`,
      onClick: () => setEditor(product),
      className: "p-1.5 text-muted hover:text-brand"
    },
    createElement(Pencil, { size: 15 })
  ), createElement(
    "button",
    {
      "aria-label": `Delete ${product.name}`,
      onClick: () => setRemove(product),
      className: "p-1.5 text-muted hover:text-danger"
    },
    createElement(Trash2, { size: 15 })
  ))))))), !visible.length ? createElement(EmptyState, { description: "No products match the current filters." }) : null), createElement("div", { className: "flex flex-wrap items-center justify-between gap-3 border-t border-ui p-4" }, createElement("p", { className: "text-xs text-muted" }, "Showing ", filtered.length ? (currentPage - 1) * 6 + 1 : 0, "\u2013", Math.min(currentPage * 6, filtered.length), " of ", filtered.length, " ", "products"), createElement("div", { className: "flex items-center gap-2" }, createElement(
    Button,
    {
      variant: "secondary",
      "aria-label": "Previous products page",
      disabled: currentPage === 1,
      onClick: () => setPage(currentPage - 1)
    },
    createElement(ChevronLeft, { size: 14 })
  ), createElement("span", { className: "text-xs" }, currentPage, " / ", pageCount), createElement(
    Button,
    {
      variant: "secondary",
      "aria-label": "Next products page",
      disabled: currentPage === pageCount,
      onClick: () => setPage(currentPage + 1)
    },
    createElement(ChevronRight, { size: 14 })
  )))), editor ? createElement(
    ProductEditor,
    {
      product: editor === "new" ? void 0 : editor,
      onClose: () => setEditor(null)
    }
  ) : null, importOpen ? createElement(ProductImporter, { onClose: () => setImportOpen(false) }) : null, remove ? createElement(
    Modal,
    {
      title: "Delete product",
      description: "This will remove the product from the shared catalog.",
      onClose: () => setRemove(null)
    },
    createElement("p", { className: "text-sm" }, "Delete ", remove.name, "?"),
    createElement("div", { className: "mt-5 flex justify-end gap-2" }, createElement(Button, { variant: "secondary", onClick: () => setRemove(null) }, "Cancel"), createElement(
      Button,
      {
        variant: "danger",
        onClick: () => {
          setProducts(
            (items) => items.filter((item) => item.id !== remove.id)
          );
          setRemove(null);
          notify("Product deleted.");
        }
      },
      "Delete product"
    ))
  ) : null);
}
