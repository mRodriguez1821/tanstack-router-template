export type TenantMemberRole = "Member" | "Auditor" | "Admin" | "Owner";
export type TenantMemberStatus = "Active" | "Removed";

export type TenantMember = {
  id: string;
  tenantId: string;
  userId: string;
  role: TenantMemberRole | string;
  status: TenantMemberStatus | string;
  joinedAtUtc: string;
  removedAtUtc: string | null;
};

export type TenantMemberInviteRequest = {
  email: string;
  displayName?: string | null;
  role: TenantMemberRole | string;
  createUserIfNotExists: boolean;
  password?: string | null;
};

export type TenantMemberRoleRequest = {
  role: TenantMemberRole | string;
  status?: TenantMemberStatus | string | null;
};

export type TenantMemberRolesRequest = {
  roleIds: string[];
};

export type TenantRoleRequest = {
  name: string;
  permissions: string[];
};

export type TenantRoleUpdateRequest = {
  name?: string | null;
  permissions?: string[] | null;
};

export type TenantRoleResponse = {
  id: string;
  tenantId: string;
  name: string;
  isSystem: boolean;
  permissions: string[];
};
