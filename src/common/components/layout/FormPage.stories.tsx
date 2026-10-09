import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormPage, type FormPageProps } from "./FormPage";
import { Button } from "../Button";
import { Input } from "../Input";
import { Save } from "lucide-react";

const meta: Meta<FormPageProps> = {
  title: "Layout/FormPage",
  component: FormPage,
  argTypes: {
    title: {
      control: "text",
      description: "Título de la pantalla de formulario",
    },
    description: {
      control: "text",
      description: "Subtítulo o descripción breve",
    },
    cardLayout: {
      control: "boolean",
      description: "Envuelve el contenido en una tarjeta",
    },
    isDraftSaved: {
      control: "boolean",
      description: "Indica si hay un borrador guardado automáticamente",
    },
  },
  args: {
    title: "Editar Información del Proyecto",
    description: "Los cambios se guardan automáticamente en borrador en almacenamiento cifrado.",
    cardLayout: true,
    isDraftSaved: true,
  },
};

export default meta;
type Story = StoryObj<FormPageProps>;

export const Default: Story = {
  render: (args) => (
    <div className="p-6 max-w-4xl mx-auto">
      <FormPage
        {...args}
        lastSavedAt={args.isDraftSaved ? new Date() : null}
        actionElement={
          <Button variant="primary" size="sm" icon={<Save className="h-4 w-4" />}>
            Guardar borrador
          </Button>
        }
        footerSlot={
          <div className="flex justify-end gap-2 w-full">
            <Button variant="outline" size="sm">
              Cancelar
            </Button>
            <Button variant="primary" size="sm" icon={<Save className="h-4 w-4" />}>
              Guardar
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Nombre del Proyecto" placeholder="Proyecto Pegasus" />
          <Input label="Categoría" placeholder="Infraestructura" />
        </div>
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-medium text-[var(--foreground)] opacity-80 block">
            Descripción y Notas
          </label>
          <textarea
            rows={4}
            placeholder="Escribe notas sobre los objetivos y entregables..."
            className="w-full text-xs p-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none transition focus:border-[var(--primary)]"
          />
        </div>
      </FormPage>
    </div>
  ),
};
