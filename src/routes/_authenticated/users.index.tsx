import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useToast } from "@/common/hooks/useToast";
import { fetchUsers, createUser, type UserItem } from "@/common/api/users";
import { TablePage } from "@/common/components/layout/TablePage";
import { Button } from "@/common/components/Button";
import { Input } from "@/common/components/Input";
import { useModal } from "@/common/hooks/useModal";
import type { TableColumn } from "@/common/lib/types";

export const Route = createFileRoute("/_authenticated/users/")({
  component: UsersSamplePage,
});

function UsersSamplePage() {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Member");

  const resetForm = () => {
    setNewName("");
    setNewEmail("");
    setNewRole("Member");
  };

  // Modal para creación de usuario con deep linking de URL y limpieza automática
  const {
    showModal: openCreateUserModal,
    hideModal: closeCreateUserModal,
    Modal: CreateUserModal,
  } = useModal({
    urlParam: "create-user",
    resetOnClose: resetForm,
  });

  // 1. TanStack Query + apiFetch: Consulta de datos
  const {
    data: users = [],
    isLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // 2. TanStack Query + apiFetch: Mutación de datos
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (createdUser) => {
      queryClient.setQueryData<UserItem[]>(["users"], (old = []) => [
        ...old,
        createdUser,
      ]);
      toast.success(`Usuario "${createdUser.name}" creado con éxito.`);
      setNewName("");
      setNewEmail("");
      setNewRole("Member");
      closeCreateUserModal();
    },
    onError: () => {
      toast.error("No se pudo crear el usuario.");
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      toast.warning("Por favor completa nombre y correo.");
      return;
    }
    createMutation.mutate({
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
    });
  };

  const columns: TableColumn<UserItem>[] = [
    {
      key: "name",
      label: t("fields.name", "Nombre"),
      sortable: true,
      filterable: true,
      filterPlaceholder: "Filtrar por nombre...",
    },
    {
      key: "email",
      label: t("fields.email", "Correo Electrónico"),
      sortable: true,
      filterable: true,
      filterPlaceholder: "Filtrar por correo...",
    },
    {
      key: "role",
      label: "Rol",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { label: "Admin", value: "Admin" },
        { label: "Member", value: "Member" },
        { label: "Supervisor", value: "Supervisor" },
      ],
      render: (row) => (
        <span className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:text-zinc-200">
          {row.role}
        </span>
      ),
    },
    {
      key: "actions",
      label: t("actions.viewDetails", "Acciones"),
      render: (row) => (
        <Link
          to="/users/$userId"
          params={{ userId: row.id }}
          className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline"
        >
          {t("actions.viewDetails", "Ver detalles")} &rarr;
        </Link>
      ),
    },
  ];

  return (
    <div className="h-full w-full flex flex-col flex-1">
      <TablePage<UserItem>
        title={`${t("fields.employee", "Usuarios")}`}
        columns={columns}
        data={users}
        isLoading={isLoading}
        rowId="id"
        pageSize={5}
        actionElement={
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => openCreateUserModal()}
          >
            Crear usuario
          </Button>
        }
      />

      {/* Modal para Crear Usuario */}
      <CreateUserModal
        title="Crear Nuevo Usuario"
        description="Ingresa los datos para registrar un nuevo usuario en el sistema."
        size="sm"
        body={
          <form
            id="create-user-modal-form"
            onSubmit={handleCreate}
            className="p-4 space-y-3.5"
          >
            <Input
              label={t("fields.name", "Nombre Completo")}
              placeholder="Ej. Juan Pérez"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Input
              label={t("fields.email", "Correo Electrónico")}
              type="email"
              placeholder="usuario@empresa.com"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <div>
              <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                Rol en el Sistema
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-hidden cursor-pointer"
              >
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
                <option value="Supervisor">Supervisor</option>
              </select>
            </div>
          </form>
        }
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={closeCreateUserModal}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="create-user-modal-form"
              size="sm"
              variant="primary"
              icon={Plus}
              isLoading={createMutation.isPending}
            >
              Crear usuario
            </Button>
          </div>
        }
      />
    </div>
  );
}
