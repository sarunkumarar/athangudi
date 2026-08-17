import { COLORWAYS } from '../palette/oxidePalette';

interface ColorwayRowProps {
  onApplyColorway: (colorwayId: string) => void;
}

/** One-tap full colour-scheme presets, wrapping to fit a narrow side panel. */
export function ColorwayRow({ onApplyColorway }: ColorwayRowProps) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-charcoal/60">Colourways</h3>
      <div className="flex flex-wrap gap-2.5">
        {COLORWAYS.map((cw) => (
          <button
            key={cw.id}
            type="button"
            onClick={() => onApplyColorway(cw.id)}
            title={cw.name}
            className="flex min-h-[44px] items-center gap-2 rounded-full bg-white/70 py-1.5 pl-1.5 pr-4 ring-1 ring-black/10 transition hover:ring-clay"
          >
            <span className="flex overflow-hidden rounded-full ring-1 ring-black/10">
              {cw.colors.map((c, i) => (
                <span key={i} className="h-6 w-6" style={{ background: c }} />
              ))}
            </span>
            <span className="whitespace-nowrap text-sm text-charcoal/70">{cw.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
