import type { Motif } from './types';

// Chevron / zigzag field. The quarter is a stack of parallel diagonal bands
// (boundary lines y = x + c, evenly spaced 16 apart), drawn as exact-edge
// filled polygons rather than stroked centrelines — adjacent bands share a
// boundary edge exactly, so there is never a sub-pixel gap or overlap at the
// seam regardless of stroke-width math. Because the tile mirrors rather than
// rotates, the vertical mirror flips the slope to -1 at the seam, turning
// every stripe into a crisp V.
export const geometricChevron: Motif = {
  id: 'geometricChevron',
  name: 'Chevron Weave',
  family: 'geometric',
  zones: [
    { id: 'bg', label: 'Background', slot: 0 },
    { id: 'bandA', label: 'Band', slot: 1 },
    { id: 'bandB', label: 'Alt Band', slot: 2 },
    { id: 'bandC', label: 'Centre Band', slot: 3 },
  ],
  quarter: [
    { kind: 'rect', x: 0, y: 0, width: 50, height: 50, zone: 'bg' },
    // bandA: outermost pair (24 < c < 40)
    { kind: 'polygon', points: '0,24 26,50 10,50 0,40', zone: 'bandA' },
    { kind: 'polygon', points: '24,0 50,26 50,10 40,0', zone: 'bandA' },
    // bandB: next pair in (8 < c < 24)
    { kind: 'polygon', points: '0,8 42,50 26,50 0,24', zone: 'bandB' },
    { kind: 'polygon', points: '8,0 50,42 50,26 24,0', zone: 'bandB' },
    // bandC: centre hexagon straddling the diagonal (-8 < c < 8)
    { kind: 'polygon', points: '0,0 0,8 42,50 50,50 50,42 8,0', zone: 'bandC' },
  ],
  defaultColorway: 'bottleOchre',
};
