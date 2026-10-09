import type { Meta, StoryObj } from "@storybook/react-vite";
import { TablePage } from "./TablePage";
import type { TableColumn } from "@/common/lib/types";
import { Plus } from "lucide-react";

interface EmployeeItem {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: "Activo" | "Inactivo";
}

const columns: TableColumn<EmployeeItem>[] = [
  {
    key: "name",
    label: "Nombre Completo",
    sortable: true,
    filterable: true,
    filterPlaceholder: "Buscar por nombre...",
  },
  {
    key: "email",
    label: "Correo Electrónico",
    sortable: true,
    filterable: true,
    filterPlaceholder: "Buscar por email...",
  },
  {
    key: "department",
    label: "Departamento",
    sortable: true,
    filterable: true,
    filterType: "select",
    filterOptions: [
      { label: "Tecnología", value: "Tecnología" },
      { label: "Operaciones", value: "Operaciones" },
      { label: "Finanzas", value: "Finanzas" },
    ],
  },
  {
    key: "role",
    label: "Cargo",
    sortable: true,
  },
  {
    key: "status",
    label: "Estado",
    sortable: true,
    render: (row) => (
      <span className="rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-mono text-zinc-800 dark:text-zinc-200">
        {row.status}
      </span>
    ),
  },
];

const mockEmployees: EmployeeItem[] = [
  {
    id: "1",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@empresa.com",
    department: "Tecnología",
    role: "Lead Architect",
    status: "Activo",
  },
  {
    id: "2",
    name: "María Fernández",
    email: "maria.f@empresa.com",
    department: "Tecnología",
    role: "Frontend Engineer",
    status: "Activo",
  },
  {
    id: "3",
    name: "Jorge Ramos",
    email: "jorge.ramos@empresa.com",
    department: "Operaciones",
    role: "Supervisor",
    status: "Inactivo",
  },
  {
    id: "4",
    name: "Lucía Morales",
    email: "lucia.morales@empresa.com",
    department: "Finanzas",
    role: "Auditora",
    status: "Activo",
  },
];

const meta = {
  title: "Layout/TablePage",
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="p-6 h-screen flex flex-col bg-zinc-100 dark:bg-zinc-950">
      <TablePage<EmployeeItem>
        title="Directorio de Colaboradores"
        description="Gestión integral de colaboradores con filtros, ordenamiento dinámico y paginación en escala de grises."
        actionLabel="Nuevo Colaborador"
        actionIcon={Plus}
        onAction={() => alert("Crear colaborador")}
        columns={columns}
        data={mockEmployees}
        totalCount={mockEmployees.length}
        pageSize={5}
        rowId="id"
      />
    </div>
  ),
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
