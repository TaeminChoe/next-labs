import { QueryKey, UseQueryOptions, useQuery } from "react-query";

import { getUser } from "../api";
import type { AuthUser } from "../types";

export function useUserInfo(
  options?: Omit<
    UseQueryOptions<AuthUser | null, unknown, AuthUser | null, QueryKey>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery<AuthUser | null>({
    queryKey: ["auth", "me"],
    queryFn: getUser,
    staleTime: 1000 * 60, // 1분
    ...options,
  });
}
