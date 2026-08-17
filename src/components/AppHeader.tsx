import type { ReactNode } from 'react';
import type { Motif } from '../motifs/types';
import { AthangudiLogo } from './AthangudiLogo';
import { PatternTexture } from './PatternTexture';

interface AppHeaderProps {
  /** Download button (floor) or Export dropdown trigger (studio). */
  rightSlot: ReactNode;
  infoOpen: boolean;
  onToggleInfo: () => void;
  /** Logo + title both navigate back to the floor page. */
  onHome: () => void;
  /** Show this tile as the logo instead of the default Star Medallion mark
   *  (the floor page passes its current pattern, so the logo always matches). */
  logoMotif?: Motif;
  logoColors?: Record<string, string>;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/**
 * Shared black header for both the floor page and the studio: a logo and
 * title (both link back to the floor), a centred title, a "More info" button
 * that opens the about-Athangudi sheet, and a right-hand page action. On
 * mobile the logo collapses into a hamburger (which opens the same sheet),
 * since there isn't room for a separate "More info" button too.
 */
export function AppHeader({ rightSlot, infoOpen, onToggleInfo, onHome, logoMotif, logoColors }: AppHeaderProps) {
  return (
    <header className="relative z-40 min-h-20 shrink-0 bg-charcoal">
      <PatternTexture />
      <div className="relative z-10 flex min-h-20 items-center justify-between gap-2 px-6 py-2 lg:px-10">
        <div className="flex flex-1 items-center justify-start">
          <button
            type="button"
            onClick={onToggleInfo}
            aria-label={infoOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={infoOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full text-cream transition hover:bg-white/10 lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onHome}
            aria-label="Go to floor"
            title="Go to floor"
            className="hidden rounded-md transition hover:opacity-80 lg:block"
          >
            <AthangudiLogo className="h-10 w-10" motif={logoMotif} colors={logoColors} />
          </button>
        </div>

        <button
          type="button"
          onClick={onHome}
          aria-label="Go to floor"
          title="Go to floor"
          className="hidden shrink-0 rounded-lg px-4 py-1 transition hover:opacity-80 lg:block"
        >
          <span className="whitespace-nowrap font-title tracking-wide text-cream text-xl 2xl:text-[32px]">
            athangudi achu
          </span>
        </button>
        <button
          type="button"
          onClick={onHome}
          aria-label="Go to floor"
          className="whitespace-nowrap font-title text-lg text-cream lg:hidden"
        >
          athangudi achu
        </button>

        <div className="flex flex-1 items-center justify-end gap-2">
          <button
            type="button"
            onClick={onToggleInfo}
            aria-expanded={infoOpen}
            aria-label={infoOpen ? 'Close more info' : 'Open more info'}
            className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-cream ring-1 ring-white/20 transition hover:bg-white/20 lg:flex 2xl:px-6"
          >
            More info
            <ChevronIcon open={infoOpen} />
          </button>
          {rightSlot}
        </div>
      </div>
    </header>
  );
}
