import { createElement, Fragment } from '../../runtime/dom.js';
import { useState } from "../../runtime/dom.js";
import {
  CheckCircle2,
  Clock,
  Users,
  TrendingUp,
  Layers3,
  AlertTriangle,
  Inbox
} from "../../vendor/icons.js";
import { Card, Button, Badge, StatCard } from "../../components/primitives.js";
import { usePersistentState } from "../../lib/client-store.js";
import { useI18n } from "../../i18n/provider.js";
const initialActivity = [
  {
    id: "a1",
    title: "Workspace created",
    category: "System",
    timestamp: "2026-10-03T08:00:00Z"
  },
  {
    id: "a2",
    title: "Design review completed",
    category: "Team",
    timestamp: "2026-10-03T09:00:00Z"
  },
  {
    id: "a3",
    title: "Report shared",
    category: "Team",
    timestamp: "2026-10-03T10:00:00Z"
  }
];
export function ContentPatterns({ variant }) {
  const { t, currency, date } = useI18n();
  const [billing, setBilling] = useState("monthly");
  const [plan, setPlan] = usePersistentState(
    "library-plan",
    { name: "", billing: "" }
  );
  const [activities, setActivities] = usePersistentState(
    "library-activity",
    initialActivity
  );
  const [category, setCategory] = useState("");
  const [state, setState] = useState("ready");
  if (variant === "cards")
    return createElement("div", { className: "space-y-5" }, createElement("div", { className: "grid gap-4 sm:grid-cols-3" }, createElement(
      StatCard,
      {
        label: "Active members",
        value: "128",
        change: 8.2,
        icon: createElement(Users, { size: 21 })
      }
    ), createElement(
      StatCard,
      {
        label: "Growth",
        value: "24%",
        change: 12,
        icon: createElement(TrendingUp, { size: 21 })
      }
    ), createElement(StatCard, { label: "Projects", value: "36", icon: createElement(Layers3, { size: 21 }) })), createElement(Card, { className: "flex flex-wrap items-center justify-between gap-4 p-5" }, createElement("div", { className: "flex items-center gap-3" }, createElement("span", { className: "grid size-12 place-items-center rounded-full bg-info/15 text-info font-semibold" }, "VA"), createElement("div", null, createElement("h2", { className: "text-sm font-semibold" }, t("Design team")), createElement("p", { className: "mt-1 text-xs text-muted" }, t("Four members are collaborating on this demo.")))), createElement(Badge, { tone: "success" }, "Active")), createElement("div", { className: "flex gap-2" }, ["monthly", "yearly"].map((value) => createElement(
      Button,
      {
        key: value,
        variant: billing === value ? "primary" : "secondary",
        "aria-pressed": billing === value,
        onClick: () => setBilling(value)
      },
      t(value === "monthly" ? "Monthly" : "Yearly")
    ))), createElement("div", { className: "grid gap-4 md:grid-cols-3" }, [
      { name: "Starter", price: 399 },
      { name: "Team", price: 799 },
      { name: "Business", price: 1499 }
    ].map((item, index) => createElement(Card, { key: item.name, className: "relative overflow-hidden p-6" }, createElement(
      "div",
      {
        className: "absolute inset-x-0 top-0 h-1",
        style: { background: `var(--chart-${index + 2})` }
      }
    ), createElement("h2", { className: "font-semibold" }, t(item.name)), createElement("p", { className: "my-4 text-2xl font-semibold" }, currency(item.price * (billing === "yearly" ? 10 : 1)), createElement("span", { className: "block text-xs font-normal text-muted" }, t(billing === "yearly" ? "Billed yearly" : "Billed monthly"))), createElement("p", { className: "mb-5 text-xs text-muted" }, t("Sample plan for a reusable pricing interface.")), createElement(
      Button,
      {
        className: "w-full",
        variant: plan.name === item.name ? "primary" : "secondary",
        onClick: () => setPlan({ name: item.name, billing })
      },
      t("Choose plan"),
      createElement("span", { className: "sr-only" }, t(item.name))
    )))), plan.name && createElement(
      "p",
      {
        role: "status",
        className: "rounded border border-ui bg-success/10 p-4 text-sm"
      },
      t("Selected plan"),
      ": ",
      t(plan.name),
      " \xB7",
      " ",
      t(plan.billing === "yearly" ? "Yearly" : "Monthly"),
      ".",
      " ",
      t("This selection is saved locally. No payment is collected.")
    ));
  if (variant === "timeline")
    return createElement(Card, { className: "p-5" }, createElement("label", { className: "mb-6 block max-w-xs" }, createElement("span", { className: "field-label" }, t("Activity category")), createElement(
      "select",
      {
        className: "field",
        "aria-label": t("Activity category"),
        value: category,
        onChange: (event) => setCategory(event.target.value)
      },
      createElement("option", { value: "" }, t("All")),
      ["System", "Team", "Note"].map((value) => createElement("option", { key: value, value }, t(value)))
    )), createElement("ol", { className: "space-y-5 border-s border-ui ps-5" }, activities.filter((item) => !category || item.category === category).map((item) => createElement("li", { key: item.id, className: "relative" }, createElement("span", { className: "absolute -start-[26px] top-1.5 size-3 rounded-full border-2 border-[var(--panel)] bg-brand" }), createElement(Badge, { tone: item.category === "System" ? "brand" : "success" }, item.category), createElement("h2", { className: "mt-2 text-sm font-medium" }, t(item.title)), createElement("p", { className: "mt-1 flex items-center gap-2 text-xs text-muted" }, createElement(Clock, { size: 12 }), date(item.timestamp, true))))), !activities.some(
      (item) => !category || item.category === category
    ) && createElement("p", { className: "py-5 text-xs text-muted" }, t("No activity in this category.")), createElement(
      "form",
      {
        className: "mt-6 flex flex-wrap gap-3 border-t border-ui pt-5",
        onSubmit: (event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const title = String(new FormData(form).get("note")).trim();
          if (title.length < 3) return;
          setActivities((current) => [
            {
              id: String(Date.now()),
              title,
              category: "Note",
              timestamp: (new Date()).toISOString()
            },
            ...current
          ]);
          setCategory("");
          form.reset();
        }
      },
      createElement(
        "input",
        {
          className: "field min-w-0 flex-1",
          "aria-label": t("Activity note"),
          name: "note",
          required: true,
          minLength: 3,
          maxLength: 160,
          placeholder: t("Add a demo activity note")
        }
      ),
      createElement(Button, { type: "submit" }, t("Add note"))
    ));
  return createElement(Card, { className: "p-5" }, createElement("label", { className: "mb-5 block max-w-xs" }, createElement("span", { className: "field-label" }, t("Preview state")), createElement(
    "select",
    {
      className: "field",
      "aria-label": t("Preview state"),
      value: state,
      onChange: (event) => setState(event.target.value)
    },
    ["ready", "loading", "empty", "error"].map((value) => createElement("option", { key: value, value }, t(value[0].toUpperCase() + value.slice(1))))
  )), createElement("div", { className: "rounded border border-dashed border-ui p-6 sm:p-10" }, state === "loading" ? createElement(
    "div",
    {
      "aria-busy": "true",
      "aria-label": t("Loading preview"),
      className: "space-y-4"
    },
    createElement("div", { className: "pulse-soft h-8 w-1/3 rounded bg-brand/15" }),
    createElement("div", { className: "pulse-soft h-5 rounded bg-[var(--panel-2)]" }),
    createElement("div", { className: "pulse-soft h-5 w-2/3 rounded bg-[var(--panel-2)]" }),
    createElement(Button, { variant: "secondary", onClick: () => setState("ready") }, t("Complete preview"))
  ) : createElement(
    "div",
    {
      role: state === "error" ? "alert" : "status",
      className: "space-y-4 text-center"
    },
    state === "error" ? createElement(AlertTriangle, { className: "mx-auto text-danger", size: 32 }) : state === "empty" ? createElement(Inbox, { className: "mx-auto text-info", size: 32 }) : createElement(CheckCircle2, { className: "mx-auto text-success", size: 32 }),
    createElement("h2", { className: "font-semibold" }, t(
      state === "error" ? "Something went wrong" : state === "empty" ? "No records yet" : "Your preview is ready"
    )),
    createElement("p", { className: "text-xs text-muted" }, t("Switch states to preview a complete data-loading interface.")),
    createElement(
      Button,
      {
        onClick: () => setState(state === "ready" ? "loading" : "ready")
      },
      t(
        state === "error" ? "Retry" : state === "empty" ? "Add sample record" : "Preview loading"
      )
    )
  )));
}
