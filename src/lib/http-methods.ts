import axios, { type AxiosRequestConfig } from "axios";
import type { APIResponse } from "./types";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const get = async <T>(
  endpoint: string,
  config?: AxiosRequestConfig<T>,
) => {
  const { data } = await axios.get<APIResponse<T>>(
    `${VITE_API_URL}${endpoint}`,
    config,
  );
  return data;
};

export const post = async <T, R>(
  endpoint: string,
  data: T,
  config?: AxiosRequestConfig<T>,
) =>
  await axios.post<T, APIResponse<R>>(
    `${VITE_API_URL}${endpoint}`,
    data,
    config,
  );

export const put = async <T, R>(
  endpoint: string,
  data: T,
  config?: AxiosRequestConfig<T>,
) =>
  await axios.put<T, APIResponse<R>>(
    `${VITE_API_URL}${endpoint}`,
    data,
    config,
  );

export const patch = async <T, R>(
  endpoint: string,
  data: T,
  config?: AxiosRequestConfig<T>,
) =>
  await axios.patch<T, APIResponse<R>>(
    `${VITE_API_URL}${endpoint}`,
    data,
    config,
  );
