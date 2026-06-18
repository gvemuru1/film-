import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

export async function GET() {
  const [counts] = await query<{
    albums: string;
    photos: string;
    last_upload: string | null;
  }>(`
    SELECT
      (SELECT COUNT(*) FROM albums)::text                    AS albums,
      (SELECT COUNT(*) FROM photos)::text                    AS photos,
      (SELECT MAX(created_at) FROM photos)::text             AS last_upload
  `);

  return NextResponse.json({
    albums:      Number(counts.albums),
    photos:      Number(counts.photos),
    last_upload: counts.last_upload,
  });
}
