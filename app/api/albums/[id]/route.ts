import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const [album] = await query(
    `SELECT a.*, COALESCE(
       json_agg(
         json_build_object(
           'id',            p.id,
           'title',         p.title,
           'description',   p.description,
           'stock',         p.stock,
           'year',          p.year,
           'image_key',     p.image_key,
           'height',        p.height,
           'display_order', p.display_order
         ) ORDER BY p.display_order, p.created_at
       ) FILTER (WHERE p.id IS NOT NULL), '[]'
     ) AS photos
     FROM albums a
     LEFT JOIN photos p ON p.album_id = a.id
     WHERE a.id = $1
     GROUP BY a.id`,
    [id]
  );

  if (!album) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(album);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();

  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  for (const key of ['title', 'description', 'cover_key'] as const) {
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
    `UPDATE albums SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
    values
  );

  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await query('DELETE FROM albums WHERE id = $1', [id]);
  return NextResponse.json({ ok: true });
}
