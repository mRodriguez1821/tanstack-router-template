import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DatePicker, type DatePickerProps } from "./DatePicker";

const meta: Meta<DatePickerProps> = {
  title: "Pickers/DatePicker",
  component: DatePicker,
  argTypes: {
    label: {
      control: "text",
      description: "Etiqueta superior",
    },
    value: {
      control: "text",
      description: "Valor de fecha 'AAAA-MM-DD' o 'AAAA-MM-DDTHH:mm'",
    },
    enableTime: {
      control: "boolean",
      description: "Habilita la variante DateTime con selector de hora y minutos",
    },
    helperText: {
      control: "text",
      description: "Texto informativo debajo del campo",
    },
    error: {
      control: "text",
      description: "Mensaje de error",
    },
    disabled: {
      control: "boolean",
      description: "Deshabilita el selector",
    },
    minDate: {
      control: "text",
      description: "Fecha mínima 'AAAA-MM-DD'",
    },
    maxDate: {
      control: "text",
      description: "Fecha máxima 'AAAA-MM-DD'",
    },
  },
  args: {
    label: "Fecha de Contratación",
    value: "2026-10-15",
    enableTime: false,
    helperText: "Selecciona el día en el calendario interactivo.",
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<DatePickerProps>;

export const DefaultDate: Story = {
  render: (args) => {
    const [date, setDate] = useState(args.value || "2026-10-15");
    return (
      <div className="p-8 max-w-sm">
        <DatePicker
          {...args}
          value={date}
          onChange={(newVal) => setDate(newVal)}
        />
        <p className="mt-3 text-xs opacity-70 font-mono">
          Valor seleccionado: <strong>{date || "Ninguno"}</strong>
        </p>
      </div>
    );
  },
};

export const DateTimeVariant: Story = {
  args: {
    label: "Fecha y Hora de la Reunión",
    enableTime: true,
    value: "2026-10-20T14:30",
    helperText: "Permite seleccionar día y hora (HH:mm) en el mismo popup.",
  },
  render: (args) => {
    const [dateTime, setDateTime] = useState(args.value || "2026-10-20T14:30");
    return (
      <div className="p-8 max-w-sm">
        <DatePicker
          {...args}
          value={dateTime}
          onChange={(newVal) => setDateTime(newVal)}
        />
        <p className="mt-3 text-xs opacity-70 font-mono">
          Valor seleccionado: <strong>{dateTime || "Ninguno"}</strong>
        </p>
      </div>
    );
  },
};
