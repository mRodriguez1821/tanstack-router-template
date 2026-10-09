import { useState, useMemo, useEffect, useRef, type Key } from "react";
import {
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Inbox,
  X,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import type {
  TableProps,
  TableColumn,
  ColumnSort,
  ColumnFilterValue,
  TableFilters,
} from "@/common/lib/types";

interface TableHeaderCellProps<T> {
  col: TableColumn<T>;
  colIndex: number;
  totalColumns: number;
  sort: ColumnSort | null;
  onSortToggle: (key: string, sortField?: string, direction?: "asc" | "desc") => void;
  onSortClear: () => void;
  filterValue: ColumnFilterValue;
  onFilterChange: (key: string, val: ColumnFilterValue) => void;
  showFilters: boolean;
}

function TableHeaderCell<T>({
  col,
  colIndex,
  totalColumns,
  sort,
  onSortToggle,
  onSortClear,
  filterValue,
  onFilterChange,
  showFilters,
}: TableHeaderCellProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const cellRef = useRef<HTMLTableCellElement>(null);

  const sortField = col.sortField || col.key;
  const isSorted = sort?.field === sortField;
  const sortDirection = isSorted ? sort?.direction : null;

  const isFilterActive =
    filterValue !== undefined && filterValue !== null && filterValue !== "";

  const canControl = col.sortable || (col.filterable && showFilters);

  // Close floating popover on click outside or Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (cellRef.current && !cellRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const headerLabel = col.header ? col.header() : col.label;

  return (
    <th
      ref={cellRef}
      style={{ width: col.width }}
      className="relative p-3 font-semibold text-xs text-[var(--card-foreground)] select-none"
    >
      <div className="flex items-center justify-between gap-1.5">
        <span
          onClick={
            col.sortable
              ? () => onSortToggle(col.key, col.sortField)
              : undefined
          }
          className={`truncate font-bold ${
            col.sortable ? "cursor-pointer hover:text-[var(--primary)] transition" : ""
          }`}
        >
          {headerLabel}
        </span>

        {canControl && (
          <div className="relative inline-flex items-center">
            {/* Action button: Opens floating menu */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen((prev) => !prev);
              }}
              title="Filtrar u ordenar columna"
              className={`inline-flex items-center justify-center h-6 w-6 rounded-[calc(var(--radius)*0.5)] transition cursor-pointer ${
                isOpen
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                  : isFilterActive || isSorted
                  ? "bg-[var(--primary)]/15 text-[var(--primary)] font-bold ring-1 ring-[var(--primary)]/30"
                  : "text-[var(--card-foreground)]/40 hover:text-[var(--card-foreground)] hover:bg-[var(--border)]/40"
              }`}
            >
              {isFilterActive ? (
                <SlidersHorizontal className="h-3.5 w-3.5" />
              ) : isSorted ? (
                sortDirection === "asc" ? (
                  <ArrowUp className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDown className="h-3.5 w-3.5" />
                )
              ) : (
                <SlidersHorizontal className="h-3 w-3" />
              )}
            </button>

            {/* Floating Popover like WorkforceHub */}
            {isOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute z-50 top-full mt-2 w-64 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-3 shadow-xl text-left font-normal text-xs text-[var(--card-foreground)] backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 ${
                  colIndex >= totalColumns - 2 ? "right-0" : "left-0"
                }`}
              >
                {/* Popover Header */}
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 mb-2.5">
                  <span className="text-xs font-bold text-[var(--foreground)] truncate max-w-[190px]">
                    {headerLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Sorting Controls */}
                {col.sortable && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground)] opacity-50">
                      Ordenar columna
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSortToggle(col.key, col.sortField, "asc")}
                        className={`inline-flex items-center justify-center gap-1 h-7 rounded-[calc(var(--radius)*0.5)] text-xs border transition cursor-pointer ${
                          isSorted && sortDirection === "asc"
                            ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] font-bold shadow-xs"
                            : "bg-[var(--background)] hover:border-[var(--primary)] text-[var(--foreground)] border-[var(--border)]"
                        }`}
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                        <span>Ascendente</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onSortToggle(col.key, col.sortField, "desc")}
                        className={`inline-flex items-center justify-center gap-1 h-7 rounded-[calc(var(--radius)*0.5)] text-xs border transition cursor-pointer ${
                          isSorted && sortDirection === "desc"
                            ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] font-bold shadow-xs"
                            : "bg-[var(--background)] hover:border-[var(--primary)] text-[var(--foreground)] border-[var(--border)]"
                        }`}
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                        <span>Descendente</span>
                      </button>
                    </div>
                    {isSorted && (
                      <button
                        type="button"
                        onClick={onSortClear}
                        className="text-[11px] text-[var(--primary)] hover:underline transition mt-0.5"
                      >
                        Limpiar ordenamiento
                      </button>
                    )}
                  </div>
                )}

                {col.sortable && col.filterable && showFilters && (
                  <hr className="my-2.5 border-[var(--border)]" />
                )}

                {/* Filter / Search Controls */}
                {col.filterable && showFilters && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground)] opacity-50">
                      Filtrar / Búsqueda
                    </p>

                    {col.filterType === "select" && col.filterOptions ? (
                      <select
                        value={String(filterValue ?? "")}
                        onChange={(e) => onFilterChange(col.key, e.target.value)}
                        className="h-8 w-full rounded-[calc(var(--radius)*0.5)] border border-[var(--border)] bg-[var(--background)] px-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                      >
                        <option value="">Todos</option>
                        {col.filterOptions.map((opt) => (
                          <option key={String(opt.value)} value={String(opt.value)}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : col.filterType === "boolean" ? (
                      <select
                        value={String(filterValue ?? "")}
                        onChange={(e) => onFilterChange(col.key, e.target.value)}
                        className="h-8 w-full rounded-[calc(var(--radius)*0.5)] border border-[var(--border)] bg-[var(--background)] px-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                      >
                        <option value="">Todos</option>
                        <option value="true">Sí / Activo</option>
                        <option value="false">No / Inactivo</option>
                      </select>
                    ) : (
                      <div className="relative flex items-center">
                        <Search className="pointer-events-none absolute left-2 h-3.5 w-3.5 text-[var(--foreground)] opacity-40" />
                        <input
                          type="text"
                          autoFocus
                          value={String(filterValue ?? "")}
                          onChange={(e) => onFilterChange(col.key, e.target.value)}
                          placeholder={col.filterPlaceholder ?? "Buscar..."}
                          className="h-8 w-full rounded-[calc(var(--radius)*0.5)] border border-[var(--border)] bg-[var(--background)] pl-7 pr-7 text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                        />
                        {filterValue ? (
                          <button
                            type="button"
                            onClick={() => onFilterChange(col.key, "")}
                            className="absolute right-1.5 p-0.5 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        ) : null}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </th>
  );
}

export function Table<T>({
  columns,
  data,
  totalCount,
  totalElements,
  totalPages: propTotalPages,
  currentPage: propCurrentPage,
  pageSize: propPageSize,
  pageSizeOptions = [10, 20, 50, 100],
  serverSide = false,
  height = "520px",
  maxHeight,
  isLoading = false,
  error,
  onRetry,
  rowId = "id" as keyof T & string,
  onPageChange: propOnPageChange,
  onPageSizeChange: propOnPageSizeChange,
  onRowClick,
  sort: propSort,
  onSortChange: propOnSortChange,
  filters: propFilters,
  onFilterChange: propOnFilterChange,
  onClearFilters: propOnClearFilters,
  enableFilters = true,
  emptyText = "No se encontraron registros",
  className = "",
  containerClassName = "",
}: TableProps<T>) {
  // Uncontrolled vs Controlled state
  const isControlledSort = propOnSortChange !== undefined;
  const [internalSort, setInternalSort] = useState<ColumnSort | null>(null);
  const sort = isControlledSort ? propSort : internalSort;

  const isControlledFilters = propOnFilterChange !== undefined;
  const [internalFilters, setInternalFilters] = useState<TableFilters>({});
  const filters = isControlledFilters ? propFilters ?? {} : internalFilters;

  const isControlledPagination = propOnPageChange !== undefined;
  const [internalPage, setInternalPage] = useState(propCurrentPage ?? 1);
  const currentPage = isControlledPagination ? propCurrentPage ?? 1 : internalPage;

  const isControlledPageSize = propOnPageSizeChange !== undefined;
  const [internalPageSize, setInternalPageSize] = useState(propPageSize ?? 10);
  const pageSize = isControlledPageSize ? propPageSize ?? 10 : internalPageSize;

  // Sincronizar estado interno cuando cambian los props desde fuera (Storybook controls o parent)
  useEffect(() => {
    if (propCurrentPage !== undefined) {
      setInternalPage(propCurrentPage);
    }
  }, [propCurrentPage]);

  useEffect(() => {
    if (propPageSize !== undefined) {
      setInternalPageSize(propPageSize);
    }
  }, [propPageSize]);

  // Asegurar que el pageSize actual siempre esté presente en las opciones del selector
  const effectivePageSizeOptions = useMemo(() => {
    if (pageSizeOptions.includes(pageSize)) {
      return pageSizeOptions;
    }
    return [...pageSizeOptions, pageSize].sort((a, b) => a - b);
  }, [pageSizeOptions, pageSize]);

  const handlePageChange = (newPage: number) => {
    if (isControlledPagination) {
      propOnPageChange?.(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    if (isControlledPageSize) {
      propOnPageSizeChange?.(newSize);
    } else {
      setInternalPageSize(newSize);
      setInternalPage(1);
    }
  };

  const handleSortToggle = (colKey: string, customField?: string, direction?: "asc" | "desc") => {
    const field = customField || colKey;
    let nextSort: ColumnSort | null = null;

    if (direction) {
      nextSort = { field, direction };
    } else if (!sort || sort.field !== field) {
      nextSort = { field, direction: "asc" };
    } else if (sort.direction === "asc") {
      nextSort = { field, direction: "desc" };
    } else {
      nextSort = null;
    }

    if (isControlledSort) {
      propOnSortChange?.(nextSort);
    } else {
      setInternalSort(nextSort);
    }
  };

  const handleSortClear = () => {
    if (isControlledSort) {
      propOnSortChange?.(null);
    } else {
      setInternalSort(null);
    }
  };

  const handleFilterChange = (key: string, val: ColumnFilterValue) => {
    if (isControlledFilters) {
      propOnFilterChange?.(key, val);
    } else {
      setInternalFilters((prev) => ({ ...prev, [key]: val }));
      setInternalPage(1);
    }
  };

  const handleClearFilters = () => {
    if (propOnClearFilters) {
      propOnClearFilters();
    } else {
      setInternalFilters({});
      setInternalPage(1);
    }
  };

  // Helper to extract nested values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getVal = (row: any, path: string): any => {
    if (!row || !path) return undefined;
    return path.split(".").reduce((acc, part) => (acc != null ? acc[part] : undefined), row);
  };

  const explicitTotal = totalElements ?? totalCount;

  // Client-side computation for sorting, filtering and pagination
  const { displayData, activeTotal } = useMemo(() => {
    // Si se especifica serverSide expresamente, delegamos a los datos ya paginados por backend
    if (serverSide) {
      return {
        displayData: data,
        activeTotal: explicitTotal ?? data.length,
      };
    }

    let items = [...data];

    // Client-side filtering
    if (filters && Object.keys(filters).length > 0) {
      items = items.filter((row) => {
        return Object.entries(filters).every(([colKey, filterVal]) => {
          if (filterVal === undefined || filterVal === null || filterVal === "") return true;
          const col = columns.find((c) => c.key === colKey);
          const rawVal = getVal(row, col?.filterField || colKey);
          if (rawVal == null) return false;

          const query = String(filterVal).toLowerCase().trim();
          return String(rawVal).toLowerCase().includes(query);
        });
      });
    }

    const filteredTotal = items.length;

    // Client-side sorting
    if (sort) {
      items.sort((a, b) => {
        const valA = getVal(a, sort.field);
        const valB = getVal(b, sort.field);

        if (valA == null && valB == null) return 0;
        if (valA == null) return sort.direction === "asc" ? -1 : 1;
        if (valB == null) return sort.direction === "asc" ? 1 : -1;

        if (typeof valA === "number" && typeof valB === "number") {
          return sort.direction === "asc" ? valA - valB : valB - valA;
        }

        return sort.direction === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    // Client-side pagination (limita las filas mostradas a pageSize)
    if (pageSize && pageSize > 0) {
      const start = Math.max(0, (currentPage - 1) * pageSize);
      items = items.slice(start, start + pageSize);
    }

    return {
      displayData: items,
      activeTotal: explicitTotal ?? filteredTotal,
    };
  }, [
    data,
    columns,
    filters,
    sort,
    currentPage,
    pageSize,
    explicitTotal,
    serverSide,
  ]);

  const hasFilterableColumns = columns.some((c) => c.filterable);
  const shouldShowFilters = enableFilters ?? hasFilterableColumns;
  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== null && v !== ""
  ).length;

  const totalPages = propTotalPages ?? Math.max(1, Math.ceil(activeTotal / (pageSize || 1)));
  const fromRecord = activeTotal > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const toRecord = Math.min(currentPage * pageSize, activeTotal);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  }, [currentPage, totalPages]);

  const getRowKey = (row: T, idx: number): Key => {
    if (typeof rowId === "function") return rowId(row);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const val = (row as any)[rowId];
    return val != null ? String(val) : idx;
  };

  return (
    <div
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
      }}
      className={`flex flex-col w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] shadow-xs overflow-hidden ${containerClassName}`}
    >
      {/* Scrollable Records Container */}
      <div className={`flex-1 min-h-0 overflow-y-auto overflow-x-auto ${className}`}>
        <table className="w-full text-left border-collapse">
          {/* Table Header with WorkforceHub-style floating controls */}
          <thead className="sticky top-0 z-20 bg-[var(--background)] border-b border-[var(--border)] text-[11px] font-semibold tracking-wider text-[var(--card-foreground)]/70 uppercase select-none shadow-xs">
            <tr>
              {columns.map((col, colIndex) => (
                <TableHeaderCell<T>
                  key={col.key}
                  col={col}
                  colIndex={colIndex}
                  totalColumns={columns.length}
                  sort={sort ?? null}
                  onSortToggle={handleSortToggle}
                  onSortClear={handleSortClear}
                  filterValue={filters[col.key]}
                  onFilterChange={handleFilterChange}
                  showFilters={shouldShowFilters}
                />
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[var(--border)]/60 text-xs text-[var(--card-foreground)]">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-[var(--card-foreground)]/50">
                    <Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" />
                    <span>Cargando información...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-[var(--card-foreground)] font-semibold">{error}</p>
                    {onRetry && (
                      <button
                        type="button"
                        onClick={onRetry}
                        className="rounded-[var(--radius)] bg-[var(--primary)] px-3 py-1.5 text-xs text-[var(--primary-foreground)] hover:brightness-105 transition"
                      >
                        Reintentar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : displayData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-[var(--card-foreground)]/40">
                    <Inbox className="h-8 w-8 stroke-1" />
                    <p className="text-sm font-medium">{emptyText}</p>
                    {activeFiltersCount > 0 && (
                      <button
                        type="button"
                        onClick={handleClearFilters}
                        className="text-xs text-[var(--primary)] hover:underline mt-1 cursor-pointer"
                      >
                        Limpiar todos los filtros ({activeFiltersCount})
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              displayData.map((row, idx) => {
                const k = getRowKey(row, idx);
                return (
                  <tr
                    key={k}
                    onClick={() => onRowClick?.(row)}
                    className={`transition-colors hover:bg-[var(--border)]/20 ${
                      onRowClick ? "cursor-pointer" : ""
                    }`}
                  >
                    {columns.map((col) => {
                      const cellVal = getVal(row, col.key);
                      return (
                        <td
                          key={col.key}
                          align={col.align}
                          className="p-3 text-[var(--card-foreground)]"
                        >
                          {col.render ? (
                            col.render(row)
                          ) : cellVal !== undefined && cellVal !== null ? (
                            String(cellVal)
                          ) : (
                            <span className="text-[var(--card-foreground)]/30">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-xs text-[var(--card-foreground)]/70 shrink-0">
        <div className="flex items-center gap-4">
          <span>
            Mostrando <strong className="text-[var(--card-foreground)]">{fromRecord}</strong> a{" "}
            <strong className="text-[var(--card-foreground)]">{toRecord}</strong> de{" "}
            <strong className="text-[var(--card-foreground)]">{activeTotal}</strong> registros
          </span>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-[var(--primary)] underline font-medium cursor-pointer"
            >
              Limpiar filtros ({activeFiltersCount})
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Page size select */}
          <div className="flex items-center gap-1.5">
            <span>Filas:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] px-2 py-0.5 text-xs text-[var(--card-foreground)] focus:border-[var(--primary)] focus:outline-hidden cursor-pointer"
            >
              {effectivePageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Page Navigator Group (WorkforceHub style: primero, anterior, [1][2][3], siguiente, ultimo) */}
          <div className="flex items-center overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] shadow-xs font-semibold text-xs select-none">
            {/* Primera página */}
            <button
              type="button"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => handlePageChange(1)}
              className="flex h-7.5 w-7.5 items-center justify-center border-r border-[var(--border)] text-[var(--card-foreground)]/70 hover:bg-[var(--border)]/30 hover:text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              title="Primera página"
            >
              <ChevronsLeft className="h-3.5 w-3.5" />
            </button>

            {/* Página anterior */}
            <button
              type="button"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => handlePageChange(currentPage - 1)}
              className="flex h-7.5 w-7.5 items-center justify-center border-r border-[var(--border)] text-[var(--card-foreground)]/70 hover:bg-[var(--border)]/30 hover:text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              title="Página anterior"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            {/* Números de página */}
            {pageNumbers.map((page, idx) => {
              if (page === "...") {
                return (
                  <span
                    key={`dots-${idx}`}
                    className="flex h-7.5 min-w-7 px-1 items-center justify-center border-r border-[var(--border)] bg-[var(--background)] text-[var(--card-foreground)]/40 text-xs select-none"
                  >
                    ...
                  </span>
                );
              }
              const isCurrent = currentPage === page;
              return (
                <button
                  type="button"
                  key={page}
                  disabled={isLoading}
                  onClick={() => handlePageChange(Number(page))}
                  className={`flex h-7.5 min-w-7.5 px-2 items-center justify-center border-r border-[var(--border)] transition text-xs font-semibold cursor-pointer ${
                    isCurrent
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-bold shadow-xs"
                      : "hover:bg-[var(--border)]/30 text-[var(--card-foreground)]"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {/* Página siguiente */}
            <button
              type="button"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => handlePageChange(currentPage + 1)}
              className="flex h-7.5 w-7.5 items-center justify-center border-r border-[var(--border)] text-[var(--card-foreground)]/70 hover:bg-[var(--border)]/30 hover:text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              title="Página siguiente"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>

            {/* Última página */}
            <button
              type="button"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => handlePageChange(totalPages)}
              className="flex h-7.5 w-7.5 items-center justify-center text-[var(--card-foreground)]/70 hover:bg-[var(--border)]/30 hover:text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              title="Última página"
            >
              <ChevronsRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Table;
