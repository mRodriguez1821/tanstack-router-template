import { useState, useCallback, useMemo, type ReactElement } from "react";
import { User, Mail, Shield, Calendar, CheckCircle } from "lucide-react";
import { Modal } from "@/common/components/Modal";
import { Button } from "@/common/components/Button";

export interface UserModalData {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
  status?: "activo" | "inactivo" | "pendiente";
  avatar?: string;
  joinedAt?: string;
}

export interface UseUserModalOptions {
  title?: string;
  onEdit?: (user: UserModalData) => void;
  onDelete?: (user: UserModalData) => void;
}

/**
 * Hook especializado para modales de usuario que hereda la lógica de control
 * sin necesidad de gestionar manualmente `isOpen` en cada nueva implementación.
 *
 * @example
 * ```tsx
 * const { showModal, userModal } = useUserModal();
 *
 * return (
 *   <>
 *     <button onClick={() => showModal({ name: "Ana Torres", email: "ana@empresa.com", role: "Admin" })}>
 *       Ver Usuario
 *     </button>
 *     {userModal}
 *   </>
 * );
 * ```
 */
export function useUserModal(options: UseUserModalOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserModalData | null>(null);

  const showModal = useCallback((userData?: UserModalData) => {
    if (userData) {
      setUser(userData);
    }
    setIsOpen(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Elemento pre-renderizado listo para incrustar directamente como `{userModal}`
  const userModalElement = useMemo((): ReactElement | null => {
    if (!isOpen) return null;

    return (
      <Modal
        isOpen={isOpen}
        onClose={hideModal}
        size="mediano"
        vertical="center"
        horizontal="center"
        blur="sm"
        title={options.title || "Ficha de Usuario"}
        description={user?.email ? `Detalles del perfil de ${user.name || user.email}` : "Información de la cuenta"}
        body={
          <div className="p-5 space-y-4 text-xs">
            {/* Header del Perfil */}
            <div className="flex items-center gap-3.5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white font-bold text-sm dark:bg-zinc-100 dark:text-zinc-950">
                {user?.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                  : <User className="h-5 w-5" />}
              </div>
              <div>
                <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  {user?.name || "Usuario no especificado"}
                </h4>
                <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] mt-0.5">
                  <Mail className="h-3 w-3" />
                  <span>{user?.email || "sin-correo@ejemplo.com"}</span>
                </div>
              </div>
            </div>

            {/* Metadatos */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-zinc-200 p-2.5 dark:border-zinc-800">
                <span className="text-[10px] uppercase font-mono text-zinc-400 block mb-0.5">
                  Rol / Permisos
                </span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                  <Shield className="h-3 w-3 text-zinc-500" />
                  {user?.role || "Estándar"}
                </span>
              </div>

              <div className="rounded-lg border border-zinc-200 p-2.5 dark:border-zinc-800">
                <span className="text-[10px] uppercase font-mono text-zinc-400 block mb-0.5">
                  Estado
                </span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-emerald-500" />
                  {user?.status || "Activo"}
                </span>
              </div>
            </div>

            {user?.joinedAt && (
              <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] pt-1">
                <Calendar className="h-3 w-3" />
                <span>Registrado el {user.joinedAt}</span>
              </div>
            )}
          </div>
        }
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={hideModal}>
              Cerrar
            </Button>
            {options.onEdit && user && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  options.onEdit?.(user);
                  hideModal();
                }}
              >
                Editar Usuario
              </Button>
            )}
          </div>
        }
      />
    );
  }, [isOpen, user, hideModal, options]);

  // Componente alternativo si se prefiere usar como `<UserModal />`
  const UserModalComponent = useCallback(() => userModalElement, [userModalElement]);

  return {
    isOpen,
    showModal,
    hideModal,
    closeModal: hideModal,
    user,
    setUser,
    /** Elemento JSX listo para incrustar directamente `{userModal}` */
    userModal: userModalElement,
    /** Componente vinculado `<UserModal />` */
    UserModal: UserModalComponent,
  };
}

export default useUserModal;
