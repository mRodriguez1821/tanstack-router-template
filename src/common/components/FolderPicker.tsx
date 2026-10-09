import { forwardRef } from "react";
import { FilePicker, type FilePickerProps } from "./FilePicker";

export interface FolderPickerProps extends Omit<FilePickerProps, "directory" | "multiple"> {
  /** Callback al seleccionar los archivos contenidos en el directorio */
  onFolderSelected?: (files: File[]) => void;
}

/**
 * Componente especializado FolderPicker:
 * Permite seleccionar directorios/carpetas completas preservando rutas relativas.
 */
export const FolderPicker = forwardRef<HTMLInputElement, FolderPickerProps>(
  function FolderPicker({ onFolderSelected, ...props }, ref) {
    return (
      <FilePicker
        ref={ref}
        directory={true}
        multiple={true}
        onFilesSelected={onFolderSelected}
        {...props}
      />
    );
  }
);
