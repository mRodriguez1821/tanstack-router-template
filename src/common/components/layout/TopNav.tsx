import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Search,
  Bell,
  Menu,
  ChevronRight,
  Check,
  Palette,
  Globe,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS, type SupportedLanguage } from "@/common/i18n";
import { APP_ENV } from "@/common/lib/env";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface TopNavProps {
  onOpenSearchModal: () => void;
  onToggleMobileSidebar: () => void;
  onToggleDesktopSidebar?: () => void;
  isDesktopSidebarOpen?: boolean;
}

export function TopNav({
  onOpenSearchModal,
  onToggleMobileSidebar,
  onToggleDesktopSidebar,
  isDesktopSidebarOpen = true,
}: TopNavProps) {
  const location = useLocation();
  const { i18n } = useTranslation();
  const currentLanguage = (i18n.resolvedLanguage || i18n.language || "es").split("-")[0] as SupportedLanguage;

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  // Notifications popup
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  // Compute Breadcrumbs
  const breadcrumbs = useMemo((): BreadcrumbItem[] => {
    const path = location.pathname;

    if (path === "/" || path === "" || path === "/home") {
      return [{ label: "Inicio" }];
    }

    if (path.startsWith("/users")) {
      const parts = path.split("/").filter(Boolean);
      if (parts.length === 1) {
        return [{ label: "Inicio", path: "/home" }, { label: "Usuarios" }];
      }
      return [
        { label: "Inicio", path: "/home" },
        { label: "Usuarios", path: "/users" },
        { label: `Detalle` },
      ];
    }

    if (path.startsWith("/demo/themes")) {
      return [
        { label: "Demos", path: "/demo" },
        { label: "Configurador de Temas" },
      ];
    }

    if (path.startsWith("/demo/toasts")) {
      return [
        { label: "Demos", path: "/demo" },
        { label: "Sistema de Toasts" },
      ];
    }

    if (path.startsWith("/demo/modal")) {
      return [
        { label: "Demos", path: "/demo" },
        { label: "Componente Modal" },
      ];
    }

    if (path.startsWith("/demo/form")) {
      return [
        { label: "Demos", path: "/demo" },
        { label: "Pantallas de Formulario" },
      ];
    }

    if (path.startsWith("/demo/storage")) {
      return [
        { label: "Demos", path: "/demo" },
        { label: "Encrypted Storage" },
      ];
    }

    if (path.startsWith("/demo")) {
      return [{ label: "Inicio", path: "/" }, { label: "Hub de Demos" }];
    }

    if (path.startsWith("/about")) {
      return [{ label: "Inicio", path: "/" }, { label: "Acerca de" }];
    }

    return [{ label: "Inicio", path: "/" }, { label: path.replace(/^\//, "") }];
  }, [location.pathname]);

  return (
    <header className="flex h-14 min-h-[3.5rem] items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-4 text-[var(--card-foreground)] transition-colors duration-200 md:px-6">
      {/* Left: Hamburger + Breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Sidebar Toggle Button (Mobile & Desktop) */}
        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined" && window.innerWidth < 768) {
              onToggleMobileSidebar();
            } else {
              onToggleDesktopSidebar?.();
            }
          }}
          className={`h-8 w-8 items-center justify-center rounded-[var(--radius)] border border-[var(--border)] text-[var(--card-foreground)]/80 hover:bg-[var(--border)]/30 hover:text-[var(--card-foreground)] transition-colors cursor-pointer ${
            isDesktopSidebarOpen ? "flex md:hidden" : "flex"
          }`}
          title={
            isDesktopSidebarOpen
              ? "Ocultar menú lateral"
              : "Mostrar menú lateral"
          }
          aria-label={
            isDesktopSidebarOpen
              ? "Ocultar menú lateral"
              : "Mostrar menú lateral"
          }
        >
          <Menu className="h-4 w-4" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <div key={idx} className="flex items-center gap-1.5">
                {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-[var(--card-foreground)]/40" />}
                {isLast ? (
                  <span className="font-semibold text-[var(--card-foreground)]">
                    {crumb.label}
                  </span>
                ) : crumb.path ? (
                  <Link
                    to={crumb.path}
                    className="text-[var(--card-foreground)]/60 hover:text-[var(--card-foreground)] transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[var(--card-foreground)]/60">
                    {crumb.label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick Search Trigger */}
        <button
          type="button"
          onClick={onOpenSearchModal}
          className="group flex h-8 items-center gap-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-2.5 text-xs text-[var(--foreground)]/70 transition hover:border-[var(--primary)]/50 hover:bg-[var(--border)]/20 md:px-3 cursor-pointer"
          title="Buscar (Ctrl + K)"
        >
          <Search className="h-3.5 w-3.5 text-[var(--foreground)]/50 transition group-hover:text-[var(--foreground)]" />
          <span className="hidden sm:inline">Buscar...</span>
          <kbd className="hidden font-mono text-[10px] sm:inline-flex items-center rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] px-1.5 py-0.2 text-[var(--foreground)]/60">
            Ctrl K
          </kbd>
        </button>

        {/* Environment Badge */}
        <div
          className="hidden sm:inline-flex items-center rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-[var(--foreground)] uppercase"
          title={`Entorno actual: ${APP_ENV}`}
        >
          {APP_ENV}
        </div>

        {/* Language Selector */}
        <div className="relative flex items-center">
          <Globe className="pointer-events-none absolute left-2 h-3.5 w-3.5 text-[var(--foreground)]/50" />
          <select
            value={currentLanguage}
            onChange={handleLanguageChange}
            className="h-8 appearance-none rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] pl-7 pr-3 text-xs font-medium text-[var(--foreground)] transition hover:border-[var(--border)] focus:border-[var(--primary)] focus:outline-hidden cursor-pointer"
            title="Seleccionar idioma"
            aria-label="Seleccionar idioma"
          >
            {SUPPORTED_LANGUAGES.map((lng) => (
              <option
                key={lng}
                value={lng}
                className="bg-[var(--card)] text-[var(--card-foreground)]"
              >
                {LANGUAGE_LABELS[lng]}
              </option>
            ))}
          </select>
        </div>

        {/* Theme Configurator Shortcut */}
        <Link
          to="/demo/themes"
          className="flex h-8 w-8 items-center justify-center rounded-[var(--radius)] border border-[var(--border)] text-[var(--card-foreground)]/80 hover:bg-[var(--border)]/30 hover:text-[var(--card-foreground)] transition-colors"
          title="Configurador de Temas"
        >
          <Palette className="h-4 w-4" />
        </Link>

        {/* Notifications Popover */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative flex h-8 w-8 items-center justify-center rounded-[var(--radius)] border border-[var(--border)] text-[var(--card-foreground)]/80 hover:bg-[var(--border)]/30 hover:text-[var(--card-foreground)] transition-colors cursor-pointer"
            title="Notificaciones"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[var(--primary)] ring-2 ring-[var(--card)]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 z-30 mt-2 w-72 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] p-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--card-foreground)]/80">
                  Notificaciones
                </span>
                <span className="cursor-pointer text-[11px] font-medium text-[var(--card-foreground)]/60 hover:text-[var(--card-foreground)]">
                  Marcar leídas
                </span>
              </div>
              <div className="divide-y divide-[var(--border)] mt-1 max-h-60 overflow-y-auto">
                <div className="py-2 px-1 text-xs text-[var(--card-foreground)]">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Check className="h-3 w-3 text-[var(--primary)]" />
                    <span>Sesión autenticada</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-[var(--card-foreground)]/60">
                    Tokens almacenados con AES-GCM noble.
                  </p>
                </div>
                <div className="py-2 px-1 text-xs text-[var(--card-foreground)]">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Check className="h-3 w-3 text-[var(--primary)]" />
                    <span>Router listo</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-[var(--card-foreground)]/60">
                    Árbol de rutas compilado y verificado.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopNav;
