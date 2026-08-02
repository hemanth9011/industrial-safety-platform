# Deploy to Replit (Easiest - Zero Setup)

Replit is **completely free** and your app runs instantly with zero configuration.

## Step 1: Push Code to GitHub (Already Done ✅)
Your code is at: https://github.com/hemanth9011/industrial-safety-platform

## Step 2: Import to Replit

1. Go to **https://replit.com**
2. Sign up with GitHub
3. Click **"Create"** → **"Import from GitHub"**
4. Paste: `https://github.com/hemanth9011/industrial-safety-platform`
5. Click **"Import"**

## Step 3: Configure Run Command

When Replit opens:
1. Click **".replit"** file (already exists)
2. It should have:
```
run = "npm install --legacy-peer-deps && npm run build && npx concurrently \"python -m uvicorn app.main:app --host 0.0.0.0 --port 8000\" \"npx serve -s frontend/dist -l 5173\""
```

## Step 4: Install Required Packages

Click **"Shells"** → Open terminal → Run:
```bash
pip install -r requirements-fast.txt
npm install --legacy-peer-deps
```

## Step 5: Run

Click the **"Run"** button at the top.

Replit will:
- Start your backend (port 8000)
- Start your frontend (port 5173)
- Generate a public URL automatically

## Step 6: Access Your App

Your URL will be: `https://<replit-username>-<project-name>.replit.dev`

**Login:** `admin` / `admin123`

## Features on Replit ✅

✅ **Always on** - no cold starts
✅ **Free tier** - completely free
✅ **Auto HTTPS** - built-in SSL
✅ **Instant deployment** - just click Run
✅ **Hot reload** - changes auto-apply
✅ **Built-in database** - SQLite works
✅ **Free custom domain** - upgrade option

## Troubleshooting

**"Module not found" errors:**
```bash
pip install -r requirements-fast.txt
npm install --legacy-peer-deps
```

**Port already in use:**
```bash
lsof -i :8000
kill -9 <PID>
```

**Frontend shows 404:**
- Hard refresh (Ctrl+Shift+R)
- Check console for errors

## Limits (Replit Free)

- 500 hours/month (enough!)
- 0.25 vCPU
- 512 MB RAM
- Slight restrictions on outbound requests

## Upgrade to Always On

If you want guaranteed 24/7 uptime:
- **Replit Plus:** $7/month → 200 hours always-on

## Why Replit?

| Feature | Replit | Fly.io | Railway | Render |
|---------|--------|--------|---------|--------|
| Setup Time | 2 min | 10 min | 10 min | 15 min |
| Cold Starts | None | None | Yes | Yes |
| Free Tier | ✅ Full | Limited | Ended | Limited |
| Cost | Free | Free | $5+ | $5+ |
| Ease | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

**Replit is the easiest option.**
