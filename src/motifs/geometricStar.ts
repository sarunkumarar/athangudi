import type { Motif } from './types';

// 8-point star medallion at the tile centre (50,50) with a diamond at each
// tile corner (0,0). Built from an axis-aligned square + a 45° diamond sharing
// the centre — their union reads as an eight-pointed "star of Lakshmi".
export const geometricStar: Motif = {
  id: 'geometricStar',
  name: 'Star Medallion',
  family: 'geometric',
  zones: [
    { id: 'bg', label: 'Background', slot: 0 },
    { id: 'star', label: 'Star', slot: 1 },
    { id: 'corner', label: 'Corner Diamond', slot: 2 },
    { id: 'center', label: 'Centre', slot: 3 },
  ],
  quarter: [
    { kind: 'rect', x: 0, y: 0, width: 50, height: 50, zone: 'bg' },

    // Corner diamond (centred on the tile corner 0,0).
    { kind: 'polygon', points: '0,0 24,0 0,24', zone: 'corner' },
    { kind: 'polygon', points: '0,0 12,0 0,12', zone: 'center' },

    // Star arm — square quarter reaching into the centre corner...
    { kind: 'rect', x: 20, y: 20, width: 30, height: 30, zone: 'star' },
    // ...plus the 45° diamond quarter, together forming the 8-point star.
    { kind: 'polygon', points: '50,6 50,50 6,50', zone: 'star' },

    // Centre accent (a small nested diamond + square).
    { kind: 'polygon', points: '50,34 50,50 34,50', zone: 'center' },
    { kind: 'rect', x: 39, y: 39, width: 11, height: 11, zone: 'center' },
  ],
  defaultColorway: 'classic',
};
