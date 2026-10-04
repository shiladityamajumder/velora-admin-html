import { createElement, Fragment } from '../../runtime/dom.js';
import { AppShell } from "../../components/app-shell.js";
export default function WorkspaceLayout({
  children
}) {
  return createElement(AppShell, null, children);
}
