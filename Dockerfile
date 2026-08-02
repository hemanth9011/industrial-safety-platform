# Multi-stage build for Fly.io deployment

# Stage 1: Build backend
FROM python:3.11-slim as backend-builder
WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements-fast.txt .
RUN pip install --no-cache-dir -r requirements-fast.txt

COPY backend/ .

# Stage 2: Build frontend
FROM node:18-alpine as frontend-builder
WORKDIR /app

COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps

COPY frontend/ .
RUN npm run build

# Stage 3: Runtime
FROM python:3.11-slim
WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Node for serving frontend
RUN apt-get update && apt-get install -y \
    npm \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g serve

# Copy backend from builder
COPY --from=backend-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=backend-builder /app /app/backend

# Copy frontend from builder
COPY --from=frontend-builder /app/dist /app/frontend/dist

# Copy startup script
COPY backend/start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Create necessary directories
RUN mkdir -p /app/data /app/logs /app/models

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

ENV PYTHONUNBUFFERED=1
ENV PYTHONOPTIMIZE=2

EXPOSE 8000 5173

CMD ["/bin/bash", "-c", "cd /app/backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 & cd /app/frontend && serve -s dist -l 5173"]
