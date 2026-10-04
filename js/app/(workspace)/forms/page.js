import { createElement, Fragment } from '../../../runtime/dom.js';
import { useRef, useState } from "../../../runtime/dom.js";
import { Eye, EyeOff, FileText, UploadCloud, X } from "../../../vendor/icons.js";
import { Button, Card, CardHeader, PageHeader } from "../../../components/primitives.js";
import { FormField, Toggle } from "../../../components/interactions.js";
import { useUI } from "../../../components/ui-provider.js";
import { usePersistentState } from "../../../lib/client-store.js";
import { initialProfile } from "../../../lib/records.js";
export default function FormsPage() {
  const [profile, setProfile] = usePersistentState("profile", initialProfile);
  const [showPassword, setShowPassword] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [securityMessage, setSecurityMessage] = useState("");
  const [securityError, setSecurityError] = useState("");
  const fileRef = useRef(null);
  const { notify } = useUI();
  const selectFiles = (incoming) => {
    const oversized = incoming.filter((file) => file.size > 10 * 1024 * 1024);
    setUploadError(
      oversized.length ? `${oversized.map((file) => file.name).join(", ")} exceed the 10 MB limit.` : ""
    );
    setFiles((values) => [
      ...values,
      ...incoming.filter((file) => file.size <= 10 * 1024 * 1024)
    ]);
  };
  return createElement(Fragment, null, createElement(
    PageHeader,
    {
      title: "Forms & Settings",
      description: "Profile, security preferences, and file selection."
    }
  ), createElement("div", { className: "grid gap-6 xl:grid-cols-2" }, createElement(Card, null, createElement(
    CardHeader,
    {
      title: "Profile Form",
      subtitle: "Manage your workspace identity"
    }
  ), createElement(
    "form",
    {
      className: "grid gap-4 p-5 sm:grid-cols-2",
      onSubmit: (event) => {
        event.preventDefault();
        const values = Object.fromEntries(
          new FormData(event.currentTarget)
        );
        if (!String(values.firstName).trim() || !String(values.lastName).trim()) {
          notify("Please enter your first and last names.", "error");
          return;
        }
        setProfile((current) => ({
          ...current,
          firstName: String(values.firstName).trim(),
          lastName: String(values.lastName).trim(),
          email: String(values.email),
          role: String(values.role),
          timezone: String(values.timezone),
          bio: String(values.bio),
          location: String(values.location)
        }));
        notify("Profile changes saved.");
      }
    },
    createElement(FormField, { label: "First name" }, createElement(
      "input",
      {
        name: "firstName",
        required: true,
        defaultValue: profile.firstName,
        className: "field"
      }
    )),
    createElement(FormField, { label: "Last name" }, createElement(
      "input",
      {
        name: "lastName",
        required: true,
        defaultValue: profile.lastName,
        className: "field"
      }
    )),
    createElement("div", { className: "sm:col-span-2" }, createElement(FormField, { label: "Email" }, createElement(
      "input",
      {
        name: "email",
        required: true,
        type: "email",
        defaultValue: profile.email,
        className: "field"
      }
    ))),
    createElement(FormField, { label: "Role" }, createElement("select", { name: "role", defaultValue: profile.role, className: "field" }, createElement("option", null, "Administrator"), createElement("option", null, "Editor"), createElement("option", null, "Member"))),
    createElement(FormField, { label: "Timezone" }, createElement(
      "select",
      {
        name: "timezone",
        defaultValue: profile.timezone,
        className: "field"
      },
      createElement("option", null, "Asia/Kolkata"),
      createElement("option", null, "Europe/Amsterdam"),
      createElement("option", null, "America/New_York"),
      createElement("option", null, "UTC")
    )),
    createElement("div", { className: "sm:col-span-2" }, createElement(FormField, { label: "Location" }, createElement(
      "input",
      {
        name: "location",
        defaultValue: profile.location,
        className: "field"
      }
    ))),
    createElement("div", { className: "sm:col-span-2" }, createElement(FormField, { label: "Bio" }, createElement(
      "textarea",
      {
        name: "bio",
        rows: 3,
        defaultValue: profile.bio,
        className: "field"
      }
    ))),
    createElement("div", { className: "flex justify-end gap-2 sm:col-span-2" }, createElement(Button, { type: "reset", variant: "secondary" }, "Cancel"), createElement(Button, { type: "submit" }, "Save changes"))
  )), createElement(Card, null, createElement(
    CardHeader,
    {
      title: "Security",
      subtitle: "Password form and sign-in preferences"
    }
  ), createElement(
    "form",
    {
      className: "space-y-4 p-5",
      onSubmit: (event) => {
        event.preventDefault();
        setSecurityMessage("");
        setSecurityError("");
        const data = new FormData(event.currentTarget), current = String(data.get("current") || ""), password = String(data.get("password") || ""), confirm = String(data.get("confirm") || "");
        if (password || confirm || current) {
          if (!current) {
            setSecurityError("Enter your current password.");
            return;
          }
          if (password.length < 12) {
            setSecurityError(
              "Use at least 12 characters for the new password."
            );
            return;
          }
          if (password !== confirm) {
            setSecurityError("The new passwords do not match.");
            return;
          }
          setSecurityMessage(
            "Password form validated. Connect an authentication service to apply password changes."
          );
          event.currentTarget.reset();
        } else {
          setSecurityMessage("Security preferences saved.");
        }
        notify("Security preferences saved.");
      }
    },
    createElement(FormField, { label: "Current password" }, createElement("div", { className: "relative" }, createElement(
      "input",
      {
        name: "current",
        type: showPassword ? "text" : "password",
        autoComplete: "current-password",
        placeholder: "Current password",
        className: "field pe-10"
      }
    ), createElement(
      "button",
      {
        type: "button",
        "aria-label": showPassword ? "Hide current password" : "Show current password",
        onClick: () => setShowPassword((value) => !value),
        className: "absolute end-3 top-3 text-muted"
      },
      showPassword ? createElement(EyeOff, { size: 17 }) : createElement(Eye, { size: 17 })
    ))),
    createElement(FormField, { label: "New password" }, createElement(
      "input",
      {
        name: "password",
        type: "password",
        autoComplete: "new-password",
        placeholder: "At least 12 characters",
        className: "field"
      }
    )),
    createElement(FormField, { label: "Confirm new password" }, createElement(
      "input",
      {
        name: "confirm",
        type: "password",
        autoComplete: "new-password",
        placeholder: "Repeat the new password",
        className: "field"
      }
    )),
    createElement("div", { className: "flex items-center justify-between gap-4 rounded-md border border-ui bg-[var(--panel-2)] p-4" }, createElement("div", null, createElement("p", { className: "text-xs font-semibold" }, "Two-factor authentication"), createElement("p", { className: "mt-1 text-[11px] text-muted" }, "Store your preferred sign-in verification setting.")), createElement(
      Toggle,
      {
        label: "Two-factor authentication",
        checked: profile.twoFactor,
        onChange: (value) => setProfile((current) => ({ ...current, twoFactor: value }))
      }
    )),
    securityError ? createElement("p", { role: "alert", className: "text-xs text-danger" }, securityError) : null,
    securityMessage ? createElement("p", { role: "status", className: "text-xs text-brand" }, securityMessage) : null,
    createElement(Button, { type: "submit" }, "Update security")
  )), createElement(Card, { className: "xl:col-span-2" }, createElement(
    CardHeader,
    {
      title: "File Upload",
      subtitle: "Choose files or drag them into the selection area"
    }
  ), createElement("div", { className: "p-5" }, createElement(
    "div",
    {
      role: "button",
      tabIndex: 0,
      "aria-label": "Choose files",
      onClick: () => fileRef.current?.click(),
      onKeyDown: (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          fileRef.current?.click();
        }
      },
      onDragOver: (event) => event.preventDefault(),
      onDrop: (event) => {
        event.preventDefault();
        selectFiles([...event.dataTransfer.files]);
      },
      className: "grid min-h-44 cursor-pointer place-items-center rounded-md border-2 border-dashed border-ui bg-[var(--panel-2)] p-8 text-center"
    },
    createElement("div", null, createElement(UploadCloud, { size: 28, className: "mx-auto text-brand" }), createElement("p", { className: "mt-3 text-sm font-medium" }, "Drop files here or click to browse"), createElement("p", { className: "mt-1 text-xs text-muted" }, "Up to 10 MB per file"))
  ), createElement(
    "input",
    {
      ref: fileRef,
      "aria-label": "File selection",
      type: "file",
      multiple: true,
      className: "hidden",
      onChange: (event) => {
        selectFiles([...event.target.files ?? []]);
        event.target.value = "";
      }
    }
  ), uploadError ? createElement("p", { role: "alert", className: "mt-3 text-xs text-danger" }, uploadError) : null, files.length ? createElement("div", { className: "mt-4 grid gap-2 sm:grid-cols-2" }, files.map((file, index) => createElement(
    "div",
    {
      key: `${file.name}-${index}`,
      className: "flex items-center gap-3 rounded-md border border-ui p-3"
    },
    createElement(FileText, { size: 20, className: "text-brand" }),
    createElement("div", { className: "min-w-0" }, createElement("p", { className: "truncate text-xs font-medium" }, file.name), createElement("p", { className: "text-[10px] text-muted" }, (file.size / 1024).toFixed(1), " KB \xB7 selected")),
    createElement(
      "button",
      {
        "aria-label": `Remove ${file.name}`,
        onClick: () => setFiles(
          (values) => values.filter((_, position) => position !== index)
        ),
        className: "ms-auto text-muted"
      },
      createElement(X, { size: 15 })
    )
  ))) : null))));
}
