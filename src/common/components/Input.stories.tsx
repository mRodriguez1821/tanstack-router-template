import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mail, Search, Lock, User } from "lucide-react";
import { z } from "zod";
import { Input, type InputProps } from "./Input";
import { useZodInput } from "../hooks/useZodInput";

const iconMap = {
  Ninguno: undefined,
  Mail,
  Search,
  Lock,
  User,
};

const meta: Meta<InputProps> = {
  title: "Common/Input",
  component: Input,
  argTypes: {
    label: {
      control: "text",
      description: "Etiqueta superior del campo",
    },
    placeholder: {
      control: "text",
      description: "Texto de ayuda / placeholder",
    },
    helperText: {
      control: "text",
      description: "Texto descriptivo o informativo debajo del campo",
    },
    error: {
      control: "text",
      description: "Mensaje de error que activa el estado no válido",
    },
    inputSize: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Tamaño y altura del input",
    },
    iconPosition: {
      control: "inline-radio",
      options: ["left", "right"],
      description: "Ubicación del ícono decorativo",
    },
    disabled: {
      control: "boolean",
      description: "Deshabilita la interacción con el campo",
    },
    icon: {
      control: "select",
      options: Object.keys(iconMap),
      mapping: iconMap,
      description: "Ícono mostrado dentro del input",
    },
  },
  args: {
    label: "Correo Electrónico",
    placeholder: "ejemplo@empresa.com",
    helperText: "Nunca compartiremos tu información con terceros.",
    inputSize: "md",
    iconPosition: "left",
    disabled: false,
    icon: "Mail" as any,
  },
};

export default meta;
type Story = StoryObj<InputProps>;

export const Default: Story = {
  render: (args) => (
    <div className="p-8 max-w-sm">
      <Input {...args} />
    </div>
  ),
};

export const WithErrorState: Story = {
  args: {
    label: "Contraseña",
    type: "password",
    placeholder: "••••••••",
    error: "La contraseña debe contener al menos 8 caracteres y un número.",
    icon: "Lock" as any,
  },
  render: (args) => (
    <div className="p-8 max-w-sm">
      <Input {...args} />
    </div>
  ),
};

export const WithZodValidation: Story = {
  render: function Render(args) {
    const emailInput = useZodInput(
      z.string().min(1, "El correo es obligatorio").email("Formato de correo inválido")
    );

    return (
      <div className="p-8 max-w-sm space-y-3">
        <h4 className="text-xs font-bold text-[var(--foreground)] opacity-80 uppercase tracking-wider">
          Validación Zod Reactiva
        </h4>
        <Input
          {...args}
          label="Email con Zod Schema"
          placeholder="escribe-un-correo-invalido"
          helperText="Escribe un valor y desenfoca el input (blur) para verificar el error."
          {...emailInput.inputProps}
        />
      </div>
    );
  },
};
