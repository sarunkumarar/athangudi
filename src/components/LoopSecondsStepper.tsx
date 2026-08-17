interface LoopSecondsStepperProps {
  seconds: number;
  onChange: (seconds: number) => void;
  min?: number;
  max?: number;
  className?: string;
  /** 'dark' for the black footer/header chrome, 'light' for panels on cream. */
  variant?: 'dark' | 'light';
}

/** A small -/+ stepper controlling the loop interval, in seconds. */
export function LoopSecondsStepper({
  seconds,
  onChange,
  min = 3,
  max = 60,
  className,
  variant = 'dark',
}: LoopSecondsStepperProps) {
  const step = (delta: number) => onChange(Math.min(max, Math.max(min, seconds + delta)));
  const isDark = variant === 'dark';

  return (
    <div
      className={`inline-flex items-center overflow-hidden rounded-full ${
        isDark ? 'bg-white/10 ring-1 ring-white/20' : 'bg-black/5 ring-1 ring-black/10'
      } ${className ?? ''}`}
    >
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={seconds <= min}
        aria-label="Decrease loop interval"
        className={`flex h-9 w-9 items-center justify-center transition disabled:opacity-30 ${
          isDark ? 'text-cream hover:bg-white/20' : 'text-charcoal hover:bg-black/10'
        }`}
      >
        −
      </button>
      <span className={`w-14 text-center text-sm tabular-nums ${isDark ? 'text-cream' : 'text-charcoal'}`}>
        {seconds}s
      </span>
      <button
        type="button"
        onClick={() => step(1)}
        disabled={seconds >= max}
        aria-label="Increase loop interval"
        className={`flex h-9 w-9 items-center justify-center transition disabled:opacity-30 ${
          isDark ? 'text-cream hover:bg-white/20' : 'text-charcoal hover:bg-black/10'
        }`}
      >
        +
      </button>
    </div>
  );
}
