import type { CustomConfig } from '../motifs/types';
import { CUSTOM_GROUPS } from '../motifs';

interface CustomBuilderProps {
  config: CustomConfig;
  onChange: (config: CustomConfig) => void;
}

/**
 * Compose a custom tile from a restricted library of traditional elements.
 * Only one quarter is designed; symmetry does the rest, so every combination
 * stays within the Athangudi idiom.
 */
export function CustomBuilder({ config, onChange }: CustomBuilderProps) {
  return (
    <div className="space-y-3 rounded-xl bg-white/50 p-3 ring-1 ring-black/10">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-charcoal/60">Compose your quarter</h3>
      {CUSTOM_GROUPS.map((group) => (
        <div key={group.key}>
          <p className="mb-1.5 text-[11px] font-medium text-charcoal/70">{group.label}</p>
          <div className="flex flex-wrap gap-1.5">
            {group.options.map((opt) => {
              const active = config[group.key] === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChange({ ...config, [group.key]: opt.id })}
                  aria-pressed={active}
                  className={`min-h-[36px] rounded-lg px-6 text-xs font-medium transition ${
                    active
                      ? 'bg-charcoal text-cream'
                      : 'bg-white/70 text-charcoal/80 ring-1 ring-black/10 hover:ring-charcoal/40'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
