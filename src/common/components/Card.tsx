import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export interface CardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Variante visual de la tarjeta */
  variant?: "default" | "flat" | "outline" | "ghost";
  /** Si debe tener microinteracción animada al hacer hover */
  interactive?: boolean;
  /** Título directo opcional para uso rápido */
  title?: ReactNode;
  /** Subtítulo o descripción breve */
  description?: ReactNode;
  /** Elemento complementario en el encabezado (ej. botones, insignias) */
  headerExtra?: ReactNode;
  /** Pie de tarjeta opcional (ej. acciones, botones) */
  footer?: ReactNode;
  /** Contenido del cuerpo de la tarjeta */
  children?: ReactNode;
}

const variantStyles: Record<NonNullable<CardProps["variant"]>, string> = {
  default:
    "bg-[var(--card)] text-[var(--card-foreground)] border border-[var(--border)] shadow-xs",
  flat: "bg-[var(--card)] text-[var(--card-foreground)] border-0",
  outline:
    "bg-transparent text-[var(--card-foreground)] border border-[var(--border)]",
  ghost: "bg-transparent text-[var(--card-foreground)] border-0 shadow-none",
};

/**
 * Componente Card contenedor estilizado según los tokens del tema activo.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    variant = "default",
    interactive = false,
    title,
    description,
    headerExtra,
    footer,
    children,
    className = "",
    ...props
  },
  ref
) {
  const hasDirectHeader = Boolean(title || description || headerExtra);

  const interactiveStyles = interactive
    ? "transition-all duration-200 ease-out hover:[transform:var(--card-hover-transform)] hover:shadow-[var(--card-hover-shadow)] hover:border-[var(--card-hover-border)] cursor-pointer"
    : "transition-colors duration-200";

  return (
    <div
      ref={ref}
      className={`rounded-[var(--radius)] ${interactiveStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {hasDirectHeader && (
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            {headerExtra && <div className="shrink-0">{headerExtra}</div>}
          </div>
        </CardHeader>
      )}

      {hasDirectHeader ? (
        children ? (
          <CardContent>{children}</CardContent>
        ) : null
      ) : (
        children
      )}

      {footer && <CardFooter>{footer}</CardFooter>}
    </div>
  );
});

export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function CardHeader({ className = "", ...props }, ref) {
  return (
    <div
      ref={ref}
      className={`flex flex-col space-y-1.5 p-6 ${className}`}
      {...props}
    />
  );
});

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(function CardTitle({ className = "", ...props }, ref) {
  return (
    <h3
      ref={ref}
      className={`font-heading text-lg font-bold leading-none tracking-tight text-[var(--card-foreground)] ${className}`}
      {...props}
    />
  );
});

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className = "", ...props }, ref) {
  return (
    <p
      ref={ref}
      className={`text-xs text-zinc-500 dark:text-zinc-400 ${className}`}
      {...props}
    />
  );
});

export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function CardContent({ className = "", ...props }, ref) {
  return <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />;
});

export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function CardFooter({ className = "", ...props }, ref) {
  return (
    <div
      ref={ref}
      className={`flex items-center p-6 border-t border-[var(--border)] ${className}`}
      {...props}
    />
  );
});

export default Card;
