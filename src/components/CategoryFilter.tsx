import { Box, Button, Wrap, WrapItem, Badge } from '@chakra-ui/react';
import { memo } from 'react';

interface CategoryFilterProps {
  tags: readonly string[];
  selectedTags: readonly string[];
  onToggleTag: (tag: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = memo(({
  tags,
  selectedTags,
  onToggleTag,
}) => {
  if (tags.length === 0) return null;

  return (
    <Box role="group" aria-label="Category filters">
      <Wrap spacing={2}>
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          
          return (
            <WrapItem key={tag}>
              <Button
                size="sm"
                variant={isSelected ? 'solid' : 'outline'}
                colorScheme={isSelected ? 'blue' : 'gray'}
                onClick={() => onToggleTag(tag)}
                aria-pressed={isSelected}
                aria-label={`Filter by ${tag} tag`}
                rightIcon={
                  isSelected ? (
                    <Badge colorScheme="blue">
                      {selectedTags.indexOf(tag) + 1}
                    </Badge>
                  ) : undefined
                }
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

CategoryFilter.displayName = 'CategoryFilter';

