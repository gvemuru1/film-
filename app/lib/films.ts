import type { MasonryItem } from '../components/Masonry';

export interface Album {
  id: string;
  title: string;
  description: string;
  films: MasonryItem[];
}

const HEIGHTS     = [320, 360, 300, 380, 280, 350, 340, 300, 370, 310];
const STOCKS      = ['Kodak Gold 200', 'CineStill 200'];

const TITLES = [
  'Grain & Light', 'Empty Streets', 'Silver Gelatin', 'The Golden Hour', 'Expired',
  'Roll 01', 'Underexposed', 'Contact Sheet', 'Slow Film', 'Between Frames',
  'Double Exposure', 'The Darkroom', 'Latitude', 'Shadow Detail', 'Push +2',
  'Tungsten', 'Reciprocity', 'Fixed Focus', 'Burned In', 'The Negative',
  'Wide Open', 'f / 1.4', 'Zone V', 'Sunny 16', 'Manual',
  'The Print', 'Fixer', 'Stop Bath', 'Developer', 'Enlarger',
  'Shutter', 'Advance', 'Rewind', 'Leader', 'Sprocket', 'Frame',
];

const DESCRIPTIONS = [
  'A series shot across three winters on expired stock. The drift in colour became part of the work — unpredictable, irreversible, honest.',
  'Thirty-six frames from a single roll, never rewound. The city at 4 a.m. moves differently. One chance per frame.',
  'Portraits made in natural north light. No reflectors, no fill. The shadows are the point.',
  'A study in reciprocity failure. The longer the exposure, the more the film departs from what the eye sees.',
  'Street work from six months abroad. Shot at box speed, processed in Rodinal 1:50. Grain like sand.',
];

const makeFilms = (albumIndex: number, idOffset: number): MasonryItem[] =>
  Array.from({ length: 36 }, (_, i) => ({
    id: `${albumIndex}-${i}`,
    img: `https://picsum.photos/id/${idOffset + i}/1920/1005`,
    url: '#',
    height: HEIGHTS[i % HEIGHTS.length],
    title: TITLES[i % TITLES.length],
    year: String(2019 + albumIndex),
    duration: STOCKS[i % STOCKS.length],
    description: DESCRIPTIONS[i % DESCRIPTIONS.length],
  }));

export const albums: Album[] = [
  {
    id: 'roll-001',
    title: 'Roll 001',
    description: 'Street work — winter light, empty hours',
    films: makeFilms(0, 10),
  },
  {
    id: 'roll-002',
    title: 'Roll 002',
    description: 'Coastal series — salt air, long exposures',
    films: makeFilms(1, 46),
  },
  {
    id: 'roll-003',
    title: 'Roll 003',
    description: 'Urban geometry — shadow, grain, and glass',
    films: makeFilms(2, 82),
  },
];

export { STOCKS };

// flat list for backward compat
export const films: MasonryItem[] = albums.flatMap(a => a.films);
