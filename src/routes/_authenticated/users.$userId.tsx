import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, User, Mail, Shield, Key } from "lucide-react";
import { PageLayout } from "@/common/components/layout/PageLayout";
import { Button } from "@/common/components/Button";
import { Card } from "@/common/components/Card";
import { fetchUserById } from "@/common/api/users";

export const Route = createFileRoute("/_authenticated/users/$userId")({
  component: UserDetailComponent,
});

function UserDetailComponent() {
  const { userId } = Route.useParams();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserById(userId),
  });

  return (
    <PageLayout
      title={user?.name ? `${user.name}` : `Usuario #${userId}`}
      description={`Información detallada y permisos`}
      actionElement={
        <Link to="/users">
          <Button variant="outline" size="sm" icon={ArrowLeft}>
            Volver a la lista
          </Button>
        </Link>
      }
    >
        {/* Tarjeta de información principal del perfil */}
        <Card className="p-6">
          <div className="flex items-center gap-4 pb-6 border-b border-[var(--border)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius)] bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-lg">
              {user?.name ? (
                user.name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()
              ) : (
                <User className="h-6 w-6" />
              )}
            </div>

            <div className="space-y-1">
              <h2 className="text-base font-bold text-[var(--card-foreground)]">
                {isLoading ? "Cargando usuario..." : user?.name || `Usuario #${userId}`}
              </h2>
              <div className="flex items-center gap-2 text-xs text-[var(--card-foreground)]/60">
                <Mail className="h-3.5 w-3.5" />
                <span>{user?.email || "correo no disponible"}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="rounded-[var(--radius)] border border-[var(--border)] p-4 space-y-1 bg-[var(--background)]/50">
              <span className="text-[10px] font-mono uppercase font-bold text-[var(--card-foreground)]/50">
                ID de Registro
              </span>
              <p className="font-mono text-xs font-semibold text-[var(--card-foreground)] flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-[var(--card-foreground)]/60" />
                {userId}
              </p>
            </div>

            <div className="rounded-[var(--radius)] border border-[var(--border)] p-4 space-y-1 bg-[var(--background)]/50">
              <span className="text-[10px] font-mono uppercase font-bold text-[var(--card-foreground)]/50">
                Rol Asignado
              </span>
              <p className="text-xs font-semibold text-[var(--card-foreground)] flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-[var(--card-foreground)]/60" />
                {user?.role || "Member"}
              </p>
            </div>

            <div className="rounded-[var(--radius)] border border-[var(--border)] p-4 space-y-1 bg-[var(--background)]/50">
              <span className="text-[10px] font-mono uppercase font-bold text-[var(--card-foreground)]/50">
                Estado de Acceso
              </span>
              <div className="pt-0.5">
                <span className="inline-flex items-center rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-[var(--card-foreground)]">
                  Autorizado
                </span>
              </div>
            </div>
          </div>
        </Card>
    </PageLayout>
  );
}
