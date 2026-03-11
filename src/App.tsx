import { useCallback } from 'react';
import {
  Box,
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { CategoryFilter } from './components/CategoryFilter';
import { ErrorScreen, LoadingScreen } from './components/StatusScreen';
import { SearchBar } from './components/SearchBar';
import { SoundGrid } from './components/SoundGrid';
import { useLibraryState } from './hooks/useLibraryState';
import { useSounds } from './hooks/useSounds';

function App() {
  const { sounds, status, errorMessage, playSound, reload } = useSounds();
  const {
    favorites,
    favoriteSounds,
    historySounds,
    recordPlayback,
    searchQuery,
    selectedTags,
    setSearchQuery,
    tags,
    toggleFavorite,
    toggleTag,
    visibleSounds,
  } = useLibraryState(sounds);

  const handlePlay = useCallback(
    async (id: number) => {
      await playSound(id);
      recordPlayback(id);
    },
    [playSound, recordPlayback]
  );

  if (status === 'loading') {
    return <LoadingScreen message="Loading sounds..." />;
  }

  if (status === 'error' && errorMessage) {
    return (
      <ErrorScreen
        title="Failed to load sounds"
        message={errorMessage}
        actionLabel="Retry"
        onAction={() => void reload()}
      />
    );
  }

  return (
    <Box minH="100vh" bg="gray.800" pb={8}>
      <Container maxW="container.xl" px={4} pt={4}>
        <VStack spacing={4} align="stretch">
          <Heading size="xl" textAlign="center" color="white">
            Soundbored
          </Heading>

          <Tabs colorScheme="blue" variant="enclosed">
            <TabList>
              <Tab color="gray.300" _selected={{ color: 'white', bg: 'gray.700' }}>
                All Sounds ({sounds.length})
              </Tab>
              <Tab color="gray.300" _selected={{ color: 'white', bg: 'gray.700' }}>
                Favorites ({favorites.length})
              </Tab>
              <Tab color="gray.300" _selected={{ color: 'white', bg: 'gray.700' }}>
                History ({historySounds.length})
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder='Search sounds... (use "quotes" for exact match)'
                  />

                  <CategoryFilter
                    tags={tags}
                    selectedTags={selectedTags}
                    onToggleTag={toggleTag}
                  />

                  <Text fontSize="sm" color="gray.400">
                    Showing {visibleSounds.length} of {sounds.length} sounds
                  </Text>

                  <SoundGrid
                    sounds={visibleSounds}
                    favorites={favorites}
                    emptyMessage="No sounds found."
                    onPlay={handlePlay}
                    onToggleFavorite={toggleFavorite}
                  />
                </VStack>
              </TabPanel>

              <TabPanel>
                <SoundGrid
                  sounds={favoriteSounds}
                  favorites={favorites}
                  emptyMessage="No favorites yet. Star a sound to keep it handy."
                  onPlay={handlePlay}
                  onToggleFavorite={toggleFavorite}
                />
              </TabPanel>

              <TabPanel>
                <SoundGrid
                  sounds={historySounds}
                  favorites={favorites}
                  emptyMessage="No history yet. Play a sound to populate this list."
                  onPlay={handlePlay}
                  onToggleFavorite={toggleFavorite}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
}

export default App;
