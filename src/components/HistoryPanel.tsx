import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { Sound, HistoryEntry } from '../types';
import { SoundTile } from './SoundTile';
import { DISPLAY_HISTORY_LIMIT } from '../constants';

interface HistoryPanelProps {
  sounds: Sound[];
  history: HistoryEntry[];
  favorites: number[];
  onPlay: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  sounds,
  history,
  favorites,
  onPlay,
  onToggleFavorite,
}) => {
  const historySounds = history
    .map((h) => sounds.find((s) => s.id === h.id))
    .filter((s): s is Sound => s !== undefined)
    .slice(0, DISPLAY_HISTORY_LIMIT);

  if (historySounds.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.400">No history yet. Play some sounds!</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="md" mb={4} color="white">
        Recently Played
      </Heading>
      <SimpleGrid columns={[2, 3, 4, 6]} spacing={3}>
        {historySounds.map((sound) => (
          <SoundTile
            key={sound.id}
            sound={sound}
            isFavorite={favorites.includes(sound.id)}
            onPlay={onPlay}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

