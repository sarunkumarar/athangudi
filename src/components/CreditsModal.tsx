import { useEffect, useState } from 'react';

interface CreditsModalProps {
  onClose: () => void;
}

interface LinkItem {
  label: string;
  value: string;
  href: string;
  icon: React.ReactNode;
}

const EMAIL = 'dmtoarun@gmail.com';

const iconProps = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className: 'h-5 w-5' };

const LINKS: LinkItem[] = [
  {
    label: 'Website',
    value: 'arunkumar.co.in',
    href: 'https://arunkumar.co.in',
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9Z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    value: 'in/arunkumaryes',
    href: 'https://www.linkedin.com/in/arunkumaryes',
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <line x1="7.5" y1="10" x2="7.5" y2="17" />
        <circle cx="7.5" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
        <path d="M12 17v-4.5c0-1.4 1-2.5 2.4-2.5s2.1 1 2.1 2.6V17" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    value: '@anotherarun',
    href: 'https://www.instagram.com/anotherarun',
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

function CopyEmailButton() {
  const [copied, setCopied] = useState(false);

  const copy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      return;
    } catch {
      // Clipboard API unavailable or blocked, fall through to a legacy copy.
    }
    try {
      const textarea = document.createElement('textarea');
      textarea.value = EMAIL;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Give up quietly rather than risk window.prompt throwing in
      // environments where it isn't supported at all.
      console.warn('Could not copy email automatically:', EMAIL);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy email address"
      title="Copy email address"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-charcoal/40 transition hover:bg-black/5 hover:text-charcoal"
    >
      {copied ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-bottle">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <rect x="9" y="9" width="12" height="12" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
      )}
    </button>
  );
}

/** A small "about the maker" modal, opened from the footer credit. */
export function CreditsModal({ onClose }: CreditsModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="About the maker"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-parchment px-8 py-6 shadow-2xl sm:px-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Name + subtitle on one line, close pinned right */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-baseline gap-2.5">
            <h2 className="font-display text-xl font-semibold leading-none text-charcoal">Arun Kumar S</h2>
            <svg viewBox="0 0 16 16" className="relative top-px h-2.5 w-2.5 shrink-0 self-center text-charcoal/30" aria-hidden>
              <rect x="3" y="3" width="10" height="10" rx="1.5" transform="rotate(45 8 8)" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <p className="text-xs uppercase leading-none tracking-widest text-charcoal/50">Made athangudi achu</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-charcoal/60 ring-1 ring-black/10 transition hover:bg-black/5"
          >
            ✕
          </button>
        </div>

        {/* Two columns: about me | contact */}
        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-charcoal/50">About me</h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/80">
              I'm an architect turned product designer, fascinated with patterns, whether in buildings, interfaces,
              or centuries-old tile work like this one. Athangudi Achu started as a way to bring a craft I love onto
              the screen, one mirrored quarter-tile at a time.
            </p>
          </div>

          <div className="sm:border-l sm:border-black/10 sm:pl-8">
            <h3 className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-charcoal/50">
              Links
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </h3>
            <div className="mt-2 space-y-1">
              {LINKS.map((link) => (
                <div
                  key={link.label}
                  className={`flex items-center gap-1 rounded-lg transition hover:bg-black/5 ${link.label === 'Email' ? 'pr-2' : ''}`}
                >
                  <a
                    href={link.href}
                    target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-charcoal/80"
                  >
                    <span className="text-charcoal/50">{link.icon}</span>
                    <span className="text-sm">
                      <span className="block font-medium text-charcoal">{link.label}</span>
                      <span className="block text-xs text-charcoal/60">{link.value}</span>
                    </span>
                  </a>
                  {link.label === 'Email' && <CopyEmailButton />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
