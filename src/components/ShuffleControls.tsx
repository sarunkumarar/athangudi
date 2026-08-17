import { LoopSecondsStepper } from './LoopSecondsStepper';

function ShuffleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  );
}

interface ShuffleControlsProps {
  onShuffle: () => void;
  loop: boolean;
  onToggleLoop: (loop: boolean) => void;
  seconds: number;
  onSecondsChange: (seconds: number) => void;
}

/** Just the shuffle trigger, for contexts with no room for the loop toggle too (the mobile footer row). */
export function ShuffleIconButton({ onShuffle }: { onShuffle: () => void }) {
  return (
    <button
      type="button"
      onClick={onShuffle}
      aria-label="Shuffle pattern"
      className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/10 text-cream ring-1 ring-white/20 transition hover:bg-white/20"
    >
      <ShuffleIcon className="h-5 w-5" />
    </button>
  );
}

/**
 * The full desktop set: shuffle trigger, loop toggle, and (once looping) an
 * interval stepper. Two plain, separate controls rather than a fused
 * split-button-with-dropdown, which read as fussier than the feature
 * warranted.
 */
export function ShuffleControls({ onShuffle, loop, onToggleLoop, seconds, onSecondsChange }: ShuffleControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onShuffle}
        aria-label="Shuffle pattern"
        className="flex min-h-[40px] items-center gap-1.5 rounded-full bg-white/10 px-8 text-sm font-semibold text-cream ring-1 ring-white/20 transition hover:bg-white/20"
      >
        <ShuffleIcon className="h-4 w-4" /> <span className="hidden sm:inline">Shuffle</span>
      </button>
      <button
        type="button"
        onClick={() => onToggleLoop(!loop)}
        aria-pressed={loop}
        title={loop ? `Loop is on, auto-shuffling every ${seconds}s. Click to stop.` : 'Loop pattern, auto-shuffle on a timer'}
        className={`flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full ring-1 transition ${
          loop ? 'bg-clay text-cream ring-clay' : 'bg-white/10 text-cream/80 ring-white/20 hover:bg-white/20'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M17 2l4 4-4 4" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <path d="M7 22l-4-4 4-4" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
      </button>
      {loop && <LoopSecondsStepper seconds={seconds} onChange={onSecondsChange} variant="dark" />}
    </div>
  );
}
