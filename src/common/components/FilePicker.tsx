import {
  forwardRef,
  useState,
  useRef,
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
} from "react";
import {
  UploadCloud,
  File as FileIcon,
  Folder as FolderIcon,
  X,
  AlertCircle,
} from "lucide-react";

export interface FilePickerProps {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  /** Tipos MIME o extensiones permitidas, ej: "image/*", ".pdf,.docx" */
  accept?: string;
  /** Si permite selección de múltiples archivos */
  multiple?: boolean;
  /** Modo selector de carpeta (webkitdirectory) */
  directory?: boolean;
  /** Tamaño máximo permitido por archivo en Megabytes (MB) */
  maxSizeMB?: number;
  /** Callback ejecutado al seleccionar archivos válidos */
  onFilesSelected?: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
}

export const FilePicker = forwardRef<HTMLInputElement, FilePickerProps>(
  function FilePicker(
    {
      label,
      helperText,
      error,
      accept,
      multiple = false,
      directory = false,
      maxSizeMB,
      onFilesSelected,
      disabled = false,
      className = "",
    },
    ref
  ) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const activeError = error || validationError;

    const validateAndSetFiles = (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      setValidationError(null);

      const filesArray = Array.from(fileList);

      if (maxSizeMB) {
        const maxBytes = maxSizeMB * 1024 * 1024;
        const oversized = filesArray.find((f) => f.size > maxBytes);
        if (oversized) {
          setValidationError(
            `El archivo "${oversized.name}" excede el límite máximo de ${maxSizeMB}MB.`
          );
          return;
        }
      }

      setSelectedFiles(filesArray);
      onFilesSelected?.(filesArray);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      validateAndSetFiles(e.target.files);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!disabled) setIsDragOver(true);
    };

    const handleDragLeave = () => {
      setIsDragOver(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      if (!disabled) {
        validateAndSetFiles(e.dataTransfer.files);
      }
    };

    const handleRemoveFile = (index: number) => {
      const updated = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(updated);
      onFilesSelected?.(updated);
      if (inputRef.current) inputRef.current.value = "";
    };

    const formatBytes = (bytes: number) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
      <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
        {label && (
          <label className="block text-xs font-medium text-[var(--foreground)]">
            {label}
          </label>
        )}

        {/* Hidden Native File Input */}
        <input
          ref={(node) => {
            // Forward ref and internal ref
            (inputRef as any).current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as any).current = node;
          }}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleInputChange}
          className="hidden"
          {...(directory ? { webkitdirectory: "", directory: "" } : {})}
        />

        {/* Drag and Drop Surface */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-5 rounded-[var(--radius)] border-2 border-dashed transition-all cursor-pointer select-none text-center ${
            isDragOver
              ? "border-[var(--primary)] bg-[var(--primary)]/10 scale-[1.01]"
              : activeError
              ? "border-red-500/60 bg-red-50/50 dark:bg-red-950/20"
              : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/60 hover:bg-[var(--background)]"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="h-10 w-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mb-2">
            {directory ? (
              <FolderIcon className="h-5 w-5" />
            ) : (
              <UploadCloud className="h-5 w-5" />
            )}
          </div>

          <p className="text-xs font-semibold text-[var(--foreground)]">
            {directory
              ? "Seleccionar Carpeta Completa"
              : "Haz clic para subir o arrastra tus archivos aquí"}
          </p>

          <p className="text-[11px] text-[var(--foreground)] opacity-60 mt-0.5">
            {accept ? `Formatos: ${accept}` : "Todos los formatos permitidos"}
            {maxSizeMB ? ` • Hasta ${maxSizeMB}MB` : ""}
          </p>
        </div>

        {/* Selected Files List Preview */}
        {selectedFiles.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-[var(--foreground)] opacity-70">
              Archivos seleccionados ({selectedFiles.length}):
            </span>
            <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
              {selectedFiles.map((file, idx) => (
                <div
                  key={`${file.name}-${idx}`}
                  className="flex items-center justify-between p-2 rounded-[calc(var(--radius)*0.6)] border border-[var(--border)] bg-[var(--background)] text-xs"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    {directory ? (
                      <FolderIcon className="h-4 w-4 shrink-0 text-amber-500" />
                    ) : (
                      <FileIcon className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                    )}
                    <span className="truncate font-medium text-[var(--foreground)]">
                      {file.name}
                    </span>
                    <span className="text-[10px] opacity-60 shrink-0 font-mono">
                      ({formatBytes(file.size)})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(idx);
                    }}
                    className="p-1 text-zinc-400 hover:text-red-500 transition cursor-pointer shrink-0"
                    title="Remover archivo"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error / Helper text */}
        {activeError ? (
          <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
            <AlertCircle className="h-3 w-3 shrink-0" />
            {activeError}
          </p>
        ) : helperText ? (
          <p className="text-xs text-[var(--foreground)] opacity-60 mt-1">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);
