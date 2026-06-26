from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.permit import Permit, PermitResponse
from datetime import datetime, timedelta
import random
import uuid

router = APIRouter()

@router.get("/", response_model=list)
async def get_permits(
    permit_type: str = Query(None),
    status: str = Query(None),
    db: Session = Depends(get_db)
):
    """Get permits with optional filtering"""
    permits = []
    permit_types = ["hot_work", "electrical", "confined_space", "height_work"]
    statuses = ["draft", "active", "expired", "revoked"]
    
    for i in range(random.randint(3, 6)):
        permit = {
            "id": str(uuid.uuid4()),
            "permit_type": permit_type or random.choice(permit_types),
            "status": status or random.choice(statuses),
            "zone": random.choice(["A", "B", "C", "D"]),
            "issued_by": f"Supervisor_{random.randint(1, 3)}",
            "worker_name": f"Worker_{random.randint(1, 20)}",
            "issued_at": (datetime.utcnow() - timedelta(days=random.randint(0, 30))).isoformat(),
            "expires_at": (datetime.utcnow() + timedelta(days=random.randint(1, 30))).isoformat(),
        }
        permits.append(permit)
    
    return permits

@router.get("/{permit_id}", response_model=PermitResponse)
async def get_permit(permit_id: str, db: Session = Depends(get_db)):
    """Get specific permit"""
    return {
        "id": permit_id,
        "permit_type": "hot_work",
        "status": "active",
        "zone": "B",
        "issued_by": "Supervisor_1",
        "worker_name": "Worker_5",
        "description": "Hot work permit for welding operations",
        "issued_at": datetime.utcnow().isoformat(),
        "expires_at": (datetime.utcnow() + timedelta(days=7)).isoformat(),
    }

@router.post("/", response_model=dict)
async def create_permit(permit: dict, db: Session = Depends(get_db)):
    """Create new permit"""
    permit_id = str(uuid.uuid4())
    return {"id": permit_id, "status": "created", "message": "Permit created successfully"}

@router.put("/{permit_id}", response_model=dict)
async def update_permit(permit_id: str, permit: dict, db: Session = Depends(get_db)):
    """Update permit"""
    return {"id": permit_id, "status": "updated", "message": "Permit updated successfully"}

@router.post("/{permit_id}/revoke")
async def revoke_permit(permit_id: str, db: Session = Depends(get_db)):
    """Revoke permit"""
    return {"id": permit_id, "status": "revoked", "message": "Permit revoked"}
