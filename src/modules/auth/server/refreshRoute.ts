import { NextRequest, NextResponse } from "next/server";
import { signAccessToken, verifyToken } from "@/modules/auth/utils/jwt";

// POST
export async function refreshRoute(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "No refresh token" }, { status: 401 });
  }

  try {
    const payload = await verifyToken(refreshToken);

    const newAccessToken = await signAccessToken({
      sub: payload.sub,
      email: payload.email,
      companyName: payload.companyName,
      name: payload.name,
      phone: payload.phone,
    });

    const res = NextResponse.json({ ok: true });

    res.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return res;
  } catch (e) {
    return NextResponse.json(
      { message: "Invalid refresh token" },
      { status: 401 }
    );
  }
}
