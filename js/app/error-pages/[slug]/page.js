import { createElement, Fragment } from '../../../runtime/dom.js';
import { appConfig } from "../../../config/app.js";
import { Link as Link } from "../../../runtime/navigation.js";
import {
  ArrowLeft,
  Construction,
  ServerCrash,
  Sparkles,
  TriangleAlert
} from "../../../vendor/icons.js";
export default function ErrorPage({
  params
}) {
  const { slug } = params;
  const map = {
    "404": {
      code: "404",
      title: "Page not found",
      text: "The page you\u2019re looking for doesn\u2019t exist or has moved.",
      icon: createElement(TriangleAlert, { size: 30 })
    },
    "500": {
      code: "500",
      title: "Something went wrong",
      text: "The server hit an unexpected condition. Try again in a moment.",
      icon: createElement(ServerCrash, { size: 30 })
    },
    "under-construction": {
      code: "",
      title: "Under construction",
      text: "This workspace module is being prepared for launch.",
      icon: createElement(Construction, { size: 30 })
    },
    "coming-soon": {
      code: "",
      title: "Coming soon",
      text: `A new ${appConfig.name} experience is on the way.`,
      icon: createElement(Sparkles, { size: 30 })
    }
  };
  const data = map[slug] ?? map["404"];
  return createElement("main", { className: "grid min-h-screen place-items-center p-6" }, createElement("div", { className: "max-w-lg text-center" }, createElement("div", { className: "mx-auto grid size-16 place-items-center rounded-2xl bg-brand/10 text-brand" }, data.icon), data.code ? createElement("p", { className: "mt-7 text-7xl font-black tracking-tighter text-brand" }, data.code) : null, createElement("h1", { className: "mt-4 text-3xl font-black tracking-tight" }, data.title), createElement("p", { className: "mx-auto mt-3 max-w-md text-sm leading-6 text-muted" }, data.text), createElement(
    Link,
    {
      href: "/dashboard/analytics",
      className: "mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--brand)] px-5 text-sm font-semibold text-white"
    },
    createElement(ArrowLeft, { size: 16 }),
    "Back to dashboard"
  )));
}
