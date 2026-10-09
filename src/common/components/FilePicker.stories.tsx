import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FilePicker, type FilePickerProps } from "./FilePicker";

const meta: Meta<FilePickerProps> = {
  title: "Pickers/FilePicker",
  component: FilePicker,
  argTypes: {
    label: {
      control: "text",
      description: "Etiqueta superior",
    },
    accept: {
      control: "text",
      description: "Tipos de archivo permitidos (ej. 'image/*', '.pdf')",
    },
    multiple: {
      control: "boolean",
      description: "Permite seleccionar múltiples archivos",
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
    label: "Adjuntar Documentos",
    multiple: true,
    maxSizeMB: 10,
    helperText: "Formatos soportados: PDF, imágenes y documentos hasta 10MB.",
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<FilePickerProps>;

export const Default: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>([]);

    return (
      <div className="p-8 max-w-md">
        <FilePicker
          {...args}
          onFilesSelected={(selected) => setFiles(selected)}
        />
        {files.length > 0 && (
          <p className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            {files.length} archivo(s) listos para enviar.
          </p>
        )}
      </div>
    );
  },
};

export const ImagesOnly: Story = {
  args: {
    label: "Foto de Perfil o Banner",
    accept: "image/*",
    multiple: false,
    maxSizeMB: 5,
    helperText: "Selecciona una imagen PNG, JPG o WEBP de hasta 5MB.",
  },
  render: (args) => (
    <div className="p-8 max-w-md">
      <FilePicker {...args} />
    </div>
  ),
};
