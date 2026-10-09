import { abortAll, setState } from "./requestController";
import { encryptedLocalStorage } from "./storage";

const ACCESS_TOKEN_KEY = "auth.access";
const REFRESH_TOKEN_KEY = "auth.refresh";
const AUTH_EVENT = "auth.change";

const notifyAuthChange = () => {
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const getAccessToken = (): string | null =>
  encryptedLocalStorage.getItem<string>(ACCESS_TOKEN_KEY);
export const getRefreshToken = (): string | null =>
  encryptedLocalStorage.getItem<string>(REFRESH_TOKEN_KEY);

const EXPIRY_SKEW_MS = 30_000;

const decodeExpiry = (token: string): number | null => {
  const segment = token.split(".")[1];
  if (!segment) return null;

  try {
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
    const payload = JSON.parse(new TextDecoder().decode(bytes)) as {
      exp?: unknown;
    };

    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};

export const isTokenExpiring = (token: string | null) => {
  if (!token) return false;

  const expiresAt = decodeExpiry(token);
  if (expiresAt === null) return false;

  return expiresAt - EXPIRY_SKEW_MS <= Date.now();
};

export const setTokens = (token: string, refresh: string) => {
  encryptedLocalStorage.setItem(ACCESS_TOKEN_KEY, token);
  encryptedLocalStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  setState("active");
  notifyAuthChange();
};

const SESSION_PREFIX = "auth.";
const PRESERVED_KEYS = new Set(["auth.language"]);

const collectKeys = (storage: Storage) => {
  const keys: string[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key) keys.push(key);
  }
  return keys;
};

const clearSessionCookies = () => {
  if (typeof document === "undefined") return;

  document.cookie.split(";").forEach((entry) => {
    const name = entry.split("=")[0]?.trim();
    if (!name) return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
};

export const clearSession = () => {
  encryptedLocalStorage.removeItem(ACCESS_TOKEN_KEY);
  encryptedLocalStorage.removeItem(REFRESH_TOKEN_KEY);
  encryptedLocalStorage.removeItem("user");

  collectKeys(localStorage)
    .filter((key) => key.startsWith(SESSION_PREFIX) && !PRESERVED_KEYS.has(key))
    .forEach((key) => localStorage.removeItem(key));

  sessionStorage.clear();
  clearSessionCookies();
  notifyAuthChange();
};

export const endSession = () => {
  setState("invalid");
  abortAll({ type: "logout" });
  clearSession();
};

export const subscribeToAuthChanges = (listener: () => void) => {
  window.addEventListener(AUTH_EVENT, listener);
  return () => window.removeEventListener(AUTH_EVENT, listener);
};
