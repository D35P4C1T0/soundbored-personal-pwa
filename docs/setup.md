# Setup

## Requirements

- Node.js 18+
- `pnpm`
- A Soundbored instance
- A personal API token created in Soundbored `Settings`

## Environment

Create `.env` from `env.template`:

```env
SOUNDBORED_API_URL=https://your-soundboard-url.com
SOUNDBORED_API_TOKEN=your-personal-api-token
PORT=3000
```

`SOUNDBORED_API_URL` accepts either the site URL or the `/api` URL. The proxy normalizes both.

## Local Development

1. Install dependencies: `pnpm install`
2. Start the frontend: `pnpm run dev`
3. Start the proxy server: `pnpm run server:dev`
4. Open `http://localhost:5173`

## Production

1. Build: `pnpm run build`
2. Start the proxy/static server: `pnpm run server`

## Docker

```bash
docker compose up -d
```

or:

```bash
docker build -t soundbored-pwa .
docker run -d \
  -p 3000:3000 \
  -e SOUNDBORED_API_URL=https://your-soundboard-url.com \
  -e SOUNDBORED_API_TOKEN=your-personal-api-token \
  --name soundbored-pwa \
  soundbored-pwa
```
