# Deploy to Railway (Fast Alternative to Render)

Railway has **faster cold starts** and **better free tier** than Render.

## Step 1: Set Up Railway Account
1. Go to **https://railway.app**
2. Sign up with GitHub
3. Create a new project

## Step 2: Deploy Backend

**From Railway Dashboard:**
1. Click **"+ New"** → **"GitHub Repo"**
2. Select `industrial-safety-platform`
3. Choose deployment region closest to you
4. Go to **Variables** and add:
   ```
   DATABASE_URL=sqlite:///./data/industrial_safety.db
   SECRET_KEY=your-secret-key-here
   PYTHONUNBUFFERED=1
   ```
5. Go to **Settings** → **Build**:
   - **Build Command:** `pip install -r requirements-fast.txt`
   - **Start Command:** `python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`
6. Create a **Service**

Your backend URL will be: `https://<your-backend-name>.up.railway.app`

## Step 3: Deploy Frontend

1. Click **"+ New"** → **"GitHub Repo"** in same project
2. Select `industrial-safety-platform` again
3. Go to **Variables** and add:
   ```
   VITE_API_URL=https://<your-backend-name>.up.railway.app
   NODE_ENV=production
   ```
4. Go to **Settings** → **Build**:
   - **Build Command:** `npm install --legacy-peer-deps && npm run build`
   - **Start Command:** `npx serve -s dist -l 3000`
5. Create a **Service**

Your frontend URL will be: `https://<your-frontend-name>.up.railway.app`

## Step 4: Access Your App

- **Frontend:** `https://<your-frontend-name>.up.railway.app`
- **Backend:** `https://<your-backend-name>.up.railway.app`
- **Login:** `admin` / `admin123`

## Why Railway is Faster

✅ **No cold starts** - keeps services warm
✅ **Free tier with $5/month credit** - enough for this project
✅ **Built-in observability** - see logs easily
✅ **Faster deployment** - ~2 minutes vs Render's 10+

## Local Testing (Verify Everything Works)

Before deploying to Railway, ensure it works locally:

```bash
cd industrial-safety-platform
docker-compose -f docker-compose-fast.yml up -d
# Visit http://localhost:5173
# Login: admin/admin123
```

## Troubleshooting on Railway

**Backend won't start:**
- Check Logs in Railway dashboard
- Verify `requirements-fast.txt` has all dependencies
- Check environment variables are set

**Frontend shows blank page:**
- Hard refresh (Ctrl+Shift+R)
- Check VITE_API_URL points to correct backend URL
- Check browser console for errors
