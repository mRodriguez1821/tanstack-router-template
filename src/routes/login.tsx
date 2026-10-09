import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, ShieldCheck, Sparkles, User } from "lucide-react";
import { useAuth } from "@/common/context/useAuth";
import { useToast } from "@/common/hooks/useToast";
import { AuthContainer } from "@/common/components/layout/AuthContainer";
import { Input } from "@/common/components/Input";
import { PasswordInput } from "@/common/components/PasswordInput";
import { bypassAuth, isShowcase } from "@/common/lib/env";

const searchSchema = z.object({
  redirect: z.string().optional().catch(""),
});

const signinSchema = z.object({
  username: z.string().min(1, "El usuario o correo es obligatorio"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

type SigninFormValues = z.infer<typeof signinSchema>;

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  beforeLoad: ({ context, search }) => {
    if (context.auth?.isAuthenticated) {
      throw redirect({ to: search.redirect || "/home" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleOnSubmit = async (data: SigninFormValues) => {
    setIsLoading(true);
    try {
      const success = isShowcase || await login(data.username, data.password);
      if (success) {
        toast.success("¡Sesión iniciada con éxito!");
        navigate({ to: search.redirect || "/home", replace: true });
      } else {
        setError("root", {
          message: "Credenciales inválidas. Verifica tu usuario y contraseña.",
        });
      }
    } catch {
      setError("root", {
        message: "Ocurrió un error inesperado al conectar con el servidor.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-white shadow-md">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-tight text-gray-900 dark:text-white">
              Template App
            </h2>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Acceso seguro
            </p>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Iniciar sesión
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Ingresa tus credenciales para acceder a la aplicación.
        </p>

        {bypassAuth && (
          <div
            className="mb-4 rounded-xl border border-purple-200 bg-purple-50 p-3 text-xs text-purple-700 dark:border-purple-900/60 dark:bg-purple-950/50 dark:text-purple-300 flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-purple-600" />
            <p className="font-bold">Modo Showcase Activo</p>
          </div>
        )}

        {errors.root && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-400"
          >
            {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(handleOnSubmit)} className="space-y-4">
          <Input
            id="username"
            type="text"
            label="Usuario o Correo"
            autoComplete="username"
            placeholder="admin@ejemplo.com"
            icon={User}
            error={errors.username?.message}
            {...register("username")}
          />

          <PasswordInput
            id="password"
            label="Contraseña"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer mt-6"
          >
            <Lock className="h-4 w-4" />
            {isLoading ? "Iniciando sesión..." : "Entrar"}
          </button>
        </form>
      </div>
    </AuthContainer>
  );
}

export default LoginPage;
