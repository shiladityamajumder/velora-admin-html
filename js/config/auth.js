export const authFlows = [
  {
    mode: "login",
    title: "Login",
    heading: "Welcome back",
    action: "Sign in",
    description: "Sign in with a demo account to open your workspace."
  },
  {
    mode: "register",
    title: "Register",
    heading: "Create account",
    action: "Create account",
    description: "Create a local demo identity with limited workspace access."
  },
  {
    mode: "forgot-password",
    title: "Password Recovery",
    heading: "Forgot password?",
    action: "Send reset link",
    description: "Enter your email to preview the password recovery flow."
  },
  {
    mode: "reset-password",
    title: "Password Reset",
    heading: "New password",
    action: "Save",
    description: "Choose a new password and confirm it before continuing."
  },
  {
    mode: "change-password",
    title: "Change Password",
    heading: "Change password",
    action: "Change password",
    description: "Verify your current demo password before choosing a new one."
  },
  {
    mode: "otp",
    title: "OTP Verification",
    heading: "Verify",
    action: "Verify",
    description: "Enter the six-digit demo code to verify your identity."
  },
  {
    mode: "email-verification",
    title: "Email Verification",
    heading: "Verify your email",
    action: "Verify",
    description: "Confirm your email with a verification code."
  },
  {
    mode: "two-factor",
    title: "Two-factor Verification",
    heading: "Two-factor authentication",
    action: "Verify",
    description: "Enter your authenticator code for an additional verification step."
  },
  {
    mode: "two-factor-setup",
    title: "Two-factor Setup",
    heading: "Set up two-factor authentication",
    action: "Enable two-factor",
    description: "Preview authenticator enrollment and verify the demo setup code."
  },
  {
    mode: "lock-screen",
    title: "Lock Screen",
    heading: "Lock Screen",
    action: "Unlock",
    description: "Unlock your demo account with its current password."
  },
  {
    mode: "passwordless",
    title: "Passwordless Login",
    heading: "Sign in with a code",
    action: "Send sign-in code",
    description: "Request a demo code and use it to sign in without a password."
  }
];
export const authDesigns = [
  { id: "centered", prefix: "", title: "Centered" },
  { id: "split", prefix: "split-", title: "Split" },
  { id: "cover", prefix: "cover-", title: "Cover" }
];
export function authSlug(mode, design) {
  return `${authDesigns.find((item) => item.id === design).prefix}${mode}`;
}
export function getAuthScreen(slug) {
  const design = authDesigns.find((item) => item.prefix && slug.startsWith(item.prefix)) ?? authDesigns[0];
  const mode = slug.slice(design.prefix.length);
  const flow = authFlows.find((item) => item.mode === mode);
  return flow ? { design, flow } : null;
}
