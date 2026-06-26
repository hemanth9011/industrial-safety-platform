from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AlertResponse(BaseModel):
    id: str
    title: str
    description: str
    priority: str
    status: str
    risk_score: float
    zone: str
    reason: str
    recommendation: str
    created_at: str

class Alert(BaseModel):
    id: str
    title: str
    description: str
    priority: str
    status: str
    risk_score: float
    zone: str
    reason: str
    recommendation: str
    created_at: str
