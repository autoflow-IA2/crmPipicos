# ==========================================
# Multi-Service Dockerfile for Easypanel
# Builds Frontend + Backend in single container
# ==========================================

# ==========================================
# Stage 1: Build Frontend (React + Vite)
# ==========================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY package*.json ./
RUN npm ci --silent

# Copy frontend source
COPY src ./src
COPY public ./public
COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Build frontend
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

# ==========================================
# Stage 2: Build Backend (Node.js + Express)
# ==========================================
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./
RUN npm ci --silent

# Copy backend source
COPY backend/src ./src
COPY backend/tsconfig.json ./

# Build backend
RUN npm run build

# ==========================================
# Stage 3: Production Runtime
# ==========================================
FROM node:20-alpine

# Install nginx and wget for health checks
RUN apk add --no-cache nginx wget

WORKDIR /app

# Setup nginx
COPY nginx.conf /etc/nginx/http.d/default.conf
RUN mkdir -p /run/nginx /var/log/nginx

# Copy frontend build to nginx
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Setup backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production --silent
COPY --from=backend-builder /app/backend/dist ./dist

# Environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Expose ports
EXPOSE 80 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "Starting backend..."' >> /app/start.sh && \
    echo 'cd /app/backend && node dist/server.js &' >> /app/start.sh && \
    echo 'BACKEND_PID=$!' >> /app/start.sh && \
    echo 'echo "Backend started with PID $BACKEND_PID"' >> /app/start.sh && \
    echo 'echo "Starting nginx..."' >> /app/start.sh && \
    echo 'nginx -g "daemon off;" &' >> /app/start.sh && \
    echo 'NGINX_PID=$!' >> /app/start.sh && \
    echo 'echo "Nginx started with PID $NGINX_PID"' >> /app/start.sh && \
    echo 'wait $BACKEND_PID $NGINX_PID' >> /app/start.sh && \
    chmod +x /app/start.sh

# Start both services
CMD ["/app/start.sh"]
