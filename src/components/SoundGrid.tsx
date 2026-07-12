import { Sound } from '../types';
import { EmptyState } from './EmptyState';
import { SoundTile } from './SoundTile';

interface SoundGridProps { readonly sounds: readonly Sound[]; readonly favorites: readonly number[]; readonly emptyMessage: string; onPlay: (id: number) => Promise<void>; onToggleFavorite: (id: number) => void }

export function SoundGrid({ sounds, favorites, emptyMessage, onPlay, onToggleFavorite }: SoundGridProps) {
  if (!sounds.length) return <EmptyState message={emptyMessage} />;
  const favoriteIds = new Set(favorites);
  return <section className="sound-grid" aria-label="Sounds">{sounds.map((sound) => <SoundTile key={sound.id} sound={sound} isFavorite={favoriteIds.has(sound.id)} onPlay={onPlay} onToggleFavorite={onToggleFavorite} />)}</section>;
}
