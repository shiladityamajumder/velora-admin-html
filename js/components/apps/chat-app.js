import { createElement, Fragment } from '../../runtime/dom.js';
import { createId } from "../../lib/id.js";
import { useEffect, useRef, useState } from "../../runtime/dom.js";
import { Download, Paperclip, Search, Send, Trash2, X } from "../../vendor/icons.js";
import { Button, Card, PageHeader } from "../primitives.js";
import { EmptyState, Modal } from "../interactions.js";
import { useUI } from "../ui-provider.js";
import { downloadText, usePersistentState } from "../../lib/client-store.js";
const contacts = [
  "Maya Singh",
  "Leo Martins",
  "Nora Albright",
  "Ethan Cole",
  "Ava Johnson"
];
const initialThreads = Object.fromEntries(
  contacts.map((name, index) => [
    name,
    [
      {
        id: `${index}-1`,
        text: index === 0 ? "Hey, did you see the updated dashboard?" : `Hi! Let's review the ${index % 2 ? "project timeline" : "dashboard report"} today.`,
        mine: false,
        time: "10:40"
      },
      {
        id: `${index}-2`,
        text: "Yes, I'll take a look and share my notes.",
        mine: true,
        time: "10:42"
      }
    ]
  ])
);
export function ChatApp() {
  const [active, setActive] = useState(contacts[0]);
  const [threads, setThreads] = usePersistentState(
    "chat-threads",
    initialThreads
  );
  const [query, setQuery] = useState("");
  const [messageQuery, setMessageQuery] = useState("");
  const [searchMessages, setSearchMessages] = useState(false);
  const [text, setText] = useState("");
  const [clearOpen, setClearOpen] = useState(false);
  const fileRef = useRef(null);
  const scrollRef = useRef(null);
  const { notify } = useUI();
  const thread = threads[active] ?? [];
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [active, thread.length]);
  const append = (message) => setThreads((values) => ({
    ...values,
    [active]: [
      ...values[active] ?? [],
      {
        ...message,
        id: createId(),
        time: new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit"
        }).format(new Date())
      }
    ]
  }));
  const send = () => {
    if (!text.trim()) return;
    append({ text: text.trim(), mine: true });
    setText("");
  };
  return createElement(Fragment, null, createElement(PageHeader, { title: "Chat", description: "Your team conversations." }), createElement(Card, { className: "grid overflow-hidden lg:grid-cols-[280px_1fr]" }, createElement("aside", { className: "hidden border-e border-ui lg:block" }, createElement("div", { className: "relative border-b border-ui p-4" }, createElement(Search, { size: 16, className: "absolute start-7 top-7 text-muted" }), createElement(
    "input",
    {
      "aria-label": "Search conversations",
      value: query,
      onChange: (event) => setQuery(event.target.value),
      className: "field ps-9",
      placeholder: "Search conversations..."
    }
  )), createElement("div", { className: "p-2" }, contacts.filter(
    (name) => name.toLowerCase().includes(query.toLowerCase())
  ).map((name, index) => createElement(
    "button",
    {
      key: name,
      onClick: () => {
        setActive(name);
        setText("");
        setMessageQuery("");
      },
      className: `mb-1 flex w-full items-center gap-3 rounded-md p-3 text-start ${active === name ? "bg-brand/10" : "hover:bg-[var(--panel-2)]"}`
    },
    createElement("span", { className: "grid size-10 shrink-0 place-items-center rounded-full bg-brand/10 text-xs font-semibold text-brand" }, name.split(" ").map((part) => part[0]).join("")),
    createElement("div", { className: "min-w-0" }, createElement("p", { className: "text-xs font-medium" }, name), createElement("p", { className: "mt-1 truncate text-[10px] text-muted" }, threads[name]?.at(-1)?.text || "No messages yet")),
    index < 3 ? createElement("span", { className: "ms-auto size-1.5 shrink-0 rounded-full bg-success" }) : null
  )))), createElement("section", { className: "flex min-w-0 flex-col" }, createElement("div", { className: "flex items-center gap-3 border-b border-ui p-4" }, createElement("span", { className: "grid size-9 place-items-center rounded-full bg-brand/10 text-xs font-semibold text-brand" }, active.split(" ").map((part) => part[0]).join("")), createElement("div", null, createElement("p", { className: "hidden text-sm font-medium lg:block" }, active), createElement(
    "select",
    {
      "aria-label": "Active conversation",
      className: "bg-transparent text-xs lg:hidden",
      value: active,
      onChange: (event) => {
        setActive(event.target.value);
        setText("");
        setMessageQuery("");
      }
    },
    contacts.map((name) => createElement("option", { key: name }, name))
  ), createElement("p", { className: "mt-0.5 text-[10px] text-success" }, "Online")), createElement("div", { className: "ms-auto flex gap-1" }, createElement(
    "button",
    {
      "aria-label": "Search messages",
      onClick: () => setSearchMessages((value) => !value),
      className: "rounded-md p-2 text-muted hover:bg-[var(--panel-2)]"
    },
    createElement(Search, { size: 17 })
  ), createElement(
    "button",
    {
      "aria-label": "Export conversation",
      onClick: () => downloadText(
        `conversation-${active.replaceAll(" ", "-")}.txt`,
        thread.map(
          (message) => `${message.time} ${message.mine ? "You" : active}: ${message.text}`
        ).join("\n")
      ),
      className: "rounded-md p-2 text-muted hover:bg-[var(--panel-2)]"
    },
    createElement(Download, { size: 17 })
  ), createElement(
    "button",
    {
      "aria-label": "Clear conversation",
      onClick: () => setClearOpen(true),
      className: "rounded-md p-2 text-muted hover:text-danger"
    },
    createElement(Trash2, { size: 17 })
  ))), searchMessages ? createElement("div", { className: "flex gap-2 border-b border-ui p-3" }, createElement(
    "input",
    {
      autoFocus: true,
      "aria-label": "Search current messages",
      placeholder: "Search this conversation...",
      className: "field",
      value: messageQuery,
      onChange: (event) => setMessageQuery(event.target.value)
    }
  ), createElement(
    "button",
    {
      "aria-label": "Close message search",
      onClick: () => {
        setSearchMessages(false);
        setMessageQuery("");
      }
    },
    createElement(X, { size: 17 })
  )) : null, createElement(
    "div",
    {
      ref: scrollRef,
      className: "thin-scrollbar h-[440px] space-y-4 overflow-y-auto bg-[var(--panel-2)] p-5 lg:h-[500px]"
    },
    thread.filter(
      (message) => message.text.toLowerCase().includes(messageQuery.toLowerCase())
    ).map((message) => createElement(
      "div",
      {
        key: message.id,
        className: `flex ${message.mine ? "justify-end" : "justify-start"}`
      },
      createElement(
        "div",
        {
          className: `max-w-[85%] rounded-lg px-4 py-3 text-sm sm:max-w-[72%] ${message.mine ? "bg-brand text-white" : "border border-ui bg-[var(--panel)]"}`
        },
        createElement("p", { className: "whitespace-pre-wrap break-words" }, message.text),
        message.attachment ? createElement(
          "a",
          {
            href: message.attachment.data,
            download: message.attachment.name,
            className: "mt-2 flex items-center gap-2 rounded border border-current/15 p-2 text-xs"
          },
          createElement(Paperclip, { size: 13 }),
          message.attachment.name,
          createElement(Download, { size: 13 })
        ) : null,
        createElement(
          "p",
          {
            className: `mt-2 text-end text-[9px] ${message.mine ? "text-white/70" : "text-muted"}`
          },
          message.time
        )
      )
    )),
    !thread.length ? createElement(
      EmptyState,
      {
        title: "Start a conversation",
        description: `Send your first message to ${active}.`
      }
    ) : null
  ), createElement(
    "form",
    {
      className: "flex items-center gap-2 border-t border-ui p-4",
      onSubmit: (event) => {
        event.preventDefault();
        send();
      }
    },
    createElement(
      "button",
      {
        type: "button",
        "aria-label": "Attach a file",
        onClick: () => fileRef.current?.click(),
        className: "grid size-9 shrink-0 place-items-center rounded-md text-muted hover:bg-[var(--panel-2)]"
      },
      createElement(Paperclip, { size: 18 })
    ),
    createElement(
      "input",
      {
        ref: fileRef,
        type: "file",
        className: "hidden",
        onChange: async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          if (file.size > 1024 * 1024) {
            notify("Choose a file smaller than 1 MB.", "error");
            event.target.value = "";
            return;
          }
          try {
            const data = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(String(reader.result));
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
            append({
              text: `Shared ${file.name}`,
              mine: true,
              attachment: { name: file.name, data }
            });
          } catch {
            notify("The attachment could not be read.", "error");
          }
          event.target.value = "";
        }
      }
    ),
    createElement(
      "input",
      {
        "aria-label": "Message",
        value: text,
        onChange: (event) => setText(event.target.value),
        className: "field min-w-0 flex-1",
        placeholder: "Type a message..."
      }
    ),
    createElement(
      Button,
      {
        type: "submit",
        "aria-label": "Send message",
        disabled: !text.trim()
      },
      createElement(Send, { size: 16 })
    )
  ))), clearOpen ? createElement(Modal, { title: "Clear conversation", onClose: () => setClearOpen(false) }, createElement("p", { className: "text-sm" }, "Clear all messages with ", active, "?"), createElement("div", { className: "mt-5 flex justify-end gap-2" }, createElement(Button, { variant: "secondary", onClick: () => setClearOpen(false) }, "Cancel"), createElement(
    Button,
    {
      variant: "danger",
      onClick: () => {
        setThreads((values) => ({ ...values, [active]: [] }));
        setClearOpen(false);
        notify("Conversation cleared.");
      }
    },
    "Clear messages"
  ))) : null);
}
