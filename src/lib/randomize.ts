import type { TileState } from '../motifs/types';
import { MOTIFS } from '../motifs';
import { COLORWAYS } from '../palette/oxidePalette';
import { applyColorway } from './tileRender';

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * A coherent random design: a random motif paired with a whole curated
 * colorway (never per-zone random hex, which muddies the result).
 */
export function randomTileState(): TileState {
  const motif = pick(MOTIFS);
  const cw = pick(COLORWAYS);
  return { motifId: motif.id, colors: applyColorway(motif, cw) };
}
