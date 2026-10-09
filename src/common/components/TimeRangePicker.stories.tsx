import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TimeRangePicker, type TimeRangePickerProps, type TimeRangeValue } from "./TimeRangePicker";

const meta: Meta<TimeRangePickerProps> = {
  title: "Pickers/TimeRangePicker",
  component: TimeRangePicker,
  argTypes: {
    label: {
      control: "text",
      description: "Etiqueta del campo",
    },
    placeholder: {
      control: "text",
      description: "Texto placeholder",
    },
    minuteStep: {
      control: "select",
      options: [5, 10, 15, 30],
      description: "Paso de minutos",
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
    label: "Horario de Trabajo",
    placeholder: "HH:mm - HH:mm",
    minuteStep: 15,
    helperText: "Selecciona hora de entrada y hora de salida.",
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<TimeRangePickerProps>;

export const Default: Story = {
  render: (args) => {
    const [range, setRange] = useState<TimeRangeValue>({
      from: "08:30",
      to: "17:30",
    });

    return (
      <div className="p-8 max-w-sm">
        <TimeRangePicker
          {...args}
          value={range}
          onChange={(newVal) => setRange(newVal)}
        />
        <div className="mt-3 text-xs opacity-75 font-mono space-y-0.5">
          <p>Hora Inicio: <strong>{range.from || "Pendiente"}</strong></p>
          <p>Hora Fin: <strong>{range.to || "Pendiente"}</strong></p>
        </div>
      </div>
    );
  },
};
