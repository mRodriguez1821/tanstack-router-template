import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Modal, type ModalProps } from "./Modal";
import { Button } from "./Button";

const meta: Meta<ModalProps> = {
  title: "Common/Modal",
  component: Modal,
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Determina si el modal está visible en pantalla",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "full"],
      description: "Tamaño y ancho máximo del modal",
    },
    horizontal: {
      control: "inline-radio",
      options: ["center", "left", "right"],
      description: "Alineación horizontal en pantalla",
    },
    vertical: {
      control: "inline-radio",
      options: ["center", "upper", "lower"],
      description: "Alineación vertical en pantalla",
    },
    blur: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl"],
      description: "Intensidad del desenfoque en el fondo (backdrop blur)",
    },
    closeOnClickOutside: {
      control: "boolean",
      description: "Cerrar al hacer clic fuera del diálogo",
    },
    showCloseButton: {
      control: "boolean",
      description: "Muestra la 'X' superior derecha",
    },
    title: {
      control: "text",
      description: "Título del encabezado",
    },
    description: {
      control: "text",
      description: "Subtítulo o descripción breve",
    },
  },
  args: {
    isOpen: false,
    size: "md",
    horizontal: "center",
    vertical: "center",
    blur: "sm",
    closeOnClickOutside: true,
    showCloseButton: true,
    title: "Confirmar Acción",
    description: "Configura este modal en tiempo real usando los Controles de Storybook.",
  },
};

export default meta;
type Story = StoryObj<ModalProps>;

export const Interactive: Story = {
  render: (args) => {
    const [open, setOpen] = useState(args.isOpen ?? false);

    // Sincronizar si el usuario cambia isOpen directamente en el panel de Controls
    const isCurrentlyOpen = open || Boolean(args.isOpen);

    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[350px] space-y-4">
        <div className="text-center space-y-1">
          <h3 className="text-sm font-bold text-[var(--foreground)]">
            Modal con Controles de Storybook
          </h3>
          <p className="text-xs text-[var(--foreground)] opacity-70">
            Haz clic en el botón para abrir el modal o activa <code>isOpen</code> en la pestaña Controls.
          </p>
        </div>

        <Button variant="primary" onClick={() => setOpen(true)}>
          Lanzar Modal
        </Button>

        <Modal
          {...args}
          isOpen={isCurrentlyOpen}
          onClose={() => setOpen(false)}
          body={
            <div className="p-4 space-y-2 text-xs">
              <p>
                Este modal está configurado con:
              </p>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>Tamaño: <strong>{String(args.size)}</strong></li>
                <li>Posición: <strong>{String(args.horizontal)} / {String(args.vertical)}</strong></li>
                <li>Filtro Blur: <strong>{String(args.blur)}</strong></li>
                <li>Cerrar al hacer clic fuera: <strong>{args.closeOnClickOutside ? "Sí" : "No"}</strong></li>
              </ul>
            </div>
          }
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
                Aceptar
              </Button>
            </div>
          }
        />
      </div>
    );
  },
};
