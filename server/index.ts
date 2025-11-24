import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface EnvConfig {
  PORT: number;
  SOUNDBORED_API_URL: string;
  SOUNDBORED_TOKEN: string;
}

const validateEnv = (): EnvConfig => {
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const SOUNDBORED_API_URL = process.env.SOUNDBORED_API_URL;
  const SOUNDBORED_TOKEN = process.env.SOUNDBORED_TOKEN;

  if (!SOUNDBORED_API_URL || !SOUNDBORED_TOKEN) {
    console.error('ERROR: Missing required environment variables');
    console.error('Required: SOUNDBORED_API_URL, SOUNDBORED_TOKEN');
    console.error('Please check your .env file or environment configuration');
    process.exit(1);
  }

  // Validate URL format
  try {
    new URL(SOUNDBORED_API_URL);
  } catch {
    console.error('ERROR: SOUNDBORED_API_URL must be a valid URL');
    process.exit(1);
  }

  return {
    PORT,
    SOUNDBORED_API_URL,
    SOUNDBORED_TOKEN,
  };
};

const config = validateEnv();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Serve static files from dist directory
const distPath = join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// API proxy endpoints
app.get('/api/sounds', async (_req: Request, res: Response) => {
  try {
    const response = await fetch(`${config.SOUNDBORED_API_URL}/sounds`, {
      headers: {
        Authorization: `Bearer ${config.SOUNDBORED_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching sounds:', error);
    
    let message = 'Failed to fetch sounds';
    let statusCode = 500;
    
    if (error instanceof Error) {
      // Check for connection errors
      if (
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('ENOTFOUND') ||
        error.message.includes('ETIMEDOUT')
      ) {
        message = `Cannot connect to Soundbored API at ${config.SOUNDBORED_API_URL}. Please check your .env file and ensure the API server is running.`;
        statusCode = 503; // Service Unavailable
      } else {
        message = error.message;
      }
    }
    
    res.status(statusCode).json({
      error: 'Failed to fetch sounds',
      message,
    });
  }
});

app.post('/api/sounds/:id/play', async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate ID parameter
  const soundId = parseInt(id, 10);
  if (isNaN(soundId) || soundId < 0) {
    res.status(400).json({
      error: 'Invalid sound ID',
      message: 'Sound ID must be a positive number',
    });
    return;
  }

  try {
    const response = await fetch(
      `${config.SOUNDBORED_API_URL}/sounds/${soundId}/play`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.SOUNDBORED_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    // Check if response has content
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      res.json(data);
    } else {
      res.json({ success: true });
    }
  } catch (error) {
    console.error(`Error playing sound ${id}:`, error);
    
    let message = 'Failed to play sound';
    let statusCode = 500;
    
    if (error instanceof Error) {
      // Check for connection errors
      if (
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('ENOTFOUND') ||
        error.message.includes('ETIMEDOUT')
      ) {
        message = `Cannot connect to Soundbored API at ${config.SOUNDBORED_API_URL}. Please check your .env file and ensure the API server is running.`;
        statusCode = 503; // Service Unavailable
      } else {
        message = error.message;
      }
    }
    
    res.status(statusCode).json({
      error: 'Failed to play sound',
      message,
    });
  }
});

// Serve index.html for all other routes (SPA support)
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(join(distPath, 'index.html'));
});

// Start server
app.listen(config.PORT, () => {
  console.log(`🎵 Soundbored PWA server running on port ${config.PORT}`);
  console.log(`📡 Proxying to: ${config.SOUNDBORED_API_URL}`);
  console.log(`🌐 Open http://localhost:${config.PORT} in your browser`);
  console.log(`\n⚠️  Note: Make sure your Soundbored API is accessible at ${config.SOUNDBORED_API_URL}`);
  console.log(`   Connection errors will appear when making API requests.\n`);
});

