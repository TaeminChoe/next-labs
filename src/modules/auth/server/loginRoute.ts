import { NextRequest, NextResponse } from "next/server";
import { signAccessToken, signRefreshToken } from "@/modules/auth/utils/jwt";

// POST
export async function loginRoute(req: NextRequest) {
  const { email, password } = await req.json();

  // 모킹
  if (email !== "test@example.com" || password !== "password123") {
    return NextResponse.json(
      { message: "아이디(이메일) 또는 비밀번호가 일치하지 않습니다." },
      { status: 401 }
    );
  }

  const user = {
    id: "1",
    email,
    phone: "010-1234-1234",
    companyName: "ZIEN",
    name: "CHOI",
  };

  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken({
      sub: user.id,
      email: user.email,
      companyName: user.companyName,
      name: user.name,
      phone: user.phone,
    }),
    signRefreshToken({
      sub: user.id,
      email: user.email,
      companyName: user.companyName,
      name: user.name,
      phone: user.phone,
    }),
  ]);

  const res = NextResponse.json({
    user,
  });

  // 쿠키 설정
  res.cookies.set("access_token", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return res;
}
