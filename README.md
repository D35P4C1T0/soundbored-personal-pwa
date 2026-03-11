# Soundbored PWA

Thin mobile-first web client for [christomitov/soundbored](https://github.com/christomitov/soundbored). It keeps the personal API token on the server side, proxies the current Soundbored API, and provides fast access to sounds, favorites, and recent history.

## What Changed

- Strict runtime validation for API and localStorage input
- Smaller React and server modules with clearer responsibilities
- Consolidated docs under [`docs/`](./docs/README.md)
- Current Soundbored token flow: use a personal API token from Soundbored `Settings`

## Quick Start

1. Copy `env.template` to `.env`
2. Set:

```env
SOUNDBORED_API_URL=https://your-soundboard-url.com
SOUNDBORED_API_TOKEN=your-personal-api-token
PORT=3000
```

3. Install dependencies with `pnpm install`
4. Run `pnpm run dev` and `pnpm run server:dev`

For production, build with `pnpm run build` and serve with `pnpm run server`.

## Commands

- `pnpm run dev`
- `pnpm run server:dev`
- `pnpm run build`
- `pnpm run server`
- `pnpm run type-check`

## Docs

- [Docs index](./docs/README.md)
- [Setup](./docs/setup.md)
- [Architecture](./docs/architecture.md)
- [Troubleshooting](./docs/troubleshooting.md)
