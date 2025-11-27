"use client";
import { useMutation, useQueryClient } from "react-query";

import { login } from "../api";
import type { LoginPayload, LoginResponse } from "../types";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: login,
    onSuccess: async () => {
      // 로그인 성공 시 /api/auth/me 다시 가져오기
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}
