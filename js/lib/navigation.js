import {
  CalendarDays,
  ChartNoAxesCombined,
  CircleDollarSign,
  Component,
  CreditCard,
  FolderKanban,
  FormInput,
  LayoutDashboard,
  Mail,
  MessageSquareText,
  PackageSearch,
  PanelsTopLeft,
  ReceiptText,
  ShoppingBag,
  Table2,
  UtensilsCrossed,
  UsersRound,
  ListTodo,
  LogIn,
  UserRound,
  ShieldCheck,
  CircleAlert,
  KeyRound
} from "../vendor/icons.js";
export const navGroups = [
  {
    label: "Dashboards",
    items: [
      {
        label: "Analytics",
        href: "/dashboard/analytics",
        icon: LayoutDashboard
      },
      { label: "E-Commerce", href: "/dashboard/ecommerce", icon: ShoppingBag },
      { label: "CRM", href: "/dashboard/crm", icon: UsersRound },
      { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
      { label: "Finance", href: "/dashboard/finance", icon: CircleDollarSign },
      {
        label: "Restaurant",
        href: "/dashboard/restaurant",
        icon: UtensilsCrossed
      }
    ]
  },
  {
    label: "Apps",
    items: [
      { label: "POS", href: "/apps/pos", icon: CreditCard },
      {
        label: "Chat",
        href: "/apps/chat",
        icon: MessageSquareText,
        badge: "4"
      },
      { label: "Email", href: "/apps/email", icon: Mail, badge: "9" },
      { label: "Task Manager", href: "/apps/todo", icon: ListTodo },
      { label: "Calendar", href: "/apps/calendar", icon: CalendarDays },
      { label: "Products", href: "/apps/products", icon: PackageSearch },
      { label: "Invoices", href: "/apps/invoices", icon: ReceiptText }
    ]
  },
  {
    label: "Interface",
    items: [
      { label: "UI Components", href: "/components", icon: Component },
      { label: "Forms", href: "/forms", icon: FormInput },
      { label: "Tables", href: "/tables", icon: Table2 },
      { label: "Charts", href: "/charts", icon: ChartNoAxesCombined },
      { label: "Layouts", href: "/layouts", icon: PanelsTopLeft }
    ]
  },
  {
    label: "Account",
    items: [
      { label: "My Profile", href: "/profile", icon: UserRound },
      { label: "Login", href: "/auth/login", icon: LogIn },
      { label: "Register", href: "/auth/register", icon: ShieldCheck },
      {
        label: "Forgot Password",
        href: "/auth/forgot-password",
        icon: KeyRound
      },
      { label: "Split Login", href: "/auth/split-login", icon: LogIn }
    ]
  },
  {
    label: "Pages",
    items: [
      { label: "Error 404", href: "/error-pages/404", icon: CircleAlert },
      { label: "Error 500", href: "/error-pages/500", icon: CircleAlert },
      {
        label: "Under Construction",
        href: "/error-pages/under-construction",
        icon: PanelsTopLeft
      },
      {
        label: "Coming Soon",
        href: "/error-pages/coming-soon",
        icon: CalendarDays
      }
    ]
  }
];
export const dashboardTitles = {
  analytics: "Analytics",
  ecommerce: "E-Commerce",
  crm: "CRM",
  projects: "Projects",
  finance: "Finance",
  restaurant: "POS & Restaurant"
};
