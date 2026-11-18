import { MAX_HISTORY_ENTRIES, STORAGE_KEY } from '../constants';
import { HistoryEntry, LibraryStorageData } from '../types';

type UnknownRecord = Record<string, unknown>;
type LibrarySnapshot = LibraryStorageData & { readonly sessionOnly: boolean };

const EMPTY_STORAGE: LibraryStorageData = {
  favorites: [],
  history: [],
};
let snapshot: LibrarySnapshot = { ...EMPTY_STORAGE, sessionOnly: false };

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

export const readStorage = (): LibrarySnapshot => {
  if (snapshot.sessionOnly || typeof window === 'undefined') {
    return snapshot;
  }

  let rawValue: string | null;
  try {
    rawValue = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    snapshot = { ...snapshot, sessionOnly: true };
    return snapshot;
  }

  try {
    const data = sanitizeStorageData(JSON.parse(rawValue || 'null'));
    snapshot = { ...data, sessionOnly: false };
  } catch {
    snapshot = { ...EMPTY_STORAGE, sessionOnly: false };
  }
  return snapshot;
};

const updateStorage = (
  updater: (current: LibraryStorageData) => LibraryStorageData
): LibrarySnapshot => {
  const current = readStorage();
  const data = updater(current);
  snapshot = { ...data, sessionOnly: current.sessionOnly };

  if (!snapshot.sessionOnly && typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      snapshot = { ...data, sessionOnly: true };
    }
  }
  return snapshot;
};

export const toggleFavorite = (id: number): LibrarySnapshot =>
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

export const recordPlay = (id: number): LibrarySnapshot =>
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
