import { createId } from "../lib/id.js";
const memory = new Map();
const eventName = "nexa-repository-change";
export function readDemo(key, seed) {
  if (typeof window === "undefined") return seed;
  const storageKey = "nexa-demo-v2:" + key;
  try {
    const raw = memory.get(storageKey) ?? localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : seed;
  } catch {
    return seed;
  }
}
export function writeDemo(key, value) {
  if (typeof window === "undefined")
    throw new Error("Demo mutations require a browser");
  const storageKey = "nexa-demo-v2:" + key;
  const raw = JSON.stringify(value);
  memory.set(storageKey, raw);
  try {
    localStorage.setItem(storageKey, raw);
  } catch {
  }
  window.dispatchEvent(new Event(eventName));
}
export function subscribeDemo(listener) {
  const onStorage = () => {
    memory.clear();
    listener();
  };
  const onChange = () => listener();
  window.addEventListener("storage", onStorage);
  window.addEventListener(eventName, onChange);
  window.addEventListener("nexa-reset-demo", onStorage);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(eventName, onChange);
    window.removeEventListener("nexa-reset-demo", onStorage);
  };
}
export function filterRecords(rows, query = {}) {
  const filtered = rows.filter(
    (row) => (!query.status || row.status === query.status) && (!query.search || Object.values(row).join(" ").toLowerCase().includes(query.search.toLowerCase()))
  );
  const start = Math.max(0, query.page ?? 0) * (query.pageSize ?? filtered.length);
  return {
    data: filtered.slice(start, start + (query.pageSize ?? filtered.length)),
    total: filtered.length
  };
}
export function recordActivity(module, resource, action, details) {
  const timestamp = (new Date()).toISOString();
  let actor = "Demo user";
  try {
    const session = JSON.parse(
      localStorage.getItem("nexa-data-v1:enterprise-session") ?? "null"
    );
    actor = session?.name ?? actor;
  } catch {
  }
  const entry = {
    id: createId(),
    timestamp,
    actor,
    action,
    module,
    resource,
    details
  };
  writeDemo(
    "audit",
    [entry, ...readDemo("audit", [])].slice(0, 500)
  );
  const activity = {
    id: entry.id,
    timestamp,
    actor,
    text: details
  };
  writeDemo("activity:" + module + ":" + resource, [
    ...readDemo("activity:" + module + ":" + resource, []),
    activity
  ]);
}
export class MockRepository {
  constructor(key, seed, validate) {
    this.key = key;
    this.seed = seed;
    this.validate = validate;
  }
  key;
  seed;
  validate;
  async list(query) {
    return filterRecords(readDemo(this.key, this.seed), query);
  }
  async getById(id) {
    const row = readDemo(this.key, this.seed).find((row2) => row2.id === id);
    if (!row) throw new Error("Record not found");
    return row;
  }
  async create(input) {
    const row = this.validate({
      ...input,
      id: createId(),
      createdAt: (new Date()).toISOString()
    });
    writeDemo(this.key, [row, ...readDemo(this.key, this.seed)]);
    recordActivity(this.key, row.id, "Created", "Created " + row.name);
    return row;
  }
  async update(id, changes) {
    const previous = await this.getById(id);
    const row = this.validate({
      ...previous,
      ...changes,
      id: previous.id,
      createdAt: previous.createdAt
    });
    writeDemo(
      this.key,
      readDemo(this.key, this.seed).map(
        (item) => item.id === id ? row : item
      )
    );
    recordActivity(
      this.key,
      id,
      "Updated",
      "Updated " + row.name + ": " + row.status
    );
    return row;
  }
  async delete(id) {
    const row = await this.getById(id);
    writeDemo(
      this.key,
      readDemo(this.key, this.seed).filter((item) => item.id !== id)
    );
    recordActivity(this.key, id, "Deleted", "Deleted " + row.name);
  }
  subscribe = subscribeDemo;
}
