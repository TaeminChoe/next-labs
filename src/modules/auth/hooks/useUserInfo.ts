"use client";
import { QueryKey, UseQueryOptions } from "react-query";

import { getUser } from "../api";
import { useAuthQuery } from "./useAuthQuery";
import type { AuthUser } from "../types";

export function useUserInfo(
  options?: Omit<
    UseQueryOptions<AuthUser | null, unknown, AuthUser | null, QueryKey>,
    "queryKey" | "queryFn"
  >
) {
  return useAuthQuery<AuthUser | null>({
    queryKey: ["auth", "me"],
    queryFn: getUser,
    staleTime: 1000 * 60, // 1분
    ...options,
  });
}
