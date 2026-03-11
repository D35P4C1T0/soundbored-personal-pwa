import { memo, useCallback } from 'react';
import { Box, IconButton, Text, useToast } from '@chakra-ui/react';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { MAX_TAGS_DISPLAY, TOAST_DURATION_MS } from '../constants';
import { Sound } from '../types';

interface SoundTileProps {
  readonly sound: Sound;
  readonly isFavorite: boolean;
  onPlay: (id: number) => Promise<void>;
  onToggleFavorite: (id: number) => void;
}

export const SoundTile = memo(function SoundTile({
  sound,
  isFavorite,
  onPlay,
  onToggleFavorite,
}: SoundTileProps) {
  const toast = useToast();

  const handlePlay = useCallback(async () => {
    try {
      await onPlay(sound.id);
      toast({
        title: 'Playing',
        description: sound.filename,
        status: 'success',
        duration: TOAST_DURATION_MS.success,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to play sound',
        status: 'error',
        duration: TOAST_DURATION_MS.error,
        isClosable: true,
      });
    }
  }, [onPlay, sound.filename, sound.id, toast]);

  const handleFavoriteClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onToggleFavorite(sound.id);
    },
    [onToggleFavorite, sound.id]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      event.preventDefault();
      void handlePlay();
    },
    [handlePlay]
  );

  return (
    <Box
      position="relative"
      display="flex"
      minH="96px"
      cursor="pointer"
      flexDirection="column"
      justifyContent="center"
      borderRadius="lg"
      bg="gray.700"
      p={4}
      role="button"
      tabIndex={0}
      aria-label={`Play sound: ${sound.filename}`}
      onClick={() => void handlePlay()}
      onKeyDown={handleKeyDown}
      transition="all 0.2s"
      _hover={{ bg: 'gray.600', transform: 'scale(1.02)' }}
      _active={{ transform: 'scale(0.98)' }}
      _focusVisible={{
        outline: '2px solid',
        outlineColor: 'blue.400',
        outlineOffset: '2px',
      }}
    >
      <IconButton
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        icon={isFavorite ? <FaStar /> : <FaRegStar />}
        size="sm"
        position="absolute"
        top={2}
        right={2}
        variant="ghost"
        colorScheme={isFavorite ? 'yellow' : 'gray'}
        onClick={handleFavoriteClick}
      />

      <Text pr={8} fontSize="md" fontWeight="bold" color="white" noOfLines={2}>
        {sound.filename}
      </Text>

      {sound.description ? (
        <Text mt={1} pr={8} fontSize="sm" color="gray.300" noOfLines={2}>
          {sound.description}
        </Text>
      ) : null}

      {sound.tags.length > 0 ? (
        <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
          {sound.tags.slice(0, MAX_TAGS_DISPLAY).map((tag) => (
            <Text
              key={tag}
              borderRadius="full"
              bg="blue.600"
              px={2}
              py={0.5}
              fontSize="xs"
              color="white"
            >
              {tag}
            </Text>
          ))}

          {sound.tags.length > MAX_TAGS_DISPLAY ? (
            <Text fontSize="xs" color="gray.400">
              +{sound.tags.length - MAX_TAGS_DISPLAY}
            </Text>
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
});
