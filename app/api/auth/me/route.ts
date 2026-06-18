import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/app/lib/auth';

export async function GET() {
  const ok = await isAuthenticated();
  if (!ok) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true });
}
