import { createElement, Fragment } from '../../runtime/dom.js';
import { useState } from "../../runtime/dom.js";
import { Eye, EyeOff, LockKeyhole } from "../../vendor/icons.js";
import { useI18n } from "../../i18n/provider.js";
export function Password({
  name,
  label,
  minLength,
  newPassword = false
}) {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  return createElement("div", { className: "relative" }, createElement(LockKeyhole, { size: 16, className: "absolute start-3 top-3 text-muted" }), createElement(
    "input",
    {
      name,
      "aria-label": label,
      required: true,
      minLength,
      type: show ? "text" : "password",
      autoComplete: newPassword ? "new-password" : "current-password",
      placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
      className: "field ps-10 pe-10"
    }
  ), createElement(
    "button",
    {
      type: "button",
      "aria-label": `${t(show ? "Hide" : "Show")} ${label}`,
      className: "absolute end-3 top-3 text-muted",
      onClick: () => setShow((value) => !value)
    },
    show ? createElement(EyeOff, { size: 16 }) : createElement(Eye, { size: 16 })
  ));
}
