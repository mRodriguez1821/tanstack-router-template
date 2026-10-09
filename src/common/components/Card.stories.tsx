import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, type CardProps } from "./Card";
import { Button } from "./Button";

const meta: Meta<CardProps> = {
  title: "Common/Card",
  component: Card,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "flat", "outline", "ghost"],
      description: "Variante visual de la tarjeta",
    },
    interactive: {
      control: "boolean",
      description: "Activa la microinteracción de elevación y sombra dinámica al hacer hover",
    },
    title: {
      control: "text",
      description: "Título del encabezado",
    },
    description: {
      control: "text",
      description: "Subtítulo o descripción de la tarjeta",
    },
  },
  args: {
    variant: "default",
    interactive: true,
    title: "Tarjeta Configurable",
    description: "Modifica las propiedades en la pestaña Controls para ver los cambios en tiempo real.",
  },
};

export default meta;
type Story = StoryObj<CardProps>;

export const Default: Story = {
  render: (args) => (
    <div className="p-8 max-w-md">
      <Card
        {...args}
        footer={
          <div className="flex justify-end gap-2 w-full">
            <Button variant="outline" size="sm">
              Cancelar
            </Button>
            <Button variant="primary" size="sm">
              Aceptar
            </Button>
          </div>
        }
      >
        <p className="text-xs opacity-80 leading-relaxed">
          Esta tarjeta reacciona a los tokens de tema activos:
          <code className="block mt-1 font-mono text-[10px] bg-[var(--background)] p-1 rounded border border-[var(--border)]">
            --card, --border, --radius, --card-hover-transform, --card-hover-shadow
          </code>
        </p>
      </Card>
    </div>
  ),
};

export const OutlineInteractive: Story = {
  args: {
    variant: "outline",
    interactive: true,
    title: "Variante Outline con Hover",
    description: "Ideal para listas de opciones o paneles secundarios con borde interactivo.",
  },
  render: (args) => (
    <div className="p-8 max-w-md">
      <Card {...args}>
        <p className="text-xs opacity-80">
          Pasa el cursor por encima para ver el realce de borde y elevación.
        </p>
      </Card>
    </div>
  ),
};
