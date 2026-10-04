import { test, expect } from "@playwright/test";
test("Velora library is public and available in the bottom sidebar", async ({
  page
}) => {
  await page.goto("/library");
  await expect(page).toHaveTitle("Velora Admin");
  await expect(
    page.getByRole("heading", { name: "UI Library", exact: true })
  ).toBeVisible();
  const sidebar = page.locator("aside");
  await expect(
    sidebar.getByRole("link", { name: "VELORA", exact: true })
  ).toBeVisible();
  await sidebar.getByRole("button", { name: "Table Examples", exact: true }).click();
  await sidebar.getByRole("link", { name: "Striped Table", exact: true }).click();
  await expect(page).toHaveURL(/library\/tables\/striped$/);
  await page.getByRole("textbox", { name: "Search", exact: true }).fill("Demo Asha");
  await expect(page.locator("tbody tr")).toHaveCount(6);
  await expect(
    page.getByRole("button", { name: "Next", exact: true })
  ).toBeDisabled();
});
test("advanced example expands records and exports filtered data", async ({
  page
}) => {
  await page.goto("/library/tables/expandable");
  await page.getByRole("button", { name: "Details Demo Asha 1", exact: true }).click();
  await expect(page.locator("dl")).toContainText("demo1@example.com");
  await page.getByRole("textbox", { name: "Search", exact: true }).fill("Demo Mira 3");
  await expect(page.locator("tbody tr")).toHaveCount(2);
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV", exact: true }).click();
  expect((await downloaded).suggestedFilename()).toMatch(/\.csv$/);
});
test("wizard validates each step and persists the saved example", async ({
  page
}) => {
  await page.goto("/library/forms/wizard");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByRole("alert").first()).toBeVisible();
  await page.getByRole("textbox", { name: "Name", exact: true }).fill("Demo Library User");
  await page.getByRole("textbox", { name: "Email", exact: true }).fill("library@example.com");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByLabel("Budget", { exact: true }).fill("2400");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByRole("main")).toContainText("Demo Library User");
  await page.reload();
  await expect(page.getByRole("main")).toContainText("library@example.com");
});
test("calendar views share newly created events", async ({ page }) => {
  await page.goto("/library/calendars/week");
  await page.getByRole("button", { name: /^New event$/i }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Event title", { exact: true }).fill("QA Library Event");
  await dialog.getByLabel("Date", { exact: true }).fill("2026-10-03");
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(
    page.getByRole("button", { name: /QA Library Event/ })
  ).toBeVisible();
  await page.getByRole("link", { name: "Agenda Calendar", exact: true }).last().click();
  await expect(
    page.getByRole("button", { name: /QA Library Event/ })
  ).toBeVisible();
});
test("chart controls, upload and auth previews work on mobile dark", async ({
  page
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/library/charts/line");
  await page.getByRole("button", { name: "Toggle theme", exact: true }).click();
  await page.getByRole("button", { name: "6 Periods", exact: true }).click();
  await page.getByRole("button", { name: "Comparison", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Comparison", exact: true })
  ).toHaveAttribute("aria-pressed", "false");
  await expect(
    page.locator("svg.recharts-surface[role=application]")
  ).toBeVisible();
  await page.goto("/library/forms/upload");
  await page.getByLabel("Upload files", { exact: true }).setInputFiles({
    name: "library-example.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("Synthetic file")
  });
  const download = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("library-example.txt");
  await page.goto("/library/authentication/gallery");
  await page.getByRole("link", { name: "Open preview Split Login", exact: true }).click();
  await expect(page).toHaveURL(/auth\/split-login$/);
  await expect(
    page.getByRole("heading", { name: "Welcome back", exact: true })
  ).toBeVisible();
  await page.getByRole("link", { name: "UI Library", exact: true }).click();
  await expect(page).toHaveURL(/library\/authentication\/gallery$/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true);
  expect(errors).toEqual([]);
});
