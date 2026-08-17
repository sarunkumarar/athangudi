import type { Motif } from './types';

// A vine curling out of the centre toward each corner, with leaves and a bud.
// Mirroring produces four symmetric curls — note the curl direction reflects
// (it does not spin), which is what keeps the growth reading natural.
export const floralVine: Motif = {
  id: 'floralVine',
  name: 'Curling Vine',
  family: 'floral',
  zones: [
    { id: 'bg', label: 'Background', slot: 0 },
    { id: 'vine', label: 'Vine', slot: 2 },
    { id: 'leaf', label: 'Leaf', slot: 1 },
    { id: 'bud', label: 'Bud', slot: 3 },
    { id: 'center', label: 'Centre', slot: 3 },
  ],
  quarter: [
    { kind: 'rect', x: 0, y: 0, width: 50, height: 50, zone: 'bg' },

    // Centre rosette.
    { kind: 'path', d: 'M50,40 A10,10 0 0 0 40,50 L50,50 Z', zone: 'center' },

    // Meandering stem from centre to corner.
    {
      kind: 'line',
      d: 'M50,50 C40,44 34,50 30,42 C26,34 32,28 24,24 C18,20 22,14 14,12',
      zone: 'vine',
      strokeWidth: 3,
    },

    // Leaves budding off the stem.
    { kind: 'path', d: 'M30,42 Q22,44 22,36 Q28,38 30,42 Z', zone: 'leaf' },
    { kind: 'path', d: 'M24,24 Q16,26 16,18 Q22,20 24,24 Z', zone: 'leaf' },

    // Tip bud.
    { kind: 'circle', cx: 13.5, cy: 11.5, r: 5, zone: 'bud' },
  ],
  defaultColorway: 'peacock',
};
