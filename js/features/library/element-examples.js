import { createElement, Fragment } from '../../runtime/dom.js';
import { useState } from "../../runtime/dom.js";
import { LoaderCircle, CheckCircle2, Info, AlertTriangle } from "../../vendor/icons.js";
import { Card, Button, Badge, Progress } from "../../components/primitives.js";
import { Modal } from "../../components/interactions.js";
import { Confirmation } from "../../components/data/confirmation.js";
import { useI18n } from "../../i18n/provider.js";
import { useUI } from "../../components/ui-provider.js";
import { ExampleFrame } from "./example-frame.js";
export function ElementExamples({ variant }) {
  const { t } = useI18n();
  const { notify } = useUI();
  const [overlay, setOverlay] = useState(
    null
  );
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(65);
  return createElement(
    ExampleFrame,
    {
      category: "components",
      variant,
      source: 'import { Button, Badge, Card, Progress } from "../../components/primitives.js";\nimport { Modal } from "../../components/interactions.js";\nimport { Confirmation } from "../../components/data/confirmation.js";'
    },
    createElement(Card, { className: "space-y-6 p-5" }, variant === "buttons" && createElement(Fragment, null, createElement("div", { className: "flex flex-wrap gap-3" }, ["primary", "secondary", "ghost", "danger"].map(
      (tone) => createElement(
        Button,
        {
          key: tone,
          variant: tone,
          onClick: () => notify(t("Example action selected"))
        },
        t(tone[0].toUpperCase() + tone.slice(1))
      )
    ), createElement(
      Button,
      {
        disabled: loading,
        onClick: async () => {
          setLoading(true);
          await new Promise((resolve) => setTimeout(resolve, 800));
          setLoading(false);
          notify(t("Saved successfully"));
        }
      },
      loading && createElement(LoaderCircle, { size: 14, className: "animate-spin" }),
      t(loading ? "Loading" : "Loading button")
    ), createElement(Button, { disabled: true }, t("Disabled"))), createElement("div", { className: "flex flex-wrap gap-3" }, ["success", "warning", "danger", "brand", "neutral"].map((tone) => createElement(Badge, { key: tone, tone }, t(tone[0].toUpperCase() + tone.slice(1)))))), variant === "feedback" && createElement(Fragment, null, createElement("div", { className: "grid gap-3 sm:grid-cols-3" }, [
      {
        title: "Saved successfully",
        Icon: CheckCircle2,
        tone: "text-success bg-success/10"
      },
      { title: "Heads up", Icon: Info, tone: "text-info bg-info/10" },
      {
        title: "Usage limit",
        Icon: AlertTriangle,
        tone: "text-warning bg-warning/10"
      }
    ].map(({ title, Icon, tone }) => createElement(
      "div",
      {
        role: "status",
        key: title,
        className: `flex items-center gap-3 rounded p-4 text-xs ${tone}`
      },
      createElement(Icon, { size: 18 }),
      t(title)
    ))), createElement("label", { className: "block max-w-md space-y-3" }, createElement("span", { className: "field-label" }, t("Progress"), " \xB7 ", progress, "%"), createElement(
      "input",
      {
        "aria-label": t("Progress"),
        type: "range",
        min: 0,
        max: 100,
        value: progress,
        onChange: (event) => setProgress(Number(event.target.value)),
        className: "w-full accent-[var(--brand)]"
      }
    ), createElement(Progress, { value: progress })), createElement("div", { className: "flex flex-wrap gap-2" }, ["success", "error", "warning", "info"].map(
      (tone) => createElement(
        Button,
        {
          key: tone,
          variant: "secondary",
          onClick: () => notify(t("Example notification"), tone)
        },
        t(tone[0].toUpperCase() + tone.slice(1))
      )
    ))), variant === "overlays" && createElement("div", { className: "flex flex-wrap gap-3" }, createElement(Button, { onClick: () => setOverlay("modal") }, t("Open modal")), createElement(Button, { variant: "secondary", onClick: () => setOverlay("drawer") }, t("Open drawer")), createElement(Button, { variant: "danger", onClick: () => setOverlay("confirm") }, t("Open confirmation")))),
    (overlay === "modal" || overlay === "drawer") && createElement(
      Modal,
      {
        title: t(overlay === "drawer" ? "Example drawer" : "Example dialog"),
        drawer: overlay === "drawer",
        onClose: () => setOverlay(null)
      },
      createElement("p", { className: "mb-5 text-sm text-muted" }, t("Press Escape to close and return focus to the opening button.")),
      createElement(Button, { onClick: () => setOverlay(null) }, t("Close"))
    ),
    overlay === "confirm" && createElement(
      Confirmation,
      {
        title: t("Confirm action"),
        description: t("This only confirms an example action."),
        onClose: () => setOverlay(null),
        onConfirm: async () => {
          notify(t("Example action confirmed"));
          setOverlay(null);
        }
      }
    )
  );
}
