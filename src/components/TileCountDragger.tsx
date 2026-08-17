interface TileCountDraggerProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

/** A diamond-thumbed range slider, reused by the desktop dragger and the
 *  mobile "more" menu's rows control so both match the tile motif's shape.
 *  `variant` picks the track tint for the footer's dark bar vs the kebab
 *  menu's light popover. */
const DIAMOND_THUMB =
  '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:mt-[-4px] [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 ' +
  '[&::-webkit-slider-thumb]:rotate-45 [&::-webkit-slider-thumb]:rounded-[2px] [&::-webkit-slider-thumb]:bg-clay ' +
  '[&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rotate-45 [&::-moz-range-thumb]:rounded-[2px] ' +
  '[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-clay';

// Tailwind's extractor needs each full arbitrary-variant class spelled out
// literally in source, so the two track tints are written out in full rather
// than built with string interpolation.
const DIAMOND_TRACK_DARK =
  '[&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-white/20 ' +
  '[&::-moz-range-track]:h-1 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-white/20';
const DIAMOND_TRACK_LIGHT =
  '[&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-black/15 ' +
  '[&::-moz-range-track]:h-1 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-black/15';

export function diamondRangeClass(variant: 'dark' | 'light' = 'dark') {
  const track = variant === 'dark' ? DIAMOND_TRACK_DARK : DIAMOND_TRACK_LIGHT;
  return `appearance-none bg-transparent ${track} ${DIAMOND_THUMB}`;
}

/**
 * A slider controlling how many tile rows are targeted down the floor.
 * Updates live while dragging — but the range only has a handful of coarse
 * integer steps, so each step is a discrete jump in tile size rather than a
 * smooth, continuous zoom.
 */
export function TileCountDragger({ value, min = 3, max = 12, onChange }: TileCountDraggerProps) {
  return (
    <div className="flex items-center gap-2 text-white/70">
      <span className="text-[10px] uppercase tracking-widest">Rows</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.currentTarget.value))}
        aria-label="Number of tile rows"
        className={`h-6 w-24 sm:w-32 ${diamondRangeClass('dark')}`}
      />
      <span className="w-5 text-right text-[11px] tabular-nums text-white/90">{value}</span>
    </div>
  );
}
