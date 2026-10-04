import { createElement, Fragment } from '../../runtime/dom.js';
import { useEffect, useState, useRef } from "../../runtime/dom.js";
import { useRouter } from "../../runtime/navigation.js";
import { Search, Command } from "../../vendor/icons.js";
import { useNavigation } from "../../hooks/use-navigation.js";
import { useAuth } from "../../hooks/use-auth.js";
import { useI18n } from "../../i18n/provider.js";
import { useUI } from "../ui-provider.js";
import { can } from "../../lib/permissions.js";
import { modules } from "../../config/modules.js";
import { serviceFor } from "../../services/modules.js";
import { Modal } from "../interactions.js";
import { DataEmptyState } from "../data/states.js";
export function CommandPalette({ onClose }) {
  const groups = useNavigation();
  const { has, role } = useAuth();
  const { t } = useI18n();
  const ui = useUI();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [records, setRecords] = useState([]);
  const list = useRef(null);
  useEffect(() => {
    let active = true;
    Promise.all(
      modules.filter(
        (module) => ["customers", "orders", "products"].includes(module.kind) && can(role, module.view)
      ).map(async (module) => {
        const rows = await serviceFor(module).list();
        return rows.data.map((row) => ({
          label: row.name + " \xB7 " + row.id,
          group: module.title,
          href: `/${module.path}/${row.id}`
        }));
      })
    ).then((results2) => {
      if (active) setRecords(results2.flat());
    });
    return () => {
      active = false;
    };
  }, [role]);
  const commands = [
    { label: "Change Theme", group: "Commands", action: ui.toggleTheme },
    ...has("products.create") ? [
      {
        label: "Create Product",
        group: "Commands",
        href: "/commerce/products/new"
      }
    ] : [],
    ...has("orders.create") ? [
      {
        label: "Create Order",
        group: "Commands",
        href: "/commerce/orders/new"
      }
    ] : []
  ];
  const results = [
    ...commands,
    ...groups.flatMap(
      (group) => group.items.map((item) => ({
        label: t(item.label),
        group: t(group.label),
        href: item.href
      }))
    ),
    ...query ? records : []
  ].filter(
    (item) => `${t(item.label)} ${t(item.group)}`.toLowerCase().includes(query.toLowerCase())
  ).filter(
    (item, index, matches) => matches.findIndex(
      (candidate) => (candidate.href ?? candidate.label) === (item.href ?? item.label)
    ) === index
  ).slice(0, 40);
  const open = (result) => {
    if (result.href) router.push(result.href);
    else result.action?.();
    onClose();
  };
  return createElement(
    Modal,
    {
      title: t("Search workspace"),
      description: t("Use arrow keys and Enter to navigate"),
      onClose
    },
    createElement("div", { className: "relative mb-3" }, createElement(Search, { className: "absolute start-3 top-3 text-muted", size: 17 }), createElement(
      "input",
      {
        role: "combobox",
        "aria-expanded": true,
        "aria-controls": "command-results",
        "aria-activedescendant": results[selected] ? "command-" + selected : void 0,
        "aria-autocomplete": "list",
        "aria-label": t("Search workspace"),
        autoFocus: true,
        className: "field ps-10",
        value: query,
        onChange: (event) => {
          setQuery(event.target.value);
          setSelected(0);
        },
        onKeyDown: (event) => {
          if (["ArrowDown", "ArrowUp"].includes(event.key)) {
            event.preventDefault();
            const next = Math.max(
              0,
              Math.min(
                results.length - 1,
                selected + (event.key === "ArrowDown" ? 1 : -1)
              )
            );
            setSelected(next);
            list.current?.querySelector("#command-" + next)?.scrollIntoView({ block: "nearest" });
          }
          if (event.key === "Enter" && results[selected]) {
            event.preventDefault();
            open(results[selected]);
          }
        }
      }
    )),
    createElement(
      "div",
      {
        ref: list,
        id: "command-results",
        role: "listbox",
        className: "thin-scrollbar max-h-80 overflow-y-auto"
      },
      results.map((item, index) => createElement(
        "button",
        {
          key: item.href ?? item.label,
          role: "option",
          "aria-selected": selected === index,
          id: "command-" + index,
          onMouseEnter: () => setSelected(index),
          onClick: () => open(item),
          className: `flex w-full items-center gap-3 rounded p-3 text-start ${selected === index ? "bg-brand/10 text-brand" : ""}`
        },
        createElement(Command, { size: 16 }),
        createElement("span", null, createElement("span", { className: "block text-xs font-medium" }, t(item.label)), createElement("span", { className: "text-[10px] text-muted" }, t(item.group)))
      )),
      !results.length && createElement(DataEmptyState, null)
    )
  );
}
