import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
  type QueryFunction,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { APIResponse } from "./types";

export const useGetAll = <T>(
  {
    keys,
    callback,
  }: { keys: QueryKey; callback: QueryFunction<APIResponse<T[]>> },
  options?: Omit<UseQueryOptions<APIResponse<T[]>>, "queryKey" | "queryFn">,
) => useQuery({ queryKey: keys, queryFn: callback, ...options });

export const useGetOne = <T>(
  {
    keys,
    id,
    callback,
  }: {
    keys: QueryKey;
    id?: string | number;
    callback: (id: string | number) => Promise<APIResponse<T>>;
  },
  options?: Omit<UseQueryOptions<APIResponse<T>>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: [...keys, id],
    queryFn: () => callback(id!),
    enabled: !!id && (options?.enabled ?? true),
    ...options,
  });
};

export const useCreate = <TVariables, TData>(
  {
    keys,
    callback,
  }: {
    keys: QueryKey;
    callback: (data: TVariables) => Promise<APIResponse<TData>>;
  },
  options?: Omit<
    UseMutationOptions<APIResponse<TData>, Error, TVariables>,
    "mutationKey" | "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: keys,
    mutationFn: callback,
    // Automatically invalidate the cache key so 'useGetAll' re-fetches updated data
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: keys });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
};

// 2. SEPARATE 'id' AND 'data' IN 'useUpdate' TO MATCH REST PATTERNS
export const useUpdate = <TVariables, TData>(
  {
    keys,
    callback,
  }: {
    keys: QueryKey;
    callback: (params: {
      id: string | number;
      data: TVariables;
    }) => Promise<APIResponse<TData>>;
  },
  options?: Omit<
    UseMutationOptions<
      APIResponse<TData>,
      Error,
      { id: string | number; data: TVariables }
    >,
    "mutationKey" | "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: keys,
    mutationFn: callback,
    onSuccess: (data, variables, context) => {
      // Invalidate both the main list AND the specific item cache
      queryClient.invalidateQueries({ queryKey: keys });
      queryClient.invalidateQueries({ queryKey: [...keys, variables.id] });
      (options?.onSuccess as any)?.(data, variables, context);
    },
    ...options,
  });
};
