import { useEffect, useState } from 'react';
import type { TileState } from '../motifs/types';
import { resolveMotif } from '../motifs';
import { TileSVG } from './TileSVG';
import { PatternFill } from './PatternFill';
import { exportTilePng, exportWallpaperPng } from '../lib/exportTile';
import { useContainerSize } from '../hooks/useContainerSize';

interface DownloadModalProps {
  state: TileState;
  onClose: () => void;
}

type Job = 'pattern' | 'desktop' | 'mobile';

function now() {
  const d = new Date();
  const hours = d.getHours();
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  const mins = d.getMinutes().toString().padStart(2, '0');
  return {
    time: `${h12}:${mins}`,
    date: d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }),
  };
}

/** A lock-screen clock, in the app's regular sans-serif (not the display face). */
function WallpaperClock({ size }: { size: 'desktop' | 'mobile' }) {
  const [{ time, date }, setClock] = useState(now);
  useEffect(() => {
    const id = setInterval(() => setClock(now()), 1000 * 15);
    return () => clearInterval(id);
  }, []);
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 flex flex-col items-center font-body text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.45)] ${
        size === 'desktop' ? 'top-3 gap-0.5' : 'top-6 gap-1'
      }`}
      aria-hidden
    >
      <span className={size === 'desktop' ? 'text-lg font-semibold tracking-tight' : 'text-2xl font-semibold tracking-tight'}>
        {time}
      </span>
      <span className={size === 'desktop' ? 'text-[9px] font-medium' : 'text-[10px] font-medium'}>{date}</span>
    </div>
  );
}

/**
 * Download options: the seamless tile itself, plus desktop and mobile
 * wallpapers previewed inside device mockups.
 */
export function DownloadModal({ state, onClose }: DownloadModalProps) {
  const [busy, setBusy] = useState<Job | null>(null);
  const { ref: desktopScreenRef, size: desktopScreenSize } = useContainerSize<HTMLDivElement>();
  const { ref: mobileScreenRef, size: mobileScreenSize } = useContainerSize<HTMLDivElement>();
  // Exact tile counts across each mockup's screen width: 20 for desktop, 10 for mobile.
  const desktopTilePx = desktopScreenSize.width > 0 ? desktopScreenSize.width / 20 : 30;
  const mobileTilePx = mobileScreenSize.width > 0 ? mobileScreenSize.width / 10 : 26;

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const run = async (job: Job) => {
    setBusy(job);
    try {
      if (job === 'pattern') await exportTilePng(state, 2000);
      else if (job === 'desktop') await exportWallpaperPng(state, 1920, 1080, 240, 'desktop');
      else await exportWallpaperPng(state, 1080, 2340, 234, 'mobile');
    } catch (err) {
      console.error('Download failed', err);
      alert('Sorry, that download failed in this browser.');
    } finally {
      setBusy(null);
    }
  };

  const dlBtn =
    'mt-3 w-full min-h-[44px] whitespace-nowrap rounded-xl bg-clay px-3 text-sm font-semibold text-cream transition hover:bg-clay/90 disabled:opacity-60';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Download pattern"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-parchment px-10 py-5 shadow-2xl sm:px-12 sm:py-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-charcoal">Download</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal/60 ring-1 ring-black/10 transition hover:bg-black/5"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* A single tile — not a repeated composition */}
          <div className="flex flex-col rounded-xl bg-white/60 px-6 py-4 ring-1 ring-black/10">
            <div className="flex flex-1 items-center justify-center">
              <div className="aspect-square w-full max-w-[180px] overflow-hidden rounded-lg shadow-md ring-1 ring-black/10">
                <TileSVG motif={resolveMotif(state)} colors={state.colors} size="100%" />
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-charcoal/60">Single tile</p>
            <button type="button" className={dlBtn} disabled={busy !== null} onClick={() => run('pattern')}>
              {busy === 'pattern' ? 'Preparing…' : 'Download'}
            </button>
          </div>

          {/* Desktop wallpaper */}
          <div className="flex flex-col rounded-xl bg-white/60 px-6 py-4 ring-1 ring-black/10">
            <div className="flex flex-1 items-center justify-center">
              <div className="w-full max-w-[220px]">
                {/* Monitor */}
                <div className="rounded-lg bg-charcoal p-1.5 shadow-lg">
                  <div
                    ref={desktopScreenRef}
                    className="relative aspect-video overflow-hidden rounded-sm ring-1 ring-black/40"
                  >
                    <PatternFill state={state} tilePx={desktopTilePx} align="top-left" className="h-full w-full" />
                    <WallpaperClock size="desktop" />
                  </div>
                </div>
                <div className="mx-auto h-3 w-8 bg-charcoal/70" />
                <div className="mx-auto h-1.5 w-24 rounded-b bg-charcoal/50" />
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-charcoal/60">Desktop · 1920×1080</p>
            <button type="button" className={dlBtn} disabled={busy !== null} onClick={() => run('desktop')}>
              {busy === 'desktop' ? 'Preparing…' : 'Download'}
            </button>
          </div>

          {/* Mobile wallpaper */}
          <div className="flex flex-col rounded-xl bg-white/60 px-6 py-4 ring-1 ring-black/10">
            <div className="flex flex-1 items-center justify-center">
              {/* Phone */}
              <div className="w-[104px]">
                <div className="relative rounded-[1.5rem] bg-charcoal p-1.5 shadow-lg">
                  <div
                    ref={mobileScreenRef}
                    className="relative aspect-[9/19.5] overflow-hidden rounded-[1.1rem] ring-1 ring-black/40"
                  >
                    <PatternFill state={state} tilePx={mobileTilePx} align="top-left" className="h-full w-full" />
                    <WallpaperClock size="mobile" />
                    <div className="absolute left-1/2 top-1.5 h-1.5 w-9 -translate-x-1/2 rounded-full bg-charcoal" />
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-charcoal/60">Mobile · 1080×2340</p>
            <button type="button" className={dlBtn} disabled={busy !== null} onClick={() => run('mobile')}>
              {busy === 'mobile' ? 'Preparing…' : 'Download'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
