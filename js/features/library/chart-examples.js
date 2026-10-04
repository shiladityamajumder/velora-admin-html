import { createElement, Fragment } from '../../runtime/dom.js';
import { useState } from "../../runtime/dom.js";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  ZAxis
} from "../../vendor/charts.js";
import {
  TrendAreaChart,
  CompactBarChart,
  DonutChart
} from "../../components/charts.js";
import { Card, Button } from "../../components/primitives.js";
import { useI18n } from "../../i18n/provider.js";
import { ExampleFrame } from "./example-frame.js";
const trend = Array.from({ length: 12 }, (_, index) => ({
  name: String(index + 1).padStart(2, "0"),
  value: [32, 48, 41, 67, 59, 84, 76, 93, 72, 105, 98, 124][index],
  secondary: 25 + index * 5,
  tertiary: 10 + index % 4 * 6
}));
const radar = [
  "Quality",
  "Speed",
  "Coverage",
  "Reliability",
  "Satisfaction",
  "Capacity"
].map((name, index) => ({
  name,
  value: [85, 72, 64, 91, 78, 68][index],
  secondary: [65, 86, 79, 72, 90, 81][index]
}));
const scatter = Array.from({ length: 18 }, (_, index) => ({
  x: 5 + index * 3,
  y: 12 + index * 4 + index % 3 * 9,
  z: 20 + index * 2
}));
const tooltipStyle = {
  background: "var(--panel)",
  border: "1px solid var(--line)",
  borderRadius: 6,
  color: "var(--text)"
};
export function ChartExamples({ variant }) {
  const { t } = useI18n();
  const [range, setRange] = useState(12);
  const [comparison, setComparison] = useState(true);
  const data = trend.slice(-range);
  const distribution = [
    { name: t("Direct"), value: 42 },
    { name: t("Organic"), value: 28 },
    { name: t("Referral"), value: 18 },
    { name: t("Paid"), value: 12 }
  ];
  return createElement(
    ExampleFrame,
    {
      category: "charts",
      variant,
      source: `import { ChartExamples } from "./chart-examples.js";

<ChartExamples variant="${variant}" />
// Feed your own typed series into the shared chart primitives.`
    },
    createElement(Card, null, createElement("div", { className: "flex flex-wrap items-center justify-between gap-3 border-b border-ui p-4" }, createElement("span", { className: "text-xs text-muted" }, t("Synthetic data only")), createElement("div", { className: "flex flex-wrap gap-2" }, !["radar", "donut"].includes(variant) && [6, 12].map((value) => createElement(
      Button,
      {
        key: value,
        variant: range === value ? "primary" : "secondary",
        "aria-pressed": range === value,
        onClick: () => setRange(value)
      },
      value,
      " ",
      t("Periods")
    )), variant !== "bar" && createElement(
      Button,
      {
        variant: "secondary",
        "aria-pressed": comparison,
        onClick: () => setComparison((value) => !value)
      },
      t("Comparison")
    ))), createElement(
      "div",
      {
        className: "min-w-0 p-4 sm:p-6",
        role: "figure",
        "aria-label": t("Chart Examples")
      },
      variant === "area" && createElement(
        TrendAreaChart,
        {
          data,
          secondaryKey: comparison ? "secondary" : void 0,
          height: 350
        }
      ),
      ["bar", "stacked"].includes(variant) && createElement(
        CompactBarChart,
        {
          data,
          secondaryKey: variant === "stacked" && comparison ? "secondary" : void 0,
          tertiaryKey: variant === "stacked" ? "tertiary" : void 0,
          height: 350
        }
      ),
      variant === "donut" && createElement(
        DonutChart,
        {
          data: distribution.slice(0, comparison ? 4 : 3),
          height: 350
        }
      ),
      variant === "line" && createElement(ResponsiveContainer, { width: "100%", height: 350 }, createElement(LineChart, { data }, createElement(CartesianGrid, { stroke: "var(--line)", strokeDasharray: "3 4" }), createElement(XAxis, { dataKey: "name", stroke: "var(--muted)" }), createElement(YAxis, { stroke: "var(--muted)" }), createElement(Tooltip, { contentStyle: tooltipStyle }), createElement(Legend, null), createElement(
        Line,
        {
          dataKey: "value",
          name: t("Current"),
          stroke: "var(--chart-1)",
          strokeWidth: 2
        }
      ), comparison && createElement(
        Line,
        {
          dataKey: "secondary",
          name: t("Comparison"),
          stroke: "var(--chart-2)",
          strokeWidth: 2
        }
      ))),
      variant === "radar" && createElement(ResponsiveContainer, { width: "100%", height: 350 }, createElement(
        RadarChart,
        {
          data: radar.map((row) => ({ ...row, name: t(row.name) }))
        },
        createElement(PolarGrid, { stroke: "var(--line)" }),
        createElement(
          PolarAngleAxis,
          {
            dataKey: "name",
            tick: { fill: "var(--muted)", fontSize: 11 }
          }
        ),
        createElement(
          PolarRadiusAxis,
          {
            angle: 30,
            domain: [0, 100],
            tick: { fill: "var(--muted)" }
          }
        ),
        createElement(
          Radar,
          {
            dataKey: "value",
            name: t("Current"),
            stroke: "var(--chart-1)",
            fill: "var(--chart-1)",
            fillOpacity: 0.25
          }
        ),
        comparison && createElement(
          Radar,
          {
            dataKey: "secondary",
            name: t("Comparison"),
            stroke: "var(--chart-2)",
            fill: "var(--chart-2)",
            fillOpacity: 0.15
          }
        ),
        createElement(Tooltip, { contentStyle: tooltipStyle }),
        createElement(Legend, null)
      )),
      variant === "scatter" && createElement(ResponsiveContainer, { width: "100%", height: 350 }, createElement(ScatterChart, null, createElement(CartesianGrid, { stroke: "var(--line)" }), createElement(
        XAxis,
        {
          type: "number",
          dataKey: "x",
          name: t("Effort"),
          stroke: "var(--muted)"
        }
      ), createElement(
        YAxis,
        {
          type: "number",
          dataKey: "y",
          name: t("Output"),
          stroke: "var(--muted)"
        }
      ), createElement(ZAxis, { type: "number", dataKey: "z", range: [40, 180] }), createElement(Tooltip, { contentStyle: tooltipStyle }), createElement(
        Scatter,
        {
          data: scatter.slice(-range),
          name: t("Sample"),
          fill: "var(--chart-1)"
        }
      ), comparison && createElement(
        Scatter,
        {
          data: scatter.slice(-range).map((row) => ({ ...row, y: row.y * 0.8 })),
          name: t("Comparison"),
          fill: "var(--chart-2)"
        }
      )))
    ))
  );
}
