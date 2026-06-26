from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class IncidentResponse(BaseModel):
    id: str
    title: str
    description: str
    severity: str
    status: str
    zone: str
    location: str
    reported_by: str
    assigned_to: Optional[str]
    root_cause: Optional[str]
    resolution: Optional[str]
    created_at: str

class Incident(BaseModel):
    id: str
    title: str
    description: str
    severity: str
    status: str
    zone: str
    reported_by: str
    created_at: str
