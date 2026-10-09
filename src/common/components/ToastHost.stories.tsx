import type { Meta, StoryObj } from "@storybook/react-vite";
import ToastHost from "./ToastHost";
import { showToast } from "../lib/api";

function ToastHostDemo() {
  return (
    <div className="p-6 flex flex-col gap-3 max-w-sm">
      <button
        type="button"
        className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 cursor-pointer"
        onClick={() => showToast("¡Guardado con éxito!", "success")}
      >
        Lanzar Success
      </button>
      <button
        type="button"
        className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-700 cursor-pointer"
        onClick={() => showToast("Nueva actualización disponible.", "info")}
      >
        Lanzar Info
      </button>
      <button
        type="button"
        className="rounded bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-700 cursor-pointer"
        onClick={() =>
          showToast("Revisa los campos antes de continuar.", "warning")
        }
      >
        Lanzar Warning
      </button>
      <button
        type="button"
        className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-700 cursor-pointer"
        onClick={() => showToast("No se pudo guardar el registro.", "error")}
      >
        Lanzar Error
      </button>
      <ToastHost />
    </div>
  );
}

const meta = {
  title: "Common/ToastHost",
  component: ToastHost,
  parameters: {
    layout: "fullscreen",
  },
  render: () => <ToastHostDemo />,
} satisfies Meta<typeof ToastHost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
