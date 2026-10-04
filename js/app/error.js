import { createElement, Fragment } from '../runtime/dom.js';
import { ErrorState } from "../components/data/states.js";
export default function Error({
  reset
}) {
  return createElement(ErrorState, { message: "Something went wrong", retry: reset });
}
