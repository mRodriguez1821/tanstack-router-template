import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageHeader, type PageHeaderProps } from "./PageHeader";
import { Button } from "../Button";
import { Plus, Download } from "lucide-react";

const meta: Meta<PageHeaderProps> = {
  title: "Layout/PageHeader",
  component: PageHeader,
  argTypes: {
    title: {
      control: "text",
      description: "Título principal de la página",
    },
    description: {
      control: "text",
      description: "Subtítulo o texto descriptivo",
    },
  },
  args: {
    title: "Gestión de Personal",
    description: "Administra y visualiza todos los colaboradores activos en el sistema.",
  },
};

export default meta;
type Story = StoryObj<PageHeaderProps>;

export const Default: Story = {
  render: (args) => (
    <div className="p-6 max-w-4xl">
      <PageHeader
        {...args}
        actionElement={
          <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />}>
            Nuevo Colaborador
          </Button>
        }
      />
    </div>
  ),
};

export const WithExtraAction: Story = {
  args: {
    title: "Métricas de Rendimiento",
    description: "Informes consolidados con descarga de auditoría.",
  },
  render: (args) => (
    <div className="p-6 max-w-4xl">
      <PageHeader
        {...args}
        extra={
          <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />}>
            Exportar CSV
          </Button>
        }
        actionElement={
          <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />}>
            Crear Registro
          </Button>
        }
      />
    </div>
  ),
};
