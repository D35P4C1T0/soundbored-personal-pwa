import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';

interface LoadingScreenProps {
  readonly message: string;
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.800">
      <VStack spacing={4}>
        <Spinner size="xl" thickness="4px" color="blue.500" />
        <Text fontSize="lg" color="white">
          {message}
        </Text>
      </VStack>
    </Box>
  );
}

interface ErrorScreenProps {
  readonly title: string;
  readonly message: string;
  readonly actionLabel: string;
  onAction: () => void;
}

export function ErrorScreen({ title, message, actionLabel, onAction }: ErrorScreenProps) {
  return (
    <Box minH="100vh" bg="gray.800" p={4}>
      <Container maxW="container.md" pt={8}>
        <Alert
          status="error"
          variant="subtle"
          display="flex"
          height="200px"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          borderRadius="lg"
          textAlign="center"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            {title}
          </AlertTitle>
          <AlertDescription maxW="sm">{message}</AlertDescription>
          <Button mt={4} colorScheme="red" onClick={onAction}>
            {actionLabel}
          </Button>
        </Alert>
      </Container>
    </Box>
  );
}
