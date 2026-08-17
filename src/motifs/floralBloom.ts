import type { Motif } from './types';

// A pointed-petal floret framed by a border strip — the classic "field + frame"
// layout of Athangudi flooring tiles. The border along the two outer edges of
// the quarter reflects into a continuous square frame around the whole tile.
export const floralBloom: Motif = {
  id: 'floralBloom',
  name: 'Framed Floret',
  family: 'floral',
  zones: [
    { id: 'bg', label: 'Background', slot: 0 },
    { id: 'frame', label: 'Border', slot: 2 },
    { id: 'petal', label: 'Petal', slot: 1 },
    { id: 'petalTip', label: 'Petal Heart', slot: 3 },
    { id: 'dot', label: 'Centre', slot: 3 },
  ],
  quarter: [
    { kind: 'rect', x: 0, y: 0, width: 50, height: 50, zone: 'bg' },

    // Border strip along the two outer edges (reflects into a full frame).
    { kind: 'rect', x: 0, y: 0, width: 50, height: 6, zone: 'frame' },
    { kind: 'rect', x: 0, y: 0, width: 6, height: 50, zone: 'frame' },
    { kind: 'circle', cx: 28, cy: 3, r: 1.7, zone: 'dot' },
    { kind: 'circle', cx: 3, cy: 28, r: 1.7, zone: 'dot' },

    // Diagonal pointed petal + heart.
    { kind: 'path', d: 'M50,50 Q34,38 16,16 Q38,34 50,50 Z', zone: 'petal' },
    { kind: 'path', d: 'M50,50 Q40,44 26,26 Q44,40 50,50 Z', zone: 'petalTip' },

    // Edge-facing half petals.
    { kind: 'path', d: 'M50,50 Q42,30 50,12 L50,50 Z', zone: 'petal' },
    { kind: 'path', d: 'M50,50 Q30,42 12,50 L50,50 Z', zone: 'petal' },

    // Centre.
    { kind: 'path', d: 'M50,43 A7,7 0 0 0 43,50 L50,50 Z', zone: 'dot' },
  ],
  defaultColorway: 'charcoalOchre',
};
