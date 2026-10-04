import { createElement, Fragment } from '../runtime/dom.js';
import { useId, useState } from "../runtime/dom.js";
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "../vendor/charts.js";
import { useI18n } from "../i18n/provider.js";
function chartColors() {
  return {
    muted: "var(--muted)",
    grid: "var(--line)",
    brand: "var(--chart-1)",
    panel: "var(--panel)"
  };
}
function ChartTooltip({
  active,
  payload,
  label
}) {
  const { number } = useI18n();
  if (!active || !payload?.length) return null;
  return createElement("div", { className: "surface rounded-md px-3 py-2 shadow-lg" }, createElement("p", { className: "mb-1 text-xs font-semibold" }, label), payload.map((point, index) => createElement("div", { key: index, className: "flex items-center gap-3 py-0.5 text-xs" }, createElement(
    "span",
    {
      className: "size-2 rounded-full",
      style: { background: point.color }
    }
  ), createElement("span", { className: "text-muted" }, point.name), createElement("span", { className: "ms-auto font-medium" }, typeof point.value === "number" ? number(point.value) : String(point.value)))));
}
export function TrendAreaChart({
  data,
  dataKey = "value",
  secondaryKey,
  tertiaryKey,
  height = 300,
  names = ["Revenue", "Comparison", "Capacity"],
  unit = ""
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const colors = chartColors();
  return createElement("div", { className: "w-full min-w-0", style: { height } }, createElement(ResponsiveContainer, { width: "100%", height: "100%", minWidth: 0 }, createElement(
    ComposedChart,
    {
      data,
      margin: { left: 0, right: 12, top: 18, bottom: 0 }
    },
    createElement("defs", null, createElement("linearGradient", { id: `${id}-area`, x1: "0", y1: "0", x2: "0", y2: "1" }, createElement("stop", { offset: "0%", stopColor: colors.brand, stopOpacity: 0.24 }), createElement("stop", { offset: "100%", stopColor: colors.brand, stopOpacity: 0.03 }))),
    createElement(
      CartesianGrid,
      {
        stroke: colors.grid,
        vertical: false,
        strokeDasharray: "3 4"
      }
    ),
    createElement(
      XAxis,
      {
        dataKey: "name",
        tick: { fill: colors.muted, fontSize: 10 },
        tickLine: false,
        axisLine: false,
        minTickGap: 12,
        dy: 6
      }
    ),
    createElement(
      YAxis,
      {
        width: 42,
        tick: { fill: colors.muted, fontSize: 10 },
        tickLine: false,
        axisLine: false,
        tickFormatter: (value) => `${value}${unit}`
      }
    ),
    createElement(Tooltip, { content: createElement(ChartTooltip, null) }),
    createElement(
      Area,
      {
        isAnimationActive: false,
        type: "monotone",
        dataKey,
        name: names[0],
        stroke: colors.brand,
        strokeWidth: 2.3,
        fill: `url(#${id}-area)`,
        activeDot: { r: 4 }
      }
    ),
    secondaryKey ? createElement(
      Line,
      {
        isAnimationActive: false,
        type: "monotone",
        dataKey: secondaryKey,
        name: names[1],
        stroke: "var(--chart-2)",
        strokeWidth: 2,
        dot: { r: 3, stroke: colors.panel, strokeWidth: 1.5 }
      }
    ) : null,
    tertiaryKey ? createElement(
      Line,
      {
        isAnimationActive: false,
        type: "monotone",
        dataKey: tertiaryKey,
        name: names[2],
        stroke: "var(--chart-4)",
        strokeWidth: 2,
        dot: false,
        strokeDasharray: "5 5"
      }
    ) : null
  )));
}
export function InferenceChart({ data }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const colors = chartColors();
  const [hidden, setHidden] = useState([]);
  const legend = [
    { key: "successful", name: "Successful Requests", color: "var(--chart-2)" },
    { key: "cached", name: "Cached Requests", color: "var(--success)" },
    { key: "capacity", name: "Target Capacity", color: "var(--chart-4)" }
  ];
  return createElement("div", null, createElement("div", { className: "h-[330px] min-w-0" }, createElement(ResponsiveContainer, { width: "100%", height: "100%", minWidth: 0 }, createElement(
    ComposedChart,
    {
      data,
      margin: { top: 20, right: 10, left: 0, bottom: 6 }
    },
    createElement("defs", null, legend.slice(0, 2).map((item) => createElement(
      "pattern",
      {
        key: item.key,
        id: `${id}-${item.key}`,
        width: "5",
        height: "5",
        patternUnits: "userSpaceOnUse",
        patternTransform: "rotate(45)"
      },
      createElement(
        "rect",
        {
          width: "5",
          height: "5",
          fill: item.color,
          fillOpacity: 0.04
        }
      ),
      createElement(
        "line",
        {
          x1: "0",
          y1: "0",
          x2: "0",
          y2: "5",
          stroke: item.color,
          strokeWidth: "2"
        }
      )
    ))),
    createElement(
      CartesianGrid,
      {
        stroke: colors.grid,
        strokeDasharray: "3 4",
        vertical: false
      }
    ),
    createElement(
      XAxis,
      {
        dataKey: "name",
        axisLine: false,
        tickLine: false,
        tick: { fill: colors.muted, fontSize: 10 },
        dy: 6
      }
    ),
    createElement(
      YAxis,
      {
        width: 42,
        axisLine: false,
        tickLine: false,
        tick: { fill: colors.muted, fontSize: 10 },
        domain: [0, (dataMax) => Math.ceil(dataMax / 50) * 50 + 50],
        tickCount: 7
      }
    ),
    createElement(
      Tooltip,
      {
        content: createElement(ChartTooltip, null),
        cursor: { fill: colors.grid, fillOpacity: 0.3 }
      }
    ),
    createElement(
      Bar,
      {
        hide: hidden.includes("successful"),
        isAnimationActive: false,
        dataKey: "successful",
        name: "Successful Requests",
        stackId: "load",
        maxBarSize: 16,
        fill: `url(#${id}-successful)`,
        stroke: "var(--chart-2)",
        strokeWidth: 1
      }
    ),
    createElement(
      Bar,
      {
        hide: hidden.includes("cached"),
        isAnimationActive: false,
        dataKey: "cached",
        name: "Cached Requests",
        stackId: "load",
        maxBarSize: 16,
        fill: `url(#${id}-cached)`,
        stroke: "var(--success)",
        strokeWidth: 1
      }
    ),
    createElement(
      Line,
      {
        hide: hidden.includes("capacity"),
        isAnimationActive: false,
        type: "monotone",
        dataKey: "capacity",
        name: "Target Capacity",
        stroke: "var(--chart-4)",
        strokeWidth: 2.5,
        dot: false
      }
    )
  ))), createElement("div", { className: "mt-4 flex flex-wrap gap-x-4 gap-y-2" }, legend.map((item) => createElement(
    "button",
    {
      key: item.key,
      "aria-pressed": !hidden.includes(item.key),
      onClick: () => setHidden(
        (values) => values.includes(item.key) ? values.filter((value) => value !== item.key) : [...values, item.key]
      ),
      className: `flex items-center gap-1.5 text-[11px] text-muted ${hidden.includes(item.key) ? "opacity-40" : ""}`
    },
    createElement(
      "span",
      {
        className: item.key === "capacity" ? "h-0.5 w-3 rounded" : "size-2 rounded-full",
        style: { background: item.color }
      }
    ),
    item.name
  ))));
}
export function CompactBarChart({
  data,
  dataKey = "value",
  secondaryKey,
  tertiaryKey,
  height = 280,
  names = ["Completed", "Expenses", "Profit"],
  unit = ""
}) {
  const colors = chartColors();
  return createElement("div", { className: "min-w-0", style: { height } }, createElement(ResponsiveContainer, { width: "100%", height: "100%", minWidth: 0 }, createElement(ComposedChart, { data, margin: { left: 0, right: 10, top: 14 } }, createElement(
    CartesianGrid,
    {
      stroke: colors.grid,
      vertical: false,
      strokeDasharray: "3 4"
    }
  ), createElement(
    XAxis,
    {
      dataKey: "name",
      tick: { fill: colors.muted, fontSize: 10 },
      tickLine: false,
      axisLine: false
    }
  ), createElement(
    YAxis,
    {
      width: 38,
      tick: { fill: colors.muted, fontSize: 10 },
      tickLine: false,
      axisLine: false,
      tickFormatter: (value) => `${value}${unit}`
    }
  ), createElement(
    Tooltip,
    {
      content: createElement(ChartTooltip, null),
      cursor: { fill: colors.grid, fillOpacity: 0.3 }
    }
  ), createElement(
    Bar,
    {
      isAnimationActive: false,
      dataKey,
      name: names[0],
      fill: "var(--success)",
      stackId: secondaryKey ? "total" : void 0,
      radius: secondaryKey ? 0 : [3, 3, 0, 0],
      maxBarSize: 24
    }
  ), secondaryKey ? createElement(
    Bar,
    {
      isAnimationActive: false,
      dataKey: secondaryKey,
      name: names[1],
      fill: "var(--chart-3)",
      stackId: "total",
      maxBarSize: 24
    }
  ) : null, tertiaryKey ? createElement(
    Bar,
    {
      isAnimationActive: false,
      dataKey: tertiaryKey,
      name: names[2],
      fill: "var(--chart-2)",
      stackId: "total",
      radius: [3, 3, 0, 0],
      maxBarSize: 24
    }
  ) : null)));
}
export function MiniLineChart(props) {
  return createElement(TrendAreaChart, { ...props });
}
const pieColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--muted)",
  "var(--success)",
  "var(--chart-3)"
];
export function DonutChart({
  data,
  totalLabel,
  centerLabel = "Total",
  height = 230,
  percentages = false,
  colors = pieColors
}) {
  const colorsTheme = chartColors();
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return createElement("div", null, createElement("div", { className: "relative mx-auto max-w-[280px]", style: { height } }, createElement(ResponsiveContainer, { width: "100%", height: "100%", minWidth: 0 }, createElement(PieChart, null, createElement(
    Pie,
    {
      isAnimationActive: false,
      data,
      dataKey: "value",
      nameKey: "name",
      innerRadius: "66%",
      outerRadius: "82%",
      paddingAngle: 0,
      stroke: colorsTheme.panel,
      strokeWidth: 2
    },
    data.map((entry, index) => createElement(Cell, { key: entry.name, fill: colors[index % colors.length] }))
  ), createElement(Tooltip, { content: createElement(ChartTooltip, null) }))), createElement("div", { className: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center" }, createElement("span", { className: "text-xl font-semibold" }, totalLabel ?? total.toLocaleString()), createElement("span", { className: "mt-0.5 text-[9px] uppercase tracking-wider text-muted" }, centerLabel))), createElement("div", { className: "mt-2 flex flex-wrap justify-center gap-2" }, data.map((item, index) => createElement(
    "span",
    {
      key: item.name,
      className: "flex items-center gap-2 rounded border border-ui px-2 py-1 text-[10px] text-muted"
    },
    createElement(
      "span",
      {
        className: "size-2 rounded-sm",
        style: { background: colors[index % colors.length] }
      }
    ),
    item.name
  ))), percentages ? createElement("div", { className: "mt-5 space-y-3" }, data.map((item, index) => createElement("div", { key: item.name }, createElement("div", { className: "mb-1 flex justify-between text-[11px]" }, createElement("span", null, item.name), createElement("span", { className: "font-semibold" }, Math.round(item.value / total * 100), "%")), createElement(
    "div",
    {
      className: "h-1 rounded-full",
      style: { background: `${colors[index % colors.length]}20` }
    },
    createElement(
      "div",
      {
        className: "h-full rounded-full",
        style: {
          width: `${item.value / total * 100}%`,
          background: colors[index % colors.length]
        }
      }
    )
  )))) : null);
}
export function MiniRing({
  value,
  color = "var(--success)"
}) {
  return createElement(
    "svg",
    {
      viewBox: "0 0 64 64",
      className: "size-16 shrink-0 -rotate-90",
      "aria-hidden": "true"
    },
    createElement(
      "circle",
      {
        cx: "32",
        cy: "32",
        r: "25",
        fill: "none",
        stroke: color,
        opacity: "0.15",
        strokeWidth: "6"
      }
    ),
    createElement(
      "circle",
      {
        cx: "32",
        cy: "32",
        r: "25",
        fill: "none",
        stroke: color,
        strokeWidth: "6",
        strokeDasharray: `${value / 100 * 157} 157`
      }
    )
  );
}
export function SparkBars({
  color = "var(--chart-1)",
  values = [28, 35, 26, 42, 60],
  compact = false
}) {
  return createElement(
    "div",
    {
      className: `flex h-16 shrink-0 items-end justify-between ${compact ? "w-16 gap-1" : "w-24 gap-2"}`,
      "aria-hidden": "true"
    },
    values.map((value, index) => createElement(
      "span",
      {
        key: index,
        className: "w-3 rounded-t-sm",
        style: {
          height: `${value}%`,
          background: color,
          opacity: index === values.length - 2 ? 1 : 0.3
        }
      }
    ))
  );
}
export function GoalGauge({ value }) {
  return createElement("div", { className: "relative mx-auto h-44 max-w-[280px]" }, createElement(
    "svg",
    {
      viewBox: "0 0 240 140",
      className: "w-full",
      "aria-label": `Goal ${value}% completed`,
      role: "img"
    },
    createElement("defs", null, createElement("linearGradient", { id: "goal-gradient" }, createElement("stop", { offset: "0%", stopColor: "var(--chart-2)" }), createElement("stop", { offset: "100%", stopColor: "var(--chart-1)" }))),
    createElement(
      "path",
      {
        d: "M 25 115 A 95 95 0 0 1 215 115",
        fill: "none",
        stroke: "var(--line)",
        strokeWidth: "17",
        strokeLinecap: "round"
      }
    ),
    createElement(
      "path",
      {
        d: "M 25 115 A 95 95 0 0 1 215 115",
        fill: "none",
        stroke: "url(#goal-gradient)",
        strokeWidth: "17",
        strokeLinecap: "round",
        pathLength: "100",
        strokeDasharray: `${value} 100`
      }
    )
  ), createElement("span", { className: "absolute bottom-5 inset-x-0 text-center text-3xl font-medium" }, value, "%"));
}
