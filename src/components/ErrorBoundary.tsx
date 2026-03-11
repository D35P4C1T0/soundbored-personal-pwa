import { Component, ReactNode } from 'react';
import { Alert, AlertIcon, Box, Button, Container, Heading, Text } from '@chakra-ui/react';

interface ErrorBoundaryProps {
  readonly children: ReactNode;
}

interface ErrorBoundaryState {
  readonly error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Unhandled UI error', error, errorInfo);
  }

  private readonly handleReset = (): void => {
    this.setState({ error: null });
    window.location.reload();
  };

  public render(): ReactNode {
    const { error } = this.state;

    if (!error) {
      return this.props.children;
    }

    return (
      <Box minH="100vh" bg="gray.800" p={4}>
        <Container maxW="container.md" pt={8}>
          <Alert
            status="error"
            variant="subtle"
            display="flex"
            height="300px"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            borderRadius="lg"
            textAlign="center"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <Heading mt={4} mb={2} fontSize="xl">
              Something went wrong
            </Heading>
            <Text mb={4} maxW="sm">
              {error.message || 'An unexpected error occurred'}
            </Text>
            <Button colorScheme="red" onClick={this.handleReset}>
              Reload page
            </Button>
          </Alert>
        </Container>
      </Box>
    );
  }
}
