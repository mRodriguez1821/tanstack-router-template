import { showToast, type ToastType } from "../lib/api";

export function useToast() {
  return {
    toast: (message: string, type: ToastType = "info") => showToast(message, type),
    success: (message: string) => showToast(message, "success"),
    error: (message: string) => showToast(message, "error"),
    warning: (message: string) => showToast(message, "warning"),
    info: (message: string) => showToast(message, "info"),
  };
}

export { showToast };
export type { ToastType };
