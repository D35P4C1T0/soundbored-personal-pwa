// Storage keys
export const STORAGE_KEY = 'soundbored-data';

// History limits
export const MAX_HISTORY_ENTRIES = 50;
export const DISPLAY_HISTORY_LIMIT = 12;

// UI constants
export const MAX_TAGS_DISPLAY = 3;
export const HISTORY_REFRESH_INTERVAL_MS = 5000;
export const TOAST_DURATION_SUCCESS = 2000;
export const TOAST_DURATION_ERROR = 3000;

// API endpoints
export const API_BASE = '/api';
export const API_ENDPOINTS = {
  SOUNDS: '/sounds',
  PLAY_SOUND: (id: number) => `/sounds/${id}/play`,
} as const;

