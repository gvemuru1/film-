import { Suspense } from 'react';
import { query } from './lib/db';
import HomeContent from './components/HomeContent';

async function getAlbums() {
  return query(`
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
}

export default async function Home() {
  const albums = await getAlbums();

  return (
    <main className="flex-1 w-full px-4 py-4">
      <Suspense fallback={
        <div className="fixed inset-0 flex items-end justify-end p-8 pointer-events-none">
          <span className="text-[12vw] font-extralight tracking-tighter text-black/10 leading-none select-none">
            loading...
          </span>
        </div>
      }>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <HomeContent albums={albums as any} />
      </Suspense>
    </main>
  );
}
