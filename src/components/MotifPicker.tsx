import { MOTIFS, CUSTOM_ID, buildCustomMotif, DEFAULT_CUSTOM } from '../motifs';
import { defaultColorsFor } from '../lib/tileRender';
import { TileSVG } from './TileSVG';

interface MotifPickerProps {
  currentMotifId: string;
  onSelect: (motifId: string) => void;
}

const CUSTOM_PREVIEW = buildCustomMotif(DEFAULT_CUSTOM);
// Rendered as an outline only (no fill) — this thumbnail signals "build your
// own shape" rather than looking like a fixed colour preset.
const CUSTOM_PREVIEW_COLORS: Record<string, string> = {};

/** Thumbnail grid to switch motif. 8 traditional motifs + a Custom builder. */
export function MotifPicker({ currentMotifId, onSelect }: MotifPickerProps) {
  const thumb = (key: string, label: string, active: boolean, svg: React.ReactNode, onClick: () => void) => (
    <button
      key={key}
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={label}
      className={`group relative flex shrink-0 flex-col items-center gap-1.5 rounded-xl p-1.5 transition ${
        active ? 'bg-charcoal/5 ring-2 ring-clay' : 'ring-1 ring-black/5 hover:bg-black/5'
      }`}
    >
      <span className="block h-16 w-16 overflow-hidden rounded-lg shadow-sm ring-1 ring-black/10">{svg}</span>
      <span className="w-16 truncate text-center text-[11px] leading-tight text-charcoal/70">{label}</span>
    </button>
  );

  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-charcoal/60">Motif</h3>
      <div className="flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible">
        {MOTIFS.map((motif) =>
          thumb(
            motif.id,
            motif.name,
            motif.id === currentMotifId,
            <TileSVG motifId={motif.id} colors={defaultColorsFor(motif)} size={64} />,
            () => onSelect(motif.id),
          ),
        )}
        {thumb(
          CUSTOM_ID,
          'Custom',
          currentMotifId === CUSTOM_ID,
          <TileSVG motif={CUSTOM_PREVIEW} colors={CUSTOM_PREVIEW_COLORS} outlineColor="#2B2B2B" size={64} />,
          () => onSelect(CUSTOM_ID),
        )}
      </div>
    </div>
  );
}
