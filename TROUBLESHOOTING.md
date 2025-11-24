# Troubleshooting Guide

## ECONNREFUSED Error

If you see `ECONNREFUSED` errors, it means the server cannot connect to your Soundbored API.

### Common Causes:

1. **API Server Not Running**
   - Make sure your Soundbored API server is running
   - Check if the API is accessible from your machine

2. **Incorrect API URL in `.env`**
   - Verify `SOUNDBORED_API_URL` in your `.env` file
   - Make sure it includes the full URL with protocol (http:// or https://)
   - Example: `https://your-api.com/api` (not just `your-api.com/api`)

3. **Network/Firewall Issues**
   - If API is on a different machine, check firewall rules
   - Verify network connectivity: `curl https://your-api.com/api/sounds`

4. **Wrong Port**
   - If using a custom port, include it in the URL: `http://localhost:8080/api`

### How to Debug:

1. **Check your `.env` file**:
   ```bash
   cat .env
   # Should show:
   # SOUNDBORED_API_URL=https://your-api.com/api
   # SOUNDBORED_TOKEN=your-token
   ```

2. **Test API connectivity**:
   ```bash
   # Replace with your actual API URL
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        https://your-api.com/api/sounds
   ```

3. **Check server logs**:
   - The server will show which URL it's trying to connect to
   - Look for the "Proxying to:" message in console

4. **Verify API is running**:
   - If API is local: Check if it's running on the expected port
   - If API is remote: Verify it's accessible from your network

### Quick Fixes:

**If API is localhost:**
```env
SOUNDBORED_API_URL=http://localhost:YOUR_PORT/api
```

**If API is on same machine, different port:**
```env
SOUNDBORED_API_URL=http://127.0.0.1:YOUR_PORT/api
```

**If API is remote:**
```env
SOUNDBORED_API_URL=https://your-domain.com/api
```

## Other Common Issues

### "Missing required environment variables"
- Make sure `.env` file exists in project root
- Check that `SOUNDBORED_API_URL` and `SOUNDBORED_TOKEN` are set
- No quotes needed around values in `.env`

### "Invalid API response structure"
- API returned data in unexpected format
- Check API documentation for correct response format
- Verify API endpoint returns array or `{ data: [...] }`

### Port Already in Use
```bash
# Find what's using port 3000
lsof -i :3000
# OR
netstat -an | grep 3000

# Kill the process or change PORT in .env
```

### TypeScript Errors
```bash
# Check types
pnpm run type-check

# Make sure all dependencies installed
pnpm install
```

