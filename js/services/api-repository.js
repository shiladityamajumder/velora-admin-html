export class ApiRepository {
  constructor(endpoint, decode, fetcher = fetch) {
    this.endpoint = endpoint;
    this.decode = decode;
    this.fetcher = fetcher;
  }
  endpoint;
  decode;
  fetcher;
  listeners = new Set();
  async request(path, init) {
    const response = await this.fetcher(this.endpoint + path, {
      ...init,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...init?.headers }
    });
    if (!response.ok)
      throw new Error(`API request failed (${response.status})`);
    return response.status === 204 ? void 0 : response.json();
  }
  async list(query = {}) {
    const params = new URLSearchParams(
      Object.entries(query).filter(([, value]) => value !== void 0).map(([key, value]) => [key, String(value)])
    );
    const payload = await this.request(
      params.size ? "?" + params.toString() : ""
    );
    if (!payload || typeof payload !== "object" || !("data" in payload) || !Array.isArray(payload.data) || !("total" in payload) || typeof payload.total !== "number")
      throw new Error("Invalid API list response");
    return { data: payload.data.map(this.decode), total: payload.total };
  }
  async getById(id) {
    return this.decode(await this.request("/" + encodeURIComponent(id)));
  }
  async create(input) {
    const row = this.decode(
      await this.request("", { method: "POST", body: JSON.stringify(input) })
    );
    this.publish();
    return row;
  }
  async update(id, input) {
    const row = this.decode(
      await this.request("/" + encodeURIComponent(id), {
        method: "PATCH",
        body: JSON.stringify(input)
      })
    );
    this.publish();
    return row;
  }
  async delete(id) {
    await this.request("/" + encodeURIComponent(id), { method: "DELETE" });
    this.publish();
  }
  subscribe = (listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  publish() {
    for (const listener of this.listeners) listener();
  }
}
