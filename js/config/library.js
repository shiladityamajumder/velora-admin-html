import { authFlows, authDesigns, authSlug } from "./auth.js";
export const libraryCategories = [
  {
    slug: "tables",
    title: "Table Examples",
    description: "Reusable table styles and data interactions.",
    examples: [
      {
        slug: "basic",
        title: "Basic Table",
        description: "A clean, responsive table with search and status filtering."
      },
      {
        slug: "striped",
        title: "Striped Table",
        description: "Alternating rows for scanning dense datasets."
      },
      {
        slug: "bordered",
        title: "Bordered Table",
        description: "Cell borders for financial and operational records."
      },
      {
        slug: "compact",
        title: "Compact Table",
        description: "A dense presentation for larger datasets."
      },
      {
        slug: "advanced",
        title: "Advanced Data Table",
        description: "Sorting, filters, selection, pagination, column visibility and CSV."
      },
      {
        slug: "expandable",
        title: "Expandable Table",
        description: "Expand rows to inspect their full record without leaving the list."
      }
    ]
  },
  {
    slug: "charts",
    title: "Chart Examples",
    description: "Interactive visualizations with semantic theme colors.",
    examples: [
      {
        slug: "area",
        title: "Area Chart",
        description: "A trend with a filled area and comparison series."
      },
      {
        slug: "line",
        title: "Line Chart",
        description: "Compare multiple time series with clear line traces."
      },
      {
        slug: "bar",
        title: "Bar Chart",
        description: "Compare values across categories."
      },
      {
        slug: "stacked",
        title: "Stacked Bar Chart",
        description: "Show contributions to a total across periods."
      },
      {
        slug: "donut",
        title: "Donut Chart",
        description: "Inspect a distribution and toggle categories."
      },
      {
        slug: "radar",
        title: "Radar Chart",
        description: "Compare profiles across several dimensions."
      },
      {
        slug: "scatter",
        title: "Scatter Chart",
        description: "Explore the relationship between two metrics."
      }
    ]
  },
  {
    slug: "forms",
    title: "Form Examples",
    description: "Accessible inputs, validation and multi-step patterns.",
    examples: [
      {
        slug: "elements",
        title: "Basic Inputs",
        description: "Text, selects, checkboxes and numeric inputs with a saved preview."
      },
      {
        slug: "horizontal",
        title: "Horizontal Form",
        description: "Aligned labels and controls for settings screens."
      },
      {
        slug: "validation",
        title: "Validated Form",
        description: "React Hook Form and Zod field-level feedback."
      },
      {
        slug: "wizard",
        title: "Multi-step Wizard",
        description: "Validate each step before reviewing and saving."
      },
      {
        slug: "upload",
        title: "File Upload",
        description: "Choose or drop files, preview images and download selected files."
      }
    ]
  },
  {
    slug: "calendars",
    title: "Calendar Examples",
    description: "Three views sharing editable local events.",
    examples: [
      {
        slug: "month",
        title: "Month Calendar",
        description: "Monthly event planning with day-by-day previews."
      },
      {
        slug: "week",
        title: "Week Calendar",
        description: "Focus on a week's schedule and create events on any day."
      },
      {
        slug: "agenda",
        title: "Agenda Calendar",
        description: "A chronological event list that works well on mobile."
      }
    ]
  },
  {
    slug: "authentication",
    title: "Authentication Examples",
    description: "Open complete, functional account screen layouts.",
    examples: [
      {
        slug: "gallery",
        title: "Authentication Gallery",
        description: "Browse all account screen layouts."
      },
      ...authDesigns.flatMap(
        (design) => authFlows.map((flow) => ({
          slug: authSlug(flow.mode, design.id),
          title: `${design.title} ${flow.title}`,
          description: flow.description,
          href: `/auth/${authSlug(flow.mode, design.id)}`
        }))
      )
    ]
  },
  {
    slug: "components",
    title: "UI Elements",
    description: "Common controls, feedback and overlays.",
    examples: [
      {
        slug: "buttons",
        title: "Buttons & Badges",
        description: "Action hierarchy, loading states and status tones."
      },
      {
        slug: "feedback",
        title: "Alerts & Progress",
        description: "Inline alerts, progress controls and global toasts."
      },
      {
        slug: "overlays",
        title: "Dialogs & Drawers",
        description: "Accessible modal, drawer and confirmation patterns."
      }
    ]
  },
  {
    slug: "patterns",
    title: "UI Patterns",
    description: "More reusable navigation, content and selection patterns.",
    examples: [
      {
        slug: "tabs",
        title: "Tabs & Navigation",
        description: "Keyboard-accessible tabs with separate content panels."
      },
      {
        slug: "accordion",
        title: "Accordions & FAQs",
        description: "Expandable answers and grouped disclosure panels."
      },
      {
        slug: "tooltips",
        title: "Tooltips & Help",
        description: "Hover and keyboard hints with dismissible inline help."
      },
      {
        slug: "cards",
        title: "Cards & Pricing",
        description: "Metric widgets, team cards and interactive billing plans."
      },
      {
        slug: "timeline",
        title: "Activity Timeline",
        description: "Filter and add synthetic activity updates."
      },
      {
        slug: "loading",
        title: "Loading & Empty States",
        description: "Preview loading, error, empty and successful states."
      },
      {
        slug: "selections",
        title: "Selection Controls",
        description: "Searchable choices, tags, switches and range inputs."
      },
      {
        slug: "icons",
        title: "Icon Browser",
        description: "Search icons and download a ready-to-use import example."
      },
      {
        slug: "tokens",
        title: "Colors & Typography",
        description: "Inspect your live semantic palette and type styles."
      }
    ]
  }
];
export function exampleHref(category, example) {
  return example.href ?? `/library/${category}/${example.slug}`;
}
