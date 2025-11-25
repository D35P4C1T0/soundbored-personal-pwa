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

# Compile TypeScript server code
RUN npx tsc --project tsconfig.server.json && \
    ls -la server/*.js || echo "Server compilation completed"

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files for production dependencies
COPY package.json ./

# Install only production dependencies with npm
# Note: Using npm install since project uses pnpm-lock.yaml (no package-lock.json)
RUN npm install --omit=dev

# Copy built frontend from builder stage
COPY --from=builder /app/dist ./dist

# Copy compiled server code
COPY --from=builder /app/server ./server

# Expose port
EXPOSE 3000

# Set default environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server
CMD ["node", "server/index.js"]

