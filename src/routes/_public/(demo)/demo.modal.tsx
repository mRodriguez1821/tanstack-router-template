import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Maximize2,
  Sliders,
  Sparkles,
} from "lucide-react";
import {
  Modal,
  type ModalSize,
  type ModalHorizontal,
  type ModalVertical,
  type ModalBlur,
} from "@/common/components/Modal";
import { Button } from "@/common/components/Button";
import { useToast } from "@/common/hooks/useToast";
import { useModal, confirmModal, showModal as triggerGlobalModal } from "@/common/hooks/useModal";
import { useUserModal } from "@/common/hooks/useUserModal";

export const Route = createFileRoute("/_public/(demo)/demo/modal")({
  component: DemoModalPage,
});

export function DemoModalPage() {
  const toast = useToast();

  // 1. Hook useUserModal (hereda la lógica sin controlar isOpen manualmente)
  const { showModal: showUserModal, userModal } = useUserModal({
    onEdit: (u) => toast.info(`Acción de editar usuario disparada: ${u.name}`),
  });

  // 2. Hook useModal genérico con pre-vinculación automática de isOpen y onClose
  const { showModal: showCustomBoundModal, Modal: BoundModal } = useModal();

  // State for interactive playground (Modo declarativo con parámetros manuales)
  const [isOpen, setIsOpen] = useState(false);
  const [size, setSize] = useState<ModalSize>("md");
  const [horizontal, setHorizontal] = useState<ModalHorizontal>("center");
  const [vertical, setVertical] = useState<ModalVertical>("center");
  const [blur, setBlur] = useState<ModalBlur>("sm");
  const [overlayColor, setOverlayColor] = useState("bg-black/60");
  const [closeOnClickOutside, setCloseOnClickOutside] = useState(true);
  const [showCloseButton, setShowCloseButton] = useState(true);

  // Modal custom contents
  const [titleText, setTitleText] = useState("Ejemplo de Modal Configurable");
  const [descriptionText, setDescriptionText] = useState(
    "Este modal demuestra las opciones de tamaño, posición, blur y controles de cierre."
  );

  return (
    <div className="flex flex-col flex-1 min-h-0 space-y-8 p-4 md:p-8 max-w-5xl mx-auto w-full">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/demo"
          className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition flex items-center gap-1 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          &larr; Volver a Demos
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
            <Maximize2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Componente Reutilizable: Modal
            </h1>
            <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
              Modal parametrizable con soporte para tamaños, alineación bidireccional (horizontal y vertical), slots para header/body/footer, control de backdrop blur y color de overlay.
            </p>
          </div>
        </div>
      </div>

      {/* Playground Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dimension & Placement */}
        <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
            <Sliders className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Dimensiones y Posicionamiento
            </h2>
          </div>

          {/* Size */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Tamaño (size)
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(["pequeño", "mediano", "grande", "full"] as ModalSize[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`rounded-lg border px-2 py-1.5 text-xs font-medium capitalize transition ${
                    size === s
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                      : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Horizontal Position */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Ubicación Horizontal (horizontal)
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(["left", "center", "right"] as ModalHorizontal[]).map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHorizontal(h)}
                  className={`rounded-lg border px-2 py-1.5 text-xs font-medium capitalize transition ${
                    horizontal === h
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                      : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Vertical Position */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Ubicación Vertical (vertical)
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(["upper", "center", "lower"] as ModalVertical[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVertical(v)}
                  className={`rounded-lg border px-2 py-1.5 text-xs font-medium capitalize transition ${
                    vertical === v
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                      : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Backdrop, Blur & Behavior */}
        <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
            <Sparkles className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Overlay, Blur y Comportamiento
            </h2>
          </div>

          {/* Blur */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Nivel de Desenfoque (blur)
            </label>
            <div className="grid grid-cols-6 gap-1">
              {(["none", "xs", "sm", "md", "lg", "xl"] as ModalBlur[]).map((b) => (
                <button
                  key={String(b)}
                  type="button"
                  onClick={() => setBlur(b)}
                  className={`rounded-lg border px-2 py-1.5 text-xs font-mono uppercase transition ${
                    blur === b
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                      : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
                  }`}
                >
                  {String(b)}
                </button>
              ))}
            </div>
          </div>

          {/* Overlay Color */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Color de Overlay (overlayColor)
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: "Negro 60%", val: "bg-black/60" },
                { label: "Negro 80%", val: "bg-black/80" },
                { label: "Zinc Opaco", val: "bg-zinc-950/70" },
                { label: "Índigo Translúcido", val: "rgba(30, 27, 75, 0.75)" },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setOverlayColor(opt.val)}
                  className={`rounded-lg border p-2 text-left transition ${
                    overlayColor === opt.val
                      ? "border-zinc-900 bg-zinc-100 font-semibold dark:border-zinc-100 dark:bg-zinc-800"
                      : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                  }`}
                >
                  <div className="truncate">{opt.label}</div>
                  <div className="font-mono text-[10px] text-zinc-400 truncate">{opt.val}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Boolean switches */}
          <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={closeOnClickOutside}
                onChange={(e) => setCloseOnClickOutside(e.target.checked)}
                className="rounded accent-zinc-900 dark:accent-zinc-100"
              />
              <span><strong>closeOnClickOutside</strong>: Cerrar al dar clic fuera del modal</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={showCloseButton}
                onChange={(e) => setShowCloseButton(e.target.checked)}
                className="rounded accent-zinc-900 dark:accent-zinc-100"
              />
              <span><strong>showCloseButton</strong>: Mostrar botón [X] en encabezado</span>
            </label>
          </div>
        </div>
      </div>

      {/* Advanced Hook Patterns: useUserModal, useModal, and confirmModal */}
      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold tracking-wide uppercase text-zinc-500 dark:text-zinc-400">
            Patrones de Uso: Hooks sin Control Manual de isOpen
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Disfruta de modales listos para usar sin tener que declarar `const [isOpen, setIsOpen] = useState(false)` ni configurar `onClose` en cada archivo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: useUserModal */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-3 dark:border-zinc-800 dark:bg-zinc-950 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900 text-white font-mono text-[10px] dark:bg-zinc-100 dark:text-zinc-950">
                  1
                </span>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  Hook useUserModal
                </h3>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Hereda el modal de usuario completo con <code className="text-zinc-800 dark:text-zinc-200 font-mono text-[10px]">&#123; showModal, userModal &#125;</code>.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                showUserModal({
                  name: "Mariana Silva",
                  email: "mariana.silva@empresa.com",
                  role: "Gerente de Producto",
                  status: "activo",
                  joinedAt: "05 de Marzo 2024",
                })
              }
              className="w-full text-xs"
            >
              Probar &#123; userModal &#125;
            </Button>
          </div>

          {/* Card 2: useModal bound component */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-3 dark:border-zinc-800 dark:bg-zinc-950 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900 text-white font-mono text-[10px] dark:bg-zinc-100 dark:text-zinc-950">
                  2
                </span>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  Hook Genérico useModal
                </h3>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Devuelve un <code className="text-zinc-800 dark:text-zinc-200 font-mono text-[10px]">&lt;Modal&gt;</code> que ya tiene <code className="text-zinc-800 dark:text-zinc-200 font-mono text-[10px]">isOpen</code> y <code className="text-zinc-800 dark:text-zinc-200 font-mono text-[10px]">onClose</code> pre-vinculados.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => showCustomBoundModal()}
              className="w-full text-xs"
            >
              Probar &#123; showModal, Modal &#125;
            </Button>
          </div>

          {/* Card 3: confirmModal (Promise-based) */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-3 dark:border-zinc-800 dark:bg-zinc-950 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900 text-white font-mono text-[10px] dark:bg-zinc-100 dark:text-zinc-950">
                  3
                </span>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  confirmModal() Imperativo
                </h3>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Invoca un diálogo con <code className="text-zinc-800 dark:text-zinc-200 font-mono text-[10px]">await confirmModal(...)</code> sin escribir JSX en el componente.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const ok = await confirmModal({
                    title: "¿Confirmar aprobación de solicitud?",
                    description: "Esta acción actualizará el estado de la transacción inmediatamente.",
                    confirmText: "Aprobar ahora",
                    cancelText: "Descartar",
                  });
                  if (ok) {
                    toast.success("¡Confirmación recibida exitosamente!");
                  } else {
                    toast.info("Acción descartada por el usuario.");
                  }
                }}
                className="flex-1 text-xs"
              >
                confirmModal()
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  triggerGlobalModal({
                    title: "Modal Imperativo Global",
                    description: "Invocado mediante función showModal() sin ningún JSX local.",
                    body: (
                      <p className="p-4 text-xs text-zinc-600 dark:text-zinc-400">
                        Este modal es renderizado automáticamente por el componente host `&lt;ModalHost /&gt;` montado en la raíz.
                      </p>
                    ),
                    size: "sm",
                  });
                }}
                className="flex-1 text-xs"
              >
                showModal()
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Renders for Hook-based Modals */}
      {/* 1. useUserModal JSX element */}
      {userModal}

      {/* 2. useModal Pre-bound Component */}
      <BoundModal
        title="Modal Pre-vinculado con useModal()"
        description="Este componente no necesitó pasar isOpen ni onClose. Se controló enteramente con showModal()."
        size="md"
        body={
          <div className="p-4 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
            <p>
              ¡Cero boilerplate de estado! Puedes pasar cualquier prop que soporte el Modal estándar (size, vertical, horizontal, blur, etc.).
            </p>
          </div>
        }
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                toast.success("Completado");
                // Cierre automático disponible o hideModal
              }}
            >
              Listo
            </Button>
          </div>
        }
      />

      {/* Trigger & Presets */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center space-y-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Probar Modal en Acción
        </h3>
        <p className="text-xs text-zinc-500 max-w-lg mx-auto dark:text-zinc-400">
          Haz clic en el botón principal para abrir el modal con la configuración seleccionada arriba, o elige uno de los casos de uso predefinidos:
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsOpen(true)}
            className="shadow-md"
          >
            Abrir Modal con Configuración Actual
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSize("sm");
              setHorizontal("center");
              setVertical("center");
              setBlur("xs");
              setTitleText("¿Eliminar elemento?");
              setDescriptionText("Esta acción es irreversible y removerá el registro permanentemente.");
              setIsOpen(true);
            }}
          >
            Preset: Diálogo de Alerta (Pequeño, Centro)
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSize("md");
              setHorizontal("center");
              setVertical("upper");
              setBlur("md");
              setTitleText("Paleta de Comandos");
              setDescriptionText("Estilo similar a Ctrl + K (upper, center, blur medio).");
              setIsOpen(true);
            }}
          >
            Preset: Comando / Búsqueda (Upper)
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSize("md");
              setHorizontal("right");
              setVertical("center");
              setBlur("sm");
              setTitleText("Panel Lateral");
              setDescriptionText("Alineado hacia la derecha como un drawer lateral.");
              setIsOpen(true);
            }}
          >
            Preset: Lateral / Drawer (Right)
          </Button>
        </div>
      </div>

      {/* The Configured Modal Instance */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size={size}
        horizontal={horizontal}
        vertical={vertical}
        blur={blur}
        overlayColor={overlayColor}
        closeOnClickOutside={closeOnClickOutside}
        showCloseButton={showCloseButton}
        title={titleText}
        description={descriptionText}
        body={
          <div className="p-4 space-y-4 text-xs">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
              <span className="font-semibold text-zinc-800 block mb-1 dark:text-zinc-200">
                Parámetros Activos:
              </span>
              <ul className="grid grid-cols-2 gap-1 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                <li>size: <strong>{size}</strong></li>
                <li>horizontal: <strong>{horizontal}</strong></li>
                <li>vertical: <strong>{vertical}</strong></li>
                <li>blur: <strong>{String(blur)}</strong></li>
                <li>closeOnClickOutside: <strong>{String(closeOnClickOutside)}</strong></li>
                <li>showCloseButton: <strong>{String(showCloseButton)}</strong></li>
              </ul>
            </div>

            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              El contenido del cuerpo (`body` o `children`) es flexible y se adapta automáticamente con scroll vertical independiente cuando supera el alto del viewport.
            </p>

            <div className="space-y-1.5">
              <label className="font-medium text-zinc-700 dark:text-zinc-300 block">
                Campo de prueba dentro del modal:
              </label>
              <input
                type="text"
                placeholder="Escribe aquí para probar interacción..."
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
          </div>
        }
        footer={
          <div className="flex items-center justify-between">
            <p></p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Cerrar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  toast.success("¡Acción confirmada desde el footer del modal!");
                  setIsOpen(false);
                }}
              >
                Confirmar
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
}
