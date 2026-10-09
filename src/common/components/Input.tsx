import {
  forwardRef,
  isValidElement,
  useState,
  type ComponentType,
  type FocusEvent,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import type { LucideIcon } from "lucide-react";
import type { z } from "zod";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Etiqueta superior del campo */
  label?: ReactNode;
  /** Mensaje de error a mostrar debajo del campo */
  error?: ReactNode;
  /** Texto de ayuda informativo debajo del campo */
  helperText?: ReactNode;
  /** Ícono a mostrar dentro del input */
  icon?: LucideIcon | ReactNode;
  /** Posición del ícono: "left" (por defecto) o "right" */
  iconPosition?: "left" | "right";
  /** Elemento de acción en el extremo derecho (ej. botón ver contraseña, limpiar) */
  actionElement?: ReactNode;
  /** Tamaño del input */
  inputSize?: "sm" | "md" | "lg";
  /** Esquema Zod para validación reactiva del input */
  schema?: z.ZodTypeAny;
  /** Si debe validar con el esquema Zod en onBlur (por defecto: true) */
  validateOnBlur?: boolean;
  /** Si debe validar con el esquema Zod en onChange (por defecto: false) */
  validateOnChange?: boolean;
  /** Callback opcional notificado cuando cambia el estado de validación de Zod */
  onValidationError?: (errorMessage: string | null) => void;
  /** Clases adicionales para el contenedor global (label + input + error) */
  containerClassName?: string;
}

const sizeStyles = {
  sm: "h-8 px-2.5 text-xs",
  md: "h-9 px-3.5 text-sm",
  lg: "h-11 px-4 text-base",
};

/**
 * Componente Input reutilizable estilizado con las variables de tema y soporte para validación con Zod.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error: propError,
    helperText,
    icon,
    iconPosition = "left",
    actionElement,
    inputSize = "md",
    schema,
    validateOnBlur = true,
    validateOnChange = false,
    onValidationError,
    containerClassName = "",
    className = "",
    disabled,
    id,
    onBlur,
    onChange,
    ...props
  },
  ref
) {
  const [internalError, setInternalError] = useState<string | null>(null);

  // El error activo es el prop directo (ej. de react-hook-form) o el calculado por Zod
  const activeError = propError || internalError;

  const validateWithSchema = (val: unknown) => {
    if (!schema) return true;
    const result = schema.safeParse(val);
    if (!result.success) {
      const message = result.error.issues[0]?.message || "Valor inválido";
      setInternalError(message);
      onValidationError?.(message);
      return false;
    }
    setInternalError(null);
    onValidationError?.(null);
    return true;
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (schema && validateOnBlur) {
      validateWithSchema(e.target.value);
    }
    onBlur?.(e);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (schema && (validateOnChange || internalError)) {
      validateWithSchema(e.target.value);
    }
    onChange?.(e);
  };

  const renderIcon = () => {
    if (!icon) return null;
    if (isValidElement(icon)) return icon;
    const IconComponent = icon as ComponentType<{ className?: string }>;
    return <IconComponent className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500" />;
  };

  const hasLeftIcon = Boolean(icon && iconPosition === "left");
  const hasRightElement = Boolean((icon && iconPosition === "right") || actionElement);

  return (
    <div className={`flex flex-col space-y-1.5 w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {hasLeftIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none">
            {renderIcon()}
          </div>
        )}

        <input
          ref={ref}
          id={id}
          disabled={disabled}
          onBlur={handleBlur}
          onChange={handleChange}
          className={`w-full rounded-[var(--radius)] border bg-[var(--card)] text-[var(--foreground)] placeholder:text-zinc-400 dark:placeholder:text-zinc-500 transition-colors duration-150 focus:outline-hidden ${
            sizeStyles[inputSize]
          } ${hasLeftIcon ? "pl-9" : ""} ${
            hasRightElement ? "pr-9" : ""
          } ${
            activeError
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
          } ${
            disabled
              ? "opacity-50 cursor-not-allowed bg-zinc-100 dark:bg-zinc-900"
              : ""
          } ${className}`}
          {...props}
        />

        {hasRightElement && (
          <div className="absolute right-3 flex items-center">
            {actionElement || renderIcon()}
          </div>
        )}
      </div>

      {activeError ? (
        <p className="text-xs text-red-500 font-medium transition-all animate-fadeIn">
          {activeError}
        </p>
      ) : helperText ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
