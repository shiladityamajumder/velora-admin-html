import { createElement, Fragment } from '../runtime/dom.js';
import { PosApp } from "./apps/pos-app.js";
import { ChatApp } from "./apps/chat-app.js";
import { EmailApp } from "./apps/email-app.js";
import { TodoApp } from "./apps/todo-app.js";
import { CalendarApp } from "./apps/calendar-app.js";
import { ProductsApp } from "./apps/products-app.js";
import { InvoicesApp } from "./apps/invoices-app.js";
export function AppsPage({ slug }) {
  switch (slug) {
    case "pos":
      return createElement(PosApp, null);
    case "chat":
      return createElement(ChatApp, null);
    case "email":
      return createElement(EmailApp, null);
    case "todo":
      return createElement(TodoApp, null);
    case "calendar":
      return createElement(CalendarApp, null);
    case "products":
      return createElement(ProductsApp, null);
    case "invoices":
      return createElement(InvoicesApp, null);
    default:
      return null;
  }
}
