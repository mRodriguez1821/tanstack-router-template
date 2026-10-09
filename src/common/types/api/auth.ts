export type AuthContextType = "Operational" | "Administrative";

export type UserCredentialDto = {
  username: string;
  password: string;
  lang?: string | null;
};

export type AuthContextDto = {
  displayName: string;
  contextType: AuthContextType | string;
  tenantId: string | null;
};
