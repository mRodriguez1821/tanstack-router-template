export type AbortReason =
  | { type: "unauthorized" }
  | { type: "logout" }
  | { type: "context-change" };

export type SessionState = "active" | "refreshing" | "invalid";

export type LinkedSignal = {
  signal: AbortSignal;
  dispose: () => void;
};

let controller = new AbortController();
let state: SessionState = "active";
let epoch = 0;

const noop = () => {};

export const getSignal = () => controller.signal;

export const getEpoch = () => epoch;

export const getState = () => state;

export const setState = (next: SessionState) => {
  state = next;
};

export const abortAll = (reason: AbortReason) => {
  const dying = controller;
  controller = new AbortController();
  epoch += 1;
  dying.abort(reason);
};

export const isAbortError = (error: unknown) =>
  error instanceof DOMException && error.name === "AbortError";

export const linkSignal = (external?: AbortSignal | null): LinkedSignal => {
  const global = controller.signal;

  if (!external) return { signal: global, dispose: noop };

  if (global.aborted || external.aborted) {
    const settled = new AbortController();
    settled.abort(global.aborted ? global.reason : external.reason);
    return { signal: settled.signal, dispose: noop };
  }

  const merged = new AbortController();

  const onAbort = (event: Event) => {
    merged.abort((event.target as AbortSignal).reason);
  };

  global.addEventListener("abort", onAbort, { once: true });
  external.addEventListener("abort", onAbort, { once: true });

  const dispose = () => {
    global.removeEventListener("abort", onAbort);
    external.removeEventListener("abort", onAbort);
  };

  return { signal: merged.signal, dispose };
};
