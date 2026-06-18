'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { getImageUrl } from '../lib/images';


interface DBPhoto {
  id: string;
  album_id: string;
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

type View = 'albums' | 'detail';

// ── Login card ────────────────────────────────────────────────────────────────

function LoginCard({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        setError('Incorrect username or password.');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm border border-black/10 rounded-2xl bg-white p-8 flex flex-col gap-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-black/25 font-light mb-2">/ Admin</p>
          <h2 className="text-xl font-extralight tracking-tight text-black">Sign in</h2>
          <p className="text-xs text-black/35 font-light mt-1">Enter your credentials to continue.</p>
        </div>
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
                onKeyDown={e => e.key === 'Enter' && submit()}
                className="border-b border-black/15 bg-transparent text-sm py-1.5 text-black font-light focus:outline-none focus:border-black transition-colors"
              />
            </div>
          ))}
          {error && <p className="text-[11px] text-red-400 font-light">{error}</p>}
          <button
            onClick={submit}
            disabled={loading}
            className="mt-1 w-full bg-black text-white text-[10px] uppercase tracking-widest py-3 rounded-lg hover:bg-black/80 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Edit panel ────────────────────────────────────────────────────────────────

function EditPanel({
  photo,
  onSave,
  onClose,
}: {
  photo: DBPhoto;
  onSave: (updated: DBPhoto) => void;
  onClose: () => void;
}) {
  const [form, setForm]     = useState({ ...photo });
  const [saving, setSaving] = useState(false);

  const set = (key: keyof DBPhoto, val: string | number) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/photos/${photo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          stock: form.stock,
          year: form.year ? Number(form.year) : 0,
        }),
      });
      const updated = await res.json();
      onSave(updated);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-black/10 z-50 flex flex-col shadow-xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
        <span className="text-[11px] uppercase tracking-[0.2em] font-light text-black">Edit Photo</span>
        <button onClick={onClose} className="text-black/30 hover:text-black text-xl leading-none">×</button>
      </div>

      <div className="w-full aspect-video shrink-0 bg-black">
        <img src={getImageUrl(photo.image_key)} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
        {([
          { label: 'Title', key: 'title' as const },
          { label: 'Year',  key: 'year'  as const },
        ]).map(({ label, key }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-black/35 font-light">{label}</label>
            <input
              className="border-b border-black/15 bg-transparent text-sm py-1 text-black font-light focus:outline-none focus:border-black transition-colors"
              value={String(form[key] ?? '')}
              onChange={e => set(key, e.target.value)}
            />
          </div>
        ))}

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-widest text-black/35 font-light">Film Stock</label>
          <input
            type="text"
            placeholder="e.g. Kodak Gold 200"
            className="border-b border-black/15 bg-transparent text-sm py-1 text-black font-light focus:outline-none focus:border-black transition-colors"
            value={form.stock}
            onChange={e => set('stock', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-widest text-black/35 font-light">Description</label>
          <textarea
            rows={4}
            className="border border-black/10 rounded bg-transparent text-sm p-2 text-black font-light focus:outline-none focus:border-black transition-colors resize-none leading-relaxed"
            value={form.description}
            onChange={e => set('description', e.target.value)}
          />
        </div>
      </div>

      <div className="px-5 py-4 border-t border-black/10 flex gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="flex-1 bg-black text-white text-[10px] uppercase tracking-widest py-2.5 rounded hover:bg-black/80 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
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

// ── Drop zone ─────────────────────────────────────────────────────────────────

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
      <p className="text-[11px] uppercase tracking-widest text-black/35 font-light">Drop images here or click to upload</p>
      <p className="text-[10px] text-black/25 font-light">Multiple files supported</p>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => accept(e.target.files)} />
    </div>
  );
}

// ── Photo card ────────────────────────────────────────────────────────────────

function PhotoCard({ photo, onEdit, onDelete }: { photo: DBPhoto; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-video bg-black/5 rounded-lg overflow-hidden">
        <img src={getImageUrl(photo.image_key)} alt={photo.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <button onClick={onEdit} className="bg-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded text-black hover:bg-white/90 transition-colors">Edit</button>
          <button onClick={onDelete} className="bg-red-500 text-[10px] uppercase tracking-widest px-3 py-1.5 rounded text-white hover:bg-red-600 transition-colors">Delete</button>
        </div>
      </div>
      <div className="mt-1.5 px-0.5">
        <p className="text-xs font-light text-black truncate">{photo.title || 'Untitled'}</p>
        <p className="text-[10px] text-black/35 font-light">{photo.stock}{photo.year ? ` · ${photo.year}` : ''}</p>
      </div>
    </div>
  );
}

// ── Album card ────────────────────────────────────────────────────────────────

function AlbumCard({ album, onClick, onDelete }: { album: DBAlbum; onClick: () => void; onDelete: () => void }) {
  const coverKey = album.cover_key || album.photos[0]?.image_key || '';

  return (
    <div className="group flex flex-col cursor-pointer" onClick={onClick}>
      <div className="relative aspect-square bg-black/5 rounded-xl overflow-hidden">
        {coverKey ? (
          <img src={getImageUrl(coverKey)} alt={album.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-black/15 text-4xl font-extralight">/</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
        <button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 text-red-500 text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        >×</button>
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded font-light tracking-widest">
          {album.photos.length}
        </div>
      </div>
      <div className="mt-2 px-0.5">
        <p className="text-xs font-light text-black uppercase tracking-[0.12em]">{album.title}</p>
        <p className="text-[10px] text-black/35 font-light truncate">{album.description}</p>
      </div>
    </div>
  );
}

// ── Admin page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed]       = useState(false);
  const [mounted, setMounted]     = useState(false);
  const [albums, setAlbums]       = useState<DBAlbum[]>([]);
  const [view, setView]           = useState<View>('albums');
  const [activeId, setActiveId]   = useState<string | null>(null);
  const [editing, setEditing]     = useState<DBPhoto | null>(null);
  const [showNewAlbum, setShowNew] = useState(false);
  const [newTitle, setNewTitle]   = useState('');
  const [newDesc, setNewDesc]     = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number; pct: number } | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<{ albums: number; photos: number; last_upload: string | null } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { if (r.ok) setAuthed(true); })
      .finally(() => setMounted(true));
  }, []);

  const fetchAlbums = useCallback(async () => {
    const data = await fetch('/api/albums').then(r => r.json());
    setAlbums(data);
  }, []);

  useEffect(() => {
    if (authed) fetchAlbums();
  }, [authed, fetchAlbums]);

  const activeAlbum = albums.find(a => a.id === activeId) ?? null;

  const openStats = async () => {
    setShowStats(v => !v);
    if (!stats) {
      const data = await fetch('/api/stats').then(r => r.json());
      setStats(data);
    }
  };

  if (!mounted) return (
    <div className="min-h-screen flex items-end justify-end p-8 pointer-events-none">
      <span className="text-[12vw] font-extralight tracking-tighter text-black/10 leading-none select-none">loading...</span>
    </div>
  );
  if (!authed) return <LoginCard onSuccess={() => setAuthed(true)} />;

  // ── Album mutations ──────────────────────────────────────────────────────────

  const addAlbum = async () => {
    if (!newTitle.trim()) return;
    const res = await fetch('/api/albums', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle.trim(), description: newDesc.trim() }),
    });
    const album = await res.json();
    setAlbums(prev => [...prev, { ...album, photos: [] }]);
    setNewTitle(''); setNewDesc(''); setShowNew(false);
  };

  const deleteAlbum = async (id: string) => {
    await fetch(`/api/albums/${id}`, { method: 'DELETE' });
    setAlbums(prev => prev.filter(a => a.id !== id));
    if (activeId === id) { setView('albums'); setActiveId(null); }
  };

  const openAlbum = (id: string) => { setActiveId(id); setView('detail'); };
  const goBack    = () => { setView('albums'); setActiveId(null); setEditing(null); };

  // ── Photo mutations ──────────────────────────────────────────────────────────

  function uploadToS3(url: string, file: File, onPct: (p: number) => void) {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.upload.onprogress = e => {
        if (e.lengthComputable) onPct(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload  = () => xhr.status < 400 ? resolve() : reject(new Error(`S3 ${xhr.status}`));
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.send(file);
    });
  }

  const addPhotos = async (files: File[]) => {
    if (!activeAlbum) return;
    setUploading(true);
    setUploadProgress({ done: 0, total: files.length, pct: 0 });
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const { presignedUrl, key } = await fetch('/api/upload/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        }).then(r => r.json());

        await uploadToS3(presignedUrl, file, pct =>
          setUploadProgress({ done: i, total: files.length, pct })
        );

        await fetch(`/api/albums/${activeAlbum.id}/photos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: file.name.replace(/\.[^.]+$/, ''),
            image_key: key,
            height: 320,
          }),
        });

        setUploadProgress({ done: i + 1, total: files.length, pct: 100 });
      }
      await fetchAlbums();
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const deletePhoto = async (photoId: string) => {
    await fetch(`/api/photos/${photoId}`, { method: 'DELETE' });
    setAlbums(prev => prev.map(a =>
      a.id === activeId ? { ...a, photos: a.photos.filter(p => p.id !== photoId) } : a
    ));
    if (editing?.id === photoId) setEditing(null);
  };

  const savePhoto = (updated: DBPhoto) => {
    setAlbums(prev => prev.map(a =>
      a.id === activeId
        ? { ...a, photos: a.photos.map(p => p.id === updated.id ? updated : p) }
        : a
    ));
    setEditing(null);
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col">

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
          <div className="flex items-center gap-4">
            <button
              onClick={openStats}
              title="Stats for nerds"
              className="text-xl text-black/20 hover:text-black/60 transition-colors font-mono"
            >
              ∿
            </button>
            <Link href="/" className="text-[10px] uppercase tracking-widest text-black/35 hover:text-black transition-colors">← Back to Site</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full">

        {/* Albums grid */}
        {view === 'albums' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-sm uppercase tracking-[0.2em] font-light text-black">Albums</h1>
                <p className="text-[11px] text-black/35 font-light mt-0.5">
                  {albums.length} albums · {albums.reduce((n, a) => n + a.photos.length, 0)} frames
                </p>
              </div>
              <button
                onClick={() => setShowNew(v => !v)}
                className="text-[10px] uppercase tracking-widest border border-black/20 hover:border-black px-4 py-2 rounded text-black/50 hover:text-black transition-colors"
              >
                + New Album
              </button>
            </div>

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

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {albums.map(album => (
                <AlbumCard key={album.id} album={album} onClick={() => openAlbum(album.id)} onDelete={() => deleteAlbum(album.id)} />
              ))}
            </div>
          </>
        )}

        {/* Album detail */}
        {view === 'detail' && activeAlbum && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-sm uppercase tracking-[0.2em] font-light text-black">{activeAlbum.title}</h1>
                <p className="text-[11px] text-black/35 font-light mt-0.5">
                  {activeAlbum.description} · {activeAlbum.photos.length} frames
                </p>
              </div>
              {uploadProgress && (
                <div className="flex flex-col items-end gap-1 min-w-40">
                  <div className="flex justify-between w-full text-[10px] uppercase tracking-widest text-black/35 font-light">
                    <span>{uploadProgress.done + 1} of {uploadProgress.total}</span>
                    <span>{uploadProgress.pct}%</span>
                  </div>
                  <div className="w-full h-0.5 bg-black/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black rounded-full transition-all duration-150"
                      style={{ width: `${((uploadProgress.done / uploadProgress.total) * 100) + (uploadProgress.pct / uploadProgress.total)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <DropZone onFiles={addPhotos} />

            {activeAlbum.photos.length === 0 ? (
              <p className="text-center text-[11px] uppercase tracking-widest text-black/25 py-16">No photos yet — drop some above</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {activeAlbum.photos.map(photo => (
                  <PhotoCard key={photo.id} photo={photo} onEdit={() => setEditing(photo)} onDelete={() => deletePhoto(photo.id)} />
                ))}
              </div>
            )}
          </>
        )}

      </main>

      {editing && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setEditing(null)} />
          <EditPanel photo={editing} onSave={savePhoto} onClose={() => setEditing(null)} />
        </>
      )}

      {/* Stats for nerds */}
      {showStats && (
        <div className="fixed bottom-6 right-6 z-50 w-72 bg-black text-green-400 rounded-xl font-mono text-[11px] shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
            <span className="text-white/40 tracking-widest uppercase text-[10px]">stats for nerds</span>
            <button onClick={() => setShowStats(false)} className="text-white/30 hover:text-white transition-colors">×</button>
          </div>
          <div className="px-4 py-4 flex flex-col gap-2.5">
            {!stats ? (
              <span className="text-green-400/50 animate-pulse">loading...</span>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-white/30">albums</span>
                  <span>{stats.albums}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/30">photos</span>
                  <span>{stats.photos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/30">last upload</span>
                  <span>{stats.last_upload ? new Date(stats.last_upload).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/30">stack</span>
                  <span className="text-right text-[10px]">next · neon · s3</span>
                </div>
                <div className="mt-1 pt-2.5 border-t border-white/10">
                  <a
                    href="https://vercel.com/analytics"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400/60 hover:text-green-400 transition-colors"
                  >
                    → vercel analytics ↗
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
