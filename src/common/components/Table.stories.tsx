import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, useEffect } from "react";
import { Table } from "./Table";
import type { TableColumn, TableProps, ColumnSort, TableFilters } from "@/common/lib/types";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "Activo" | "Inactivo" | "Pendiente";
}

const mockData: UserRow[] = [
  { id: "1", name: "Ana García", email: "ana.garcia@empresa.com", role: "Líder Técnico", department: "Tecnología", status: "Activo" },
  { id: "2", name: "Carlos Mendoza", email: "carlos.mendoza@empresa.com", role: "Desarrollador Senior", department: "Tecnología", status: "Activo" },
  { id: "3", name: "Sofía Martínez", email: "sofia.martinez@empresa.com", role: "Diseñadora UI/UX", department: "Producto", status: "Pendiente" },
  { id: "4", name: "Lucas Romero", email: "lucas.romero@empresa.com", role: "DevOps Engineer", department: "Infraestructura", status: "Inactivo" },
  { id: "5", name: "Mateo Silva", email: "mateo.silva@empresa.com", role: "Data Analyst", department: "Analítica", status: "Activo" },
  { id: "6", name: "Elena Torres", email: "elena.torres@empresa.com", role: "QA Engineer", department: "Calidad", status: "Pendiente" },
  { id: "7", name: "Diego Castro", email: "diego.castro@empresa.com", role: "Product Owner", department: "Producto", status: "Activo" },
  { id: "8", name: "Valentina Vega", email: "valentina.vega@empresa.com", role: "Seguridad Informática", department: "Ciberseguridad", status: "Inactivo" },
  { id: "9", name: "Javier Paredes", email: "javier.paredes@empresa.com", role: "Backend Developer", department: "Tecnología", status: "Activo" },
  { id: "10", name: "Camila Ortiz", email: "camila.ortiz@empresa.com", role: "Frontend Developer", department: "Tecnología", status: "Activo" },
  { id: "11", name: "Andrés Navarro", email: "andres.navarro@empresa.com", role: "Cloud Architect", department: "Infraestructura", status: "Activo" },
  { id: "12", name: "Laura Ramos", email: "laura.ramos@empresa.com", role: "Scrum Master", department: "Agilidad", status: "Pendiente" },
  { id: "13", name: "Gabriel Soto", email: "gabriel.soto@empresa.com", role: "Mobile Developer", department: "Móviles", status: "Activo" },
  { id: "14", name: "Mariana Rojas", email: "mariana.rojas@empresa.com", role: "HR Specialist", department: "Recursos Humanos", status: "Activo" },
  { id: "15", name: "Felipe Morales", email: "felipe.morales@empresa.com", role: "Tech Writer", department: "Documentación", status: "Inactivo" },
  { id: "16", name: "Daniela Cruz", email: "daniela.cruz@empresa.com", role: "Database Admin", department: "Datos", status: "Activo" },
];

const columns: TableColumn<UserRow>[] = [
  {
    label: "Nombre Completo",
    key: "name",
    sortable: true,
    filterable: true,
    filterPlaceholder: "Buscar por nombre...",
  },
  {
    label: "Correo Electrónico",
    key: "email",
    sortable: true,
    filterable: true,
    filterPlaceholder: "Buscar correo...",
  },
  {
    label: "Departamento",
    key: "department",
    sortable: true,
    filterable: true,
    filterPlaceholder: "Buscar área...",
  },
  {
    label: "Rol",
    key: "role",
    sortable: true,
    filterable: true,
    filterPlaceholder: "Buscar cargo...",
  },
  {
    label: "Estado",
    key: "status",
    sortable: true,
    filterable: true,
    filterType: "select",
    filterOptions: [
      { label: "Activo", value: "Activo" },
      { label: "Pendiente", value: "Pendiente" },
      { label: "Inactivo", value: "Inactivo" },
    ],
    render: (row) => (
      <span
        className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
          row.status === "Activo"
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : row.status === "Pendiente"
            ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
            : "border-zinc-500/30 bg-zinc-500/10 text-zinc-500"
        }`}
      >
        {row.status}
      </span>
    ),
  },
];

const meta: Meta<TableProps<UserRow>> = {
  title: "Common/Table",
  component: Table,
  parameters: {
    docs: {
      description: {
        component:
          "Componente Table inspirado en WorkforceHub con encabezados flotantes para filtrado y ordenamiento, paginación reactiva tanto local como remota, y soporte de controles completos.",
      },
    },
  },
  argTypes: {
    pageSize: {
      control: "select",
      options: [2, 4, 6, 8, 10, 16],
      description: "Cantidad de filas/registros por página (pageSize)",
    },
    currentPage: {
      control: { type: "number", min: 1 },
      description: "Página actual (currentPage)",
    },
    totalElements: {
      control: { type: "number", min: 0 },
      description: "Total de elementos/registros del dataset (alias totalElements)",
    },
    totalCount: {
      control: { type: "number", min: 0 },
      description: "Total de registros en el conjunto de datos (totalCount)",
    },
    totalPages: {
      control: { type: "number", min: 1 },
      description: "Total de páginas explícito (opcional, calculado automáticamente si no se define)",
    },
    enableFilters: {
      control: "boolean",
      description: "Habilita el botón flotante de menú de búsqueda y ordenamiento en columnas",
    },
    serverSide: {
      control: "boolean",
      description: "Modo de paginación del servidor (omite el corte de datos en el cliente)",
    },
    height: {
      control: "text",
      description: "Altura fija del contenedor de la tabla (ej: '520px', '400px', '100%'). La tabla mantiene su tamaño y el overflow/scroll ocurre únicamente en el área de registros.",
    },
    maxHeight: {
      control: "text",
      description: "Altura máxima permitida para la tabla",
    },
    isLoading: {
      control: "boolean",
      description: "Muestra el overlay de carga animado",
    },
    emptyText: {
      control: "text",
      description: "Texto a mostrar cuando no hay datos",
    },
  },
  args: {
    height: "500px",
    pageSize: 4,
    currentPage: 1,
    totalElements: mockData.length,
    totalCount: mockData.length,
    enableFilters: true,
    serverSide: false,
    isLoading: false,
    emptyText: "No se encontraron registros coincidentes.",
  },
};

export default meta;
type Story = StoryObj<TableProps<UserRow>>;

export const InteractiveControls: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.currentPage ?? 1);
    const [size, setSize] = useState(args.pageSize ?? 4);
    const [sort, setSort] = useState<ColumnSort | null>(null);
    const [filters, setFilters] = useState<TableFilters>({});

    // Sincronizar reactivamente si el usuario altera los controles de Storybook
    useEffect(() => {
      if (args.currentPage !== undefined) setPage(args.currentPage);
    }, [args.currentPage]);

    useEffect(() => {
      if (args.pageSize !== undefined) setSize(args.pageSize);
    }, [args.pageSize]);

    const activeTotal = args.totalElements ?? args.totalCount ?? mockData.length;
    const computedTotalPages = args.totalPages ?? Math.max(1, Math.ceil(activeTotal / size));

    return (
      <div className="p-6 max-w-5xl space-y-4">
        {/* Panel de estado interactivo vinculado a Storybook Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-[var(--background)] p-3 rounded-[var(--radius)] border border-[var(--border)]">
          <div className="flex flex-col">
            <span className="text-[var(--card-foreground)]/60 text-[11px]">Total Registros:</span>
            <strong className="font-mono text-sm text-[var(--foreground)]">{activeTotal}</strong>
          </div>
          <div className="flex flex-col">
            <span className="text-[var(--card-foreground)]/60 text-[11px]">Filas por página (PageSize):</span>
            <strong className="font-mono text-sm text-[var(--primary)]">{size}</strong>
          </div>
          <div className="flex flex-col">
            <span className="text-[var(--card-foreground)]/60 text-[11px]">Página actual (CurrentPage):</span>
            <strong className="font-mono text-sm text-[var(--foreground)]">{page}</strong>
          </div>
          <div className="flex flex-col">
            <span className="text-[var(--card-foreground)]/60 text-[11px]">Total Páginas (TotalPages):</span>
            <strong className="font-mono text-sm text-[var(--foreground)]">{computedTotalPages}</strong>
          </div>
        </div>

        <Table<UserRow>
          {...args}
          columns={columns}
          data={args.isLoading ? [] : mockData}
          totalCount={args.totalCount}
          totalElements={args.totalElements}
          totalPages={args.totalPages}
          pageSize={size}
          pageSizeOptions={[2, 4, 6, 8, 10, 16]}
          currentPage={page}
          serverSide={args.serverSide}
          sort={sort}
          onSortChange={setSort}
          filters={filters}
          onFilterChange={(k, v) => setFilters((prev) => ({ ...prev, [k]: v }))}
          onClearFilters={() => setFilters({})}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newSize) => {
            setSize(newSize);
            setPage(1);
          }}
        />
      </div>
    );
  },
};

export const ServerSidePagination: Story = {
  args: {
    pageSize: 4,
    currentPage: 1,
    totalElements: 120,
    totalCount: 120,
    serverSide: true,
  },
  render: (args) => {
    const [page, setPage] = useState(args.currentPage ?? 1);
    const [size, setSize] = useState(args.pageSize ?? 4);

    // En server-side, simulamos que el backend ya nos devuelve solo la página solicitada
    const startIndex = (page - 1) * size;
    const pageData = mockData.slice(startIndex, startIndex + size);

    return (
      <div className="p-6 max-w-5xl space-y-4">
        <div className="bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30 rounded-[var(--radius)] p-3 text-xs">
          <strong>Modo Server-Side:</strong> El backend paginó {pageData.length} registros para la página {page} de un total de {args.totalElements} registros.
        </div>
        <Table<UserRow>
          {...args}
          columns={columns}
          data={pageData}
          totalElements={args.totalElements}
          totalCount={args.totalCount}
          pageSize={size}
          pageSizeOptions={[2, 4, 6, 8, 10]}
          currentPage={page}
          serverSide={true}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setSize(newSize);
            setPage(1);
          }}
        />
      </div>
    );
  },
};

export const FixedSizeWithScrolling: Story = {
  args: {
    height: "460px",
    pageSize: 16,
    currentPage: 1,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demuestra cómo la tabla conserva una altura fija ('460px') incluso mostrando 16 registros por página. El overflow/scroll se realiza exclusivamente en el área de filas, manteniendo el encabezado sticky arriba y la paginación fija al fondo.",
      },
    },
  },
  render: (args) => {
    return (
      <div className="p-6 max-w-5xl space-y-4">
        <div className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 rounded-[var(--radius)] p-3 text-xs">
          <strong>Tamaño Fijo con Scroll Interno:</strong> La tabla está configurada con <code>height="460px"</code> y <code>pageSize=16</code>. Observa que el contenedor no se deforma ni se expande verticalmente; el scroll ocurre únicamente dentro de las filas.
        </div>
        <Table<UserRow>
          {...args}
          height={args.height ?? "460px"}
          columns={columns}
          data={mockData}
          pageSize={16}
          pageSizeOptions={[8, 16, 24]}
        />
      </div>
    );
  },
};

export const EmptyState: Story = {
  args: {
    emptyText: "No hay registros disponibles en este momento.",
    data: [],
    totalCount: 0,
    totalElements: 0,
  },
  render: (args) => (
    <div className="p-6 max-w-5xl">
      <Table<UserRow>
        {...args}
        columns={columns}
        data={[]}
        totalCount={0}
        totalElements={0}
      />
    </div>
  ),
};
