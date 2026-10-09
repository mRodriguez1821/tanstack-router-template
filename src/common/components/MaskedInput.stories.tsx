import type { Meta, StoryObj } from "@storybook/react-vite";
import { MaskedInput, type MaskedInputProps } from "./MaskedInput";
import { Phone, CreditCard, Calendar, FileText } from "lucide-react";

const maskPresets = {
  Teléfono: "(999) 999-9999",
  "Tarjeta de Crédito": "9999-9999-9999-9999",
  Fecha: "99/99/9999",
  "DNI / Cédula": "999.999.999-99",
  "Código Postal": "99999-999",
};

const meta: Meta<MaskedInputProps> = {
  title: "Common/MaskedInput",
  component: MaskedInput,
  argTypes: {
    mask: {
      control: "select",
      options: Object.values(maskPresets),
      description: "Patrón de formato ('9' para dígito, 'a' para letra, '*' para alfanumérico)",
    },
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
      description: "Texto de ayuda",
    },
    error: {
      control: "text",
      description: "Mensaje de error",
    },
    disabled: {
      control: "boolean",
      description: "Deshabilita el campo",
    },
  },
  args: {
    mask: "(999) 999-9999",
    label: "Teléfono Móvil",
    placeholder: "(809) 000-0000",
    helperText: "Formato automático: (999) 999-9999",
  },
};

export default meta;
type Story = StoryObj<MaskedInputProps>;

export const Default: Story = {
  render: (args) => (
    <div className="p-8 max-w-sm">
      <MaskedInput {...args} icon={Phone} />
    </div>
  ),
};

export const CreditCardMask: Story = {
  args: {
    mask: "9999-9999-9999-9999",
    label: "Número de Tarjeta",
    placeholder: "4000-1234-5678-9010",
    helperText: "Formato de 16 dígitos separados por guiones",
  },
  render: (args) => (
    <div className="p-8 max-w-sm">
      <MaskedInput {...args} icon={CreditCard} />
    </div>
  ),
};

export const DateMask: Story = {
  args: {
    mask: "99/99/9999",
    label: "Fecha de Nacimiento",
    placeholder: "DD/MM/AAAA",
    helperText: "Día, mes y año",
  },
  render: (args) => (
    <div className="p-8 max-w-sm">
      <MaskedInput {...args} icon={Calendar} />
    </div>
  ),
};

export const DocumentMask: Story = {
  args: {
    mask: "999.999.999-99",
    label: "Documento de Identidad",
    placeholder: "001.002.003-04",
    helperText: "Formato con puntos y guion",
  },
  render: (args) => (
    <div className="p-8 max-w-sm">
      <MaskedInput {...args} icon={FileText} />
    </div>
  ),
};
