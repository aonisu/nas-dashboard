# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm install && cd client && npm install && cd ../server && npm install

# Copy source code
COPY . .

# Build the application
RUN npm run client:build && npm run server:build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package.json for start script
COPY package*.json ./

# Copy built application
COPY --from=builder /app/server/dist ./dist/server
COPY --from=builder /app/client/dist ./dist/client
COPY --from=builder /app/server/node_modules ./node_modules

# Create data directory
RUN mkdir -p /app/data

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/server/index.js"]