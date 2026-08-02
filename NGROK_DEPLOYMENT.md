# Deploy with ngrok (Local Development with Public URL)

ngrok creates a secure public URL to your local application. Perfect for testing webhooks, sharing demos, or CI/CD integration.

## Step 1: Install ngrok

**Download from:** https://ngrok.com/download

### macOS
```bash
brew install ngrok/ngrok/ngrok
```

### Windows (PowerShell Admin)
```bash
# Download exe from ngrok.com/download
# Or via Chocolatey:
choco install ngrok
```

### Linux
```bash
curl -L https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz | tar xz
sudo mv ngrok /usr/local/bin
```

## Step 2: Create ngrok Account & Get Auth Token

1. Go to **https://dashboard.ngrok.com**
2. Sign up (free)
3. Get your **Auth Token**
4. Run:
```bash
ngrok config add-authtoken <YOUR-AUTH-TOKEN>
```

## Step 3: Start Your Application Locally

```bash
cd industrial-safety-platform

# Start Docker containers
docker-compose -f docker-compose-fast.yml up -d

# Or run directly:
# Backend: python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
# Frontend: npm run dev
```

Verify it works at: http://localhost:5173

## Step 4: Expose with ngrok

**Terminal 1 - Backend Tunnel:**
```bash
ngrok http 8000
```

You'll see:
```
Session Status                online
Account                       your-email@example.com
Version                       3.3.0
Region                        United States (us)
Latency                        45ms
Web Interface                  http://127.0.0.1:4040
Forwarding                     https://abc123.ngrok.io -> http://localhost:8000
```

**Terminal 2 - Frontend Tunnel:**
```bash
ngrok http 5173 -subdomain isip-frontend
```

You'll see:
```
Forwarding                     https://isip-frontend.ngrok.io -> http://localhost:5173
```

## Step 5: Access Your Public URLs

- **Frontend:** `https://isip-frontend.ngrok.io`
- **Backend API:** `https://abc123.ngrok.io`
- **Login:** `admin` / `admin123`

## Step 6: Configure Frontend for ngrok Backend

The frontend needs to know the backend URL. Add environment variable:

```bash
# In terminal where frontend is running
export VITE_API_URL=https://abc123.ngrok.io
npm run dev
```

Or update `frontend/src/services/api.ts`:
```typescript
const API_BASE_URL = 'https://abc123.ngrok.io' // Replace with your ngrok URL
```

## Automated Script

Create `ngrok-deploy.sh`:

```bash
#!/bin/bash

echo "Starting Industrial Safety Platform with ngrok..."

# Start backend
cd industrial-safety-platform
docker-compose -f docker-compose-fast.yml up -d

echo "Waiting for services to start..."
sleep 5

# Get ngrok URLs
echo "Starting ngrok tunnels..."

# Terminal 1
gnome-terminal -- ngrok http 8000 &
BACKEND_PID=$!

sleep 3

# Terminal 2
gnome-terminal -- ngrok http 5173 -subdomain isip-frontend &
FRONTEND_PID=$!

echo "✅ ngrok tunnels started"
echo ""
echo "View active tunnels: http://localhost:4040"
echo ""
echo "Frontend: https://isip-frontend.ngrok.io"
echo "Backend: Check http://localhost:4040 for URL"
echo ""
echo "Press Ctrl+C to stop"

wait
```

Make executable:
```bash
chmod +x ngrok-deploy.sh
./ngrok-deploy.sh
```

## ngrok Dashboard

Access real-time traffic inspection:
- **URL:** http://localhost:4040
- See all requests/responses
- Replay requests
- Mock responses

## Configuration Options

### Custom Domain (ngrok Pro)
```bash
ngrok http 5173 --subdomain=my-custom-subdomain
```

### Custom Region
```bash
ngrok http 8000 --region=eu  # Europe
ngrok http 8000 --region=ap  # Asia Pacific
```

### Basic Auth
```bash
ngrok http 8000 --basic-auth="user:password"
```

### Custom Headers
```bash
ngrok http 8000 --request-header-add "X-Custom-Header: value"
```

## Limits (Free Tier)

✅ 3 tunnels per account
✅ 40 requests/min
✅ 1GB traffic/month
✅ No custom domains
✅ URL changes every 8 hours

**Upgrade to Pro:** $5/month
- Custom domains
- No request limits
- API access
- Reserved URLs

## Share Public URL

Your ngrok URLs are public - share them for:
- ✅ Demo to stakeholders
- ✅ Client feedback
- ✅ Webhook testing
- ✅ CI/CD integration
- ✅ Mobile testing from any device

## Troubleshooting

**"Connection refused"**
- Ensure app is running on localhost:8000 or :5173
- Check Docker containers: `docker ps`

**"authtoken invalid"**
- Regenerate from https://dashboard.ngrok.com
- Run: `ngrok config add-authtoken <NEW-TOKEN>`

**"Tunnel limit exceeded"**
- Close other ngrok sessions
- Only 3 tunnels allowed (free tier)

**"URL not accessible from outside"**
- Firewall may be blocking
- Restart ngrok
- Try different region: `--region=eu`

## Local + Public Setup

| Service | Local | Public |
|---------|-------|--------|
| Frontend | http://localhost:5173 | https://isip-frontend.ngrok.io |
| Backend | http://localhost:8000 | https://abc123.ngrok.io |
| ngrok UI | http://localhost:4040 | - |

## Next Steps

1. ✅ Install ngrok
2. ✅ Get auth token
3. ✅ Start local app
4. ✅ Run ngrok tunnels
5. ✅ Access public URLs
6. ✅ Share with team

Your app is now publicly accessible! 🚀
