import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { MAX_TAGS_DISPLAY } from '../constants';
import { Sound } from '../types';

interface SoundTileProps {
  readonly sound: Sound;
  readonly isFavorite: boolean;
  onPlay: (id: number) => Promise<void>;
  onToggleFavorite: (id: number) => void;
}

type PlayState =
  | { readonly status: 'idle' | 'playing'; readonly message: null }
  | { readonly status: 'error'; readonly message: string };

const IDLE_STATE: PlayState = { status: 'idle', message: null };

export const SoundTile = memo(function SoundTile({
  sound,
  isFavorite,
  onPlay,
  onToggleFavorite,
}: SoundTileProps) {
  const [playState, setPlayState] = useState<PlayState>(IDLE_STATE);
  const resetTimer = useRef<number>();

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const resetLater = useCallback((delay: number) => {
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setPlayState(IDLE_STATE), delay);
  }, []);

  const handlePlay = useCallback(async () => {
    if (playState.status === 'playing') return;

    setPlayState({ status: 'playing', message: null });

    try {
      await onPlay(sound.id);
      resetLater(650);
    } catch (error) {
      setPlayState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Could not play this sound',
      });
      resetLater(3000);
    }
  }, [onPlay, playState.status, resetLater, sound.id]);

  const hiddenTagCount = sound.tags.length - MAX_TAGS_DISPLAY;

  return (
    <article className={`sound-card ${playState.status}`}>
      <button
        className="play"
        onClick={() => void handlePlay()}
        disabled={playState.status === 'playing'}
        aria-label={`Play ${sound.filename}`}
      >
        <span className="play-icon" aria-hidden="true">
          {playState.status === 'playing' ? '■' : playState.status === 'error' ? '!' : '▶'}
        </span>
        <span className="sound-copy">
          <strong>{sound.filename}</strong>
          {playState.status === 'error' ? (
            <small className="play-error" role="alert">
              {playState.message}
            </small>
          ) : (
            sound.description && <small>{sound.description}</small>
          )}
          {!!sound.tags.length && (
            <span className="tags">
              {sound.tags.slice(0, MAX_TAGS_DISPLAY).map((tag) => (
                <em key={tag}>{tag}</em>
              ))}
              {hiddenTagCount > 0 && <em>+{hiddenTagCount}</em>}
            </span>
          )}
        </span>
      </button>
      <button
        className={`favorite ${isFavorite ? 'saved' : ''}`}
        onClick={() => onToggleFavorite(sound.id)}
        aria-label={
          isFavorite
            ? `Remove ${sound.filename} from favorites`
            : `Add ${sound.filename} to favorites`
        }
        aria-pressed={isFavorite}
      >
        {isFavorite ? '★' : '☆'}
      </button>
    </article>
  );
});
