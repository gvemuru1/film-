import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const reqMethod = req.method;

  // Always allow login / logout (they don't need auth)
  if (pathname.startsWith('/api/auth/')) return NextResponse.next();

  // Allow public GET requests (reading albums + photos)
  if (reqMethod === 'GET') return NextResponse.next();

  // Everything else (POST / PATCH / DELETE) requires a valid token
  const token = req.cookies.get('film_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}

export const config = {
  matcher: '/api/:path*',
};
