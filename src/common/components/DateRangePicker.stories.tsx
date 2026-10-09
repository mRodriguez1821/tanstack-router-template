import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DateRangePicker, type DateRangePickerProps, type DateRangeValue } from "./DateRangePicker";

const meta: Meta<DateRangePickerProps> = {
  title: "Pickers/DateRangePicker",
  component: DateRangePicker,
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
      description: "Texto descriptivo",
    },
    disabled: {
      control: "boolean",
      description: "Deshabilita el selector",
    },
  },
  args: {
    label: "Rango de Fechas del Proyecto",
    placeholder: "Seleccionar periodo...",
    helperText: "Haz clic en la fecha inicial y luego en la fecha final.",
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<DateRangePickerProps>;

export const Default: Story = {
  render: (args) => {
    const [range, setRange] = useState<DateRangeValue>({
      from: "2026-10-01",
      to: "2026-10-15",
    });

    return (
      <div className="p-8 max-w-sm">
        <DateRangePicker
          {...args}
          value={range}
          onChange={(newRange) => setRange(newRange)}
        />
        <div className="mt-3 text-xs opacity-75 font-mono space-y-0.5">
          <p>Desde: <strong>{range.from || "Pendiente"}</strong></p>
          <p>Hasta: <strong>{range.to || "Pendiente"}</strong></p>
        </div>
      </div>
    );
  },
};
