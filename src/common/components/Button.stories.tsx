import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, type ButtonProps } from "./Button";
import { Plus, Download, Trash2, ArrowRight } from "lucide-react";

const iconOptions = {
  Ninguno: undefined,
  Plus,
  Download,
  Trash2,
  ArrowRight,
};

const meta: Meta<ButtonProps> = {
  title: "Common/Button",
  component: Button,
  argTypes: {
    children: {
      control: "text",
      description: "Texto o contenido interno del botón",
    },
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "danger", "ghost"],
      description: "Variante visual del botón",
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
      description: "Tamaño (altura y paddings)",
    },
    isLoading: {
      control: "boolean",
      description: "Muestra spinner de carga y deshabilita interacción",
    },
    disabled: {
      control: "boolean",
      description: "Deshabilita el botón",
    },
    iconPosition: {
      control: "inline-radio",
      options: ["left", "right"],
      description: "Posición del ícono respecto al texto",
    },
    icon: {
      control: "select",
      options: Object.keys(iconOptions),
      mapping: iconOptions,
      description: "Ícono decorativo",
    },
  },
  args: {
    children: "Guardar Información",
    variant: "primary",
    size: "md",
    isLoading: false,
    disabled: false,
    iconPosition: "left",
    icon: "Plus" as any,
  },
};

export default meta;
type Story = StoryObj<ButtonProps>;

export const Default: Story = {
  render: (args) => (
    <div className="p-8 flex items-center justify-center">
      <Button {...args} />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 p-4">
      <Button variant="primary">Primario</Button>
      <Button variant="secondary">Secundario</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};
