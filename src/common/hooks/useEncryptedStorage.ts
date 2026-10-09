import { useState, useCallback } from "react";
import { encryptedLocalStorage } from "../lib/storage";

/**
 * Hook para sincronizar estado reactivo de React con storage cifrado (AES).
 *
 * @example
 * ```tsx
 * const [draft, setDraft, clearDraft] = useEncryptedStorage('form_draft', { title: '' });
 * ```
 */
export function useEncryptedStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = encryptedLocalStorage.getItem<T>(key);
      return item !== null && item !== undefined ? item : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const valueToStore =
            value instanceof Function ? value(prev) : value;
          encryptedLocalStorage.setItem(key, valueToStore);
          return valueToStore;
        });
      } catch (err) {
        console.error(`Error guardando en encryptedStorage (clave: ${key}):`, err);
      }
    },
    [key],
  );

  const removeValue = useCallback(() => {
    try {
      encryptedLocalStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (err) {
      console.error(`Error eliminando de encryptedStorage (clave: ${key}):`, err);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}
