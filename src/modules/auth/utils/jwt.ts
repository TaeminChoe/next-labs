import { JWTPayload, SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

export interface JwtPayload extends JWTPayload {
  sub: string;
  email: string;
  companyName: string;
  name: string;
  phone: string;
}

const ACCESS_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "7d";

export async function signAccessToken(payload: JwtPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(ACCESS_EXPIRES_IN)
    .setIssuedAt()
    .sign(SECRET);
}

export async function signRefreshToken(payload: JwtPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(REFRESH_EXPIRES_IN)
    .setIssuedAt()
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, SECRET);
  return payload as JwtPayload & { exp: number; iat: number };
}
