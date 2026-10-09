import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FolderPicker, type FolderPickerProps } from "./FolderPicker";

const meta: Meta<FolderPickerProps> = {
  title: "Pickers/FolderPicker",
  component: FolderPicker,
  argTypes: {
    label: {
      control: "text",
      description: "Etiqueta superior",
    },
    maxSizeMB: {
      control: "number",
      description: "Límite de tamaño máximo por archivo en MB",
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
    label: "Seleccionar Directorio de Proyecto",
    maxSizeMB: 25,
    helperText: "Selecciona una carpeta del sistema local para cargar su estructura completa.",
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<FolderPickerProps>;

export const Default: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>([]);

    return (
      <div className="p-8 max-w-md">
        <FolderPicker
          {...args}
          onFolderSelected={(selected) => setFiles(selected)}
        />
        {files.length > 0 && (
          <div className="mt-3 p-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] text-xs space-y-1">
            <p className="font-semibold text-[var(--foreground)]">
              Carpeta cargada exitosamente
            </p>
            <p className="opacity-70 font-mono">
              Total de elementos: {files.length} archivo(s).
            </p>
          </div>
        )}
      </div>
    );
  },
};
