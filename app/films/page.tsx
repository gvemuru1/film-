import { query } from '../lib/db';
import FilmsContent from './FilmsContent';
import { getImageUrl } from '../lib/images';
import type { MasonryItem } from '../components/Masonry';

async function getAllPhotos(): Promise<MasonryItem[]> {
  const rows = await query<{
    id: string; title: string; description: string;
    stock: string; year: number; image_key: string; height: number;
  }>(`
    SELECT id, title, description, stock, year, image_key, height
    FROM photos
    ORDER BY created_at ASC
  `);

  return rows.map(p => ({
    id: p.id,
    img: getImageUrl(p.image_key),
    url: '#',
    height: p.height || 320,
    title: p.title,
    year: p.year ? String(p.year) : undefined,
    duration: p.stock,
    description: p.description,
  }));
}

export default async function FilmsPage() {
  const photos = await getAllPhotos();
  return <FilmsContent photos={photos} />;
}
