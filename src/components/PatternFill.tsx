import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import type { TileState } from '../motifs/types';
import { tileDataUrl } from '../lib/tileRender';

interface PatternFillProps {
  state: TileState;
  /** Pixel size of one repeated tile. */
  tilePx: number;
  className?: string;
  style?: CSSProperties;
  /** Overlay a very faint grout line at each tile edge. */
  grout?: boolean;
  /**
   * 'center' crops symmetrically at the container edge (fine for a swatch
   * that isn't a whole number of tiles). 'top-left' aligns the very first
   * tile to the container's own top-left corner — use this when the caller
   * has already sized the container to an exact multiple of tilePx, so grout
   * lines land exactly on the container's edges with no partial tile.
   */
  align?: 'center' | 'top-left';
}

/**
 * Fills its box completely with the seamless tile as a repeating CSS
 * background-image. Unlike a fixed tile grid, this always fills the container
 * edge-to-edge at any size (used for the floor preview and wallpaper previews).
 * Background-repeat always draws whole tile images — cropping only happens at
 * the container edge, exactly like a photo of real flooring — so no tile is
 * ever rendered as a distorted partial shape.
 */
export function PatternFill({ state, tilePx, className, style, grout, align = 'center' }: PatternFillProps) {
  const url = useMemo(() => tileDataUrl(state), [state]);
  const backgroundPosition = align === 'top-left' ? '0 0' : 'center';
  return (
    <div className={`relative overflow-hidden ${className ?? ''}`} style={style}>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${url}")`,
          backgroundSize: `${tilePx}px ${tilePx}px`,
          backgroundRepeat: 'repeat',
          backgroundPosition,
        }}
      />
      {grout && (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              `repeating-linear-gradient(to right, rgba(64,48,38,0.16) 0, rgba(64,48,38,0.16) 1px, transparent 1px, transparent ${tilePx}px),` +
              `repeating-linear-gradient(to bottom, rgba(64,48,38,0.16) 0, rgba(64,48,38,0.16) 1px, transparent 1px, transparent ${tilePx}px)`,
            backgroundPosition,
          }}
        />
      )}
    </div>
  );
}
