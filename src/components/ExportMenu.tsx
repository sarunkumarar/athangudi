import { useState } from 'react';
import type { TileState } from '../motifs/types';
import { exportTilePng, exportTileSvg } from '../lib/exportTile';

interface ExportMenuProps {
  state: TileState;
  shareUrl: string;
}

const iconProps = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className: 'h-4 w-4' };

const ExportIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
    <path d="M12 15V4" />
    <path d="M7 9l5-5 5 5" />
    <path d="M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />
  </svg>
);

const PngIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="8.5" cy="9.5" r="1.5" />
    <path d="M21 16l-5-5-9 9" />
  </svg>
);

const SvgIcon = () => (
  <svg {...iconProps}>
    <path d="M4 20V6a2 2 0 0 1 2-2h8l6 6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
    <path d="M14 4v5a1 1 0 0 0 1 1h5" />
  </svg>
);

const LinkIcon = () => (
  <svg {...iconProps}>
    <path d="M9 15l6-6" />
    <path d="M11 6l1-1a3.5 3.5 0 0 1 5 5l-1 1" />
    <path d="M13 18l-1 1a3.5 3.5 0 0 1-5-5l1-1" />
  </svg>
);

/**
 * A compact "Export" trigger for the studio header: opens a dropdown with
 * PNG/SVG download options and a copy-link action.
 */
export function ExportMenu({ state, shareUrl }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const run = async (kind: 'png' | 'svg') => {
    setBusy(kind);
    try {
      if (kind === 'png') await exportTilePng(state, 1000);
      else exportTileSvg(state);
    } catch (err) {
      console.error('Export failed', err);
      alert('Sorry, export failed in this browser.');
    } finally {
      setBusy(null);
      setOpen(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt('Copy this link', shareUrl);
    }
  };

  const item = 'flex w-full min-h-[40px] items-center gap-3 rounded-lg px-4 text-sm text-charcoal/85 transition hover:bg-black/5 disabled:opacity-50';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-1.5 rounded-full bg-cream/90 px-6 py-2 text-xs font-semibold text-charcoal shadow ring-1 ring-black/10 transition hover:bg-cream"
      >
        Export
        <ExportIcon />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl bg-parchment p-1.5 shadow-2xl ring-1 ring-black/10"
          >
            <button type="button" className={item} disabled={busy !== null} onClick={() => run('png')}>
              <PngIcon />
              {busy === 'png' ? 'Preparing…' : 'PNG'}
            </button>
            <button type="button" className={item} disabled={busy !== null} onClick={() => run('svg')}>
              <SvgIcon />
              SVG
            </button>
            <div className="my-1 h-px bg-black/10" />
            <button type="button" className={item} onClick={copyLink}>
              <LinkIcon />
              {copied ? 'Link copied ✓' : 'Copy shareable link'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
