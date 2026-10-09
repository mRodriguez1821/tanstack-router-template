import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Mail, User, ShieldCheck, CheckCircle2 } from "lucide-react";
import { PageLayout } from "@/common/components/layout/PageLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/common/components/Card";
import { Input } from "@/common/components/Input";
import { Button } from "@/common/components/Button";
import { useZodInput } from "@/common/hooks/useZodInput";
import { useToast } from "@/common/hooks/useToast";
// import { useTheme } from "@/common/context/ThemeContext";

export const Route = createFileRoute("/_authenticated/home")({
  component: HomeComponent,
});

const emailSchema = z
  .string()
  .min(1, "El correo electrónico es requerido")
  .email("Formato de correo electrónico inválido (ej. usuario@dominio.com)");

const usernameSchema = z
  .string()
  .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
  .max(20, "El nombre de usuario no puede exceder 20 caracteres")
  .regex(/^[a-zA-Z0-9_]+$/, "Solo se permiten letras, números y guiones bajos");

function HomeComponent() {
  const toast = useToast();
  // const { activeTheme } = useTheme();

  // Validaciones reactivas con hook useZodInput
  const emailInput = useZodInput(emailSchema, "");
  const usernameInput = useZodInput(usernameSchema, "");

  const handleValidateForm = (e: React.FormEvent) => {
    e.preventDefault();
    const isEmailValid = emailInput.validate();
    const isUserValid = usernameInput.validate();

    if (isEmailValid && isUserValid) {
      toast.success(`¡Datos validados con éxito! (${usernameInput.value})`);
    } else {
      toast.error("Por favor corrige los campos señalados antes de continuar.");
    }
  };

  return (
    <PageLayout
      title="Hola Home Protegido"
      description="Esta es la pantalla de inicio principal dentro del entorno protegido."
    >
      <div className="space-y-6 max-w-4xl">
        {/* Tarjeta de bienvenida */}
        <Card
          title="Panel de Control Protegido"
          description="Bienvenido al área protegida. Esta interfaz se adapta dinámicamente al tema activo."
        >
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Los componentes <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">Card</code> e{" "}
            <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">Input</code> utilizan directamente las variables CSS de tema (
            <code className="text-xs font-mono">--card</code>, <code className="text-xs font-mono">--border</code>, <code className="text-xs font-mono">--radius</code>, <code className="text-xs font-mono">--primary</code>).
          </p>
        </Card>

        {/* Tarjeta con formulario validado con Zod */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <CardTitle>Demostración de Input con Validación Zod</CardTitle>
            </div>
            <CardDescription>
              Escribe en los campos a continuación para observar la validación reactiva en tiempo real o al desenfocar.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form id="zod-demo-form" onSubmit={handleValidateForm} className="space-y-4">
              <Input
                label="Nombre de Usuario (Zod Schema)"
                placeholder="ej. valeria_morales"
                icon={User}
                helperText="De 3 a 20 caracteres alfanuméricos."
                {...usernameInput.inputProps}
              />

              <Input
                label="Correo Corporativo (Zod Schema)"
                placeholder="nombre@empresa.com"
                type="email"
                icon={Mail}
                helperText="Validación estricta de estructura de correo."
                {...emailInput.inputProps}
              />
            </form>
          </CardContent>

          <CardFooter className="flex justify-end pt-6 items-end">
           
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  emailInput.reset();
                  usernameInput.reset();
                  toast.info("Campos restablecidos.");
                }}
              >
                Limpiar
              </Button>
              <Button
                type="submit"
                form="zod-demo-form"
                size="sm"
                icon={CheckCircle2}
              >
                Validar con Zod
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
}
