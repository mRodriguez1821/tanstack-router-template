import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { subscribeToApiErrors, TOAST_EVENT, type ToastType } from "../lib/api";
import type { ApiResult } from "../types/apiTypes";

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

export function ToastHost() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { t } = useTranslation();

  const addToast = (message: string, type: ToastType = "info") => {
    const trimmed = message.trim();
    if (!trimmed) return;
    const id = Date.now() + Math.random();

    setToasts((prev) => {
      if (prev.some((item) => item.message === trimmed)) return prev;
      return [...prev, { id, message: trimmed, type }];
    });

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4500);
  };

  useEffect(() => {
    const unsubscribeErrors = subscribeToApiErrors((payload: ApiResult<unknown>) => {
      const message =
        payload.message?.trim() ||
        t("errors.generic", "Ha ocurrido un error inesperado");
      addToast(message, "error");
    });

    const handleToastEvent = (event: Event) => {
      const custom = event as CustomEvent<{ message: string; type?: ToastType }>;
      if (custom.detail?.message) {
        addToast(custom.detail.message, custom.detail.type || "info");
      }
    };

    window.addEventListener(TOAST_EVENT, handleToastEvent);

    return () => {
      unsubscribeErrors();
      window.removeEventListener(TOAST_EVENT, handleToastEvent);
    };
  }, [t]);

  if (!toasts.length) return null;

  return (
    <div
      aria-live="polite"
      className="fixed right-6 top-6 z-[9999] flex w-full max-w-md flex-col gap-3 pointer-events-none"
    >
      {toasts.map((toast) => {
        const getStyles = () => {
          switch (toast.type) {
            case "success":
              return {
                border: "border-emerald-200 dark:border-emerald-900/60",
                iconBg:
                  "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400",
                Icon: CheckCircle2,
              };
            case "warning":
              return {
                border: "border-amber-200 dark:border-amber-900/60",
                iconBg:
                  "bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400",
                Icon: AlertTriangle,
              };
            case "info":
              return {
                border: "border-sky-200 dark:border-sky-900/60",
                iconBg:
                  "bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400",
                Icon: Info,
              };
            default:
              return {
                border: "border-red-200 dark:border-red-900/60",
                iconBg:
                  "bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400",
                Icon: XCircle,
              };
          }
        };

        const { border, iconBg, Icon } = getStyles();

        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border ${border} bg-white dark:bg-slate-900 p-4 text-sm text-slate-800 dark:text-slate-100 shadow-xl transition-all duration-200`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 pt-0.5 font-medium leading-relaxed break-words">
              {toast.message}
            </div>
            <button
              type="button"
              onClick={() =>
                setToasts((prev) => prev.filter((t) => t.id !== toast.id))
              }
              className="shrink-0 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ToastHost;
