import { Sound } from '../types';

export const fuzzySearch = (query: string, sounds: Sound[]): Sound[] => {
  if (!query) return sounds;
  
  const lowerQuery = query.toLowerCase();
  
  // Check if search starts with a quote for exact matching
  const isExactMatch = query.startsWith('"');
  
  if (isExactMatch) {
    // Remove quotes
    let exactQuery = query.slice(1);
    if (exactQuery.endsWith('"')) {
      exactQuery = exactQuery.slice(0, -1);
    }
    exactQuery = exactQuery.toLowerCase();
    
    return sounds.filter(sound => {
      const searchableText = sound.filename.toLowerCase();
      // Escape special regex characters
      const escapedQuery = exactQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Match at start of string or after space/punctuation
      const wordBoundaryRegex = new RegExp(`(^|\\s|[^a-zA-Z0-9])${escapedQuery}`, 'i');
      return wordBoundaryRegex.test(searchableText);
    });
  }
  
  // Simple fuzzy search implementation
  return sounds.filter(sound => {
    const searchableText = `${sound.filename} ${sound.tags?.join(' ') || ''}`.toLowerCase();
    
    // Check if all characters of query appear in order
    let textIndex = 0;
    for (let i = 0; i < lowerQuery.length; i++) {
      const char = lowerQuery[i];
      const foundIndex = searchableText.indexOf(char, textIndex);
      if (foundIndex === -1) return false;
      textIndex = foundIndex + 1;
    }
    return true;
  }).sort((a, b) => {
    // Prioritize exact matches at start
    const aText = a.filename.toLowerCase();
    const bText = b.filename.toLowerCase();
    const aStarts = aText.startsWith(lowerQuery);
    const bStarts = bText.startsWith(lowerQuery);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    // Then by includes
    const aIncludes = aText.includes(lowerQuery);
    const bIncludes = bText.includes(lowerQuery);
    if (aIncludes && !bIncludes) return -1;
    if (!aIncludes && bIncludes) return 1;
    // Finally alphabetically
    return aText.localeCompare(bText);
  });
};

export const filterByTags = (
  sounds: Sound[],
  selectedTags: readonly string[]
): Sound[] => {
  if (selectedTags.length === 0) return sounds;

  return sounds.filter((sound) => {
    if (!sound.tags) return false;
    return selectedTags.some((tag) => sound.tags!.includes(tag));
  });
};

export const getAllTags = (sounds: Sound[]): string[] => {
  const tagSet = new Set<string>();
  sounds.forEach(sound => {
    sound.tags?.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
};

