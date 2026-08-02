#!/bin/bash
# Optimized startup script for production deployment

# Set environment variables for faster startup
export PYTHONUNBUFFERED=1
export PYTHONOPTIMIZE=2

# Create necessary directories
mkdir -p data logs models

# Run migrations if needed
# alembic upgrade head

# Start the backend with uvloop and optimized workers
exec python -m uvicorn app.main:app \
    --host 0.0.0.0 \
    --port 8000 \
    --workers 1 \
    --loop uvloop \
    --http httptools \
    --access-log \
    --log-level info
