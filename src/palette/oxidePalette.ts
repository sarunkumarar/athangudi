import type { Slot } from '../motifs/types';

// ---------------------------------------------------------------------------
// Oxide palette.
//
// Real Athangudi tiles are coloured with natural oxide pigments mixed into
// cement — brick reds, bottle greens, cobalt/indigo, mustard/ochre, charcoal,
// and a cream base. Colours are flat and matte, moderately saturated: no neon,
// no pastel, no gradient. These swatches are what the zone picker offers.
// ---------------------------------------------------------------------------

export interface Swatch {
  name: string;
  hex: string;
}

export const OXIDE_SWATCHES: Swatch[] = [
  { name: 'Chettinad Cream', hex: '#F2E8D5' },
  { name: 'Bone Ivory', hex: '#EFE6D0' },
  { name: 'Sand', hex: '#E4D2A8' },
  { name: 'Chettinad Red', hex: '#A6371F' },
  { name: 'Deep Maroon', hex: '#7A2A1D' },
  { name: 'Terracotta', hex: '#C05A2E' },
  { name: 'Mustard', hex: '#D99A2B' },
  { name: 'Ochre', hex: '#C57B1E' },
  { name: 'Bottle Green', hex: '#1B4D3E' },
  { name: 'Peacock', hex: '#0E5A57' },
  { name: 'Olive', hex: '#5C6B2E' },
  { name: 'Cobalt Indigo', hex: '#21408B' },
  { name: 'Midnight Indigo', hex: '#2A3D66' },
  { name: 'Slate', hex: '#4A5859' },
  { name: 'Charcoal', hex: '#2B2B2B' },
];

/**
 * A curated 4-colour scheme. By convention:
 *   slot 0 = base/background (usually a cream)
 *   slot 1 = primary motif colour
 *   slot 2 = secondary colour
 *   slot 3 = accent / centre / outline
 * These are hand-picked so any Randomize result is coherent, never a clash.
 */
export interface Colorway {
  id: string;
  name: string;
  colors: [string, string, string, string];
}

export const COLORWAYS: Colorway[] = [
  {
    id: 'classic',
    name: 'Classic Chettinad',
    colors: ['#F2E8D5', '#A6371F', '#1B4D3E', '#2B2B2B'],
  },
  {
    id: 'indigoMustard',
    name: 'Indigo & Mustard',
    colors: ['#F2E8D5', '#21408B', '#D99A2B', '#7A2A1D'],
  },
  {
    id: 'bottleOchre',
    name: 'Bottle & Ochre',
    colors: ['#EFE6D0', '#1B4D3E', '#C57B1E', '#2B2B2B'],
  },
  {
    id: 'terracotta',
    name: 'Terracotta Court',
    colors: ['#F2E8D5', '#A6371F', '#C05A2E', '#1B4D3E'],
  },
  {
    id: 'peacock',
    name: 'Peacock Garden',
    colors: ['#EFE6D0', '#0E5A57', '#D99A2B', '#7A2A1D'],
  },
  {
    id: 'charcoalOchre',
    name: 'Charcoal & Ochre',
    colors: ['#F2E8D5', '#2B2B2B', '#C57B1E', '#A6371F'],
  },
];

export const COLORWAY_BY_ID: Record<string, Colorway> = Object.fromEntries(
  COLORWAYS.map((c) => [c.id, c]),
);

export function colorwayColor(cw: Colorway, slot: Slot): string {
  return cw.colors[slot];
}
