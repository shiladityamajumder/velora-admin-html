import { createElement, useEffect, useState, useSyncExternalStore, schedule, flushSync } from './dom.js';
const siteURL = new URL(window.veloraSiteURL);
export const siteBase = siteURL.pathname.replace(/\/$/, '');
const localFile = location.protocol === 'file:';
function currentRouteURL() {
  if (localFile && location.hash.startsWith('#/')) return new URL(location.hash.slice(1), 'https://velora.local');
  return new URL(location.href);
}
export function routePath() {
  const url = currentRouteURL();
  const pathname = localFile && location.hash.startsWith('#/') ? url.pathname : url.pathname.slice(siteBase.length);
  const path = decodeURIComponent(pathname).replace(/\/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '');
  return path || '/template';
}
export function routeSearch() { return currentRouteURL().search; }
const subscribeNavigation = listener => { window.addEventListener('velora:navigate', listener); return () => window.removeEventListener('velora:navigate', listener); };
export const usePathname = () => useSyncExternalStore(subscribeNavigation, routePath);
function internal(href) { return typeof href === 'string' && href.startsWith('/') && !href.startsWith('//'); }
export function hrefFor(href) {
  if (!internal(href)) return href;
  // File URLs cannot pushState to another path. Keep the real HTML entry and
  // put the route (including dynamic record URLs and queries) in its fragment.
  return localFile ? location.href.split('#')[0].split('?')[0] + '#' + href : siteBase + href;
}
function assetHref(src) { return internal(src) ? new URL(src.slice(1), siteURL).href : src; }
export function navigate(href, replace = false) {
  const target = hrefFor(href);
  (replace ? history.replaceState : history.pushState).call(history, {}, '', target);
  window.dispatchEvent(new Event('velora:navigate')); flushSync();
  const anchor = currentRouteURL().hash.slice(1);
  const element = anchor && document.getElementById(decodeURIComponent(anchor));
  if (element) element.scrollIntoView(); else window.scrollTo(0, 0);
}
export const useRouter = () => ({ push: navigate, replace: href => navigate(href, true), back: () => history.back(), forward: () => history.forward(), refresh: schedule, prefetch: () => {} });
export function Link({ href, children, prefetch, replace, scroll, ...props }) { return createElement('a', { ...props, href: hrefFor(href) }, children); }
export function Image({ src, alt, fill, priority, unoptimized, sizes, ...props }) { return createElement('img', { ...props, alt, src: assetHref(src), ...(fill ? { style: { position: 'absolute', width: '100%', height: '100%', inset: 0, ...props.style } } : {}), ...(sizes ? { sizes } : {}) }); }
export function dynamic(loader, options = {}) {
  let loaded, promise;
  return function DeferredTemplate(props) {
    const [component, setComponent] = useState(() => loaded);
    useEffect(() => {
      let active = true;
      if (!promise) promise = loader().then(value => loaded = value.default ?? value);
      promise.then(value => { if (active) setComponent(() => value); });
      return () => { active = false; };
    }, []);
    return component ? createElement(component, props) : options.loading ? createElement(options.loading) : null;
  };
}
export function notFound() { throw new Error('VELORA_NOT_FOUND'); }
export function redirect(href) { queueMicrotask(() => navigate(href, true)); return null; }
const onHistory = () => { window.dispatchEvent(new Event('velora:navigate')); schedule(); };
window.addEventListener('popstate', onHistory);
window.addEventListener('hashchange', onHistory);
document.addEventListener('click', event => {
  const link = event.target.closest?.('a');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
  const rawHref = link.getAttribute('href');
  if (rawHref?.startsWith('#') && !rawHref.startsWith('#/')) {
    event.preventDefault();
    navigate(routePath() + routeSearch() + rawHref);
    return;
  }
  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin || !url.pathname.startsWith(siteBase + '/') || /\.(?:txt|csv|svg|png|jpg|pdf|json|zip)$/.test(url.pathname)) return;
  if (localFile) {
    event.preventDefault();
    navigate(url.hash.startsWith('#/') ? url.hash.slice(1) : decodeURIComponent(url.pathname.slice(siteBase.length)).replace(/\/index\.html$/, '') + url.search + url.hash);
    return;
  }
  if (url.pathname === location.pathname && url.hash) return;
  event.preventDefault();
  history.pushState({}, '', url.pathname + url.search + url.hash);
  window.dispatchEvent(new Event('velora:navigate')); flushSync(); window.scrollTo(0, 0);
});
