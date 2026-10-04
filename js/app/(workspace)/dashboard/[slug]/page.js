import { createElement, Fragment } from '../../../../runtime/dom.js';
import { EnterpriseDashboard } from "../../../../features/enterprise/dashboard.js";
import { enterpriseDashboards } from "../../../../config/navigation.js";
import { DashboardPage } from "../../../../components/dashboard-page.js";
import { dashboardTitles } from "../../../../lib/navigation.js";
import { notFound } from "../../../../runtime/navigation.js";
export default function Page({
  params
}) {
  const { slug } = params;
  if (enterpriseDashboards.includes(slug))
    return createElement(EnterpriseDashboard, { slug });
  if (!dashboardTitles[slug]) notFound();
  return createElement(DashboardPage, { slug });
}
