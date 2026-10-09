export type ApiResult<T> = {
  isSuccess: boolean;
  code: number;
  message?: string;
  errorCode?: string;
  data?: T;
  pagination?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalCount?: number;
    totalPages?: number;
  };
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user?: CurrentUserDto;
};

export type CurrentUserDto = {
  id: string;
  displayName: string;
  email: string | null;
  username: string;
  role?: string;
};
