import type { Motif, ShapeDef, TileState } from '../motifs/types';
import { resolveMotif } from '../motifs';
import { COLORWAY_BY_ID, type Colorway } from '../palette/oxidePalette';

// The tile is a 100x100 square; each motif quarter lives in the top-left 50x50.
export const TILE_SIZE = 100;

/**
 * The four quadrant transforms. Identity, then mirror-horizontal,
 * mirror-vertical, mirror-both. NB: these are reflections, never rotations —
 * that is the authenticity mechanic.
 */
export const QUADRANTS: { id: string; transform: string }[] = [
  { id: 'tl', transform: 'translate(0,0)' },
  { id: 'tr', transform: 'translate(100,0) scale(-1,1)' },
  { id: 'bl', transform: 'translate(0,100) scale(1,-1)' },
  { id: 'br', transform: 'translate(100,100) scale(-1,-1)' },
];

/** Colour used when a zone has no assigned colour yet. */
const FALLBACK = '#F2E8D5';

export function colorFor(colors: Record<string, string>, zone: string): string {
  return colors[zone] ?? FALLBACK;
}

/** Build the default zone->colour map for a motif from a specific colorway. */
export function applyColorway(motif: Motif, cw: Colorway): Record<string, string> {
  const out: Record<string, string> = {};
  for (const zone of motif.zones) out[zone.id] = cw.colors[zone.slot];
  return out;
}

/** A motif shown in its own default colorway. */
export function defaultColorsFor(motif: Motif): Record<string, string> {
  const cw = COLORWAY_BY_ID[motif.defaultColorway];
  return applyColorway(motif, cw);
}

export function defaultTileState(motif: Motif): TileState {
  return { motifId: motif.id, colors: defaultColorsFor(motif) };
}

// ---------------------------------------------------------------------------
// SVG-string generation (used for export and for the raster pipeline). Kept as
// a pure string builder so it never touches the DOM.
// ---------------------------------------------------------------------------

function escapeAttr(v: string): string {
  return v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function shapeToString(shape: ShapeDef, colors: Record<string, string>, fillOverride?: string): string {
  const fill = escapeAttr(fillOverride ?? colorFor(colors, shape.zone));
  const strokeAttrs = (strokeZone?: string, w?: number) =>
    strokeZone
      ? ` stroke="${escapeAttr(colorFor(colors, strokeZone))}" stroke-width="${w ?? 1}" stroke-linejoin="round"`
      : '';
  switch (shape.kind) {
    case 'rect':
      return `<rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" fill="${fill}"${strokeAttrs(shape.strokeZone, shape.strokeWidth)}/>`;
    case 'circle':
      return `<circle cx="${shape.cx}" cy="${shape.cy}" r="${shape.r}" fill="${fill}"${strokeAttrs(shape.strokeZone, shape.strokeWidth)}/>`;
    case 'polygon':
      return `<polygon points="${escapeAttr(shape.points)}" fill="${fill}"${strokeAttrs(shape.strokeZone, shape.strokeWidth)}/>`;
    case 'path':
      return `<path d="${escapeAttr(shape.d)}" fill="${fill}"${strokeAttrs(shape.strokeZone, shape.strokeWidth)}/>`;
    case 'line':
      return `<path d="${escapeAttr(shape.d)}" fill="none" stroke="${fill}" stroke-width="${shape.strokeWidth}" stroke-linecap="${shape.cap ?? 'round'}" stroke-linejoin="round"/>`;
  }
}

/** Inner markup (the four mirrored quadrants) for a given motif, unwrapped. */
export function motifInnerSvg(
  motif: Motif,
  colors: Record<string, string>,
  paintOverrides?: Record<string, string>,
): string {
  return QUADRANTS.map(
    (q) =>
      `<g transform="${q.transform}">${motif.quarter
        .map((s, i) => shapeToString(s, colors, paintOverrides?.[`${q.id}-${i}`]))
        .join('')}</g>`,
  ).join('');
}

/** Inner markup (the four mirrored quadrants) for one tile, unwrapped. */
export function tileInnerSvg(state: TileState): string {
  return motifInnerSvg(resolveMotif(state), state.colors, state.paintOverrides);
}

/** A complete standalone <svg> string for a single tile. */
export function tileToSvgString(state: TileState, pxSize = TILE_SIZE): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${pxSize}" height="${pxSize}" ` +
    `viewBox="0 0 ${TILE_SIZE} ${TILE_SIZE}" shape-rendering="geometricPrecision">` +
    `${tileInnerSvg(state)}</svg>`
  );
}

/**
 * A wallpaper-sized <svg> string: the tile repeated to fill an arbitrary
 * width x height at a given tile pixel size (for desktop/mobile wallpapers).
 */
export function wallpaperToSvgString(
  state: TileState,
  width: number,
  height: number,
  tilePx: number,
): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<defs><pattern id="tile" width="${tilePx}" height="${tilePx}" patternUnits="userSpaceOnUse">` +
    `<g transform="scale(${tilePx / TILE_SIZE})">${tileInnerSvg(state)}</g>` +
    `</pattern></defs>` +
    `<rect width="${width}" height="${height}" fill="url(#tile)"/>` +
    `</svg>`
  );
}

/** A `data:` URL for one tile, usable as a repeating CSS background-image. */
export function tileDataUrl(state: TileState): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(tileToSvgString(state, TILE_SIZE))}`;
}
