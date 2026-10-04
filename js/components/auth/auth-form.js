import { createElement, Fragment } from '../../runtime/dom.js';
import { Link as Link } from "../../runtime/navigation.js";
import { useRouter } from "../../runtime/navigation.js";
import { useState, useSyncExternalStore } from "../../runtime/dom.js";
import { ArrowRight, CheckCircle2 } from "../../vendor/icons.js";
import { Button } from "../primitives.js";
import { FormField } from "../interactions.js";
import { useI18n } from "../../i18n/provider.js";
import { useAuth } from "../../hooks/use-auth.js";
import { authService, demoUsers, homeForRole } from "../../services/auth.js";
import { appConfig } from "../../config/app.js";
import {
  authFlows,
  authSlug
} from "../../config/auth.js";
import { Password } from "./password.js";
const subscribeHydration = () => () => {
};
export function AuthForm({
  mode,
  design
}) {
  const ready = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false
  );
  const router = useRouter();
  const { t } = useI18n();
  const auth = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [notice, setNotice] = useState("");
  const [enteredEmail, setEmail] = useState(null);
  const email = enteredEmail ?? auth.user?.email ?? "superadmin@example.com";
  const flow = authFlows.find((item) => item.mode === mode);
  const register = mode === "register", forgot = mode === "forgot-password", reset = mode === "reset-password", change = mode === "change-password", passwordless = mode === "passwordless";
  const verify = [
    "otp",
    "email-verification",
    "two-factor",
    "two-factor-setup"
  ].includes(mode);
  const passwordForm = register || reset || change;
  const href = (target) => `/auth/${authSlug(target, design)}`;
  const openWorkspace = (user) => {
    auth.login(user);
    const next = new URLSearchParams(window.location.search).get("next");
    router.push(
      next && /^\/(?![\/\\])/.test(next) ? next : homeForRole(user.role)
    );
  };
  if (success)
    return createElement("div", { role: "status", className: "space-y-4 text-center" }, createElement(CheckCircle2, { size: 40, className: "mx-auto text-success" }), createElement("h1", { className: "text-xl font-semibold" }, t(
      forgot ? "Check your inbox" : mode === "two-factor-setup" ? "Two-factor setup saved" : "Saved successfully"
    )), createElement("p", { className: "text-sm leading-6 text-muted" }, t(
      forgot ? "A recovery link is simulated for this demo. Continue to preview the reset form." : "This is a local demo. No email or real account change is performed."
    )), (change || reset) && createElement("p", { className: "text-xs text-muted" }, t("Demo accounts continue to use the documented demo password.")), createElement(
      Link,
      {
        className: "inline-block text-sm text-brand",
        href: href(forgot ? "reset-password" : "login")
      },
      t(forgot ? "New password" : "Back to sign in")
    ));
  return createElement(Fragment, null, createElement("h1", { className: "text-xl font-semibold" }, t(flow.heading)), createElement("p", { className: "mt-2 text-xs leading-5 text-muted" }, t(flow.description)), createElement(
    "form",
    {
      method: "post",
      className: "mt-6 space-y-4",
      onSubmit: async (event) => {
        event.preventDefault();
        setError("");
        setNotice("");
        setBusy(true);
        const values = new FormData(event.currentTarget);
        try {
          const password = String(values.get("password") ?? "");
          if (passwordForm && password !== values.get("confirm"))
            throw new Error("The passwords do not match.");
          if (forgot) {
            await authService.requestRecovery(email);
            setSuccess(true);
            return;
          }
          if (reset) {
            await authService.resetPassword(password);
            setSuccess(true);
            return;
          }
          if (change) {
            await authService.changePassword(
              email,
              String(values.get("current")),
              password
            );
            setSuccess(true);
            return;
          }
          if (verify || passwordless && codeSent) {
            if (!await authService.verify(String(values.get("code"))))
              throw new Error("Invalid verification code");
            if (passwordless) {
              openWorkspace(
                await authService.login(email, appConfig.demoPassword)
              );
              return;
            }
            if (mode === "two-factor-setup")
              await authService.enableTwoFactor(
                email,
                String(values.get("code"))
              );
            setSuccess(true);
            return;
          }
          if (passwordless) {
            await authService.requestRecovery(email);
            setCodeSent(true);
            setNotice("Demo verification code is ready. No email was sent.");
            return;
          }
          const user = register ? await authService.register(
            String(values.get("name")),
            email,
            password
          ) : await authService.login(email, password);
          openWorkspace(user);
        } catch (error2) {
          setError(
            error2 instanceof Error ? t(error2.message) : t("Something went wrong")
          );
        } finally {
          setBusy(false);
        }
      }
    },
    register && createElement(FormField, { label: t("Full name") }, createElement(
      "input",
      {
        name: "name",
        required: true,
        minLength: 2,
        autoComplete: "name",
        className: "field"
      }
    )),
    (!reset && !verify || mode === "email-verification" || mode === "two-factor-setup") && createElement(FormField, { label: t("Email") }, createElement(
      "input",
      {
        name: "email",
        required: true,
        type: "email",
        autoComplete: "email",
        className: "field",
        value: email,
        readOnly: passwordless && codeSent,
        onChange: (event) => setEmail(event.target.value)
      }
    )),
    change && createElement(FormField, { label: t("Current password") }, createElement(
      Password,
      {
        name: "current",
        label: t("Current password"),
        minLength: 8
      }
    )),
    mode === "two-factor-setup" && createElement("div", { className: "rounded border border-ui bg-[var(--panel-2)] p-3 text-xs leading-5" }, createElement("p", { className: "font-semibold" }, t("Demo setup key")), createElement("code", { className: "mt-1 block break-all", dir: "ltr" }, "VELORA-DEMO-SETUP"), createElement("p", { className: "mt-2 text-muted" }, t(
      "Use the demo code below. This key is a visual example for your authentication provider."
    ))),
    verify || passwordless && codeSent ? createElement(FormField, { label: t("Verification code") }, createElement(
      "input",
      {
        name: "code",
        required: true,
        inputMode: "numeric",
        autoComplete: "one-time-code",
        pattern: "[0-9]{6}",
        maxLength: 6,
        className: "field text-center tracking-[.4em]",
        placeholder: "123456"
      }
    )) : !forgot && !passwordless && createElement(FormField, { label: t(reset || change ? "New password" : "Password") }, createElement(
      Password,
      {
        name: "password",
        label: t(reset || change ? "New password" : "Password"),
        minLength: passwordForm ? 12 : 8,
        newPassword: passwordForm
      }
    )),
    passwordForm && createElement(Fragment, null, createElement(FormField, { label: t("Confirm new password") }, createElement(
      Password,
      {
        name: "confirm",
        label: t("Confirm new password"),
        minLength: 12,
        newPassword: true
      }
    )), createElement("p", { className: "text-xs text-muted" }, t("Use at least 12 characters and confirm the same password."))),
    register && createElement("label", { className: "flex items-start gap-2 text-xs leading-5" }, createElement(
      "input",
      {
        type: "checkbox",
        required: true,
        className: "mt-1 accent-[var(--brand)]"
      }
    ), t("I agree to the demo terms and privacy notice.")),
    error && createElement(
      "p",
      {
        role: "alert",
        className: "rounded bg-danger/10 p-3 text-xs text-danger"
      },
      error
    ),
    notice && createElement(
      "p",
      {
        role: "status",
        className: "rounded bg-brand/10 p-3 text-xs text-brand"
      },
      t(notice)
    ),
    createElement(Button, { type: "submit", disabled: busy || !ready, className: "w-full" }, t(passwordless && codeSent ? "Sign in" : flow.action), createElement(ArrowRight, { size: 14 })),
    (verify || passwordless && codeSent) && createElement("div", { className: "space-y-2" }, createElement("p", { className: "text-xs text-muted" }, t("Verification code"), ": ", createElement("code", null, appConfig.demoOtp)), mode !== "two-factor-setup" && mode !== "two-factor" && createElement(
      Button,
      {
        type: "button",
        variant: "ghost",
        disabled: busy,
        onClick: async () => {
          setBusy(true);
          setError("");
          try {
            await authService.requestRecovery(email);
            setNotice(
              "Demo verification code is ready. No email was sent."
            );
          } catch (error2) {
            setError(
              error2 instanceof Error ? t(error2.message) : t("Something went wrong")
            );
          } finally {
            setBusy(false);
          }
        }
      },
      t("Resend code")
    ), passwordless && createElement(
      Button,
      {
        type: "button",
        variant: "ghost",
        onClick: () => {
          setCodeSent(false);
          setNotice("");
          setError("");
        }
      },
      t("Use another email")
    ))
  ), createElement("div", { className: "mt-5 flex flex-wrap justify-between gap-2 text-xs text-brand" }, createElement(Link, { href: href("login") }, t("Back to sign in")), createElement(Link, { href: href("register") }, t("Create account")), createElement(Link, { href: href("forgot-password") }, t("Forgot password?"))), (mode === "login" || mode === "lock-screen") && createElement("div", { className: "mt-5 rounded border border-ui bg-[var(--panel-2)] p-3" }, createElement("p", { className: "text-xs font-semibold" }, t("Demo accounts")), createElement("p", { className: "mt-1 text-xs text-muted" }, t("Password"), ": ", createElement("code", null, appConfig.demoPassword)), createElement("div", { className: "mt-2 space-y-1" }, demoUsers.map((user) => createElement("p", { key: user.id, className: "break-all text-[11px]" }, user.email, " ", createElement("span", { className: "text-muted" }, "\xB7 ", user.role))))));
}
