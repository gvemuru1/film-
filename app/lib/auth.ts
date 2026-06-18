import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const COOKIE = 'film_token';

export async function signToken(payload: Record<string, unknown>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('90m')
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, SECRET);
  return payload;
}

export async function getSessionToken() {
  const jar = await cookies();
  return jar.get(COOKIE)?.value ?? null;
}

export async function isAuthenticated() {
  const token = await getSessionToken();
  if (!token) return false;
  try {
    await verifyToken(token);
    return true;
  } catch {
    return false;
  }
}

export { COOKIE };
