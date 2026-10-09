import { createFileRoute, Link } from "@tanstack/react-router";
import { Save, RotateCcw } from "lucide-react";
import { FormPage } from "@/common/components/layout/FormPage";
import { Button } from "@/common/components/Button";
import { Input } from "@/common/components/Input";
import { useFormDraft } from "@/common/hooks/useFormDraft";
import { useToast } from "@/common/hooks/useToast";

export const Route = createFileRoute("/_public/(demo)/demo/form")({
  component: DemoFormPage,
});

interface ProfileFormData {
  fullName: string;
  email: string;
  position: string;
  department: string;
  bio: string;
  notificationsEnabled: boolean;
}

const INITIAL_PROFILE: ProfileFormData = {
  fullName: "Valeria Morales",
  email: "valeria.morales@empresa.com",
  position: "Líder de Producto",
  department: "Diseño & Producto",
  bio: "Diseñadora UX y gestora técnica enfocada en sistemas de diseño y frontend moderno.",
  notificationsEnabled: true,
};

export function DemoFormPage() {
  const toast = useToast();

  const {
    values,
    handleChange,
    resetDraft,
    clearDraft,
    isDraftRestored,
    lastSavedAt,
    hasUnsavedChanges,
  } = useFormDraft("demo-user-profile-screen", INITIAL_PROFILE, {
    syncWithUrl: true,
    debounceMs: 200,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearDraft();
    toast.success("¡Formulario enviado con éxito! El borrador ha sido limpiado.");
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 space-y-6 mx-auto w-full p-4 md:p-8">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/demo"
          className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition flex items-center gap-1 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          &larr; Volver a Demos
        </Link>
      </div>

      <FormPage
        title="Pantalla Tipo Formulario (FormPage)"
        description="Demostración de guardado automático de borrador y reconstrucción de vistas completa desde la URL."
        isDraftSaved={isDraftRestored}
        lastSavedAt={lastSavedAt}
        onClearDraft={() => {
          resetDraft();
          toast.info("Borrador descartado. Valores restablecidos.");
        }}
        actionElement={
          <Button
            type="submit"
            form="demo-form"
            size="sm"
            icon={Save}
            disabled={!hasUnsavedChanges && !isDraftRestored}
          >
            Guardar Cambios
          </Button>
        }
        headerExtra={
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={RotateCcw}
            onClick={resetDraft}
          >
            Restablecer
          </Button>
        }
        footerSlot={
          <div className="flex justify-end w-full">
            

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetDraft}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="demo-form"
                size="sm"
                icon={Save}
              >
                Guardar y Aplicar
              </Button>
            </div>
          </div>
        }
      >
        <form id="demo-form" onSubmit={handleSubmit} className="space-y-6">
          

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre Completo"
              name="fullName"
              value={values.fullName}
              onChange={handleChange}
              placeholder="Nombre del usuario"
              required
            />

            <Input
              label="Correo Electrónico"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="correo@empresa.com"
              required
            />

            <Input
              label="Cargo / Posición"
              name="position"
              value={values.position}
              onChange={handleChange}
              placeholder="Ej. Desarrollador Senior"
            />

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Departamento
              </label>
              <select
                name="department"
                value={values.department}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs focus:border-zinc-900 dark:focus:border-zinc-100 focus:outline-hidden cursor-pointer"
              >
                <option value="Diseño & Producto">Diseño & Producto</option>
                <option value="Ingeniería Frontend">Ingeniería Frontend</option>
                <option value="Operaciones & DevOps">Operaciones & DevOps</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Biografía / Descripción del Perfil
            </label>
            <textarea
              name="bio"
              value={values.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Breve reseña sobre tus responsabilidades o trayectoria..."
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 text-xs focus:border-zinc-900 dark:focus:border-zinc-100 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <label className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                name="notificationsEnabled"
                checked={values.notificationsEnabled}
                onChange={handleChange}
                className="rounded accent-zinc-900 dark:accent-zinc-100"
              />
              <span>Recibir notificaciones por correo electrónico</span>
            </label>
          </div>
        </form>
      </FormPage>
    </div>
  );
}
