import type { Motif } from './types';

// Stylised eight-petal lotus radiating from the tile centre (50,50). The
// quarter holds one diagonal petal plus two half-petals along the mirror seams;
// reflection completes the 8-petal bloom. Petals point OUTWARD symmetrically —
// the reason mirroring (not rotation) is required.
export const floralLotus: Motif = {
  id: 'floralLotus',
  name: 'Lotus Bloom',
  family: 'floral',
  zones: [
    { id: 'bg', label: 'Background', slot: 0 },
    { id: 'petal', label: 'Petal', slot: 1 },
    { id: 'petalInner', label: 'Petal Vein', slot: 3 },
    { id: 'center', label: 'Centre', slot: 2 },
    { id: 'accent', label: 'Accent Dot', slot: 3 },
  ],
  quarter: [
    { kind: 'rect', x: 0, y: 0, width: 50, height: 50, zone: 'bg' },

    // Diagonal (corner-facing) petal + its inner vein.
    { kind: 'path', d: 'M50,50 Q26,34 12,12 Q34,26 50,50 Z', zone: 'petal' },
    { kind: 'path', d: 'M50,50 Q34,40 22,22 Q40,34 50,50 Z', zone: 'petalInner' },

    // Half-petals along the two mirror seams (become the edge-facing petals).
    { kind: 'path', d: 'M50,50 Q40,28 50,8 L50,50 Z', zone: 'petal' },
    { kind: 'path', d: 'M50,50 Q28,40 8,50 L50,50 Z', zone: 'petal' },

    // Centre disc + dot.
    { kind: 'path', d: 'M50,37 A13,13 0 0 0 37,50 L50,50 Z', zone: 'center' },
    { kind: 'path', d: 'M50,44 A6,6 0 0 0 44,50 L50,50 Z', zone: 'accent' },

    // Corner rosette dot (draws as a quarter at the tile corner).
    { kind: 'circle', cx: 0, cy: 0, r: 4.5, zone: 'accent' },
  ],
  defaultColorway: 'terracotta',
};
