export const STORAGE_KEY = 'soundbored-data';

export const MAX_HISTORY_ENTRIES = 50;
export const DISPLAY_HISTORY_LIMIT = 12;
export const MAX_TAGS_DISPLAY = 3;

export const API_BASE = '/api';

export const API_ENDPOINTS = {
  sounds: '/sounds',
  playSound: (id: number) => `/sounds/${id}/play`,
} as const;
