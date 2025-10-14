import { useState, useEffect } from 'react';
import { Sound } from '../types';
import { fetchSounds, playSound as apiPlaySound } from '../services/api';
import { addToHistory } from '../services/storage';

export const useSounds = () => {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadSounds = async () => {
      try {
        setLoading(true);
        const data = await fetchSounds();
        setSounds(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load sounds');
      } finally {
        setLoading(false);
      }
    };

    loadSounds();
  }, []);

  const playSound = async (id: number) => {
    try {
      setIsPlaying(true);
      await apiPlaySound(id);
      addToHistory(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to play sound');
      throw err;
    } finally {
      setIsPlaying(false);
    }
  };

  return { sounds, loading, error, isPlaying, playSound };
};

