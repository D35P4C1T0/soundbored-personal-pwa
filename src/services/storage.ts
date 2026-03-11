import { MAX_HISTORY_ENTRIES, STORAGE_KEY } from '../constants';
import { HistoryEntry, LibraryStorageData } from '../types';

type UnknownRecord = Record<string, unknown>;

const EMPTY_STORAGE: LibraryStorageData = {
  favorites: [],
  history: [],
};

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null;

const isPositiveInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value > 0;

const assertSoundId = (value: number): void => {
  if (!isPositiveInteger(value)) {
    throw new Error('Invalid sound id');
  }
};

const isHistoryEntry = (value: unknown): value is HistoryEntry =>
  isRecord(value) &&
  isPositiveInteger(value.id) &&
  typeof value.timestamp === 'number' &&
  Number.isFinite(value.timestamp);

const dedupeNumbers = (values: readonly number[]): number[] => [...new Set(values)];

const sanitizeFavorites = (value: unknown): number[] =>
  Array.isArray(value) ? dedupeNumbers(value.filter(isPositiveInteger)) : [];

const sanitizeHistory = (value: unknown): HistoryEntry[] =>
  Array.isArray(value)
    ? value
        .filter(isHistoryEntry)
        .sort((left, right) => right.timestamp - left.timestamp)
        .slice(0, MAX_HISTORY_ENTRIES)
    : [];

const sanitizeStorageData = (value: unknown): LibraryStorageData => {
  if (!isRecord(value)) {
    return EMPTY_STORAGE;
  }

  return {
    favorites: sanitizeFavorites(value.favorites),
    history: sanitizeHistory(value.history),
  };
};

const getStorage = (): Storage | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
};

const writeStorage = (data: LibraryStorageData): void => {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to persist library storage', error);
  }
};

export const readStorage = (): LibraryStorageData => {
  const storage = getStorage();

  if (!storage) {
    return EMPTY_STORAGE;
  }

  try {
    const rawValue = storage.getItem(STORAGE_KEY);
    return rawValue ? sanitizeStorageData(JSON.parse(rawValue)) : EMPTY_STORAGE;
  } catch {
    return EMPTY_STORAGE;
  }
};

const updateStorage = (
  updater: (current: LibraryStorageData) => LibraryStorageData
): LibraryStorageData => {
  const nextValue = updater(readStorage());
  writeStorage(nextValue);
  return nextValue;
};

export const toggleFavorite = (id: number): LibraryStorageData =>
  updateStorage((current) => {
    assertSoundId(id);

    const favorites = current.favorites.includes(id)
      ? current.favorites.filter((favoriteId) => favoriteId !== id)
      : [...current.favorites, id];

    return {
      ...current,
      favorites,
    };
  });

export const recordPlay = (id: number): LibraryStorageData =>
  updateStorage((current) => {
    assertSoundId(id);

    const nextEntry: HistoryEntry = {
      id,
      timestamp: Date.now(),
    };

    const history = [nextEntry, ...current.history.filter((entry) => entry.id !== id)].slice(
      0,
      MAX_HISTORY_ENTRIES
    );

    return {
      ...current,
      history,
    };
  });
