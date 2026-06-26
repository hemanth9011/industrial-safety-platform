from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.alert import Alert, AlertResponse
from datetime import datetime
import random
import uuid

router = APIRouter()

# Demo alerts
alerts_storage = []

@router.get("/", response_model=list)
async def get_alerts(
    priority: str = Query(None),
    status: str = Query(None),
    db: Session = Depends(get_db)
):
    """Get alerts with optional filtering"""
    alerts = []
    priorities = ["info", "warning", "critical"]
    statuses = ["active", "acknowledged", "resolved"]
    
    alert_titles = [
        "High Temperature Detected",
        "Gas Concentration Alert",
        "Worker Not Wearing Helmet",
        "Pressure Out of Range",
        "Machine Vibration Anomaly",
        "Unauthorized Zone Entry",
        "Smoke Detected",
        "Worker Density Warning",
    ]
    
    for i, title in enumerate(alert_titles[:random.randint(2, 5)]):
        alert = {
            "id": str(uuid.uuid4()),
            "title": title,
            "description": f"Alert for {title}",
            "priority": priority or random.choice(priorities),
            "status": status or "active",
            "risk_score": round(random.uniform(30, 90), 2),
            "zone": random.choice(["A", "B", "C", "D"]),
            "reason": "Sensor threshold exceeded",
            "recommendation": "Check equipment and take corrective action",
            "created_at": datetime.utcnow().isoformat(),
        }
        alerts.append(alert)
    
    return alerts

@router.get("/{alert_id}", response_model=AlertResponse)
async def get_alert(alert_id: str, db: Session = Depends(get_db)):
    """Get specific alert"""
    return {
        "id": alert_id,
        "title": "High Temperature Detected",
        "description": "Temperature exceeded safe threshold in Zone B",
        "priority": "critical",
        "status": "active",
        "risk_score": 75.5,
        "zone": "B",
        "reason": "Temperature 42°C > threshold 35°C",
        "recommendation": "Evacuate zone and investigate heat source",
        "created_at": datetime.utcnow().isoformat(),
    }

@router.post("/acknowledge/{alert_id}")
async def acknowledge_alert(alert_id: str, db: Session = Depends(get_db)):
    """Acknowledge an alert"""
    return {"id": alert_id, "status": "acknowledged", "message": "Alert acknowledged"}

@router.post("/resolve/{alert_id}")
async def resolve_alert(alert_id: str, db: Session = Depends(get_db)):
    """Resolve an alert"""
    return {"id": alert_id, "status": "resolved", "message": "Alert resolved"}
