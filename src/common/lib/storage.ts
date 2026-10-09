import { EncryptStorage } from "encrypt-storage";

const DEFAULT_SECRET_KEY = "template-app-secure-storage-key-32chars";

// Permite configurar la clave de cifrado vía variables de entorno (.env)
const SECRET_KEY =
  (typeof import.meta !== "undefined" &&
    (import.meta.env?.VITE_STORAGE_SECRET_KEY ||
      import.meta.env?.VITE_STORAGE_SECRET)) ||
  DEFAULT_SECRET_KEY;

type StorageType = "localStorage" | "sessionStorage";

export interface EncryptedStorageAdapter {
  getItem: <T = unknown>(key: string) => T | null;
  setItem: (key: string, value: unknown) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  hashKey: (key: string) => string;
}

/**
 * Crea una instancia de EncryptedStorage donde TANTO LA CLAVE (Key) como EL VALOR (Value)
 * están protegidos:
 * - La CLAVE se hashea con SHA-256 para ocultar el nombre del dato (ej. 'auth.access' -> 'f8a7c3...').
 * - El VALOR se cifra con AES-GCM.
 */
function createStorage(storageType: StorageType = "localStorage"): EncryptedStorageAdapter {
  if (typeof window === "undefined" || !window[storageType]) {
    const memory = new Map<string, unknown>();
    return {
      getItem: <T = unknown>(key: string): T | null =>
        (memory.get(key) as T) ?? null,
      setItem: (key: string, value: unknown) => {
        memory.set(key, value);
      },
      removeItem: (key: string) => {
        memory.delete(key);
      },
      clear: () => {
        memory.clear();
      },
      hashKey: (key: string) => `mock_hash_${key}`,
    };
  }

  const baseStorage = EncryptStorage.create(SECRET_KEY, {
    engine: "noble",
    prefix: "app",
    storageType,
  });

  return {
    /**
     * Obtiene y descifra el valor asociado a la clave hasheada.
     */
    getItem: <T = unknown>(key: string): T | null => {
      const hashedKey = baseStorage.hash(key);
      return baseStorage.getItem<T>(hashedKey);
    },

    /**
     * Guarda el valor cifrado bajo un nombre de clave hasheado con SHA-256.
     */
    setItem: (key: string, value: unknown): void => {
      const hashedKey = baseStorage.hash(key);
      baseStorage.setItem(hashedKey, value);
    },

    /**
     * Elimina el registro correspondiente a la clave hasheada.
     */
    removeItem: (key: string): void => {
      const hashedKey = baseStorage.hash(key);
      baseStorage.removeItem(hashedKey);
    },

    /**
     * Limpia todo el almacenamiento correspondiente.
     */
    clear: (): void => {
      baseStorage.clear();
    },

    /**
     * Obtiene el hash SHA-256 de una clave (útil para inspeccionar el storage en crudo).
     */
    hashKey: (key: string): string => {
      return baseStorage.hash(key);
    },
  };
}

/**
 * Storage cifrado en localStorage (persistente).
 * Cifra la clave (SHA-256) y el valor (AES-GCM).
 */
export const encryptedLocalStorage = createStorage("localStorage");

/**
 * Storage cifrado en sessionStorage (por pestaña).
 * Cifra la clave (SHA-256) y el valor (AES-GCM).
 */
export const encryptedSessionStorage = createStorage("sessionStorage");
