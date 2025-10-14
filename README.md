# Soundbored PWA

A Progressive Web App (PWA) for controlling your Soundbored Discord bot. Mobile-first design with big, tappable tiles for easy sound triggering.

## Features

- 🎵 **Mobile-First Design** - Large, tappable sound tiles optimized for touchscreens
- 🔍 **Fuzzy Search** - Quick search with fuzzy matching and exact search with quotes
- ⭐ **Favorites** - Mark your favorite sounds for quick access
- 🕐 **History** - See recently played sounds
- 🏷️ **Tag Filtering** - Filter sounds by tags/categories
- 📱 **PWA Support** - Install as an app on mobile devices
- 🔐 **Secure** - API token never exposed to the client (handled by backend proxy)
- 🐳 **Docker Ready** - Easy deployment with Docker Compose

## Quick Start with Docker Compose

1. Create a `.env` file:

```bash
SOUNDBORED_API_URL=https://your-soundboard-api.com/api
SOUNDBORED_TOKEN=your-api-token-here
PORT=3000
```

2. Start the container:

```bash
docker-compose up -d
```

3. Open `http://localhost:3000` in your browser

## Development Setup

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Create a `.env` file (see `.env.example`)

3. Start the development server:

```bash
# Terminal 1: Start Vite dev server
npm run dev

# Terminal 2: Start backend proxy
npm run server:dev
```

4. Open `http://localhost:5173` in your browser

## Building for Production

```bash
# Build the frontend
pnpm run build

# Start the production server
pnpm run server
```

## Docker Deployment

### Build the image:

```bash
docker build -t soundbored-pwa .
```

### Run with docker-compose:

```bash
docker-compose up -d
```

### Run manually:

```bash
docker run -d \
  -p 3000:3000 \
  -e SOUNDBORED_API_URL=https://your-api.com/api \
  -e SOUNDBORED_TOKEN=your-token \
  --name soundbored-pwa \
  soundbored-pwa
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SOUNDBORED_API_URL` | Yes | - | Full URL to your Soundbored API (with `/api`) |
| `SOUNDBORED_TOKEN` | Yes | - | API authentication token |
| `PORT` | No | 3000 | Port for the server to listen on |

## Architecture

### Frontend
- **React** + **Vite** - Fast, modern build tooling
- **Chakra UI** - Component library with great mobile support
- **TypeScript** - Type safety

### Backend
- **Express** - Minimal Node.js server
- Proxies API requests to keep token secure
- Serves built frontend static files

### Features
- **Search**: Fuzzy search with option for exact matching using quotes
- **Favorites**: Stored in browser localStorage
- **History**: Last 50 played sounds stored locally
- **Tags**: Filter sounds by tags/categories
- **PWA**: Installable, works offline (cached sounds list)

## Project Structure

```
pwa/
├── src/
│   ├── components/       # React components
│   │   ├── SoundTile.tsx
│   │   ├── SearchBar.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── FavoritesPanel.tsx
│   │   └── HistoryPanel.tsx
│   ├── hooks/           # Custom React hooks
│   │   └── useSounds.ts
│   ├── services/        # API and storage services
│   │   ├── api.ts
│   │   └── storage.ts
│   ├── utils/           # Utility functions
│   │   └── search.ts
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── types.ts         # TypeScript types
├── server/
│   └── index.js         # Express proxy server
├── public/              # Static assets
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Usage

### Search
- Type to search sounds by filename or tags
- Use quotes for exact matching: `"airhorn"`
- Clear search by clearing the input

### Favorites
- Click the star icon on any sound tile
- Access all favorites in the "Favorites" tab

### History
- Recently played sounds appear in the "History" tab
- Shows last 12 played sounds

### Tags
- Click tag buttons to filter sounds
- Multiple tags can be selected
- Badge shows filter priority

### Install as App
- On mobile: Browser will prompt to "Add to Home Screen"
- On desktop: Look for install icon in address bar

## Troubleshooting

### Sounds won't play
- Check that `SOUNDBORED_API_URL` and `SOUNDBORED_TOKEN` are correct
- Verify the API is accessible from the server
- Check server logs: `docker-compose logs -f`

### Can't connect to API
- Ensure the API URL includes `/api` at the end
- Check network connectivity
- Verify token is valid

### PWA not installing
- PWA requires HTTPS in production (except localhost)
- Ensure service worker is registered
- Check browser console for errors

## License

MIT

## Credits

Based on the [soundbored-cli](https://github.com/christomitov/soundbored-cli) project.

