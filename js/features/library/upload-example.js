import { createElement, Fragment } from '../../runtime/dom.js';
import { useEffect, useRef, useState } from "../../runtime/dom.js";
import { UploadCloud, X, FileText } from "../../vendor/icons.js";
import { Image as Image } from "../../runtime/navigation.js";
import { Card } from "../../components/primitives.js";
import { useI18n } from "../../i18n/provider.js";
export function UploadExample() {
  const { t } = useI18n();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const urls = useRef(new Set());
  useEffect(() => {
    const allocated = urls.current;
    return () => allocated.forEach((url) => URL.revokeObjectURL(url));
  }, []);
  function add(files) {
    setError("");
    if (files.some(
      (file) => file.size > 3 * 1024 * 1024 || !/\.(png|jpe?g|webp|gif|pdf|csv|txt)$/i.test(file.name)
    )) {
      setError(t("Use images, PDF, CSV or text files up to 3 MB."));
      return;
    }
    const next = files.map((file) => {
      const url = URL.createObjectURL(file);
      urls.current.add(url);
      return { file, url };
    });
    setItems((previous) => [...previous, ...next]);
  }
  return createElement(Card, { className: "p-5" }, createElement(
    "label",
    {
      className: "relative flex min-h-44 cursor-pointer flex-col items-center justify-center gap-3 rounded border-2 border-dashed border-ui bg-[var(--panel-2)] p-6 text-center hover:border-brand",
      onDragOver: (event) => event.preventDefault(),
      onDrop: (event) => {
        event.preventDefault();
        add(Array.from(event.dataTransfer.files));
      }
    },
    createElement(UploadCloud, { size: 30, className: "text-brand" }),
    createElement("span", { className: "text-sm font-medium" }, t("Drop files here or browse")),
    createElement("span", { className: "text-xs text-muted" }, t("Use images, PDF, CSV or text files up to 3 MB.")),
    createElement(
      "input",
      {
        "aria-label": t("Upload files"),
        type: "file",
        multiple: true,
        accept: ".png,.jpg,.jpeg,.webp,.gif,.pdf,.csv,.txt",
        className: "absolute inset-0 opacity-0",
        onChange: (event) => {
          add(Array.from(event.target.files ?? []));
          event.target.value = "";
        }
      }
    )
  ), error && createElement("p", { role: "alert", className: "mt-3 text-xs text-danger" }, error), createElement("div", { className: "mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3" }, items.map((item) => createElement(
    "div",
    {
      key: item.url,
      className: "relative flex min-w-0 items-center gap-3 rounded border border-ui p-3"
    },
    item.file.type.startsWith("image/") ? createElement(
      Image,
      {
        src: item.url,
        alt: item.file.name,
        width: 56,
        height: 56,
        unoptimized: true,
        className: "size-14 rounded object-cover"
      }
    ) : createElement(FileText, { size: 30, className: "shrink-0 text-muted" }),
    createElement("div", { className: "min-w-0 flex-1" }, createElement("p", { className: "truncate text-xs font-medium" }, item.file.name), createElement("p", { className: "mt-1 text-[10px] text-muted" }, Math.ceil(item.file.size / 1024), " KB"), createElement(
      "a",
      {
        href: item.url,
        download: item.file.name,
        className: "mt-2 inline-block text-xs text-brand"
      },
      t("Download")
    )),
    createElement(
      "button",
      {
        "aria-label": t("Remove") + " " + item.file.name,
        className: "p-1 text-muted",
        onClick: () => {
          URL.revokeObjectURL(item.url);
          urls.current.delete(item.url);
          setItems(
            (previous) => previous.filter((entry) => entry.url !== item.url)
          );
        }
      },
      createElement(X, { size: 15 })
    )
  ))));
}
