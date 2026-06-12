'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { STOCKS } from '../lib/films';

export default function NavbarFilter() {
  const router   = useRouter();
  const pathname = usePathname();
  const params   = useSearchParams();
  const stock    = params.get('stock') ?? '';

  const handleChange = (value: string) => {
    const target = pathname === '/' ? '/' : '/';
    router.push(value ? `${target}?stock=${encodeURIComponent(value)}` : target);
  };

  return (
    <div className="relative flex items-center gap-1.5">
      <span className="text-black/25 font-extralight text-sm">/</span>
      <select
        value={stock}
        onChange={e => handleChange(e.target.value)}
        className="appearance-none bg-transparent text-[11px] uppercase tracking-[0.18em] text-black/50 hover:text-black pr-4 pl-0 py-1 cursor-pointer focus:outline-none transition-colors"
      >
        <option value="">All Film</option>
        {STOCKS.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <span className="pointer-events-none text-black/25 text-[10px] -ml-3">▾</span>
    </div>
  );
}
