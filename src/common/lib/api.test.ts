import { beforeEach, describe, expect, it, vi } from "vitest";

type Api = typeof import("./api");
type RequestController = typeof import("./requestController");

let api: Api;
let controller: RequestController;
let assign: ReturnType<typeof vi.fn>;
let fetchMock: ReturnType<typeof vi.fn>;
let session: ReturnType<typeof createStorage>;

const abortError = () => new DOMException("Aborted", "AbortError");

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

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const hanging = (init?: RequestInit) =>
  new Promise<Response>((_resolve, reject) => {
    const signal = init?.signal;
    if (!signal) return;
    if (signal.aborted) {
      reject(abortError());
      return;
    }
    signal.addEventListener("abort", () => reject(abortError()), {
      once: true,
    });
  });

const base64url = (value: unknown) => {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const jwt = (offsetMs: number) =>
  `header.${base64url({ exp: Math.floor((Date.now() + offsetMs) / 1000) })}.signature`;

const refreshSuccess = () =>
  jsonResponse({
    isSuccess: true,
    code: 200,
    data: {
      accessToken: "fresh-access",
      refreshToken: "fresh-refresh",
      availableContexts: [{ tenantId: "tenant-1" }],
    },
  });

beforeEach(async () => {
  vi.resetModules();

  assign = vi.fn();
  fetchMock = vi.fn();

  const storage = createStorage();
  storage.setItem("workforcehub.access", "stale-token");
  storage.setItem("workforcehub.refresh", "stale-refresh");
  storage.setItem("workforcehub.language", "es");
  storage.setItem("workforcehub.tenant", "tenant-1");
  storage.setItem("i18nextLng", "es");

  session = createStorage();
  session.setItem("workforcehub.draft", "unsaved");

  const windowStub = Object.assign(new EventTarget(), {
    location: { pathname: "/dashboard", assign },
  });

  vi.stubGlobal("localStorage", storage);
  vi.stubGlobal("sessionStorage", session);
  vi.stubGlobal("window", windowStub);
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("document", { cookie: "" });

  controller = await import("./requestController");
  api = await import("./api");
});

describe("apiFetch signal wiring", () => {
  it("hands every request a signal from the central controller", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ isSuccess: true, code: 200 }));

    await api.apiFetch("/api/employees");

    const [, init] = fetchMock.mock.calls[0];
    expect(init.signal).toBeInstanceOf(AbortSignal);
    expect(init.signal.aborted).toBe(false);
  });

  it("cancels an in-flight request when the controller aborts", async () => {
    fetchMock.mockImplementation((_url: string, init: RequestInit) =>
      hanging(init),
    );

    const request = api.apiFetch("/api/employees");
    controller.abortAll({ type: "logout" });

    await expect(request).rejects.toSatisfy(controller.isAbortError);
  });

  it("keeps the caller signal working alongside the global one", async () => {
    fetchMock.mockImplementation((_url: string, init: RequestInit) =>
      hanging(init),
    );

    const caller = new AbortController();
    const request = api.apiFetch("/api/employees", {
      signal: caller.signal,
    });
    caller.abort(abortError());

    await expect(request).rejects.toSatisfy(controller.isAbortError);
    expect(controller.getSignal().aborted).toBe(false);
  });
});

describe("401 handling", () => {
  it("cancels sibling requests when the refresh fails", async () => {
    fetchMock.mockImplementation((url: string, init: RequestInit) => {
      if (url.includes("/api/auth/refresh")) {
        return Promise.resolve(jsonResponse({ isSuccess: false }, 401));
      }
      if (url.includes("/api/expired")) {
        return Promise.resolve(jsonResponse({ isSuccess: false }, 401));
      }
      return hanging(init);
    });

    const siblings = [
      api.apiFetch("/api/employees", { silentErrors: true }),
      api.apiFetch("/api/shifts", { silentErrors: true }),
      api.apiFetch("/api/zones", { silentErrors: true }),
    ];
    const settled = Promise.allSettled(siblings);

    const failing = await api.apiFetch("/api/expired", { silentErrors: true });

    expect(failing.code).toBe(401);

    const results = await settled;
    expect(
      results.every(
        (result) =>
          result.status === "rejected" && controller.isAbortError(result.reason),
      ),
    ).toBe(true);
  });

  it("tears the session down once for concurrent 401s", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ isSuccess: false }, 401));

    await Promise.all([
      api.apiFetch("/api/employees", { silentErrors: true }),
      api.apiFetch("/api/shifts", { silentErrors: true }),
      api.apiFetch("/api/zones", { silentErrors: true }),
    ]);

    expect(assign).toHaveBeenCalledTimes(1);
    expect(assign).toHaveBeenCalledWith("/login");
    expect(controller.getEpoch()).toBe(1);
    expect(controller.getState()).toBe("invalid");
  });

  it("clears stored credentials when the refresh fails", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ isSuccess: false }, 401));

    await api.apiFetch("/api/employees", { silentErrors: true });

    expect(localStorage.getItem("workforcehub.access")).toBeNull();
    expect(localStorage.getItem("workforcehub.refresh")).toBeNull();
  });

  it("retries without aborting anything when the refresh succeeds", async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url.includes("/api/auth/refresh")) {
        return Promise.resolve(refreshSuccess());
      }
      if (fetchMock.mock.calls.length <= 1) {
        return Promise.resolve(jsonResponse({ isSuccess: false }, 401));
      }
      return Promise.resolve(
        Promise.resolve(jsonResponse({ isSuccess: true, code: 200, data: [] })),
      );
    });

    const result = await api.apiFetch("/api/employees", { silentErrors: true });

    expect(result.isSuccess).toBe(true);
    expect(controller.getEpoch()).toBe(0);
    expect(controller.getState()).toBe("active");
    expect(assign).not.toHaveBeenCalled();
    expect(localStorage.getItem("workforcehub.access")).toBe("fresh-access");
  });

  it("leaves the refresh call itself outside the central controller", async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url.includes("/api/auth/refresh")) {
        return Promise.resolve(refreshSuccess());
      }
      if (fetchMock.mock.calls.length <= 1) {
        return Promise.resolve(jsonResponse({ isSuccess: false }, 401));
      }
      return Promise.resolve(jsonResponse({ isSuccess: true, code: 200 }));
    });

    await api.apiFetch("/api/employees", { silentErrors: true });

    const refreshCall = fetchMock.mock.calls.find((call) =>
      String(call[0]).includes("/api/auth/refresh"),
    );
    expect(refreshCall?.[1]?.signal).toBeUndefined();
  });
});

describe("401 on an ungated endpoint", () => {
  const rejected = () =>
    jsonResponse(
      {
        isSuccess: false,
        code: 401,
        message: "Credenciales invalidas",
        errorCode: "AUTH_BAD_CREDENTIALS",
      },
      401,
    );

  it("surfaces the server error instead of tearing the session down", async () => {
    fetchMock.mockResolvedValue(rejected());

    const result = await api.apiFetch("/api/auth/login/credentials", {
      method: "POST",
      silentErrors: true,
    });

    expect(result.errorCode).toBe("AUTH_BAD_CREDENTIALS");
    expect(result.message).toBe("Credenciales invalidas");
    expect(controller.getState()).toBe("active");
    expect(controller.getEpoch()).toBe(0);
    expect(assign).not.toHaveBeenCalled();
  });

  it("never tries to refresh on rejected credentials", async () => {
    fetchMock.mockResolvedValue(rejected());

    await api.apiFetch("/api/auth/login/credentials", {
      method: "POST",
      silentErrors: true,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("keeps an existing session usable after a failed re-login", async () => {
    fetchMock.mockResolvedValueOnce(rejected());

    await api.apiFetch("/api/auth/login/credentials", {
      method: "POST",
      silentErrors: true,
    });

    fetchMock.mockResolvedValue(
      jsonResponse({ isSuccess: true, code: 200, data: [] }),
    );
    const result = await api.apiFetch("/api/employees", { silentErrors: true });

    expect(result.isSuccess).toBe(true);
  });
});

describe("gate on an invalid session", () => {
  const invalidate = async () => {
    fetchMock.mockResolvedValue(jsonResponse({ isSuccess: false }, 401));
    await api.apiFetch("/api/employees", { silentErrors: true });
    fetchMock.mockClear();
  };

  it("blocks new calls without touching the network", async () => {
    await invalidate();

    const result = await api.apiFetch("/api/shifts", { silentErrors: true });

    expect(result.code).toBe(401);
    expect(result.errorCode).toBe("AUTH_UNAUTHORIZED");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("still lets the user log back in", async () => {
    await invalidate();
    fetchMock.mockResolvedValue(
      jsonResponse({ isSuccess: true, code: 200, data: { ok: true } }),
    );

    const result = await api.apiFetch("/api/auth/login/credentials", {
      method: "POST",
      silentErrors: true,
    });

    expect(result.isSuccess).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("waits for an in-flight refresh instead of firing with a dead token", async () => {
    let releaseRefresh: (value: Response) => void = () => {};
    const refreshHeld = new Promise<Response>((resolve) => {
      releaseRefresh = resolve;
    });

    fetchMock.mockImplementation((url: string) => {
      if (url.includes("/api/auth/refresh")) return refreshHeld;
      if (fetchMock.mock.calls.length <= 1) {
        return Promise.resolve(jsonResponse({ isSuccess: false }, 401));
      }
      return Promise.resolve(jsonResponse({ isSuccess: true, code: 200 }));
    });

    const first = api.apiFetch("/api/employees", { silentErrors: true });
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    const late = api.apiFetch("/api/shifts", { silentErrors: true });
    await Promise.resolve();

    expect(fetchMock).toHaveBeenCalledTimes(2);

    releaseRefresh(refreshSuccess());
    await Promise.all([first, late]);

    const lateCall = fetchMock.mock.calls.find((call) =>
      String(call[0]).includes("/api/shifts"),
    );
    expect(lateCall?.[1]?.headers.get("Authorization")).toBe(
      "Bearer fresh-access",
    );
  });
});

describe("session wipe", () => {
  it("removes every workforcehub key except the language preference", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ isSuccess: false }, 401));

    await api.apiFetch("/api/employees", { silentErrors: true });

    expect(localStorage.getItem("workforcehub.access")).toBeNull();
    expect(localStorage.getItem("workforcehub.refresh")).toBeNull();
    expect(localStorage.getItem("workforcehub.context")).toBeNull();
    expect(localStorage.getItem("workforcehub.tenant")).toBeNull();
    expect(localStorage.getItem("workforcehub.payroll.column_names")).toBeNull();
    expect(localStorage.getItem("workforcehub.language")).toBe("es");
    expect(localStorage.getItem("i18nextLng")).toBe("es");
  });

  it("empties sessionStorage", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ isSuccess: false }, 401));

    await api.apiFetch("/api/employees", { silentErrors: true });

    expect(session.length).toBe(0);
  });

  it("expires readable cookies", async () => {
    const written: string[] = [];
    vi.stubGlobal("document", {
      get cookie() {
        return "sid=abc; theme=dark";
      },
      set cookie(value: string) {
        written.push(value);
      },
    });
    fetchMock.mockResolvedValue(jsonResponse({ isSuccess: false }, 401));

    await api.apiFetch("/api/employees", { silentErrors: true });

    expect(written).toHaveLength(2);
    expect(written[0]).toContain("sid=;");
    expect(written[0]).toContain("expires=Thu, 01 Jan 1970");
    expect(written[1]).toContain("theme=;");
  });
});

describe("pre-emptive refresh", () => {
  const expiringSession = () => {
    localStorage.setItem("workforcehub.access", jwt(5_000));
  };

  const routed = (dataResponse: () => Response) => (url: string) =>
    Promise.resolve(
      url.includes("/api/auth/refresh") ? refreshSuccess() : dataResponse(),
    );

  it("refreshes before firing when the access token is about to expire", async () => {
    expiringSession();
    fetchMock.mockImplementation(
      routed(() => jsonResponse({ isSuccess: true, code: 200, data: [] })),
    );

    const result = await api.apiFetch("/api/employees", {
      silentErrors: true,
    });

    expect(result.isSuccess).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[0][0])).toContain("/api/auth/refresh");

    const dataCall = fetchMock.mock.calls[1];
    expect(String(dataCall[0])).toContain("/api/employees");
    expect(dataCall[1].headers.get("Authorization")).toBe("Bearer fresh-access");
  });

  it("leaves a healthy token alone", async () => {
    localStorage.setItem("workforcehub.access", jwt(600_000));
    fetchMock.mockResolvedValue(jsonResponse({ isSuccess: true, code: 200 }));

    await api.apiFetch("/api/employees", { silentErrors: true });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toContain("/api/employees");
  });

  it("holds the session in the refreshing state while the call is open", async () => {
    expiringSession();
    let releaseRefresh: (value: Response) => void = () => {};
    const refreshHeld = new Promise<Response>((resolve) => {
      releaseRefresh = resolve;
    });

    fetchMock.mockImplementation((url: string) =>
      url.includes("/api/auth/refresh")
        ? refreshHeld
        : Promise.resolve(jsonResponse({ isSuccess: true, code: 200 })),
    );

    const request = api.apiFetch("/api/employees", { silentErrors: true });
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    expect(controller.getState()).toBe("refreshing");

    releaseRefresh(refreshSuccess());
    await request;

    expect(controller.getState()).toBe("active");
  });

  it("refreshes once for a burst of expiring requests", async () => {
    expiringSession();
    fetchMock.mockImplementation(
      routed(() => jsonResponse({ isSuccess: true, code: 200 })),
    );

    await Promise.all([
      api.apiFetch("/api/employees", { silentErrors: true }),
      api.apiFetch("/api/shifts", { silentErrors: true }),
      api.apiFetch("/api/zones", { silentErrors: true }),
    ]);

    const refreshCalls = fetchMock.mock.calls.filter((call) =>
      String(call[0]).includes("/api/auth/refresh"),
    );
    expect(refreshCalls).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it("blocks the request when the pre-emptive refresh fails", async () => {
    expiringSession();
    fetchMock.mockImplementation((url: string) =>
      Promise.resolve(
        url.includes("/api/auth/refresh")
          ? jsonResponse({ isSuccess: false }, 401)
          : jsonResponse({ isSuccess: true, code: 200 }),
      ),
    );

    const result = await api.apiFetch("/api/employees", { silentErrors: true });

    expect(result.code).toBe(401);
    expect(controller.getState()).toBe("invalid");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(assign).toHaveBeenCalledWith("/login");
  });

  it("never pre-refreshes an ungated call", async () => {
    expiringSession();
    fetchMock.mockResolvedValue(jsonResponse({ isSuccess: true, code: 200 }));

    await api.apiFetch("/api/auth/login/credentials", {
      method: "POST",
      silentErrors: true,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toContain("/api/auth/login");
  });
});

describe("session state", () => {
  it("returns to active once new tokens are stored", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ isSuccess: false }, 401));
    await api.apiFetch("/api/employees", { silentErrors: true });
    expect(controller.getState()).toBe("invalid");

    const auth = await import("./auth");
    auth.setTokens("new-access", "new-refresh");

    expect(controller.getState()).toBe("active");
  });
});
