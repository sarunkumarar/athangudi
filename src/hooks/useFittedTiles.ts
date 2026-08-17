import { useContainerSize } from './useContainerSize';

export interface FittedTiles {
  ref: ReturnType<typeof useContainerSize>['ref'];
  /** Pixel size of one tile so a whole tile always lands at the left, top and right edges. */
  tilePx: number;
}

/**
 * Fits an exact `tilesAcross`-wide row of square tiles into a measured
 * container. A "row" of tiles is a horizontal line — tilePx = width /
 * tilesAcross, plain division — so the count the user sets is *always*
 * exactly how many tiles span the container's width, on any screen size or
 * aspect ratio; there is no rounding step left to drift out of sync. The
 * vertical axis just repeats at that same tile size and crops short at the
 * bottom if it doesn't divide evenly — never at the top, since the pattern
 * starts flush at the top-left corner.
 */
export function useFittedTiles(tilesAcross: number): FittedTiles {
  const { ref, size } = useContainerSize<HTMLDivElement>();
  const tilePx = size.width > 0 ? size.width / Math.max(1, tilesAcross) : 0;

  return { ref, tilePx };
}
