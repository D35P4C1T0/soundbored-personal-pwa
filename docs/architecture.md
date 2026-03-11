# Architecture

## Frontend

- `src/services/api.ts`: fetches and validates Soundbored API responses before the UI sees them
- `src/services/storage.ts`: owns localStorage parsing, sanitization, and persistence
- `src/hooks/useSounds.ts`: remote sound loading and retry flow
- `src/hooks/useLibraryState.ts`: search, tag filters, favorites, and history derived from validated storage data
- `src/components/`: presentational UI pieces with narrow props

## Server

- `server/config.ts`: environment parsing and normalization
- `server/proxy.ts`: upstream request/response handling and network failure mapping
- `server/app.ts`: Express routes and input validation
- `server/index.ts`: process entrypoint only

## Invariants

- API data is treated as untrusted until parsed
- localStorage is treated as untrusted until sanitized
- invalid sound ids are rejected before proxying
- the client never sees the Soundbored API token
