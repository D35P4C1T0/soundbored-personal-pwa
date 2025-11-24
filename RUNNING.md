# Quick Running Guide

## 🚀 First Time Setup

1. **Install dependencies** (important - new TypeScript dependencies added):
   ```bash
   pnpm install
   # OR: npm install
   ```

2. **Create `.env` file**:
   ```bash
   cp env.template .env
   ```

3. **Edit `.env`** with your API credentials:
   ```env
   SOUNDBORED_API_URL=https://your-soundboard-api.com/api
   SOUNDBORED_TOKEN=your-token-here
   PORT=3000
   ```

## 💻 Development Mode

**You need 2 terminal windows:**

**Terminal 1** - Frontend:
```bash
pnpm run dev
# Opens on http://localhost:5173
```

**Terminal 2** - Backend (TypeScript server):
```bash
pnpm run server:dev
# Runs on http://localhost:3000
```

The backend now uses TypeScript and auto-reloads on file changes.

## 🏗️ Production Build

```bash
# Build frontend
pnpm run build

# Start production server
pnpm run server
```

## 🐳 Docker (Production)

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f
```

## ✨ New Commands Available

```bash
pnpm run lint          # Check code quality
pnpm run format        # Format code
pnpm run type-check    # Check TypeScript types
```

## ⚠️ Important Notes

- **Server is now TypeScript**: The server code (`server/index.ts`) is TypeScript and uses `tsx` to run
- **New dependencies**: Make sure to run `pnpm install` to get all TypeScript types and tools
- **Environment validation**: The server now validates your `.env` file on startup

## 🐛 Troubleshooting

**"Cannot find module 'tsx'"**
- Run `pnpm install` to install dependencies

**"TypeScript errors"**
- Run `pnpm run type-check` to see all type errors
- Make sure Node.js 18+ is installed

**"Server won't start"**
- Check `.env` file exists and has valid values
- Ensure port 3000 is not in use
- Check server logs for detailed error messages

