import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();

  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  for (const key of ['title', 'description', 'stock', 'year', 'image_key', 'height', 'display_order'] as const) {
    if (key in body) {
      fields.push(`${key} = $${i++}`);
      values.push(body[key]);
    }
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  }

  values.push(id);
  const [updated] = await query(
    `UPDATE photos SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
    values
  );

  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await query('DELETE FROM photos WHERE id = $1', [id]);
  return NextResponse.json({ ok: true });
}
