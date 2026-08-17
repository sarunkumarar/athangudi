import type { CustomConfig, Motif, ShapeDef, ZoneDef } from './types';

// ---------------------------------------------------------------------------
// Custom-tile composer.
//
// Because the tile is symmetrical, "designing your own" is restricted to
// assembling ONE quarter from a small library of *traditional* elements — a
// centre medallion, a corner ornament, an edge ornament and a border. Every
// option below is lifted from the same vocabulary as the built-in motifs, so a
// custom tile always stays within the Athangudi idiom.
// ---------------------------------------------------------------------------

export interface ElementOption {
  id: string;
  label: string;
  /** Zones this element contributes (merged, de-duped, into the final motif). */
  zones: ZoneDef[];
  shapes: ShapeDef[];
}

export interface ElementGroup {
  key: keyof CustomConfig;
  label: string;
  options: ElementOption[];
}

const NONE = (label = 'None'): ElementOption => ({
  id: 'none',
  label,
  zones: [],
  shapes: [],
});

// ---- Centre medallions (built around the tile centre, 50,50) ---------------
const CENTERS: ElementOption[] = [
  {
    id: 'star',
    label: 'Star',
    zones: [
      { id: 'ctr', label: 'Centre', slot: 1 },
      { id: 'ctrIn', label: 'Centre Heart', slot: 3 },
    ],
    shapes: [
      { kind: 'rect', x: 20, y: 20, width: 30, height: 30, zone: 'ctr' },
      { kind: 'polygon', points: '50,6 50,50 6,50', zone: 'ctr' },
      { kind: 'polygon', points: '50,34 50,50 34,50', zone: 'ctrIn' },
      { kind: 'rect', x: 39, y: 39, width: 11, height: 11, zone: 'ctrIn' },
    ],
  },
  {
    id: 'lotus',
    label: 'Lotus',
    zones: [
      { id: 'ctr', label: 'Petals', slot: 1 },
      { id: 'ctrIn', label: 'Petal Vein', slot: 3 },
      { id: 'ctrDot', label: 'Centre', slot: 2 },
    ],
    shapes: [
      { kind: 'path', d: 'M50,50 Q26,34 12,12 Q34,26 50,50 Z', zone: 'ctr' },
      { kind: 'path', d: 'M50,50 Q34,40 22,22 Q40,34 50,50 Z', zone: 'ctrIn' },
      { kind: 'path', d: 'M50,50 Q40,28 50,8 L50,50 Z', zone: 'ctr' },
      { kind: 'path', d: 'M50,50 Q28,40 8,50 L50,50 Z', zone: 'ctr' },
      { kind: 'path', d: 'M50,37 A13,13 0 0 0 37,50 L50,50 Z', zone: 'ctrDot' },
    ],
  },
  {
    id: 'rosette',
    label: 'Rosette',
    zones: [
      { id: 'ctr', label: 'Petals', slot: 1 },
      { id: 'ctrDot', label: 'Centre', slot: 2 },
      { id: 'ctrIn', label: 'Core', slot: 3 },
    ],
    shapes: [
      { kind: 'circle', cx: 26, cy: 26, r: 10, zone: 'ctr' },
      { kind: 'circle', cx: 50, cy: 24, r: 9, zone: 'ctr' },
      { kind: 'circle', cx: 24, cy: 50, r: 9, zone: 'ctr' },
      { kind: 'circle', cx: 50, cy: 50, r: 14, zone: 'ctrDot' },
      { kind: 'circle', cx: 50, cy: 50, r: 7, zone: 'ctrIn' },
    ],
  },
  {
    id: 'diamonds',
    label: 'Diamonds',
    zones: [
      { id: 'ctr', label: 'Diamond', slot: 1 },
      { id: 'ctrIn', label: 'Inner Diamond', slot: 3 },
      { id: 'ctrDot', label: 'Centre', slot: 2 },
    ],
    shapes: [
      { kind: 'polygon', points: '50,10 50,50 10,50', zone: 'ctr' },
      { kind: 'polygon', points: '50,22 50,50 22,50', zone: 'ctrIn' },
      { kind: 'polygon', points: '50,34 50,50 34,50', zone: 'ctrDot' },
    ],
  },
  NONE('Empty'),
];

// ---- Corner ornaments (built around the tile corner, 0,0) ------------------
const CORNERS: ElementOption[] = [
  {
    id: 'diamond',
    label: 'Diamond',
    zones: [
      { id: 'cor', label: 'Corner', slot: 2 },
      { id: 'corIn', label: 'Corner Heart', slot: 3 },
    ],
    shapes: [
      { kind: 'polygon', points: '0,0 24,0 0,24', zone: 'cor' },
      { kind: 'polygon', points: '0,0 12,0 0,12', zone: 'corIn' },
    ],
  },
  {
    id: 'fan',
    label: 'Fan',
    zones: [
      { id: 'cor', label: 'Corner', slot: 2 },
      { id: 'corIn', label: 'Corner Heart', slot: 3 },
    ],
    shapes: [
      { kind: 'path', d: 'M20,0 A20,20 0 0 1 0,20 L0,0 Z', zone: 'cor' },
      { kind: 'path', d: 'M11,0 A11,11 0 0 1 0,11 L0,0 Z', zone: 'corIn' },
    ],
  },
  {
    id: 'bud',
    label: 'Bud',
    zones: [{ id: 'cor', label: 'Corner Bud', slot: 2 }],
    shapes: [{ kind: 'circle', cx: 0, cy: 0, r: 10, zone: 'cor' }],
  },
  NONE('Empty'),
];

// ---- Edge ornaments (at the edge mid-points, seams at 50,0 and 0,50) -------
const EDGES: ElementOption[] = [
  {
    id: 'diamond',
    label: 'Diamond',
    zones: [{ id: 'edg', label: 'Edge', slot: 3 }],
    shapes: [
      { kind: 'polygon', points: '30,0 50,0 50,20', zone: 'edg' },
      { kind: 'polygon', points: '0,30 0,50 20,50', zone: 'edg' },
    ],
  },
  {
    id: 'dot',
    label: 'Dot',
    zones: [{ id: 'edg', label: 'Edge', slot: 3 }],
    shapes: [
      { kind: 'circle', cx: 50, cy: 0, r: 7, zone: 'edg' },
      { kind: 'circle', cx: 0, cy: 50, r: 7, zone: 'edg' },
    ],
  },
  NONE('Empty'),
];

// ---- Borders (strip along the two outer edges of the quarter) --------------
const BORDERS: ElementOption[] = [
  {
    id: 'solid',
    label: 'Solid',
    zones: [{ id: 'bord', label: 'Border', slot: 2 }],
    shapes: [
      { kind: 'rect', x: 0, y: 0, width: 50, height: 6, zone: 'bord' },
      { kind: 'rect', x: 0, y: 0, width: 6, height: 50, zone: 'bord' },
    ],
  },
  {
    id: 'dotted',
    label: 'Dotted',
    zones: [
      { id: 'bord', label: 'Border', slot: 2 },
      { id: 'bordDot', label: 'Border Dot', slot: 3 },
    ],
    shapes: [
      { kind: 'rect', x: 0, y: 0, width: 50, height: 4, zone: 'bord' },
      { kind: 'rect', x: 0, y: 0, width: 4, height: 50, zone: 'bord' },
      { kind: 'circle', cx: 28, cy: 2, r: 1.7, zone: 'bordDot' },
      { kind: 'circle', cx: 2, cy: 28, r: 1.7, zone: 'bordDot' },
    ],
  },
  NONE('None'),
];

export const CUSTOM_GROUPS: ElementGroup[] = [
  { key: 'center', label: 'Centre', options: CENTERS },
  { key: 'corner', label: 'Corner', options: CORNERS },
  { key: 'edge', label: 'Edge', options: EDGES },
  { key: 'border', label: 'Border', options: BORDERS },
];

export const DEFAULT_CUSTOM: CustomConfig = {
  center: 'star',
  corner: 'diamond',
  edge: 'diamond',
  border: 'solid',
};

function optionFor(group: ElementGroup, id: string): ElementOption {
  return group.options.find((o) => o.id === id) ?? group.options[0];
}

/** Assemble a full Motif from a custom config. */
export function buildCustomMotif(config: CustomConfig): Motif {
  const bgZone: ZoneDef = { id: 'bg', label: 'Background', slot: 0 };
  const zones: ZoneDef[] = [bgZone];
  const seen = new Set<string>(['bg']);
  // Paint order: background, then border, edge, corner, centre (centre on top).
  const order: (keyof CustomConfig)[] = ['border', 'edge', 'corner', 'center'];
  const shapes: ShapeDef[] = [{ kind: 'rect', x: 0, y: 0, width: 50, height: 50, zone: 'bg' }];

  for (const key of order) {
    const group = CUSTOM_GROUPS.find((g) => g.key === key)!;
    const opt = optionFor(group, config[key]);
    for (const z of opt.zones) {
      if (!seen.has(z.id)) {
        seen.add(z.id);
        zones.push(z);
      }
    }
    shapes.push(...opt.shapes);
  }

  return {
    id: 'custom',
    name: 'Custom',
    family: 'geometric',
    zones,
    quarter: shapes,
    defaultColorway: 'classic',
  };
}
