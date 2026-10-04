import { createElement, Fragment } from '../../runtime/dom.js';
import { ExampleFrame } from "./example-frame.js";
import { NavigationPatterns } from "./navigation-patterns.js";
import { ContentPatterns } from "./content-patterns.js";
import { ControlPatterns } from "./control-patterns.js";
export function PatternExamples({ variant }) {
  return createElement(
    ExampleFrame,
    {
      category: "patterns",
      variant,
      source: 'import { Tabs, Accordion, TooltipHint } from "../../components/ui/patterns.js";\nimport { Card, StatCard, Badge } from "../../components/primitives.js";\n// Interactive examples live in features/library/*-patterns.js.'
    },
    ["tabs", "accordion", "tooltips"].includes(variant) ? createElement(NavigationPatterns, { variant }) : ["cards", "timeline", "loading"].includes(variant) ? createElement(ContentPatterns, { variant }) : createElement(ControlPatterns, { variant })
  );
}
