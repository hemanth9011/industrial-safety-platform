#!/bin/bash
# ngrok deployment script for Industrial Safety Platform

set -e

echo "🚀 Industrial Safety Platform - ngrok Deployment"
echo "=================================================="
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok not found. Install from: https://ngrok.com/download"
    exit 1
fi

# Check if Docker is running
if ! docker ps &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Prerequisites checked"
echo ""

# Start Docker containers
echo "📦 Starting Docker containers..."
docker-compose -f docker-compose-fast.yml up -d
echo "✅ Docker containers started"
echo ""

# Wait for services to be ready
echo "⏳ Waiting for services to start (10 seconds)..."
sleep 10

# Check if services are running
echo "🔍 Checking services..."
if ! curl -s http://localhost:8000/health > /dev/null; then
    echo "❌ Backend not responding on :8000"
    exit 1
fi
echo "✅ Backend is ready"

if ! curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "⚠️  Frontend may still be starting..."
fi
echo "✅ Frontend is ready"
echo ""

# Start ngrok tunnels
echo "🌐 Starting ngrok tunnels..."
echo ""

# Create temp directory for logs
mkdir -p .ngrok

# Start backend tunnel in background
echo "Starting backend tunnel on port 8000..."
ngrok http 8000 --log=stdout > .ngrok/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend tunnel PID: $BACKEND_PID"

sleep 3

# Start frontend tunnel in background
echo "Starting frontend tunnel on port 5173..."
ngrok http 5173 --subdomain isip-frontend --log=stdout > .ngrok/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend tunnel PID: $FRONTEND_PID"

sleep 3

echo ""
echo "=================================================="
echo "✅ ngrok Tunnels Active!"
echo "=================================================="
echo ""

# Get ngrok URLs from API
echo "🔗 Public URLs:"
echo ""

# Try to get URLs from ngrok API
BACKEND_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*"' | head -1 | cut -d'"' -f4)
FRONTEND_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*"' | tail -1 | cut -d'"' -f4)

if [ -z "$BACKEND_URL" ]; then
    echo "Frontend:  https://isip-frontend.ngrok.io"
    echo "Backend:   Check http://localhost:4040 for URL"
else
    echo "Frontend:  https://isip-frontend.ngrok.io"
    echo "Backend:   $BACKEND_URL"
fi

echo ""
echo "📊 ngrok Dashboard:"
echo "   http://localhost:4040"
echo ""
echo "🔐 Login Credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "💾 Logs:"
echo "   Backend: .ngrok/backend.log"
echo "   Frontend: .ngrok/frontend.log"
echo ""
echo "=================================================="
echo "Press Ctrl+C to stop all services"
echo "=================================================="
echo ""

# Handle Ctrl+C
trap "
    echo ''
    echo 'Stopping ngrok tunnels...'
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo 'Stopping Docker containers...'
    docker-compose -f docker-compose-fast.yml down
    echo 'Cleanup complete!'
    exit 0
" SIGINT

# Keep script running
wait $BACKEND_PID $FRONTEND_PID
