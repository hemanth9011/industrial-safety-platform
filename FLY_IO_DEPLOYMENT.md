# Deploy to Fly.io (Best Free Tier for This Project)

Fly.io has **3 free shared-cpu-1x 256MB VMs** perfect for this project.

## Step 1: Install Fly CLI

```bash
# macOS
brew install flyctl

# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# Linux
curl -L https://fly.io/install.sh | sh
```

Then: `flyctl auth login`

## Step 2: Deploy to Fly.io

From your project root:

```bash
flyctl launch
```

When prompted:
- **App name:** `industrial-safety-isip` (or your choice)
- **Region:** Pick closest to you (e.g., `sin` for Singapore, `iad` for US)
- **Postgres database:** NO (we use SQLite)
- **Redis:** NO
- **Deploy now:** YES

## Step 3: Set Environment Variables

```bash
flyctl secrets set DATABASE_URL=sqlite:///./data/industrial_safety.db
flyctl secrets set SECRET_KEY=$(openssl rand -base64 32)
```

## Step 4: Check Deployment

```bash
# View logs
flyctl logs

# Open app
flyctl open

# App URL will be: https://<app-name>.fly.dev
```

## Step 5: Configure Fly.toml (If Needed)

The `fly.toml` is auto-generated. Check it has:

```toml
[build]
  dockerfile = "Dockerfile"

[[services]]
  protocol = "tcp"
  internal_port = 8000
  processes = ["backend"]

[[services]]
  protocol = "tcp"
  internal_port = 5173
  processes = ["frontend"]
```

## Step 6: Access Your App

- **Frontend:** `https://<app-name>.fly.dev`
- **Backend API:** `https://<app-name>.fly.dev/api`
- **Login:** `admin` / `admin123`

## Free Tier Limits (Fly.io)

✅ **3 shared-cpu-1x 256MB VMs** (perfect for 2 services)
✅ **3 GB persistent storage**
✅ **160 GB outbound data/month**
✅ **No cold starts** - always running
✅ **Free SSL certificates**

## Scale Commands

```bash
# View current resources
flyctl status

# View scales
flyctl scale show

# Scale down to free tier
flyctl scale vm shared-cpu-1x --memory 256

# Deploy updates
git push (auto-deploys with CI/CD)
```

## Troubleshooting

**App won't start:**
```bash
flyctl logs --tail
```

**Need to redeploy:**
```bash
flyctl deploy
```

**Check health:**
```bash
flyctl status
```

## Why Fly.io Over Others

| Platform | Cold Starts | Free Tier | Cost | Performance |
|----------|-----------|-----------|------|-------------|
| **Fly.io** | ✅ None | ✅ 3 VMs | Free | ⭐⭐⭐⭐⭐ |
| Render | ❌ 30s+ | Limited | $5+ | ⭐⭐⭐ |
| Railway | ❌ Quota | $5 credit | Limited | ⭐⭐⭐⭐ |
| Heroku | ❌ 30s+ | ❌ Ended | $7+ | ⭐⭐⭐ |

**Fly.io is the best free option right now.**
