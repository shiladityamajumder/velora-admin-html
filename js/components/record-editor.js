import { createElement, Fragment } from '../runtime/dom.js';
import { useI18n } from "../i18n/provider.js";
import { useState } from "../runtime/dom.js";
import { Upload, Download } from "../vendor/icons.js";
import { Modal, FormField } from "./interactions.js";
import { Button } from "./primitives.js";
import { parseCsv, exportCsv } from "../lib/client-store.js";
import { useUI } from "./ui-provider.js";
export function RecordEditor({
  title,
  fields,
  onSubmit,
  onClose,
  submitLabel = "Save",
  description
}) {
  const { t } = useI18n();
  const [error, setError] = useState("");
  return createElement(Modal, { title, description, onClose }, createElement(
    "form",
    {
      className: "space-y-4",
      onSubmit: (event) => {
        event.preventDefault();
        const values = Object.fromEntries(
          [...new FormData(event.currentTarget).entries()].map(
            ([key, value]) => [key, String(value).trim()]
          )
        );
        if (fields.some(
          (field) => field.required !== false && !values[field.name]
        )) {
          setError("Please complete all required fields.");
          return;
        }
        try {
          onSubmit(values);
        } catch (cause) {
          setError(
            cause instanceof Error ? cause.message : "Please check the entered values."
          );
        }
      }
    },
    fields.map((field, index) => createElement(FormField, { label: field.label, key: field.name }, field.options ? createElement(
      "select",
      {
        name: field.name,
        defaultValue: field.initial,
        className: "field"
      },
      field.options.map((option) => createElement("option", { key: option }, option))
    ) : field.type === "textarea" ? createElement(
      "textarea",
      {
        className: "field",
        name: field.name,
        defaultValue: field.initial,
        rows: 3,
        required: field.required !== false
      }
    ) : createElement(
      "input",
      {
        className: "field",
        name: field.name,
        type: field.type ?? "text",
        defaultValue: field.initial,
        autoFocus: index === 0,
        min: field.min,
        max: field.max,
        step: field.step ?? (field.type === "number" ? "any" : void 0),
        required: field.required !== false
      }
    ))),
    error ? createElement(
      "p",
      {
        role: "alert",
        className: "rounded bg-danger/10 p-3 text-xs text-danger"
      },
      t(error)
    ) : null,
    createElement("div", { className: "flex justify-end gap-2 border-t border-ui pt-4" }, createElement(Button, { onClick: onClose, variant: "secondary" }, "Cancel"), createElement(Button, { type: "submit" }, submitLabel))
  ));
}
export function CsvImporter({
  title,
  headers,
  onImport,
  onClose,
  validate
}) {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const { t } = useI18n();
  const [importing, setImporting] = useState(false);
  const [filename, setFilename] = useState("");
  const { notify } = useUI();
  return createElement(
    Modal,
    {
      title,
      description: t("Choose a CSV file to preview and import its records."),
      onClose
    },
    createElement("label", { className: "flex min-h-32 cursor-pointer flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-ui bg-[var(--panel-2)] p-5" }, createElement(Upload, { size: 25, className: "text-brand" }), createElement("span", { className: "text-sm" }, filename || t("Click to choose a CSV file")), createElement(
      "input",
      {
        type: "file",
        accept: ".csv,text/csv",
        "aria-label": "Choose CSV file",
        className: "max-w-full text-xs",
        onChange: async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          setFilename(file.name);
          setError("");
          setRows([]);
          try {
            const [columns, ...records] = parseCsv(await file.text());
            if (!columns || !records.length)
              throw new Error(
                "The file must include a header and at least one record."
              );
            const normalized = columns.map((value) => value.toLowerCase());
            if (headers.some(
              (header) => !normalized.includes(header.toLowerCase())
            ))
              throw new Error(`Required columns: ${headers.join(", ")}.`);
            const mapped = records.map(
              (record) => Object.fromEntries(
                headers.map((header) => [
                  header,
                  record[normalized.indexOf(header.toLowerCase())] ?? ""
                ])
              )
            );
            setRows(validate ? mapped.map(validate) : mapped);
          } catch (cause) {
            setError(
              cause instanceof Error ? cause.message : "The file could not be read."
            );
          }
        }
      }
    )),
    createElement(
      Button,
      {
        variant: "ghost",
        className: "mt-3 text-brand",
        onClick: () => exportCsv("import-template.csv", headers, [])
      },
      createElement(Download, { size: 14 }),
      "Download CSV template"
    ),
    rows.length ? createElement("div", { className: "mt-3 rounded border border-ui p-3" }, createElement("p", { className: "mb-2 text-xs font-semibold" }, rows.length, " ", t("records ready to import")), rows.slice(0, 4).map((row, index) => createElement("p", { key: index, className: "truncate py-1 text-xs text-muted" }, Object.values(row).join(" \xB7 ")))) : null,
    error ? createElement(
      "p",
      {
        role: "alert",
        className: "mt-3 rounded bg-danger/10 p-3 text-xs text-danger"
      },
      t(error)
    ) : null,
    createElement("div", { className: "mt-5 flex justify-end gap-2" }, createElement(Button, { variant: "secondary", onClick: onClose }, "Cancel"), createElement(
      Button,
      {
        disabled: !rows.length || importing,
        onClick: async () => {
          setImporting(true);
          try {
            const count = await onImport(rows);
            onClose();
            notify(`${t("Imported")}: ${count}`);
          } catch (cause) {
            setError(
              cause instanceof Error ? cause.message : "Please check the CSV values."
            );
          } finally {
            setImporting(false);
          }
        }
      },
      t("Import"),
      " ",
      rows.length || "",
      " ",
      t("Records")
    ))
  );
}
