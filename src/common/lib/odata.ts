import type {
  ColumnSort,
  DateRangeFilter,
  TableColumn,
  TableFilters,
} from "./types";

export const escapeODataString = (value: string): string => {
  return value.replace(/'/g, "''");
};

export const toODataPropertyPath = (path: string): string => {
  if (path.includes("/")) return path;
  if (!path.includes(".")) return path;
  return path
    .split(".")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("/");
};

export const buildODataFilter = (
  filters: TableFilters | undefined,
  columns: TableColumn<any>[],
): string => {
  if (!filters) return "";

  const clauses: string[] = [];

  columns.forEach((col) => {
    if (!col.filterable) return;

    const val = filters[col.key];
    if (val === undefined || val === null || val === "") return;

    const rawField = col.filterField || col.sortField || col.key;
    const isDateOnly = Boolean(col.isDateOnly); // || col.filterType === "date-only");
    const filterType = col.filterType || "string";

    switch (filterType) {
      // case "text":
      case "string": {
        const strVal = String(val).trim();
        if (!strVal) return;
        const escaped = escapeODataString(strVal.toLowerCase());

        if (rawField.includes(",")) {
          const subFields = rawField.split(",").map((f) => toODataPropertyPath(f.trim())).filter(Boolean);
          const subClauses = subFields.map(
            (sf) => `contains(tolower(${sf}), '${escaped}')`,
          );
          if (subClauses.length > 0) {
            clauses.push(`(${subClauses.join(" or ")})`);
          }
        } else {
          const field = toODataPropertyPath(rawField);
          clauses.push(`contains(tolower(${field}), '${escaped}')`);
        }
        break;
      }

      case "select": {
        const field = toODataPropertyPath(rawField);
        if (typeof val === "boolean" || val === "true" || val === "false") {
          const bVal = val === true || val === "true";
          clauses.push(`${field} eq ${bVal}`);
        } else if (typeof val === "number") {
          clauses.push(`${field} eq ${val}`);
        } else {
          const strVal = String(val).trim();
          if (!strVal) return;
          clauses.push(`${field} eq '${escapeODataString(strVal)}'`);
        }
        break;
      }

      case "boolean": {
        const field = toODataPropertyPath(rawField);
        if (val === true || val === "true") {
          clauses.push(`${field} eq true`);
        } else if (val === false || val === "false") {
          clauses.push(`${field} eq false`);
        }
        break;
      }

      case "number": {
        const field = toODataPropertyPath(rawField);
        const num = Number(val);
        if (!isNaN(num)) {
          clauses.push(`${field} eq ${num}`);
        }
        break;
      }

      case "date": {
        const field = toODataPropertyPath(rawField);
        const dateStr = String(val).trim();
        if (!dateStr) return;
        if (isDateOnly) {
          clauses.push(`${field} eq ${dateStr}`);
        } else {
          clauses.push(
            `${field} ge ${dateStr}T00:00:00Z and ${field} le ${dateStr}T23:59:59Z`,
          );
        }
        break;
      }

      case "date-range": {
        const field = toODataPropertyPath(rawField);
        const range = val as DateRangeFilter;
        const from = range?.from?.trim();
        const to = range?.to?.trim();

        if (isDateOnly) {
          if (from && to) {
            clauses.push(`${field} ge ${from} and ${field} le ${to}`);
          } else if (from) {
            clauses.push(`${field} ge ${from}`);
          } else if (to) {
            clauses.push(`${field} le ${to}`);
          }
        } else {
          if (from && to) {
            clauses.push(
              `${field} ge ${from}T00:00:00Z and ${field} le ${to}T23:59:59Z`,
            );
          } else if (from) {
            clauses.push(`${field} ge ${from}T00:00:00Z`);
          } else if (to) {
            clauses.push(`${field} le ${to}T23:59:59Z`);
          }
        }
        break;
      }
    }
  });

  return clauses.join(" and ");
};

export const buildODataOrderBy = (
  sort: ColumnSort | null | undefined,
  columns: TableColumn<any>[],
): string => {
  if (!sort || !sort.field || !sort.direction) return "";

  const col = columns.find(
    (c) => c.key === sort.field || c.sortField === sort.field,
  );
  const targetField = toODataPropertyPath(col?.sortField || sort.field);

  return `${targetField} ${sort.direction}`;
};
