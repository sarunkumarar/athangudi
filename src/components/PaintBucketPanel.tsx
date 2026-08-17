import { OXIDE_SWATCHES } from '../palette/oxidePalette';
import { ToggleSwitch } from './ToggleSwitch';

interface PaintBucketPanelProps {
  selectedColor: string;
  onSelectColor: (hex: string) => void;
  symmetry: boolean;
  onToggleSymmetry: (on: boolean) => void;
  onClear: () => void;
  hasOverrides: boolean;
}

/**
 * The paint bucket tool: pick a colour, then click any region of the tile
 * stencil to drop it there directly. With symmetry on (the default) a click
 * recolours the whole zone, same as the Zones tab. With symmetry off, only
 * the exact shape clicked changes, letting a design break away from the
 * motif's usual mirrored repetition.
 */
export function PaintBucketPanel({
  selectedColor,
  onSelectColor,
  symmetry,
  onToggleSymmetry,
  onClear,
  hasOverrides,
}: PaintBucketPanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-charcoal/60">Colours</h3>
        <div className="flex flex-wrap gap-1.5">
          {OXIDE_SWATCHES.map((sw) => {
            const selected = selectedColor.toUpperCase() === sw.hex.toUpperCase();
            return (
              <button
                key={sw.hex}
                type="button"
                onClick={() => onSelectColor(sw.hex)}
                title={sw.name}
                aria-label={sw.name}
                aria-pressed={selected}
                className={`h-9 w-9 shrink-0 rounded-lg ring-1 ring-black/15 transition ${
                  selected ? 'outline outline-2 outline-offset-2 outline-clay' : 'hover:scale-105'
                }`}
                style={{ background: sw.hex }}
              />
            );
          })}
        </div>
        <p className="mt-2 text-xs text-charcoal/55">Pick a colour, then click any region of the tile to drop it there.</p>
      </div>

      <div className="border-t border-black/10 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-charcoal">Symmetry</span>
          <ToggleSwitch checked={symmetry} onChange={onToggleSymmetry} label="Toggle mirrored symmetry while painting" />
        </div>
        <p className="mt-0.5 text-xs text-charcoal/55">
          {symmetry
            ? 'On: painting a region recolours its whole mirrored zone.'
            : 'Off: painting only changes the exact spot you click.'}
        </p>
      </div>

      <button
        type="button"
        onClick={onClear}
        disabled={!hasOverrides}
        className="flex min-h-[40px] w-full items-center justify-center gap-2 rounded-lg bg-white/70 px-4 text-sm font-semibold text-charcoal/80 ring-1 ring-black/10 transition hover:ring-charcoal/40 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Clear colours
      </button>
    </div>
  );
}
