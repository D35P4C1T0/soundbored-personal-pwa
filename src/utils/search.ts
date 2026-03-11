import { Sound } from '../types';

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalize = (value: string): string => value.trim().toLowerCase();

const matchesExactQuery = (sound: Sound, query: string): boolean => {
  const pattern = new RegExp(`(^|\\s|[^a-z0-9])${escapeRegExp(query)}`, 'i');
  return pattern.test(sound.filename.toLowerCase());
};

const matchesFuzzyQuery = (candidate: string, query: string): boolean => {
  let candidateIndex = 0;

  for (const character of query) {
    const nextIndex = candidate.indexOf(character, candidateIndex);

    if (nextIndex === -1) {
      return false;
    }

    candidateIndex = nextIndex + 1;
  }

  return true;
};

const getSearchableText = (sound: Sound): string =>
  `${sound.filename} ${sound.tags.join(' ')}`.toLowerCase();

const compareSearchRank = (left: Sound, right: Sound, query: string): number => {
  const normalizedQuery = normalize(query);
  const leftName = left.filename.toLowerCase();
  const rightName = right.filename.toLowerCase();

  const leftStartsWith = leftName.startsWith(normalizedQuery);
  const rightStartsWith = rightName.startsWith(normalizedQuery);

  if (leftStartsWith !== rightStartsWith) {
    return leftStartsWith ? -1 : 1;
  }

  const leftIncludes = leftName.includes(normalizedQuery);
  const rightIncludes = rightName.includes(normalizedQuery);

  if (leftIncludes !== rightIncludes) {
    return leftIncludes ? -1 : 1;
  }

  return leftName.localeCompare(rightName);
};

const stripExactQuerySyntax = (query: string): string => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery.startsWith('"')) {
    return trimmedQuery;
  }

  const unwrappedQuery = trimmedQuery.slice(1);
  return unwrappedQuery.endsWith('"') ? unwrappedQuery.slice(0, -1) : unwrappedQuery;
};

export const filterSounds = (
  sounds: readonly Sound[],
  query: string,
  selectedTags: readonly string[]
): Sound[] => {
  const normalizedQuery = normalize(query);
  const exactQuery = normalize(stripExactQuerySyntax(query));
  const isExactQuery = query.trim().startsWith('"');

  return sounds
    .filter((sound) => {
      if (selectedTags.length > 0 && !selectedTags.some((tag) => sound.tags.includes(tag))) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      if (isExactQuery) {
        return exactQuery.length > 0 && matchesExactQuery(sound, exactQuery);
      }

      return matchesFuzzyQuery(getSearchableText(sound), normalizedQuery);
    })
    .sort((left, right) => compareSearchRank(left, right, query));
};

export const getAllTags = (sounds: readonly Sound[]): string[] => {
  const tags = new Set<string>();

  for (const sound of sounds) {
    for (const tag of sound.tags) {
      tags.add(tag);
    }
  }

  return [...tags].sort();
};
