import type { Motif } from './types';

// Octagon-and-square tiling — a staple Chettinad floor. A central octagon sits
// at the tile centre; quarter-squares at the tile corners meet across four
// tiles to form the small connecting squares between octagons.
export const geometricOctagon: Motif = {
  id: 'geometricOctagon',
  name: 'Octagon Court',
  family: 'geometric',
  zones: [
    { id: 'bg', label: 'Background', slot: 0 },
    { id: 'oct', label: 'Octagon', slot: 1 },
    { id: 'octIn', label: 'Octagon Heart', slot: 3 },
    { id: 'square', label: 'Corner Square', slot: 2 },
  ],
  quarter: [
    { kind: 'rect', x: 0, y: 0, width: 50, height: 50, zone: 'bg' },

    // Quarter of the central octagon (a chamfered square).
    { kind: 'polygon', points: '50,16 30,16 16,30 16,50 50,50', zone: 'oct' },
    // Heart accent.
    { kind: 'polygon', points: '50,34 50,50 34,50', zone: 'octIn' },

    // Corner square (a diamond centred on the tile corner) + inset.
    { kind: 'polygon', points: '0,0 18,0 0,18', zone: 'square' },
    { kind: 'polygon', points: '0,0 9,0 0,9', zone: 'octIn' },
  ],
  defaultColorway: 'indigoMustard',
};
