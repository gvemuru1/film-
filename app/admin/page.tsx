'use client';

import { useState } from 'react';
import Link from 'next/link';
import { albums as initialAlbums, STOCKS, type Album } from '../lib/films';
import type { MasonryItem } from '../components/Masonry';

// ── tiny helpers ──────────────────────────────────────────────────────────

function badge(text: string) {
  return (
    <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-widest border border-black/15 text-black/40 font-light">
      {text}
    </span>
  );
}

// ── photo row ─────────────────────────────────────────────────────────────

function PhotoRow({
  photo,
  onDelete,
}: {
  photo: MasonryItem;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle]     = useState(photo.title);
  const [stock, setStock]     = useState(photo.duration ?? '');
  const [year, setYear]       = useState(photo.year ?? '');

  return (
    <div className="flex items-center gap-4 py-2.5 border-b border-black/5 group">
      {/* Thumb */}
      <img
        src={photo.img}
        alt={photo.title}
        className="w-16 h-10 object-cover rounded shrink-0"
      />

      {editing ? (
        /* Edit mode */
        <div className="flex flex-1 items-center gap-3 flex-wrap">
          <input
            className="border-b border-black/20 bg-transparent text-xs py-0.5 w-40 focus:outline-none focus:border-black"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <select
            className="border-b border-black/20 bg-transparent text-xs py-0.5 focus:outline-none"
            value={stock}
            onChange={e => setStock(e.target.value)}
          >
            {STOCKS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input
            className="border-b border-black/20 bg-transparent text-xs py-0.5 w-16 focus:outline-none focus:border-black"
            value={year}
            onChange={e => setYear(e.target.value)}
          />
          <button
            onClick={() => setEditing(false)}
            className="text-[10px] uppercase tracking-widest text-black/60 hover:text-black transition-colors"
          >
            Save
          </button>
        </div>
      ) : (
        /* View mode */
        <div className="flex flex-1 items-center gap-3 min-w-0">
          <span className="text-xs font-light text-black truncate flex-1">{title}</span>
          {badge(stock)}
          {badge(year)}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => setEditing(v => !v)}
          className="text-[10px] uppercase tracking-widest text-black/40 hover:text-black transition-colors"
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
        <button
          onClick={onDelete}
          className="text-[10px] uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// ── album panel ───────────────────────────────────────────────────────────

function AlbumPanel({
  album,
  onDelete,
}: {
  album: Album;
  onDelete: () => void;
}) {
  const [open, setOpen]     = useState(false);
  const [photos, setPhotos] = useState(album.films);

  const removePhoto = (id: string) =>
    setPhotos(prev => prev.filter(p => p.id !== id));

  const stockCounts = STOCKS.map(s => ({
    stock: s,
    count: photos.filter(p => p.duration === s).length,
  }));

  return (
    <div className="border border-black/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-white">
        <div className="flex items-baseline gap-3">
          <span className="text-black/25 font-extralight">/</span>
          <span className="text-sm font-light tracking-[0.15em] uppercase text-black">
            {album.title}
          </span>
          <span className="text-xs text-black/35 font-light hidden sm:block">
            {album.description}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {stockCounts.map(({ stock, count }) => count > 0 && (
              <span key={stock} className="text-[10px] text-black/35 font-light">
                {stock} ·{count}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-black/30 tabular-nums">{photos.length} frames</span>

          <button
            onClick={() => setOpen(v => !v)}
            className="text-[10px] uppercase tracking-widest text-black/40 hover:text-black transition-colors flex items-center gap-1"
          >
            {open ? 'Close' : 'Manage'}
            <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
          </button>

          <button
            onClick={onDelete}
            className="text-[10px] uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Photo list */}
      {open && (
        <div className="px-5 pb-3 bg-white border-t border-black/5">
          <div className="mt-1">
            {photos.map(photo => (
              <PhotoRow
                key={photo.id}
                photo={photo}
                onDelete={() => removePhoto(photo.id)}
              />
            ))}
          </div>

          {/* Add photo placeholder */}
          <button className="mt-3 text-[10px] uppercase tracking-widest text-black/30 hover:text-black border border-dashed border-black/15 hover:border-black/30 rounded px-4 py-2 w-full transition-colors">
            + Add Photo
          </button>
        </div>
      )}
    </div>
  );
}

// ── admin page ────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [albums, setAlbums] = useState<Album[]>(initialAlbums);
  const [showNew, setShowNew]   = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc]   = useState('');

  const deleteAlbum = (id: string) =>
    setAlbums(prev => prev.filter(a => a.id !== id));

  const addAlbum = () => {
    if (!newTitle.trim()) return;
    setAlbums(prev => [
      ...prev,
      { id: `album-${Date.now()}`, title: newTitle.trim(), description: newDesc.trim(), films: [] },
    ]);
    setNewTitle('');
    setNewDesc('');
    setShowNew(false);
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* Admin top bar */}
      <header className="w-full border-b border-black/10 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 h-14 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-black/25 font-extralight">/</span>
            <span className="text-[11px] uppercase tracking-[0.2em] font-light text-black">Admin</span>
          </div>
          <Link
            href="/"
            className="text-[10px] uppercase tracking-widest text-black/40 hover:text-black transition-colors"
          >
            ← Back to Site
          </Link>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 max-w-5xl mx-auto w-full">

        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-sm uppercase tracking-[0.2em] font-light text-black">Albums</h1>
            <p className="text-[11px] text-black/35 font-light mt-0.5">
              {albums.length} albums · {albums.reduce((n, a) => n + a.films.length, 0)} frames total
            </p>
          </div>
          <button
            onClick={() => setShowNew(v => !v)}
            className="text-[10px] uppercase tracking-widest border border-black/20 hover:border-black px-4 py-2 rounded text-black/50 hover:text-black transition-colors"
          >
            + New Album
          </button>
        </div>

        {/* New album form */}
        {showNew && (
          <div className="border border-black/10 rounded-lg px-5 py-4 mb-4 bg-white flex items-end gap-4 flex-wrap">
            <div className="flex flex-col gap-1 flex-1 min-w-40">
              <label className="text-[10px] uppercase tracking-widest text-black/30">Title</label>
              <input
                autoFocus
                className="border-b border-black/20 bg-transparent text-sm py-1 focus:outline-none focus:border-black font-light"
                placeholder="Roll 004"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addAlbum()}
              />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-52">
              <label className="text-[10px] uppercase tracking-widest text-black/30">Description</label>
              <input
                className="border-b border-black/20 bg-transparent text-sm py-1 focus:outline-none focus:border-black font-light"
                placeholder="One line about this roll"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addAlbum()}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={addAlbum}
                className="text-[10px] uppercase tracking-widest bg-black text-white px-4 py-2 rounded hover:bg-black/80 transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setShowNew(false)}
                className="text-[10px] uppercase tracking-widest text-black/40 hover:text-black transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Album list */}
        <div className="flex flex-col gap-3">
          {albums.map(album => (
            <AlbumPanel
              key={album.id}
              album={album}
              onDelete={() => deleteAlbum(album.id)}
            />
          ))}
        </div>

      </main>
    </div>
  );
}
