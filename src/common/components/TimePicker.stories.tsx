import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TimePicker, type TimePickerProps } from "./TimePicker";

const meta: Meta<TimePickerProps> = {
  title: "Pickers/TimePicker",
  component: TimePicker,
  argTypes: {
    label: {
      control: "text",
      description: "Etiqueta del campo",
    },
    value: {
      control: "text",
      description: "Hora en formato 'HH:mm'",
    },
    use12Hours: {
      control: "boolean",
      description: "Muestra formato AM/PM (12 horas)",
    },
    minuteStep: {
      control: "select",
      options: [5, 10, 15, 30],
      description: "Intervalo en minutos para el selector",
    },
    helperText: {
      control: "text",
      description: "Texto de ayuda",
    },
    disabled: {
      control: "boolean",
      description: "Deshabilita el selector",
    },
  },
  args: {
    label: "Hora de Entrada",
    value: "09:00",
    use12Hours: false,
    minuteStep: 15,
    helperText: "Selecciona hora y minutos en el menú desplegable.",
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<TimePickerProps>;

export const Default24H: Story = {
  render: (args) => {
    const [time, setTime] = useState(args.value || "09:00");
    return (
      <div className="p-8 max-w-sm">
        <TimePicker
          {...args}
          value={time}
          onChange={(newTime) => setTime(newTime)}
        />
        <p className="mt-3 text-xs opacity-75 font-mono">
          Hora activa: <strong>{time || "No definida"}</strong>
        </p>
      </div>
    );
  },
};

export const Format12Hours: Story = {
  args: {
    label: "Horario Vespertino (12h)",
    value: "15:30",
    use12Hours: true,
  },
  render: (args) => {
    const [time, setTime] = useState(args.value || "15:30");
    return (
      <div className="p-8 max-w-sm">
        <TimePicker
          {...args}
          value={time}
          onChange={(newTime) => setTime(newTime)}
        />
        <p className="mt-3 text-xs opacity-75 font-mono">
          Hora activa (ISO 24h): <strong>{time || "No definida"}</strong>
        </p>
      </div>
    );
  },
};
