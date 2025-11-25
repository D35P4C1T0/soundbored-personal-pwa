# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY tsconfig.server.json ./

# Install dependencies using npm (avoids external pnpm download)
# Note: Using npm install since project uses pnpm-lock.yaml (no package-lock.json)
RUN npm install

# Copy source code
COPY . .

# Build the frontend
RUN npm run build

# Note: We don't need to compile TypeScript server code anymore
# We'll use tsx in production to run TypeScript directly
RUN echo "✓ Server TypeScript files ready (will be run with tsx in production)"

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files for production dependencies
COPY package.json ./

# Install production dependencies
# Note: Using npm install since project uses pnpm-lock.yaml (no package-lock.json)
RUN npm install --omit=dev

# Install tsx as a production dependency to run TypeScript server files
RUN npm install tsx --save-prod

# Copy built frontend from builder stage
COPY --from=builder /app/dist ./dist

# Copy server TypeScript source code (we'll use tsx to run it)
COPY --from=builder /app/server ./server

# Verify server files exist
RUN ls -la server/ && \
    test -f server/index.ts && echo "✓ server/index.ts exists" || (echo "✗ server/index.ts missing!" && exit 1)

# Expose port
EXPOSE 3000

# Set default environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server using tsx to run TypeScript directly
CMD ["npx", "tsx", "server/index.ts"]

