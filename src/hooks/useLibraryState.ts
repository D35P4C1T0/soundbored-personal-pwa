import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { DISPLAY_HISTORY_LIMIT, STORAGE_KEY } from '../constants';
import { readStorage, recordPlay, toggleFavorite } from '../services/storage';
import { HistoryEntry, Sound } from '../types';
import { filterSounds, getAllTags } from '../utils/search';

interface LibrarySnapshot {
  readonly favorites: readonly number[];
  readonly history: readonly HistoryEntry[];
}

const readSnapshot = (): LibrarySnapshot => {
  const storage = readStorage();

  return {
    favorites: storage.favorites,
    history: storage.history,
  };
};

export interface UseLibraryStateResult {
  readonly favorites: readonly number[];
  readonly history: readonly HistoryEntry[];
  readonly searchQuery: string;
  readonly visibleSounds: readonly Sound[];
  readonly favoriteSounds: readonly Sound[];
  readonly historySounds: readonly Sound[];
  readonly tags: readonly string[];
  readonly selectedTags: readonly string[];
  setSearchQuery: (value: string) => void;
  toggleTag: (tag: string) => void;
  toggleFavorite: (id: number) => void;
  recordPlayback: (id: number) => void;
}

export const useLibraryState = (sounds: readonly Sound[]): UseLibraryStateResult => {
  const [snapshot, setSnapshot] = useState<LibrarySnapshot>(() => readSnapshot());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const tags = useMemo(() => getAllTags(sounds), [sounds]);

  useEffect(() => {
    setSelectedTags((current) => current.filter((tag) => tags.includes(tag)));
  }, [tags]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === null || event.key === STORAGE_KEY) {
        setSnapshot(readSnapshot());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const visibleSounds = useMemo(
    () => filterSounds(sounds, deferredSearchQuery, selectedTags),
    [deferredSearchQuery, selectedTags, sounds]
  );

  const favoriteSounds = useMemo(
    () => sounds.filter((sound) => snapshot.favorites.includes(sound.id)),
    [snapshot.favorites, sounds]
  );

  const historySounds = useMemo(() => {
    const soundById = new Map(sounds.map((sound) => [sound.id, sound] as const));

    return snapshot.history
      .map((entry) => soundById.get(entry.id))
      .filter((sound): sound is Sound => sound !== undefined)
      .slice(0, DISPLAY_HISTORY_LIMIT);
  }, [snapshot.history, sounds]);

  const toggleSelectedTag = useCallback((tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((entry) => entry !== tag) : [...current, tag]
    );
  }, []);

  const handleToggleFavorite = useCallback((id: number) => {
    setSnapshot(toggleFavorite(id));
  }, []);

  const handleRecordPlayback = useCallback((id: number) => {
    setSnapshot(recordPlay(id));
  }, []);

  return {
    favorites: snapshot.favorites,
    history: snapshot.history,
    searchQuery,
    visibleSounds,
    favoriteSounds,
    historySounds,
    tags,
    selectedTags,
    setSearchQuery,
    toggleTag: toggleSelectedTag,
    toggleFavorite: handleToggleFavorite,
    recordPlayback: handleRecordPlayback,
  };
};
