import { createElement, Fragment } from '../../../runtime/dom.js';
import { Card, CardHeader, PageHeader } from "../../../components/primitives.js";
import {
  CompactBarChart,
  DonutChart,
  MiniLineChart,
  TrendAreaChart
} from "../../../components/charts.js";
import { monthTrend, weekBars } from "../../../lib/mock-data.js";
export default function ChartsPage() {
  return createElement(Fragment, null, createElement(
    PageHeader,
    {
      title: "Charts",
      description: "Responsive chart primitives for dashboard reporting. Built with Recharts and CSS-variable driven theming."
    }
  ), createElement("div", { className: "grid gap-4 xl:grid-cols-2" }, createElement(Card, null, createElement(
    CardHeader,
    {
      title: "Area Chart",
      subtitle: "Revenue and comparison series"
    }
  ), createElement("div", { className: "p-4" }, createElement(
    TrendAreaChart,
    {
      data: monthTrend,
      dataKey: "value",
      secondaryKey: "secondary"
    }
  ))), createElement(Card, null, createElement(CardHeader, { title: "Bar Chart", subtitle: "Weekly workload" }), createElement("div", { className: "p-4" }, createElement(CompactBarChart, { data: weekBars }))), createElement(Card, null, createElement(CardHeader, { title: "Line Chart", subtitle: "Performance trend" }), createElement("div", { className: "p-4" }, createElement(MiniLineChart, { data: monthTrend }))), createElement(Card, null, createElement(CardHeader, { title: "Donut Chart", subtitle: "Category distribution" }), createElement("div", { className: "p-5" }, createElement(
    DonutChart,
    {
      data: [
        { name: "Direct", value: 4820 },
        { name: "Organic", value: 3740 },
        { name: "Referral", value: 2180 },
        { name: "Paid", value: 1420 }
      ]
    }
  )))));
}
