import { memo } from 'react';
import type { Motif, ShapeDef } from '../motifs/types';
import { getMotif } from '../motifs';
import { QUADRANTS, TILE_SIZE, colorFor } from '../lib/tileRender';

interface TileSVGProps {
  /** Either pass a resolved motif object, or a registry motifId. */
  motif?: Motif;
  motifId?: string;
  colors: Record<string, string>;
  /** Render pixel size; the tile is always a square. */
  size?: number | string;
  /** When set, zones are clickable and this fires with the zone id (Zones tab). */
  onZoneClick?: (zoneId: string) => void;
  /**
   * When set, individual shapes are clickable for the paint bucket tool
   * instead of whole zones. Fires with the shape's own instance key
   * (`${quadrantId}-${shapeIndex}`) and its zone id.
   */
  onShapePaint?: (shapeKey: string, zoneId: string) => void;
  /**
   * Per-shape-instance colour overrides (paint bucket, symmetry off).
   * Takes priority over the shape's zone colour when present.
   */
  paintOverrides?: Record<string, string>;
  /** Zone currently being edited — gets a subtle highlight ring. */
  activeZone?: string;
  /**
   * Show the same faint shape-boundary outline on every shape rather than
   * only the active zone's — used by the paint bucket tool, which has no
   * single "active zone" but still benefits from seeing each shape's edges.
   */
  outlineAllShapes?: boolean;
  /**
   * While interactive, replace the pointer cursor with a small filled circle
   * of this colour, so the cursor previews what will be dropped on click
   * (the paint bucket tool).
   */
  cursorColor?: string;
  className?: string;
  title?: string;
  /**
   * When set, every shape renders as fill:none + this stroke colour instead
   * of its normal zone fill — a line-art silhouette rather than a coloured
   * preset (used for the Custom motif's "build your own" thumbnail).
   */
  outlineColor?: string;
}

function colorCursor(color: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22'><circle cx='11' cy='11' r='8' fill='${color}' stroke='white' stroke-width='2'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 11 11, pointer`;
}

function shapeElement(
  shape: ShapeDef,
  key: string,
  fill: string,
  strokeProps: Record<string, unknown>,
  onClick: (() => void) | undefined,
  interactive: boolean,
  isActive: boolean,
  cursor: string | undefined,
) {
  const common = {
    onClick,
    style: interactive ? { cursor: cursor ?? ('pointer' as const) } : undefined,
    // A faint outline on the active zone so users see what they're editing.
    ...(isActive ? { stroke: '#00000055', strokeWidth: 1.2, vectorEffect: 'non-scaling-stroke' as const } : {}),
  };

  switch (shape.kind) {
    case 'rect':
      return <rect key={key} x={shape.x} y={shape.y} width={shape.width} height={shape.height} fill={fill} {...strokeProps} {...common} />;
    case 'circle':
      return <circle key={key} cx={shape.cx} cy={shape.cy} r={shape.r} fill={fill} {...strokeProps} {...common} />;
    case 'polygon':
      return <polygon key={key} points={shape.points} fill={fill} {...strokeProps} {...common} />;
    case 'path':
      return <path key={key} d={shape.d} fill={fill} {...strokeProps} {...common} />;
    case 'line':
      return (
        <path
          key={key}
          d={shape.d}
          fill="none"
          stroke={strokeProps.stroke as string}
          strokeWidth={shape.strokeWidth}
          strokeLinecap={shape.cap ?? 'round'}
          strokeLinejoin="round"
          {...common}
        />
      );
  }
}

/**
 * Renders ONE tile: the motif's quarter reflected into all four quadrants.
 * Pure function of (motifId, colors) — no DOM measurement — so it can later be
 * rasterised for the Phase-2 floor visualizer without changes.
 */
function TileSVGImpl({
  motif: motifProp,
  motifId,
  colors,
  size = '100%',
  onZoneClick,
  onShapePaint,
  paintOverrides,
  activeZone,
  outlineAllShapes,
  cursorColor,
  className,
  title,
  outlineColor,
}: TileSVGProps) {
  const motif: Motif = motifProp ?? getMotif(motifId ?? '');
  const interactive = Boolean(onZoneClick || onShapePaint);
  const cursor = cursorColor ? colorCursor(cursorColor) : undefined;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${TILE_SIZE} ${TILE_SIZE}`}
      className={className}
      shapeRendering="geometricPrecision"
      role="img"
      aria-label={title ?? motif.name}
    >
      {title ? <title>{title}</title> : null}
      {QUADRANTS.map((q) => (
        <g key={q.id} transform={q.transform}>
          {motif.quarter.map((shape, i) => {
            const key = `${q.id}-${i}`;
            const resolved = paintOverrides?.[key] ?? colorFor(colors, shape.zone);
            const isActive = outlineAllShapes || (Boolean(onZoneClick) && activeZone === shape.zone);

            let fill: string;
            let strokeProps: Record<string, unknown> = {};
            if (outlineColor) {
              fill = 'none';
              strokeProps = { stroke: outlineColor, strokeWidth: 1.5, strokeLinejoin: 'round' };
            } else if (shape.kind === 'line') {
              fill = 'none';
              strokeProps = { stroke: resolved };
            } else {
              fill = resolved;
              if (shape.strokeZone) {
                strokeProps = { stroke: colorFor(colors, shape.strokeZone), strokeWidth: shape.strokeWidth ?? 1, strokeLinejoin: 'round' };
              }
            }

            const onClick = onShapePaint
              ? () => onShapePaint(key, shape.zone)
              : onZoneClick
                ? () => onZoneClick(shape.zone)
                : undefined;

            return shapeElement(shape, key, fill, strokeProps, onClick, interactive, isActive, cursor);
          })}
        </g>
      ))}
    </svg>
  );
}

export const TileSVG = memo(TileSVGImpl);
