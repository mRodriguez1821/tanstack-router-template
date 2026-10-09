import type { ApiResult } from "../types";
import type { AuthResponse } from "../types/apiTypes";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  isTokenExpiring,
  setTokens,
} from "./auth";
import { abortAll, getState, linkSignal, setState } from "./requestController";

export const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";

const ERROR_EVENT = "auth.api.error";
export const TOAST_EVENT = "auth.toast";
const LANGUAGE_KEY = "auth.language";
let refreshPromise: Promise<boolean> | null = null;

export const notifyError = (payload: ApiResult<unknown> | string) => {
  const detail: ApiResult<unknown> =
    typeof payload === "string"
      ? {
          isSuccess: false,
          code: 400,
          message: payload,
          errorCode: "CLIENT_ERROR",
        }
      : payload;
  window.dispatchEvent(new CustomEvent(ERROR_EVENT, { detail }));
};

export type ToastType = "success" | "info" | "warning" | "error";

export const showToast = (message: string, type: ToastType = "info") => {
  if (type === "error") {
    notifyError(message);
    return;
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(TOAST_EVENT, { detail: { message, type } })
    );
  }
};

export const getLanguage = () =>
  localStorage.getItem(LANGUAGE_KEY) || navigator.language || "en";

export const setLanguage = (language: string) => {
  localStorage.setItem(LANGUAGE_KEY, language);
};

export const subscribeToApiErrors = (
  listener: (payload: ApiResult<unknown>) => void,
) => {
  const apiErrorHandler = (event: Event) => {
    const custom = event as CustomEvent<ApiResult<unknown>>;
    listener(custom.detail);
  };

  window.addEventListener(ERROR_EVENT, apiErrorHandler);

  return () => window.removeEventListener(ERROR_EVENT, apiErrorHandler);
};

const readResult = async <T>(response: Response): Promise<ApiResult<T>> => {
  const raw = await response.text();

  if (raw) {
    try {
      return JSON.parse(raw) as ApiResult<T>;
    } catch {
      return {
        isSuccess: response.ok,
        code: response.status,
        message: raw,
        errorCode: `HTTP_${response.status}`,
      } satisfies ApiResult<T>;
    }
  }

  return {
    isSuccess: response.ok,
    code: response.status,
    message: raw || response.statusText,
    errorCode: `HTTP_${response.status}`,
  } satisfies ApiResult<T>;
};

const redirectToLogin = () => {
  clearSession();
  if (
    window.location.pathname !== "/signin" &&
    window.location.pathname !== "/login"
  ) {
    window.location.assign("/signin");
  }
};

const invalidateSession = () => {
  if (getState() === "invalid") return;
  setState("invalid");
  abortAll({ type: "unauthorized" });
  redirectToLogin();
};

const runRefresh = async (refresh: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refresh}`,
      },
    });

    if (!response.ok) return false;

    const payload = (await response.json()) as ApiResult<AuthResponse>;
    if (!payload?.isSuccess || !payload.data?.accessToken) return false;

    setTokens(
      payload.data.accessToken,
      payload.data.refreshToken,
    );
    return true;
  } catch {
    return false;
  }
};

const refreshTokens = (): Promise<boolean> => {
  if (refreshPromise) return refreshPromise;

  const refresh = getRefreshToken();
  if (!refresh) {
    invalidateSession();
    return Promise.resolve(false);
  }

  setState("refreshing");

  refreshPromise = runRefresh(refresh).then((refreshed) => {
    if (!refreshed) invalidateSession();
    refreshPromise = null;
    return refreshed;
  });

  return refreshPromise;
};

export type ApiFetchInit = RequestInit & { silentErrors?: boolean };

const UNGATED_ENDPOINTS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
];

const isUngated = (input: string) =>
  UNGATED_ENDPOINTS.some((endpoint) => input.startsWith(endpoint));

const unauthorized = <T>() =>
  ({
    isSuccess: false,
    code: 401,
    message: "Unauthorized",
    errorCode: "AUTH_UNAUTHORIZED",
  }) satisfies ApiResult<T>;

export const apiFetch = async <T>(
  input: string,
  init: ApiFetchInit = {},
  retry = true,
): Promise<ApiResult<T>> => {
  const { silentErrors = false, ...requestInit } = init;

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    const method = (requestInit.method || "GET").toUpperCase();
    if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
      const offlineBlocked: ApiResult<T> = {
        isSuccess: false,
        code: 503,
        message: "Operación no disponible sin conexión. Solo lectura permitida.",
        errorCode: "OFFLINE_ACTION_RESTRICTED",
      };
      if (!silentErrors) notifyError(offlineBlocked);
      return offlineBlocked;
    }
  }

  if (!isUngated(input)) {
    if (refreshPromise) await refreshPromise;

    if (getState() === "active" && isTokenExpiring(getAccessToken())) {
      await refreshTokens();
    }

    if (getState() === "invalid") {
      const blocked = unauthorized<T>();
      if (!silentErrors) notifyError(blocked);
      return blocked;
    }
  }

  const token = getAccessToken();
  const headers = new Headers(requestInit.headers);

  // Solo forzar application/json si no es FormData y no se definió manualmente
  if (!(requestInit.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const language = getLanguage();
  if (language) {
    headers.set("X-Language", language);
    headers.set("Accept-Language", language);
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  // Idempotency-Key automático para mutaciones POST/PUT
  if (
    (requestInit.method === "POST" || requestInit.method === "PUT") &&
    !headers.has("Idempotency-Key")
  ) {
    let key: string | null = null;
    if (typeof requestInit.body === "string") {
      try {
        const parsed = JSON.parse(requestInit.body);
        key = parsed.idempotencyKey || parsed.IdempotencyKey || null;
      } catch {}
    }
    if (!key) {
      key =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).substring(2)}`;
    }
    headers.set("Idempotency-Key", key);
  }

  const { signal, dispose } = linkSignal(requestInit.signal);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${input}`, {
      ...requestInit,
      headers,
      signal,
    });
  } finally {
    dispose();
  }

  if (response.status === 401 && !isUngated(input)) {
    if (retry) {
      const refreshed = await refreshTokens();
      if (!refreshed) {
        const fail = unauthorized<T>();
        if (!silentErrors) notifyError(fail);
        return fail;
      }

      return apiFetch<T>(input, init, false);
    }

    invalidateSession();
  }

  const payload = await readResult<T>(response);
  if (!payload.isSuccess && !silentErrors) {
    notifyError(payload);
  }
  return payload;
};;
