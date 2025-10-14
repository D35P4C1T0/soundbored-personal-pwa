import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configuration from environment variables
const PORT = process.env.PORT || 3000;
const SOUNDBORED_API_URL = process.env.SOUNDBORED_API_URL;
const SOUNDBORED_TOKEN = process.env.SOUNDBORED_TOKEN;

// Validate required environment variables
if (!SOUNDBORED_API_URL || !SOUNDBORED_TOKEN) {
  console.error('ERROR: Missing required environment variables');
  console.error('Required: SOUNDBORED_API_URL, SOUNDBORED_TOKEN');
  console.error('Please check your .env file or environment configuration');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from dist directory
const distPath = join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// API proxy endpoints
app.get('/api/sounds', async (req, res) => {
  try {
    const response = await fetch(`${SOUNDBORED_API_URL}/sounds`, {
      headers: {
        'Authorization': `Bearer ${SOUNDBORED_TOKEN}`,
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
    res.status(500).json({
      error: 'Failed to fetch sounds',
      message: error.message,
    });
  }
});

app.post('/api/sounds/:id/play', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await fetch(`${SOUNDBORED_API_URL}/sounds/${id}/play`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SOUNDBORED_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

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
    res.status(500).json({
      error: 'Failed to play sound',
      message: error.message,
    });
  }
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🎵 Soundbored PWA server running on port ${PORT}`);
  console.log(`📡 Proxying to: ${SOUNDBORED_API_URL}`);
  console.log(`🌐 Open http://localhost:${PORT} in your browser`);
});

