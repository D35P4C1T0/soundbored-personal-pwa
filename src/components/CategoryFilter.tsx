import { Box, Button, Wrap, WrapItem, Badge } from '@chakra-ui/react';

interface CategoryFilterProps {
  tags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  tags,
  selectedTags,
  onToggleTag,
}) => {
  if (tags.length === 0) return null;

  return (
    <Box>
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
                rightIcon={
                  isSelected ? <Badge colorScheme="blue">{selectedTags.indexOf(tag) + 1}</Badge> : undefined
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
};

