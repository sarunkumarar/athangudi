import type { Motif } from './types';

// A rounded-petal rosette (a "daisy") — eight circular petals around a double
// centre, with a small diamond bud at each corner. The rounded petals set it
// apart from the pointed Lotus Bloom.
export const floralRosette: Motif = {
  id: 'floralRosette',
  name: 'Rosette',
  family: 'floral',
  zones: [
    { id: 'bg', label: 'Background', slot: 0 },
    { id: 'petal', label: 'Petal', slot: 1 },
    { id: 'disc', label: 'Centre Ring', slot: 2 },
    { id: 'core', label: 'Core', slot: 3 },
    { id: 'corner', label: 'Corner Bud', slot: 2 },
  ],
  quarter: [
    { kind: 'rect', x: 0, y: 0, width: 50, height: 50, zone: 'bg' },

    // Diagonal + edge petals (circles; the edge ones straddle the mirror seam).
    { kind: 'circle', cx: 24, cy: 24, r: 11, zone: 'petal' },
    { kind: 'circle', cx: 50, cy: 20, r: 10, zone: 'petal' },
    { kind: 'circle', cx: 20, cy: 50, r: 10, zone: 'petal' },

    // Double centre (drawn full at 50,50; overlaps identically in each quadrant).
    { kind: 'circle', cx: 50, cy: 50, r: 16, zone: 'disc' },
    { kind: 'circle', cx: 50, cy: 50, r: 8, zone: 'core' },

    // Corner bud.
    { kind: 'polygon', points: '0,0 12,0 0,12', zone: 'corner' },
  ],
  defaultColorway: 'peacock',
};
