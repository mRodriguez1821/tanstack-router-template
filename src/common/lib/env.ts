export type AppEnvironment = "showcase" | "dev" | "qa" | "prod";

const RAW_ENV =
  (typeof import.meta !== "undefined" &&
    import.meta.env?.VITE_APP_ENV?.toLowerCase()) ||
  "dev";

export const APP_ENV: AppEnvironment = ([
  "showcase",
  "dev",
  "qa",
  "prod",
].includes(RAW_ENV)
  ? RAW_ENV
  : "dev") as AppEnvironment;

/**
 * Versión de la aplicación extraída directamente desde package.json.
 */
export const APP_VERSION: string =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_APP_VERSION) ||
  "0.0.1";

/**
 * Modo Showcase: pensado para explorar interacciones y componentes libremente.
 * Cuenta con BYPASS de autenticación activo.
 */
export const isShowcase = APP_ENV === "showcase";

/**
 * Modo Dev: desarrollo local con debuggers activos (TanStack Router DevTools, etc.).
 */
export const isDev = APP_ENV === "dev";

/**
 * Modo QA: entorno de calidad / testing sin debuggers invasivos.
 */
export const isQA = APP_ENV === "qa";

/**
 * Modo Prod: producción limpia, estricta y sin debuggers ni bypass.
 */
export const isProd = APP_ENV === "prod";

/**
 * Determina si se deben montar las herramientas de depuración (DevTools).
 * Solo activo en 'dev'.
 */
export const showDebugger = isDev || isShowcase;

/**
 * Determina si las rutas protegidas permiten acceso libre sin login.
 * Solo activo en 'showcase'.
 */
export const bypassAuth = isShowcase;
