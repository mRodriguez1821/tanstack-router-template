import { useState, useEffect, useCallback, useRef } from "react";

export interface UseFormDraftOptions<T> {
  /** Sincroniza automáticamente los campos del borrador con los query params de la URL */
  syncWithUrl?: boolean;
  /** Prefijo para el almacenamiento en localStorage (por defecto: 'app.draft:') */
  storagePrefix?: string;
  /** Tiempo de espera (ms) para aplicar debounce al guardado (por defecto: 200ms) */
  debounceMs?: number;
  /** Función opcional que se ejecuta cuando se restaura un borrador */
  onRestore?: (restoredValues: T, source: "url" | "storage") => void;
}

export interface UseFormDraftReturn<T> {
  /** Valores actuales del formulario */
  values: T;
  /** Actualiza un campo individual */
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  /** Actualiza todos los valores */
  setValues: React.Dispatch<React.SetStateAction<T>>;
  /** Manejador genérico para inputs HTML (input, select, textarea) */
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  /** Elimina el borrador de storage y URL (por ejemplo tras guardar exitosamente) */
  clearDraft: () => void;
  /** Restablece los valores al estado inicial y limpia el borrador */
  resetDraft: () => void;
  /** Indica si se está utilizando un borrador recuperado */
  isDraftRestored: boolean;
  /** Fecha/hora del último guardado del borrador */
  lastSavedAt: Date | null;
  /** Indica si los valores actuales difieren del estado inicial */
  hasUnsavedChanges: boolean;
}

/**
 * Hook para formularios que guarda automáticamente borradores en localStorage
 * y permite reconstruir la vista completa y sus inputs directamente desde la URL o el almacenamiento.
 */
export function useFormDraft<T extends Record<string, any>>(
  draftKey: string,
  initialValues: T,
  options: UseFormDraftOptions<T> = {}
): UseFormDraftReturn<T> {
  const {
    syncWithUrl = true,
    storagePrefix = "app.draft:",
    debounceMs = 250,
    onRestore,
  } = options;

  const storageKey = `${storagePrefix}${draftKey}`;
  const isInitializedRef = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isDraftRestored, setIsDraftRestored] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // Inicialización inteligente: 1) URL query params -> 2) localStorage -> 3) initialValues
  const [values, setValues] = useState<T>(() => {
    if (typeof window === "undefined") return initialValues;

    // 1. Intentar reconstruir desde URL
    if (syncWithUrl) {
      const searchParams = new URLSearchParams(window.location.search);
      const urlValues: Partial<T> = {};
      let hasUrlValues = false;

      Object.keys(initialValues).forEach((key) => {
        const paramVal = searchParams.get(`f_${key}`) ?? searchParams.get(key);
        if (paramVal !== null) {
          try {
            // Intentar parsear números o booleanos
            if (paramVal === "true") (urlValues as any)[key] = true;
            else if (paramVal === "false") (urlValues as any)[key] = false;
            else if (!isNaN(Number(paramVal)) && paramVal.trim() !== "") {
              (urlValues as any)[key] = Number(paramVal);
            } else {
              (urlValues as any)[key] = paramVal;
            }
            hasUrlValues = true;
          } catch {
            (urlValues as any)[key] = paramVal;
            hasUrlValues = true;
          }
        }
      });

      if (hasUrlValues) {
        return { ...initialValues, ...urlValues };
      }
    }

    // 2. Intentar recuperar desde localStorage
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          return { ...initialValues, ...parsed };
        }
      }
    } catch {
      // Ignorar errores de parseo
    }

    return initialValues;
  });

  // Notificar restauración en montaje inicial si difiere de los valores iniciales
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      const isDifferent = JSON.stringify(values) !== JSON.stringify(initialValues);
      if (isDifferent) {
        setIsDraftRestored(true);
        setLastSavedAt(new Date());
        onRestore?.(values, "storage");
      }
    }
  }, []);

  // Guardado automático con debounce en localStorage y actualización de la URL
  useEffect(() => {
    if (!isInitializedRef.current) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (typeof window === "undefined") return;

      const isDefault = JSON.stringify(values) === JSON.stringify(initialValues);

      if (isDefault) {
        localStorage.removeItem(storageKey);
        setIsDraftRestored(false);
      } else {
        localStorage.setItem(storageKey, JSON.stringify(values));
        setIsDraftRestored(true);
        setLastSavedAt(new Date());
      }

      // Sincronizar con la URL mediante replaceState sin recargar
      if (syncWithUrl) {
        const url = new URL(window.location.href);
        const searchParams = url.searchParams;

        Object.keys(initialValues).forEach((key) => {
          const val = values[key];
          const paramKey = `f_${key}`;

          if (val !== undefined && val !== null && val !== "" && val !== initialValues[key]) {
            searchParams.set(paramKey, String(val));
          } else {
            searchParams.delete(paramKey);
            searchParams.delete(key);
          }
        });

        window.history.replaceState({}, "", url.toString());
      }
    }, debounceMs);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [values, initialValues, storageKey, syncWithUrl, debounceMs]);

  const setFieldValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;

      setValues((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    },
    []
  );

  const clearDraft = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);

      if (syncWithUrl) {
        const url = new URL(window.location.href);
        Object.keys(initialValues).forEach((key) => {
          url.searchParams.delete(`f_${key}`);
          url.searchParams.delete(key);
        });
        window.history.replaceState({}, "", url.toString());
      }
    }
    setIsDraftRestored(false);
    setLastSavedAt(null);
  }, [storageKey, syncWithUrl, initialValues]);

  const resetDraft = useCallback(() => {
    clearDraft();
    setValues(initialValues);
  }, [clearDraft, initialValues]);

  const hasUnsavedChanges = JSON.stringify(values) !== JSON.stringify(initialValues);

  return {
    values,
    setFieldValue,
    setValues,
    handleChange,
    clearDraft,
    resetDraft,
    isDraftRestored,
    lastSavedAt,
    hasUnsavedChanges,
  };
}

export default useFormDraft;
