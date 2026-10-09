import {
  useEffect,
  useRef,
  type ReactNode,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export type ModalSize =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "full"
  | "pequeño"
  | "mediano"
  | "grande";

export type ModalHorizontal = "center" | "left" | "right";

export type ModalVertical = "center" | "upper" | "lower" | "top" | "bottom";

export type ModalBlur = "none" | "xs" | "sm" | "md" | "lg" | "xl" | boolean;

export interface ModalProps {
  /** Determina si el modal está visible */
  isOpen: boolean;
  /** Función que se ejecuta al solicitar el cierre */
  onClose: () => void;
  /** Tamaño del modal: pequeño (sm), mediano (md) o grande (lg/xl/full) */
  size?: ModalSize;
  /** Ubicación horizontal: 'center' | 'left' | 'right' */
  horizontal?: ModalHorizontal;
  /** Ubicación vertical: 'center' | 'upper' (arriba) | 'lower' (abajo) */
  vertical?: ModalVertical;
  /** Encabezado del modal (nodo personalizado) */
  header?: ReactNode;
  /** Título rápido si no se provee un header personalizado */
  title?: ReactNode;
  /** Subtítulo o descripción breve */
  description?: ReactNode;
  /** Contenido principal del modal (nodo `body`) */
  body?: ReactNode;
  /** Contenido alternativo / complementario como children */
  children?: ReactNode;
  /** Pie del modal (acciones, botones, atajos) */
  footer?: ReactNode;
  /** Determina si el modal se cierra al hacer clic en el backdrop externo (por defecto: true) */
  closeOnClickOutside?: boolean;
  /** Determina si se muestra el botón de cerrar [X] (por defecto: true) */
  showCloseButton?: boolean;
  /** Control del nivel de desenfoque de fondo: 'none', 'xs', 'sm', 'md', 'lg', 'xl' o boolean */
  blur?: ModalBlur;
  /** Control del color de fondo del overlay (clase Tailwind como 'bg-black/60' o valor CSS como 'rgba(0,0,0,0.5)') */
  overlayColor?: string;
  /** Clase CSS adicional para el contenedor del modal */
  className?: string;
  /** Clase CSS adicional para el área del body */
  bodyClassName?: string;
  /** Clase CSS adicional para el área del header */
  headerClassName?: string;
  /** Clase CSS adicional para el área del footer */
  footerClassName?: string;
  /** Si debe cerrarse al presionar la tecla Escape (por defecto: true) */
  closeOnEsc?: boolean;
  /** Callback para eventos de teclado en el contenedor */
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
}

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: "max-w-md",
  pequeño: "max-w-md",
  md: "max-w-lg",
  mediano: "max-w-lg",
  lg: "max-w-3xl",
  grande: "max-w-3xl",
  xl: "max-w-5xl",
  full: "max-w-[calc(100vw-2rem)] min-h-[calc(100vh-4rem)]",
};

const HORIZONTAL_CLASSES: Record<ModalHorizontal, string> = {
  center: "justify-center",
  left: "justify-start",
  right: "justify-end",
};

const VERTICAL_CLASSES: Record<ModalVertical, string> = {
  center: "items-center",
  upper: "items-start pt-16 md:pt-20",
  top: "items-start pt-16 md:pt-20",
  lower: "items-end pb-12 md:pb-16",
  bottom: "items-end pb-12 md:pb-16",
};

const BLUR_CLASSES: Record<string, string> = {
  none: "",
  xs: "backdrop-blur-xs",
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
};

export function Modal({
  isOpen,
  onClose,
  size = "md",
  horizontal = "center",
  vertical = "center",
  header,
  title,
  description,
  body,
  children,
  footer,
  closeOnClickOutside = true,
  showCloseButton = true,
  blur = "xs",
  overlayColor = "bg-black/60",
  className = "",
  bodyClassName = "",
  headerClassName = "",
  footerClassName = "",
  closeOnEsc = true,
  onKeyDown,
}: ModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Bloqueo de scroll en el body mientras el modal esté abierto
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Manejo de la tecla Escape a nivel global
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDownGlobal = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDownGlobal);
    return () => {
      window.removeEventListener("keydown", handleKeyDownGlobal);
    };
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen) return null;

  // Resolver clase de desenfoque (blur)
  let blurClass = "";
  if (typeof blur === "boolean") {
    blurClass = blur ? "backdrop-blur-sm" : "";
  } else if (typeof blur === "string") {
    blurClass = BLUR_CLASSES[blur] ?? `backdrop-blur-[${blur}]`;
  }

  // Resolver color de overlay
  const isTailwindClass = overlayColor.trim().startsWith("bg-");
  const overlayStyle = !isTailwindClass ? { backgroundColor: overlayColor } : undefined;
  const overlayClassNames = isTailwindClass ? overlayColor : "";

  // Determinar clases de posición y tamaño
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const horizontalClass = HORIZONTAL_CLASSES[horizontal] || HORIZONTAL_CLASSES.center;
  const verticalClass = VERTICAL_CLASSES[vertical] || VERTICAL_CLASSES.center;

  // Manejador del clic en el overlay externo
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnClickOutside) {
      onClose();
    }
  };

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
      className={`fixed inset-0 z-50 flex p-4 transition-all duration-200 ${horizontalClass} ${verticalClass} ${blurClass} ${overlayClassNames}`}
      style={overlayStyle}
    >
      <div
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        className={`w-full ${sizeClass} flex flex-col overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] shadow-2xl transition-all ${className}`}
      >
        {/* Header */}
        {(header || title || showCloseButton) && (
          <div
            className={`flex items-center justify-between border-b border-[var(--border)] px-4 py-3 ${headerClassName}`}
          >
            {header ? (
              <div className="flex-1">{header}</div>
            ) : (
              <div className="flex-1 min-w-0 pr-2">
                {title && (
                  <h3 className="text-sm font-semibold text-[var(--card-foreground)] truncate">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-xs text-[var(--card-foreground)]/60 truncate">
                    {description}
                  </p>
                )}
              </div>
            )}

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar modal"
                className="shrink-0 rounded-[var(--radius)] p-1 text-[var(--card-foreground)]/60 hover:bg-[var(--border)]/30 hover:text-[var(--card-foreground)] transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className={`flex-1 overflow-y-auto ${bodyClassName}`}>
          {body}
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className={`border-t border-[var(--border)] bg-[var(--background)]/50 px-4 py-3 ${footerClassName}`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(content, document.body);
  }

  return content;
}

export default Modal;
