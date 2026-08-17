import type { ReactNode } from 'react';
import { PatternTexture } from './PatternTexture';
import { FooterMoreMenu } from './FooterMoreMenu';

interface AppFooterProps {
  patternName: string;
  onPatternNameClick: () => void;
  onCreditsClick: () => void;
  /** Full desktop-only left-side content (e.g. Shuffle + loop + rows, or "Back to floor"). */
  left: ReactNode;
  /** The primary action: centred on desktop, the middle button on mobile. */
  center: ReactNode;
  /** Compact mobile-only stand-in for `left` (e.g. just a shuffle icon, or "Back to floor"). */
  mobileLeft: ReactNode;
  /** Extra controls shown inside the mobile "more" menu (e.g. loop + rows). */
  mobileMenu?: ReactNode;
}

/**
 * Shared black footer, in three width tiers (measured empirically against
 * the actual widest desktop content — the Shuffle+Loop+"Design your own"
 * group plus credits — since that's what actually collides, not any
 * "device size" convention):
 *
 * - Below `lg` (1024px): the compact mobile row (small left control, the
 *   centred action, a "more" kebab for whatever doesn't fit) with its own
 *   full credits line underneath. Below this width the single-row desktop
 *   layout has nowhere near enough room — the rows slider collides with the
 *   centred action group.
 * - `lg` to just under `2xl` (1024-1535px): the single-row desktop layout,
 *   but the credits are trimmed to just the copyright line — "Now showing:
 *   X |" is dropped, since at this width it collides with the centred
 *   action group (which can grow wide once the loop's seconds-stepper
 *   appears).
 * - `2xl` and up (1536px+): the full single-row layout, everything shown.
 *
 * `center` is centred with `left-1/2 -translate-x-1/2` (absolute positioning),
 * not flex/grid `1fr` tracks — those only equalise *leftover* space after
 * each side's own content width is subtracted, so real content on one side
 * and nothing on the other still drifts the "centred" middle.
 *
 * Both rows use `min-h-*` rather than a fixed `h-*`: if content ever wraps at
 * an in-between (tablet/half-window) width, the bar grows to fit it instead
 * of the overflow bleeding into the page above/below it. Horizontal padding
 * here must match AppHeader's exactly (px-6 lg:px-10), or the header/footer
 * edges visibly fail to line up.
 */
export function AppFooter({
  patternName,
  onPatternNameClick,
  onCreditsClick,
  left,
  center,
  mobileLeft,
  mobileMenu,
}: AppFooterProps) {
  const year = new Date().getFullYear();

  const copyright = (
    <span>
      © {year} by{' '}
      <button
        type="button"
        onClick={onCreditsClick}
        className="text-white/85 underline decoration-dotted underline-offset-2 hover:text-white"
      >
        Arun Kumar S
      </button>
    </span>
  );

  const nowShowing = (
    <>
      <button
        type="button"
        onClick={onPatternNameClick}
        title="Open this pattern in the editor"
        className="underline-offset-2 hover:text-white hover:underline hover:decoration-dotted"
      >
        Now showing: {patternName}
      </button>
      <span className="text-white/25">|</span>
    </>
  );

  // Mobile's own credits line always has room to wrap, so it always shows
  // both parts regardless of width.
  const mobileCredits = (
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[13px] text-white/70">
      {nowShowing}
      {copyright}
    </div>
  );

  // The desktop row's credits only fit "Now showing" once there's real
  // headroom (2xl+) — below that it's dropped to just the copyright.
  const desktopCredits = (
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[13px] text-white/70">
      <span className="hidden items-center gap-2 2xl:flex">{nowShowing}</span>
      {copyright}
    </div>
  );

  return (
    <footer className="relative z-40 shrink-0 bg-charcoal">
      <PatternTexture />

      {/* Below lg: a compact action row, plus its own always-visible credits line. */}
      <div className="relative z-10 flex flex-col gap-2 px-6 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-2">
          <div className="shrink-0">{mobileLeft}</div>
          <div className="flex flex-1 justify-center">{center}</div>
          {mobileMenu ? <FooterMoreMenu>{mobileMenu}</FooterMoreMenu> : <span className="w-11 shrink-0" aria-hidden />}
        </div>
        {mobileCredits}
      </div>

      {/* lg and up: a single row — left group, dead-centre action, credits right. */}
      <div className="relative z-10 hidden min-h-16 items-center px-6 py-3 lg:flex lg:px-10">
        <div className="flex items-center gap-3">{left}</div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">{center}</div>
        <div className="ml-auto">{desktopCredits}</div>
      </div>
    </footer>
  );
}
