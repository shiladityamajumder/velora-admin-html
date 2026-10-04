import { createElement, Fragment } from '../../runtime/dom.js';
import { useState } from "../../runtime/dom.js";
import { Modal } from "../interactions.js";
import { Button } from "../primitives.js";
import { useI18n } from "../../i18n/provider.js";
export function Confirmation({
  title,
  description,
  onConfirm,
  onClose
}) {
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return createElement(
    Modal,
    {
      title: t(title),
      onClose: () => {
        if (!busy) onClose();
      }
    },
    createElement("p", { className: "text-sm text-muted" }, description ?? t("This action cannot be undone.")),
    error && createElement("p", { role: "alert", className: "mt-3 text-danger" }, t(error)),
    createElement("div", { className: "mt-6 flex justify-end gap-2" }, createElement(Button, { variant: "secondary", disabled: busy, onClick: onClose }, t("Cancel")), createElement(
      Button,
      {
        variant: "danger",
        disabled: busy,
        onClick: async () => {
          setBusy(true);
          try {
            await onConfirm();
            onClose();
          } catch (error2) {
            setError(
              error2 instanceof Error ? error2.message : "Something went wrong"
            );
          } finally {
            setBusy(false);
          }
        }
      },
      t("Confirm action")
    ))
  );
}
