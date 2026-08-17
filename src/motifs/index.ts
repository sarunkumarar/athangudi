import type { Motif, TileState } from './types';
import { geometricStar } from './geometricStar';
import { geometricLattice } from './geometricLattice';
import { geometricChevron } from './geometricChevron';
import { geometricOctagon } from './geometricOctagon';
import { floralLotus } from './floralLotus';
import { floralVine } from './floralVine';
import { floralBloom } from './floralBloom';
import { floralRosette } from './floralRosette';
import { buildCustomMotif, DEFAULT_CUSTOM } from './custom';

export const CUSTOM_ID = 'custom';

// Registry of every built-in (non-custom) motif. Order = display order.
export const MOTIFS: Motif[] = [
  geometricStar,
  geometricLattice,
  geometricChevron,
  geometricOctagon,
  floralLotus,
  floralVine,
  floralBloom,
  floralRosette,
];

export const MOTIF_BY_ID: Record<string, Motif> = Object.fromEntries(
  MOTIFS.map((m) => [m.id, m]),
);

export function getMotif(id: string): Motif {
  return MOTIF_BY_ID[id] ?? MOTIFS[0];
}

/**
 * Resolve the full Motif for a design — either a registry motif, or a freshly
 * assembled custom quarter when motifId === 'custom'.
 */
export function resolveMotif(state: TileState): Motif {
  if (state.motifId === CUSTOM_ID) return buildCustomMotif(state.custom ?? DEFAULT_CUSTOM);
  return getMotif(state.motifId);
}

export type { Motif } from './types';
export { buildCustomMotif, DEFAULT_CUSTOM, CUSTOM_GROUPS } from './custom';
