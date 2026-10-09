import { beforeEach, describe, expect, it, vi } from "vitest";

type Auth = typeof import("./auth");
type RequestController = typeof import("./requestController");

let auth: Auth;
let controller: RequestController;
let session: ReturnType<typeof createStorage>;

const createStorage = () => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, String(value)),
    removeItem: (key: string) => void store.delete(key),
    clear: () => store.clear(),
    key: (index: number) => [...store.keys()][index] ?? null,
    get length() {
      return store.size;
    },
  };
};

const inFlight = (signal: AbortSignal) =>
  new Promise<never>((_resolve, reject) => {
    signal.addEventListener(
      "abort",
      () => reject(new DOMException("Aborted", "AbortError")),
      { once: true },
    );
  });

const base64url = (value: unknown) => {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  const binary = String.fromCharCode(...bytes);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const jwt = (payload: unknown) => `header.${base64url(payload)}.signature`;

const inSeconds = (offsetMs: number) =>
  Math.floor((Date.now() + offsetMs) / 1000);

beforeEach(async () => {
  vi.resetModules();

  const storage = createStorage();
  storage.setItem("workforcehub.access", "stale-token");
  storage.setItem("workforcehub.refresh", "stale-refresh");
  storage.setItem("workforcehub.language", "es");

  session = createStorage();
  session.setItem("workforcehub.draft", "unsaved");

  vi.stubGlobal("localStorage", storage);
  vi.stubGlobal("sessionStorage", session);
  vi.stubGlobal("window", new EventTarget());
  vi.stubGlobal("document", { cookie: "" });

  controller = await import("./requestController");
  auth = await import("./auth");
});

describe("endSession", () => {
  it("cancels in-flight requests with the logout reason", async () => {
    const signal = controller.getSignal();
    const requests = Array.from({ length: 3 }, () => inFlight(signal));
    const settled = Promise.allSettled(requests);

    auth.endSession();

    const results = await settled;
    expect(
      results.every(
        (result) =>
          result.status === "rejected" && controller.isAbortError(result.reason),
      ),
    ).toBe(true);
    expect(signal.reason).toEqual({ type: "logout" });
  });

  it("marks the session invalid so later calls are gated", () => {
    auth.endSession();

    expect(controller.getState()).toBe("invalid");
  });

  it("wipes stored credentials", () => {
    auth.endSession();

    expect(localStorage.getItem("workforcehub.access")).toBeNull();
    expect(localStorage.getItem("workforcehub.refresh")).toBeNull();
    expect(localStorage.getItem("workforcehub.language")).toBe("es");
    expect(session.length).toBe(0);
  });

  it("lets a fresh login take over", () => {
    auth.endSession();

    auth.setTokens("new-access", "new-refresh");

    expect(controller.getState()).toBe("active");
    expect(controller.getSignal().aborted).toBe(false);
  });
});

describe("isTokenExpiring", () => {
  it("reports a token that already expired", () => {
    expect(auth.isTokenExpiring(jwt({ exp: inSeconds(-60_000) }))).toBe(true);
  });

  it("reports a token inside the 30s skew window", () => {
    expect(auth.isTokenExpiring(jwt({ exp: inSeconds(10_000) }))).toBe(true);
  });

  it("leaves a token with plenty of life alone", () => {
    expect(auth.isTokenExpiring(jwt({ exp: inSeconds(600_000) }))).toBe(false);
  });

  it("decodes payloads carrying non-ascii claims", () => {
    const token = jwt({ exp: inSeconds(-1_000), name: "Yordy Muñoz Peña" });

    expect(auth.isTokenExpiring(token)).toBe(true);
  });

  it("decodes payloads whose base64url length needs padding", () => {
    const token = jwt({ exp: inSeconds(-1_000), a: "b" });

    expect(auth.isTokenExpiring(token)).toBe(true);
  });

  it("stays out of the way when it cannot read an expiry", () => {
    expect(auth.isTokenExpiring(null)).toBe(false);
    expect(auth.isTokenExpiring("")).toBe(false);
    expect(auth.isTokenExpiring("opaque-token")).toBe(false);
    expect(auth.isTokenExpiring("header..signature")).toBe(false);
    expect(auth.isTokenExpiring("header.%%%.signature")).toBe(false);
    expect(auth.isTokenExpiring(jwt({ sub: "user-1" }))).toBe(false);
    expect(auth.isTokenExpiring(jwt({ exp: "soon" }))).toBe(false);
  });
});
