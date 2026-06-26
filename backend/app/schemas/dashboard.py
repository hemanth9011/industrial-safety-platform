from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class ZoneRisk(BaseModel):
    name: str
    risk_level: str
    score: float

class RiskMetrics(BaseModel):
    current_risk: Dict
    zones: List[ZoneRisk]
    top_risks: List[Dict]

class DashboardStats(BaseModel):
    risk_score: float
    active_alerts: int
    incidents_today: int
    active_permits: int
    workers_on_site: int
    machine_health: float
    temperature: float
    humidity: int
    last_update: str
