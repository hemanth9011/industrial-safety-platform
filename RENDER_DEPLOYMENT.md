# Deploy Industrial Safety Intelligence Platform to Render

## ✅ Code Ready
Your code has been pushed to GitHub: `https://github.com/hemanth9011/industrial-safety-platform`

## Step-by-Step Deployment

### 1. Go to Render
1. Visit **https://render.com**
2. Sign up / Log in with GitHub
3. Click **"New +"** → **"Web Service"**

### 2. Deploy Backend First

**Service Configuration:**
- **Name:** `isip-backend`
- **Runtime:** Python 3
- **Build Command:** `pip install -r requirements-fast.txt`
- **Start Command:** `python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`
- **Instance Type:** Free
- **Region:** Choose closest to you

**Environment Variables:**
```
DATABASE_URL=sqlite:///./data/industrial_safety.db
SECRET_KEY=your-secret-key-here
LOG_LEVEL=INFO
```

**After Deployment:**
- Note the backend URL: `https://isip-backend.onrender.com`
- Test health: `https://isip-backend.onrender.com/health`

### 3. Deploy Frontend

**Service Configuration:**
- **Name:** `isip-frontend`
- **Runtime:** Node 18
- **Build Command:** `npm install --legacy-peer-deps && npm run build`
- **Start Command:** `npm run preview -- --host 0.0.0.0 --port 5173`
- **Instance Type:** Free
- **Region:** Same as backend

**Environment Variables:**
```
VITE_API_URL=https://isip-backend.onrender.com
```

**After Deployment:**
- Your app will be at: `https://isip-frontend.onrender.com`

### 4. Access Your Deployed App

**Frontend:** https://isip-frontend.onrender.com
**Backend API:** https://isip-backend.onrender.com
**Health Check:** https://isip-backend.onrender.com/health

**Login Credentials:**
- Username: `admin`
- Password: `admin123`

## Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Verify `requirements-fast.txt` is correct
- Ensure `app.main:app` path is correct

### Frontend showing 404
- Hard refresh (Ctrl+Shift+R)
- Check that `VITE_API_URL` environment variable is set correctly

### Cold start issues
- Render free tier sleeps after inactivity
- First request may take 30-60 seconds
- Consider upgrading to paid tier for production

## Features Deployed
✅ User authentication (admin/admin123)
✅ Real-time sensor monitoring
✅ Sensor on/off controls
✅ Dashboard with analytics
✅ Alerts & incidents management
✅ Permits & compliance
✅ WebSocket support

## Next Steps (Production)
- Add custom domain
- Enable auto-deploy on git push
- Upgrade to paid tier for guaranteed uptime
- Set up SSL certificates (automatic on Render)
- Configure production database (PostgreSQL)
- Add monitoring & alerting
