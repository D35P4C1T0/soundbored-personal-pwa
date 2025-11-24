# 🚀 Quick Start - Running the Project

## ⚠️ IMPORTANT: You Need TWO Terminals!

This project requires **both** frontend and backend servers to run simultaneously.

## Step-by-Step:

### 1. Install Dependencies (First Time Only)
```bash
pnpm install
```

### 2. Create `.env` File
```bash
cp env.template .env
# Then edit .env with your API credentials
```

### 3. Start BOTH Servers

**Terminal 1** - Frontend (Vite):
```bash
pnpm run dev
```
✅ Should show: `Local: http://localhost:5173/`

**Terminal 2** - Backend (Express/TypeScript):
```bash
pnpm run server:dev
```
✅ Should show: `🎵 Soundbored PWA server running on port 3000`

### 4. Open Browser
Navigate to: `http://localhost:5173`

## 🔍 Troubleshooting

### "http proxy error: /api/sounds" or "ECONNREFUSED"
**Problem**: Backend server is not running!

**Solution**: 
- Open a **second terminal**
- Run: `pnpm run server:dev`
- Wait for: `🎵 Soundbored PWA server running on port 3000`

### Frontend loads but shows "Failed to load sounds"
**Problem**: Backend server not running or wrong `.env` configuration

**Solution**:
1. Check Terminal 2 is running `pnpm run server:dev`
2. Verify `.env` file has correct `SOUNDBORED_API_URL` and `SOUNDBORED_TOKEN`
3. Check backend terminal for error messages

### Port 3000 already in use
**Problem**: Another process is using port 3000

**Solution**:
```bash
# Find what's using port 3000
lsof -i :3000
# Kill it or change PORT in .env
```

## 📋 Quick Reference

| What | Command | Port |
|------|---------|------|
| Frontend Dev | `pnpm run dev` | 5173 |
| Backend Dev | `pnpm run server:dev` | 3000 |
| Production Build | `pnpm run build` | - |
| Production Server | `pnpm run server` | 3000 |

## ✅ Success Checklist

- [ ] Dependencies installed (`pnpm install`)
- [ ] `.env` file created and configured
- [ ] Terminal 1: Frontend running (`pnpm run dev`)
- [ ] Terminal 2: Backend running (`pnpm run server:dev`)
- [ ] Browser opens `http://localhost:5173`
- [ ] No proxy errors in Terminal 1
- [ ] Sounds load successfully

## 💡 Pro Tip

Create a script to run both servers at once:

**`package.json`** (add this script):
```json
"dev:all": "concurrently \"pnpm run dev\" \"pnpm run server:dev\""
```

Then install concurrently:
```bash
pnpm add -D concurrently
```

Now you can run both with:
```bash
pnpm run dev:all
```

