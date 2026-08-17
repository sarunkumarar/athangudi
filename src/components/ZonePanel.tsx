import type { Motif } from '../motifs/types';
import { OXIDE_SWATCHES } from '../palette/oxidePalette';

interface ZonePanelProps {
  motif: Motif;
  colors: Record<string, string>;
  activeZone: string | null;
  onSelectZone: (zoneId: string) => void;
  onPickColor: (zoneId: string, hex: string) => void;
}

/**
 * Zone selector + oxide swatch picker for whichever zone is active. Swatches
 * are a fixed small size (not a stretchy grid) so they stay compact no
 * matter how wide the panel is.
 */
export function ZonePanel({ motif, colors, activeZone, onSelectZone, onPickColor }: ZonePanelProps) {
  const active = activeZone ?? motif.zones[0]?.id ?? null;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-charcoal/60">Zones</h3>
        <div className="flex flex-wrap gap-2">
          {motif.zones.map((zone) => {
            const isActive = zone.id === active;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => onSelectZone(zone.id)}
                aria-pressed={isActive}
                className={`flex min-h-[40px] items-center gap-2 rounded-lg px-5 py-1.5 text-sm transition ${
                  isActive ? 'bg-charcoal text-cream' : 'bg-white/70 text-charcoal/80 ring-1 ring-black/10 hover:ring-charcoal/40'
                }`}
              >
                <span className="h-4 w-4 rounded-full ring-1 ring-black/20" style={{ background: colors[zone.id] }} />
                {zone.label}
              </button>
            );
          })}
        </div>
      </div>

      {active && (
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-charcoal/60">
            {motif.zones.find((z) => z.id === active)?.label} colour
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {OXIDE_SWATCHES.map((sw) => {
              const selected = colors[active]?.toUpperCase() === sw.hex.toUpperCase();
              return (
                <button
                  key={sw.hex}
                  type="button"
                  onClick={() => onPickColor(active, sw.hex)}
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
        </div>
      )}
    </div>
  );
}
