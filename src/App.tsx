import { useMemo, useState } from 'react';
import { useTileState } from './hooks/useTileState';
import { randomTileState } from './lib/randomize';
import { Landing } from './components/Landing';
import { Studio } from './components/Studio';
import { DownloadModal } from './components/DownloadModal';
import type { TileState } from './motifs/types';

type View = 'landing' | 'studio';

export default function App() {
  const tile = useTileState();
  const [view, setView] = useState<View>('landing');
  const [downloadOpen, setDownloadOpen] = useState(false);

  // Did we arrive via a shared link? If so the landing should preview that
  // exact design; otherwise the landing is a fresh random pattern each load.
  const hasShared = useMemo(
    () => typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('m'),
    [],
  );
  const [landingState, setLandingState] = useState<TileState>(() =>
    hasShared ? tile.state : randomTileState(),
  );

  const enterStudio = () => {
    // Continue editing the exact pattern shown on the landing.
    tile.setDesign(landingState);
    setView('studio');
  };

  // Logo/title in the header, and "Back to floor", all just return to the
  // floor — the floor keeps showing whatever it showed before, edits or not.
  const goHome = () => setView('landing');

  if (view === 'landing') {
    return (
      <>
        <Landing
          state={landingState}
          onEnter={enterStudio}
          onShuffle={() => setLandingState(randomTileState())}
          onDownload={() => setDownloadOpen(true)}
          onHome={goHome}
        />
        {downloadOpen && (
          <DownloadModal state={landingState} onClose={() => setDownloadOpen(false)} />
        )}
      </>
    );
  }
  return (
    <Studio
      tile={tile}
      onExit={goHome}
      onHome={goHome}
      // "Apply pattern" (and tapping the floor preview) pushes the edit onto
      // the floor and shows it full-screen.
      onApplyHome={() => {
        setLandingState(tile.state);
        setView('landing');
      }}
    />
  );
}
