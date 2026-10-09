import {
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ComponentType,
  type ReactNode,
} from "react";
import { Loader2, type LucideIcon } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ícono a mostrar (nombre de ícono string como en WorkforceHub, componente Lucide o elemento JSX) */
  icon?: string | LucideIcon | ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  children?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs hover:brightness-105 active:brightness-95 focus-visible:ring-[var(--primary)]",
  secondary:
    "bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] shadow-xs hover:border-[var(--primary)]/50 hover:bg-[var(--background)] active:bg-[var(--border)]/30 focus-visible:ring-[var(--primary)]",
  outline:
    "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:border-[var(--primary)]/60 hover:bg-[var(--card)] hover:text-[var(--primary)] active:bg-[var(--border)]/20 focus-visible:ring-[var(--primary)]",
  danger:
    "border border-red-600 bg-red-600 text-white shadow-xs hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-400",
  ghost:
    "bg-transparent text-[var(--foreground)] hover:bg-[var(--card)] hover:text-[var(--primary)] hover:shadow-none active:bg-[var(--border)]/20 focus-visible:ring-[var(--primary)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-[var(--btn-height-sm,2rem)] px-[var(--btn-px-sm,0.625rem)] text-[var(--font-size-xs,0.75rem)] rounded-[var(--radius)] gap-[var(--btn-gap-sm,0.375rem)]",
  md: "h-[var(--btn-height-md,2.375rem)] px-[var(--btn-px-md,0.875rem)] text-[var(--font-size-sm,0.875rem)] rounded-[var(--radius)] gap-[var(--btn-gap-md,0.5rem)]",
  lg: "h-[var(--btn-height-lg,2.75rem)] px-[var(--btn-px-lg,1.25rem)] text-[var(--font-size-base,1rem)] rounded-[var(--radius)] gap-[var(--btn-gap-lg,0.625rem)]",
};

const iconSizeMap: Record<ButtonSize, string> = {
  sm: "h-[var(--icon-xs,0.875rem)] w-[var(--icon-xs,0.875rem)] text-[14px]",
  md: "h-[var(--icon-sm,1rem)] w-[var(--icon-sm,1rem)] text-[16px]",
  lg: "h-[var(--icon-md,1.25rem)] w-[var(--icon-md,1.25rem)] text-[20px]",
};

/**
 * Componente Button traído de WorkforceHub Web con soporte para:
 * - Animación fluida de hover y feedback táctil active (elevación y escala suave)
 * - Variables de tema (tokens de altura, padding, fuentes, íconos y radio de bordes)
 * - Variantes ('primary' | 'secondary' | 'outline' | 'danger' | 'ghost')
 * - Soporte de íconos string (Material Symbols), Lucide y ReactNode
 * - Estado de carga reactivo (isLoading)
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    icon,
    iconPosition = "left",
    isLoading = false,
    children,
    className = "",
    disabled,
    type = "button",
    ...props
  },
  ref
) {
  const baseClasses =
    "inline-flex items-center justify-center font-bold select-none cursor-pointer " +
    "transition-all duration-200 ease-out " +
    "hover:[transform:var(--btn-hover-transform)] hover:shadow-[var(--btn-hover-shadow)] " +
    "active:[transform:var(--btn-active-transform)] active:shadow-xs " +
    "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] " +
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:[transform:none] disabled:shadow-none";

  const renderIcon = () => {
    if (!icon) return null;
    if (isValidElement(icon)) {
      return icon;
    }
    // Soporte para íconos string (ej. nombres de WorkforceHub / Material Symbols)
    if (typeof icon === "string") {
      return (
        <span
          className={`material-symbols-outlined leading-none shrink-0 ${iconSizeMap[size]}`}
        >
          {icon}
        </span>
      );
    }
    // Soporte para componentes de íconos (ej. Lucide icons)
    if (
      typeof icon === "function" ||
      (typeof icon === "object" && icon !== null && "$$typeof" in icon)
    ) {
      const IconComponent = icon as ComponentType<{ className?: string }>;
      return <IconComponent className={`${iconSizeMap[size]} shrink-0`} />;
    }
    return null;
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className={`${iconSizeMap[size]} animate-spin shrink-0`} />
      ) : (
        iconPosition === "left" && renderIcon()
      )}
      {children}
      {!isLoading && iconPosition === "right" && renderIcon()}
    </button>
  );
});

export default Button;
