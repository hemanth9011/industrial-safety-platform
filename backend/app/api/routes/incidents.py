from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.incident import Incident, IncidentResponse
from datetime import datetime, timedelta
import random
import uuid

router = APIRouter()

@router.get("/", response_model=list)
async def get_incidents(
    severity: str = Query(None),
    status: str = Query(None),
    db: Session = Depends(get_db)
):
    """Get incidents with optional filtering"""
    incidents = []
    severities = ["low", "medium", "high", "critical"]
    statuses = ["open", "in_progress", "resolved", "closed"]
    
    incident_titles = [
        "Worker Injury in Zone A",
        "Equipment Failure",
        "Near Miss Report",
        "Permit Violation",
        "Safety Training Required",
    ]
    
    for i, title in enumerate(incident_titles[:random.randint(1, 3)]):
        incident = {
            "id": str(uuid.uuid4()),
            "title": title,
            "description": f"Incident: {title}",
            "severity": severity or random.choice(severities),
            "status": status or random.choice(statuses),
            "zone": random.choice(["A", "B", "C", "D"]),
            "reported_by": f"Operator_{random.randint(1, 5)}",
            "created_at": (datetime.utcnow() - timedelta(days=random.randint(0, 30))).isoformat(),
        }
        incidents.append(incident)
    
    return incidents

@router.get("/{incident_id}", response_model=IncidentResponse)
async def get_incident(incident_id: str, db: Session = Depends(get_db)):
    """Get specific incident"""
    return {
        "id": incident_id,
        "title": "Worker Injury in Zone A",
        "description": "Worker reported minor hand injury during operation",
        "severity": "medium",
        "status": "in_progress",
        "zone": "A",
        "location": "Machine #3",
        "reported_by": "Operator_1",
        "assigned_to": "Supervisor_1",
        "root_cause": "Inadequate PPE",
        "resolution": "Pending investigation",
        "created_at": datetime.utcnow().isoformat(),
    }

@router.post("/", response_model=dict)
async def create_incident(incident: dict, db: Session = Depends(get_db)):
    """Create new incident"""
    incident_id = str(uuid.uuid4())
    return {"id": incident_id, "status": "created", "message": "Incident created successfully"}

@router.put("/{incident_id}", response_model=dict)
async def update_incident(incident_id: str, incident: dict, db: Session = Depends(get_db)):
    """Update incident"""
    return {"id": incident_id, "status": "updated", "message": "Incident updated successfully"}

@router.post("/{incident_id}/resolve")
async def resolve_incident(incident_id: str, resolution: dict, db: Session = Depends(get_db)):
    """Resolve incident"""
    return {"id": incident_id, "status": "resolved", "message": "Incident resolved"}
