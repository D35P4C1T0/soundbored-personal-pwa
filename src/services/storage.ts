import { StorageData, HistoryEntry, Settings } from '../types';
import { STORAGE_KEY, MAX_HISTORY_ENTRIES } from '../constants';

const getDefaultData = (): StorageData => ({
  favorites: [],
  history: [],
  settings: {}
});

export const loadData = (): StorageData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return getDefaultData();
    return { ...getDefaultData(), ...JSON.parse(stored) };
  } catch {
    return getDefaultData();
  }
};

export const saveData = (data: StorageData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data:', error);
  }
};

export const toggleFavorite = (id: number): boolean => {
  const data = loadData();
  const index = data.favorites.indexOf(id);
  if (index > -1) {
    data.favorites.splice(index, 1);
    saveData(data);
    return false;
  } else {
    data.favorites.push(id);
    saveData(data);
    return true;
  }
};

export const isFavorite = (id: number): boolean => {
  const data = loadData();
  return data.favorites.includes(id);
};

export const addToHistory = (id: number): void => {
  const data = loadData();
  // Remove if already exists
  data.history = data.history.filter((h) => h.id !== id);
  // Add to beginning
  data.history.unshift({ id, timestamp: Date.now() });
  // Keep only last MAX_HISTORY_ENTRIES
  data.history = data.history.slice(0, MAX_HISTORY_ENTRIES);
  saveData(data);
};

export const getHistory = (): HistoryEntry[] => {
  const data = loadData();
  return data.history;
};

export const getFavorites = (): number[] => {
  const data = loadData();
  return data.favorites;
};

export const getSettings = (): Settings => {
  const data = loadData();
  return data.settings;
};

export const saveSettings = (settings: Settings): void => {
  const data = loadData();
  data.settings = { ...data.settings, ...settings };
  saveData(data);
};

