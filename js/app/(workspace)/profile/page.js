import { createElement, Fragment } from '../../../runtime/dom.js';
import { appConfig } from "../../../config/app.js";
import { Link as Link } from "../../../runtime/navigation.js";
import {
  BriefcaseBusiness,
  CalendarDays,
  Mail,
  MapPin,
  ShieldCheck
} from "../../../vendor/icons.js";
import {
  Badge,
  Card,
  CardHeader,
  PageHeader,
  Progress
} from "../../../components/primitives.js";
import { usePersistentState } from "../../../lib/client-store.js";
import { initialProfile } from "../../../lib/records.js";
export default function ProfilePage() {
  const [profile] = usePersistentState("profile", initialProfile);
  return createElement(Fragment, null, createElement(
    PageHeader,
    {
      title: "Profile",
      description: "Your workspace identity and preferences.",
      actions: createElement(
        Link,
        {
          href: "/forms",
          className: "rounded-md bg-brand px-3 py-2 text-xs font-medium text-white"
        },
        "Edit profile"
      )
    }
  ), createElement("div", { className: "grid gap-6 xl:grid-cols-[340px_1fr]" }, createElement(Card, { className: "p-6 text-center" }, createElement("div", { className: "mx-auto grid size-24 place-items-center rounded-2xl bg-brand/10 text-2xl font-semibold text-brand" }, profile.firstName[0], profile.lastName[0]), createElement("h2", { className: "mt-4 text-xl font-semibold" }, profile.firstName, " ", profile.lastName), createElement("p", { className: "mt-1 text-xs text-muted" }, "Workspace ", profile.role), createElement("div", { className: "mt-4 flex justify-center gap-2" }, createElement(Badge, { tone: "success" }, "Active"), createElement(Badge, { tone: "brand" }, "Workspace")), createElement("div", { className: "mt-6 space-y-4 border-t border-ui pt-5 text-start text-xs" }, createElement("p", { className: "flex items-center gap-3 break-all" }, createElement(Mail, { size: 16, className: "shrink-0 text-muted" }), profile.email), createElement("p", { className: "flex items-center gap-3" }, createElement(MapPin, { size: 16, className: "shrink-0 text-muted" }), profile.location), createElement("p", { className: "flex items-center gap-3" }, createElement(BriefcaseBusiness, { size: 16, className: "text-muted" }), appConfig.name, " Workspace"), createElement("p", { className: "flex items-center gap-3" }, createElement(CalendarDays, { size: 16, className: "text-muted" }), profile.timezone))), createElement("div", { className: "space-y-6" }, createElement(Card, { className: "p-5" }, createElement("div", { className: "flex items-center gap-3" }, createElement("span", { className: "grid size-10 place-items-center rounded-md bg-success/10 text-success" }, createElement(ShieldCheck, { size: 21 })), createElement("div", null, createElement("h3", { className: "font-semibold" }, "Security preferences"), createElement("p", { className: "mt-1 text-xs text-muted" }, "Two-factor verification preference is", " ", profile.twoFactor ? "enabled" : "disabled", ".")), createElement(Link, { href: "/forms", className: "ms-auto text-xs text-brand" }, "Manage")), createElement("div", { className: "mt-5" }, createElement("div", { className: "mb-2 flex justify-between text-xs" }, createElement("span", { className: "text-muted" }, "Profile completeness"), createElement("span", null, profile.bio && profile.location ? "100%" : "80%")), createElement(Progress, { value: profile.bio && profile.location ? 100 : 80 }))), createElement(Card, null, createElement(CardHeader, { title: "About", subtitle: "Workspace profile" }), createElement("div", { className: "p-5 text-sm leading-6 text-muted" }, profile.bio || "Add a bio to introduce yourself to your team.")))));
}
