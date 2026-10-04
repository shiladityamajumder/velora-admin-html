import { createElement, Fragment } from '../../../../runtime/dom.js';
import { ModulePage } from "../../../../features/enterprise/module-page.js";
export default function Page() {
  return createElement(ModulePage, { modulePath: "commerce/customers" });
}
