# Quick Start Guide

Get your Soundbored PWA up and running in minutes!

## 🚀 Production Deployment (Docker)

### Option 1: Using Docker Compose (Recommended)

1. **Create `.env` file** in the `pwa` directory:
   ```bash
   cd pwa
   cp env.template .env
   nano .env  # or use your preferred editor
   ```

2. **Edit `.env` with your settings**:
   ```env
   SOUNDBORED_API_URL=https://your-soundboard-api.com/api
   SOUNDBORED_TOKEN=your-api-token-here
   PORT=3000
   ```

3. **Start the container**:
   ```bash
   docker-compose up -d
   ```

4. **Access the app**: Open `http://localhost:3000` or `http://your-server-ip:3000`

### Option 2: Manual Docker Build

```bash
# Build the image
docker build -t soundbored-pwa .

# Run the container
docker run -d \
  -p 3000:3000 \
  -e SOUNDBORED_API_URL=https://your-api.com/api \
  -e SOUNDBORED_TOKEN=your-token \
  --name soundbored-pwa \
  --restart unless-stopped \
  soundbored-pwa
```

## 💻 Local Development

### Prerequisites
- Node.js 18+ installed
- pnpm (recommended - `npm install -g pnpm`)
- Access to a Soundbored API instance

### Setup

1. **Install dependencies**:
   ```bash
   cd pwa
   pnpm install
   ```

2. **Create `.env` file**:
   ```bash
   cp env.template .env
   ```

3. **Edit `.env`** with your API details:
   ```env
   SOUNDBORED_API_URL=https://your-soundboard-api.com/api
   SOUNDBORED_TOKEN=your-token-here
   PORT=3000
   ```

4. **Start development servers** (requires 2 terminals):

   **Terminal 1** - Frontend dev server:
   ```bash
   pnpm run dev
   ```

   **Terminal 2** - Backend proxy server:
   ```bash
   pnpm run server:dev
   ```

5. **Open the app**: Navigate to `http://localhost:5173`

## 🎨 Customization

### Icons
Replace the placeholder icons in `public/` with your own:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)
- `apple-touch-icon.png` (180x180)
- `favicon.ico`

See `public/ICONS.md` for icon generation tools.

### Theming
Edit colors in `src/main.tsx`:
```typescript
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',  // or 'light'
  },
  colors: {
    // Add your custom colors
  }
});
```

## 📱 Installing as PWA

### On Mobile (iOS/Android)
1. Open the app in Safari (iOS) or Chrome (Android)
2. Look for "Add to Home Screen" option:
   - **iOS**: Tap share button → "Add to Home Screen"
   - **Android**: Tap menu (⋮) → "Add to home screen" or "Install app"
3. The app will appear as an icon on your home screen

### On Desktop
1. Open the app in Chrome, Edge, or other PWA-compatible browser
2. Look for the install icon in the address bar
3. Click "Install"

## 🔧 Useful Commands

```bash
# Development
pnpm run dev              # Start Vite dev server (port 5173)
pnpm run server:dev       # Start backend proxy with auto-reload

# Production Build
pnpm run build            # Build frontend for production
pnpm run preview          # Preview production build locally
pnpm run server           # Start production server

# Docker
docker-compose up -d     # Start container
docker-compose down      # Stop container
docker-compose logs -f   # View logs
docker-compose restart   # Restart container
```

## 🐛 Troubleshooting

### "Failed to fetch sounds"
- Check your `.env` file has correct `SOUNDBORED_API_URL` and `SOUNDBORED_TOKEN`
- Ensure the API URL includes `/api` at the end
- Verify the token is valid
- Check server logs: `docker-compose logs -f`

### Backend proxy not starting
- Make sure port 3000 is not already in use
- Check `.env` file exists and has required variables
- For development, make sure you're running both `pnpm run dev` AND `pnpm run server:dev`

### Sounds play but no audio
- This is expected! The PWA sends play commands to your Discord bot
- Audio plays through Discord, not through the browser
- Check if the bot is connected to a voice channel

### PWA not installing on mobile
- Make sure you're accessing via HTTPS (or localhost for testing)
- Some browsers don't support PWA installation
- Try Chrome or Safari

### Icons not showing
- Generate proper icon files (see `public/ICONS.md`)
- Rebuild the app: `npm run build`
- Clear browser cache and reload

## 🎯 Usage Tips

### Search
- **Fuzzy search**: Just start typing, matches anywhere in filename or tags
- **Exact match**: Use quotes `"exact phrase"` to match exact words
- **Clear search**: Clear the input or press Escape

### Favorites
- Star icon on tiles adds to favorites
- Access favorites in the "Favorites" tab
- Favorites are stored locally in your browser

### History
- "History" tab shows recently played sounds
- Last 50 plays are stored
- History is stored locally in your browser

### Tags/Categories
- Click tag buttons below search to filter
- Multiple tags can be selected
- Selected tags show with a blue badge

## 📊 Next Steps

1. **Secure your deployment**: 
   - Use HTTPS in production
   - Consider adding authentication if needed
   - Limit access with firewall rules

2. **Customize the UI**:
   - Update icons with your branding
   - Modify colors in `src/main.tsx`
   - Adjust grid columns in components

3. **Share with friends**:
   - Give them the URL
   - They can install it as a PWA
   - Everyone can trigger sounds on your bot!

## 💡 Pro Tips

- **Quick access**: Install as PWA for one-tap access
- **Mobile-first**: Designed for phones, works great on desktop too
- **Offline**: Sound list is cached, works without internet (after first load)
- **Fast search**: Use keyboard on desktop, voice input on mobile
- **Organization**: Use favorites for your most-played sounds

Enjoy your Soundbored PWA! 🎵

