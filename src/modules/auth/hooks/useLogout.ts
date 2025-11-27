"use client";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "react-query";

import { logout } from "../api";

interface UseLogoutOptions {
  redirectTo?: string; // 기본 "/login"
  force?: boolean; // 강제 로그아웃 여부
}

export function useLogout(options?: UseLogoutOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const redirectTo = options?.redirectTo ?? "/login";
  const force = options?.force ?? false;

  return useMutation({
    mutationFn: async () => {
      if (!force) {
        return logout(); // 정상 로그아웃
      }
      return null; // 강제 로그아웃일 땐 아무 것도 안 함
    },

    onSuccess: async () => {
      // react-query 캐시 클리어
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      router.replace(redirectTo);
    },
  });
}
