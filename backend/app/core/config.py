from pydantic_settings import BaseSettings
from typing import List
from pathlib import Path

class Settings(BaseSettings):
    # API
    API_TITLE: str = "Industrial Safety Intelligence Platform"
    API_VERSION: str = "1.0.0"
    
    # Database
    DATABASE_URL: str = "sqlite:///./data/industrial_safety.db"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/app.log"
    
    # Paths
    DATA_DIR: Path = Path("./data")
    MODELS_DIR: Path = Path("./models")
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

# Create necessary directories
settings.DATA_DIR.mkdir(parents=True, exist_ok=True)
settings.MODELS_DIR.mkdir(parents=True, exist_ok=True)
Path("logs").mkdir(parents=True, exist_ok=True)
