from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.dashboard import DashboardStats, RiskMetrics
from datetime import datetime, timedelta
import random

router = APIRouter()

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics"""
    return {
        "risk_score": round(random.uniform(10, 85), 2),
        "active_alerts": random.randint(0, 15),
        "incidents_today": random.randint(0, 5),
        "active_permits": random.randint(2, 8),
        "workers_on_site": random.randint(20, 150),
        "machine_health": round(random.uniform(70, 100), 2),
        "temperature": round(random.uniform(15, 35), 1),
        "humidity": random.randint(30, 80),
        "last_update": datetime.utcnow().isoformat(),
    }

@router.get("/risk-metrics", response_model=RiskMetrics)
async def get_risk_metrics(db: Session = Depends(get_db)):
    """Get detailed risk metrics"""
    return {
        "current_risk": {
            "level": "warning",
            "score": random.uniform(40, 70),
            "timestamp": datetime.utcnow().isoformat(),
        },
        "zones": [
            {"name": "Zone A", "risk_level": "green", "score": random.uniform(10, 30)},
            {"name": "Zone B", "risk_level": "yellow", "score": random.uniform(30, 50)},
            {"name": "Zone C", "risk_level": "orange", "score": random.uniform(50, 70)},
            {"name": "Zone D", "risk_level": "green", "score": random.uniform(10, 30)},
        ],
        "top_risks": [
            {"name": "High Temperature", "score": random.uniform(60, 80)},
            {"name": "Gas Concentration", "score": random.uniform(40, 60)},
            {"name": "Worker Density", "score": random.uniform(30, 50)},
        ]
    }
