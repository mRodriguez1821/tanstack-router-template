import { apiFetch } from "@/common/lib/api";

export type UserItem = {
  id: string;
  name: string;
  email: string;
  role: string;
};

/**
 * Función de obtención de usuarios usando apiFetch.
 * Retorna datos simulados si la API no está respondiendo para facilitar pruebas en el template.
 */
export const fetchUsers = async (): Promise<UserItem[]> => {
  try {
    const res = await apiFetch<UserItem[]>("/api/users", { silentErrors: true });
    if (res.isSuccess && res.data && res.data.length > 0) {
      return res.data;
    }
  } catch {
    // Continúa al fallback mock
  }

  // Fallback simulado para desarrollo del template
  return [
    { id: "1", name: "Ada Lovelace", email: "ada@example.com", role: "Admin" },
    { id: "2", name: "Alan Turing", email: "alan@example.com", role: "Developer" },
    { id: "3", name: "Grace Hopper", email: "grace@example.com", role: "Architect" },
  ];
};

/**
 * Función de creación de usuario usando apiFetch.
 */
export const createUser = async (
  user: Omit<UserItem, "id">,
): Promise<UserItem> => {
  try {
    const res = await apiFetch<UserItem>("/api/users", {
      method: "POST",
      body: JSON.stringify(user),
      silentErrors: true,
    });
    if (res.isSuccess && res.data) {
      return res.data;
    }
  } catch {
    // Continúa al fallback mock
  }

  // Fallback simulado para desarrollo del template
  return {
    id: String(Date.now()),
    ...user,
  };
};

/**
 * Función de obtención de un usuario individual por su ID.
 */
export const fetchUserById = async (id: string): Promise<UserItem | null> => {
  try {
    const res = await apiFetch<UserItem>(`/api/users/${id}`, { silentErrors: true });
    if (res.isSuccess && res.data) {
      return res.data;
    }
  } catch {
    // Continúa al fallback
  }

  const all = await fetchUsers();
  return (
    all.find((u) => u.id === id) || {
      id,
      name: `Usuario #${id}`,
      email: `usuario_${id}@example.com`,
      role: "Member",
    }
  );
};

