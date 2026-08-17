const CRAFT_IMAGE_SRC = '/images/athangudi-making.jpg';
const CRAFT_IMAGE_CREDIT_URL =
  'https://www.bennykuriakose.com/post/the-making-of-unique-athangudi-tiles-an-unforgettable-experience';

interface InfoSheetProps {
  open: boolean;
  onClose: () => void;
}

interface Section {
  heading: string;
  color: string;
  body: string;
  icon: (color: string) => React.ReactNode;
}

// Small line-art icons, quick sketches of tile geometry, not literal motif
// renders, so they read at a glance inside the sheet.
const iconProps = { viewBox: '0 0 40 40', fill: 'none', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

// Same ladle glyph the paint bucket tool uses, so "poured" reads the same way in both places.
const LadleIcon = (color: string) => (
  <svg {...iconProps} stroke={color} className="h-[18px] w-[18px]">
    <circle cx="15" cy="27" r="9" />
    <path d="M21 21 L35 5" />
  </svg>
);

const LatticeIcon = (color: string) => (
  <svg {...iconProps} stroke={color} className="h-[18px] w-[18px]">
    <polygon points="10,3 17,10 10,17 3,10" />
    <polygon points="30,3 37,10 30,17 23,10" />
    <polygon points="10,23 17,30 10,37 3,30" />
    <polygon points="30,23 37,30 30,37 23,30" />
  </svg>
);

const ClockIcon = (color: string) => (
  <svg {...iconProps} stroke={color} className="h-[18px] w-[18px]">
    <circle cx="20" cy="20" r="16" />
    <path d="M20 10 L20 20 L28 26" />
  </svg>
);

const SymmetryIcon = (color: string) => (
  <svg {...iconProps} stroke={color} className="h-[18px] w-[18px]">
    <path d="M20 3 L20 37" strokeDasharray="3 4" />
    <path d="M20 8 L7 20 L20 32" />
    <path d="M20 8 L33 20 L20 32" />
  </svg>
);

const SECTIONS: Section[] = [
  {
    heading: 'Poured, Not Painted',
    color: '#E4633B',
    icon: LadleIcon,
    body: 'Cement, river sand and mineral oxide, poured wet into a hand-set brass stencil on a sheet of glass. No kiln, no glaze: the glass gives the face its shine, and the colour is the material itself, all the way through.',
  },
  {
    heading: 'Born in a Backyard, Built for Palaces',
    color: '#2FA98C',
    icon: LatticeIcon,
    body: 'Athangudi, a small village near Karaikudi in the Chettinad region of Tamil Nadu, once the backyard workshop of merchant families who tiled their mansions floor to threshold in these same patterns.',
  },
  {
    heading: 'Cured Like Wine, Not Fast Food',
    color: '#E2B33F',
    icon: ClockIcon,
    body: 'Each tile cures for weeks, not hours: a day in the frame, days underwater, weeks in shade. Rush it and the oxide never fully bonds. Patience is the actual ingredient, not a slogan.',
  },
  {
    heading: 'The Math Beneath the Beauty',
    color: '#5B7FD1',
    icon: SymmetryIcon,
    body: 'One quarter, drawn once, mirrored twice. That single rule turns a handful of stencils into an endless kaleidoscope of floors, which is exactly what this studio lets you do, digitally, in seconds instead of weeks.',
  },
];

/**
 * The "about Athangudi" panel: slides down from the header to fill the
 * pattern area at 80% opacity. Closes via the header's More info
 * button/hamburger, or the X in its own top-right corner.
 */
export function InfoSheet({ open, onClose }: InfoSheetProps) {
  return (
    <div
      className="absolute inset-0 z-30 overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{ transform: open ? 'translateY(0)' : 'translateY(-100%)' }}
      aria-hidden={!open}
    >
      {/* Sibling of the scrollable content below, not a child of it, so it
          stays put instead of scrolling away with the content. */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full text-cream/80 ring-1 ring-white/20 transition hover:bg-white/10 hover:text-cream sm:right-8 sm:top-8"
      >
        ✕
      </button>

      <div className="h-full overflow-y-auto bg-charcoal/95 px-10 pb-16 pt-8 backdrop-blur-[2px] sm:px-20 sm:pt-12">
        <div className="mx-auto max-w-5xl">
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/50">Athangudi Achu</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-cream sm:text-3xl">
            A floor cast, not painted
          </h2>

          <div className="mt-7 grid grid-cols-1 gap-10 md:grid-cols-2">
            {/* Left: name meaning + etymology + the craft, illustrated */}
            <div>
              <h3 className="font-display text-lg font-bold text-mustard sm:text-xl">What's in the name?</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base">
                <span className="font-display italic text-cream">Achu</span> (அச்சு) is the Tamil word for a{' '}
                <span className="font-semibold text-cream">mould, matrix, or die</span>: the exact brass stencil
                every tile is cast in. It's the same idea this studio runs on, one master shape, cast twice over
                each axis.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base">
                Athangudi lends its own name to the craft: a small village near Karaikudi, in the Chettinad
                heartland of Tamil Nadu, where families once cast these floors, one <em>achu</em>, one tile, one
                pour at a time.
              </p>
              <img
                src={CRAFT_IMAGE_SRC}
                alt="An Athangudi tile being cast in its brass stencil"
                className="mt-5 h-auto w-full rounded-lg shadow-lg"
              />
              <p className="mt-2 text-xs text-white/40">
                Photo credits:{' '}
                <a
                  href={CRAFT_IMAGE_CREDIT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-white/70"
                >
                  Benny Kuriakose & Associates
                </a>
              </p>
            </div>

            {/* Right: the craft in four parts */}
            <div className="space-y-7">
              {SECTIONS.map((s) => (
                <div key={s.heading} className="flex items-start gap-4">
                  <span className="mt-0.5 shrink-0">{s.icon(s.color)}</span>
                  <div>
                    <h3 className="font-display text-base font-bold sm:text-lg" style={{ color: s.color }}>
                      {s.heading}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/85 sm:text-base">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
