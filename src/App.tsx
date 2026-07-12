import { useCallback, useState } from 'react';
import { CategoryFilter } from './components/CategoryFilter';
import { ErrorScreen, LoadingScreen } from './components/StatusScreen';
import { SearchBar } from './components/SearchBar';
import { SoundGrid } from './components/SoundGrid';
import { useLibraryState } from './hooks/useLibraryState';
import { useSounds } from './hooks/useSounds';

type View = 'all' | 'favorites' | 'history';

function App() {
  const [view, setView] = useState<View>('all');
  const { sounds, status, errorMessage, playSound, reload } = useSounds();
  const library = useLibraryState(sounds);

  const handlePlay = useCallback(async (id: number) => {
    await playSound(id);
    library.recordPlayback(id);
  }, [library.recordPlayback, playSound]);

  if (status === 'loading') return <LoadingScreen message="Loading sounds…" />;
  if (status === 'error' && errorMessage) {
    return <ErrorScreen title="Couldn’t load sounds" message={errorMessage} actionLabel="Try again" onAction={() => void reload()} />;
  }

  const views: { id: View; label: string; count: number }[] = [
    { id: 'all', label: 'Sounds', count: sounds.length },
    { id: 'favorites', label: 'Favorites', count: library.favorites.length },
    { id: 'history', label: 'Recent', count: library.historySounds.length },
  ];

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">PERSONAL SOUNDBOARD</p>
          <h1>Soundbored</h1>
          <p className="subtitle">Find it. Tap it. Play it.</p>
        </div>
        <span className="status"><i /> Connected</span>
      </header>

      <nav className="tabs" aria-label="Library views">
        {views.map((item) => (
          <button key={item.id} className={view === item.id ? 'active' : ''} aria-current={view === item.id ? 'page' : undefined} onClick={() => setView(item.id)}>
            {item.label}<span>{item.count}</span>
          </button>
        ))}
      </nav>

      {view === 'all' && (
        <section className="library">
          <SearchBar value={library.searchQuery} onChange={library.setSearchQuery} />
          <CategoryFilter tags={library.tags} selectedTags={library.selectedTags} onToggleTag={library.toggleTag} />
          <p className="result-count">{library.visibleSounds.length} {library.visibleSounds.length === 1 ? 'sound' : 'sounds'}</p>
          <SoundGrid sounds={library.visibleSounds} favorites={library.favorites} emptyMessage="No sounds match those filters." onPlay={handlePlay} onToggleFavorite={library.toggleFavorite} />
        </section>
      )}
      {view === 'favorites' && <SoundGrid sounds={library.favoriteSounds} favorites={library.favorites} emptyMessage="No favorites yet. Star sounds to keep them close." onPlay={handlePlay} onToggleFavorite={library.toggleFavorite} />}
      {view === 'history' && <SoundGrid sounds={library.historySounds} favorites={library.favorites} emptyMessage="Nothing played yet." onPlay={handlePlay} onToggleFavorite={library.toggleFavorite} />}
    </main>
  );
}

export default App;
