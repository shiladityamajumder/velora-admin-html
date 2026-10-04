import { test, expect } from '@playwright/test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const fileURL = (entry) => pathToFileURL(root + entry).href;
const demoUser = { id: 'u1', name: 'Demo Administrator', email: 'superadmin@example.com', role: 'Super Admin' };

for (const entry of ['index.html', 'marketing/coupons/index.html', 'library/forms/wizard/index.html']) {
  test(`direct-file sidebar, history and reload work from ${entry}`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(user => localStorage.setItem('nexa-data-v1:enterprise-session', JSON.stringify(user)), demoUser);
    await page.goto(fileURL(entry));
    await expect(page.locator('body')).toHaveCSS('font-family', /Work Sans/);
    await expect(page.locator('aside')).toHaveCSS('width', '260px');
    const sidebar = page.locator('aside');
    await sidebar.getByRole('button', { name: 'Commerce', exact: true }).click();
    await sidebar.getByRole('link', { name: 'Orders', exact: true }).click();
    await expect(page).toHaveURL(/#\/commerce\/orders$/);
    await expect(page.getByRole('heading', { name: 'Orders', exact: true })).toBeVisible();
    const marketing = sidebar.getByRole('button', { name: 'Marketing', exact: true });
    if (await marketing.getAttribute('aria-expanded') !== 'true') await marketing.click();
    const coupons = sidebar.getByRole('link', { name: 'Coupons', exact: true });
    // A copied link or new tab must also be a valid local file URL.
    const destination = await coupons.getAttribute('href');
    expect(destination).toMatch(/^file:.*index\.html#\/marketing\/coupons$/);
    await coupons.click();
    await expect(page.getByRole('heading', { name: 'Coupons', exact: true })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Coupons', exact: true })).toBeVisible();
    await page.goBack();
    await expect(page.getByRole('heading', { name: 'Orders', exact: true })).toBeVisible();
    await page.goForward();
    await expect(page.getByRole('heading', { name: 'Coupons', exact: true })).toBeVisible();
    await page.goto(destination);
    await expect(page.getByRole('heading', { name: 'Coupons', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Toggle theme', exact: true }).click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    expect(errors).toEqual([]);
  });
}

test('local login honors the requested route and record links survive reload', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(fileURL('marketing/coupons/index.html'));
  await expect(page.getByRole('heading', { name: 'Demo workspace', exact: true })).toBeVisible();
  await page.getByRole('main').getByRole('link', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(/#\/auth\/login\?next=/);
  await page.getByLabel('Email', { exact: true }).fill(demoUser.email);
  await page.getByLabel('Password', { exact: true }).fill('NexaDemo123!');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(/#\/marketing\/coupons$/);
  await expect(page.getByRole('heading', { name: 'Coupons', exact: true })).toBeVisible();
  await page.locator('tbody a').first().click();
  await expect(page).toHaveURL(/#\/marketing\/coupons\/NX-CA1001$/);
  await expect(page.getByRole('heading', { name: 'Wellness Week · 1', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Wellness Week · 1', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('static file styles and links resolve with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(fileURL('index.html'));
  await expect(page.locator('aside')).toHaveCSS('width', '260px');
  await page.locator('aside').getByRole('link', { name: 'Documentation', exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/index\.html$/);
  await expect(page.getByRole('heading', { name: 'Documentation', exact: true })).toBeVisible();
  await context.close();
});

test('documentation anchors preserve the local route', async ({ page }) => {
  await page.goto(fileURL('index.html') + '#/docs');
  await expect(page.getByRole('heading', { name: 'Documentation', exact: true })).toBeVisible();
  await page.locator('main a[href="#doc-2"]').click();
  await expect(page).toHaveURL(/#\/docs#doc-2$/);
  await expect(page.getByRole('heading', { name: 'Documentation', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Documentation', exact: true })).toBeVisible();
});

test('static-host fallback loads styles and the bundle at a dynamic record URL', async ({ page }) => {
  // Return index.html unchanged, like an ordinary static hosting rewrite.
  const server = createServer(async (request, response) => {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    let file = path.join(root, decodeURIComponent(pathname));
    if ((await stat(file).catch(() => null))?.isDirectory()) file = path.join(file, 'index.html');
    let data = await readFile(file).catch(() => null);
    if (!data && !path.extname(pathname)) { file = root + 'index.html'; data = await readFile(file); }
    response.writeHead(data ? 200 : 404, { 'Content-Type': ({ '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.woff2': 'font/woff2', '.ttf': 'font/ttf' })[path.extname(file)] || 'text/plain' });
    response.end(data || 'Not found');
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(user => localStorage.setItem('nexa-data-v1:enterprise-session', JSON.stringify(user)), demoUser);
    await page.goto(`http://127.0.0.1:${server.address().port}/marketing/coupons/NX-CA1001`);
    await expect(page.locator('aside')).toHaveCSS('width', '260px');
    await expect(page.getByRole('heading', { name: 'Wellness Week · 1', exact: true })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Wellness Week · 1', exact: true })).toBeVisible();
    expect(errors).toEqual([]);
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});
