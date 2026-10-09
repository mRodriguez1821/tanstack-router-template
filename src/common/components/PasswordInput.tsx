import { forwardRef, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input, type InputProps } from "./Input";

export interface PasswordInputProps extends Omit<InputProps, "type"> {
  /** Muestra por defecto el ícono de candado en el extremo izquierdo (por defecto: true) */
  showLockIcon?: boolean;
  /** Permite alternar la visibilidad de la contraseña con el botón de ojo (por defecto: true) */
  allowToggleVisibility?: boolean;
}

/**
 * Componente especializado PasswordInput:
 * - Alterna entre enmascarado (password) y texto claro (text) mediante botón de ojo.
 * - Incluye ícono de candado configurable a la izquierda.
 * - Integra validación Zod, estados de error y tokens del tema visual.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      showLockIcon = true,
      allowToggleVisibility = true,
      icon,
      actionElement,
      className = "",
      ...props
    },
    ref
  ) {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    const toggleButton = allowToggleVisibility ? (
      <button
        type="button"
        tabIndex={-1}
        onClick={toggleVisibility}
        className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors focus:outline-none cursor-pointer"
        aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
        title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 shrink-0" />
        ) : (
          <Eye className="h-4 w-4 shrink-0" />
        )}
      </button>
    ) : null;

    // Ícono izquierdo: por defecto candado si showLockIcon es true y no se especificó otro
    const leftIcon = icon !== undefined ? icon : showLockIcon ? Lock : undefined;

    return (
      <Input
        ref={ref}
        type={showPassword ? "text" : "password"}
        icon={leftIcon}
        actionElement={actionElement || toggleButton}
        className={className}
        {...props}
      />
    );
  }
);
