import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

export async function GET() {
  const rows = await query<{ stock: string }>(
    `SELECT DISTINCT stock FROM photos WHERE stock != '' ORDER BY stock`
  );
  return NextResponse.json(rows.map(r => r.stock));
}
