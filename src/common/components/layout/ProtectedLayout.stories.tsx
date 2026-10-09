import type { Meta, StoryObj } from "@storybook/react-vite";
import { AuthContext, type AuthContextValue } from "@/common/context/authContextStore";
import { ProtectedLayout } from "./ProtectedLayout";
import { Users, Shield, CheckCircle, ArrowUpRight } from "lucide-react";

const mockAuth: AuthContextValue = {
  isAuthenticated: true,
  currentUser: {
    id: "user-1",
    displayName: "Admin Demo",
    email: "admin@template.local",
    username: "admin",
    role: "Administrator",
  },
  login: async () => true,
  logout: () => {},
};

function SampleContent() {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
            Panel General (Grayscale Protected Layout)
          </h1>
          <p className="text-xs text-zinc-500">
            Diseño minimalista en escala de grises y blanco y negro para el layout autenticado.
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
        >
          Nueva Acción
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Usuarios Activos
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">1,248</span>
            <span className="text-xs text-zinc-500 font-mono">+12%</span>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Seguridad AES-GCM
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <Shield className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">100%</span>
            <span className="text-xs text-zinc-500 font-mono">Hashed Keys</span>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Estado de Servidor
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">Operativo</span>
            <span className="text-xs text-zinc-500 font-mono">99.9%</span>
          </div>
        </div>
      </div>

      {/* Table Sample */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
            Registros Recientes
          </h2>
          <span className="text-xs text-zinc-400 font-mono">3 elementos</span>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {[
            { id: "1", name: "Carlos Mendoza", role: "Desarrollador", status: "Activo" },
            { id: "2", name: "María Fernández", role: "Líder Técnico", status: "Activo" },
            { id: "3", name: "Jorge Ramos", role: "Administrador", status: "Inactivo" },
          ].map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition">
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{item.name}</p>
                <p className="text-xs text-zinc-500">{item.role}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-mono text-zinc-700 dark:text-zinc-300">
                  {item.status}
                </span>
                <span className="text-xs text-zinc-400 flex items-center gap-0.5">
                  Ver <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: "Layout/ProtectedLayout",
  component: ProtectedLayout,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <AuthContext.Provider value={mockAuth}>
        <Story />
      </AuthContext.Provider>
    ),
  ],
  render: () => (
    <ProtectedLayout>
      <SampleContent />
    </ProtectedLayout>
  ),
} satisfies Meta<typeof ProtectedLayout>;

export default meta;
type Story = StoryObj<typeof ProtectedLayout>;

export const DefaultGrayscale: Story = {};
