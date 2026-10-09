import type { ReactNode, ThHTMLAttributes } from "react";
import type { Path } from "react-hook-form";

export type SidebarItemProps = {
  href: string;
  icon: ReactNode;
  label: string;
};

export type FilterType = "string" | "select" | "date" | "date-range" | "boolean" | "number";

export type FilterOption = {
  label: string;
  value: string | number | boolean;
};

export type TableColumn<T> = {
  label: string;
  key: (Path<T> & string) | string;
  width?: number | string;
  header?: () => ReactNode;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  sortField?: string;
  filterable?: boolean;
  filterType?: FilterType;
  filterField?: string;
  filterOptions?: FilterOption[];
  filterPlaceholder?: string;
  isDateOnly?: boolean;
} & Pick<ThHTMLAttributes<T>, "rowSpan" | "colSpan" | "align">;

export type SortDirection = "asc" | "desc";

export type ColumnSort = {
  field: string;
  direction: SortDirection;
};

export type DateRangeFilter = {
  from?: string;
  to?: string;
};

export type ColumnFilterValue =
  | string
  | number
  | boolean
  | DateRangeFilter
  | null
  | undefined;

export type TableFilters = Record<string, ColumnFilterValue>;

export type TableProps<T> = {
  columns: TableColumn<T>[];
  currentPage?: number;
  totalCount?: number;
  totalElements?: number;
  totalPages?: number;
  pageSize?: number;
  serverSide?: boolean;
  height?: string | number;
  maxHeight?: string | number;
  data: T[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
  rowId?: (keyof T & string) | ((row: T) => string);
  onPageChange?: (page: number) => void;
  onRowClick?: (row: T) => void;
  sort?: ColumnSort | null;
  onSortChange?: (sort: ColumnSort | null) => void;
  filters?: TableFilters;
  onFilterChange?: (key: string, value: ColumnFilterValue) => void;
  onClearFilters?: () => void;
  onFilteredDataChange?: (filteredData: T[]) => void;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  enableFilters?: boolean;
  className?: string;
  containerClassName?: string;
  emptyText?: string;
};
