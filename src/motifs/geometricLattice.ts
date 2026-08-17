import type { Motif } from './types';

// Interlocking diamond lattice. Diamonds sit at the centre, the corner and the
// four edge-midpoints; when the quarter is mirrored they meet edge-to-edge into
// a continuous woven grid of alternating colours.
export const geometricLattice: Motif = {
  id: 'geometricLattice',
  name: 'Diamond Lattice',
  family: 'geometric',
  zones: [
    { id: 'bg', label: 'Background', slot: 0 },
    { id: 'diamondA', label: 'Centre Diamond', slot: 1 },
    { id: 'diamondB', label: 'Corner Diamond', slot: 2 },
    { id: 'diamondC', label: 'Edge Diamond', slot: 3 },
  ],
  quarter: [
    { kind: 'rect', x: 0, y: 0, width: 50, height: 50, zone: 'bg' },

    // Centre diamond (quarter of it), with a nested accent.
    { kind: 'polygon', points: '50,18 50,50 18,50', zone: 'diamondA' },
    { kind: 'polygon', points: '50,30 50,50 30,50', zone: 'diamondC' },

    // Corner diamond (quarter, centred on 0,0).
    { kind: 'polygon', points: '0,0 30,0 0,30', zone: 'diamondB' },
    { kind: 'polygon', points: '0,0 16,0 0,16', zone: 'bg' },

    // Edge-midpoint half-diamonds (top edge 50,0 and left edge 0,50).
    { kind: 'polygon', points: '30,0 50,0 50,20', zone: 'diamondC' },
    { kind: 'polygon', points: '0,30 0,50 20,50', zone: 'diamondC' },

    // Thin connecting struts, giving the "woven" read.
    { kind: 'line', d: 'M0,0 L50,50', zone: 'diamondB', strokeWidth: 2.5 },
  ],
  defaultColorway: 'indigoMustard',
};
