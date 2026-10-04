import { createElement, Fragment } from '../../runtime/dom.js';
import { TableSkeleton } from "../../components/data/states.js";
export default function Loading() {
  return createElement(TableSkeleton, null);
}
