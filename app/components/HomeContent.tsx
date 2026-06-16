'use client';

import { useSearchParams } from 'next/navigation';
import AlbumSection from './AlbumSection';
import { getImageUrl } from '../lib/images';
import type { MasonryItem } from './Masonry';

interface DBPhoto {
  id: string;
  title: string;
  description: string;
  stock: string;
  year: number;
  image_key: string;
  height: number;
  display_order: number;
}

interface DBAlbum {
  id: string;
  title: string;
  description: string;
  cover_key: string;
  created_at: string;
  photos: DBPhoto[];
}

function toMasonryItem(photo: DBPhoto): MasonryItem {
  return {
    id: photo.id,
    img: getImageUrl(photo.image_key),
    url: '#',
    height: photo.height || 320,
    title: photo.title,
    year: photo.year ? String(photo.year) : undefined,
    duration: photo.stock,
    description: photo.description,
  };
}

export default function HomeContent({ albums }: { albums: DBAlbum[] }) {
  const params = useSearchParams();
  const stock  = params.get('stock') ?? '';

  const visibleAlbums = albums
    .map(album => {
      const films = album.photos
        .filter(p => !stock || p.stock === stock)
        .map(toMasonryItem);
      return { id: album.id, title: album.title, description: album.description, films };
    })
    .filter(album => album.films.length > 0);

  if (visibleAlbums.length === 0) {
    return (
      <p className="text-center text-[11px] uppercase tracking-widest text-black/25 py-32">
        No photos yet
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      {visibleAlbums.map(album => (
        <AlbumSection key={album.id} album={album} filteredFilms={album.films} />
      ))}
    </div>
  );
}
