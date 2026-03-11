import 'dotenv/config';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createApp } from './app';
import { readConfig } from './config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  const config = readConfig(process.env);
  const distPath = join(__dirname, '..', 'dist');
  const app = createApp(config, distPath);

  app.listen(config.port, () => {
    console.log(`Soundbored PWA server running on port ${config.port}`);
    console.log(`Proxying to ${config.soundboredApiUrl}`);
    console.log(`Open http://localhost:${config.port} in your browser`);
  });
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Failed to start server');
  process.exit(1);
}
