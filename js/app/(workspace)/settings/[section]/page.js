import { createElement, Fragment } from '../../../../runtime/dom.js';
import { notFound } from "../../../../runtime/navigation.js";
import { SettingsPage } from "../../../../features/enterprise/settings-page.js";
const sections = new Set([
  "general",
  "company",
  "branding",
  "localization",
  "currency",
  "taxes",
  "shipping",
  "notifications",
  "email",
  "sms",
  "payment",
  "security",
  "authentication",
  "roles",
  "appearance",
  "integrations",
  "features",
  "demo"
]);
export default function Page({
  params
}) {
  const { section } = params;
  if (!sections.has(section)) notFound();
  return createElement(SettingsPage, { key: section, section });
}
