import { createElement, Fragment } from '../../runtime/dom.js';
import { Link as Link } from "../../runtime/navigation.js";
import { useState } from "../../runtime/dom.js";
import { Package, TrendingUp, Users, ShoppingBag } from "../../vendor/icons.js";
import { modules } from "../../config/modules.js";
import { serviceFor } from "../../services/modules.js";
import { useRepository } from "../../hooks/use-repository.js";
import { useI18n } from "../../i18n/provider.js";
import {
  PageHeader,
  Card,
  CardHeader,
  StatCard,
  Badge
} from "../../components/primitives.js";
import {
  TrendAreaChart,
  DonutChart,
  CompactBarChart
} from "../../components/charts.js";
import {
  TableSkeleton,
  DataEmptyState,
  ErrorState
} from "../../components/data/states.js";
import { expirySeverity } from "../../lib/workflows.js";
const configs = {
  executive: {
    title: "Executive",
    source: "commerce/orders",
    secondary: "commerce/customers",
    trend: "Revenue trend",
    distribution: "Order status",
    group: "status",
    amount: "amount"
  },
  pharmacy: {
    title: "Pharmacy",
    source: "pharmacy/prescriptions",
    secondary: "inventory/stock",
    trend: "Prescription queue",
    distribution: "Review status",
    group: "status"
  },
  diagnostics: {
    title: "Diagnostics",
    source: "diagnostics/bookings",
    secondary: "diagnostics/tests",
    trend: "Booking trend",
    distribution: "Collection distribution",
    group: "collection",
    amount: "amount"
  },
  inventory: {
    title: "Inventory",
    source: "inventory/stock",
    secondary: "procurement/orders",
    trend: "Stock quantity",
    distribution: "Warehouse distribution",
    group: "warehouse",
    amount: "quantity"
  },
  marketing: {
    title: "Marketing",
    source: "marketing/campaigns",
    secondary: "crm/leads",
    trend: "Campaign budget",
    distribution: "Campaign type",
    group: "type",
    amount: "budget"
  },
  logistics: {
    title: "Logistics",
    source: "logistics/shipments",
    secondary: "logistics/partners",
    trend: "Shipment trend",
    distribution: "Carrier distribution",
    group: "carrier"
  },
  support: {
    title: "Support",
    source: "support/tickets",
    secondary: "support/agents",
    trend: "Ticket volume",
    distribution: "Ticket priority",
    group: "priority"
  },
  vendor: {
    title: "Vendor",
    source: "procurement/vendors",
    secondary: "finance/settlements",
    trend: "Vendor value",
    distribution: "Onboarding status",
    group: "status",
    amount: "amount"
  }
};
function groupData(rows, key, amount) {
  const groups = new Map();
  for (const row of rows) {
    const label = String(row[key]);
    groups.set(
      label,
      (groups.get(label) ?? 0) + (amount ? Number(row[amount]) : 1)
    );
  }
  return [...groups].map(([name, value]) => ({ name, value }));
}
export function EnterpriseDashboard({ slug }) {
  const config = configs[slug];
  const definition = modules.find(
    (definition2) => definition2.path === config.source
  );
  const secondary = modules.find(
    (definition2) => definition2.path === config.secondary
  );
  const { data, loading, error, reload } = useRepository(
    serviceFor(definition)
  );
  const { data: other } = useRepository(serviceFor(secondary));
  const { t, currency, number, date } = useI18n();
  const [status, setStatus] = useState("");
  const rows = data.filter((row) => !status || row.status === status);
  const sum = (key) => rows.reduce((sum2, row) => sum2 + Number(row[key] ?? 0), 0);
  const count = (...statuses) => rows.filter((row) => statuses.includes(row.status)).length;
  const metrics = slug === "executive" ? [
    {
      label: "Revenue",
      value: currency(sum("amount")),
      icon: TrendingUp
    },
    { label: "Orders", value: number(rows.length), icon: ShoppingBag },
    { label: "Customers", value: number(other.length), icon: Users },
    {
      label: "Average order value",
      value: currency(rows.length ? sum("amount") / rows.length : 0),
      icon: TrendingUp
    }
  ] : slug === "pharmacy" ? [
    {
      label: "Prescriptions",
      value: number(rows.length),
      icon: Package
    },
    {
      label: "Awaiting review",
      value: number(count("Pending")),
      icon: Package
    },
    {
      label: "Approved",
      value: number(count("Approved")),
      icon: ShoppingBag
    },
    {
      label: "Expiry alerts",
      value: number(
        other.filter(
          (row) => expirySeverity(String(row.expiryDate)) !== "success"
        ).length
      ),
      icon: Package
    }
  ] : slug === "diagnostics" ? [
    {
      label: "Bookings",
      value: number(rows.length),
      icon: ShoppingBag
    },
    {
      label: "Home Collection",
      value: number(
        rows.filter((row) => row.collection === "Home").length
      ),
      icon: Users
    },
    {
      label: "Pending reports",
      value: number(count("Processing", "Received", "Collected")),
      icon: Package
    },
    {
      label: "Completed",
      value: number(count("Completed")),
      icon: TrendingUp
    }
  ] : slug === "inventory" ? [
    {
      label: "Stock value",
      value: currency(
        rows.reduce(
          (sum2, row) => sum2 + Number(row.quantity) * Number(row.purchasePrice),
          0
        )
      ),
      icon: Package
    },
    {
      label: "Low stock",
      value: number(
        rows.filter((row) => Number(row.quantity) < 50).length
      ),
      icon: Package
    },
    {
      label: "Out of stock",
      value: number(
        rows.filter((row) => !Number(row.quantity)).length
      ),
      icon: Package
    },
    {
      label: "Purchase Orders",
      value: number(other.length),
      icon: ShoppingBag
    }
  ] : slug === "marketing" ? [
    {
      label: "Campaigns",
      value: number(rows.length),
      icon: Package
    },
    {
      label: "Active",
      value: number(count("Active")),
      icon: TrendingUp
    },
    {
      label: "Budget",
      value: currency(sum("budget")),
      icon: TrendingUp
    },
    { label: "Leads", value: number(other.length), icon: Users }
  ] : slug === "logistics" ? [
    {
      label: "Shipments",
      value: number(rows.length),
      icon: Package
    },
    {
      label: "Delivered",
      value: number(count("Delivered")),
      icon: ShoppingBag
    },
    {
      label: "In transit",
      value: number(count("In transit", "Out for delivery")),
      icon: Package
    },
    {
      label: "Failed",
      value: number(count("Failed", "Returned")),
      icon: Package
    }
  ] : slug === "support" ? [
    {
      label: "Open",
      value: number(count("Open")),
      icon: Package
    },
    {
      label: "Pending",
      value: number(count("Pending")),
      icon: Package
    },
    {
      label: "High priority",
      value: number(
        rows.filter(
          (row) => ["High", "Urgent"].includes(String(row.priority))
        ).length
      ),
      icon: Package
    },
    {
      label: "Agents",
      value: number(other.length),
      icon: Users
    }
  ] : [
    {
      label: "Vendors",
      value: number(rows.length),
      icon: Users
    },
    {
      label: "Active",
      value: number(count("Active")),
      icon: Package
    },
    {
      label: "Value",
      value: currency(sum("amount")),
      icon: TrendingUp
    },
    {
      label: "Settlements",
      value: number(other.length),
      icon: ShoppingBag
    }
  ];
  const trend = groupData(rows, "createdAt", config.amount).sort((a, b) => a.name.localeCompare(b.name)).map((point) => ({ ...point, name: date(point.name) }));
  const distribution = groupData(rows, config.group).map((point) => ({
    ...point,
    name: t(point.name)
  }));
  return createElement(Fragment, null, createElement(
    PageHeader,
    {
      title: t(config.title) + " \xB7 " + t("Overview"),
      description: t(
        "Live summaries of your persistent synthetic demo records."
      ),
      actions: createElement(
        "select",
        {
          "aria-label": t("Status"),
          className: "field !w-auto",
          value: status,
          onChange: (event) => setStatus(event.target.value)
        },
        createElement("option", { value: "" }, t("All")),
        definition.statuses.map((item) => createElement("option", { key: item, value: item }, t(item)))
      )
    }
  ), createElement("div", { className: "mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4" }, metrics.map((metric) => createElement(
    StatCard,
    {
      key: metric.label,
      label: t(metric.label),
      value: metric.value,
      hint: t("Synthetic data only"),
      icon: createElement(metric.icon, { size: 20 })
    }
  ))), error && createElement(ErrorState, { message: error, retry: reload }), createElement("div", { className: "mb-5 grid gap-5 xl:grid-cols-[2fr_1fr]" }, createElement(Card, null, createElement(
    CardHeader,
    {
      title: t(config.trend),
      subtitle: t("Calculated from the displayed records")
    }
  ), createElement("div", { className: "p-4" }, loading ? createElement(TableSkeleton, null) : !rows.length ? createElement(DataEmptyState, null) : createElement(
    TrendAreaChart,
    {
      data: trend,
      names: [t(config.trend)],
      height: 280
    }
  ))), createElement(Card, null, createElement(CardHeader, { title: t(config.distribution) }), createElement("div", { className: "p-4" }, !rows.length ? createElement(DataEmptyState, null) : createElement(DonutChart, { data: distribution, height: 240 })))), createElement("div", { className: "grid gap-5 xl:grid-cols-[2fr_1fr]" }, createElement(Card, null, createElement(
    CardHeader,
    {
      title: t(definition.title),
      action: createElement(Link, { className: "text-xs text-brand", href: "/" + definition.path }, t("View"), " \u2192")
    }
  ), createElement("div", { className: "overflow-x-auto" }, createElement("table", { className: "table-ui" }, createElement("thead", null, createElement("tr", null, createElement("th", null, t("Name")), createElement("th", null, t("Status")), createElement("th", null, t("Date")))), createElement("tbody", null, rows.slice(0, 6).map((row) => createElement("tr", { key: row.id }, createElement("td", null, createElement(
    Link,
    {
      className: "text-brand",
      href: `/${definition.path}/${row.id}`
    },
    row.name
  )), createElement("td", null, createElement(Badge, null, t(row.status))), createElement("td", null, date(row.createdAt)))))), !rows.length && createElement(DataEmptyState, null))), createElement(Card, null, createElement(
    CardHeader,
    {
      title: t(secondary.title),
      action: createElement(Link, { href: "/" + secondary.path, className: "text-xs text-brand" }, t("View"), " \u2192")
    }
  ), createElement("div", { className: "p-4" }, other.length > 0 ? createElement(
    CompactBarChart,
    {
      data: groupData(other, "status").map((point) => ({
        ...point,
        name: t(point.name)
      })),
      height: 230
    }
  ) : createElement(DataEmptyState, null)))));
}
