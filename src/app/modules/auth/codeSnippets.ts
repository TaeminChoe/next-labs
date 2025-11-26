export const demoPageCode = `
"use client";

import { useLogin, useLogout, useUserInfo } from "@/modules/auth";
import { DemoLayout } from "@/ui";

export default function AuthDemoPage() {
  const login = useLogin();
  const logout = useLogout();
  const { data: user, refetch } = useUserInfo();

  const handleLogin = () => {
    login.mutate({
      email: "text@example.com",
      password: "password123",
    });
  };

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        alert("로그아웃되었습니다.");
      },
    });
  };

  const handleShowUserInfo = async () => {
    try {
      // 1차: 현재 토큰 기준으로 유저 정보 조회
      const result = await refetch();
      let info = result.data;

      if (info) {
        alert(\`현재 로그인 정보:\n\${JSON.stringify(info, null, 2)}\`);
        return;
      }

      // 정보가 없으면 refresh 시도
      const refreshRes = await fetch("/api/auth/refresh", {
        method: "POST",
      });

      if (refreshRes.ok) {
        const afterRefresh = await refetch();
        info = afterRefresh.data;

        if (info) {
          alert(\`토큰 갱신 후 로그인 정보:\n\${JSON.stringify(info, null, 2)}\`);
          return;
        }
      }

      // refresh도 실패하거나, 여전히 유저 정보가 없으면 로그아웃 처리
      logout.mutate(undefined, {
        onSuccess: () => {
          alert("세션이 만료되어 로그아웃되었습니다.");
        },
      });
    } catch (error) {
      console.error(error);
      logout.mutate(undefined, {
        onSuccess: () => {
          alert("에러가 발생하여 로그아웃되었습니다.");
        },
      });
    }
  };

  return (
    <DemoLayout title="Auth" demoCode={demoPageCode}>
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
        <h1 className="text-2xl font-bold">Auth Module Demo</h1>

        <div className="flex flex-col gap-4 w-full max-w-md">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleLogin}
              disabled={login.isLoading}
              className="flex-1 rounded-md border px-4 py-2 font-medium hover:bg-gray-100 disabled:opacity-50"
            >
              {login.isLoading ? "로그인 중..." : "로그인 (데모 계정)"}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              disabled={logout.isLoading}
              className="flex-1 rounded-md border px-4 py-2 font-medium hover:bg-gray-100 disabled:opacity-50"
            >
              로그아웃
            </button>
          </div>

          <button
            type="button"
            onClick={handleShowUserInfo}
            className="w-full rounded-md border px-4 py-2 font-medium hover:bg-gray-100"
          >
            로그인 정보 보기
          </button>

          <div className="mt-4 rounded-md border px-4 py-3 text-sm text-gray-700 bg-gray-50">
            <p className="font-semibold mb-1">현재 상태</p>
            {user ? (
              <pre className="text-xs whitespace-pre-wrap break-words">
                {JSON.stringify(user, null, 2)}
              </pre>
            ) : (
              <p>로그인된 사용자가 없습니다.</p>
            )}
          </div>

          <div className="mt-2 text-xs text-gray-500">
            <p>- 로그인: text@example.com / password123 로 하드코딩 요청</p>
            <p>
              - 로그인 정보 보기: 정보 없으면 /api/auth/refresh 호출 → 그래도
              없으면 로그아웃
            </p>
          </div>
        </div>
      </main>
    </DemoLayout>
  );
}
`.trim();
