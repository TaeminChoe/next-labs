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
