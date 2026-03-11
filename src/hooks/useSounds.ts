import { useCallback, useEffect, useState } from 'react';
import { fetchSounds, playSound as requestPlaySound } from '../services/api';
import { Sound } from '../types';

type SoundsState =
  | {
      readonly status: 'loading';
      readonly sounds: readonly Sound[];
      readonly errorMessage: null;
    }
  | {
      readonly status: 'ready';
      readonly sounds: readonly Sound[];
      readonly errorMessage: null;
    }
  | {
      readonly status: 'error';
      readonly sounds: readonly Sound[];
      readonly errorMessage: string;
    };

const LOADING_STATE: SoundsState = {
  status: 'loading',
  sounds: [],
  errorMessage: null,
};

export interface UseSoundsResult {
  readonly sounds: readonly Sound[];
  readonly status: SoundsState['status'];
  readonly errorMessage: string | null;
  reload: () => Promise<void>;
  playSound: (id: number) => Promise<void>;
}

export const useSounds = (): UseSoundsResult => {
  const [state, setState] = useState<SoundsState>(LOADING_STATE);

  const reload = useCallback(async () => {
    setState((current) => ({
      status: 'loading',
      sounds: current.sounds,
      errorMessage: null,
    }));

    try {
      const sounds = await fetchSounds();

      setState({
        status: 'ready',
        sounds,
        errorMessage: null,
      });
    } catch (error) {
      setState((current) => ({
        status: 'error',
        sounds: current.sounds,
        errorMessage: error instanceof Error ? error.message : 'Failed to load sounds',
      }));
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const playSound = useCallback(async (id: number) => {
    await requestPlaySound(id);
  }, []);

  return {
    sounds: state.sounds,
    status: state.status,
    errorMessage: state.errorMessage,
    reload,
    playSound,
  };
};
