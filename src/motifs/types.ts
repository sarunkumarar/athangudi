// ---------------------------------------------------------------------------
// Athangudi tile geometry model.
//
// Authenticity rule: a real tile's motif is ONE quarter-design reflected across
// both the vertical and horizontal centre lines (mirror, never rotate-only).
// So every motif here defines shapes for a single 50x50 quadrant (the top-left
// quadrant of a 100x100 tile). `TileSVG` mirrors that quarter into the other
// three quadrants. The full tile centre is therefore the (50,50) corner of the
// quadrant; the tile's outer corner is (0,0).
// ---------------------------------------------------------------------------

/** Colour slot index into a 4-colour Colorway. */
export type Slot = 0 | 1 | 2 | 3;

/** A named recolourable region of a tile. */
export interface ZoneDef {
  /** Stable id used as the key in a TileState colour map. */
  id: string;
  /** Human label shown in the editor. */
  label: string;
  /** Which colorway slot this zone defaults to when a colorway is applied. */
  slot: Slot;
}

/**
 * A drawable primitive inside the 50x50 quadrant. `zone` names the fill region;
 * an optional `strokeZone` draws a crisp stencil outline using another zone's
 * colour (that flat, grout-like line is characteristic of the real tiles).
 */
export type ShapeDef =
  | { kind: 'rect'; x: number; y: number; width: number; height: number; zone: string; strokeZone?: string; strokeWidth?: number }
  | { kind: 'circle'; cx: number; cy: number; r: number; zone: string; strokeZone?: string; strokeWidth?: number }
  | { kind: 'path'; d: string; zone: string; strokeZone?: string; strokeWidth?: number }
  | { kind: 'polygon'; points: string; zone: string; strokeZone?: string; strokeWidth?: number }
  // A stroked line/curve (fill:none). `zone` is used as the stroke colour.
  // `cap` defaults to 'round' (nice for a curling vine stem); segments meant
  // to butt exactly against their mirrored counterpart (e.g. a chevron band
  // ending precisely on the mirror seam) should use 'butt', since a round
  // cap's semicircular bulge doesn't line up with the mirrored copy and
  // leaves a visible notch at the seam.
  | { kind: 'line'; d: string; zone: string; strokeWidth: number; cap?: 'round' | 'butt' | 'square' };

export type MotifFamily = 'geometric' | 'floral';

export interface Motif {
  id: string;
  name: string;
  family: MotifFamily;
  /** Ordered zones. Convention: the first zone is the tile base/background. */
  zones: ZoneDef[];
  /** Shapes for the top-left quadrant only (coords in 0..50). */
  quarter: ShapeDef[];
  /** Default colorway id (see palette/oxidePalette). */
  defaultColorway: string;
}

/**
 * A user-composed "custom" tile. Because the tile is symmetrical, the user only
 * assembles ONE quarter from a restricted library of traditional elements — a
 * centre medallion, corner ornament, edge ornament and border. Each field is an
 * element id from src/motifs/custom.ts.
 */
export interface CustomConfig {
  center: string;
  corner: string;
  edge: string;
  border: string;
}

/** Serializable tile design — the single source of truth passed everywhere. */
export interface TileState {
  motifId: string;
  /** zoneId -> hex colour (e.g. "#A6371F"). */
  colors: Record<string, string>;
  /** Present only when motifId === 'custom'. */
  custom?: CustomConfig;
  /**
   * Per-shape-instance colour overrides painted with the paint bucket tool
   * while symmetry is off, breaking a single shape away from its zone's
   * shared colour. Keyed by `${quadrantId}-${shapeIndex}` (matching
   * `TileSVG`'s own per-shape key), so it addresses one exact rendered
   * shape rather than a whole zone.
   */
  paintOverrides?: Record<string, string>;
}
