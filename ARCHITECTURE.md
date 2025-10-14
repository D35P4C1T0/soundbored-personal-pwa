# Soundbored PWA - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client (Browser)                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    React PWA (Vite)                   │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │  Components │  │    Hooks     │  │   Storage   │  │  │
│  │  │  - SoundTile│  │  - useSounds │  │  - Favorites│  │  │
│  │  │  - SearchBar│  │              │  │  - History  │  │  │
│  │  │  - Panels   │  │              │  │  - Settings │  │  │
│  │  └─────────────┘  └──────────────┘  └─────────────┘  │  │
│  │         │                  │                │          │  │
│  │         └──────────────────┼────────────────┘          │  │
│  │                            │                            │  │
│  │                      ┌─────▼──────┐                    │  │
│  │                      │ API Service│                    │  │
│  │                      └─────┬──────┘                    │  │
│  └────────────────────────────┼───────────────────────────┘  │
└────────────────────────────────┼──────────────────────────────┘
                                 │ HTTP Requests
                                 │ /api/sounds
                                 │ /api/sounds/:id/play
┌────────────────────────────────▼──────────────────────────────┐
│                    Express Proxy Server                       │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Routes:                                               │  │
│  │  GET  /api/sounds        → Fetch all sounds           │  │
│  │  POST /api/sounds/:id/play → Trigger sound playback   │  │
│  │                                                        │  │
│  │  Security:                                             │  │
│  │  - Injects Authorization header                       │  │
│  │  - Token from env var (never exposed to client)       │  │
│  │  - Serves static files from /dist                     │  │
│  └────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬──────────────────────────────┘
                                 │ HTTP Requests + Bearer Token
                                 │
┌────────────────────────────────▼──────────────────────────────┐
│                   Soundbored Discord Bot API                  │
│  - Manages sound files                                        │
│  - Triggers playback in Discord voice channels                │
│  - Returns sound metadata                                     │
└───────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Chakra UI** - Component library
- **Framer Motion** - Animations (via Chakra)
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **CORS** - Cross-origin support

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **Multi-stage build** - Optimized images

### PWA Features
- **Service Worker** - Offline support
- **Web App Manifest** - Installability
- **Cache API** - Resource caching

## Project Structure

```
pwa/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── SoundTile.tsx        # Individual sound button
│   │   ├── SearchBar.tsx        # Search input
│   │   ├── CategoryFilter.tsx   # Tag filtering
│   │   ├── FavoritesPanel.tsx   # Favorites view
│   │   └── HistoryPanel.tsx     # Recent plays view
│   │
│   ├── hooks/                    # Custom React hooks
│   │   └── useSounds.ts         # Sound data & play logic
│   │
│   ├── services/                 # Business logic
│   │   ├── api.ts               # API communication
│   │   └── storage.ts           # LocalStorage wrapper
│   │
│   ├── utils/                    # Utility functions
│   │   └── search.ts            # Fuzzy search logic
│   │
│   ├── types.ts                  # TypeScript definitions
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Entry point
│   └── vite-env.d.ts            # Vite types
│
├── server/                       # Backend source code
│   └── index.js                 # Express proxy server
│
├── public/                       # Static assets
│   ├── icon-192.png             # PWA icons
│   ├── icon-512.png
│   ├── apple-touch-icon.png
│   └── favicon.ico
│
├── Dockerfile                    # Container definition
├── docker-compose.yml           # Compose configuration
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── vite.config.ts               # Vite config
└── README.md                    # Documentation
```

## Data Flow

### 1. Initial Load
```
Browser → Express → Soundbored API
        ← HTML/JS/CSS ← 
        ← Sound List ←
```

### 2. Sound Search
```
User Input → React State → fuzzySearch()
          ← Filtered Results ←
          → Re-render Grid ←
```

### 3. Playing a Sound
```
Click Tile → playSound(id)
          → POST /api/sounds/:id/play
          → Express adds token
          → Forward to API
          → Bot plays in Discord
          ← Success Response ←
          → Add to History
          → Update UI
```

### 4. Favorites & History
```
Toggle Star → toggleFavorite(id)
           → Update localStorage
           → Update React state
           → Re-render
```

## Security Model

### Token Protection
- **API token stored only on server** (environment variable)
- **Never sent to client** - injected by Express proxy
- **Client only knows** `/api` endpoints, not the actual API URL

### Environment Isolation
```
Docker Container:
  - SOUNDBORED_TOKEN (secret, not in logs)
  - SOUNDBORED_API_URL (private API endpoint)
  
Browser:
  - Only accesses /api/* (proxied)
  - No knowledge of token
  - LocalStorage for non-sensitive data only
```

## State Management

### React State (Temporary)
- Current search query
- Selected tags
- Loading states
- Error messages
- Active tab

### LocalStorage (Persistent)
```json
{
  "soundbored-data": {
    "favorites": [1, 5, 23, 42],
    "history": [
      {"id": 42, "timestamp": 1697123456789},
      {"id": 5, "timestamp": 1697123450000}
    ],
    "settings": {
      "gridColumns": 4,
      "tileSize": "large"
    }
  }
}
```

## API Endpoints

### Frontend → Express Proxy

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sounds` | Fetch all available sounds |
| POST | `/api/sounds/:id/play` | Trigger sound playback |

### Express → Soundbored API

Same endpoints, but with:
- Added `Authorization: Bearer <token>` header
- Full API URL prefix
- Error handling

## Search Algorithm

### Fuzzy Search
```typescript
// Input: "ahm"
// Matches: "airhorn", "awesome", "alarm"
// Algorithm: Characters in order, any distance
```

### Exact Search
```typescript
// Input: "air"
// Matches: "airhorn", "air raid", "fresh air"
// Algorithm: Word boundary matching
```

### Tag Filtering
```typescript
// Selected tags: ["funny", "loud"]
// Matches: Sounds with ANY of the selected tags
// Combines with search: Search THEN filter
```

## Responsive Design

### Breakpoints
- **Mobile**: 2 columns (< 768px)
- **Tablet**: 3-4 columns (768px - 1024px)
- **Desktop**: 4-6 columns (> 1024px)

### Touch Targets
- Minimum 48x48px for all interactive elements
- Large tiles for easy tapping
- Generous spacing between tiles

## PWA Features

### Service Worker
- Caches app shell (HTML, CSS, JS)
- Caches sound list (5 min TTL)
- Network-first strategy for API calls
- Cache-first for static assets

### Offline Support
- App loads without network
- Shows cached sound list
- Graceful degradation if API unavailable

### Installation
- Manifest with app metadata
- Icons for all platforms
- Splash screens
- Theme colors

## Performance Optimizations

### Build Time
- TypeScript compilation
- Vite tree-shaking
- Code splitting
- Asset optimization
- Multi-stage Docker build (smaller image)

### Runtime
- React.memo for components
- Debounced search input
- Virtual scrolling (if needed)
- Lazy loading for heavy components

## Development Workflow

### Local Development
1. `npm run dev` - Frontend (Vite) on port 5173
2. `npm run server:dev` - Backend (Express) on port 3000
3. Vite proxies `/api` to backend
4. Hot reload for both frontend and backend

### Production Build
1. `npm run build` - Compile TypeScript + bundle assets
2. Output to `dist/` directory
3. `npm run server` - Serve from dist + API proxy

### Docker Build
1. **Stage 1**: Build frontend (Node + npm)
2. **Stage 2**: Production image (smaller)
   - Copy built frontend
   - Install production deps only
   - No dev tools

## Error Handling

### API Errors
- Network failures → Toast notification
- 401 Unauthorized → Alert + retry button
- 404 Not Found → Specific error message
- 500 Server Error → Generic error + retry

### User Errors
- No search results → Friendly message
- Empty favorites → Call to action
- No history → Encouraging message

## Future Enhancements

### Potential Features
- [ ] User authentication
- [ ] Sound upload interface
- [ ] Volume control
- [ ] Sound preview
- [ ] Playlists
- [ ] Sound categories management
- [ ] Admin panel
- [ ] Analytics/usage stats
- [ ] Keyboard shortcuts
- [ ] Sound waveform visualization
- [ ] Share sounds via URL

### Performance
- [ ] Virtual scrolling for large lists
- [ ] Image lazy loading
- [ ] Web Workers for search
- [ ] IndexedDB for larger storage
- [ ] GraphQL instead of REST

### UX
- [ ] Drag to reorder favorites
- [ ] Swipe gestures
- [ ] Haptic feedback
- [ ] Sound preview on long press
- [ ] Custom themes
- [ ] Accessibility improvements

## Monitoring & Logging

### Backend Logs
```javascript
console.log('🎵 Soundbored PWA server running on port', PORT);
console.error('Error fetching sounds:', error);
```

### Docker Logs
```bash
docker-compose logs -f
```

### Client Errors
- Console errors for debugging
- Toast notifications for user
- No automatic error reporting (privacy)

## Deployment Checklist

- [ ] Set environment variables in `.env`
- [ ] Generate proper icon files
- [ ] Update `SOUNDBORED_API_URL` and `SOUNDBORED_TOKEN`
- [ ] Build Docker image
- [ ] Test locally with docker-compose
- [ ] Configure reverse proxy (nginx/caddy) if needed
- [ ] Set up HTTPS (required for PWA)
- [ ] Test installation on mobile devices
- [ ] Verify offline functionality
- [ ] Check service worker registration
- [ ] Test all features end-to-end

## Maintenance

### Updates
- Frontend: `pnpm update` + rebuild
- Backend: Update Express if needed
- Docker base image: Update Node version in Dockerfile

### Backups
- LocalStorage data (client-side, no server backup needed)
- Environment variables (document securely)

### Monitoring
- Server uptime
- API response times
- Error rates
- User activity (if analytics added)

