import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
} from '@chakra-ui/react';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import { SoundTile } from './components/SoundTile';
import { FavoritesPanel } from './components/FavoritesPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { useSounds } from './hooks/useSounds';
import { fuzzySearch, filterByTags, getAllTags } from './utils/search';
import {
  getFavorites,
  getHistory,
  toggleFavorite as toggleFavoriteStorage,
} from './services/storage';
import { HISTORY_REFRESH_INTERVAL_MS } from './constants';

function App() {
  const { sounds, loading, error, playSound } = useSounds();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [history, setHistory] = useState<ReturnType<typeof getHistory>>([]);

  // Load favorites and history from storage
  useEffect(() => {
    setFavorites(getFavorites());
    setHistory(getHistory());
  }, []);

  // Refresh history periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setHistory(getHistory());
    }, HISTORY_REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const handleToggleFavorite = useCallback((id: number) => {
    toggleFavoriteStorage(id);
    setFavorites(getFavorites());
  }, []);

  const handleToggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const handlePlay = useCallback(
    async (id: number) => {
      await playSound(id);
      setHistory(getHistory());
    },
    [playSound]
  );

  // Filter sounds based on search and tags
  const filteredSounds = useMemo(
    () => filterByTags(fuzzySearch(searchQuery, sounds), selectedTags),
    [searchQuery, sounds, selectedTags]
  );

  const allTags = useMemo(() => getAllTags(sounds), [sounds]);

  if (loading) {
    return (
      <Box
        minH="100vh"
        bg="gray.800"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="white" fontSize="lg">
            Loading sounds...
          </Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg="gray.800" p={4}>
        <Container maxW="container.md" pt={8}>
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
            borderRadius="lg"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Failed to load sounds
            </AlertTitle>
            <AlertDescription maxWidth="sm">{error}</AlertDescription>
            <Button mt={4} colorScheme="red" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.800" pb={8}>
      <Container maxW="container.xl" pt={4} px={4}>
        <VStack spacing={4} align="stretch">
          <Heading color="white" size="xl" textAlign="center">
            🎵 Soundbored
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
                History
              </Tab>
            </TabList>

            <TabPanels>
              {/* All Sounds Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder='Search sounds... (use "quotes" for exact match)'
                  />

                  {allTags.length > 0 && (
                    <CategoryFilter
                      tags={allTags}
                      selectedTags={selectedTags}
                      onToggleTag={handleToggleTag}
                    />
                  )}

                  <Text color="gray.400" fontSize="sm">
                    Showing {filteredSounds.length} of {sounds.length} sounds
                  </Text>

                  {filteredSounds.length === 0 ? (
                    <Box textAlign="center" py={8}>
                      <Text color="gray.400" fontSize="lg">
                        No sounds found
                      </Text>
                    </Box>
                  ) : (
                    <SimpleGrid columns={[2, 3, 4, 6]} spacing={3}>
                      {filteredSounds.map((sound) => (
                        <SoundTile
                          key={sound.id}
                          sound={sound}
                          isFavorite={favorites.includes(sound.id)}
                          onPlay={handlePlay}
                          onToggleFavorite={handleToggleFavorite}
                        />
                      ))}
                    </SimpleGrid>
                  )}
                </VStack>
              </TabPanel>

              {/* Favorites Tab */}
              <TabPanel>
                <FavoritesPanel
                  sounds={sounds}
                  favorites={favorites}
                  onPlay={handlePlay}
                  onToggleFavorite={handleToggleFavorite}
                />
              </TabPanel>

              {/* History Tab */}
              <TabPanel>
                <HistoryPanel
                  sounds={sounds}
                  history={history}
                  favorites={favorites}
                  onPlay={handlePlay}
                  onToggleFavorite={handleToggleFavorite}
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

