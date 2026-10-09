export type SystemRole = "User" | "Admin" | "Application";

export type User = {
  id: string;
  displayname: string;
  email: string | null;
  username: string;
  role: SystemRole;
  isactive: boolean;
  createdatutc: string;
  updatedatutc: string | null;
};

export type UserCreateRequest = {
  displayname: string;
  email: string;
  username?: string;
  password: string;
  role: SystemRole;
  isactive: boolean;
};

export type UserUpdateRequest = {
  displayname?: string;
  email?: string;
  role?: SystemRole;
  isactive?: boolean;
  password?: string;
};
