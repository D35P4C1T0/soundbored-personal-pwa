import { Box, Text, IconButton, useToast } from '@chakra-ui/react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { Sound } from '../types';

interface SoundTileProps {
  sound: Sound;
  isFavorite: boolean;
  onPlay: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

export const SoundTile: React.FC<SoundTileProps> = ({
  sound,
  isFavorite,
  onPlay,
  onToggleFavorite,
}) => {
  const toast = useToast();

  const handlePlay = async () => {
    try {
      await onPlay(sound.id);
      toast({
        title: 'Playing',
        description: sound.filename,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to play sound',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(sound.id);
  };

  return (
    <Box
      position="relative"
      bg="gray.700"
      borderRadius="lg"
      p={4}
      cursor="pointer"
      onClick={handlePlay}
      transition="all 0.2s"
      _hover={{
        bg: 'gray.600',
        transform: 'scale(1.02)',
      }}
      _active={{
        transform: 'scale(0.98)',
      }}
      minH="80px"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <IconButton
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        icon={isFavorite ? <FaStar /> : <FaRegStar />}
        size="sm"
        position="absolute"
        top={2}
        right={2}
        colorScheme={isFavorite ? 'yellow' : 'gray'}
        variant="ghost"
        onClick={handleFavoriteClick}
      />
      
      <Text
        fontWeight="bold"
        fontSize="md"
        color="white"
        noOfLines={2}
        pr={8}
      >
        {sound.filename}
      </Text>
      
      {sound.tags && sound.tags.length > 0 && (
        <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
          {sound.tags.slice(0, 3).map((tag) => (
            <Text
              key={tag}
              fontSize="xs"
              bg="blue.600"
              color="white"
              px={2}
              py={0.5}
              borderRadius="full"
            >
              {tag}
            </Text>
          ))}
          {sound.tags.length > 3 && (
            <Text fontSize="xs" color="gray.400">
              +{sound.tags.length - 3}
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
};

