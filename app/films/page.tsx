'use client';

import { useState } from 'react';
import Masonry from '../components/Masonry';
import FilmModal from '../components/FilmModal';
import { films, STOCKS } from '../lib/films';

export default function FilmsPage() {
  const [stock, setStock]             = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filtered = stock ? films.filter(f => f.duration === stock) : films;

  return (
    <main className="flex-1 w-full px-6 py-4">

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-[11px] uppercase tracking-widest text-black/40 font-light">/ Filter</span>

        <div className="relative">
          <select
            value={stock}
            onChange={e => { setStock(e.target.value); setSelectedIndex(null); }}
            className="appearance-none bg-transparent border-b border-black/20 text-[11px] uppercase tracking-widest text-black/60 pr-5 pl-0 py-1 cursor-pointer hover:border-black/50 focus:outline-none focus:border-black transition-colors"
          >
            <option value="">All Film</option>
            {STOCKS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-black/30 text-xs">▾</span>
        </div>
      </div>

      <Masonry
        items={filtered}
        onItemClick={item => setSelectedIndex(filtered.findIndex(f => f.id === item.id))}
        ease="power3.out"
        duration={0.6}
        stagger={0.04}
        hoverScale={0.97}
        blurToFocus
      />

      {selectedIndex !== null && (
        <FilmModal
          items={filtered}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </main>
  );
}
