import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

interface Photo {
  id: string;
  title: string;
  description: string | null;
  stock: string | null;
  year: number | null;
  image_key: string;
  height: number;
  display_order: number;
}

interface AlbumRow {
  id: string;
  title: string;
  description: string | null;
  cover_key: string | null;
  created_at: string;
  photos: Photo[] | null;
}

export async function GET() {
  const rows = await query<AlbumRow>(`
    SELECT
      a.id, a.title, a.description, a.cover_key, a.created_at,
      COALESCE(
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
        ) FILTER (WHERE p.id IS NOT NULL),
        '[]'
      ) AS photos
    FROM albums a
    LEFT JOIN photos p ON p.album_id = a.id
    GROUP BY a.id
    ORDER BY a.created_at ASC
  `);

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { title, description } = await req.json();
  if (!title?.trim()) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }

  const [album] = await query(
    'INSERT INTO albums (title, description) VALUES ($1, $2) RETURNING *',
    [title.trim(), description ?? null]
  );

  return NextResponse.json(album, { status: 201 });
}
