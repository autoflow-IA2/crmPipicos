# ==========================================
# Multi-Service Dockerfile for Easypanel
# Builds Frontend + Backend in single container
# ==========================================

# ==========================================
# Stage 1: Build Frontend (React + Vite)
# ==========================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy frontend package files
COPY package*.json ./
RUN npm ci --silent --legacy-peer-deps

# Copy all frontend files (using .dockerignore to exclude unnecessary files)
COPY . .

# Build frontend with build args
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

# ==========================================
# Stage 2: Build Backend (Node.js + Express)
# ==========================================
FROM node:20-alpine AS backend-builder

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./
RUN npm ci --silent --legacy-peer-deps

# Copy backend source
COPY backend/ ./

# Build backend
RUN npm run build

# ==========================================
# Stage 3: Production Runtime
# ==========================================
FROM node:20-alpine

# Install nginx and wget
RUN apk add --no-cache nginx wget bash

WORKDIR /app

# Setup nginx directories
RUN mkdir -p /run/nginx /var/log/nginx /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/http.d/default.conf

# Copy frontend build
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Setup backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production --silent --legacy-peer-deps
COPY --from=backend-builder /app/dist ./dist

# Environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Expose ports
EXPOSE 80 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Create startup script
RUN cat > /app/start.sh <<'EOF'
#!/bin/sh
set -e

echo "=========================================="
echo "Starting CRM Agendamentos Services"
echo "=========================================="

# Start backend
echo "Starting Backend API..."
cd /app/backend
node dist/server.js &
BACKEND_PID=$!
echo "✓ Backend started (PID: $BACKEND_PID)"

# Wait for backend to be ready
sleep 5

# Start nginx
echo "Starting Nginx..."
nginx -g "daemon off;" &
NGINX_PID=$!
echo "✓ Nginx started (PID: $NGINX_PID)"

echo "=========================================="
echo "Services running successfully!"
echo "Frontend: http://localhost:80"
echo "Backend: http://localhost:3001"
echo "=========================================="

# Wait for processes
wait $BACKEND_PID $NGINX_PID
EOF

RUN chmod +x /app/start.sh

# Start both services
CMD ["/app/start.sh"]
