import { createElement, Fragment } from '../../runtime/dom.js';
import {
  useState,
  cloneElement,
  isValidElement
} from "../../runtime/dom.js";
import { useForm } from "../../vendor/forms.js";
import { zodResolver } from "../../vendor/resolver.js";
import { z } from "../../vendor/schema.js";
import { Card, Button } from "../../components/primitives.js";
import { usePersistentState } from "../../lib/client-store.js";
import { useI18n } from "../../i18n/provider.js";
import { useUI } from "../../components/ui-provider.js";
import { ExampleFrame } from "./example-frame.js";
import { UploadExample } from "./upload-example.js";
const schema = z.object({
  name: z.string().min(2, "Enter at least two characters"),
  email: z.email("Enter a valid email"),
  team: z.string().min(1, "Required field"),
  budget: z.number().min(100, "Budget must be at least 100"),
  notes: z.string(),
  accepted: z.boolean().refine((value) => value, "Accept the terms to continue")
});
const defaults = {
  name: "",
  email: "",
  team: "Operations",
  budget: 1e3,
  notes: "",
  accepted: false
};
export function FormExamples({ variant }) {
  const { t, currency } = useI18n();
  const { notify } = useUI();
  const [saved, setSaved] = usePersistentState(
    `library-form-${variant}`,
    null
  );
  const [step, setStep] = useState(0);
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaults,
    mode: variant === "validation" ? "onChange" : "onSubmit"
  });
  const wizard = variant === "wizard";
  const horizontal = variant === "horizontal";
  const source = 'import { useForm } from "../../vendor/forms.js";\nimport { zodResolver } from "../../vendor/resolver.js";\n\nconst form = useForm({ resolver: zodResolver(schema), defaultValues });\n// See features/library/form-examples.js for fields and step validation.';
  if (variant === "upload")
    return createElement(
      ExampleFrame,
      {
        category: "forms",
        variant,
        source: 'import { UploadExample } from "./upload-example.js";\n\n<UploadExample />'
      },
      createElement(UploadExample, null)
    );
  const field = (key, label, input) => {
    const control = isValidElement(input) && typeof input.type === "string" && ["input", "select", "textarea"].includes(input.type) ? cloneElement(
      input,
      {
        "aria-label": t(label),
        "aria-describedby": errors[key] ? `library-error-${key}` : void 0
      }
    ) : input;
    return createElement(
      "label",
      {
        className: horizontal ? "grid items-start gap-2 sm:grid-cols-[150px_1fr]" : "block"
      },
      createElement("span", { className: "field-label sm:pt-2" }, t(label)),
      createElement("span", { className: "block" }, control, errors[key] && createElement(
        "span",
        {
          id: `library-error-${key}`,
          role: "alert",
          className: "mt-1 block text-xs text-danger"
        },
        t(String(errors[key]?.message))
      ))
    );
  };
  return createElement(ExampleFrame, { category: "forms", variant, source }, createElement("div", { className: "grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]" }, createElement(Card, { className: "p-5" }, wizard && createElement("ol", { className: "mb-6 flex flex-wrap gap-3" }, ["Contact", "Project", "Review"].map((label, index) => createElement(
    "li",
    {
      key: label,
      "aria-current": step === index ? "step" : void 0,
      className: `flex items-center gap-2 text-xs ${index === step ? "text-brand" : "text-muted"}`
    },
    createElement(
      "span",
      {
        className: `grid size-6 place-items-center rounded-full border ${index === step ? "border-brand bg-brand/10" : "border-ui"}`
      },
      index + 1
    ),
    t(label)
  ))), variant === "validation" && createElement("p", { className: "mb-5 rounded bg-info/10 p-3 text-xs text-info" }, t("Validation runs as you type.")), createElement(
    "form",
    {
      noValidate: true,
      onSubmit: handleSubmit((value) => {
        setSaved(value);
        notify(t("Saved successfully"));
      }),
      className: "space-y-5"
    },
    (!wizard || step === 0) && createElement(Fragment, null, field(
      "name",
      "Name",
      createElement(
        "input",
        {
          className: "field",
          ...register("name"),
          "aria-invalid": !!errors.name,
          autoComplete: "name"
        }
      )
    ), field(
      "email",
      "Email",
      createElement(
        "input",
        {
          className: "field",
          type: "email",
          ...register("email"),
          "aria-invalid": !!errors.email,
          autoComplete: "email"
        }
      )
    ), field(
      "team",
      "Team",
      createElement("select", { className: "field", ...register("team") }, ["Operations", "Finance", "Support"].map((value) => createElement("option", { key: value, value }, t(value))))
    )),
    (!wizard || step === 1) && createElement(Fragment, null, field(
      "budget",
      "Budget",
      createElement(
        "input",
        {
          className: "field",
          type: "number",
          min: 100,
          ...register("budget", { valueAsNumber: true }),
          "aria-invalid": !!errors.budget
        }
      )
    ), field(
      "notes",
      "Notes",
      createElement(
        "textarea",
        {
          className: "field min-h-24",
          ...register("notes")
        }
      )
    ), field(
      "accepted",
      "Terms",
      createElement("span", { className: "flex items-center gap-2" }, createElement(
        "input",
        {
          type: "checkbox",
          ...register("accepted"),
          "aria-invalid": !!errors.accepted
        }
      ), t("Accept the demo terms"))
    )),
    wizard && step === 2 && createElement("dl", { className: "grid gap-3 rounded border border-ui bg-[var(--panel-2)] p-4 text-xs" }, Object.entries(getValues()).map(([key, value]) => createElement(
      "div",
      {
        key,
        className: "flex flex-wrap justify-between gap-2"
      },
      createElement("dt", { className: "capitalize text-muted" }, t(key[0].toUpperCase() + key.slice(1))),
      createElement("dd", { className: "break-all font-medium" }, typeof value === "boolean" ? t(value ? "Yes" : "No") : String(value))
    ))),
    createElement("div", { className: "flex flex-wrap justify-end gap-2 border-t border-ui pt-4" }, createElement(
      Button,
      {
        type: "button",
        variant: "secondary",
        onClick: () => {
          reset(defaults);
          setStep(0);
        }
      },
      t("Reset")
    ), wizard && step > 0 && createElement(
      Button,
      {
        type: "button",
        variant: "secondary",
        onClick: () => setStep((value) => value - 1)
      },
      t("Previous")
    ), wizard && step < 2 ? createElement(
      Button,
      {
        type: "button",
        onClick: async () => {
          const valid = await trigger(
            step === 0 ? ["name", "email", "team"] : ["budget", "accepted"]
          );
          if (valid) setStep((value) => value + 1);
        }
      },
      t("Next")
    ) : createElement(Button, { type: "submit", disabled: isSubmitting }, t("Save")))
  )), createElement(Card, { className: "h-fit p-5" }, createElement("h2", { className: "text-sm font-semibold" }, t("Saved preview")), createElement("p", { className: "mb-4 mt-2 text-xs text-muted" }, t("Saved locally in this browser.")), saved ? createElement("dl", { className: "space-y-3 text-xs" }, [
    ["Name", saved.name],
    ["Email", saved.email],
    ["Team", t(saved.team)],
    ["Budget", currency(saved.budget)],
    ["Notes", saved.notes || "\u2014"]
  ].map(([key, value]) => createElement("div", { key }, createElement("dt", { className: "text-muted" }, t(key)), createElement("dd", { className: "mt-1 break-words font-medium" }, value)))) : createElement("p", { className: "text-xs text-muted" }, t("Complete the form to see the saved record.")))));
}
