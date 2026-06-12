'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AlbumSection from './components/AlbumSection';
import { albums } from './lib/films';

function HomeContent() {
  const params = useSearchParams();
  const stock  = params.get('stock') ?? '';

  const visibleAlbums = albums
    .map(album => ({
      ...album,
      filteredFilms: stock
        ? album.films.filter(f => f.duration === stock)
        : album.films,
    }))
    .filter(album => album.filteredFilms.length > 0);

  return (
    <div className="flex flex-col gap-0">
      {visibleAlbums.map(album => (
        <AlbumSection
          key={album.id}
          album={album}
          filteredFilms={album.filteredFilms}
        />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex-1 w-full px-4 py-4">
      <Suspense fallback={
        <div className="fixed inset-0 flex items-end justify-end p-8 pointer-events-none">
          <span className="text-[12vw] font-extralight tracking-tighter text-black/10 leading-none select-none">
            loading...
          </span>
        </div>
      }>
        <HomeContent />
      </Suspense>
    </main>
  );
}
