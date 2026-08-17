interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

/** A labelled pill switch, used inside menus/panels (light background). */
export function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <label className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-black/15 transition data-[on=true]:bg-clay" data-on={checked}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        aria-label={label}
      />
      <span
        className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-1'}`}
        aria-hidden
      />
    </label>
  );
}
