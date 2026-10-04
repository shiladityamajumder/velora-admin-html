import { test, expect } from "@playwright/test";
async function login(page) {
  await page.goto("/auth/login");
  await page.getByLabel("Password", { exact: true }).fill("NexaDemo123!");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/dashboard\//);
}
test("AMOLED dark mode uses black surfaces and colorful accessible section headings", async ({
  page
}) => {
  await login(page);
  await page.getByRole("button", { name: "Toggle theme", exact: true }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(0, 0, 0)"
  );
  await expect(page.locator("aside")).toHaveCSS(
    "background-color",
    "rgb(0, 0, 0)"
  );
  const sections = [
    "Template",
    "Dashboards",
    "Commerce",
    "Pharmacy",
    "Diagnostics",
    "Doctors",
    "Inventory",
    "Procurement",
    "Warehouse",
    "CRM",
    "Support",
    "Logistics",
    "Finance",
    "Marketing",
    "Content",
    "Vendors"
  ];
  const colors = [];
  for (const name of sections) {
    const trigger = page.locator(`button[data-nav-group="${name}"]`);
    const color = await trigger.evaluate(
      (element) => getComputedStyle(element).color
    );
    await expect(trigger.locator("svg").first()).toHaveCSS("color", color);
    colors.push(color);
    const [r, g, b] = color.match(/\d+/g).map((value) => Number(value) / 255).map(
      (value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    );
    expect(
      (0.2126 * r + 0.7152 * g + 0.0722 * b + 0.05) / 0.05
    ).toBeGreaterThan(4.5);
  }
  expect(new Set(colors).size).toBe(16);
  await page.reload();
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(0, 0, 0)"
  );
});
test("customizer presets, new controls and reset update the real interface and persist", async ({
  page
}) => {
  await page.goto("/library/charts/line");
  await page.getByRole("button", { name: "Theme customizer", exact: true }).click();
  const dialog = page.getByRole("dialog", {
    name: "Theme customizer",
    exact: true
  });
  await dialog.getByRole("button", { name: "Midnight Ocean", exact: true }).click();
  await expect(
    dialog.getByRole("button", { name: "Midnight Ocean", exact: true })
  ).toHaveAttribute("aria-pressed", "true");
  await dialog.getByRole("group", { name: "Sidebar width", exact: true }).getByRole("button", { name: "Wide", exact: true }).click();
  await dialog.getByRole("group", { name: "Header color", exact: true }).getByRole("button", { name: "Tinted", exact: true }).click();
  await dialog.getByRole("group", { name: "Text size", exact: true }).getByRole("button", { name: "Large", exact: true }).click();
  await dialog.getByRole("group", { name: "Motion", exact: true }).getByRole("button", { name: "Reduced", exact: true }).click();
  await dialog.getByRole("group", { name: "Chart palette", exact: true }).getByRole("button", { name: "Sunset", exact: true }).click();
  await page.getByRole("button", { name: "Close Theme customizer", exact: true }).click();
  await page.reload();
  for (const [key, value] of Object.entries({
    surface: "raised",
    sidebarSize: "wide",
    headerTone: "tinted",
    textSize: "large",
    motion: "reduced",
    chartPalette: "sunset"
  }))
    await expect(page.locator("html")).toHaveAttribute(
      `data-${key.replace(/[A-Z]/g, (letter) => "-" + letter.toLowerCase())}`,
      value
    );
  await expect(page.locator("aside")).toHaveCSS("width", "300px");
  await expect(page.locator("html")).toHaveCSS("font-size", "18px");
  expect(
    await page.locator("html").evaluate(
      (element) => getComputedStyle(element).getPropertyValue("--chart-1").trim()
    )
  ).toBe("#fb923c");
  await expect(page.locator("path.recharts-line-curve").first()).toHaveCSS(
    "stroke",
    "rgb(251, 146, 60)"
  );
  await page.getByRole("button", { name: "Theme customizer", exact: true }).click();
  await dialog.getByRole("button", { name: "Reset customization", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-chart-palette",
    "spectrum"
  );
  await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
  await expect(page.locator("aside")).toHaveCSS("width", "260px");
});
test("tabs support keyboard navigation and RTL arrow direction", async ({
  page
}) => {
  await page.goto("/library/patterns/tabs");
  await page.getByRole("tab", { name: "Overview", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Activity", exact: true })
  ).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(
    page.getByRole("tab", { name: "Settings", exact: true })
  ).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText(
    "Open appearance settings"
  );
  await page.keyboard.press("Home");
  await page.getByLabel("Language", { exact: true }).selectOption("ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await page.getByRole("tab").first().focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("tab").nth(1)).toHaveAttribute(
    "aria-selected",
    "true"
  );
});
test("accordion, help dismissal and keyboard tooltip work", async ({
  page
}) => {
  await page.goto("/library/patterns/accordion");
  await page.getByText("Can I reuse these components?", { exact: true }).click();
  await expect(page.locator("main details").first()).toHaveAttribute(
    "open",
    ""
  );
  await expect(
    page.getByText(
      "Yes. Replace the synthetic content with your own application data.",
      { exact: true }
    )
  ).toBeVisible();
  await page.goto("/library/patterns/tooltips");
  await page.getByRole("button", { name: "Contextual help", exact: true }).focus();
  await expect(page.getByRole("tooltip")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  await page.getByRole("button", { name: "Dismiss help", exact: true }).click();
  await page.getByRole("button", { name: "Show help", exact: true }).click();
  await expect(
    page.getByText("Inline help stays visible until you dismiss it.", {
      exact: true
    })
  ).toBeVisible();
});
test("pricing selection and activity notes persist independently", async ({
  page
}) => {
  await page.goto("/library/patterns/cards");
  await page.getByRole("button", { name: "Yearly", exact: true }).click();
  await page.getByRole("button", { name: /^Choose plan.*Team$/ }).click();
  await page.reload();
  await expect(page.getByRole("main").getByRole("status")).toContainText(
    "Team \xB7 Yearly"
  );
  await page.goto("/library/patterns/timeline");
  await page.getByLabel("Activity note", { exact: true }).fill("QA colorful timeline note");
  await page.getByRole("button", { name: "Add note", exact: true }).click();
  await page.getByLabel("Activity category", { exact: true }).selectOption("Note");
  await expect(page.locator("main ol li")).toHaveCount(1);
  await page.reload();
  await expect(
    page.getByRole("heading", {
      name: "QA colorful timeline note",
      exact: true
    })
  ).toBeVisible();
});
test("loading states recover and icon browser exports the selected size", async ({
  page
}) => {
  await page.goto("/library/patterns/loading");
  await page.getByLabel("Preview state", { exact: true }).selectOption("error");
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await page.getByRole("button", { name: "Preview loading", exact: true }).click();
  await expect(page.locator('[aria-busy="true"]')).toBeVisible();
  await page.getByRole("button", { name: "Complete preview", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Your preview is ready", exact: true })
  ).toBeVisible();
  await page.goto("/library/patterns/icons");
  await page.getByLabel("Search icons", { exact: true }).fill("Shield");
  await page.getByRole("button", { name: "Shield", exact: true }).click();
  await page.getByRole("slider", { name: "Icon size", exact: true }).focus();
  await page.keyboard.press("End");
  await expect(page.getByRole("slider")).toHaveValue("64");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download example", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("Shield-example.js");
});
test("mobile selection controls persist tags and switches", async ({
  page
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/library/patterns/selections");
  await page.getByRole("button", { name: "Toggle theme", exact: true }).click();
  await page.getByLabel("Search choices", { exact: true }).fill("Engineering");
  await page.getByRole("button", { name: "Engineering", exact: true }).click();
  await page.getByRole("switch", { name: "Enable demo updates", exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Engineering", exact: true })
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("switch", { name: "Enable demo updates", exact: true })
  ).toHaveAttribute("aria-checked", "false");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true);
});
