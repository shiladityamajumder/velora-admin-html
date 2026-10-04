import { createElement, Fragment } from '../../runtime/dom.js';
import { dynamic as dynamic } from "../../runtime/navigation.js";
import { Link as Link } from "../../runtime/navigation.js";
import {
  ArrowUpRight,
  Table2,
  ChartNoAxesCombined,
  FormInput,
  CalendarDays,
  LogIn,
  Component
} from "../../vendor/icons.js";
import { libraryCategories, exampleHref } from "../../config/library.js";
import { Card, PageHeader } from "../../components/primitives.js";
import { LoadingState } from "../../components/data/states.js";
import { useI18n } from "../../i18n/provider.js";
const Tables = dynamic(
  () => import("./table-examples.js").then((module) => module.TableExamples),
  { loading: () => createElement(LoadingState, null) }
);
const Charts = dynamic(
  () => import("./chart-examples.js").then((module) => module.ChartExamples),
  { loading: () => createElement(LoadingState, null) }
);
const Forms = dynamic(
  () => import("./form-examples.js").then((module) => module.FormExamples),
  { loading: () => createElement(LoadingState, null) }
);
const Calendars = dynamic(
  () => import("./calendar-examples.js").then((module) => module.CalendarExamples),
  { loading: () => createElement(LoadingState, null) }
);
const Elements = dynamic(
  () => import("./element-examples.js").then((module) => module.ElementExamples),
  { loading: () => createElement(LoadingState, null) }
);
const Patterns = dynamic(
  () => import("./pattern-examples.js").then((module) => module.PatternExamples),
  { loading: () => createElement(LoadingState, null) }
);
const Authentication = dynamic(
  () => import("./auth-gallery.js").then((module) => module.AuthGallery),
  { loading: () => createElement(LoadingState, null) }
);
const icons = {
  tables: Table2,
  charts: ChartNoAxesCombined,
  forms: FormInput,
  calendars: CalendarDays,
  authentication: LogIn,
  components: Component,
  patterns: Component
};
export function LibraryPage({
  category,
  variant
}) {
  const { t } = useI18n();
  if (category && variant) {
    if (category === "patterns")
      return createElement(Patterns, { key: variant, variant });
    if (category === "tables")
      return createElement(Tables, { key: variant, variant });
    if (category === "charts")
      return createElement(Charts, { key: variant, variant });
    if (category === "forms") return createElement(Forms, { key: variant, variant });
    if (category === "calendars")
      return createElement(Calendars, { key: variant, variant });
    if (category === "components")
      return createElement(Elements, { key: variant, variant });
    return createElement(Authentication, null);
  }
  return createElement(Fragment, null, createElement(
    PageHeader,
    {
      title: "UI Library",
      description: "Browse working examples and choose patterns to reuse in your next project."
    }
  ), createElement("div", { className: "grid gap-5 md:grid-cols-2 xl:grid-cols-3" }, libraryCategories.map((section, index) => {
    const Icon = icons[section.slug];
    return createElement(Card, { key: section.slug, className: "flex flex-col p-5" }, createElement("div", { className: "mb-4 flex items-center justify-between" }, createElement(
      Icon,
      {
        size: 23,
        style: { color: `var(--chart-${index % 6 + 1})` }
      }
    ), createElement("span", { className: "text-xs text-muted" }, section.examples.length, " ", t("Examples"))), createElement(
      "h2",
      {
        className: "text-sm font-semibold",
        style: { color: `var(--chart-${index % 6 + 1})` }
      },
      t(section.title)
    ), createElement("p", { className: "mb-4 mt-2 text-xs leading-5 text-muted" }, t(section.description)), createElement("div", { className: "space-y-1" }, section.examples.map((example) => createElement(
      Link,
      {
        key: example.slug,
        href: exampleHref(section.slug, example),
        className: "flex items-center justify-between gap-2 rounded px-2 py-2 text-xs hover:bg-[var(--panel-2)] hover:text-brand"
      },
      t(example.title),
      createElement(ArrowUpRight, { size: 13 })
    ))));
  })));
}
