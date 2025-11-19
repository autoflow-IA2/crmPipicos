# ============================================================
# Dockerfile Otimizado para Easypanel
# CRM Agendamentos PPC - Frontend + Backend + Nginx
# ============================================================

# ==================================
# Stage 1: Build Frontend
# ==================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./
COPY tsconfig.json tsconfig.node.json vite.config.ts ./
COPY index.html ./
COPY postcss.config.js tailwind.config.js ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src/ ./src/

# Set environment variables for Vite build (hardcoded)
ENV VITE_SUPABASE_URL=https://gjqkkiuqryhhobmcevuo.supabase.co
ENV VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqcWtraXVxcnloaG9ibWNldnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzI1NjUsImV4cCI6MjA3ODU0ODU2NX0.-sCj_ojV9nIyNhEcLOcQftA-oN4P9ybcVziA0fT_Q28

# Build frontend
RUN npm run build:frontend

# ==================================
# Stage 2: Build Backend
# ==================================
FROM node:20-alpine AS backend-builder

WORKDIR /app

# Copy backend files
COPY backend/package.json backend/package-lock.json ./
COPY backend/tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy backend source
COPY backend/src/ ./src/

# Build backend
RUN npm run build

# ==================================
# Stage 3: Production Runtime
# ==================================
FROM node:20-alpine

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl

# Copy backend production files
COPY backend/package.json backend/package-lock.json ./backend/
WORKDIR /app/backend
RUN npm ci --only=production

# Copy backend built files
COPY --from=backend-builder /app/dist ./dist

# Copy frontend built files to Nginx
WORKDIR /usr/share/nginx/html
COPY --from=frontend-builder /app/dist .

# Copy Nginx configuration
WORKDIR /app
COPY nginx-easypanel.conf /etc/nginx/http.d/default.conf

# Remove default Nginx config if exists
RUN rm -f /etc/nginx/http.d/default.conf.default

# Create supervisor configuration
RUN mkdir -p /var/log/supervisor
COPY <<EOF /etc/supervisor/conf.d/supervisord.conf
[supervisord]
nodaemon=true
user=root
logfile=/var/log/supervisor/supervisord.log
pidfile=/var/run/supervisord.pid

[program:backend]
command=node /app/backend/dist/server.js
directory=/app/backend
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/backend.err.log
stdout_logfile=/var/log/supervisor/backend.out.log
environment=NODE_ENV="production",PORT="3001"

[program:nginx]
command=nginx -g 'daemon off;'
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/nginx.err.log
stdout_logfile=/var/log/supervisor/nginx.out.log
EOF

# Create startup script
COPY <<'EOF' /app/start.sh
#!/bin/sh
set -e

echo "🚀 Starting CRM Agendamentos Services"
echo "======================================"

# Verify files
echo "📁 Verifying installation..."
if [ ! -f /app/backend/dist/server.js ]; then
    echo "❌ Backend build not found!"
    exit 1
fi

if [ ! -f /usr/share/nginx/html/index.html ]; then
    echo "❌ Frontend build not found!"
    exit 1
fi

echo "✅ All files present"
echo ""

# Display configuration
echo "🔧 Configuration:"
echo "   - Backend Port: ${PORT:-3001}"
echo "   - Environment: ${NODE_ENV:-production}"
echo "   - Frontend: /usr/share/nginx/html"
echo "   - Backend: /app/backend"
echo ""

# Start services with supervisor
echo "▶️  Starting services..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
EOF

RUN chmod +x /app/start.sh

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Expose port
EXPOSE 80

# Default environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Start application
CMD ["/app/start.sh"]
