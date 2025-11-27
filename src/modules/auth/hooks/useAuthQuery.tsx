"use client";
import { useRouter } from "next/navigation";
import { useQuery, type UseQueryOptions, type QueryKey } from "react-query";

import { useLogout } from "./useLogout";
import { getHttpStatus } from "../utils/getHttpStatus";
import { refreshAccessToken } from "../api";

type AppQueryOptions<TData> = Omit<
  UseQueryOptions<TData, unknown, TData, QueryKey>,
  "queryFn"
> & {
  queryFn: () => Promise<TData>;
};

/**
 * 공통 Query 훅
 * - showLoading / hideLoading
 * - 401 → refresh 후 한 번 재시도
 */
export function useAuthQuery<TData>(options: AppQueryOptions<TData>) {
  const router = useRouter();
  const forceLogout = useLogout({ force: true });

  const { queryFn, onError, onSuccess, onSettled, ...restOptions } = options;

  const wrappedQueryFn = async () => {
    try {
      // 1차 시도
      return await queryFn();
    } catch (error) {
      const status = getHttpStatus(error);

      // 401 → refresh 후 한 번 재시도
      if (status === 401) {
        const refreshed = await refreshAccessToken();

        if (refreshed) {
          try {
            return await queryFn();
          } catch (retryError) {
            throw retryError;
          }
        }

        // refresh 실패 → 강제 로그아웃
        forceLogout.mutate();
        throw new Error("Unauthorized: refresh token failed");
      }

      throw error;
    }
  };

  return useQuery<TData, unknown, TData, QueryKey>({
    ...restOptions,
    queryFn: wrappedQueryFn,
    onError,
    onSuccess,
    onSettled,
  });
}
