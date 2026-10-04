import { createElement, Fragment } from '../../../runtime/dom.js';
import { notFound } from "../../../runtime/navigation.js";
import { AuthScreen } from "../../../components/auth-screen.js";
import { getAuthScreen } from "../../../config/auth.js";
export default function AuthPage({
  params
}) {
  const { slug } = params;
  if (!getAuthScreen(slug)) notFound();
  return createElement(AuthScreen, { slug });
}
