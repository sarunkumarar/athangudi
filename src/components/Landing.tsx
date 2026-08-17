import { useEffect, useState } from 'react';
import type { TileState } from '../motifs/types';
import { resolveMotif } from '../motifs';
import { PatternFill } from './PatternFill';
import { useFittedTiles } from '../hooks/useFittedTiles';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';
import { InfoSheet } from './InfoSheet';
import { CreditsModal } from './CreditsModal';
import { ShuffleControls, ShuffleIconButton } from './ShuffleControls';
import { TileCountDragger, diamondRangeClass } from './TileCountDragger';
import { LoopSecondsStepper } from './LoopSecondsStepper';
import { ToggleSwitch } from './ToggleSwitch';

interface LandingProps {
  state: TileState;
  onEnter: () => void;
  onShuffle: () => void;
  onDownload: () => void;
  onHome: () => void;
}

/**
 * The landing "hero" is the pattern itself: a random Athangudi tile repeated
 * across the whole viewport, framed by a black header/footer.
 */
export function Landing({ state, onEnter, onShuffle, onDownload, onHome }: LandingProps) {
  const motif = resolveMotif(state);
  const [infoOpen, setInfoOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  // Large screens (lg+, matching the footer/header breakpoints) default to a
  // denser 9-tile fit; small/medium screens default to a coarser 5.
  const [rows, setRows] = useState(() => (typeof window !== 'undefined' && window.innerWidth >= 1024 ? 9 : 5));
  const { ref: floorRef, tilePx } = useFittedTiles(rows);
  const [loop, setLoop] = useState(false);
  const [loopSeconds, setLoopSeconds] = useState(3);

  // Auto-shuffle on a timer while looping is on.
  useEffect(() => {
    if (!loop) return;
    const id = setInterval(onShuffle, loopSeconds * 1000);
    return () => clearInterval(id);
  }, [loop, loopSeconds, onShuffle]);

  return (
    <div className="flex h-[100dvh] w-screen flex-col overflow-hidden bg-cream">
      <AppHeader
        infoOpen={infoOpen}
        onToggleInfo={() => setInfoOpen((v) => !v)}
        onHome={onHome}
        logoMotif={motif}
        logoColors={state.colors}
        rightSlot={
          <button
            type="button"
            onClick={onDownload}
            aria-label="Download"
            className="flex items-center gap-1.5 rounded-full bg-cream/90 px-6 py-2 text-xs font-semibold text-charcoal shadow ring-1 ring-black/10 transition hover:bg-cream"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M12 3v11" />
              <path d="M7 10l5 5 5-5" />
              <path d="M5 20h14" />
            </svg>
            <span className="hidden sm:inline">Download</span>
          </button>
        }
      />

      <main className="relative flex-1 overflow-hidden" style={{ animation: 'fadeIn 700ms ease-out' }}>
        <div ref={floorRef} className="absolute inset-0 h-full w-full overflow-hidden">
          {tilePx > 0 && (
            <PatternFill state={state} tilePx={tilePx} align="top-left" grout className="h-full w-full" />
          )}
        </div>

        <InfoSheet open={infoOpen} onClose={() => setInfoOpen(false)} />
      </main>

      <AppFooter
        patternName={motif.name}
        onPatternNameClick={onEnter}
        onCreditsClick={() => setCreditsOpen(true)}
        left={<TileCountDragger value={rows} onChange={setRows} />}
        mobileLeft={<ShuffleIconButton onShuffle={onShuffle} />}
        mobileMenu={
          <>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-charcoal">Loop pattern</span>
                <ToggleSwitch checked={loop} onChange={setLoop} label="Toggle loop pattern" />
              </div>
              <p className="mt-0.5 text-xs text-charcoal/55">Shuffles automatically on a timer</p>
              {loop && (
                <div className="mt-2 flex justify-center">
                  <LoopSecondsStepper seconds={loopSeconds} onChange={setLoopSeconds} variant="light" />
                </div>
              )}
            </div>
            <div className="border-t border-black/10 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-charcoal">Rows</span>
                <span className="text-xs tabular-nums text-charcoal/55">{rows}</span>
              </div>
              <input
                type="range"
                min={3}
                max={12}
                value={rows}
                onChange={(e) => setRows(Number(e.currentTarget.value))}
                aria-label="Number of tile rows"
                className={`mt-2 w-full ${diamondRangeClass('light')}`}
              />
            </div>
          </>
        }
        center={
          <div className="flex items-center gap-3">
            {/* Shuffle+loop already live in mobileLeft/the kebab menu below
                lg, so this copy only shows once the desktop row takes over. */}
            <div className="hidden lg:flex lg:items-center lg:gap-3">
              <ShuffleControls
                onShuffle={onShuffle}
                loop={loop}
                onToggleLoop={setLoop}
                seconds={loopSeconds}
                onSecondsChange={setLoopSeconds}
              />
            </div>
            <button
              type="button"
              onClick={onEnter}
              className="flex min-h-[40px] items-center gap-2 rounded-full bg-clay px-8 text-sm font-semibold text-cream shadow transition hover:bg-clay/90"
            >
              <span>Design your own</span>
              <span aria-hidden>→</span>
            </button>
          </div>
        }
      />

      {creditsOpen && <CreditsModal onClose={() => setCreditsOpen(false)} />}
    </div>
  );
}
