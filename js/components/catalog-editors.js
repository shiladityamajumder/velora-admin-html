import { createElement, Fragment } from '../runtime/dom.js';
import { createId } from "../lib/id.js";
import { usePersistentState } from "../lib/client-store.js";
import {
  initialProducts,
  initialInvoices,
  numberFromInput,
  localDate
} from "../lib/records.js";
import { RecordEditor, CsvImporter } from "./record-editor.js";
import { useUI } from "./ui-provider.js";
export function ProductEditor({
  product,
  onClose
}) {
  const [, setProducts] = usePersistentState("products", initialProducts);
  const { notify } = useUI();
  return createElement(
    RecordEditor,
    {
      title: product ? "Edit product" : "Add product",
      onClose,
      fields: [
        { name: "name", label: "Product name", initial: product?.name },
        { name: "category", label: "Category", initial: product?.category },
        {
          name: "price",
          label: "Price ($)",
          type: "number",
          min: 0,
          initial: product?.price
        },
        {
          name: "stock",
          label: "Stock quantity",
          type: "number",
          min: 0,
          step: "1",
          initial: product?.stock ?? 0
        }
      ],
      onSubmit: (values) => {
        const stock = numberFromInput(values.stock, "Stock");
        if (!Number.isInteger(stock))
          throw new Error("Stock must be a whole number.");
        const saved = {
          id: product?.id ?? createId(),
          name: values.name,
          category: values.category,
          price: numberFromInput(values.price, "Price"),
          stock,
          rating: product?.rating ?? 0,
          emoji: product?.emoji ?? "\u{1F4E6}"
        };
        setProducts(
          (items) => product ? items.map((item) => item.id === product.id ? saved : item) : [...items, saved]
        );
        onClose();
        notify(product ? "Product updated." : "Product added.");
      }
    }
  );
}
export function ProductImporter({ onClose }) {
  const [, setProducts] = usePersistentState("products", initialProducts);
  return createElement(
    CsvImporter,
    {
      title: "Import products",
      headers: ["name", "category", "price", "stock"],
      onClose,
      onImport: (records) => {
        const imported = records.map((record, index) => {
          if (!record.name || !record.category)
            throw new Error(
              `Row ${index + 2}: name and category are required.`
            );
          const stock = numberFromInput(record.stock, `Row ${index + 2} stock`);
          if (!Number.isInteger(stock))
            throw new Error(`Row ${index + 2}: stock must be a whole number.`);
          return {
            id: createId(),
            name: record.name,
            category: record.category,
            price: numberFromInput(record.price, `Row ${index + 2} price`),
            stock,
            rating: 0,
            emoji: "\u{1F4E6}"
          };
        });
        setProducts((items) => [...items, ...imported]);
        return imported.length;
      }
    }
  );
}
export function InvoiceEditor({
  invoice,
  onClose
}) {
  const [, setInvoices] = usePersistentState("invoices", initialInvoices);
  const { notify } = useUI();
  return createElement(
    RecordEditor,
    {
      title: invoice ? "Edit invoice" : "Create invoice",
      onClose,
      fields: [
        { name: "client", label: "Client", initial: invoice?.client },
        {
          name: "date",
          label: "Invoice date",
          type: "date",
          initial: invoice?.date ?? localDate()
        },
        {
          name: "amount",
          label: "Amount ($)",
          type: "number",
          min: 0.01,
          initial: invoice?.amount
        },
        {
          name: "status",
          label: "Status",
          options: ["Pending", "Paid", "Overdue"],
          initial: invoice?.status ?? "Pending"
        }
      ],
      onSubmit: (values) => {
        const saved = {
          id: invoice?.id ?? `INV-${createId().slice(0, 8).toUpperCase()}`,
          client: values.client,
          date: values.date,
          amount: numberFromInput(values.amount, "Amount"),
          status: values.status
        };
        setInvoices(
          (items) => invoice ? items.map((item) => item.id === invoice.id ? saved : item) : [saved, ...items]
        );
        onClose();
        notify(invoice ? "Invoice updated." : "Invoice created.");
      }
    }
  );
}
