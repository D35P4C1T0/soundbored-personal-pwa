import { SimpleGrid } from '@chakra-ui/react';
import { Sound } from '../types';
import { EmptyState } from './EmptyState';
import { SoundTile } from './SoundTile';

interface SoundGridProps {
  readonly sounds: readonly Sound[];
  readonly favorites: readonly number[];
  readonly emptyMessage: string;
  onPlay: (id: number) => Promise<void>;
  onToggleFavorite: (id: number) => void;
}

export function SoundGrid({
  sounds,
  favorites,
  emptyMessage,
  onPlay,
  onToggleFavorite,
}: SoundGridProps) {
  if (sounds.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <SimpleGrid columns={[2, 3, 4, 6]} spacing={3}>
      {sounds.map((sound) => (
        <SoundTile
          key={sound.id}
          sound={sound}
          isFavorite={favorites.includes(sound.id)}
          onPlay={onPlay}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </SimpleGrid>
  );
}
