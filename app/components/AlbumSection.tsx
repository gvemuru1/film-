'use client';

import { useState } from 'react';
import Masonry from './Masonry';
import FilmModal from './FilmModal';
import type { MasonryItem } from './Masonry';

interface Album {
  id: string;
  title: string;
  description: string;
  films: MasonryItem[];
}

interface Props {
  album: Album;
  filteredFilms: MasonryItem[];
}

export default function AlbumSection({ album, filteredFilms }: Props) {
  const [expanded, setExpanded]         = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <section>
      {/* ── Album bar ── */}
      <div className="flex items-center justify-between border-y border-black/10 py-3 px-1 mb-0">

        <div className="flex items-baseline gap-3 min-w-0">
          <span className="text-black/25 font-extralight text-base shrink-0">/</span>
          <span className="text-[11px] uppercase tracking-[0.2em] font-light text-black shrink-0">
            {album.title}
          </span>
          <span className="text-[11px] text-black/35 font-light truncate hidden sm:block">
            — {album.description}
          </span>
          <span className="text-[11px] text-black/25 font-light shrink-0 tabular-nums">
            {filteredFilms.length} frames
          </span>
        </div>

        <button
          onClick={() => setExpanded(v => !v)}
          className="shrink-0 ml-4 text-[11px] uppercase tracking-widest text-black/40 hover:text-black transition-colors flex items-center gap-1.5"
        >
          {expanded ? 'Collapse' : 'Expand'}
          <span className={`transition-transform duration-300 inline-block ${expanded ? 'rotate-180' : ''}`}>
            ▾
          </span>
        </button>
      </div>

      {/* ── Grid (smooth collapse) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: expanded ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.35s ease',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div className="py-4">
            <Masonry
              items={filteredFilms}
              onItemClick={item =>
                setSelectedIndex(filteredFilms.findIndex(f => f.id === item.id))
              }
              ease="power3.out"
              duration={0.6}
              stagger={0.03}
              hoverScale={0.97}
              blurToFocus
            />
          </div>
        </div>
      </div>

      {/* ── Modal (scoped to this album) ── */}
      {selectedIndex !== null && (
        <FilmModal
          items={filteredFilms}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </section>
  );
}
