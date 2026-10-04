import { createElement, Fragment } from '../../../runtime/dom.js';
import { createId } from "../../../lib/id.js";
import { useEffect, useRef, useState } from "../../../runtime/dom.js";
import {
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  Download,
  Pencil,
  Plus,
  Search,
  Trash2
} from "../../../vendor/icons.js";
import { Badge, Button, Card, PageHeader } from "../../../components/primitives.js";
import { EmptyState, Modal } from "../../../components/interactions.js";
import { RecordEditor } from "../../../components/record-editor.js";
import { useUI } from "../../../components/ui-provider.js";
import { exportCsv, usePersistentState } from "../../../lib/client-store.js";
const initialMembers = [
  ["Maya Singh", "maya@example.com", "Product", "Admin", "Active"],
  ["Leo Martins", "leo@example.com", "Engineering", "Member", "Active"],
  ["Nora Albright", "nora@example.com", "Finance", "Member", "Active"],
  ["Ethan Cole", "ethan@example.com", "Operations", "Manager", "Inactive"],
  ["Ava Johnson", "ava@example.com", "Design", "Member", "Active"],
  ["Noah Williams", "noah@example.com", "Sales", "Manager", "Active"],
  ["Olivia Martin", "olivia@example.com", "Marketing", "Member", "Pending"],
  ["Liam Garcia", "liam@example.com", "Support", "Member", "Active"]
].map(([name, email, department, role, status], index) => ({
  id: `member-${index}`,
  name,
  email,
  department,
  role,
  status
}));
export default function TablesPage() {
  const [members, setMembers] = usePersistentState("members", initialMembers);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All departments");
  const [status, setStatus] = useState("All statuses");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [sortAsc, setSortAsc] = useState(true);
  const [selected, setSelected] = useState([]);
  const [editor, setEditor] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const selectAllRef = useRef(null);
  const { notify } = useUI();
  const filtered = members.filter(
    (member) => `${member.name} ${member.email} ${member.department} ${member.role}`.toLowerCase().includes(query.toLowerCase()) && (department === "All departments" || member.department === department) && (status === "All statuses" || member.status === status)
  ).sort(
    (a, b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );
  const count = Math.max(1, Math.ceil(filtered.length / size)), current = Math.min(page, count);
  const visible = filtered.slice((current - 1) * size, current * size);
  const allSelected = visible.length > 0 && visible.every((member) => selected.includes(member.id));
  const someSelected = visible.some((member) => selected.includes(member.id));
  useEffect(() => {
    if (selectAllRef.current)
      selectAllRef.current.indeterminate = someSelected && !allSelected;
  }, [someSelected, allSelected]);
  return createElement(Fragment, null, createElement(
    PageHeader,
    {
      title: "Members",
      description: "Manage people, teams, and workspace roles.",
      actions: createElement(Fragment, null, createElement(
        Button,
        {
          variant: "secondary",
          onClick: () => {
            const rows = selected.length ? members.filter((member) => selected.includes(member.id)) : filtered;
            exportCsv(
              "members.csv",
              ["Name", "Email", "Department", "Role", "Status"],
              rows.map((member) => [
                member.name,
                member.email,
                member.department,
                member.role,
                member.status
              ])
            );
          }
        },
        createElement(Download, { size: 14 }),
        "Export"
      ), createElement(Button, { onClick: () => setEditor("new") }, createElement(Plus, { size: 14 }), "Add member"))
    }
  ), createElement(Card, null, createElement("div", { className: "flex flex-wrap gap-3 border-b border-ui p-4" }, createElement("div", { className: "relative min-w-40 flex-1" }, createElement(Search, { size: 16, className: "absolute start-3 top-3 text-muted" }), createElement(
    "input",
    {
      "aria-label": "Search members",
      value: query,
      onChange: (event) => {
        setQuery(event.target.value);
        setPage(1);
      },
      className: "field ps-9",
      placeholder: "Search people, teams, roles..."
    }
  )), createElement(
    "select",
    {
      "aria-label": "Department filter",
      className: "field w-auto",
      value: department,
      onChange: (event) => {
        setDepartment(event.target.value);
        setPage(1);
      }
    },
    createElement("option", null, "All departments"),
    [...new Set(members.map((member) => member.department))].sort().map((value) => createElement("option", { key: value }, value))
  ), createElement(
    "select",
    {
      "aria-label": "Member status filter",
      className: "field w-auto",
      value: status,
      onChange: (event) => {
        setStatus(event.target.value);
        setPage(1);
      }
    },
    ["All statuses", "Active", "Pending", "Inactive"].map((value) => createElement("option", { key: value }, value))
  )), selected.length ? createElement("div", { className: "flex items-center justify-between gap-3 border-b border-ui bg-brand/5 px-4 py-2" }, createElement("p", { className: "text-xs text-brand" }, selected.length, " members selected"), createElement(Button, { variant: "danger", onClick: () => setDeleteOpen(true) }, createElement(Trash2, { size: 13 }), "Delete selected")) : null, createElement("div", { className: "overflow-x-auto" }, createElement("table", { className: "table-ui min-w-[720px]" }, createElement("thead", null, createElement("tr", null, createElement("th", null, createElement(
    "input",
    {
      ref: selectAllRef,
      "aria-label": "Select all members on this page",
      type: "checkbox",
      checked: allSelected,
      onChange: (event) => setSelected(
        (values) => event.target.checked ? [
          ...new Set([
            ...values,
            ...visible.map((member) => member.id)
          ])
        ] : values.filter(
          (id) => !visible.some((member) => member.id === id)
        )
      )
    }
  )), createElement("th", null, createElement(
    "button",
    {
      onClick: () => setSortAsc((value) => !value),
      "aria-label": "Sort members by name",
      className: "flex items-center gap-2"
    },
    "Name",
    createElement(ArrowDownUp, { size: 12 })
  )), ["Department", "Role", "Status", "Actions"].map((header) => createElement("th", { key: header }, header)))), createElement("tbody", null, visible.map((member) => createElement("tr", { key: member.id }, createElement("td", null, createElement(
    "input",
    {
      "aria-label": `Select ${member.name}`,
      type: "checkbox",
      checked: selected.includes(member.id),
      onChange: (event) => setSelected(
        (values) => event.target.checked ? [...values, member.id] : values.filter((id) => id !== member.id)
      )
    }
  )), createElement("td", null, createElement("div", { className: "flex items-center gap-3" }, createElement("span", { className: "grid size-9 shrink-0 place-items-center rounded-full bg-brand/10 text-[10px] font-semibold text-brand" }, member.name.split(" ").map((part) => part[0]).join("").slice(0, 2)), createElement("div", null, createElement("p", { className: "text-xs font-medium" }, member.name), createElement("p", { className: "mt-1 text-[10px] text-muted" }, member.email)))), createElement("td", null, member.department), createElement("td", null, createElement(Badge, { tone: "brand" }, member.role)), createElement("td", null, createElement(
    Badge,
    {
      tone: member.status === "Active" ? "success" : member.status === "Pending" ? "warning" : "neutral"
    },
    member.status
  )), createElement("td", null, createElement(
    "button",
    {
      "aria-label": `Edit ${member.name}`,
      className: "p-1.5 text-muted hover:text-brand",
      onClick: () => setEditor(member)
    },
    createElement(Pencil, { size: 14 })
  )))))), !visible.length ? createElement(EmptyState, { description: "No members match the current filters." }) : null), createElement("div", { className: "flex flex-wrap items-center justify-between gap-3 border-t border-ui p-4" }, createElement("div", { className: "flex items-center gap-3 text-xs text-muted" }, createElement("span", null, "Showing ", filtered.length ? (current - 1) * size + 1 : 0, "\u2013", Math.min(current * size, filtered.length), " of ", filtered.length), createElement(
    "select",
    {
      "aria-label": "Rows per page",
      className: "rounded border border-ui bg-[var(--panel)] px-2 py-1",
      value: size,
      onChange: (event) => {
        setSize(Number(event.target.value));
        setPage(1);
      }
    },
    [6, 12, 24].map((value) => createElement("option", { key: value }, value))
  )), createElement("div", { className: "flex items-center gap-2" }, createElement(
    Button,
    {
      variant: "secondary",
      "aria-label": "Previous members page",
      disabled: current === 1,
      onClick: () => setPage(current - 1)
    },
    createElement(ChevronLeft, { size: 14 })
  ), createElement("span", { className: "text-xs" }, current, " / ", count), createElement(
    Button,
    {
      variant: "secondary",
      "aria-label": "Next members page",
      disabled: current === count,
      onClick: () => setPage(current + 1)
    },
    createElement(ChevronRight, { size: 14 })
  )))), editor ? createElement(
    RecordEditor,
    {
      title: editor === "new" ? "Add member" : "Edit member",
      onClose: () => setEditor(null),
      fields: [
        {
          name: "name",
          label: "Full name",
          initial: editor === "new" ? "" : editor.name
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          initial: editor === "new" ? "" : editor.email
        },
        {
          name: "department",
          label: "Department",
          options: [
            "Product",
            "Engineering",
            "Finance",
            "Operations",
            "Design",
            "Sales",
            "Marketing",
            "Support"
          ],
          initial: editor === "new" ? "Product" : editor.department
        },
        {
          name: "role",
          label: "Role",
          options: ["Member", "Manager", "Admin"],
          initial: editor === "new" ? "Member" : editor.role
        },
        {
          name: "status",
          label: "Status",
          options: ["Active", "Pending", "Inactive"],
          initial: editor === "new" ? "Active" : editor.status
        }
      ],
      onSubmit: (values) => {
        if (members.some(
          (member) => member.email.toLowerCase() === values.email.toLowerCase() && (editor === "new" || member.id !== editor.id)
        ))
          throw new Error("This email is already assigned to a member.");
        const saved = {
          id: editor === "new" ? createId() : editor.id,
          name: values.name,
          email: values.email,
          department: values.department,
          role: values.role,
          status: values.status
        };
        setMembers(
          (items) => editor === "new" ? [...items, saved] : items.map((item) => item.id === editor.id ? saved : item)
        );
        setEditor(null);
        notify("Member saved.");
      }
    }
  ) : null, deleteOpen ? createElement(
    Modal,
    {
      title: "Delete selected members",
      onClose: () => setDeleteOpen(false)
    },
    createElement("p", { className: "text-sm" }, "Remove ", selected.length, " selected members from this workspace?"),
    createElement("div", { className: "mt-5 flex justify-end gap-2" }, createElement(Button, { variant: "secondary", onClick: () => setDeleteOpen(false) }, "Cancel"), createElement(
      Button,
      {
        variant: "danger",
        onClick: () => {
          setMembers(
            (items) => items.filter((item) => !selected.includes(item.id))
          );
          setSelected([]);
          setDeleteOpen(false);
          notify("Selected members removed.");
        }
      },
      "Delete members"
    ))
  ) : null);
}
