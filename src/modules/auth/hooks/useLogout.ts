import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "react-query";

import { logout } from "../api";

interface UseLogoutOptions {
  redirectTo?: string; // 기본 "/login"
}

export function useLogout(options?: UseLogoutOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      // 세션 정보 초기화
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      const redirectTo = options?.redirectTo ?? "/login";
      router.push(redirectTo);
    },
  });
}
