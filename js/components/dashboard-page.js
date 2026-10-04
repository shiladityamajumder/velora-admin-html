import { createElement, Fragment } from '../runtime/dom.js';
import { dynamic as dynamic } from "../runtime/navigation.js";
import { LoadingState } from "./data/states.js";
const AnalyticsDashboard = dynamic(
  () => import("./dashboards/analytics.js").then((value) => value.AnalyticsDashboard),
  { loading: () => createElement(LoadingState, null) }
);
const EcommerceDashboard = dynamic(
  () => import("./dashboards/ecommerce.js").then((value) => value.EcommerceDashboard),
  { loading: () => createElement(LoadingState, null) }
);
const CrmDashboard = dynamic(
  () => import("./dashboards/crm.js").then((value) => value.CrmDashboard),
  { loading: () => createElement(LoadingState, null) }
);
const ProjectsDashboard = dynamic(
  () => import("./dashboards/projects.js").then((value) => value.ProjectsDashboard),
  { loading: () => createElement(LoadingState, null) }
);
const FinanceDashboard = dynamic(
  () => import("./dashboards/finance.js").then((value) => value.FinanceDashboard),
  { loading: () => createElement(LoadingState, null) }
);
const RestaurantDashboard = dynamic(
  () => import("./dashboards/restaurant.js").then(
    (value) => value.RestaurantDashboard
  ),
  { loading: () => createElement(LoadingState, null) }
);
export function DashboardPage({ slug }) {
  switch (slug) {
    case "analytics":
      return createElement(AnalyticsDashboard, null);
    case "ecommerce":
      return createElement(EcommerceDashboard, null);
    case "crm":
      return createElement(CrmDashboard, null);
    case "projects":
      return createElement(ProjectsDashboard, null);
    case "finance":
      return createElement(FinanceDashboard, null);
    case "restaurant":
      return createElement(RestaurantDashboard, null);
    default:
      return null;
  }
}
