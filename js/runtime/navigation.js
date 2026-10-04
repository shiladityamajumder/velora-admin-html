import { createElement, useEffect, useState, useSyncExternalStore, schedule, flushSync } from './dom.js';
export const siteBase = new URL('../../', import.meta.url).pathname.replace(/\/$/, '');
export function routePath() {
  let path = decodeURIComponent(location.pathname).slice(siteBase.length).replace(/\/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '');
  return path || '/template';
}
const subscribeNavigation = listener => { window.addEventListener('velora:navigate', listener); return () => window.removeEventListener('velora:navigate', listener); };
export const usePathname = () => useSyncExternalStore(subscribeNavigation, routePath);
export function hrefFor(href) { return typeof href === 'string' && href.startsWith('/') && !href.startsWith('//') ? siteBase + href : href; }
export function navigate(href, replace = false) {
  const target = hrefFor(href);
  (replace ? history.replaceState : history.pushState).call(history, {}, '', target);
  window.dispatchEvent(new Event('velora:navigate')); flushSync(); window.scrollTo(0, 0);
}
export const useRouter = () => ({ push: navigate, replace: href => navigate(href, true), back: () => history.back(), forward: () => history.forward(), refresh: schedule, prefetch: () => {} });
export function Link({ href, children, prefetch, replace, scroll, ...props }) { return createElement('a', { ...props, href: hrefFor(href) }, children); }
export function Image({ src, alt, fill, priority, unoptimized, sizes, ...props }) { return createElement('img', { ...props, alt, src: hrefFor(src), ...(fill ? { style: { position: 'absolute', width: '100%', height: '100%', inset: 0, ...props.style } } : {}), ...(sizes ? { sizes } : {}) }); }
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
window.addEventListener('popstate', () => { window.dispatchEvent(new Event('velora:navigate')); schedule(); });
document.addEventListener('click', event => {
  const link = event.target.closest?.('a');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin || !url.pathname.startsWith(siteBase + '/') || /\.(?:txt|csv|svg|png|jpg|pdf|json|zip)$/.test(url.pathname)) return;
  if (url.pathname === location.pathname && url.hash) return;
  event.preventDefault();
  history.pushState({}, '', url.pathname + url.search + url.hash);
  window.dispatchEvent(new Event('velora:navigate')); flushSync(); window.scrollTo(0, 0);
});
