'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { albums as initialAlbums, STOCKS, type Album } from '../lib/films';
import type { MasonryItem } from '../components/Masonry';

// ── credentials (replace with env vars / server auth later) ───────────────
const CREDS = { username: 'admin', password: 'admin', pin: '1234' };

// ── login card ────────────────────────────────────────────────────────────

function LoginCard({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep]       = useState<1 | 2>(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin]           = useState(['', '', '', '']);
  const [error, setError]       = useState('');
  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const submitStep1 = () => {
    if (username === CREDS.username && password === CREDS.password) {
      setError('');
      setStep(2);
      setTimeout(() => pinRefs[0].current?.focus(), 50);
    } else {
      setError('Incorrect username or password.');
    }
  };

  const handlePinChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...pin];
    next[i] = val;
    setPin(next);
    if (val && i < 3) pinRefs[i + 1].current?.focus();
    if (next.every(d => d !== '') && next.join('') === CREDS.pin) {
      onSuccess();
    } else if (next.every(d => d !== '')) {
      setError('Incorrect PIN.');
      setPin(['', '', '', '']);
      setTimeout(() => pinRefs[0].current?.focus(), 50);
    }
  };

  const handlePinKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[i] && i > 0) {
      pinRefs[i - 1].current?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm border border-black/10 rounded-2xl bg-white p-8 flex flex-col gap-6">

        {/* Header */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-black/25 font-light mb-2">/ Admin</p>
          <h2 className="text-xl font-extralight tracking-tight text-black">
            {step === 1 ? 'Sign in' : 'Enter PIN'}
          </h2>
          <p className="text-xs text-black/35 font-light mt-1">
            {step === 1 ? 'Enter your credentials to continue.' : '4-digit access code.'}
          </p>
        </div>

        {/* Step 1 — credentials */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            {[
              { label: 'Username', value: username, set: setUsername, type: 'text' },
              { label: 'Password', value: password, set: setPassword, type: 'password' },
            ].map(({ label, value, set, type }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest text-black/30 font-light">{label}</label>
                <input
                  type={type}
                  value={value}
                  onChange={e => { set(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && submitStep1()}
                  className="border-b border-black/15 bg-transparent text-sm py-1.5 text-black font-light focus:outline-none focus:border-black transition-colors"
                />
              </div>
            ))}
            {error && <p className="text-[11px] text-red-400 font-light">{error}</p>}
            <button
              onClick={submitStep1}
              className="mt-1 w-full bg-black text-white text-[10px] uppercase tracking-widest py-3 rounded-lg hover:bg-black/80 transition-colors"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2 — PIN */}
        {step === 2 && (
          <div className="flex flex-col gap-4 items-center">
            <div className="flex gap-3">
              {pin.map((digit, i) => (
                <input
                  key={i}
                  ref={pinRefs[i]}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handlePinChange(i, e.target.value)}
                  onKeyDown={e => handlePinKey(i, e)}
                  className="w-12 h-14 text-center text-xl font-light border border-black/15 rounded-lg bg-transparent focus:outline-none focus:border-black transition-colors"
                />
              ))}
            </div>
            {error && <p className="text-[11px] text-red-400 font-light">{error}</p>}
            <button
              onClick={() => { setStep(1); setPin(['', '', '', '']); setError(''); }}
              className="text-[10px] uppercase tracking-widest text-black/30 hover:text-black transition-colors"
            >
              ← Back
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ── types ─────────────────────────────────────────────────────────────────

type View = 'albums' | 'detail';

// ── edit panel ────────────────────────────────────────────────────────────

function EditPanel({
  photo,
  onSave,
  onClose,
}: {
  photo: MasonryItem;
  onSave: (updated: MasonryItem) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ ...photo });

  const set = (key: keyof MasonryItem, val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-black/10 z-50 flex flex-col shadow-xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
        <span className="text-[11px] uppercase tracking-[0.2em] font-light text-black">Edit Photo</span>
        <button onClick={onClose} className="text-black/30 hover:text-black text-xl leading-none">×</button>
      </div>

      {/* Image preview */}
      <div className="w-full aspect-video shrink-0 bg-black">
        <img src={form.img} alt="" className="w-full h-full object-cover" />
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">

        {[
          { label: 'Title', key: 'title' as const },
          { label: 'Year', key: 'year' as const },
        ].map(({ label, key }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-black/35 font-light">{label}</label>
            <input
              className="border-b border-black/15 bg-transparent text-sm py-1 text-black font-light focus:outline-none focus:border-black transition-colors"
              value={(form[key] as string) ?? ''}
              onChange={e => set(key, e.target.value)}
            />
          </div>
        ))}

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-widest text-black/35 font-light">Film Stock</label>
          <select
            className="border-b border-black/15 bg-transparent text-sm py-1 text-black font-light focus:outline-none focus:border-black transition-colors appearance-none"
            value={form.duration ?? ''}
            onChange={e => set('duration', e.target.value)}
          >
            <option value="">— select —</option>
            {STOCKS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-widest text-black/35 font-light">Description</label>
          <textarea
            rows={4}
            className="border border-black/10 rounded bg-transparent text-sm p-2 text-black font-light focus:outline-none focus:border-black transition-colors resize-none leading-relaxed"
            value={form.description ?? ''}
            onChange={e => set('description', e.target.value)}
          />
        </div>
      </div>

      <div className="px-5 py-4 border-t border-black/10 flex gap-3">
        <button
          onClick={() => onSave(form)}
          className="flex-1 bg-black text-white text-[10px] uppercase tracking-widest py-2.5 rounded hover:bg-black/80 transition-colors"
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="flex-1 border border-black/15 text-[10px] uppercase tracking-widest py-2.5 rounded text-black/50 hover:text-black hover:border-black/40 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── drop zone ─────────────────────────────────────────────────────────────

function DropZone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = (files: FileList | null) => {
    if (!files) return;
    const images = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (images.length) onFiles(images);
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); accept(e.dataTransfer.files); }}
      onClick={() => inputRef.current?.click()}
      className={`w-full border-2 border-dashed rounded-lg py-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors mb-6 ${
        dragging ? 'border-black bg-black/5' : 'border-black/15 hover:border-black/35'
      }`}
    >
      <span className="text-2xl text-black/20">↑</span>
      <p className="text-[11px] uppercase tracking-widest text-black/35 font-light">
        Drop images here or click to upload
      </p>
      <p className="text-[10px] text-black/25 font-light">Multiple files supported</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => accept(e.target.files)}
      />
    </div>
  );
}

// ── photo card ────────────────────────────────────────────────────────────

function PhotoCard({
  photo,
  onEdit,
  onDelete,
}: {
  photo: MasonryItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-video bg-black/5 rounded-lg overflow-hidden">
        <img src={photo.img} alt={photo.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <button
            onClick={onEdit}
            className="bg-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded text-black hover:bg-white/90 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 text-[10px] uppercase tracking-widest px-3 py-1.5 rounded text-white hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="mt-1.5 px-0.5">
        <p className="text-xs font-light text-black truncate">{photo.title}</p>
        <p className="text-[10px] text-black/35 font-light">{photo.duration} · {photo.year}</p>
      </div>
    </div>
  );
}

// ── album card (icon view) ────────────────────────────────────────────────

function AlbumCard({
  album,
  onClick,
  onDelete,
}: {
  album: Album;
  onClick: () => void;
  onDelete: () => void;
}) {
  const cover = album.films[0]?.img;

  return (
    <div className="group flex flex-col cursor-pointer" onClick={onClick}>
      <div className="relative aspect-square bg-black/5 rounded-xl overflow-hidden">
        {cover ? (
          <img src={cover} alt={album.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-black/15 text-4xl font-extralight">/</span>
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
        {/* Delete button */}
        <button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 text-red-500 text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        >
          ×
        </button>
        {/* Frame count */}
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded font-light tracking-widest">
          {album.films.length}
        </div>
      </div>
      <div className="mt-2 px-0.5">
        <p className="text-xs font-light text-black uppercase tracking-[0.12em]">{album.title}</p>
        <p className="text-[10px] text-black/35 font-light truncate">{album.description}</p>
      </div>
    </div>
  );
}

// ── admin page ────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed]   = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  const [albums, setAlbums]         = useState<Album[]>(initialAlbums);
  const [view, setView]             = useState<View>('albums');
  const [activeId, setActiveId]     = useState<string | null>(null);
  const [editing, setEditing]       = useState<MasonryItem | null>(null);
  const [showNewAlbum, setShowNew]  = useState(false);
  const [newTitle, setNewTitle]     = useState('');
  const [newDesc, setNewDesc]       = useState('');

  const updateAlbumFilms = useCallback((id: string, films: MasonryItem[]) =>
    setAlbums(prev => prev.map(a => a.id === id ? { ...a, films } : a)), []);

  const activeAlbum = albums.find(a => a.id === activeId) ?? null;

  if (!mounted) return (
    <div className="min-h-screen flex items-end justify-end p-8 pointer-events-none">
      <span className="text-[12vw] font-extralight tracking-tighter text-black/10 leading-none select-none">
        loading...
      </span>
    </div>
  );
  if (!authed) return <LoginCard onSuccess={() => setAuthed(true)} />;

  // ── album mutations ──

  const addAlbum = () => {
    if (!newTitle.trim()) return;
    setAlbums(prev => [...prev, {
      id: `album-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim(),
      films: [],
    }]);
    setNewTitle(''); setNewDesc(''); setShowNew(false);
  };

  const deleteAlbum = (id: string) =>
    setAlbums(prev => prev.filter(a => a.id !== id));

  const openAlbum = (id: string) => { setActiveId(id); setView('detail'); };
  const goBack    = () => { setView('albums'); setActiveId(null); setEditing(null); };

  const addPhotos = (files: File[]) => {
    if (!activeAlbum) return;
    const newPhotos: MasonryItem[] = files.map(file => ({
      id: `up-${Date.now()}-${Math.random()}`,
      img: URL.createObjectURL(file),
      url: '#',
      height: 320,
      title: file.name.replace(/\.[^.]+$/, ''),
      year: String(new Date().getFullYear()),
      duration: STOCKS[0],
      description: '',
    }));
    updateAlbumFilms(activeAlbum.id, [...activeAlbum.films, ...newPhotos]);
  };

  const deletePhoto = (photoId: string) => {
    if (!activeAlbum) return;
    updateAlbumFilms(activeAlbum.id, activeAlbum.films.filter(p => p.id !== photoId));
    if (editing?.id === photoId) setEditing(null);
  };

  const savePhoto = (updated: MasonryItem) => {
    if (!activeAlbum) return;
    updateAlbumFilms(activeAlbum.id, activeAlbum.films.map(p => p.id === updated.id ? updated : p));
    setEditing(null);
  };

  // ── render ──

  return (
    <div className="min-h-screen flex flex-col">

      {/* Top bar */}
      <header className="w-full border-b border-black/10 bg-white/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {view === 'detail' && (
              <button onClick={goBack} className="text-black/30 hover:text-black transition-colors text-sm mr-1">←</button>
            )}
            <span className="text-black/25 font-extralight">/</span>
            <span className="text-[11px] uppercase tracking-[0.2em] font-light text-black">Admin</span>
            {activeAlbum && (
              <>
                <span className="text-black/20">·</span>
                <span className="text-[11px] uppercase tracking-[0.2em] font-light text-black/50">{activeAlbum.title}</span>
              </>
            )}
          </div>
          <Link href="/" className="text-[10px] uppercase tracking-widest text-black/35 hover:text-black transition-colors">
            ← Back to Site
          </Link>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full">

        {/* ── Albums grid view ── */}
        {view === 'albums' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-sm uppercase tracking-[0.2em] font-light text-black">Albums</h1>
                <p className="text-[11px] text-black/35 font-light mt-0.5">
                  {albums.length} albums · {albums.reduce((n, a) => n + a.films.length, 0)} frames
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
            {showNewAlbum && (
              <div className="border border-black/10 rounded-xl px-5 py-4 mb-6 bg-white flex items-end gap-4 flex-wrap">
                <div className="flex flex-col gap-1.5 flex-1 min-w-40">
                  <label className="text-[10px] uppercase tracking-widest text-black/30">Title</label>
                  <input autoFocus placeholder="Roll 004" value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addAlbum()}
                    className="border-b border-black/15 bg-transparent text-sm py-1 focus:outline-none focus:border-black font-light" />
                </div>
                <div className="flex flex-col gap-1.5 flex-1 min-w-52">
                  <label className="text-[10px] uppercase tracking-widest text-black/30">Description</label>
                  <input placeholder="One line about this roll" value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addAlbum()}
                    className="border-b border-black/15 bg-transparent text-sm py-1 focus:outline-none focus:border-black font-light" />
                </div>
                <div className="flex gap-3">
                  <button onClick={addAlbum} className="text-[10px] uppercase tracking-widest bg-black text-white px-4 py-2 rounded hover:bg-black/80 transition-colors">Create</button>
                  <button onClick={() => setShowNew(false)} className="text-[10px] uppercase tracking-widest text-black/35 hover:text-black transition-colors">Cancel</button>
                </div>
              </div>
            )}

            {/* Album icon grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {albums.map(album => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onClick={() => openAlbum(album.id)}
                  onDelete={() => deleteAlbum(album.id)}
                />
              ))}
            </div>
          </>
        )}

        {/* ── Album detail view ── */}
        {view === 'detail' && activeAlbum && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-sm uppercase tracking-[0.2em] font-light text-black">{activeAlbum.title}</h1>
                <p className="text-[11px] text-black/35 font-light mt-0.5">{activeAlbum.description} · {activeAlbum.films.length} frames</p>
              </div>
            </div>

            {/* Drop zone */}
            <DropZone onFiles={addPhotos} />

            {/* Photo grid */}
            {activeAlbum.films.length === 0 ? (
              <p className="text-center text-[11px] uppercase tracking-widest text-black/25 py-16">No photos yet — drop some above</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {activeAlbum.films.map(photo => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    onEdit={() => setEditing(photo)}
                    onDelete={() => deletePhoto(photo.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

      </main>

      {/* Edit panel */}
      {editing && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setEditing(null)} />
          <EditPanel
            photo={editing}
            onSave={savePhoto}
            onClose={() => setEditing(null)}
          />
        </>
      )}
    </div>
  );
}
