import { createElement, Fragment } from '../../runtime/dom.js';
import { Link as Link } from "../../runtime/navigation.js";
import { useState } from "../../runtime/dom.js";
import { z } from "../../vendor/schema.js";
import { useI18n, locales } from "../../i18n/provider.js";
import { useAuth } from "../../hooks/use-auth.js";
import { useUI } from "../../components/ui-provider.js";
import {
  usePersistentState,
  usePreference,
  resetDemoData
} from "../../lib/client-store.js";
import { roles, permissions, rolePermissions } from "../../lib/permissions.js";
import { defaultFlags } from "../../hooks/use-navigation.js";
import { appConfig } from "../../config/app.js";
import { PageHeader, Card, Button, Badge } from "../../components/primitives.js";
import { Toggle } from "../../components/interactions.js";
import { AppearanceControls } from "../../components/layout/customizer.js";
import { Confirmation } from "../../components/data/confirmation.js";
export const settingsSections = [
  "general",
  "company",
  "branding",
  "localization",
  "currency",
  "taxes",
  "shipping",
  "notifications",
  "email",
  "sms",
  "payment",
  "security",
  "authentication",
  "roles",
  "appearance",
  "integrations",
  "features",
  "demo"
];
const titles = {
  features: "Feature Flags",
  roles: "Roles & Permissions",
  demo: "Developer / Demo"
};
const configs = {
  general: [
    { key: "name", label: "Application name", value: appConfig.name },
    {
      key: "supportEmail",
      label: "Support email",
      value: "support@example.com",
      type: "email"
    },
    { key: "timezone", label: "Timezone", value: "Asia/Kolkata" }
  ],
  company: [
    { key: "name", label: "Company", value: "Demo Care Commerce" },
    { key: "email", label: "Email", value: "demo@example.com", type: "email" },
    {
      key: "address",
      label: "Address",
      value: "Demo Building, Example Road, Kolkata"
    },
    { key: "taxId", label: "Tax registration", value: "DEMO-GST-0000" }
  ],
  branding: [
    {
      key: "tagline",
      label: "Tagline",
      value: "Your operations. One workspace."
    },
    {
      key: "logoText",
      label: "Logo text",
      value: appConfig.name.toUpperCase()
    }
  ],
  taxes: [
    { key: "taxName", label: "Tax", value: "Demo GST" },
    { key: "rate", label: "Tax rate", value: "12", type: "number" }
  ],
  shipping: [
    { key: "provider", label: "Carrier", value: "Demo Express" },
    { key: "charge", label: "Shipping charge", value: "49", type: "number" },
    {
      key: "freeAbove",
      label: "Free shipping threshold",
      value: "999",
      type: "number"
    }
  ],
  notifications: [
    { key: "sender", label: "Sender name", value: appConfig.name },
    { key: "digest", label: "Digest frequency", value: "Daily" }
  ],
  email: [
    { key: "sender", label: "Sender name", value: "Demo Care" },
    { key: "email", label: "Email", value: "demo@example.com", type: "email" }
  ],
  sms: [
    { key: "sender", label: "Sender ID", value: "DEMONX" },
    { key: "template", label: "Template reference", value: "DEMO-TEMPLATE" }
  ],
  payment: [
    { key: "provider", label: "Provider", value: "Mock payment adapter" },
    { key: "reference", label: "Reference", value: "DEMO-PAYMENT" }
  ],
  security: [
    {
      key: "timeout",
      label: "Session timeout (minutes)",
      value: "60",
      type: "number"
    },
    {
      key: "retention",
      label: "Audit retention (days)",
      value: "30",
      type: "number"
    }
  ],
  authentication: [
    {
      key: "provider",
      label: "Provider",
      value: "Demo authentication adapter"
    }
  ],
  integrations: [
    { key: "provider", label: "Provider", value: "Local mock adapter" },
    {
      key: "baseUrl",
      label: "API base URL",
      value: "https://api.example.com",
      type: "url"
    }
  ]
};
export function SettingsPage({ section }) {
  const { t, locale, setLocale } = useI18n();
  const { notify } = useUI();
  const auth = useAuth();
  const [currency, setCurrency] = usePreference("nexa-currency", "INR", [
    "INR",
    "USD",
    "EUR",
    "AED"
  ]);
  const [flags, setFlags] = usePersistentState("feature-flags", defaultFlags);
  const [reset, setReset] = useState(false);
  const fields = configs[section] ?? [];
  const defaults = Object.fromEntries(
    fields.map((field) => [field.key, field.value])
  );
  const [settings, setSettings] = usePersistentState(
    "settings:" + section,
    defaults
  );
  const [error, setError] = useState("");
  return createElement(Fragment, null, createElement(
    PageHeader,
    {
      title: t(
        titles[section] ?? section[0].toUpperCase() + section.slice(1)
      ),
      description: t(
        "Configure your reusable workspace. Preferences persist in this browser."
      )
    }
  ), createElement("div", { className: "grid gap-5 lg:grid-cols-[210px_1fr]" }, createElement("nav", { className: "surface no-print h-fit p-2", "aria-label": t("Settings") }, settingsSections.map((item) => createElement(
    Link,
    {
      key: item,
      href: "/settings/" + item,
      "aria-current": item === section ? "page" : void 0,
      className: `block rounded px-3 py-2 text-xs ${item === section ? "bg-brand/10 text-brand" : "text-muted"}`
    },
    t(titles[item] ?? item[0].toUpperCase() + item.slice(1))
  ))), createElement(Card, { className: "min-w-0 p-5" }, section === "appearance" ? createElement(AppearanceControls, null) : ["localization", "currency"].includes(section) ? createElement("div", { className: "grid gap-5 sm:grid-cols-2" }, createElement("label", null, createElement("span", { className: "field-label" }, t("Language")), createElement(
    "select",
    {
      className: "field",
      value: locale,
      onChange: (event) => setLocale(event.target.value)
    },
    locales.map((item) => createElement("option", { key: item.value, value: item.value }, item.label))
  )), createElement("label", null, createElement("span", { className: "field-label" }, t("Currency")), createElement(
    "select",
    {
      className: "field",
      value: currency,
      onChange: (event) => setCurrency(event.target.value)
    },
    ["INR", "USD", "EUR", "AED"].map((item) => createElement("option", { key: item }, item))
  ))) : section === "features" ? createElement("div", { className: "space-y-5" }, appConfig.features.map((flag) => createElement(
    "div",
    {
      key: flag,
      className: "flex justify-between gap-3 border-b border-ui pb-4"
    },
    createElement("span", { className: "capitalize" }, t(flag[0].toUpperCase() + flag.slice(1))),
    createElement(
      Toggle,
      {
        label: flag,
        checked: flags[flag],
        onChange: (checked) => setFlags((prev) => ({ ...prev, [flag]: checked }))
      }
    )
  ))) : section === "roles" ? createElement(PermissionMatrix, null) : section === "demo" ? createElement("div", { className: "space-y-5" }, createElement(Badge, { tone: "warning" }, t("Demo workspace")), createElement("p", { className: "text-sm text-muted" }, t("Synthetic data only")), createElement("label", { className: "block" }, createElement("span", { className: "field-label" }, t("Role")), createElement(
    "select",
    {
      className: "field",
      value: auth.role ?? "Super Admin",
      onChange: (event) => auth.switchRole(
        event.target.value
      )
    },
    roles.map((role) => createElement("option", { key: role }, role))
  )), createElement("p", { className: "text-xs text-muted" }, t(
    "Switching roles changes visible routes and allowed actions."
  )), createElement(Button, { variant: "danger", onClick: () => setReset(true) }, t("Reset demo data"))) : createElement(
    "form",
    {
      key: section,
      className: "space-y-5",
      onSubmit: (event) => {
        event.preventDefault();
        const values = Object.fromEntries(
          new FormData(event.currentTarget).entries()
        );
        const schema = z.object(
          Object.fromEntries(
            fields.map((field) => [
              field.key,
              field.type === "email" ? z.email("Enter a valid email") : field.type === "number" ? z.string().refine(
                (value) => value.trim() !== "" && Number.isFinite(Number(value)) && Number(value) >= 0,
                "Enter a valid number"
              ) : z.string().trim().min(1, "Required field")
            ])
          )
        );
        const result = schema.safeParse(values);
        if (!result.success) {
          setError(t(result.error.issues[0].message));
          return;
        }
        setSettings(result.data);
        setError("");
        notify(t("Saved successfully"));
      }
    },
    fields.map((field) => createElement("label", { key: field.key, className: "block" }, createElement("span", { className: "field-label" }, t(field.label)), createElement(
      "input",
      {
        required: true,
        className: "field",
        name: field.key,
        type: field.type ?? "text",
        min: field.type === "number" ? 0 : void 0,
        defaultValue: settings[field.key] ?? field.value
      }
    ))),
    [
      "security",
      "authentication",
      "integrations",
      "payment",
      "email",
      "sms"
    ].includes(section) && createElement("p", { className: "rounded border border-ui bg-[var(--panel-2)] p-3 text-xs text-muted" }, t(
      "Configuration is saved locally. External services are not connected."
    )),
    error && createElement("p", { role: "alert", className: "text-danger" }, error),
    createElement(Button, { type: "submit" }, t("Save"))
  ))), reset && createElement(
    Confirmation,
    {
      title: "Reset demo data",
      onClose: () => setReset(false),
      onConfirm: async () => {
        resetDemoData();
        setReset(false);
        notify(t("Saved successfully"));
      }
    }
  ));
}
function PermissionMatrix() {
  const { t } = useI18n();
  const [role, setRole] = useState("Super Admin");
  return createElement(Fragment, null, createElement("label", { className: "mb-4 block" }, createElement("span", { className: "field-label" }, t("Role")), createElement(
    "select",
    {
      className: "field",
      value: role,
      onChange: (event) => setRole(event.target.value)
    },
    roles.map((item) => createElement("option", { key: item }, item))
  )), createElement("p", { className: "mb-4 text-xs text-muted" }, t("Frontend demo permissions. Enforce authorization in your backend.")), createElement("div", { className: "overflow-x-auto" }, createElement("table", { className: "table-ui" }, createElement("thead", null, createElement("tr", null, createElement("th", null, t("Permissions")), createElement("th", null, t("Allowed")))), createElement("tbody", null, permissions.map((permission) => createElement("tr", { key: permission }, createElement("td", null, createElement("code", null, permission)), createElement("td", null, createElement(
    "span",
    {
      "aria-label": rolePermissions[role].includes(permission) ? t("Yes") : t("No"),
      className: rolePermissions[role].includes(permission) ? "text-success" : "text-muted"
    },
    rolePermissions[role].includes(permission) ? "\u2713" : "\u2014"
  ))))))));
}
