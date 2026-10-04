import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('HTML files contain the real page markup before JavaScript runs', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: 'http://127.0.0.1:3200' });
  const page = await context.newPage();
  for (const [route, heading] of [
    ['/', 'Template overview'],
    ['/template/index.html', 'Template overview'],
    ['/dashboard/analytics/index.html', 'Analytics'],
    ['/library/tables/striped/index.html', 'Striped Table'],
    ['/auth/split-login/index.html', 'Welcome back'],
  ]) {
    await page.goto(route);
    await expect(page.locator('h1').first()).toContainText(heading);
    await expect(page.locator('body')).toHaveCSS('font-family', /Work Sans/);
  }
  await context.close();
});

test('downloaded icon example is valid plain JavaScript', async ({ page }) => {
  await page.goto('/library/patterns/icons');
  await page.getByLabel('Search icons', { exact: true }).fill('Shield');
  await page.getByRole('button', { name: 'Shield', exact: true }).click();
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download example', exact: true }).click();
  const file = await downloaded;
  expect(file.suggestedFilename()).toBe('Shield-example.js');
  const contents = await readFile(await file.path(), 'utf8');
  expect(contents).toContain('createElement(Shield, { size: 24 })');
  expect(contents).not.toContain('<Shield');
});
