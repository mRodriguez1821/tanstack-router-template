import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageLayout, type PageLayoutProps } from "./PageLayout";
import { Button } from "../Button";
import { Card } from "../Card";
import { Download, RefreshCw } from "lucide-react";

const meta: Meta<PageLayoutProps> = {
  title: "Layout/PageLayout",
  component: PageLayout,
  argTypes: {
    title: {
      control: "text",
      description: "Título principal",
    },
    description: {
      control: "text",
      description: "Descripción de la vista",
    },
  },
  args: {
    title: "Reporte de Actividad del Sistema",
    description: "Resumen operativo con métricas clave y registros en tiempo real.",
  },
};

export default meta;
type Story = StoryObj<PageLayoutProps>;

export const Default: Story = {
  render: (args) => (
    <div className="p-6 bg-[var(--background)] min-h-[400px]">
      <PageLayout
        {...args}
        actionElement={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={<RefreshCw className="h-4 w-4" />}>
              Sincronizar
            </Button>
            <Button variant="primary" size="sm" icon={<Download className="h-4 w-4" />}>
              Exportar
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Total Procesado" description="Métricas acumuladas del mes">
            <p className="text-2xl font-bold font-mono">18,490</p>
          </Card>
          <Card title="Tiempo de Respuesta" description="Latencia promedio global">
            <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">24ms</p>
          </Card>
          <Card title="Disponibilidad SLA" description="Monitoreo de uptime">
            <p className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">99.98%</p>
          </Card>
        </div>
      </PageLayout>
    </div>
  ),
};
