import { Box, Text } from '@chakra-ui/react';

interface EmptyStateProps {
  readonly message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <Box py={8} textAlign="center">
      <Text fontSize="lg" color="gray.400">
        {message}
      </Text>
    </Box>
  );
}
