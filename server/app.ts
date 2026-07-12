import express, { Request, Response } from 'express';
import { join } from 'path';
import { EnvConfig } from './config';
import { requestSoundbored, sendProxyBody, sendProxyFailure } from './proxy';

const parseSoundId = (value: string): number | null => {
  const soundId = Number.parseInt(value, 10);
  return Number.isInteger(soundId) && soundId > 0 ? soundId : null;
};

export const createApp = (config: EnvConfig, distPath: string) => {
  const app = express();

  app.disable('x-powered-by');
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Frame-Options', 'DENY');
    next();
  });
  app.use(express.static(distPath));

  app.get('/api/sounds', async (_req: Request, res: Response) => {
    try {
      const upstream = await requestSoundbored(config, '/sounds');
      sendProxyBody(res, upstream.status, upstream.body);
    } catch (error) {
      sendProxyFailure(res, config, 'Failed to fetch sounds', error);
    }
  });

  app.post('/api/sounds/:id/play', async (req: Request, res: Response) => {
    const soundId = parseSoundId(req.params.id);

    if (soundId === null) {
      res.status(400).json({
        error: 'Invalid sound ID',
        message: 'Sound ID must be a positive integer',
      });
      return;
    }

    try {
      const upstream = await requestSoundbored(config, `/sounds/${soundId}/play`, {
        method: 'POST',
      });

      sendProxyBody(res, upstream.status, upstream.body);
    } catch (error) {
      sendProxyFailure(res, config, `Failed to play sound ${soundId}`, error);
    }
  });

  app.post('/api/sounds/stop', async (_req: Request, res: Response) => {
    try {
      const upstream = await requestSoundbored(config, '/sounds/stop', {
        method: 'POST',
      });

      sendProxyBody(res, upstream.status, upstream.body);
    } catch (error) {
      sendProxyFailure(res, config, 'Failed to stop playback', error);
    }
  });

  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(join(distPath, 'index.html'));
  });

  return app;
};
