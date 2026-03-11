import { memo } from 'react';
import { Badge, Box, Button, Wrap, WrapItem } from '@chakra-ui/react';

interface CategoryFilterProps {
  readonly tags: readonly string[];
  readonly selectedTags: readonly string[];
  onToggleTag: (tag: string) => void;
}

export const CategoryFilter = memo(function CategoryFilter({
  tags,
  selectedTags,
  onToggleTag,
}: CategoryFilterProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <Box role="group" aria-label="Category filters">
      <Wrap spacing={2}>
        {tags.map((tag) => {
          const selectedIndex = selectedTags.indexOf(tag);
          const isSelected = selectedIndex >= 0;

          return (
            <WrapItem key={tag}>
              <Button
                size="sm"
                variant={isSelected ? 'solid' : 'outline'}
                colorScheme={isSelected ? 'blue' : 'gray'}
                aria-pressed={isSelected}
                aria-label={`Filter by ${tag}`}
                rightIcon={
                  isSelected ? <Badge colorScheme="blue">{selectedIndex + 1}</Badge> : undefined
                }
                onClick={() => onToggleTag(tag)}
              >
                {tag}
              </Button>
            </WrapItem>
          );
        })}
      </Wrap>
    </Box>
  );
});
