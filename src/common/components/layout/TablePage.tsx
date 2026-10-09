import type { ReactNode } from "react";
import type { TableColumn, TableProps } from "@/common/lib/types";
import { PageHeader } from "./PageHeader";
import { Button } from "../Button";
import { Table } from "../Table";
import type { LucideIcon } from "lucide-react";

export interface TablePageProps<T> {
  // Page Header
  title: ReactNode;
  description?: ReactNode;

  // Action Button
  actionLabel?: string;
  actionIcon?: LucideIcon | ReactNode;
  onAction?: () => void;
  actionElement?: ReactNode;
  headerExtra?: ReactNode;
  headerSlot?: ReactNode;

  // Table Props
  columns?: TableColumn<T>[];
  data?: T[];
  totalCount?: number;
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
  rowId?: (keyof T & string) | ((row: T) => string);
  onRowClick?: (row: T) => void;

  // Pagination & Filters (forwarded to Table)
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  sort?: TableProps<T>["sort"];
  onSortChange?: TableProps<T>["onSortChange"];
  filters?: TableProps<T>["filters"];
  onFilterChange?: TableProps<T>["onFilterChange"];
  onClearFilters?: TableProps<T>["onClearFilters"];
  enableFilters?: boolean;

  // Custom Table or overrides
  tableProps?: Partial<TableProps<T>>;
  tableElement?: ReactNode;

  // Additional elements like Modals, Drawers
  children?: ReactNode;
  className?: string;
}

export function TablePage<T>(props: TablePageProps<T>) {
  const {
    title,
    description = "",
    actionLabel,
    actionIcon,
    onAction,
    actionElement,
    headerExtra,
    headerSlot,
    columns,
    data,
    totalCount,
    isLoading,
    error,
    onRetry,
    rowId,
    onRowClick,
    pageSize,
    currentPage,
    onPageChange,
    pageSizeOptions,
    onPageSizeChange,
    sort,
    onSortChange,
    filters,
    onFilterChange,
    onClearFilters,
    enableFilters,
    tableProps,
    tableElement,
    children,
    className = "",
  } = props;

  const defaultAction =
    actionLabel && onAction ? (
      <Button type="button" icon={actionIcon} onClick={onAction}>
        {actionLabel}
      </Button>
    ) : null;

  const action = actionElement !== undefined ? actionElement : defaultAction;

  return (
    <div className={`flex flex-col flex-1 h-full min-h-0 space-y-4 w-full ${className}`}>
      <PageHeader
        title={title}
        description={description}
        actionElement={
          action || headerExtra ? (
            <div className="flex items-center gap-2.5">
              {headerExtra}
              {action}
            </div>
          ) : undefined
        }
      />

      {headerSlot}

      <div className="flex-1 min-h-0 flex flex-col">
        {tableElement ??
          (columns && (data || error || isLoading) ? (
            <Table<T>
              columns={columns}
              data={data ?? []}
              totalCount={totalCount}
              isLoading={isLoading}
              error={error}
              onRetry={onRetry}
              rowId={rowId}
              onRowClick={onRowClick}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={onPageChange}
              pageSizeOptions={pageSizeOptions}
              onPageSizeChange={onPageSizeChange}
              sort={sort}
              onSortChange={onSortChange}
              filters={filters}
              onFilterChange={onFilterChange}
              onClearFilters={onClearFilters}
              enableFilters={enableFilters}
              {...tableProps}
            />
          ) : null)}
      </div>

      {children}
    </div>
  );
}

export default TablePage;
