[build]
  builder = "heroku/buildpacks:20"

[env]
  DATABASE_URL = "sqlite:///./data/industrial_safety.db"
  PYTHONUNBUFFERED = "1"

[scripts]
  web = "python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT"
