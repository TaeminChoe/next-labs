import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/modules/auth/utils/jwt";

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const payload = await verifyToken(accessToken);

    // TODO: 필요하면 여기서 DB에서 유저 상세 조회
    const user = {
      id: payload.sub,
      email: payload.email,
      companyName: payload.companyName,
      name: payload.name,
      phone: payload.phone,
    };

    return NextResponse.json({ user });
  } catch (e) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
