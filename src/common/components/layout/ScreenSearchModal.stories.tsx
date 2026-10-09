import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ScreenSearchModal, type ScreenSearchModalProps } from "./ScreenSearchModal";
import { Button } from "../Button";
import { Search } from "lucide-react";

const meta: Meta<ScreenSearchModalProps> = {
  title: "Layout/ScreenSearchModal",
  component: ScreenSearchModal,
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Controla si el modal de búsqueda está abierto o cerrado",
    },
  },
  args: {
    isOpen: false,
  },
};

export default meta;
type Story = StoryObj<ScreenSearchModalProps>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(args.isOpen ?? false);
    const isCurrentlyOpen = open || Boolean(args.isOpen);

    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[350px] space-y-4">
        <div className="text-center space-y-1">
          <h3 className="text-sm font-bold text-[var(--foreground)]">
            Buscador Global de Pantallas (Ctrl+K)
          </h3>
          <p className="text-xs text-[var(--foreground)] opacity-70">
            Abre el diálogo interactivo o alterna el interruptor <code>isOpen</code> en la sección Controls.
          </p>
        </div>

        <Button
          variant="outline"
          icon={<Search className="h-4 w-4" />}
          onClick={() => setOpen(true)}
        >
          Abrir Buscador de Pantallas
        </Button>

        <ScreenSearchModal
          {...args}
          isOpen={isCurrentlyOpen}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  },
};
