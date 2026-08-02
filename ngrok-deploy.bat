@echo off
REM ngrok deployment script for Windows
REM Industrial Safety Platform

echo.
echo 🚀 Industrial Safety Platform - ngrok Deployment (Windows)
echo =========================================================
echo.

REM Check if ngrok is installed
where ngrok >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ngrok not found. Install from: https://ngrok.com/download
    pause
    exit /b 1
)

echo ✅ ngrok found
echo.

REM Check if Docker is running
docker ps >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo ✅ Docker is running
echo.

REM Start Docker containers
echo 📦 Starting Docker containers...
docker-compose -f docker-compose-fast.yml up -d
echo ✅ Docker containers started
echo.

REM Wait for services
echo ⏳ Waiting for services to start (10 seconds)...
timeout /t 10 /nobreak
echo.

REM Check services
echo 🔍 Checking services...
curl -s http://localhost:8000/health >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Backend not responding on :8000
    pause
    exit /b 1
)
echo ✅ Backend is ready
echo ✅ Frontend is ready
echo.

REM Create logs directory
if not exist ".ngrok" mkdir .ngrok

REM Start tunnels in separate windows
echo 🌐 Starting ngrok tunnels...
echo.

echo Starting backend tunnel (Port 8000)...
start "ISIP Backend - ngrok" cmd /k "ngrok http 8000 > .ngrok\backend.log 2>&1"
timeout /t 3 /nobreak

echo Starting frontend tunnel (Port 5173)...
start "ISIP Frontend - ngrok" cmd /k "ngrok http 5173 --subdomain isip-frontend > .ngrok\frontend.log 2>&1"
timeout /t 3 /nobreak

echo.
echo =========================================================
echo ✅ ngrok Tunnels Starting!
echo =========================================================
echo.

echo 🔗 Public URLs:
echo    Frontend:  https://isip-frontend.ngrok.io
echo    Backend:   Check ngrok Dashboard (see below)
echo.
echo 📊 ngrok Dashboard:
echo    http://localhost:4040
echo.
echo 🔐 Login Credentials:
echo    Username: admin
echo    Password: admin123
echo.
echo 💾 Logs:
echo    Backend: .ngrok\backend.log
echo    Frontend: .ngrok\frontend.log
echo.
echo =========================================================
echo To stop all services:
echo   1. Close the ngrok windows
echo   2. Run: docker-compose -f docker-compose-fast.yml down
echo =========================================================
echo.

pause
