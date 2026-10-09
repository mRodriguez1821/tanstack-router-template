import { beforeEach, describe, expect, it, vi } from "vitest";

type RequestController = typeof import("./requestController");

let controller: RequestController;

const abortError = () => new DOMException("Aborted", "AbortError");

const inFlight = (signal: AbortSignal) =>
  new Promise<never>((_resolve, reject) => {
    if (signal.aborted) {
      reject(abortError());
      return;
    }
    signal.addEventListener("abort", () => reject(abortError()), {
      once: true,
    });
  });

beforeEach(async () => {
  vi.resetModules();
  controller = await import("./requestController");
});

describe("abortAll", () => {
  it("cancels every in-flight request with a single call", async () => {
    const requests = Array.from({ length: 8 }, () =>
      inFlight(controller.getSignal()),
    );
    const settled = Promise.allSettled(requests);

    controller.abortAll({ type: "unauthorized" });

    const results = await settled;
    expect(results).toHaveLength(8);
    expect(
      results.every(
        (result) =>
          result.status === "rejected" && controller.isAbortError(result.reason),
      ),
    ).toBe(true);
  });

  it("renews the controller so later requests are not born cancelled", () => {
    const before = controller.getSignal();

    controller.abortAll({ type: "logout" });

    const after = controller.getSignal();
    expect(before.aborted).toBe(true);
    expect(after.aborted).toBe(false);
    expect(after).not.toBe(before);
  });

  it("propagates the abort reason to the dying signal", () => {
    const signal = controller.getSignal();

    controller.abortAll({ type: "unauthorized" });

    expect(signal.reason).toEqual({ type: "unauthorized" });
  });

  it("bumps the epoch on every call", () => {
    expect(controller.getEpoch()).toBe(0);

    controller.abortAll({ type: "unauthorized" });
    controller.abortAll({ type: "context-change" });

    expect(controller.getEpoch()).toBe(2);
  });
});

describe("linkSignal", () => {
  it("returns the global signal when no external signal is given", () => {
    const { signal } = controller.linkSignal();

    expect(signal).toBe(controller.getSignal());
  });

  it("cancels the linked request when the global signal aborts", () => {
    const external = new AbortController();
    const { signal } = controller.linkSignal(external.signal);

    controller.abortAll({ type: "unauthorized" });

    expect(signal.aborted).toBe(true);
    expect(signal.reason).toEqual({ type: "unauthorized" });
  });

  it("cancels only its own request when the external signal aborts", () => {
    const external = new AbortController();
    const { signal } = controller.linkSignal(external.signal);

    external.abort(abortError());

    expect(signal.aborted).toBe(true);
    expect(controller.getSignal().aborted).toBe(false);
  });

  it("short circuits when the external signal is already aborted", () => {
    const external = new AbortController();
    external.abort(abortError());
    const listen = vi.spyOn(controller.getSignal(), "addEventListener");

    const { signal } = controller.linkSignal(external.signal);

    expect(signal.aborted).toBe(true);
    expect(listen).not.toHaveBeenCalled();
  });

  it("detaches from the global signal once disposed", () => {
    const external = new AbortController();
    const { signal, dispose } = controller.linkSignal(external.signal);

    dispose();
    controller.abortAll({ type: "logout" });

    expect(signal.aborted).toBe(false);
  });

  it("leaves no listeners behind across many requests", () => {
    const globalSignal = controller.getSignal();
    const attach = vi.spyOn(globalSignal, "addEventListener");
    const detach = vi.spyOn(globalSignal, "removeEventListener");

    for (let index = 0; index < 100; index += 1) {
      const external = new AbortController();
      controller.linkSignal(external.signal).dispose();
    }

    expect(attach).toHaveBeenCalledTimes(100);
    expect(detach).toHaveBeenCalledTimes(100);
  });
});

describe("session state", () => {
  it("starts active and accepts transitions", () => {
    expect(controller.getState()).toBe("active");

    controller.setState("refreshing");
    expect(controller.getState()).toBe("refreshing");

    controller.setState("invalid");
    expect(controller.getState()).toBe("invalid");
  });
});

describe("isAbortError", () => {
  it("matches only DOMException AbortError", () => {
    expect(controller.isAbortError(abortError())).toBe(true);
    expect(controller.isAbortError(new Error("network down"))).toBe(false);
    expect(controller.isAbortError({ name: "AbortError" })).toBe(false);
    expect(controller.isAbortError(null)).toBe(false);
  });
});
