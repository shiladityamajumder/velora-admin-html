import { test, expect } from "@playwright/test";
test("cleared notifications survive reload and undo preserves read status", async ({
  page
}) => {
  await page.goto("/library");
  await page.getByRole("button", { name: "Notifications", exact: true }).click();
  const inbox = page.getByRole("dialog", {
    name: "Notifications",
    exact: true
  });
  await inbox.getByRole("button", { name: "Mark all read", exact: true }).click();
  await inbox.getByRole("button", { name: "Clear", exact: true }).click();
  await page.getByRole("dialog", { name: "Clear notifications", exact: true }).getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(inbox.getByRole("link")).toHaveCount(6);
  await inbox.getByRole("button", { name: "Clear", exact: true }).click();
  await page.getByRole("dialog", { name: "Clear notifications", exact: true }).getByRole("button", { name: "Confirm action", exact: true }).click();
  await expect(
    inbox.getByText("No notifications", { exact: true })
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Notifications", exact: true }).click();
  await inbox.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(inbox.getByRole("link")).toHaveCount(6);
  await expect(
    inbox.getByRole("button", { name: "Mark unread", exact: true })
  ).toHaveCount(6);
});
test("previously deleted inbox can be restored without resetting workspace", async ({
  page
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("nexa-data-v1:notifications-v2", "[]");
    localStorage.setItem("nexa-data-v1:qa-kept-data", '"preserved"');
  });
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/library");
  await page.getByRole("button", { name: "Notifications", exact: true }).click();
  const inbox = page.getByRole("dialog", {
    name: "Notifications",
    exact: true
  });
  await expect(
    inbox.getByText("No notifications", { exact: true })
  ).toBeVisible();
  await inbox.getByRole("button", { name: "Restore demo notifications", exact: true }).click();
  await expect(inbox.getByRole("link")).toHaveCount(6);
  expect(
    await page.evaluate(
      () => localStorage.getItem("nexa-data-v1:qa-kept-data")
    )
  ).toBe('"preserved"');
  await inbox.getByRole("button", { name: "Mark all read", exact: true }).click();
  await inbox.getByRole("button", { name: "Unread (0)", exact: true }).click();
  await expect(
    inbox.getByText("No matching notifications", { exact: true })
  ).toBeVisible();
  await inbox.getByRole("button", { name: "Reset filters", exact: true }).click();
  await expect(inbox.getByRole("link")).toHaveCount(6);
  await page.getByRole("button", { name: "Close Notifications", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Notifications", exact: true })
  ).toBeVisible();
});
test("gallery filters 33 previews and keeps the selected design across recovery", async ({
  page
}) => {
  await page.goto("/library/authentication/gallery");
  await expect(page.getByRole("link", { name: /^Open preview/ })).toHaveCount(
    33
  );
  await page.getByLabel("Auth design", { exact: true }).selectOption("cover");
  await page.getByLabel("Account flow", { exact: true }).selectOption("change-password");
  await expect(page.getByRole("link", { name: /^Open preview/ })).toHaveCount(
    1
  );
  await page.getByRole("link", {
    name: "Open preview Cover Change Password",
    exact: true
  }).click();
  await expect(page).toHaveURL(/auth\/cover-change-password$/);
  await page.getByRole("link", { name: "Forgot password?", exact: true }).click();
  await page.getByRole("button", { name: "Send reset link", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Check your inbox", exact: true })
  ).toBeVisible();
  await page.getByRole("link", { name: "New password", exact: true }).click();
  await expect(page).toHaveURL(/auth\/cover-reset-password$/);
});
test("password reset and change validate confirmation and current credentials", async ({
  page
}) => {
  await page.goto("/auth/split-reset-password");
  await page.getByLabel("New password", { exact: true }).fill("UpdatedDemo123!");
  await page.getByLabel("Confirm new password", { exact: true }).fill("DifferentDemo123!");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "The passwords do not match."
  );
  await page.getByLabel("Confirm new password", { exact: true }).fill("UpdatedDemo123!");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Saved successfully", exact: true })
  ).toBeVisible();
  await page.goto("/auth/change-password");
  await page.getByLabel("Current password", { exact: true }).fill("WrongCurrent123!");
  await page.getByLabel("New password", { exact: true }).fill("UpdatedDemo123!");
  await page.getByLabel("Confirm new password", { exact: true }).fill("UpdatedDemo123!");
  await page.getByRole("button", { name: "Change password", exact: true }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "Invalid demo credentials"
  );
  await page.getByLabel("Current password", { exact: true }).fill("NexaDemo123!");
  await page.getByRole("button", { name: "Change password", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Saved successfully", exact: true })
  ).toBeVisible();
});
test("email verification rejects invalid code and resends a demo code", async ({
  page
}) => {
  await page.goto("/auth/cover-email-verification");
  await page.getByLabel("Verification code", { exact: true }).fill("000000");
  await page.getByRole("button", { name: "Verify", exact: true }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "Invalid verification code"
  );
  await page.getByRole("button", { name: "Resend code", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("No email was sent.");
  await page.getByLabel("Verification code", { exact: true }).fill("123456");
  await page.getByRole("button", { name: "Verify", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Saved successfully", exact: true })
  ).toBeVisible();
});
test("two-factor setup stores only a demo enrollment preference", async ({
  page
}) => {
  await page.goto("/auth/split-two-factor-setup");
  await page.getByLabel("Verification code", { exact: true }).fill("123456");
  await page.getByRole("button", { name: "Enable two-factor", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Two-factor setup saved", exact: true })
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => JSON.parse(
        localStorage.getItem("nexa-demo-v2:two-factor-preferences") ?? "{}"
      )
    )
  ).toEqual({ "superadmin@example.com": true });
});
test("passwordless sign-in verifies a code and opens the demo dashboard", async ({
  page
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/auth/cover-passwordless");
  await page.getByRole("button", { name: "Switch to dark theme", exact: true }).click();
  await page.getByRole("button", { name: "Send sign-in code", exact: true }).click();
  await page.getByLabel("Verification code", { exact: true }).fill("000000");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "Invalid verification code"
  );
  await page.getByLabel("Verification code", { exact: true }).fill("123456");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/dashboard\/executive$/);
});
test("registration validates matching passwords and the new demo identity unlocks", async ({
  page
}) => {
  await page.goto("/auth/cover-register");
  await page.getByLabel("Full name", { exact: true }).fill("Demo Auth Preview");
  await page.getByLabel("Email", { exact: true }).fill("preview@example.com");
  await page.getByLabel("Password", { exact: true }).fill("NewDemoUser123!");
  await page.getByLabel("Confirm new password", { exact: true }).fill("DifferentDemo123!");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Create account", exact: true }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "The passwords do not match."
  );
  await page.getByLabel("Confirm new password", { exact: true }).fill("NewDemoUser123!");
  await page.getByRole("button", { name: "Create account", exact: true }).click();
  await expect(page).toHaveURL(/dashboard\/executive$/);
  await page.goto("/auth/split-lock-screen");
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue(
    "preview@example.com"
  );
  await page.getByLabel("Password", { exact: true }).fill("NexaDemo123!");
  await page.getByRole("button", { name: "Unlock", exact: true }).click();
  await expect(page).toHaveURL(/dashboard\/executive$/);
});
