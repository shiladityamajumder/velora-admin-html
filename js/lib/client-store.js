import { createElement, Fragment } from '../runtime/dom.js';
import { serializeCsv } from "./csv.js";
export { parseCsv } from "./csv.js";
import {
  useCallback,
  useMemo,
  useSyncExternalStore
} from "../runtime/dom.js";
const memory = new Map();
const eventName = "nexa-storage-change";
function subscribe(listener) {
  const onStorage = (event) => {
    if (event.key) memory.delete(event.key);
    else memory.clear();
    listener();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(eventName, listener);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(eventName, listener);
  };
}
function read(key, fallback) {
  try {
    return memory.get(key) ?? localStorage.getItem(key) ?? fallback;
  } catch {
    return memory.get(key) ?? fallback;
  }
}
export function setPreference(key, value) {
  memory.set(key, value);
  try {
    localStorage.setItem(key, value);
  } catch {
  }
  window.dispatchEvent(new Event(eventName));
}
export function usePreference(key, initial, allowed) {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => read(key, initial),
    () => initial
  );
  const value = allowed.includes(snapshot) ? snapshot : initial;
  const setValue = useCallback((next) => setPreference(key, next), [key]);
  const readValue = useCallback(() => {
    const current = read(key, initial);
    return allowed.includes(current) ? current : initial;
  }, [key, initial, allowed]);
  return [value, setValue, readValue];
}
export function usePersistentState(key, initial) {
  const storageKey = `nexa-data-v1:${key}`;
  const fallback = JSON.stringify(initial);
  const getSnapshot = useCallback(
    () => read(storageKey, fallback),
    [storageKey, fallback]
  );
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => fallback);
  const value = useMemo(() => {
    try {
      return JSON.parse(snapshot);
    } catch {
      return JSON.parse(fallback);
    }
  }, [snapshot, fallback]);
  const setValue = useCallback(
    (next) => {
      let current;
      try {
        current = JSON.parse(read(storageKey, fallback));
      } catch {
        current = JSON.parse(fallback);
      }
      const updated = typeof next === "function" ? next(current) : next;
      setPreference(storageKey, JSON.stringify(updated));
    },
    [storageKey, fallback]
  );
  return [value, setValue];
}
export function downloadText(filename, text, mime = "text/plain;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
export function exportCsv(filename, headers, rows) {
  downloadText(filename, serializeCsv(headers, rows), "text/csv;charset=utf-8");
}
export function resetDemoData() {
  const prefixes = ["nexa-data-v1:", "nexa-demo-v2:"];
  try {
    Object.keys(localStorage).filter((key) => prefixes.some((prefix) => key.startsWith(prefix))).forEach((key) => localStorage.removeItem(key));
  } catch {
  }
  for (const key of memory.keys())
    if (prefixes.some((prefix) => key.startsWith(prefix))) memory.delete(key);
  window.dispatchEvent(new Event(eventName));
  window.dispatchEvent(new Event("nexa-reset-demo"));
}
