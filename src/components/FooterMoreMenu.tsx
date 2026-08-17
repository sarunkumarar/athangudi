import { useState } from 'react';
import type { ReactNode } from 'react';

interface FooterMoreMenuProps {
  children: ReactNode;
}

/** A kebab button that opens a small upward panel of secondary controls, for the compact mobile footer row. */
export function FooterMoreMenu({ children }: FooterMoreMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="More options"
        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/10 text-cream ring-1 ring-white/20 transition hover:bg-white/20"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <circle cx="12" cy="5" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="12" cy="19" r="1.8" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div
            role="menu"
            className="absolute bottom-full right-0 z-50 mb-2 w-72 rounded-2xl bg-parchment p-4 text-charcoal shadow-2xl ring-1 ring-black/10"
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}
