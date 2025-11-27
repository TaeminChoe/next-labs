import { NextRequest, NextResponse } from "next/server";

// POST
export async function logoutRoute(req: NextRequest) {
  const res = NextResponse.json({ ok: true });

  res.cookies.set("access_token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  res.cookies.set("refresh_token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return res;
}
