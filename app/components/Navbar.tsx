import Link from 'next/link';
import { Suspense } from 'react';
import NavbarFilter from './NavbarFilter';

export default function Navbar() {
  return (
    <nav className="w-full border-b border-black/10">
      <div className="w-full px-6 h-20 flex items-center justify-between">

        {/* Brand */}
        <Link href="/" className="flex items-baseline gap-1.5 group">
          <span className="text-black/30 text-lg font-extralight transition-colors group-hover:text-black/60">/</span>
          <span className="text-sm font-light tracking-[0.2em] uppercase text-black">
            Film X gc
          </span>
        </Link>

        {/* Right side: filter + about */}
        <div className="flex items-center gap-10">
          <Suspense>
            <NavbarFilter />
          </Suspense>

          <Link
            href="/about"
            className="flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-black/50 hover:text-black transition-colors group"
          >
            <span className="text-black/20 font-extralight group-hover:text-black/50 transition-colors">/</span>
            About
          </Link>
        </div>

      </div>
    </nav>
  );
}
