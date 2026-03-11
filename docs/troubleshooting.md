# Troubleshooting

## Failed to load sounds

- Check `SOUNDBORED_API_URL`
- Check `SOUNDBORED_API_TOKEN`
- Confirm the token still exists in Soundbored `Settings`
- Confirm the Soundbored server is reachable from this proxy

## Play request fails

- Verify the sound still exists upstream
- Verify the token has not been revoked
- Check the proxy logs for the exact upstream error

## Proxy will not start

- Make sure `.env` exists
- Make sure `PORT` is a positive integer
- Make sure `SOUNDBORED_API_URL` is a valid URL

## Build fails

- Run `pnpm install`
- Run `pnpm run type-check`
- Re-run `pnpm run build` after fixing the reported TypeScript error
