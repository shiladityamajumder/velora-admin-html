import {
  LayoutDashboard,
  ShoppingBag,
  Pill,
  FlaskConical,
  Stethoscope,
  Package,
  Truck,
  Users,
  Headphones,
  Wallet,
  Megaphone,
  Building2,
  FileText,
  Settings,
  Shield,
  BookOpen,
  Layers,
  Table2,
  ChartNoAxesCombined,
  FormInput,
  CalendarDays,
  LogIn,
  Component
} from "../vendor/icons.js";
import { navGroups as originalGroups } from "../lib/navigation.js";
import { modules } from "./modules.js";
import { libraryCategories, exampleHref } from "./library.js";
const icons = {
  Commerce: ShoppingBag,
  Pharmacy: Pill,
  Diagnostics: FlaskConical,
  Doctors: Stethoscope,
  Inventory: Package,
  Procurement: Building2,
  Warehouse: Building2,
  CRM: Users,
  Support: Headphones,
  Logistics: Truck,
  Finance: Wallet,
  Marketing: Megaphone,
  Content: FileText,
  Vendors: Building2,
  Administration: Shield,
  Apps: Layers
};
export const enterpriseDashboards = [
  "executive",
  "pharmacy",
  "diagnostics",
  "inventory",
  "marketing",
  "logistics",
  "support",
  "vendor"
];
const dashboardPermissions = {
  executive: "analytics.view",
  analytics: "analytics.view",
  projects: "crm.manage",
  restaurant: "orders.update",
  pharmacy: "pharmacy.view",
  diagnostics: "diagnostics.view",
  inventory: "inventory.view",
  marketing: "marketing.view",
  logistics: "logistics.view",
  support: "support.view",
  vendor: "vendors.view",
  ecommerce: "products.update",
  crm: "crm.manage",
  finance: "finance.manage"
};
const dashboardFeatures = {
  diagnostics: "diagnostics",
  crm: "crm",
  marketing: "marketing",
  vendor: "vendors"
};
const libraryIcons = {
  tables: Table2,
  charts: ChartNoAxesCombined,
  forms: FormInput,
  calendars: CalendarDays,
  authentication: LogIn,
  components: Component,
  patterns: Component
};
export const navigation = [
  {
    label: "Template",
    icon: Layers,
    items: [
      { label: "Template overview", href: "/template", icon: Layers },
      { label: "Documentation", href: "/docs", icon: BookOpen }
    ]
  },
  {
    label: "Dashboards",
    icon: LayoutDashboard,
    items: [
      ...enterpriseDashboards.map((slug) => ({
        label: slug[0].toUpperCase() + slug.slice(1),
        href: "/dashboard/" + slug,
        icon: LayoutDashboard,
        permission: dashboardPermissions[slug],
        feature: dashboardFeatures[slug]
      })),
      ...originalGroups[0].items.map((item) => ({
        ...item,
        permission: dashboardPermissions[item.href.split("/").at(-1)],
        feature: dashboardFeatures[item.href.split("/").at(-1)]
      }))
    ]
  },
  ...Object.keys(icons).filter((group) => group !== "Apps").map((group) => ({
    label: group,
    icon: icons[group],
    items: modules.filter((module) => module.group === group).map((module) => ({
      label: module.title,
      href: "/" + module.path,
      icon: icons[group],
      permission: module.view,
      feature: module.feature
    }))
  })),
  {
    label: "Apps",
    icon: Layers,
    items: [
      {
        label: "File Manager",
        href: "/apps/files",
        icon: Layers,
        permission: "products.view"
      },
      {
        label: "Kanban",
        href: "/apps/kanban",
        icon: Layers,
        permission: "crm.view"
      },
      {
        label: "Projects",
        href: "/apps/projects",
        icon: Layers,
        permission: "crm.manage"
      },
      ...originalGroups[1].items.map((item) => ({
        ...item,
        permission: {
          products: "products.update",
          invoices: "finance.manage",
          pos: "orders.create"
        }[item.href.split("/").at(-1)]
      })),
      ...modules.filter((module) => module.group === "Apps").map((module) => ({
        label: module.title,
        href: "/" + module.path,
        icon: Layers,
        permission: module.view
      }))
    ]
  },
  {
    label: "Interface",
    icon: Layers,
    items: [
      ...originalGroups[2].items.map((item) => ({
        ...item,
        permission: item.href === "/tables" ? "users.manage" : void 0
      })),
      {
        label: "Advanced Tables",
        href: "/tables/advanced",
        icon: Package,
        permission: "customers.view"
      }
    ]
  },
  {
    label: "Settings",
    icon: Settings,
    items: [
      "general",
      "company",
      "localization",
      "appearance",
      "security",
      "integrations",
      "features",
      "roles",
      "demo"
    ].map((slug) => ({
      label: {
        features: "Feature Flags",
        roles: "Roles & Permissions",
        demo: "Developer / Demo"
      }[slug] ?? slug[0].toUpperCase() + slug.slice(1),
      href: "/settings/" + slug,
      icon: Settings,
      permission: slug === "demo" ? void 0 : "settings.manage"
    }))
  },
  {
    label: "Account",
    icon: Users,
    items: [...originalGroups[3].items, ...originalGroups[4].items]
  },
  {
    label: "Library overview",
    section: "UI Library",
    icon: BookOpen,
    items: [{ label: "Browse all examples", href: "/library", icon: BookOpen }]
  },
  ...libraryCategories.map((category) => ({
    label: category.title,
    section: "UI Library",
    icon: libraryIcons[category.slug],
    items: category.examples.map((example) => ({
      label: example.title,
      href: exampleHref(category.slug, example),
      icon: libraryIcons[category.slug]
    }))
  }))
];
const aliases = [
  {
    label: "Pipeline",
    href: "/crm/pipeline",
    icon: Users,
    permission: "crm.view",
    feature: "crm"
  },
  {
    label: "Audit Logs",
    href: "/admin/audit",
    icon: Shield,
    permission: "users.manage"
  },
  {
    label: "Medicines",
    href: "/pharmacy/medicines",
    icon: Pill,
    permission: "products.view"
  },
  {
    label: "Pharmacy Orders",
    href: "/pharmacy/orders",
    icon: Pill,
    permission: "orders.view"
  },
  {
    label: "Batches",
    href: "/inventory/batches",
    icon: Package,
    permission: "inventory.view"
  },
  {
    label: "Expiry",
    href: "/inventory/expiry",
    icon: Package,
    permission: "inventory.view"
  },
  {
    label: "Low stock",
    href: "/inventory/low-stock",
    icon: Package,
    permission: "inventory.view"
  },
  {
    label: "Sample Collection",
    href: "/diagnostics/samples",
    icon: FlaskConical,
    permission: "diagnostics.view",
    feature: "diagnostics"
  }
];
for (const item of aliases) {
  const domain = item.href.split("/")[1];
  const group = navigation.find(
    (group2) => group2.label.toLowerCase() === domain || domain === "admin" && group2.label === "Administration"
  );
  group?.items.push(item);
}
