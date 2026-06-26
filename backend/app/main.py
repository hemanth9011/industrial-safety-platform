from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
from pathlib import Path

from app.core.config import settings
from app.api.routes import auth, dashboard, sensors, alerts, incidents, permits, predictions, compliance
from app.core.database import engine, Base
from app.core.websocket import manager

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create database tables
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Industrial Safety Intelligence Platform")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created")
    yield
    # Shutdown
    logger.info("Shutting down application")

app = FastAPI(
    title="Industrial Safety Intelligence Platform",
    description="AI-powered industrial safety monitoring system",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(sensors.router, prefix="/api/sensors", tags=["Sensors"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(incidents.router, prefix="/api/incidents", tags=["Incidents"])
app.include_router(permits.router, prefix="/api/permits", tags=["Permits"])
app.include_router(predictions.router, prefix="/api/predictions", tags=["Predictions"])
app.include_router(compliance.router, prefix="/api/compliance", tags=["Compliance"])

# WebSocket endpoint
@app.websocket("/ws/dashboard")
async def websocket_endpoint(websocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"Data: {data}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
