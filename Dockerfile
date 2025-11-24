# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./

# Install dependencies using npm (avoids external pnpm download)
RUN npm ci || npm install

# Copy source code
COPY . .

# Build the frontend
RUN npm run build

# Compile TypeScript server code
RUN npx tsc --project tsconfig.node.json

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files for production dependencies
COPY package.json ./

# Install only production dependencies with npm
RUN npm ci --omit=dev || npm install --omit=dev

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

