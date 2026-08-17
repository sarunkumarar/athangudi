import { useState } from 'react';
import { resolveMotif } from '../motifs';
import type { UseTileState } from '../hooks/useTileState';
import { TileSVG } from './TileSVG';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';
import { InfoSheet } from './InfoSheet';
import { CreditsModal } from './CreditsModal';
import { ExportMenu } from './ExportMenu';
import { MotifPicker } from './MotifPicker';
import { CustomBuilder } from './CustomBuilder';
import { ZonePanel } from './ZonePanel';
import { PaintBucketPanel } from './PaintBucketPanel';
import { ColorwayRow } from './ColorwayRow';
import { RandomizeButton } from './RandomizeButton';
import { CUSTOM_ID } from '../motifs';
import { OXIDE_SWATCHES } from '../palette/oxidePalette';

type ColourTab = 'zones' | 'paint';

// The same ladle glyph used in More Info's "Poured, Not Painted" section, so
// the paint bucket tool reads as the same idea in both places.
function LadleTabIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="15" cy="27" r="9" />
      <path d="M21 21 L35 5" />
    </svg>
  );
}

interface StudioProps {
  tile: UseTileState;
  onExit: () => void;
  onHome: () => void;
  /** Apply the current design to the home screen (and go there). */
  onApplyHome: () => void;
}

/**
 * The interactive editor. Desktop: header (export) / left panel (motif +
 * randomize) — tile preview, centred — right panel (colourways + zones +
 * swatches) / footer. Mobile: a small preview pinned below the header while
 * the panels scroll underneath it, so the tile stays visible the whole time.
 */
export function Studio({ tile, onExit, onHome, onApplyHome }: StudioProps) {
  const { state } = tile;
  const motif = resolveMotif(state);
  const [activeZone, setActiveZone] = useState<string | null>(motif.zones[0]?.id ?? null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [colourTab, setColourTab] = useState<ColourTab>('zones');
  const [paintColor, setPaintColor] = useState(OXIDE_SWATCHES[0].hex);
  const [symmetry, setSymmetry] = useState(true);

  const paintMode = colourTab === 'paint';
  const onShapePaint = paintMode
    ? (shapeKey: string, zoneId: string) => {
        if (symmetry) tile.setZoneColor(zoneId, paintColor);
        else tile.setShapePaint(shapeKey, paintColor);
      }
    : undefined;

  const selectMotif = (id: string) => {
    tile.setMotif(id);
    setActiveZone(null);
  };

  const motifSection = (
    <>
      <MotifPicker currentMotifId={state.motifId} onSelect={selectMotif} />
      {state.motifId === CUSTOM_ID && state.custom && (
        <CustomBuilder
          config={state.custom}
          onChange={(config) => {
            tile.setCustom(config);
            setActiveZone(null);
          }}
        />
      )}
      <RandomizeButton
        onRandomize={() => {
          tile.randomize();
          setActiveZone(null);
        }}
        onReset={tile.reset}
      />
    </>
  );

  const colourSection = (
    <>
      {/* Material-style tabs: flat, muted-vs-bold text, underline indicator. */}
      <div className="flex gap-6 border-b border-black/10">
        {(['zones', 'paint'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setColourTab(tab)}
            aria-pressed={colourTab === tab}
            className={`relative flex items-center gap-1.5 pb-2.5 text-sm font-semibold transition ${
              colourTab === tab ? 'text-charcoal' : 'text-charcoal/50 hover:text-charcoal/80'
            }`}
          >
            {tab === 'zones' ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
                  <rect x="3" y="3" width="8" height="8" rx="1.5" />
                  <rect x="13" y="3" width="8" height="8" rx="1.5" />
                  <rect x="3" y="13" width="8" height="8" rx="1.5" />
                  <rect x="13" y="13" width="8" height="8" rx="1.5" />
                </svg>
                Zones
              </>
            ) : (
              <>
                <LadleTabIcon className="h-4 w-4" />
                Paint bucket
              </>
            )}
            <span
              className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full transition-colors ${
                colourTab === tab ? 'bg-clay' : 'bg-transparent'
              }`}
              aria-hidden
            />
          </button>
        ))}
      </div>

      {colourTab === 'zones' ? (
        <ZonePanel
          motif={motif}
          colors={state.colors}
          activeZone={activeZone}
          onSelectZone={setActiveZone}
          onPickColor={tile.setZoneColor}
        />
      ) : (
        <PaintBucketPanel
          selectedColor={paintColor}
          onSelectColor={setPaintColor}
          symmetry={symmetry}
          onToggleSymmetry={setSymmetry}
          onClear={tile.clearPaintOverrides}
          hasOverrides={Boolean(state.paintOverrides && Object.keys(state.paintOverrides).length > 0)}
        />
      )}

      {colourTab === 'zones' && (
        <div className="border-t border-black/10 pt-4">
          <ColorwayRow onApplyColorway={tile.applyColorwayId} />
        </div>
      )}
    </>
  );

  return (
    <div className="flex h-[100dvh] w-screen flex-col overflow-hidden bg-cream">
      <AppHeader
        infoOpen={infoOpen}
        onToggleInfo={() => setInfoOpen((v) => !v)}
        onHome={onHome}
        rightSlot={<ExportMenu state={state} shareUrl={tile.shareUrl} />}
      />

      <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row lg:overflow-hidden">
        <InfoSheet open={infoOpen} onClose={() => setInfoOpen(false)} />

        {/* Mobile: a small preview pinned below the header; panels scroll beneath it. */}
        <div className="flex min-h-0 flex-1 flex-col lg:hidden">
          <div className="shrink-0 border-b border-black/10 bg-cream px-6 pb-4 pt-4">
            <div className="mx-auto w-44">
              <div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/10">
                <TileSVG
                  motif={motif}
                  colors={state.colors}
                  paintOverrides={state.paintOverrides}
                  size="100%"
                  onZoneClick={paintMode ? undefined : setActiveZone}
                  onShapePaint={onShapePaint}
                  activeZone={activeZone ?? undefined}
                  outlineAllShapes={paintMode}
                  cursorColor={paintMode ? paintColor : undefined}
                  className="block h-auto w-full"
                  title={`${motif.name}, tap a region to recolour it`}
                />
              </div>
            </div>
            <p className="mt-2 text-center text-xs text-charcoal/55">
              {paintMode ? 'Tap any region to drop the selected colour' : 'Tap any region to recolour it'}
            </p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-5">{motifSection}</div>
            <div className="mt-5 space-y-5 border-t border-black/10 pt-5">{colourSection}</div>
          </div>
        </div>

        {/* Desktop: three columns, tile preview centred both ways. */}
        <aside className="hidden border-black/10 bg-parchment/70 px-10 py-4 lg:block lg:h-full lg:w-72 xl:w-80 lg:shrink-0 lg:overflow-y-auto lg:border-r">
          <div className="space-y-5">{motifSection}</div>
        </aside>

        <div className="hidden flex-1 items-center justify-center overflow-y-auto px-16 py-6 lg:flex lg:h-full">
          <div className="w-full max-w-md">
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/10">
              <TileSVG
                motif={motif}
                colors={state.colors}
                paintOverrides={state.paintOverrides}
                size="100%"
                onZoneClick={paintMode ? undefined : setActiveZone}
                onShapePaint={onShapePaint}
                activeZone={activeZone ?? undefined}
                outlineAllShapes={paintMode}
                cursorColor={paintMode ? paintColor : undefined}
                className="block h-auto w-full"
                title={`${motif.name}, tap a region to recolour it`}
              />
            </div>
            <p className="mt-2 text-center text-xs text-charcoal/55">
              {paintMode
                ? symmetry
                  ? 'Tap any region to drop the selected colour across its mirrored zone'
                  : 'Tap any region to drop the selected colour on just that spot'
                : 'Tap any region to recolour it, built by mirroring one quarter design'}
            </p>
          </div>
        </div>

        <aside className="hidden border-black/10 bg-parchment/70 px-10 py-4 lg:block lg:h-full lg:w-72 xl:w-80 lg:shrink-0 lg:overflow-y-auto lg:border-l">
          <div className="space-y-5">{colourSection}</div>
        </aside>
      </div>

      <AppFooter
        patternName={motif.name}
        onPatternNameClick={onApplyHome}
        onCreditsClick={() => setCreditsOpen(true)}
        left={
          <button
            type="button"
            onClick={onExit}
            className="flex min-h-[40px] items-center gap-2 rounded-full bg-white/10 px-8 text-sm font-semibold text-cream ring-1 ring-white/20 transition hover:bg-white/20"
          >
            <span aria-hidden>←</span>
            <span>Back to floor</span>
          </button>
        }
        mobileLeft={
          <button
            type="button"
            onClick={onExit}
            aria-label="Back to floor"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/10 text-cream ring-1 ring-white/20 transition hover:bg-white/20"
          >
            <span aria-hidden>←</span>
          </button>
        }
        center={
          <button
            type="button"
            onClick={onApplyHome}
            className="flex min-h-[40px] items-center rounded-full bg-clay px-8 text-sm font-semibold text-cream shadow transition hover:bg-clay/90"
          >
            Apply pattern
          </button>
        }
      />

      {creditsOpen && <CreditsModal onClose={() => setCreditsOpen(false)} />}
    </div>
  );
}
