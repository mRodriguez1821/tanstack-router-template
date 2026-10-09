import { describe, expect, it } from "vitest";
import { buildODataFilter, buildODataOrderBy } from "./odata";
import type { TableColumn } from "./types";

describe("odata utilities", () => {
  const columns: TableColumn<any>[] = [
    {
      key: "name",
      label: "Name",
      width: 100,
      filterable: true,
      filterType: "string",
      sortable: true,
    },
    {
      key: "employee",
      label: "Employee",
      width: 100,
      filterable: true,
      filterType: "string",
      filterField: "Employee/Firstname,Employee/Lastname",
      sortable: true,
      sortField: "Employee/Firstname",
    },
    {
      key: "status",
      label: "Status",
      width: 100,
      filterable: true,
      filterType: "select",
      sortable: true,
    },
    {
      key: "isactive",
      label: "Active",
      width: 100,
      filterable: true,
      filterType: "boolean",
    },
    {
      key: "timestamp",
      label: "Date",
      width: 100,
      filterable: true,
      filterType: "date-range",
      filterField: "Timestamputc",
      sortable: true,
      sortField: "Timestamputc",
    },
    {
      key: "singleDate",
      label: "Single Date",
      width: 100,
      filterable: true,
      filterType: "date",
      filterField: "Createdatutc",
    },
  ];

  it("builds string filter with lowercase and contains", () => {
    const filter = buildODataFilter({ name: "Marino" }, columns);
    expect(filter).toBe("contains(tolower(name), 'marino')");
  });

  it("builds multi-field string filter with OR", () => {
    const filter = buildODataFilter({ employee: "Rodriguez" }, columns);
    expect(filter).toBe(
      "(contains(tolower(Employee/Firstname), 'rodriguez') or contains(tolower(Employee/Lastname), 'rodriguez'))",
    );
  });

  it("escapes single quotes in string filter", () => {
    const filter = buildODataFilter({ name: "O'Connor" }, columns);
    expect(filter).toBe("contains(tolower(name), 'o''connor')");
  });

  it("builds select and boolean filters", () => {
    const filter = buildODataFilter(
      { status: "In", isactive: true },
      columns,
    );
    expect(filter).toBe("status eq 'In' and isactive eq true");
  });

  it("builds date-range filter", () => {
    const filter = buildODataFilter(
      { timestamp: { from: "2026-09-01", to: "2026-09-07" } },
      columns,
    );
    expect(filter).toBe(
      "Timestamputc ge 2026-09-01T00:00:00Z and Timestamputc le 2026-09-07T23:59:59Z",
    );
  });

  it("builds single date filter", () => {
    const filter = buildODataFilter({ singleDate: "2026-09-05" }, columns);
    expect(filter).toBe(
      "Createdatutc ge 2026-09-05T00:00:00Z and Createdatutc le 2026-09-05T23:59:59Z",
    );
  });

  it("builds orderby correctly", () => {
    expect(buildODataOrderBy({ field: "name", direction: "asc" }, columns)).toBe(
      "name asc",
    );
    expect(
      buildODataOrderBy({ field: "employee", direction: "desc" }, columns),
    ).toBe("Employee/Firstname desc");
    expect(buildODataOrderBy(null, columns)).toBe("");
  });
});
