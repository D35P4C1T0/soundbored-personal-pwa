import { Component, ReactNode } from 'react';
import { Box, Container, Heading, Text, Button, Alert, AlertIcon } from '@chakra-ui/react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
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
              height="300px"
              borderRadius="lg"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <Heading mt={4} mb={2} fontSize="xl">
                Something went wrong
              </Heading>
              <Text maxWidth="sm" mb={4}>
                {this.state.error?.message || 'An unexpected error occurred'}
              </Text>
              <Button colorScheme="red" onClick={this.handleReset}>
                Reload Page
              </Button>
            </Alert>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

