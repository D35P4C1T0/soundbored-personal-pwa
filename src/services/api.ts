import { Sound } from '../types';

const API_BASE = '/api';

export const fetchSounds = async (): Promise<Sound[]> => {
  try {
    const response = await fetch(`${API_BASE}/sounds`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Handle both array response and nested data structure
    if (Array.isArray(data)) {
      return data;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    }
    throw new Error('Invalid API response structure');
  } catch (error) {
    console.error('Failed to fetch sounds:', error);
    throw error;
  }
};

export const playSound = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/sounds/${id}/play`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(`Failed to play sound: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to play sound:', error);
    throw error;
  }
};

