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
