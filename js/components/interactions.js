import { createElement, Fragment } from '../runtime/dom.js';
import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef
} from "../runtime/dom.js";
import { useI18n } from "../i18n/provider.js";
import { X } from "../vendor/icons.js";
import { useUI } from "./ui-provider.js";
export function Modal({
  title,
  description,
  children,
  onClose,
  drawer = false,
  side = "end"
}) {
  const ref = useRef(null);
  const { t } = useI18n();
  const id = useId();
  const { direction } = useUI();
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement;
    dialog?.showModal();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = originalOverflow;
      previous?.focus();
    };
  }, []);
  return createElement(
    "dialog",
    {
      ref,
      dir: direction,
      "aria-labelledby": id,
      "aria-describedby": description ? `${id}-description` : void 0,
      className: `modal-dialog ${drawer ? "drawer-dialog" : ""} ${drawer && side === "start" ? "drawer-start" : ""}`,
      onCancel: (event) => {
        event.preventDefault();
        onClose();
      },
      onClick: (event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)
          onClose();
      }
    },
    createElement("div", { className: "flex items-start justify-between gap-4 border-b border-ui p-5" }, createElement("div", null, createElement("h2", { id, className: "text-base font-semibold" }, t(title)), description ? createElement("p", { id: `${id}-description`, className: "mt-1 text-xs text-muted" }, t(description)) : null), createElement(
      "button",
      {
        type: "button",
        "aria-label": `Close ${title}`,
        className: "rounded-md p-1.5 text-muted hover:bg-[var(--panel-2)]",
        onClick: onClose
      },
      createElement(X, { size: 18 })
    )),
    createElement("div", { className: "p-5" }, children)
  );
}
export function Toggle({
  checked,
  onChange,
  label
}) {
  return createElement(
    "button",
    {
      type: "button",
      role: "switch",
      "aria-checked": checked,
      "aria-label": label,
      onClick: () => onChange(!checked),
      className: `relative h-[18px] w-8 shrink-0 rounded-full border transition ${checked ? "border-brand bg-brand" : "border-ui bg-[var(--panel-2)]"}`
    },
    createElement(
      "span",
      {
        className: `absolute top-[2px] size-3 rounded-full shadow-sm transition-all ${checked ? "start-[17px] bg-white" : "start-[3px] bg-[var(--muted)]"}`
      }
    )
  );
}
export function EmptyState({
  title = "No results",
  description = "Try another search or add a new item."
}) {
  const { t } = useI18n();
  return createElement("div", { className: "px-5 py-12 text-center" }, createElement("p", { className: "font-medium" }, t(title)), createElement("p", { className: "mt-1 text-xs text-muted" }, t(description)));
}
export function FormField({
  label,
  children
}) {
  const { t } = useI18n();
  const id = useId();
  if (isValidElement(children) && typeof children.type === "string" && ["input", "select", "textarea"].includes(children.type)) {
    return createElement("div", null, createElement("label", { htmlFor: id, className: "field-label" }, t(label)), cloneElement(children, { id }));
  }
  return createElement("label", { className: "block" }, createElement("span", { className: "field-label" }, t(label)), children);
}
