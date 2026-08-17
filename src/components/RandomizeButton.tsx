interface RandomizeButtonProps {
  onRandomize: () => void;
  onReset: () => void;
}

export function RandomizeButton({ onRandomize, onReset }: RandomizeButtonProps) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onRandomize}
        className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-clay px-3 text-sm font-semibold text-cream shadow-sm transition hover:bg-clay/90 active:scale-[0.98]"
      >
        <span aria-hidden>🎲</span> Surprise me
      </button>
      <button
        type="button"
        onClick={onReset}
        className="min-h-[44px] shrink-0 whitespace-nowrap rounded-xl bg-white/70 px-4 text-sm font-medium text-charcoal/80 ring-1 ring-black/10 transition hover:ring-charcoal/40"
      >
        Reset
      </button>
    </div>
  );
}
