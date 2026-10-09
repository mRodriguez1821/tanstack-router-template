import { Link, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/common/context/useAuth";
import { APP_ENV } from "@/common/lib/env";

export function PublicLayout() {
  const { isAuthenticated, currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200 font-sans">
      <header className="p-2 flex items-center gap-4 border-b border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-xs transition-colors duration-200">
        <Link
          to="/"
          className="[&.active]:font-bold text-[var(--foreground)] opacity-70 hover:opacity-100 transition-opacity"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="[&.active]:font-bold text-[var(--foreground)] opacity-70 hover:opacity-100 transition-opacity"
        >
          About
        </Link>
       
        <Link
          to="/demo"
          className="[&.active]:font-bold text-[var(--foreground)] opacity-70 hover:opacity-100 transition-opacity"
        >
          Demos
        </Link>

        <span
          className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-[calc(var(--radius)*0.5)] border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
          title={`Entorno actual: ${APP_ENV}`}
        >
          {APP_ENV}
        </span>

        <div className="ml-auto flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="text-[var(--foreground)] opacity-75 font-medium">
                {currentUser?.displayName || "Usuario conectado"}
              </span>
              <button
                type="button"
                onClick={() => logout()}
                className="px-2.5 py-1 text-xs bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius)] font-medium hover:opacity-90 cursor-pointer transition-opacity"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-2.5 py-1 text-xs bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius)] font-medium hover:opacity-90 transition-opacity"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 bg-[var(--background)] transition-colors duration-200">
        <Outlet />
      </main>
    </div>
  );
}
