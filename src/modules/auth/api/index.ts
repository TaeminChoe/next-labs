import { LoginPayload, LoginResponse, AuthUser } from "../types";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "로그인에 실패했습니다.");
  }

  return res.json();
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
  });
}

export async function getUser(): Promise<AuthUser | null> {
  const res = await fetch("/api/auth/me", {
    method: "GET",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.user ?? null;
}

let refreshingPromise: Promise<boolean> | null = null;

/**
 * accessToken 갱신 함수
 * - 동시에 여러 401이 터져도 refresh는 1번만 실행되도록 큐잉
 * - 성공 시 true, 실패 시 false
 */
export async function refreshAccessToken(): Promise<boolean> {
  if (!refreshingPromise) {
    refreshingPromise = (async () => {
      try {
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        // 미들웨어와 동일하게, ok 면 Set-Cookie 로 accessToken 재발급됐다고 가정
        if (!res.ok) return false;

        return true;
      } catch (e) {
        console.error("refreshAccessToken error", e);
        return false;
      } finally {
        refreshingPromise = null;
      }
    })();
  }

  return refreshingPromise;
}
