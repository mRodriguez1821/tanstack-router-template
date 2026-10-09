import type { Meta, StoryObj } from "@storybook/react-vite";
import { PasswordInput, type PasswordInputProps } from "./PasswordInput";

const meta: Meta<PasswordInputProps> = {
  title: "Common/PasswordInput",
  component: PasswordInput,
  argTypes: {
    label: {
      control: "text",
      description: "Etiqueta superior",
    },
    placeholder: {
      control: "text",
      description: "Texto placeholder",
    },
    helperText: {
      control: "text",
      description: "Texto informativo debajo del campo",
    },
    error: {
      control: "text",
      description: "Mensaje de error que activa el borde rojo",
    },
    allowToggleVisibility: {
      control: "boolean",
      description: "Habilita el botón de ojo para alternar texto visible / asteriscos",
    },
    showLockIcon: {
      control: "boolean",
      description: "Muestra el ícono de candado en el extremo izquierdo",
    },
    disabled: {
      control: "boolean",
      description: "Deshabilita el campo",
    },
    inputSize: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Tamaño y altura del input",
    },
  },
  args: {
    label: "Contraseña de Acceso",
    placeholder: "Ingresa tu contraseña...",
    helperText: "Haz clic en el icono del ojo para revelar la contraseña.",
    allowToggleVisibility: true,
    showLockIcon: true,
    disabled: false,
    inputSize: "md",
  },
};

export default meta;
type Story = StoryObj<PasswordInputProps>;

export const Default: Story = {
  render: (args) => (
    <div className="p-8 max-w-sm">
      <PasswordInput {...args} />
    </div>
  ),
};

export const WithError: Story = {
  args: {
    label: "Contraseña Actual",
    error: "Contraseña incorrecta. Por favor intenta nuevamente.",
  },
  render: (args) => (
    <div className="p-8 max-w-sm">
      <PasswordInput {...args} />
    </div>
  ),
};
