import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: 'gray.800',
        color: 'white',
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Service worker is automatically registered by vite-plugin-pwa
// No manual registration needed

