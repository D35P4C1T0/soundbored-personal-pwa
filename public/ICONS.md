# PWA Icons

This directory should contain the following icon files for the PWA:

## Required Icons

- `favicon.ico` - Standard browser favicon (32x32 or 16x16)
- `icon-192.png` - Android icon (192x192)
- `icon-512.png` - Android icon (512x512)
- `apple-touch-icon.png` - iOS icon (180x180)
- `mask-icon.svg` - Safari pinned tab icon

## Generating Icons

You can use online tools to generate these icons from a single source image:

1. **PWA Asset Generator**: https://github.com/onderceylan/pwa-asset-generator
   ```bash
   npx pwa-asset-generator source-icon.png ./public --icon-only
   ```

2. **RealFaviconGenerator**: https://realfavicongenerator.net/

3. **Favicon.io**: https://favicon.io/

## Recommended Design

- Use a simple, recognizable icon (e.g., 🎵 music note or sound wave)
- Ensure good contrast on both light and dark backgrounds
- Keep it simple - icons are displayed at small sizes
- Use your brand colors if applicable

## Quick Placeholder

For testing, you can create simple colored squares:

```bash
# Install imagemagick if needed
convert -size 192x192 xc:#3182CE -gravity center -pointsize 72 -fill white -annotate +0+0 '🎵' icon-192.png
convert -size 512x512 xc:#3182CE -gravity center -pointsize 256 -fill white -annotate +0+0 '🎵' icon-512.png
convert -size 180x180 xc:#3182CE -gravity center -pointsize 72 -fill white -annotate +0+0 '🎵' apple-touch-icon.png
```

Or download from here:
- https://via.placeholder.com/192x192/3182CE/FFFFFF?text=🎵
- https://via.placeholder.com/512x512/3182CE/FFFFFF?text=🎵
- https://via.placeholder.com/180x180/3182CE/FFFFFF?text=🎵

