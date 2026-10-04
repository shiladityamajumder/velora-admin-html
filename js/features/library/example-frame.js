import { createElement, Fragment } from '../../runtime/dom.js';
import { Link as Link } from "../../runtime/navigation.js";
import { libraryCategories, exampleHref } from "../../config/library.js";
import { useI18n } from "../../i18n/provider.js";
import { PageHeader, Card } from "../../components/primitives.js";
export function ExampleFrame({
  category,
  variant,
  children,
  source
}) {
  const { t } = useI18n();
  const templates = {
    tables: ["TableExamples", "table-examples"], charts: ["ChartExamples", "chart-examples"],
    forms: ["FormExamples", "form-examples"], calendars: ["CalendarExamples", "calendar-examples"],
    components: ["ElementExamples", "element-examples"], patterns: ["PatternExamples", "pattern-examples"],
    authentication: ["AuthGallery", "auth-gallery"],
  };
  const [templateName, filename] = templates[category];
  source = `<!-- HTML template: library/${category}/${variant}/index.html -->
<link rel="stylesheet" href="/css/velora.css">
<div id="app"></div>
<script type="module">
import { createElement, mount } from '/js/runtime/dom.js';
import { UIProvider } from '/js/components/ui-provider.js';
import { ${templateName} } from '/js/features/library/${filename}.js';
mount(document.getElementById('app'), () =>
  createElement(UIProvider, null, createElement(${templateName}, { variant: '${variant}' }))
);
</script>`;
  const definition = libraryCategories.find((item) => item.slug === category);
  const example = definition.examples.find((item) => item.slug === variant);
  return createElement(Fragment, null, createElement(
    PageHeader,
    {
      title: example.title,
      description: example.description,
      actions: createElement(
        Link,
        {
          href: "/library",
          className: "rounded border border-ui px-3 py-2 text-xs hover:text-brand"
        },
        t("Library overview")
      )
    }
  ), createElement(
    "nav",
    {
      "aria-label": t(definition.title),
      className: "no-print mb-5 flex flex-wrap gap-2"
    },
    definition.examples.map((item) => createElement(
      Link,
      {
        key: item.slug,
        href: exampleHref(category, item),
        "aria-current": variant === item.slug ? "page" : void 0,
        className: `rounded border px-3 py-2 text-xs ${variant === item.slug ? "border-brand bg-brand/10 text-brand" : "border-ui hover:border-brand"}`
      },
      t(item.title)
    ))
  ), children, createElement(Card, { className: "mt-5 p-4" }, createElement("details", null, createElement("summary", { className: "cursor-pointer text-xs font-medium" }, t("Reuse this example")), createElement(
    "pre",
    {
      className: "mt-4 overflow-x-auto rounded bg-[var(--panel-2)] p-4 text-xs leading-6",
      dir: "ltr"
    },
    createElement("code", null, source)
  ))));
}
