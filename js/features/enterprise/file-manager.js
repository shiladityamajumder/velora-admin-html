import { createElement, Fragment } from '../../runtime/dom.js';
import { appConfig } from "../../config/app.js";
import { useState } from "../../runtime/dom.js";
import { z } from "../../vendor/schema.js";
import {
  Folder,
  Upload,
  Download,
  Pencil,
  Trash2,
  FileText
} from "../../vendor/icons.js";
import { MockRepository } from "../../services/repository.js";
import { useRepository } from "../../hooks/use-repository.js";
import { useAuth } from "../../hooks/use-auth.js";
import { useI18n } from "../../i18n/provider.js";
import { useUI } from "../../components/ui-provider.js";
import { downloadText } from "../../lib/client-store.js";
import { PageHeader, Card, Button } from "../../components/primitives.js";
import {
  LoadingState,
  ErrorState,
  DataEmptyState
} from "../../components/data/states.js";
import { Confirmation } from "../../components/data/confirmation.js";
import { Modal } from "../../components/interactions.js";
const schema = z.object({
  id: z.string(),
  createdAt: z.string(),
  name: z.string().trim().min(1),
  status: z.string(),
  folder: z.string(),
  mime: z.string(),
  size: z.number().nonnegative(),
  content: z.string(),
  binary: z.boolean()
});
const service = new MockRepository(
  "files",
  [
    {
      id: "demo-file-1",
      createdAt: "2026-10-03T08:00:00Z",
      name: "demo-catalogue.csv",
      status: "Active",
      folder: "Catalog",
      mime: "text/csv",
      size: 44,
      content: "name,sku\nDemo wellness pack,DEMO-SKU-1001",
      binary: false
    },
    {
      id: "demo-file-2",
      createdAt: "2026-10-03T08:00:00Z",
      name: "demo-report.txt",
      status: "Active",
      folder: "Reports",
      mime: "text/plain",
      size: 54,
      content: `${appConfig.name} synthetic operations report
All data is demo data.`,
      binary: false
    }
  ],
  (value) => schema.parse(value)
);
export function FileManager() {
  const { t, number, date } = useI18n();
  const { notify } = useUI();
  const { has } = useAuth();
  const { data, loading, error, reload } = useRepository(service);
  const [folder, setFolder] = useState("All");
  const [query, setQuery] = useState("");
  const [remove, setRemove] = useState(null);
  const [rename, setRename] = useState(null);
  const canManage = has("products.update");
  const folders = [
    "All",
    ...new Set([
      "Catalog",
      "Reports",
      "Documents",
      ...data.map((file) => file.folder)
    ])
  ];
  const rows = data.filter(
    (file) => (folder === "All" || file.folder === folder) && file.name.toLowerCase().includes(query.toLowerCase())
  );
  return createElement(Fragment, null, createElement(
    PageHeader,
    {
      title: t("File Manager"),
      description: t(
        "Upload, organize, rename and download local demo files."
      ),
      actions: canManage && createElement("label", { className: "inline-flex cursor-pointer items-center gap-2 rounded bg-brand px-3 py-2 text-xs text-white" }, createElement(Upload, { size: 14 }), t("Upload"), createElement(
        "input",
        {
          type: "file",
          multiple: true,
          "aria-label": t("Upload"),
          className: "max-w-40 text-xs",
          onChange: async (event) => {
            const files = Array.from(event.target.files ?? []);
            try {
              for (const file of files) {
                if (file.size > 2 * 1024 * 1024)
                  throw new Error("File must be under 2 MB");
                const binary = !file.type.startsWith("text/") && !["application/json", "text/csv"].includes(file.type);
                const content = binary ? await new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(String(reader.result));
                  reader.onerror = reject;
                  reader.readAsDataURL(file);
                }) : await file.text();
                await service.create({
                  name: file.name,
                  status: "Active",
                  folder: folder === "All" ? "Documents" : folder,
                  mime: file.type,
                  size: file.size,
                  content,
                  binary
                });
              }
              notify(t("Saved successfully"));
            } catch (error2) {
              notify(
                error2 instanceof Error ? t(error2.message) : t("Something went wrong"),
                "error"
              );
            }
            event.target.value = "";
          }
        }
      ))
    }
  ), createElement("div", { className: "grid gap-4 lg:grid-cols-[180px_1fr]" }, createElement(Card, { className: "h-fit p-3" }, folders.map((item) => createElement(
    "button",
    {
      key: item,
      onClick: () => setFolder(item),
      className: `flex w-full items-center gap-2 rounded p-3 text-start text-xs ${folder === item ? "bg-brand/10 text-brand" : "text-muted"}`
    },
    createElement(Folder, { size: 15 }),
    t(item)
  ))), createElement("div", null, createElement("label", { className: "mb-4 block" }, createElement("span", { className: "field-label" }, t("Search")), createElement(
    "input",
    {
      className: "field",
      value: query,
      onChange: (event) => setQuery(event.target.value)
    }
  )), loading ? createElement(LoadingState, null) : error ? createElement(ErrorState, { message: error, retry: reload }) : createElement("div", { className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3" }, rows.map((file) => createElement(Card, { key: file.id, className: "p-4" }, createElement(FileText, { size: 28, className: "mb-4 text-brand" }), createElement("h2", { className: "break-all text-sm font-medium" }, file.name), createElement("p", { className: "mt-2 text-xs text-muted" }, number(file.size), " B \xB7 ", date(file.createdAt)), createElement("p", { className: "my-2 text-xs text-muted" }, t(file.folder)), createElement("div", { className: "flex gap-1" }, createElement(
    Button,
    {
      variant: "ghost",
      "aria-label": t("Download") + " " + file.name,
      onClick: () => {
        if (file.binary) {
          const link = document.createElement("a");
          link.href = file.content;
          link.download = file.name;
          link.click();
        } else downloadText(file.name, file.content, file.mime);
      }
    },
    createElement(Download, { size: 15 })
  ), canManage && createElement(Fragment, null, createElement(
    Button,
    {
      variant: "ghost",
      "aria-label": t("Edit") + " " + file.name,
      onClick: () => setRename(file)
    },
    createElement(Pencil, { size: 15 })
  ), createElement(
    Button,
    {
      variant: "ghost",
      "aria-label": t("Delete") + " " + file.name,
      onClick: () => setRemove(file)
    },
    createElement(Trash2, { size: 15 })
  )))))), !loading && !rows.length && createElement(DataEmptyState, null))), remove && createElement(
    Confirmation,
    {
      title: "Delete",
      onClose: () => setRemove(null),
      onConfirm: async () => {
        await service.delete(remove.id);
        notify(t("Deleted successfully"));
      }
    }
  ), rename && createElement(Modal, { title: t("Edit"), onClose: () => setRename(null) }, createElement(
    "form",
    {
      className: "space-y-4",
      onSubmit: async (event) => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        await service.update(rename.id, {
          name: String(values.get("name")),
          folder: String(values.get("folder"))
        });
        setRename(null);
        notify(t("Saved successfully"));
      }
    },
    createElement("label", { className: "block" }, createElement("span", { className: "field-label" }, t("Name")), createElement(
      "input",
      {
        required: true,
        name: "name",
        className: "field",
        defaultValue: rename.name
      }
    )),
    createElement("label", { className: "block" }, createElement("span", { className: "field-label" }, t("Folder")), createElement(
      "input",
      {
        required: true,
        name: "folder",
        className: "field",
        defaultValue: rename.folder
      }
    )),
    createElement(Button, { type: "submit" }, t("Save"))
  )));
}
