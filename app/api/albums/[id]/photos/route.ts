import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const photos = await query(
    'SELECT * FROM photos WHERE album_id = $1 ORDER BY display_order, created_at',
    [id]
  );
  return NextResponse.json(photos);
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id: album_id } = await params;
  const { title, description, stock, year, image_key, height, display_order } = await req.json();

  if (!image_key) {
    return NextResponse.json({ error: 'image_key is required' }, { status: 400 });
  }

  const [photo] = await query(
    `INSERT INTO photos
       (album_id, title, description, stock, year, image_key, height, display_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      album_id,
      title ?? '',
      description ?? '',
      stock ?? '',
      year ?? 0,
      image_key,
      height ?? 320,
      display_order ?? 0,
    ]
  );

  // Auto-set first photo as album cover
  await query(
    `UPDATE albums SET cover_key = $1
     WHERE id = $2 AND cover_key = ''`,
    [image_key, album_id]
  );

  return NextResponse.json(photo, { status: 201 });
}
