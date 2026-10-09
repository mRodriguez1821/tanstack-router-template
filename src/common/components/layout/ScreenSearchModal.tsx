import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, CornerDownLeft, Layers, Users, Bell, Lock, Palette, Maximize2, FileEdit, Info, Home } from "lucide-react";
import { Modal } from "@/common/components/Modal";

export interface ScreenItem {
  id: string;
  title: string;
  category: string;
  path: string;
  description?: string;
  keywords?: string[];
  icon: typeof Home;
}

export const SCREEN_REGISTRY: ScreenItem[] = [
  {
    id: "home",
    title: "Inicio (Home)",
    category: "General",
    path: "/",
    description: "Página principal de bienvenida",
    keywords: ["inicio", "home", "dashboard"],
    icon: Home,
  },
  {
    id: "users",
    title: "Directorio de Usuarios",
    category: "Administración",
    path: "/users",
    description: "Listado de usuarios protegidos con TanStack Query",
    keywords: ["usuarios", "users", "administracion", "query"],
    icon: Users,
  },
  {
    id: "demos",
    title: "Hub de Demos",
    category: "Desarrollo",
    path: "/demo",
    description: "Índice de pruebas y componentes demostrativos",
    keywords: ["demos", "ejemplos", "showcase"],
    icon: Layers,
  },
  {
    id: "demo-toasts",
    title: "Sistema de Toasts",
    category: "Desarrollo",
    path: "/demo/toasts",
    description: "Notificaciones interactivas toast con Zustand",
    keywords: ["toasts", "alertas", "notificaciones"],
    icon: Bell,
  },
  {
    id: "demo-storage",
    title: "Encrypted Storage (AES-GCM)",
    category: "Desarrollo",
    path: "/demo/storage",
    description: "Almacenamiento seguro con hash SHA-256 en claves y cifrado",
    keywords: ["storage", "cifrado", "seguridad", "noble", "crypto"],
    icon: Lock,
  },
  {
    id: "demo-themes",
    title: "Configurador y Creador de Temas",
    category: "Personalización",
    path: "/demo/themes",
    description: "Paletas de color, temas claro/oscuro, radio de bordes y temas custom",
    keywords: ["temas", "themes", "colores", "dark", "light", "palette", "diseño"],
    icon: Palette,
  },
  {
    id: "demo-modal",
    title: "Componente Reutilizable Modal",
    category: "Componentes",
    path: "/demo/modal",
    description: "Modal interactivo parametrizable (tamaños, posición, blur y slots)",
    keywords: ["modal", "dialog", "ventana", "popup", "dialogo"],
    icon: Maximize2,
  },
  {
    id: "demo-form",
    title: "Pantallas de Formulario (FormPage)",
    category: "Componentes",
    path: "/demo/form",
    description: "Layout de formulario con auto-guardado de borradores y sincronización con URL",
    keywords: ["formulario", "form", "borrador", "draft", "inputs", "editar"],
    icon: FileEdit,
  },
  {
    id: "about",
    title: "Acerca de la plantilla",
    category: "General",
    path: "/about",
    description: "Información técnica y dependencias del template",
    keywords: ["about", "acerca", "info"],
    icon: Info,
  },
];

export interface ScreenSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScreenSearchModal({ isOpen, onClose }: ScreenSearchModalProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredScreens = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return SCREEN_REGISTRY;

    return SCREEN_REGISTRY.filter((screen) => {
      const inTitle = screen.title.toLowerCase().includes(term);
      const inCategory = screen.category.toLowerCase().includes(term);
      const inDesc = screen.description?.toLowerCase().includes(term) ?? false;
      const inKeywords = screen.keywords?.some((k) => k.toLowerCase().includes(term)) ?? false;
      return inTitle || inCategory || inDesc || inKeywords;
    });
  }, [searchTerm]);

  const handleSelect = (path: string) => {
    onClose();
    navigate({ to: path });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredScreens.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredScreens.length) % (filteredScreens.length || 1));
    } else if (e.key === "Enter" && filteredScreens[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredScreens[selectedIndex].path);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="mediano"
      vertical="upper"
      horizontal="center"
      blur="xs"
      overlayColor="bg-black/60"
      closeOnClickOutside={true}
      showCloseButton={false}
      onKeyDown={handleKeyDown}
      headerClassName="p-0 border-b-0"
      header={
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] w-full">
          <Search className="h-5 w-5 text-[var(--foreground)]/50 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Buscar ruta o pantalla... (Ej. usuarios, toasts)"
            className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:outline-hidden"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--radius)] p-1 text-[var(--foreground)]/60 hover:bg-[var(--border)]/30 hover:text-[var(--foreground)] transition shrink-0 cursor-pointer"
            title="Cerrar búsqueda"
          >
            <span className="sr-only">Cerrar</span>
            <span className="font-mono text-xs">✕</span>
          </button>
        </div>
      }
      bodyClassName="max-h-80 overflow-y-auto p-2"
      body={
        filteredScreens.length === 0 ? (
          <div className="py-8 text-center text-xs text-[var(--foreground)]/60">
            No se encontraron pantallas con el término "{searchTerm}"
          </div>
        ) : (
          <div className="space-y-1">
            {filteredScreens.map((screen, idx) => {
              const isSelected = idx === selectedIndex;
              const IconComponent = screen.icon;

              return (
                <button
                  key={screen.id}
                  type="button"
                  onClick={() => handleSelect(screen.path)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex w-full items-center justify-between rounded-[var(--radius)] px-3 py-2 text-left text-xs transition cursor-pointer ${
                    isSelected
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "text-[var(--card-foreground)] hover:bg-[var(--border)]/30"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${
                        isSelected
                          ? "border-[var(--primary-foreground)]/30 bg-[var(--primary-foreground)]/10 text-[var(--primary-foreground)]"
                          : "border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]/70"
                      }`}
                    >
                      <IconComponent className="h-3.5 w-3.5" />
                    </div>
                    <div className="truncate">
                      <div className="font-medium truncate">{screen.title}</div>
                      {screen.description && (
                        <div
                          className={`text-[11px] truncate ${
                            isSelected
                              ? "text-[var(--primary-foreground)]/80"
                              : "text-[var(--foreground)]/50"
                          }`}
                        >
                          {screen.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        isSelected
                          ? "border-[var(--primary-foreground)]/30 bg-[var(--primary-foreground)]/10 text-[var(--primary-foreground)]"
                          : "border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]/60"
                      }`}
                    >
                      {screen.category}
                    </span>
                    {isSelected && <CornerDownLeft className="h-3.5 w-3.5 opacity-80" />}
                  </div>
                </button>
              );
            })}
          </div>
        )
      }
      footerClassName="p-0"
      footer={
        <div className="flex items-center justify-between px-4 py-2 text-[11px] text-[var(--foreground)]/60">
          <div className="flex items-center gap-2">
            <span>Navegar</span>
            <kbd className="rounded border border-[var(--border)] bg-[var(--card)] px-1 font-mono text-[10px] text-[var(--foreground)]/80">
              ↑
            </kbd>
            <kbd className="rounded border border-[var(--border)] bg-[var(--card)] px-1 font-mono text-[10px] text-[var(--foreground)]/80">
              ↓
            </kbd>
            <span>Seleccionar</span>
            <kbd className="rounded border border-[var(--border)] bg-[var(--card)] px-1 font-mono text-[10px] text-[var(--foreground)]/80">
              ↵
            </kbd>
          </div>
          <div>
            <kbd className="rounded border border-[var(--border)] bg-[var(--card)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--foreground)]/80">
              Esc
            </kbd>{" "}
            cerrar
          </div>
        </div>
      }
    />
  );
}

export default ScreenSearchModal;
