import { createElement, Fragment } from '../../runtime/dom.js';
import { useId, useRef, useState } from "../../runtime/dom.js";
import { useUI } from "../ui-provider.js";
export function Tabs({
  label,
  items
}) {
  const id = useId();
  const { direction } = useUI();
  const [active, setActive] = useState(0);
  const buttons = useRef([]);
  return createElement("div", null, createElement(
    "div",
    {
      role: "tablist",
      "aria-label": label,
      className: "flex flex-wrap gap-2 border-b border-ui pb-3"
    },
    items.map((item, index) => createElement(
      "button",
      {
        key: item.id,
        ref: (element) => {
          buttons.current[index] = element;
        },
        role: "tab",
        id: `${id}-${item.id}-tab`,
        "aria-selected": active === index,
        "aria-controls": `${id}-${item.id}-panel`,
        tabIndex: active === index ? 0 : -1,
        className: `rounded px-4 py-2 text-xs ${active === index ? "bg-brand/10 text-brand" : "text-muted hover:bg-[var(--panel-2)]"}`,
        onClick: () => setActive(index),
        onKeyDown: (event) => {
          let next = active;
          if (event.key === "Home") next = 0;
          else if (event.key === "End") next = items.length - 1;
          else if (["ArrowLeft", "ArrowRight"].includes(event.key))
            next = (active + (event.key === (direction === "rtl" ? "ArrowLeft" : "ArrowRight") ? 1 : -1) + items.length) % items.length;
          else return;
          event.preventDefault();
          setActive(next);
          buttons.current[next]?.focus();
        }
      },
      item.label
    ))
  ), items.map((item, index) => createElement(
    "div",
    {
      key: item.id,
      role: "tabpanel",
      id: `${id}-${item.id}-panel`,
      "aria-labelledby": `${id}-${item.id}-tab`,
      hidden: active !== index,
      tabIndex: 0,
      className: "pt-5 text-sm leading-6"
    },
    item.content
  )));
}
export function Accordion({
  items
}) {
  return createElement("div", { className: "space-y-3" }, items.map((item) => createElement(
    "details",
    {
      key: item.title,
      className: "rounded border border-ui bg-[var(--panel)] p-4"
    },
    createElement("summary", { className: "cursor-pointer text-sm font-medium marker:text-brand" }, item.title),
    createElement("div", { className: "mt-3 text-sm leading-6 text-muted" }, item.content)
  )));
}
export function TooltipHint({
  text,
  children
}) {
  const id = useId();
  const [hovered, setHovered] = useState(false), [focused, setFocused] = useState(false), [dismissed, setDismissed] = useState(false);
  const open = (hovered || focused) && !dismissed;
  return createElement(
    "span",
    {
      className: "relative inline-flex",
      onMouseEnter: () => {
        setHovered(true);
        setDismissed(false);
      },
      onMouseLeave: () => setHovered(false)
    },
    createElement(
      "button",
      {
        type: "button",
        "aria-describedby": open ? id : void 0,
        className: "rounded border border-ui p-3 text-xs hover:border-brand",
        onFocus: () => {
          setFocused(true);
          setDismissed(false);
        },
        onBlur: () => setFocused(false),
        onKeyDown: (event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            setDismissed(true);
          }
        },
        onClick: () => {
          setFocused(true);
          setDismissed(false);
        }
      },
      children
    ),
    open && createElement(
      "span",
      {
        role: "tooltip",
        id,
        className: "pattern-tooltip",
        onMouseEnter: () => setHovered(true)
      },
      text
    )
  );
}
