import type { ReactNode } from "react";
import { PageHeader } from "./PageHeader";

export interface PageLayoutProps {
  title?: ReactNode;
  description?: ReactNode;
  actionElement?: ReactNode;
  headerExtra?: ReactNode;
  headerSlot?: ReactNode;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function PageLayout({
  title,
  description,
  actionElement,
  headerExtra,
  headerSlot,
  children,
  className = "",
  contentClassName = "",
}: PageLayoutProps) {
  return (
    <div className={`flex flex-col flex-1 h-full min-h-0 space-y-6 w-full ${className}`}>
      {title && (
        <PageHeader
          title={title}
          description={description}
          actionElement={actionElement}
          extra={headerExtra}
        />
      )}

      {headerSlot}

      <div className={`${contentClassName}`}>
        {children}
      </div>
    </div>
  );
}

export default PageLayout;
