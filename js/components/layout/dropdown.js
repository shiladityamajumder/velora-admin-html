import { createElement, Fragment } from '../../runtime/dom.js';
import { useEffect, useRef } from "../../runtime/dom.js";
export function Dropdown({
  children,
  className
}) {
  const ref = useRef(null);
  useEffect(() => {
    const outside = (event) => {
      if (!ref.current?.contains(event.target))
        ref.current?.removeAttribute("open");
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  return createElement(
    "details",
    {
      ref,
      className,
      onKeyDown: (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          ref.current?.removeAttribute("open");
          ref.current?.querySelector("summary")?.focus();
        }
        if (["ArrowDown", "ArrowUp"].includes(event.key)) {
          event.preventDefault();
          ref.current?.setAttribute("open", "");
          const items = Array.from(
            ref.current?.querySelectorAll("a,button") ?? []
          );
          if (!items.length) return;
          const index = items.indexOf(document.activeElement);
          items[Math.max(
            0,
            Math.min(
              items.length - 1,
              index + (event.key === "ArrowDown" ? 1 : -1)
            )
          )]?.focus();
        }
      }
    },
    children
  );
}
