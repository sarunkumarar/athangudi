import type { Motif } from '../motifs/types';
import { TileSVG } from './TileSVG';
import { geometricStar } from '../motifs/geometricStar';
import { defaultColorsFor } from '../lib/tileRender';

interface AthangudiLogoProps {
  className?: string;
  /** Override the mark with a specific tile (e.g. the floor page's current
   *  pattern) instead of the default Star Medallion. */
  motif?: Motif;
  colors?: Record<string, string>;
}

const DEFAULT_COLORS = defaultColorsFor(geometricStar);

/**
 * The mark IS a tile: by default a small rendering of the Star Medallion
 * motif in its own classic colourway, mirrored the same way every tile in
 * the studio is — not an invented abstract shape. On the floor page it's
 * swapped for whichever tile is currently on screen, so the logo always
 * matches the pattern.
 */
export function AthangudiLogo({ className, motif, colors }: AthangudiLogoProps) {
  return (
    <span className={`block overflow-hidden rounded-md shadow-sm ring-1 ring-white/25 ${className ?? ''}`}>
      <TileSVG motif={motif ?? geometricStar} colors={colors ?? DEFAULT_COLORS} size="100%" />
    </span>
  );
}
