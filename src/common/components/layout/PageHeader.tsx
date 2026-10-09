import type { ReactNode } from "react";

export interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actionElement?: ReactNode;
  extra?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actionElement,
  extra,
  className = "",
}: PageHeaderProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)] w-full transition-colors duration-200 ${className}`}
    >
      <div className="flex flex-col min-w-0">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--foreground)] truncate font-heading">
          {title}
        </h1>
        {description && (
          <p className="text-xs md:text-sm text-[var(--foreground)]/60 mt-0.5">
            {description}
          </p>
        )}
      </div>

      {(actionElement || extra) && (
        <div className="flex items-center gap-2.5 shrink-0">
          {extra}
          {actionElement}
        </div>
      )}
    </div>
  );
}

export default PageHeader;
