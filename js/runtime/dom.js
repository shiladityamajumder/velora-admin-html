/** Small DOM template renderer. Native elements, event listeners and local state; no React runtime. */
export const version = '19.0.0';
export const Fragment = Symbol.for('react.fragment');
const elementType = Symbol.for('react.transitional.element');
const instances = new Map(), typeIds = new WeakMap();
let current, cursor = 0, nextId = 0, root, rootTemplate, previous = [], pending = false;
let effects = [], alive = new Set(), portals = [], oldPortals = new Map();
const same = (a, b) => a && b && a.length === b.length && a.every((x, i) => Object.is(x, b[i]));
const flatten = children => children == null || typeof children === 'boolean' ? [] : Array.isArray(children) ? children.flatMap(flatten) : [children];
export function createElement(type, props, ...children) {
  props = { ...type?.defaultProps, ...props };
  if (children.length) props.children = children.length === 1 ? children[0] : children;
  return { $$typeof: elementType, type, props, key: props.key == null ? null : String(props.key), ref: props.ref ?? null };
}
export const h = createElement;
export const jsx = (type, props, key) => createElement(type, { ...props, ...(key == null ? {} : { key }) });
export const jsxs = jsx;
export const jsxDEV = jsx;
export const isValidElement = value => !!value && value.$$typeof === elementType;
export function cloneElement(value, props, ...children) { return createElement(value.type, { ...value.props, ...props }, ...(children.length ? children : [value.props.children])); }
export const Children = {
  toArray: flatten, count: x => flatten(x).length,
  map: (x, fn) => flatten(x).flatMap((item, i) => flatten(fn(item, i))),
  forEach: (x, fn) => flatten(x).forEach(fn),
  only: x => { const a = flatten(x); if (a.length !== 1) throw new Error('Expected one child'); return a[0]; },
};
export function createContext(value) {
  const context = { value, $$typeof: Symbol.for('react.context') };
  context.Provider = { context, provider: true };
  context.Consumer = { context, consumer: true };
  return context;
}
export const useContext = context => { if (current) { current.contexts ??= new Map(); current.contexts.set(context, context.value); } return context.value; };
function slot(init) { const index = cursor++; return current.hooks[index] ?? (current.hooks[index] = init()); }
export function useState(initial) {
  const owner = current;
  const item = slot(() => {
    const item = { value: typeof initial === 'function' ? initial() : initial };
    item.set = update => {
      const value = typeof update === 'function' ? update(item.value) : update;
      if (!Object.is(value, item.value)) { item.value = value; if (instances.has(owner.path)) { owner.dirty = true; schedule(); } }
    };
    return item;
  });
  return [item.value, item.set];
}
export function useReducer(reducer, initial, init) { const [state, update] = useState(() => init ? init(initial) : initial); return [state, action => update(previous => reducer(previous, action))]; }
export const useRef = initial => slot(() => ({ current: initial }));
export function useMemo(factory, deps) { const item = slot(() => ({})); if (!same(item.deps, deps)) { item.value = factory(); item.deps = deps; } return item.value; }
export const useCallback = (fn, deps) => useMemo(() => fn, deps);
export function useEffect(effect, deps) {
  const item = slot(() => ({}));
  if (!same(item.deps, deps)) { item.deps = deps; effects.push(() => { item.cleanup?.(); item.cleanup = effect(); }); }
}
export const useLayoutEffect = useEffect;
export const useInsertionEffect = useEffect;
export function useSyncExternalStore(subscribe, getSnapshot) {
  const owner = current;
  const item = useRef({ snapshot: getSnapshot(), getSnapshot });
  item.current.getSnapshot = getSnapshot;
  item.current.snapshot = getSnapshot();
  useEffect(() => {
    const check = () => { const value = item.current.getSnapshot(); if (!Object.is(value, item.current.snapshot)) { item.current.snapshot = value; owner.dirty = true; schedule(); } };
    const stop = subscribe(check); check(); return stop;
  }, [subscribe]);
  return item.current.snapshot;
}
export const useId = () => slot(() => `velora-${++nextId}`);
export const useDebugValue = () => {};
export const useDeferredValue = x => x;
export const startTransition = fn => fn();
export const useTransition = () => [false, startTransition];
export function useImperativeHandle(ref, factory, deps) { useLayoutEffect(() => { setRef(ref, factory()); return () => setRef(ref, null); }, deps); }
export function forwardRef(render) { const component = ({ ref, ...props }) => render(props, ref ?? null); component.render = render; return component; }
export const memo = component => { component.__memo = true; return component; };
const shallowEqual = (a,b) => a === b || !!a && !!b && Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(k => Object.is(a[k], b[k]));
export const StrictMode = Fragment;
export const Suspense = props => props.children;
export function createRef() { return { current: null }; }
export class Component {
  constructor(props) { this.props = props; this.state = {}; }
  setState(value, done) { this.state = { ...this.state, ...(typeof value === 'function' ? value(this.state, this.props) : value) }; schedule(); if (done) queueMicrotask(done); }
  forceUpdate(done) { schedule(); if (done) queueMicrotask(done); }
}
Component.prototype.isReactComponent = {};
export class PureComponent extends Component {}
export function createPortal(children, target, key) { return { portal: true, children, target, key }; }
export const flushSync = fn => { fn?.(); if (root) draw(); };
function typeId(type) { if (!typeIds.has(type)) typeIds.set(type, ++nextId); return typeIds.get(type); }
function resolve(value, path, force = false) {
  if (value == null || typeof value === 'boolean') return [];
  if (Array.isArray(value)) return value.flatMap((child, i) => resolve(child, `${path}/${child?.key != null ? 'k:' + child.key : i}`, force));
  if (typeof value === 'string' || typeof value === 'number') return [{ type: '#text', text: String(value), identity: path }];
  if (value.portal) {
    if (value.target) portals.push({ path, target: value.target, children: resolve(value.children, path + '/portal', force) });
    return [];
  }
  const { type, props = {} } = value;
  if (type === Fragment) return resolve(props.children, path + '/fragment', force);
  if (type?.provider || type?.consumer || type?.$$typeof === Symbol.for('react.context')) {
    const context = type.context ?? type;
    if (type.consumer) return resolve(props.children(context.value), path + '/consumer', force);
    const before = context.value; context.value = props.value;
    const result = resolve(props.children, path + '/provider', force); context.value = before; return result;
  }
  if (typeof type === 'function') {
    const id = `${path}:c${typeId(type)}`;
    let instance = instances.get(id);
    if (!instance) { instance = { path: id, name: type.displayName ?? type.name, hooks: [] }; instances.set(id, instance); }
    alive.add(id);
    const previousCurrent = current, previousCursor = cursor;
    current = instance; cursor = 0;
    let result, rendered = true;
    if (type.prototype?.render) {
      const fresh = !instance.component;
      const component = instance.component ?? (instance.component = new type(props));
      const oldProps = component.props, oldState = component.state;
      component.props = props;
      if (type.contextType) component.context = type.contextType.value;
      if (type.getDerivedStateFromProps) component.state = { ...component.state, ...type.getDerivedStateFromProps(props, component.state) };
      result = component.render();
      effects.push(() => { if (fresh) component.componentDidMount?.(); else component.componentDidUpdate?.(oldProps, oldState); });
      setRef(props.ref, component);
    } else if (instance.output !== undefined && (!force || type.__memo) && !instance.dirty && shallowEqual(instance.props, props) && [...(instance.contexts ?? [])].every(([context,value]) => Object.is(context.value,value))) { result = instance.output; rendered = false; }
    else { instance.dirty = false; instance.contexts = new Map(); result = type(props); instance.output = result; instance.props = props; }
    current = previousCurrent; cursor = previousCursor;
    return resolve(result, id + '/result', rendered);
  }
  if (typeof type !== 'string') throw new Error(`Unsupported template: ${String(type)}`);
  return [{ type, props, identity: path, children: resolve(props.children, path + '/children', force) }];
}
const svgNames = new Set(['viewBox', 'preserveAspectRatio', 'gradientUnits', 'gradientTransform', 'pathLength', 'markerWidth', 'markerHeight', 'refX', 'refY', 'textLength', 'lengthAdjust', 'patternUnits', 'patternTransform', 'clipPathUnits']);
const unitless = new Set(['opacity','zIndex','fontWeight','lineHeight','flex','flexGrow','flexShrink','order','gridRow','gridColumn','fillOpacity','strokeOpacity','strokeWidth','strokeDashoffset','scale','aspectRatio','animationIterationCount','zoom']);
function setRef(ref, value) { if (typeof ref === 'function') ref(value); else if (ref) ref.current = value; }
function propsToDOM(node, before, after, svg) {
  for (const name of new Set([...Object.keys(before), ...Object.keys(after)])) {
    const value = after[name], old = before[name];
    if (['children','key','ref','suppressHydrationWarning','suppressContentEditableWarning'].includes(name)) continue;
    if (name === 'style') {
      for (const key of new Set([...Object.keys(old ?? {}), ...Object.keys(value ?? {})])) {
        const v = value?.[key];
        const text = v == null ? '' : typeof v === 'number' && v !== 0 && !unitless.has(key) && !key.startsWith('--') ? `${v}px` : String(v);
        if (key.startsWith('--')) node.style.setProperty(key, text); else node.style[key] = text;
      }
    } else if (name.startsWith('on') && (typeof value === 'function' || typeof old === 'function')) {
      let event = name.slice(2).toLowerCase(), capture = false;
      if (event.endsWith('capture')) { event = event.slice(0, -7); capture = true; }
      if (event === 'doubleclick') event = 'dblclick';
      if (event === 'change' && ['INPUT','TEXTAREA'].includes(node.tagName) && !['checkbox','radio','file'].includes(node.type)) event = 'input';
      if (event === 'mouseenter') event = 'mouseenter';
      if (event === 'focus') event = 'focusin';
      if (event === 'blur') event = 'focusout';
      node.__listeners ??= {};
      const k = `${event}:${capture}`;
      if (!node.__listeners[k] && value) {
        const wrapper = e => { e.nativeEvent = e; e.persist = () => {}; node.__handlers[k]?.(e); };
        node.__listeners[k] = wrapper; node.addEventListener(event, wrapper, capture);
      }
      node.__handlers ??= {}; node.__handlers[k] = value;
    } else if (name === 'dangerouslySetInnerHTML') {
      if (value?.__html !== old?.__html) node.innerHTML = value?.__html ?? '';
    } else if (name === 'value' && !svg && ['INPUT','TEXTAREA','SELECT'].includes(node.tagName)) {
      if (value != null && node.value !== String(value) && node.type !== 'file') node.value = value;
    } else if (name === 'defaultValue') {
      if (old === undefined && value != null && node.type !== 'file') node.value = value;
    } else if (name === 'checked' || name === 'defaultChecked') {
      if (value != null && (name === 'checked' || old === undefined)) node.checked = value;
    } else {
      let attr = name === 'className' ? 'class' : name === 'htmlFor' ? 'for' : name === 'tabIndex' ? 'tabindex' : name;
      if (svg && !svgNames.has(attr) && !attr.startsWith('aria-') && !attr.startsWith('data-')) attr = attr.replace(/[A-Z]/g, c => '-' + c.toLowerCase());
      if (value == null || (value === false && !attr.startsWith('aria-') && !attr.startsWith('data-'))) node.removeAttribute(attr);
      else if (typeof value !== 'function' && typeof value !== 'object') node.setAttribute(attr, value === true && !attr.startsWith('aria-') && !attr.startsWith('data-') ? '' : String(value));
    }
  }
}
function removeTree(item) { if (item.props?.ref) setRef(item.props.ref, null); item.children?.forEach(removeTree); item.node?.remove(); }
function patchChildren(parent, before, after, svg = false) {
  const byIdentity = new Map(before.map(item => [item.identity, item]));
  let anchor = before[0]?.node ?? null;
  for (const item of after) {
    let old = byIdentity.get(item.identity);
    byIdentity.delete(item.identity);
    if (old && old.type !== item.type) { const next = old.node.nextSibling; removeTree(old); old = null; if (anchor && !anchor.parentNode) anchor = next; }
    const inSVG = item.type === 'svg' || svg;
    const node = old?.node ?? (item.type === '#text' ? document.createTextNode(item.text) : inSVG ? document.createElementNS('http://www.w3.org/2000/svg', item.type) : document.createElement(item.type));
    item.node = node;
    if (node !== anchor) parent.insertBefore(node, anchor?.parentNode === parent ? anchor : null);
    if (item.type === '#text') { if (node.nodeValue !== item.text) node.nodeValue = item.text; }
    else {
      propsToDOM(node, old?.props ?? {}, item.props, inSVG);
      if (!item.props.dangerouslySetInnerHTML) patchChildren(node, old?.children ?? [], item.children, inSVG && item.type !== 'foreignObject');
      if (item.type === 'select' && item.props.value != null) node.value = item.props.value;
      if (old?.props.ref !== item.props.ref) { setRef(old?.props.ref, null); setRef(item.props.ref, node); }
    }
    anchor = node.nextSibling;
  }
  for (const unused of byIdentity.values()) removeTree(unused);
}
export function schedule() { if (!pending) { pending = true; requestAnimationFrame(draw); } }
function draw() {
  pending = false; alive = new Set(); effects = []; portals = [];
  const resolved = resolve(rootTemplate(), 'root');
  patchChildren(root, previous, resolved); previous = resolved;
  const nextPortals = new Map();
  for (const portal of portals) {
    const old = oldPortals.get(portal.path);
    if (old && old.target !== portal.target) old.children.forEach(removeTree);
    patchChildren(portal.target, old?.target === portal.target ? old.children : [], portal.children, portal.target.namespaceURI === 'http://www.w3.org/2000/svg');
    nextPortals.set(portal.path, portal);
  }
  for (const [path, old] of oldPortals) if (!nextPortals.has(path)) old.children.forEach(removeTree);
  oldPortals = nextPortals;
  for (const [path, instance] of instances) if (!alive.has(path)) { instance.hooks.forEach(hook => hook.cleanup?.()); instance.component?.componentWillUnmount?.(); instances.delete(path); }
  const queue = effects; effects = []; queue.forEach(fn => fn());
  window.dispatchEvent(new Event('velora:render'));
}
export function mount(target, template) { root = target; rootTemplate = template; root.replaceChildren(); previous = []; draw(); }
export const __DOM_INTERNALS = { schedule, instances };
export default { version, createElement, cloneElement, isValidElement, Children, Fragment, createContext, useContext, useState, useReducer, useRef, useMemo, useCallback, useEffect, useLayoutEffect, useInsertionEffect, useSyncExternalStore, useId, useDebugValue, useDeferredValue, startTransition, useTransition, useImperativeHandle, forwardRef, memo, StrictMode, Suspense, createRef, Component, PureComponent };
