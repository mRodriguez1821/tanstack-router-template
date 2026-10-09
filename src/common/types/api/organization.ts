export type Tenant = {
  id: string;
  name: string | null;
  legalname: string | null;
  legalnumber: string | null;
  isactive: boolean;
  createdatutc: string;
  updatedatutc: string | null;
  autoaddmembership: boolean;
  defaulttemporarypassword: string | null;
  ownerEmail?: string | null;
  ownerDisplayName?: string | null;
  ownerPassword?: string | null;
};

export type TenantCreateRequest = Partial<Tenant> & {
  name: string;
  ownerEmail?: string | null;
  ownerDisplayName?: string | null;
  ownerPassword?: string | null;
};

export type TenantUpdateRequest = {
  name: string | null;
};

