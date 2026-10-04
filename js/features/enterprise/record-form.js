import { createElement, Fragment } from '../../runtime/dom.js';
import { useMemo, useState } from "../../runtime/dom.js";
import { Image as Image } from "../../runtime/navigation.js";
import { useForm, useWatch } from "../../vendor/forms.js";
import { zodResolver } from "../../vendor/resolver.js";
import {
  moduleSchema,
  emptyRecord
} from "../../config/modules.js";
import { useI18n } from "../../i18n/provider.js";
import { Button } from "../../components/primitives.js";
import { Plus, X, Upload } from "../../vendor/icons.js";
export function RecordForm({
  module,
  record,
  onSave,
  onCancel
}) {
  const { t } = useI18n();
  const schema = useMemo(() => moduleSchema(module), [module]);
  const sections = [
    ...new Set([
      "Basic Information",
      ...module.fields.map((field) => field.section ?? "Basic Information")
    ])
  ];
  const [section, setSection] = useState(sections[0]);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    control
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: record ?? emptyRecord(module)
  });
  const watched = useWatch({ control });
  const submit = handleSubmit(
    async (value) => {
      setError("");
      try {
        await onSave(schema.parse(value));
      } catch (error2) {
        setError(
          error2 instanceof Error ? error2.message : "Something went wrong"
        );
      }
    },
    (invalid) => {
      const key = Object.keys(invalid)[0];
      const field = module.fields.find((field2) => field2.key === key);
      setSection(field?.section ?? "Basic Information");
    }
  );
  return createElement("form", { noValidate: true, onSubmit: submit, className: "space-y-5" }, createElement(
    "div",
    {
      role: "tablist",
      "aria-label": t("Details"),
      className: "flex flex-wrap gap-1 border-b border-ui pb-3"
    },
    sections.map((item) => createElement(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": section === item,
        "aria-controls": "editor-panel",
        key: item,
        className: `rounded px-3 py-2 text-xs ${section === item ? "bg-brand/10 text-brand" : "text-muted hover:bg-[var(--panel-2)]"}`,
        onClick: () => setSection(item)
      },
      t(item)
    ))
  ), createElement(
    "div",
    {
      id: "editor-panel",
      role: "tabpanel",
      className: "grid gap-4 sm:grid-cols-2"
    },
    section === "Basic Information" && createElement(Fragment, null, createElement("label", { className: "block" }, createElement("span", { className: "field-label" }, t("Name"), " *"), createElement(
      "input",
      {
        className: "field",
        ...register("name"),
        "aria-invalid": !!errors.name
      }
    ), errors.name && createElement("span", { role: "alert", className: "text-xs text-danger" }, t(String(errors.name.message)))), createElement("label", { className: "block" }, createElement("span", { className: "field-label" }, t("Status")), createElement("select", { className: "field", ...register("status") }, module.statuses.map((value) => createElement(
      "option",
      {
        key: value,
        value,
        disabled: module.workflow && value !== (record?.status ?? module.statuses[0])
      },
      t(value)
    ))))),
    module.fields.filter((field) => (field.section ?? "Basic Information") === section).map((field) => createElement(
      "div",
      {
        key: field.key,
        className: ["textarea", "media"].includes(field.kind) ? "sm:col-span-2" : ""
      },
      ["attributes", "variants", "tags"].includes(field.key) ? createElement(
        RepeatableField,
        {
          label: t(field.label),
          value: String(watched[field.key] ?? ""),
          tags: field.key === "tags",
          onChange: (value) => {
            setValue(field.key, value);
          }
        }
      ) : field.kind === "media" ? createElement(
        MediaField,
        {
          value: String(watched[field.key] ?? ""),
          label: t(field.label),
          onChange: (value) => setValue(field.key, value)
        }
      ) : createElement("label", { className: "block" }, createElement("span", { className: "field-label" }, t(field.label), " ", field.required ? "*" : ""), field.kind === "textarea" ? createElement(
        "textarea",
        {
          rows: 6,
          className: "field",
          ...register(field.key),
          "aria-invalid": !!errors[field.key]
        }
      ) : field.kind === "select" ? createElement("select", { className: "field", ...register(field.key) }, field.options?.map((value) => createElement("option", { key: value, value }, t(value)))) : field.kind === "boolean" ? createElement("input", { type: "checkbox", ...register(field.key) }) : createElement(
        "input",
        {
          className: "field",
          type: inputType(field),
          ...register(field.key, {
            valueAsNumber: ["number", "currency"].includes(
              field.kind
            )
          }),
          min: field.min,
          max: field.max,
          step: field.kind === "currency" ? "0.01" : void 0,
          "aria-invalid": !!errors[field.key]
        }
      )),
      errors[field.key] && createElement("p", { role: "alert", className: "mt-1 text-xs text-danger" }, t(String(errors[field.key]?.message)))
    ))
  ), error && createElement(
    "p",
    {
      role: "alert",
      className: "rounded bg-danger/10 p-3 text-xs text-danger"
    },
    t(error)
  ), createElement("div", { className: "flex flex-wrap justify-end gap-2 border-t border-ui pt-4" }, createElement(Button, { variant: "secondary", onClick: onCancel }, t("Cancel")), module.statuses.includes("Draft") && createElement(
    Button,
    {
      variant: "secondary",
      disabled: isSubmitting,
      onClick: async () => {
        setValue("status", "Draft");
        await submit();
      }
    },
    t("Save draft")
  ), createElement(Button, { type: "submit", disabled: isSubmitting }, t("Save"))));
}
function inputType(field) {
  return field.kind === "currency" ? "number" : ["email", "date", "number"].includes(field.kind) ? field.kind : "text";
}
function RepeatableField({
  label,
  value,
  tags,
  onChange
}) {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const delimiter = tags ? "," : "\n";
  const entries = value.split(delimiter).filter(Boolean);
  return createElement("div", null, createElement("label", { className: "field-label" }, label), createElement("div", { className: "mb-3 flex flex-wrap gap-2" }, entries.map((entry, i) => createElement(
    "div",
    {
      key: i,
      className: "flex max-w-full items-center gap-2 rounded border border-ui px-2 py-1 text-xs"
    },
    tags ? createElement("span", null, entry) : createElement(
      "input",
      {
        "aria-label": label + " " + (i + 1),
        className: "min-w-0 bg-transparent",
        value: entry,
        onChange: (event) => onChange(
          entries.map((item, j) => j === i ? event.target.value : item).join(delimiter)
        )
      }
    ),
    createElement(
      "button",
      {
        type: "button",
        "aria-label": t("Delete") + " " + entry,
        onClick: () => onChange(entries.filter((_, j) => j !== i).join(delimiter))
      },
      createElement(X, { size: 12 })
    )
  ))), createElement("div", { className: "flex gap-2" }, createElement(
    "input",
    {
      "aria-label": label,
      className: "field",
      value: input,
      onChange: (event) => setInput(event.target.value),
      onKeyDown: (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          if (input.trim()) {
            onChange([...entries, input.trim()].join(delimiter));
            setInput("");
          }
        }
      }
    }
  ), createElement(
    Button,
    {
      variant: "secondary",
      onClick: () => {
        if (input.trim()) {
          onChange([...entries, input.trim()].join(delimiter));
          setInput("");
        }
      }
    },
    createElement(Plus, { size: 14 }),
    t("Create")
  )));
}
function MediaField({
  value,
  label,
  onChange
}) {
  const { t } = useI18n();
  const [error, setError] = useState("");
  return createElement("div", null, createElement("label", { className: "field-label" }, label), createElement("label", { className: "flex cursor-pointer items-center gap-3 rounded border border-dashed border-ui p-5" }, createElement(Upload, { size: 18 }), createElement("span", null, t("Upload image")), createElement(
    "input",
    {
      "aria-label": label,
      type: "file",
      accept: "image/png,image/jpeg,image/webp",
      className: "min-w-0 flex-1 text-xs",
      onChange: (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.size > 1024 * 1024 || !["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
          setError(t("Use PNG, JPG or WebP under 1 MB"));
          return;
        }
        setError("");
        const reader = new FileReader();
        reader.onload = () => onChange(String(reader.result));
        reader.readAsDataURL(file);
      }
    }
  )), error && createElement("p", { role: "alert", className: "text-danger" }, error), value.startsWith("data:image/") && createElement("div", { className: "mt-4 flex items-start gap-3" }, createElement(
    Image,
    {
      src: value,
      alt: label,
      width: 180,
      height: 180,
      unoptimized: true,
      className: "rounded object-contain"
    }
  ), createElement(Button, { variant: "ghost", onClick: () => onChange("") }, t("Delete"))));
}
