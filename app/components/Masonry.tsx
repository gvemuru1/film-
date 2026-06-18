'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

// ── hooks ──────────────────────────────────────────────────────────────────

function useColumns(): number {
  const [cols, setCols] = useState(1);

  useEffect(() => {
    const wide   = matchMedia('(min-width: 1100px)');
    const medium = matchMedia('(min-width: 650px)');

    const update = () => {
      if (wide.matches)   setCols(3);
      else if (medium.matches) setCols(2);
      else setCols(1);
    };

    update();
    wide.addEventListener('change', update);
    medium.addEventListener('change', update);
    return () => {
      wide.removeEventListener('change', update);
      medium.removeEventListener('change', update);
    };
  }, []);

  return cols;
}

function useWidth(ref: React.RefObject<HTMLDivElement | null>): number {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);

  return width;
}

// ── types ──────────────────────────────────────────────────────────────────

export interface MasonryItem {
  id: string;
  img: string;
  url: string;
  height: number;
  title: string;
  year?: string;
  director?: string;
  duration?: string;
  description?: string;
  genre?: string;
}

interface GridItem extends MasonryItem {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface MasonryProps {
  items: MasonryItem[];
  onItemClick?: (item: MasonryItem) => void;
  gap?: number;
  ease?: string;
  duration?: number;
  stagger?: number;
  hoverScale?: number;
  blurToFocus?: boolean;
}

// ── card ───────────────────────────────────────────────────────────────────

interface CardProps {
  item: GridItem;
  index: number;
  stagger: number;
  duration: number;
  ease: string;
  hoverScale: number;
  blurToFocus: boolean;
  onItemClick?: (item: MasonryItem) => void;
}

function Card({ item, index, stagger, duration, ease, hoverScale, blurToFocus, onItemClick }: CardProps) {
  const el      = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Entrance animation — runs once on mount only, never re-fires
  useEffect(() => {
    if (!el.current) return;
    gsap.fromTo(
      el.current,
      { opacity: 0, y: 40, ...(blurToFocus && { filter: 'blur(8px)' }) },
      {
        opacity: 1,
        y: 0,
        ...(blurToFocus && { filter: 'blur(0px)' }),
        duration,
        ease,
        delay: index * stagger,
      }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={el}
      className="absolute overflow-hidden rounded-xl cursor-pointer opacity-0 group"
      style={{ left: item.x, top: item.y, width: item.w, height: item.h }}
      onClick={() => onItemClick ? onItemClick(item) : window.open(item.url, '_blank', 'noopener')}
      onMouseEnter={() => gsap.to(el.current, { scale: hoverScale, duration: 0.3, ease: 'power2.out' })}
      onMouseLeave={() => gsap.to(el.current, { scale: 1,          duration: 0.3, ease: 'power2.out' })}
    >
      {/* Shimmer — shows until image loads */}
      {!loaded && <div className="shimmer absolute inset-0" />}

      <img
        src={item.img}
        alt={item.title}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Netflix-style title overlay — only on hover */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end px-3 pb-3">
        <span
          className="text-white text-xs font-medium leading-tight"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)' }}
        >
          {item.title}
        </span>
      </div>
    </div>
  );
}

// ── grid ───────────────────────────────────────────────────────────────────

function buildGrid(items: MasonryItem[], columns: number, width: number, gap: number): GridItem[] {
  if (!width) return [];
  const colHeights = new Array<number>(columns).fill(0);
  const colWidth   = (width - gap * (columns - 1)) / columns;

  return items.map(item => {
    const col = colHeights.indexOf(Math.min(...colHeights));
    const x   = col * (colWidth + gap);
    const y   = colHeights[col];
    colHeights[col] += item.height + gap;
    return { ...item, x, y, w: colWidth, h: item.height };
  });
}

// ── masonry ────────────────────────────────────────────────────────────────

export default function Masonry({
  items,
  onItemClick,
  gap       = 10,
  ease      = 'power3.out',
  duration  = 0.6,
  stagger   = 0.04,
  hoverScale  = 0.97,
  blurToFocus = true,
}: MasonryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const columns      = useColumns();
  const width        = useWidth(containerRef);

  const grid = useMemo(
    () => buildGrid(items, columns, width, gap),
    [items, columns, width, gap]
  );

  const totalHeight = useMemo(
    () => Math.max(0, ...grid.map(g => g.y + g.h)),
    [grid]
  );

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: totalHeight }}>
      {grid.map((item, index) => (
        <Card
          key={item.id}
          item={item}
          index={index}
          stagger={stagger}
          duration={duration}
          ease={ease}
          hoverScale={hoverScale}
          blurToFocus={blurToFocus}
          onItemClick={onItemClick}
        />
      ))}
    </div>
  );
}
