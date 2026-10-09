import { type ReactNode } from "react";
import { Clock, Trash2, CheckCircle2 } from "lucide-react";
import { PageHeader } from "./PageHeader";
import { Button } from "../Button";

export interface FormPageProps {
  /** Título de la pantalla de formulario */
  title: ReactNode;
  /** Subtítulo o descripción */
  description?: ReactNode;
  /** Elemento principal de acción en el header (ej. Botón Guardar) */
  actionElement?: ReactNode;
  /** Elementos secundarios de acción en el header (ej. Botón Cancelar) */
  headerExtra?: ReactNode;
  /** Contenido adicional entre el encabezado y el formulario */
  headerSlot?: ReactNode;
  /** Si hay un borrador guardado en storage o restaurado */
  isDraftSaved?: boolean;
  /** Fecha u hora en la que se guardó el último borrador */
  lastSavedAt?: Date | string | null;
  /** Callback para descartar y limpiar el borrador guardado */
  onClearDraft?: () => void;
  /** Contenido principal del formulario */
  children?: ReactNode;
  /** Pie o barra inferior de acciones */
  footerSlot?: ReactNode;
  /** Envuelve el formulario en una tarjeta estilizada (por defecto: true) */
  cardLayout?: boolean;
  /** Clases CSS adicionales para el contenedor principal */
  className?: string;
}

/**
 * Componente de diseño para pantallas tipo formulario (`FormPage`).
 * Proporciona encabezado unificado, barra de estado de borrador (draft auto-save),
 * contenedor de tarjetas y barra de acciones.
 */
export function FormPage({
  title,
  description = "",
  actionElement,
  headerExtra,
  headerSlot,
  isDraftSaved = false,
  lastSavedAt,
  onClearDraft,
  children,
  footerSlot,
  cardLayout = true,
  className = "",
}: FormPageProps) {
  const formattedTime =
    lastSavedAt instanceof Date
      ? lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      : lastSavedAt;

  return (
    <div className={`flex flex-col flex-1 h-full min-h-0 space-y-4  mx-auto w-full ${className}`}>
      {/* Header unificado */}
      <PageHeader
        title={title}
        description={description}
        actionElement={
          actionElement || headerExtra ? (
            <div className="flex items-center gap-2">
              {headerExtra}
              {actionElement}
            </div>
          ) : undefined
        }
      />

      {headerSlot}

      {/* Indicador de Borrador Guardado / Restaurado */}
      {isDraftSaved && (
        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span className="font-medium">
              Borrador guardado
            </span>
            {formattedTime && (
              <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono">
                <Clock className="h-3 w-3" />
                {formattedTime}
              </span>
            )}
          </div>

          {onClearDraft && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearDraft}
              className="text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 h-7 px-2 text-[11px]"
              title="Descartar"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Descartar
            </Button>
          )}
        </div>
      )}

      {/* Contenedor del Formulario */}
      <div
        className={
          cardLayout
            ? "flex-1 rounded-2xl border border-zinc-200 bg-white p-5 md:p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 flex flex-col justify-between"
            : "flex-1 flex flex-col justify-between"
        }
      >
        <div className="space-y-6">{children}</div>

        {/* Footer de Acciones del Formulario */}
        {footerSlot && (
          <div className="pt-6 mt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-2.5">
            {footerSlot}
          </div>
        )}
      </div>
    </div>
  );
}

export default FormPage;
