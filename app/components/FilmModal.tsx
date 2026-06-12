'use client';

import { useEffect, useState } from 'react';
import type { MasonryItem } from './Masonry';

interface Props {
  items: MasonryItem[];
  initialIndex: number;
  onClose: () => void;
}

export default function FilmModal({ items, initialIndex, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [index, setIndex]     = useState(initialIndex);
  const [fading, setFading]   = useState(false);

  const item = items[index];

  const navigate = (dir: 1 | -1) => {
    const next = index + dir;
    if (next < 0 || next >= items.length) return;
    setFading(true);
    setTimeout(() => { setIndex(next); setFading(false); }, 150);
  };

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft')  navigate(-1);
    };

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index]);

  const close = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col bg-black transition-opacity duration-[250ms] ${visible ? 'opacity-100' : 'opacity-0'}`}
      onClick={close}
    >
      {/* ── Image ── */}
      <div className="relative flex-1 min-h-0" onClick={e => e.stopPropagation()}>
        <img
          key={item.id}
          src={item.img}
          alt={item.title}
          className={`w-full h-full object-cover transition-opacity duration-150 ${fading ? 'opacity-0' : 'opacity-100'}`}
        />

        {/* Counter */}
        <span className="absolute top-5 left-6 text-white/40 text-[11px] tracking-widest uppercase tabular-nums">
          {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </span>

        {/* Close */}
        <button
          onClick={close}
          className="absolute top-4 right-5 text-white/50 hover:text-white text-2xl leading-none transition-colors"
        >
          ×
        </button>

        {/* Prev */}
        {index > 0 && (
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-3xl leading-none transition-colors px-2"
          >
            ‹
          </button>
        )}

        {/* Next */}
        {index < items.length - 1 && (
          <button
            onClick={() => navigate(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-3xl leading-none transition-colors px-2"
          >
            ›
          </button>
        )}

        {/* Title gradient */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/90 to-transparent flex items-end px-6 pb-4">
          <h2
            className="text-white text-2xl font-light tracking-tight leading-snug"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,1)' }}
          >
            <span className="text-white/40 mr-2 font-extralight">/</span>
            {item.title}
          </h2>
        </div>
      </div>

      {/* ── Info panel ── */}
      <div
        className="shrink-0 bg-white flex items-start justify-between gap-10 px-6 py-3"
        onClick={e => e.stopPropagation()}
      >
        {/* Description */}
        <p className="text-sm text-black/65 leading-relaxed max-w-2xl font-light">
          {item.description}
        </p>

        {/* Stats — year + film stock only */}
        <div className="shrink-0 flex flex-col items-end gap-0.5 text-[11px] text-black/40 uppercase tracking-widest font-light pt-0.5">
          {item.year     && <span>/ {item.year}</span>}
          {item.duration && <span>/ {item.duration}</span>}
        </div>
      </div>
    </div>
  );
}
