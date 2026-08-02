# Deploy to Render

## Steps to Deploy:

### 1. Push to GitHub
```bash
git push origin main
```

### 2. Connect Render to GitHub
- Go to https://render.com
- Sign up/Log in with GitHub
- Click "New +" → "Web Service"
- Select your GitHub repo: `industrial-safety-platform`

### 3. Configure Backend Service
- Name: `isip-backend`
- Runtime: Python 3
- Build Command: `pip install -r requirements-fast.txt`
- Start Command: `python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`
- Root Directory: `.` (or leave empty)
- Environment Variables:
  - `DATABASE_URL`: `sqlite:///./data/industrial_safety.db`
  - `SECRET_KEY`: (Render generates automatically)

### 4. Configure Frontend Service
- Name: `isip-frontend`
- Runtime: Node 18
- Build Command: `npm install --legacy-peer-deps && npm run build && npm run preview -- --host 0.0.0.0`
- Environment Variables:
  - `VITE_API_URL`: `https://isip-backend.onrender.com` (update after backend is deployed)

### 5. Deploy
- Click "Create Web Service"
- Render will build and deploy automatically
- Your app will be live at: `https://isip-frontend.onrender.com`

## URLs After Deployment
- **Frontend:** https://isip-frontend.onrender.com
- **Backend API:** https://isip-backend.onrender.com
- **Health Check:** https://isip-backend.onrender.com/health

## Login Credentials
- Username: `admin`
- Password: `admin123`

## Notes
- First deploy takes 5-10 minutes
- Render automatically rebuilds on git push
- Free tier has 750 hours/month
- Use paid tier for production

## Troubleshooting
If deployment fails:
1. Check build logs in Render dashboard
2. Verify GitHub repo is public
3. Check environment variables are set correctly
4. Ensure requirements-fast.txt has all dependencies
