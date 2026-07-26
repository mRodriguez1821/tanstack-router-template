export type APIResponse<T> = {
  code: number;
  error: boolean;
  message: string;
  result: T;
};
