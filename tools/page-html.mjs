/** The same portable paths are used by exports and repairs of existing pages. */
export function portableHTML(html, route, routes) {
  const prefix = route === '/' ? './' : '../'.repeat(route.slice(1).split('/').length);
  // A static host may serve the root entry at a dynamic record URL. HTTP
  // assets must still resolve at the domain root; file entries stay relative.
  const hostedBase = '<script data-hosted-base>if(location.protocol!=="file:"){const base=document.createElement("base");base.href="/";document.head.append(base);}</script>';
  html = html.replace(/<script data-hosted-base>[\s\S]*?<\/script>/g, '');
  html = html.replace(/<script\b[^>]*src="[^"]*\/js\/app(?:\.bundle)?\.js"[^>]*><\/script>/g, `<script defer src="${prefix}js/app.bundle.js"></script>`)
    .replace(/src="[^"]*\/js\/boot\.js"/g, `src="${prefix}js/boot.js"`)
    .replace(/href="[^"]*\/css\/velora\.css"/g, `href="${prefix}css/velora.css"`);
  html = html.replace(/\s(href|src)="\/(?!\/)([^"<>]*)"/g, (_, attribute, value) => {
    const url = new URL('/' + value, 'https://velora.local');
    if (attribute === 'src' || /\.[a-z0-9]+$/i.test(url.pathname)) return ` ${attribute}="${prefix}${value}"`;
    const target = url.pathname.replace(/\/$/, '') || '/template';
    const href = routes.has(target) ? `${prefix}${target.slice(1)}/index.html${url.search}${url.hash}` : `${prefix}index.html#${url.pathname}${url.search}${url.hash}`;
    return ` href="${href}"`;
  });
  return route === '/' ? html.replace('<head>', '<head>' + hostedBase) : html;
}
