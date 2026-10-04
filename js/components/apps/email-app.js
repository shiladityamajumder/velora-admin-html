import { createElement, Fragment } from '../../runtime/dom.js';
import { createId } from "../../lib/id.js";
import { useState } from "../../runtime/dom.js";
import {
  Archive,
  Inbox,
  Mail,
  Plus,
  Reply,
  Search,
  Send,
  Star,
  Trash2
} from "../../vendor/icons.js";
import { Button, Card, PageHeader } from "../primitives.js";
import { EmptyState } from "../interactions.js";
import { RecordEditor } from "../record-editor.js";
import { useUI } from "../ui-provider.js";
import { usePersistentState } from "../../lib/client-store.js";
const initialMails = [
  {
    id: "m1",
    sender: "Maya Singh",
    email: "maya.singh@example.com",
    subject: "Q4 product roadmap",
    body: "I've attached the final proposal and updated milestone plan. Please review the latest changes and share your feedback before the next sync.",
    time: "10:42",
    folder: "Inbox",
    starred: false,
    read: false
  },
  {
    id: "m2",
    sender: "Finance Team",
    email: "finance@example.com",
    subject: "Invoice settlement confirmed",
    body: "Payment for invoice NX-4832 has been completed. The supporting details are ready for review.",
    time: "09:18",
    folder: "Inbox",
    starred: true,
    read: false
  },
  {
    id: "m3",
    sender: "GitHub",
    email: "github@example.com",
    subject: "Security alert resolved",
    body: "Dependabot successfully closed the vulnerable dependency alert.",
    time: "Yesterday",
    folder: "Inbox",
    starred: false,
    read: true
  },
  {
    id: "m4",
    sender: "Northstar Labs",
    email: "contact@northstar.example.com",
    subject: "Re: CRM implementation",
    body: "Could we move our review call to Thursday afternoon? Please let me know which time works for your team.",
    time: "Yesterday",
    folder: "Inbox",
    starred: false,
    read: false
  },
  {
    id: "m5",
    sender: "Operations",
    email: "operations@example.com",
    subject: "Weekly warehouse report",
    body: "Stock accuracy improved to 99.2% across all locations. The complete report is ready for your review.",
    time: "Mon",
    folder: "Inbox",
    starred: false,
    read: true
  }
];
const folders = [
  { name: "Inbox", icon: Inbox },
  { name: "Starred", icon: Star },
  { name: "Archive", icon: Archive },
  { name: "Sent", icon: Send },
  { name: "Trash", icon: Trash2 }
];
export function EmailApp() {
  const [mails, setMails] = usePersistentState("mail", initialMails);
  const [folder, setFolder] = useState("Inbox");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [compose, setCompose] = useState(null);
  const { notify } = useUI();
  const filtered = mails.filter(
    (mail) => (folder === "Starred" ? mail.starred && mail.folder !== "Trash" : mail.folder === folder) && `${mail.subject} ${mail.sender} ${mail.body}`.toLowerCase().includes(query.toLowerCase())
  );
  const selected = filtered.find((mail) => mail.id === selectedId) ?? filtered[0];
  const move = (target) => {
    if (!selected) return;
    setMails(
      (items) => items.map(
        (mail) => mail.id === selected.id ? { ...mail, folder: target, read: true } : mail
      )
    );
    setSelectedId(null);
    notify(`Message moved to ${target.toLowerCase()}.`);
  };
  return createElement(Fragment, null, createElement(
    PageHeader,
    {
      title: "Mailbox",
      description: "Manage your workspace messages.",
      actions: createElement(Button, { onClick: () => setCompose({ to: "", subject: "", body: "" }) }, createElement(Plus, { size: 14 }), "Compose")
    }
  ), createElement(Card, { className: "grid overflow-hidden xl:grid-cols-[180px_300px_1fr]" }, createElement("aside", { className: "border-e border-ui p-3" }, createElement(
    Button,
    {
      className: "mb-4 hidden w-full xl:inline-flex",
      onClick: () => setCompose({ to: "", subject: "", body: "" })
    },
    createElement(Plus, { size: 14 }),
    "Compose"
  ), createElement("div", { className: "flex flex-wrap gap-1 xl:block" }, folders.map((item) => createElement(
    "button",
    {
      key: item.name,
      onClick: () => {
        setFolder(item.name);
        setSelectedId(null);
      },
      className: `flex items-center gap-2 rounded-md px-3 py-2 text-xs xl:mb-1 xl:w-full ${folder === item.name ? "bg-brand/10 text-brand" : "text-muted hover:bg-[var(--panel-2)]"}`
    },
    createElement(item.icon, { size: 16 }),
    item.name,
    createElement("span", { className: "ms-auto text-[10px]" }, item.name === "Starred" ? mails.filter(
      (mail) => mail.starred && mail.folder !== "Trash"
    ).length : mails.filter((mail) => mail.folder === item.name).length)
  )))), createElement("div", { className: "border-e border-ui" }, createElement("div", { className: "relative border-b border-ui p-3" }, createElement(Search, { size: 16, className: "absolute start-6 top-6 text-muted" }), createElement(
    "input",
    {
      "aria-label": "Search mail",
      value: query,
      onChange: (event) => setQuery(event.target.value),
      placeholder: "Search mail...",
      className: "field ps-9"
    }
  )), createElement("div", { className: "thin-scrollbar max-h-[500px] overflow-y-auto" }, filtered.map((mail) => createElement(
    "button",
    {
      key: mail.id,
      onClick: () => {
        setSelectedId(mail.id);
        setMails(
          (items) => items.map(
            (item) => item.id === mail.id ? { ...item, read: true } : item
          )
        );
      },
      className: `block w-full border-b border-ui p-4 text-start ${selected?.id === mail.id ? "bg-brand/5" : "hover:bg-[var(--panel-2)]"}`
    },
    createElement("div", { className: "flex items-center gap-2" }, createElement(
      "p",
      {
        className: `text-xs ${mail.read ? "font-medium" : "font-semibold"}`
      },
      mail.sender
    ), createElement("span", { className: "ms-auto text-[9px] text-muted" }, mail.time)),
    createElement("p", { className: "mt-1 truncate text-xs font-medium" }, mail.subject),
    createElement("p", { className: "mt-1 line-clamp-2 text-[11px] text-muted" }, mail.body)
  )), !filtered.length ? createElement(
    EmptyState,
    {
      title: `No messages in ${folder.toLowerCase()}`,
      description: "Try another folder or create a message."
    }
  ) : null)), createElement("article", { className: "min-h-[590px] min-w-0 p-5" }, selected ? createElement(Fragment, null, createElement("div", { className: "flex items-start gap-3 border-b border-ui pb-5" }, createElement("span", { className: "grid size-10 shrink-0 place-items-center rounded-full bg-brand/10 text-xs font-semibold text-brand" }, selected.sender.split(" ").map((part) => part[0]).join("").slice(0, 2)), createElement("div", { className: "min-w-0" }, createElement("h2", { className: "text-base font-semibold" }, selected.subject), createElement("p", { className: "mt-1 break-all text-[10px] text-muted" }, selected.folder === "Sent" ? "To" : "From", ":", " ", selected.email)), createElement("div", { className: "ms-auto flex shrink-0 gap-1" }, createElement(
    "button",
    {
      "aria-label": selected.starred ? "Unstar message" : "Star message",
      onClick: () => setMails(
        (items) => items.map(
          (mail) => mail.id === selected.id ? { ...mail, starred: !mail.starred } : mail
        )
      ),
      className: `rounded p-1.5 ${selected.starred ? "text-warning" : "text-muted"}`
    },
    createElement(
      Star,
      {
        size: 16,
        fill: selected.starred ? "currentColor" : "none"
      }
    )
  ), createElement(
    "button",
    {
      "aria-label": "Archive message",
      onClick: () => move("Archive"),
      className: "rounded p-1.5 text-muted"
    },
    createElement(Archive, { size: 16 })
  ), createElement(
    "button",
    {
      "aria-label": "Move message to trash",
      onClick: () => move("Trash"),
      className: "rounded p-1.5 text-muted hover:text-danger"
    },
    createElement(Trash2, { size: 16 })
  ))), createElement("div", { className: "mt-6 text-sm leading-7" }, createElement("p", null, "Hi team,"), createElement("p", { className: "my-5 whitespace-pre-wrap" }, selected.body), createElement("p", null, "Regards,", createElement("br", null), selected.sender)), createElement("div", { className: "mt-8 flex flex-wrap gap-2" }, createElement(
    Button,
    {
      onClick: () => setCompose({
        to: selected.email,
        subject: `Re: ${selected.subject.replace(/^Re: /, "")}`,
        body: ""
      })
    },
    createElement(Reply, { size: 14 }),
    "Reply"
  ), createElement(
    Button,
    {
      variant: "secondary",
      onClick: () => setCompose({
        to: "",
        subject: `Fwd: ${selected.subject}`,
        body: `

\u2014 Forwarded message \u2014
From: ${selected.email}
${selected.body}`
      })
    },
    "Forward"
  ), selected.folder === "Trash" || selected.folder === "Archive" ? createElement(Button, { variant: "secondary", onClick: () => move("Inbox") }, "Move to inbox") : null)) : createElement("div", { className: "flex h-full flex-col items-center justify-center text-muted" }, createElement(Mail, { size: 40, strokeWidth: 1 }), createElement("p", { className: "mt-4 text-sm" }, "Select a message to read")))), compose ? createElement(
    RecordEditor,
    {
      title: "Compose message",
      description: "This template stores messages locally in the Sent folder.",
      fields: [
        { name: "to", label: "To", type: "email", initial: compose.to },
        { name: "subject", label: "Subject", initial: compose.subject },
        {
          name: "body",
          label: "Message",
          type: "textarea",
          initial: compose.body
        }
      ],
      submitLabel: "Save to Sent",
      onClose: () => setCompose(null),
      onSubmit: (values) => {
        setMails((items) => [
          {
            id: createId(),
            sender: "You",
            email: values.to,
            subject: values.subject,
            body: values.body,
            time: "Just now",
            folder: "Sent",
            starred: false,
            read: true
          },
          ...items
        ]);
        setCompose(null);
        notify("Message saved to Sent.");
      }
    }
  ) : null);
}
