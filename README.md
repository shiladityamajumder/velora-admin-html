# Velora Admin HTML

A standalone sibling of `velora-admin-nextjs`, with the current Velora screens converted to HTML, CSS and browser JavaScript. The Next.js project is unchanged. This project has its own fonts, translations, demo data, assets and JavaScript helpers; it does not import files from the sibling project or require Next.js or React to run.

## Run locally

With Node.js installed:

```bash
cd velora-admin-html
npm run dev
```

Open **http://127.0.0.1:3200/template**. No `npm install` is needed to preview or build the site. Use an HTTP server rather than double-clicking files: browser ES modules require HTTP access.

```bash
npm run dev -- --host 0.0.0.0 --port 3200
```

The overview is at `/template`, the UI library at `/library`, and demo sign-in at `/auth/login`. The original route names are preserved. Each of the 307 static routes also has a real `index.html` file, for example `dashboard/analytics/index.html` and `library/forms/wizard/index.html`.

Demo password: `NexaDemo123!`. Verification code: `123456`. Accounts: `superadmin@example.com`, `operations@example.com`, `pharmacy@example.com`, `support@example.com`, `finance@example.com`, and `vendor@example.com`.

## Included

- All 14 dashboards, enterprise module directories and create/detail/edit flows, and the original apps, settings and profile.
- All 33 authentication previews, error pages, forms, tables, charts, calendars and UI patterns.
- The original semantic stylesheet, bundled fonts, responsive sidebar, customizer, themes, palettes, density, radii, language choices and RTL behavior.
- Sorting, filtering, selection, saved views, pagination, CSV export/import, dialogs, notifications, command search and keyboard controls.
- The original local demo repositories and workflows, including inventory transfers, order transitions, support replies, uploads and browser storage persistence.

## Files to edit

| Location | Purpose |
| --- | --- |
| `*/index.html` | Complete static page markup, available before JavaScript starts |
| `css/velora.css` | Shared styles, utility classes, tokens and font declarations |
| `js/app.js` | Browser route selection |
| `js/components/`, `js/features/` | Editable plain JavaScript templates and interactions |
| `js/config/` | Branding, appearance defaults, modules, navigation and authentication configuration |
| `js/services/`, `js/lib/` | Demo persistence, operations and reusable logic |
| `js/messages/` | All 12 language dictionaries |
| `js/runtime/` | Native DOM template rendering, state, navigation and event binding |
| `js/vendor/` | Prebundled chart, icon, table, date and validation helpers; no CDN needed |
| `routes.json` | Complete static page inventory |

JavaScript enhances the templates and updates the DOM as preferences and demo records change. Edit the matching JavaScript template to change both the initial page and its interactive states. After changing shared templates, regenerate the HTML using `npm run templates` while the preview server is running. That export command requires the optional Playwright development dependency and Chromium.

The original demo access rules remain: interactive workspace pages ask anonymous visitors to sign in. The static markup contains synthetic previews. Demo data is isolated by browser origin, so this project's records do not modify the original application's records when served on a separate port.

## Build and host

```bash
npm run check
npm run build
```

Upload `dist/` to a static host. There is no application compilation or framework server. Serve at the domain root and configure unknown routes to return `/index.html`, which supports direct visits and reloads for dynamically created record URLs. `_redirects` (compatible static hosts) and `.htaccess` (Apache with `mod_rewrite`) are included. Existing static route directories work on ordinary static servers. For an Nginx host use `try_files $uri $uri/ /index.html;`.

## Browser verification

Only tests and HTML regeneration need development dependencies:

```bash
npm install
npx playwright install chromium
npm test
```

Start `npm run dev` in another terminal first. The browser suite checks the same workflows as the Next.js project, with the icon download adapted to a JavaScript example. Validation reports and representative visual comparisons are in `artifacts/`.

The copied design includes a narrow-screen toolbar overflow at 320px. The HTML edition limits the language selector to 90px below 360px to keep every control visible. The original project's files and styles are unchanged.
