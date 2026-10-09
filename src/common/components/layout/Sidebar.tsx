import { Link, useNavigate } from "@tanstack/react-router";
import {
  Home,
  Users,
  Layers,
  Bell,
  Lock,
  Palette,
  Maximize2,
  ChevronLeft,
  FileEdit,
  Info,
  LogOut,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/common/context/useAuth";
import { APP_VERSION } from "@/common/lib/env";

export interface SidebarNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

export interface SidebarNavGroup {
  title: string;
  items: SidebarNavItem[];
}

export const defaultSidebarNavSections: SidebarNavGroup[] = [
  {
    title: "PRINCIPAL",
    items: [
      {
        label: "Inicio",
        href: "/home",
        icon: Home,
      },
      {
        label: "Usuarios",
        href: "/users",
        icon: Users,
        badge: "API",
      },
    ],
  },
  {
    title: "HERRAMIENTAS & LAB",
    items: [
      {
        label: "Demos Hub",
        href: "/demo",
        icon: Layers,
      },
      {
        label: "Toasts",
        href: "/demo/toasts",
        icon: Bell,
      },
      {
        label: "Storage Cifrado",
        href: "/demo/storage",
        icon: Lock,
      },
      {
        label: "Temas",
        href: "/demo/themes",
        icon: Palette,
      },
      {
        label: "Modal",
        href: "/demo/modal",
        icon: Maximize2,
      },
      {
        label: "Formularios",
        href: "/demo/form",
        icon: FileEdit,
      },
      {
        label: "Acerca de",
        href: "/about",
        icon: Info,
      },
    ],
  },
];

export interface SidebarProps {
  navSections?: SidebarNavGroup[];
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
  isOpenOnDesktop?: boolean;
  onToggleDesktop?: () => void;
}

export function Sidebar({
  navSections = defaultSidebarNavSections,
  isOpenOnMobile = false,
  onCloseMobile,
  isOpenOnDesktop = true,
  onToggleDesktop,
}: SidebarProps) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login", replace: true });
  };

  const displayName = currentUser?.displayName || currentUser?.username || "Usuario";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenOnMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] transition-all duration-300 ease-in-out md:static ${
          isOpenOnMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${
          isOpenOnDesktop
            ? "md:w-64 md:opacity-100"
            : "md:w-0 md:min-w-0 md:border-r-0 md:opacity-0 md:pointer-events-none"
        } w-64 overflow-hidden`}
      >
        <div className="flex h-full w-64 min-w-[16rem] flex-col">
          {/* Brand Header */}
          <div className="flex h-14 min-h-[3.5rem] items-center justify-between border-b border-[var(--border)] px-4">
            <Link
              to="/home"
              onClick={onCloseMobile}
              className="group flex items-center gap-2.5 font-semibold text-[var(--card-foreground)] tracking-tight"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] text-[var(--primary)] shadow-xs group-hover:border-[var(--primary)]/40 transition">
                <Shield className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight">AppTemplate</span>
                <span className="rounded border border-[var(--border)] bg-[var(--background)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--card-foreground)]/70">
                  v{APP_VERSION}
                </span>
              </div>
            </Link>

            {onToggleDesktop && (
              <button
                type="button"
                onClick={onToggleDesktop}
                className="hidden md:flex h-7 w-7 items-center justify-center rounded-[var(--radius)] text-[var(--card-foreground)]/60 hover:bg-[var(--border)]/30 hover:text-[var(--card-foreground)] transition cursor-pointer"
                title="Ocultar menú lateral"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
          </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-[var(--card-foreground)]/50 uppercase">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={onCloseMobile}
                      activeOptions={{ exact: item.href === "/" }}
                      className="group flex items-center justify-between rounded-[var(--radius)] px-3 py-2 text-xs font-medium text-[var(--card-foreground)]/70 transition hover:bg-[var(--border)]/30 hover:text-[var(--card-foreground)]"
                      activeProps={{
                        className:
                          "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold shadow-xs hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]",
                      }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className="h-4 w-4 shrink-0 transition" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="rounded border border-[var(--border)] bg-[var(--background)] px-1.5 py-0.2 font-mono text-[10px] text-[var(--card-foreground)]/80">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Profile & Logout */}
        <div className="border-t border-[var(--border)] p-3 bg-[var(--card)]">
          <div className="flex items-center justify-between gap-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)]/60 p-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--primary)] font-bold text-xs text-[var(--primary-foreground)]">
                {initials}
              </div>
              <div className="min-w-0 truncate">
                <div className="text-xs font-semibold text-[var(--card-foreground)] truncate">
                  {displayName}
                </div>
                <div className="text-[10px] text-[var(--card-foreground)]/60 truncate font-mono">
                  {currentUser?.email || currentUser?.username || "autenticado"}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius)] border border-[var(--border)] text-[var(--card-foreground)]/70 hover:bg-[var(--border)]/40 hover:text-[var(--card-foreground)] transition cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}

export default Sidebar;
