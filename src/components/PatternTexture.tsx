import { useMemo } from 'react';
import { geometricLattice } from '../motifs/geometricLattice';
import { motifInnerSvg, TILE_SIZE } from '../lib/tileRender';

interface PatternTextureProps {
  className?: string;
}

const UNIT = 34;

// The actual Diamond Lattice motif, silhouetted in white on a transparent
// field (background zone made transparent, every other zone white), spaced
// out at a small tile size. Because it's the real, bounded motif art — not a
// bare edge-to-edge outline — it reads as a delicate repeating texture
// instead of a continuous crosshatch/wire mesh.
const SILHOUETTE_COLORS: Record<string, string> = Object.fromEntries(
  geometricLattice.zones.map((z) => [z.id, z.id === 'bg' ? 'transparent' : '#FFFFFF']),
);
const MOTIF_SVG =
  `<svg xmlns="http://www.w3.org/2000/svg" width="${UNIT}" height="${UNIT}" viewBox="0 0 ${TILE_SIZE} ${TILE_SIZE}">` +
  motifInnerSvg(geometricLattice, SILHOUETTE_COLORS) +
  `</svg>`;

/**
 * Full-bleed, low-opacity repeating texture used behind the black
 * header/footer bars — the real Diamond Lattice motif in miniature, not an
 * ad hoc line pattern, so it never competes with the actual tile preview.
 */
export function PatternTexture({ className }: PatternTextureProps) {
  const url = useMemo(() => `data:image/svg+xml;utf8,${encodeURIComponent(MOTIF_SVG)}`, []);
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 opacity-[0.025] ${className ?? ''}`}
      style={{
        backgroundImage: `url("${url}")`,
        backgroundSize: `${UNIT}px ${UNIT}px`,
        backgroundRepeat: 'repeat',
      }}
    />
  );
}
