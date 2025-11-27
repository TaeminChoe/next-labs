<a id="table-of-contents"></a>

# 🧩 Auth Module

Next.js 기반 프로젝트에서 인증 흐름(로그인/로그아웃/사용자 정보 조회)을 손쉽게 처리하기 위한 모듈입니다.  
React Query와 Next.js API Route를 활용하여 인증 상태를 안정적으로 관리할 수 있도록 설계되었습니다.

---

# 📚 목차

1. [구조](#structure)
2. [API 설명](#api)
3. [Hooks 설명](#hooks)
4. [Types](#types)
5. [Utils](#utils)
6. [Middleware 연동](#middleware)
7. [Next 내부 서버 구축](#server)
8. [사용법](#usage)
9. [Playground 페이지](#playground)
10. [참고 사항](#notes)
11. [로컬 실행 방법](#run-local)

---

<a id="structure"></a>

## 📁 구조

```bash
./src/modules/auth
|-- README.md
|-- api
|   `-- index.ts
|-- hooks
|   |-- useAuthMutation.tsx
|   |-- useAuthQuery.tsx
|   |-- useLogin.ts
|   |-- useLogout.ts
|   `-- useUserInfo.ts
|-- index.ts
|-- server
|   |-- loginRoute.ts
|   |-- logoutRoute.ts
|   |-- meRoute.ts
|   `-- refreshRoute.ts
|-- types
|   `-- index.ts
`-- utils
    |-- getHttpStatus.ts
    |-- jwt.ts
    `-- middleware.ts
```

- **api/**  
  로그인, 로그아웃, 사용자 정보 조회를 담당하는 API 함수들
- **hooks/**  
  React Query 기반의 인증 관련 훅 (로그인/로그아웃/유저 정보)
- **server/**  
  테스트용 임시 서버 구축을 위한 서버사이드 코드
- **types/**  
  JWT Payload, Auth User 등 인증 데이터 타입 정의
- **utils/**  
  jose 기반 JWT 유틸과 Next.js용 인증 미들웨어 핸들러

---

<a id="api"></a>

## 🔌 API 설명

### ✔ login(payload: LoginPayload)

Next.js API(`/api/auth/login`)에 POST 요청을 보내 인증 토큰 등을 받습니다.

- 성공 시 `LoginResponse` 반환
- 실패 시 `Error` throw (`message`가 있으면 사용, 없으면 기본 메시지)

```tsx
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
```

### ✔ logout()

서버에 POST 요청하여 토큰 제거 또는 세션 무효화.

```tsx
export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
  });
}
```

### ✔ getUser()

현재 로그인된 유저 정보를 가져오는 GET /api/auth/me 호출.

검증 실패, 토큰 없음 등 → null 반환

검증 성공 → { user: AuthUser } 형태에서 user를 꺼내서 반환

```tsx
export async function getUser(): Promise<AuthUser | null> {
  const res = await fetch("/api/auth/me", {
    method: "GET",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.user ?? null;
}
```

### ✔ refreshAccessToken()

Refresh토큰을 이용해 Access토큰을 재발급 하는 POST /api/auth/refresh 호출.

Refresh토큰 만료 -> false 반환

Access토큰 재발급 성공 -> true 반환

```tsx
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
```

---

<a id="hooks"></a>

## 🔗 Hooks 설명 (React Query 기반)

`useLogin`

- `mutate(loginPayload)` 형태로 사용
- 내부에서 `login()` API 호출
  - 성공 시:
    - 토큰 쿠키 세팅 (서버 로직에 따라)
    - 필요 시 useUserInfo 캐시 갱신 / 라우팅 등 수행

`useLogout`

- 내부에서 `logout()` API 호출
  - 성공 시:
    - 인증 관련 React Query 캐시 초기화
    - 메인 페이지 혹은 로그인 페이지로 이동 등

`useUserInfo`

- 내부적으로 `getUser()`를 사용하는 Query 훅
- 토큰이 없거나 검증 실패 시 null 반환
- 다른 컴포넌트에서 user 존재 여부로 인증/비인증 UI 분기

`useAuthQuery`

- `useQuery`를 매핑하여 Auth로직을 넣은 Query 훅
- 서버 통신 중 401에러 발생시 refresh로직으로 토큰 재발급
- refresh로직 실패했을 때 강제 로그아웃 처리
- 토큰이 필요한 API요청 시 필요한 Query 훅

`useAuthMutation`

- `useMutation`를 매핑하여 Auth로직을 넣은 Mutation 훅
- 서버 통신 중 401에러 발생시 refresh로직으로 토큰 재발급
- refresh로직 실패했을 때 강제 로그아웃 처리
- 토큰이 필요한 API요청 시 필요한 Mutation 훅

---

<a id="types"></a>

## 🧵 Types

`AuthUser`, `LoginPayload`, `LoginResponse` 등 인증에 필요한 모든 타입이 포함되어 있습니다.

예시:

```tsx
export interface AuthUser {
  email: string;
  companyName: string;
  name: string;
  phone: string;
  // role: "admin" | "user" | string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
}
```

실제 타입 정의는 src/modules/auth/types/index.ts를 참고합니다.

---

<a id="utils"></a>

## 🛠 Utils

### jwt.ts

- 역할
  - jose 라이브러리를 사용하여 JWT를 생성/검증
  - Access Token/Refresh Token의 페이로드 및 만료 시간 관리
- 주요 기능 예시
  - signAccessToken(payload)
  - signRefreshToken(payload)
  - verifyToken(token)

이 파일은 서버 환경에서만 사용해야 하며, 클라이언트 번들로 포함되지 않도록 주의합니다.

이 프로젝트에서도 서버사이드에서만 참조하고 있습니다.

### middleware.ts

- 역할
  - Next.js middleware.ts에서 호출 가능한 공용 인증 핸들러 제공
  - 요청에 포함된 Access Token을 검증하고, 인증 실패 시 Refresh 로직을 수행

제공 함수(예시)

```tsx
// auth/utils/middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login"];

const GUEST_ONLY_PATHS = ["/login"];

// 퍼블릭 경로 확인
function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    path => pathname === path || pathname.startsWith(path)
  );
}

// 로그인 상태면 접근하면 안 되는 경로
function isGuestOnlyPath(pathname: string) {
  return GUEST_ONLY_PATHS.some(
    path => pathname === path || pathname.startsWith(path)
  );
}

export async function handleAuthMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 퍼블릭 경로는 검사 없이 허용
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const cookieHeader = req.headers.get("cookie") ?? "";

  // 1) /api/auth/me 호출해서 로그인 상태 확인
  const meRes = await fetch(new URL("/api/auth/me", req.url), {
    headers: { cookie: cookieHeader },
  });

  // 1-1) 정상 로그인 상태
  if (meRes.status === 200) {
    // 이미 로그인된 상태에서 /login 같은 게스트 페이지 접근 → 리다이렉트
    if (isGuestOnlyPath(pathname)) {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard"; // 원하는 기본 페이지로 교체
      return NextResponse.redirect(url);
    }

    // 접근 허용
    return NextResponse.next();
  }

  // 1-2) 401 → 토큰 없음 / 만료 / 검증 실패 → refresh 시도
  if (meRes.status === 401) {
    console.log("Expired token.. trying refresh");
    const refreshRes = await fetch(new URL("/api/auth/refresh", req.url), {
      method: "POST",
      headers: { cookie: cookieHeader },
    });

    // refresh 성공 → 새 access_token 쿠키 세팅 후 요청 계속 진행
    if (refreshRes.ok) {
      console.log("Succeed refresh token");
      const res = NextResponse.next();
      const setCookie = refreshRes.headers.get("set-cookie");

      if (setCookie) {
        res.headers.append("set-cookie", setCookie);
      }

      return res;
    }

    console.log("Failed refesh token.. move login page");
    // refresh도 실패 → 로그인 페이지로 이동
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // 1-3) 그 외 상태 코드 → 인증 서버 에러 / API 이상
  // 안전하게 로그인 페이지로 보냄
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";
  return NextResponse.redirect(loginUrl);
}
```

### getHttpStatus.ts

- 역할
  - API통신시 반환된 서버의 API상태 코드를 반환하는 함수

제공 함수(예시)

```tsx
import axios from "axios";

export function getHttpStatus(error: unknown): number | null {
  // axios 에러
  if (axios.isAxiosError(error)) {
    return error.response?.status ?? null;
  }

  // fetch 사용 시 Response 객체 직접 던지는 경우
  if (error instanceof Response) {
    return error.status;
  }

  // 기타 커스텀 에러 구조에서 status 필드만 있는 경우
  if (typeof error === "object" && error !== null) {
    const anyError = error as { status?: number };
    if (typeof anyError.status === "number") {
      return anyError.status;
    }
  }

  return null;
}
```

---

<a id="middleware"></a>

## 🧱 Middleware 연동

1. 앱 루트 middleware.ts에서 사용 예시

프로젝트 최상단(루트)에 위치한 middleware.ts에서 handleAuthMiddleware를 호출해 인증을 처리합니다.

```tsx
// middleware.ts (프로젝트 루트)
import { NextRequest } from "next/server";
import { handleAuthMiddleware } from "./modules/auth/utils/middleware";

export function middleware(req: NextRequest) {
  return handleAuthMiddleware(req);
}

// /api/auth/* 는 미들웨어가 절대 타면 안 됨 → 무한루프 방지
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
```

2. 동작 개요 (인증 실패 시 Refresh 로직)

   handleAuthMiddleware는 대략 다음과 같은 순서로 동작하도록 설계됩니다.

   - Access Token 파싱
     - req.cookies 또는 헤더에서 Access Token 추출
   - Access Token 검증
     - verifyAccessToken으로 유효성 및 만료 여부 확인
   - 정상인 경우
     - NextResponse.next()로 그대로 요청 진행
   - 만료/검증 실패인 경우
     - Refresh Token 쿠키 존재 여부 확인
     - Refresh Token이 유효하면:
       - 새 Access Token 재발급 (signAccessToken)
       - NextResponse.next()에 쿠키를 다시 설정한 뒤 응답
     - Refresh Token도 없거나 검증 실패하면:
       - 로그인 페이지로 리다이렉트하거나
       - 인증이 필수가 아닌 페이지라면 그냥 진행 (정책에 따라 결정)

   이 로직 덕분에 클라이언트에서는 별도 Refresh 요청을 직접 호출하지 않아도,

   페이지 접근 시점에 미들웨어에서 토큰이 자동으로 갱신되는 구조를 만들 수 있습니다.

3. matcher 설정 주의사항

   ```tsx
   export const config = {
     matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
   };
   ```

   - api/auth/\* 경로를 반드시 제외해야 합니다.

     - /api/auth/login, /api/auth/refresh, /api/auth/logout 등에서 다시 토큰을 세팅/검증하는데 이 요청이 또다시 미들웨어를 타면 무한 루프 혹은 예기치 않은 인증 로직 중복이 발생할 수 있습니다.

   - \_next/static, \_next/image, favicon.ico 등 정적 리소스도 제외합니다.

---

<a id="server"></a>

## 🧱Next 내부 서버 구축 (+Optional)

아직 서버 API가 개발되지 않았거나, 프론트에서 자체적인 테스트가 필요할 때 활용.

login, logout, userInfo, refresh 기능을 하는 API를 대체할 수 있습니다.

1. route.ts 생성

- Next.js의 서버 코드를 구현하기 위해 폴더 구조를 생성한다.

```shell
./src/app/api
`-- auth
    |-- login
    |   `-- route.ts
    |-- logout
    |   `-- route.ts
    |-- me
    |   `-- route.ts
    `-- refresh
        `-- route.ts
```

2. 각각의 endpoint에 맞는 서버 구현 코드 참조

```tsx
// login/route.ts
export { loginRoute as POST } from "@/modules/auth";
```

```tsx
// logout/route.ts
export { logoutRoute as POST } from "@/modules/auth";
```

```tsx
// me/route.ts
export { meRoute as GET } from "@/modules/auth";
```

```tsx
// refresh/route.ts
export { refreshRoute as GET } from "@/modules/auth";
```

각각 아래에 해당하는 endpoint를 가진다.

- login/route.ts -> `/api/auth/login`
- logout/route.ts -> `/api/auth/logout`
- me/route.ts -> `/api/auth/me`
- refresh/route.ts -> `/api/auth/refresh`

---

<a id="usage"></a>

## 🚀 사용법

1. 설치

```bash
npm install react-query jose
```

2. Provider 설정

```tsx
// src/app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // 인증과 같은 민감한 API는 자동 재시도 비활성화 추천
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

src/layout.tsx에 Provider 포함하기

```tsx
// src/app/layout.tsx
import "./globals.css";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

3. 코드 예시 (로그인 사용)

```tsx
import { useLogin } from "@/modules/auth";

export default function Page() {
  const login = useLogin();

  return (
    <button
      onClick={() =>
        login.mutate({ email: "test@example.com", password: "password123" })
      }
    >
      로그인
    </button>
  );
}
```

여기서 로그인 정보는 Next.js 서버사이드에 하드코딩된 테스트용 로그인 정보입니다.

4. 사용자 정보 조회

```tsx
import { useUserInfo } from "@/modules/auth";

export default function Profile() {
  const { data: user } = useUserInfo();

  if (!user) return <div>로그인이 필요합니다.</div>;

  return <div>{user.name}님 환영합니다!</div>;
}
```

---

<a id="playground"></a>

## 🔍 Playground 페이지

Playground가 구성되어 있다면 다음 경로에서 확인할 수 있습니다:

![Auth 페이지](/public/images/auth/playground.png)

`/modules/auth`

---

<a id="notes"></a>

## 📝 참고 사항

- 위 모듈은 `React@18`, `React-dom@18`버전 이하에서 작동합니다.

- fetch 기반 API라 endpoint만 교체하면 기존 인증 서버 로직을 그대로 재사용할 수 있습니다.

- 서버가 준비되지 않았다면, 테스트를 위해서 `/src/app/api/auth`폴더도 함께 가져가야합니다. 서버사이드에서 엔드포인트 요청을 처리하는 서버 코드입니다.

- useUserInfo는 토큰 검증 실패 시 자동으로 null을 반환하므로, 인증 분기 처리가 간단합니다.

- jwt.ts, middleware.ts는 서버 전용 코드입니다. 클라이언트 번들에 포함되지 않도록 import 경로에 주의해야 합니다.

- 중요: auth/utils/middleware.ts는 barrel(index)에서 export 하지 않습니다.

  - 예: 아래처럼 하지 말 것
    ```tsx
    // ❌ src/modules/auth/utils/index.ts
    export * from "./middleware"; // 금지
    ```
  - 이유:

    - Next.js 루트 middleware.ts가 edge runtime에서 동작하는 특수 엔트리라
      불필요한 클라이언트 코드/의존성이 함께 끌려오는 것을 피하기 위함

    - barrel을 통해 무심코 클라이언트 코드에서 middleware를 import하는 실수를 방지

    - 인증/라우팅과 관련된 민감한 서버 로직은 명시적 경로(./modules/auth/utils/middleware)를 통해서만 사용하도록 강제하기 위함

---

<a id="run-local"></a>

## 🚀 로컬 실행 방법

```bash
npm install
npm run dev
```

이후 아래 주소로 접근:

http://localhost:3000/
