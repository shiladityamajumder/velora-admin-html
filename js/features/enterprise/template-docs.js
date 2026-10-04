import { createElement, Fragment } from '../../runtime/dom.js';
import { useI18n } from "../../i18n/provider.js";
import { PageHeader, Card } from "../../components/primitives.js";
const sections = [
  [
    "Getting started",
    "Run npm run dev. No dependency install is needed to preview the templates. Demo password: NexaDemo123! for superadmin@example.com, operations@example.com, pharmacy@example.com, support@example.com, finance@example.com or vendor@example.com."
  ],
  [
    "Project structure",
    "Each route has an index.html template. js/app.js handles browser navigation; js/components/data and js/components/layout provide shared controls. features/enterprise contains workflow compositions. config/ holds modules, navigation and app defaults. services/ contains replaceable repositories."
  ],
  [
    "Themes",
    "AppearanceControls reads UIProvider preferences. Semantic variables are defined in css/velora.css. Add a preset in config/app.js. Appearance, sidebar, density, radius, width and header preferences persist separately from records."
  ],
  [
    "Internationalization",
    "The language selector supports English, Spanish, French, German, Brazilian Portuguese, Italian, Arabic, Hindi, Bengali, Simplified Chinese, Japanese and Korean, with flags and native language names. useI18n provides t, currency, number and date. Intl formatters live in i18n/format.js. Missing translations fall back to English. Arabic uses RTL layout."
  ],
  [
    "Tables",
    "DataTable<T> accepts typed columns, data and callbacks. TanStack Table handles sorting, pagination, filtering, selection, resizing and visibility. Numeric filters accept >, >=, < and <=. Shift-click column headings for multiple sorting. Export uses the filtered rows and visible columns."
  ],
  [
    "Forms",
    "RecordForm uses the bundled form helpers and Zod with the native DOM renderer. Module fields define sections and input types. moduleSchema validates at the form and repository boundaries. Product sections include pricing, variants, attributes, media and healthcare metadata."
  ],
  [
    "RBAC",
    "lib/permissions.js defines roles and permission grants. useAuth exposes has(permission). Navigation, AccessGuard and actions apply these grants. This frontend demonstration must be paired with server authorization in a real application."
  ],
  [
    "Services",
    "Repository<T> exposes list, getById, create, update, delete and subscribe. Replace serviceFor(module) with API-backed implementations that satisfy the same contract. useRepository manages async loading, errors, subscriptions and stale requests."
  ],
  [
    "Mock data",
    "Versioned records use nexa-demo-v2:* storage keys. Existing apps keep nexa-data-v1:* keys. Mutations synchronize within the page and across tabs, generate audit entries and support an in-memory fallback. Settings \u2192 Developer / Demo resets records."
  ],
  [
    "Adding modules",
    "Register a ModuleDefinition in config/modules.js and provide a field set and synthetic seed. The domain route resolver creates list, create, detail and edit screens. Customize RecordDetail or add a feature composition for domain-specific workflows."
  ],
  [
    "Adding dashboards",
    "Compose existing StatCard, TrendAreaChart, DonutChart, CompactBarChart and table widgets. Register the slug and permission in config/navigation.js and connect the route. New enterprise dashboards calculate metrics from repository records."
  ],
  [
    "Integration notes",
    "Authentication, payments, messages, reports and external providers are local demonstrations. Security settings and API base URL fields save configuration only. Full API integration and clinical decision-making are outside this template."
  ]
];
export function TemplateDocs() {
  const { t } = useI18n();
  return createElement(Fragment, null, createElement(
    PageHeader,
    {
      title: t("Documentation"),
      description: t(
        "Services, architecture, configuration and extension guides."
      )
    }
  ), createElement("div", { className: "grid gap-5 lg:grid-cols-[200px_1fr]" }, createElement("nav", { className: "surface h-fit p-4" }, sections.map(([title], index) => createElement(
    "a",
    {
      key: title,
      href: "#doc-" + index,
      className: "block py-2 text-xs text-muted hover:text-brand"
    },
    t(title)
  ))), createElement("div", { className: "space-y-4" }, sections.map(([title, description], index) => createElement(Card, { key: title, className: "scroll-mt-20 p-5" }, createElement("section", { id: "doc-" + index }, createElement("h2", { className: "mb-3 text-sm font-semibold" }, t(title)), createElement("p", { className: "whitespace-pre-wrap text-sm leading-7 text-muted" }, t(description))))))));
}
