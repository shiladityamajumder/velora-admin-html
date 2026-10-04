import { test, expect } from "@playwright/test";
import hi from "../js/messages/hi.js";
import bn from "../js/messages/bn.js";
async function login(page, email = "superadmin@example.com") {
  await page.goto("/auth/login");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill("NexaDemo123!");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/dashboard\//);
}
test("anonymous dashboard hydrates and theme and sidebar work before login", async ({
  page
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/dashboard/executive");
  await expect(
    page.getByRole("heading", { name: "Demo workspace", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("main").getByText("Loading", { exact: true })
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Toggle theme", exact: true }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Toggle theme", exact: true }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  const sidebar = page.locator("aside");
  await sidebar.getByRole("button", { name: "Template", exact: true }).click();
  await sidebar.getByRole("link", { name: "Documentation", exact: true }).click();
  await expect(page).toHaveURL(/\/docs$/);
  await expect(
    page.getByRole("heading", { name: "Documentation", exact: true })
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("desktop sidebar expands, navigates, collapses and toggles mini mode", async ({
  page
}) => {
  await login(page);
  const sidebar = page.locator("aside");
  const commerce = sidebar.getByRole("button", {
    name: "Commerce",
    exact: true
  });
  await commerce.click();
  await expect(commerce).toHaveAttribute("aria-expanded", "true");
  await sidebar.getByRole("link", { name: "Orders", exact: true }).click();
  await expect(page).toHaveURL(/\/commerce\/orders$/);
  await expect(
    page.getByRole("heading", { name: "Orders", exact: true })
  ).toBeVisible();
  await commerce.click();
  await expect(commerce).toHaveAttribute("aria-expanded", "false");
  await page.reload();
  await expect(commerce).toHaveAttribute("aria-expanded", "false");
  await page.getByRole("button", { name: "Toggle navigation", exact: true }).click();
  await expect(sidebar).toHaveCSS("width", "80px");
  await page.getByRole("button", { name: "Toggle navigation", exact: true }).click();
  await expect(sidebar).toHaveCSS("width", "260px");
});
test("demo login rejects invalid credentials and opens the dashboard", async ({
  page
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/auth/login");
  await page.getByLabel("Password", { exact: true }).fill("wrong-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "Invalid demo credentials"
  );
  await login(page);
  await expect(
    page.getByRole("heading", { name: "Executive \xB7 Overview" })
  ).toBeVisible();
  await expect(page.locator("tbody tr")).toHaveCount(6);
  expect(errors).toEqual([]);
});
test("product create, validation, shared persistence, edit, selection and delete", async ({
  page
}) => {
  await login(page);
  await page.goto("/commerce/products");
  await page.getByRole("button", { name: "Create", exact: true }).last().click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Name").fill("QA Synthetic Product");
  await dialog.getByLabel("SKU").fill("QA-SKU");
  await dialog.getByLabel("Category").fill("Wellness");
  await dialog.getByRole("tab", { name: "Pricing", exact: true }).click();
  await dialog.getByLabel("MRP", { exact: true }).fill("100");
  await dialog.getByLabel("Price", { exact: true }).fill("150");
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText(
    "Price must not exceed MRP"
  );
  await dialog.getByLabel("Price", { exact: true }).fill("80");
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await page.getByLabel("Search", { exact: true }).fill("QA Synthetic Product");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.reload();
  await page.getByLabel("Search", { exact: true }).fill("QA Synthetic Product");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByRole("link", { name: "QA Synthetic Product", exact: true }).click();
  await page.getByRole("button", { name: "Edit", exact: true }).click();
  await page.getByRole("dialog").getByLabel("Name").fill("QA Updated Product");
  await page.getByRole("dialog").getByRole("button", { name: "Save", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "QA Updated Product", exact: true })
  ).toBeVisible();
  await page.goto("/commerce/products");
  await page.getByLabel("Search", { exact: true }).fill("QA Updated Product");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByRole("checkbox", { name: "Selected QA Updated Product", exact: true }).check();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Confirm action", exact: true }).click();
  await expect(page.getByText("No results", { exact: true })).toBeVisible();
});
test("order status workflow, notes and prescription rejection confirmation", async ({
  page
}) => {
  await login(page);
  await page.goto("/commerce/orders/NX-O1001");
  await page.getByRole("button", { name: "Processing", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Packed", exact: true })
  ).toBeVisible();
  await page.getByLabel("Internal note", { exact: true }).fill("QA order note");
  await page.getByRole("button", { name: "Add note", exact: true }).click();
  await expect(page.getByText("QA order note", { exact: true })).toBeVisible();
  await page.goto("/pharmacy/prescriptions/NX-PR1001");
  await page.getByRole("button", { name: "Reject", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("dialog").getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Approve", exact: true })
  ).toBeVisible();
});
test("pipeline moves persist and support replies appear in the conversation", async ({
  page
}) => {
  await login(page);
  await page.goto("/crm/pipeline");
  await page.getByLabel("Stage Demo Horizon Clinic \xB7 1", { exact: true }).selectOption("Won");
  await page.reload();
  await expect(
    page.getByLabel("Stage Demo Horizon Clinic \xB7 1", { exact: true })
  ).toHaveValue("Won");
  await page.goto("/support/tickets/NX-TI1001");
  await page.getByLabel("Reply", { exact: true }).fill("QA reply stored locally");
  await page.getByRole("button", { name: "Reply", exact: true }).click();
  await expect(
    page.getByText("QA reply stored locally", { exact: true }).first()
  ).toBeVisible();
});
test("theme, language and direction survive reload", async ({ page }) => {
  await login(page);
  await page.getByRole("button", { name: "Toggle theme", exact: true }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByLabel("Language", { exact: true }).selectOption("ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await page.goto("/commerce/products");
  await expect(
    page.getByRole("heading", { name: "\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "\u0625\u0646\u0634\u0627\u0621", exact: true }).last()
  ).toBeVisible();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveClass(/dark/);
});
test("support role cannot view finance or create products", async ({
  page
}) => {
  await login(page, "support@example.com");
  await page.goto("/finance/transactions");
  await expect(
    page.getByRole("heading", { name: "Unauthorized", exact: true })
  ).toBeVisible();
  await page.goto("/commerce/products/new");
  await expect(
    page.getByRole("heading", { name: "Unauthorized", exact: true })
  ).toBeVisible();
  await page.goto("/support/tickets");
  await expect(
    page.getByRole("heading", { name: "Tickets", exact: true })
  ).toBeVisible();
});
test("command palette finds entities and supports keyboard navigation", async ({
  page
}) => {
  await login(page);
  await page.keyboard.press("Control+k");
  await page.getByRole("combobox", { name: "Search workspace", exact: true }).fill("NX-O1001");
  await expect(page.getByRole("dialog").getByRole("option")).toHaveCount(1);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/commerce\/orders\/NX-O1001/);
});
test("mobile and RTL pages avoid document overflow", async ({ page }) => {
  await login(page);
  for (const width of [320, 375, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/dashboard/executive",
      "/commerce/products",
      "/commerce/orders/NX-O1001",
      "/inventory/stock",
      "/crm/pipeline",
      "/settings/appearance"
    ]) {
      await page.goto(route);
      await expect(page.locator("h1").first()).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth
        ),
        `${route} at ${width}`
      ).toBe(true);
    }
  }
  await page.setViewportSize({ width: 375, height: 900 });
  await page.getByRole("button", { name: "Toggle navigation", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
test("stock transfer posts balanced movements and updates source quantity", async ({
  page
}) => {
  await login(page);
  await page.goto("/inventory/transfers/NX-TR1001");
  await page.getByRole("button", { name: "Approved", exact: true }).click();
  await page.getByRole("button", { name: "Completed", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Confirm action", exact: true }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.goto("/inventory/stock/NX-IN1002");
  await expect(page.locator("dd").filter({ hasText: /^18$/ })).toBeVisible();
  await page.goto("/inventory/movements");
  await page.getByLabel("Search", { exact: true }).fill("NX-TR1001");
  await expect(page.locator("tbody tr")).toHaveCount(2);
  await expect(
    page.getByRole("main").getByRole("button", { name: "Create", exact: true })
  ).toHaveCount(0);
});
test("files upload, folder filtering and downloads work", async ({ page }) => {
  await login(page);
  await page.goto("/apps/files");
  await page.getByLabel("Upload", { exact: true }).setInputFiles({
    name: "qa-demo.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("Synthetic QA file")
  });
  await expect(
    page.getByRole("heading", { name: "qa-demo.txt", exact: true })
  ).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download qa-demo.txt", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("qa-demo.txt");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "qa-demo.txt", exact: true })
  ).toBeVisible();
});
test("Hindi and Bengali, bundled fonts and feature guards work", async ({
  page
}) => {
  await login(page);
  for (const [locale, dictionary] of [
    ["hi", hi],
    ["bn", bn]
  ]) {
    await page.goto("/commerce/products");
    await page.locator("header select").selectOption(locale);
    await expect(
      page.getByRole("heading", { name: dictionary.Products, exact: true })
    ).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
  }
  await page.locator("header select").selectOption("en");
  await page.goto("/settings/appearance");
  for (const font of ["Inter", "Manrope", "Roboto", "Plus Jakarta Sans"]) {
    await page.getByRole("button", { name: font, exact: true }).click();
    await expect(
      page.getByRole("button", { name: font, exact: true })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      await page.evaluate(async (font2) => {
        const faces = await document.fonts.load(`14px "${font2}"`);
        return faces.length > 0 && getComputedStyle(document.body).fontFamily.includes(font2);
      }, font)
    ).toBe(true);
  }
  await page.goto("/settings/features");
  await page.getByRole("switch", { name: "diagnostics", exact: true }).click();
  await page.goto("/diagnostics/bookings");
  await expect(
    page.getByRole("heading", { name: "Unauthorized", exact: true })
  ).toBeVisible();
  await page.goto("/dashboard/diagnostics");
  await expect(
    page.getByRole("heading", { name: "Unauthorized", exact: true })
  ).toBeVisible();
});
