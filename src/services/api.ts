import { Sound } from '../types';
import { API_BASE, API_ENDPOINTS } from '../constants';

export const fetchSounds = async (): Promise<Sound[]> => {
  try {
    const response = await fetch(`${API_BASE}${API_ENDPOINTS.SOUNDS}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Handle both array response and nested data structure
    if (Array.isArray(data)) {
      return data;
    }
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    }
    throw new Error('Invalid API response structure');
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch sounds';
    throw new Error(message);
  }
};

export const playSound = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE}${API_ENDPOINTS.PLAY_SOUND(id)}`, {
    method: 'POST',
  });
  if (!response.ok) {
    const message =
      response.status === 404
        ? 'Sound not found'
        : `Failed to play sound: ${response.status}`;
    throw new Error(message);
  }
};

