import {
  useState,
  useCallback,
  useMemo,
  type ReactNode,
  type ReactElement,
  useEffect,
} from "react";
import {
  Modal,
  type ModalProps,
  type ModalSize,
  type ModalHorizontal,
  type ModalVertical,
  type ModalBlur,
} from "@/common/components/Modal";
import { Button } from "@/common/components/Button";

// ============================================================================
// 1. Hook useModal: Control local de modal pre-vinculado
// ============================================================================

export type BoundModalProps = Omit<ModalProps, "isOpen" | "onClose"> & {
  isOpen?: boolean;
  onClose?: () => void;
};

export interface UseModalOptions<T = unknown> extends Partial<BoundModalProps> {
  defaultOpen?: boolean;
  initialData?: T;
  onOpen?: (data?: T) => void;
  onClose?: () => void;
  /** Función para limpiar estados al cerrar el modal (por ej. inputs y formularios) */
  resetOnClose?: () => void;
  /**
   * Sincroniza la apertura del modal con la URL mediante un query parameter (ej. 'create-user' -> ?modal=create-user).
   * Permite reconstruir la vista y mantener el modal abierto al recargar o compartir la URL.
   */
  urlParam?: string | { key?: string; value: string };
}

export interface UseModalReturn<T = unknown> {
  /** Indica si el modal está abierto actualmente */
  isOpen: boolean;
  /** Datos o payload transferido al modal */
  data: T | null;
  /** Actualiza directamente el dato almacenado */
  setData: (data: T | null | ((prev: T | null) => T | null)) => void;
  /** Abre el modal (y opcionalmente asigna un payload de datos) */
  showModal: (payload?: T) => void;
  /** Cierra el modal y ejecuta resetOnClose */
  hideModal: () => void;
  /** Alias para hideModal */
  closeModal: () => void;
  /** Alias para showModal */
  openModal: (payload?: T) => void;
  /** Alterna la apertura/cierre del modal */
  toggleModal: () => void;
  /**
   * Componente pre-vinculado: No requiere pasar `isOpen` ni `onClose`.
   * Ejemplo: `<Modal title="Mi modal"><p>Contenido</p></Modal>`
   */
  Modal: React.FC<BoundModalProps>;
  /**
   * Elemento JSX pre-renderizado según las opciones iniciales.
   * Ejemplo: `{modal}` en el JSX sin necesidad de escribir etiquetas.
   */
  modal: ReactElement | null;
  /** Propiedades estándar para aplicar con spread a `<Modal {...modalProps} />` si se prefiere */
  modalProps: {
    isOpen: boolean;
    onClose: () => void;
  };
}

/**
 * Hook para gestionar cualquier modal sin necesidad de controlar manualmente el estado `isOpen` ni `onClose`.
 * Soporta reconstrucción mediante la URL y limpieza automática de estados.
 */
export function useModal<T = unknown>(
  options: UseModalOptions<T> = {}
): UseModalReturn<T> {
  const {
    defaultOpen = false,
    initialData = null,
    onOpen: onOpenCallback,
    onClose: onCloseCallback,
    resetOnClose,
    urlParam,
    ...defaultModalProps
  } = options;

  const urlParamValue =
    typeof urlParam === "string" ? urlParam : urlParam?.value;
  const urlParamKey =
    typeof urlParam === "object" ? urlParam?.key || "modal" : "modal";

  // Determinar estado inicial considerando la URL
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (defaultOpen) return true;
    if (typeof window !== "undefined" && urlParamValue) {
      return (
        new URLSearchParams(window.location.search).get(urlParamKey) ===
        urlParamValue
      );
    }
    return false;
  });

  const [data, setData] = useState<T | null>(initialData);

  // Sincronizar estado cuando el usuario navega hacia adelante/atrás en el navegador
  useEffect(() => {
    if (!urlParamValue || typeof window === "undefined") return;

    const handlePopState = () => {
      const isParamActive =
        new URLSearchParams(window.location.search).get(urlParamKey) ===
        urlParamValue;

      setIsOpen((prev) => {
        if (prev !== isParamActive) {
          if (!isParamActive) {
            onCloseCallback?.();
            resetOnClose?.();
          }
          return isParamActive;
        }
        return prev;
      });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [urlParamValue, urlParamKey, onCloseCallback, resetOnClose]);

  const showModal = useCallback(
    (payload?: T) => {
      if (payload !== undefined) {
        setData(payload);
      }
      setIsOpen(true);
      onOpenCallback?.(payload);

      // Reflejar en la URL si urlParam está activo
      if (urlParamValue && typeof window !== "undefined") {
        const url = new URL(window.location.href);
        if (url.searchParams.get(urlParamKey) !== urlParamValue) {
          url.searchParams.set(urlParamKey, urlParamValue);
          window.history.pushState({}, "", url.toString());
        }
      }
    },
    [onOpenCallback, urlParamValue, urlParamKey]
  );

  const hideModal = useCallback(() => {
    setIsOpen(false);
    onCloseCallback?.();
    resetOnClose?.();

    // Remover de la URL si urlParam está activo
    if (urlParamValue && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.get(urlParamKey) === urlParamValue) {
        url.searchParams.delete(urlParamKey);
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, [onCloseCallback, resetOnClose, urlParamValue, urlParamKey]);

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (!next) {
        onCloseCallback?.();
        resetOnClose?.();
      }
      return next;
    });
  }, [onCloseCallback, resetOnClose]);

  // Componente pre-vinculado
  const BoundModal = useCallback(
    (props: BoundModalProps) => {
      return (
        <Modal
          {...defaultModalProps}
          {...props}
          isOpen={props.isOpen ?? isOpen}
          onClose={() => {
            props.onClose?.();
            hideModal();
          }}
        />
      );
    },
    [defaultModalProps, isOpen, hideModal]
  );

  // Elemento pre-renderizado si se especificaron opciones
  const renderedModal = useMemo(() => {
    if (!isOpen) return null;
    return (
      <Modal
        {...defaultModalProps}
        isOpen={isOpen}
        onClose={hideModal}
      />
    );
  }, [isOpen, defaultModalProps, hideModal]);

  return {
    isOpen,
    data,
    setData,
    showModal,
    hideModal,
    closeModal: hideModal,
    openModal: showModal,
    toggleModal,
    Modal: BoundModal,
    modal: renderedModal,
    modalProps: {
      isOpen,
      onClose: hideModal,
    },
  };
}

// ============================================================================
// 2. Sistema Imperativo Global: showGlobalModal & confirmModal
// ============================================================================

export interface GlobalModalConfig {
  id?: string;
  title?: ReactNode;
  description?: ReactNode;
  header?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  horizontal?: ModalHorizontal;
  vertical?: ModalVertical;
  blur?: ModalBlur;
  overlayColor?: string;
  closeOnClickOutside?: boolean;
  showCloseButton?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

type GlobalModalListener = (modal: GlobalModalConfig | null) => void;

let activeGlobalModal: GlobalModalConfig | null = null;
const globalModalListeners = new Set<GlobalModalListener>();

function notifyGlobalListeners() {
  globalModalListeners.forEach((listener) => listener(activeGlobalModal));
}

/**
 * Abre un modal de forma imperativa desde cualquier lugar de la aplicación
 * sin necesidad de declarar JSX en el componente que lo llama.
 *
 * Requiere que `<ModalHost />` esté montado en el árbol raíz.
 */
export function showGlobalModal(config: GlobalModalConfig): () => void {
  activeGlobalModal = config;
  notifyGlobalListeners();

  return closeGlobalModal;
}

/** Cierra el modal global activo */
export function closeGlobalModal() {
  if (activeGlobalModal?.onClose) {
    activeGlobalModal.onClose();
  }
  activeGlobalModal = null;
  notifyGlobalListeners();
}

/** Alias conveniente de showGlobalModal */
export const showModal = showGlobalModal;
export const closeModal = closeGlobalModal;

/**
 * Muestra un diálogo de confirmación basado en promesas.
 *
 * @example
 * ```ts
 * const confirmed = await confirmModal({
 *   title: "¿Eliminar registro?",
 *   description: "Esta acción es irreversible."
 * });
 * if (confirmed) {
 *   // proceder...
 * }
 * ```
 */
export function confirmModal(options: {
  title?: ReactNode;
  description?: ReactNode;
  body?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  size?: ModalSize;
  danger?: boolean;
}): Promise<boolean> {
  return new Promise((resolve) => {
    const {
      title = "¿Estás seguro?",
      description,
      body,
      confirmText = "Aceptar",
      cancelText = "Cancelar",
      size = "pequeño",
      danger = false,
    } = options;

    showGlobalModal({
      title,
      description,
      size,
      body: body || (
        <p className="p-4 text-xs text-zinc-600 dark:text-zinc-400">
          ¿Deseas continuar con esta acción?
        </p>
      ),
      onClose: () => {
        resolve(false);
      },
      footer: (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              closeGlobalModal();
              resolve(false);
            }}
          >
            {cancelText}
          </Button>
          <Button
            variant={danger ? "primary" : "primary"}
            size="sm"
            className={danger ? "bg-red-600 hover:bg-red-700 text-white" : ""}
            onClick={() => {
              closeGlobalModal();
              resolve(true);
            }}
          >
            {confirmText}
          </Button>
        </div>
      ),
    });
  });
}

// ============================================================================
// 3. Componente Host Global: <ModalHost />
// ============================================================================

export function ModalHost() {
  const [modalConfig, setModalConfig] = useState<GlobalModalConfig | null>(
    activeGlobalModal
  );

  useEffect(() => {
    const listener: GlobalModalListener = (next) => {
      setModalConfig(next ? { ...next } : null);
    };

    globalModalListeners.add(listener);
    return () => {
      globalModalListeners.delete(listener);
    };
  }, []);

  if (!modalConfig) return null;

  return (
    <Modal
      isOpen={Boolean(modalConfig)}
      onClose={closeGlobalModal}
      title={modalConfig.title}
      description={modalConfig.description}
      header={modalConfig.header}
      body={modalConfig.body}
      footer={
        modalConfig.footer ||
        (modalConfig.onConfirm && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={closeGlobalModal}>
              {modalConfig.cancelText || "Cancelar"}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                modalConfig.onConfirm?.();
                closeGlobalModal();
              }}
            >
              {modalConfig.confirmText || "Aceptar"}
            </Button>
          </div>
        ))
      }
      size={modalConfig.size || "mediano"}
      horizontal={modalConfig.horizontal || "center"}
      vertical={modalConfig.vertical || "center"}
      blur={modalConfig.blur ?? "sm"}
      overlayColor={modalConfig.overlayColor || "bg-black/60"}
      closeOnClickOutside={modalConfig.closeOnClickOutside ?? true}
      showCloseButton={modalConfig.showCloseButton ?? true}
    />
  );
}

export default useModal;
