# ✅ Your Replit App Deployment Guide

Your Replit is at: https://replit.com/@hemanthadapa192/industrial-safety-platform

## Step 1: Start the App

1. Open your Replit: https://replit.com/@hemanthadapa192/industrial-safety-platform
2. Click the **"Run"** button (top center)
3. Wait 30-60 seconds for everything to start

You'll see:
```
✓ Frontend running on port 5173
✓ Backend running on port 8000
```

## Step 2: Open Your App

Once running, a preview will appear on the right showing:
- **Backend:** `http://localhost:8000`
- **Frontend:** Should open automatically

Or click the **"Open in new tab"** button

## Step 3: Log In

**Credentials:**
- Username: `admin`
- Password: `admin123`

## Step 4: Publish for Public Access

To get a public URL:

1. Click **"Publish"** button (top right)
2. Select **"Publish to web"**
3. Choose **"Deployment"**
4. It will generate a public URL like: `https://industrial-safety-platform--hemanthadapa192.replit.app`

## Troubleshooting

**App won't start:**
- Kill process: `pkill -f uvicorn` or `pkill -f node`
- Clear cache: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install --legacy-peer-deps`

**Port errors:**
```bash
# Kill process on port 8000
lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 5173
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

**Missing modules:**
```bash
pip install -r requirements-fast.txt
npm install --legacy-peer-deps
```

**Frontend shows blank page:**
- Hard refresh: `Ctrl+Shift+R`
- Check browser console: `F12` → Console tab
- Look for errors

## Features Available

✅ User authentication
✅ Real-time sensor monitoring
✅ Sensor on/off control
✅ Dashboard with analytics
✅ Alerts & incidents
✅ Permits & compliance
✅ WebSocket real-time updates
✅ Watermark on all pages

## Keep App Running 24/7

Replit free tier allows 500 hours/month (~16 hours/day average).

For **always-on:**
- Upgrade to **Replit Plus** ($7/month)
- Or use an external keep-alive service

## Local Testing

To test locally first:
```bash
cd industrial-safety-platform
docker-compose -f docker-compose-fast.yml up -d

# Visit http://localhost:5173
# Login: admin/admin123
```

## Next Steps

1. ✅ Open Replit → Click **"Run"**
2. ✅ Wait for both services to start
3. ✅ Login with `admin/admin123`
4. ✅ Explore the app
5. ✅ Click **"Publish"** to get a public URL

Your app is ready!
