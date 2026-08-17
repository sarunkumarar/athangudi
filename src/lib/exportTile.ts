import type { TileState } from '../motifs/types';
import { tileToSvgString, wallpaperToSvgString } from './tileRender';

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke on next tick so the download has time to start.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Rasterise an SVG string to a PNG blob at the requested pixel dimensions. */
function svgToPng(svg: string, width: number, height: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Canvas 2D context unavailable'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('PNG encoding failed'));
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('SVG could not be rasterised'));
    };
    img.src = url;
  });
}

export async function exportTilePng(state: TileState, size = 1000) {
  const blob = await svgToPng(tileToSvgString(state, size), size, size);
  triggerDownload(blob, `athangudi-${state.motifId}.png`);
}

/** A wallpaper PNG at arbitrary dimensions (desktop / mobile). */
export async function exportWallpaperPng(
  state: TileState,
  width: number,
  height: number,
  tilePx: number,
  label: string,
) {
  const blob = await svgToPng(wallpaperToSvgString(state, width, height, tilePx), width, height);
  triggerDownload(blob, `athangudi-${state.motifId}-${label}.png`);
}

export function exportTileSvg(state: TileState) {
  const blob = new Blob([tileToSvgString(state, 1000)], {
    type: 'image/svg+xml;charset=utf-8',
  });
  triggerDownload(blob, `athangudi-${state.motifId}.svg`);
}
