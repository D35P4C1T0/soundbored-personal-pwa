import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { Sound } from '../types';
import { SoundTile } from './SoundTile';

interface FavoritesPanelProps {
  sounds: Sound[];
  favorites: number[];
  onPlay: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

export const FavoritesPanel: React.FC<FavoritesPanelProps> = ({
  sounds,
  favorites,
  onPlay,
  onToggleFavorite,
}) => {
  const favoriteSounds = sounds.filter((s) => favorites.includes(s.id));

  if (favoriteSounds.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.400">No favorites yet. Tap the star icon on sounds to add them!</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="md" mb={4} color="white">
        Favorites
      </Heading>
      <SimpleGrid columns={[2, 3, 4, 6]} spacing={3}>
        {favoriteSounds.map((sound) => (
          <SoundTile
            key={sound.id}
            sound={sound}
            isFavorite={true}
            onPlay={onPlay}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

