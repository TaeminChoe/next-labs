"use client";
import { useRouter } from "next/navigation";
import { useMutation, type UseMutationOptions } from "react-query";

import { useLogout } from "./useLogout";
import { getHttpStatus } from "../utils/getHttpStatus";
import { refreshAccessToken } from "../api";

type AppMutationOptions<TData, TVariables> = UseMutationOptions<
  TData,
  unknown,
  TVariables
> & {
  mutationFn: (variables: TVariables) => Promise<TData>;
};

/**
 * 공통 Mutation 훅
 * - showLoading / hideLoading
 * - 401 → refresh 후 한 번 재시도
 */
export function useAuthMutation<TData, TVariables = void>(
  options: AppMutationOptions<TData, TVariables>
) {
  const router = useRouter();
  const forceLogout = useLogout({ force: true });

  const { mutationFn, onError, onSuccess, onSettled, ...restOptions } = options;

  const wrappedMutationFn = async (variables: TVariables) => {
    try {
      // 1차 시도
      return await mutationFn(variables);
    } catch (error) {
      const status = getHttpStatus(error);

      // 401 → refresh 후 재시도
      if (status === 401) {
        const refreshed = await refreshAccessToken();

        if (refreshed) {
          try {
            return await mutationFn(variables);
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

  return useMutation<TData, unknown, TVariables>({
    ...restOptions,
    mutationFn: wrappedMutationFn,
    onError,
    onSuccess,
    onSettled,
  });
}
