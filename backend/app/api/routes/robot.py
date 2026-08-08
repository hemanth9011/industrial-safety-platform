from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.api.services.ai_robot_agent import ai_robot

router = APIRouter()

class SensorDataModel(BaseModel):
    temperature: Optional[float] = None
    pressure: Optional[float] = None
    gas: Optional[float] = None
    humidity: Optional[float] = None
    smoke: Optional[float] = None

class AlertModel(BaseModel):
    id: str
    type: str
    severity: str
    message: str
    timestamp: str

class IncidentModel(BaseModel):
    id: str
    type: str
    severity: str
    description: str
    timestamp: str

class MonitoringRequest(BaseModel):
    sensors: SensorDataModel
    alerts: List[AlertModel] = []
    incidents: List[IncidentModel] = []
    supervisor_phone: Optional[str] = None

@router.post("/monitor-and-alert")
async def monitor_and_alert(request: MonitoringRequest):
    """AI Robot monitors all data and sends alerts to supervisor via WhatsApp"""
    result = await ai_robot.monitor_and_alert(
        request.sensors.dict(),
        [a.dict() for a in request.alerts],
        [i.dict() for i in request.incidents]
    )
    return result

@router.post("/analyze-all-data")
async def analyze_all_data(request: MonitoringRequest):
    """AI Robot analyzes all sensor data, alerts, and incidents"""
    result = await ai_robot.analyze_all_data(
        request.sensors.dict(),
        [a.dict() for a in request.alerts],
        [i.dict() for i in request.incidents]
    )
    return result

@router.post("/send-alert")
async def send_alert(message: str, phone: Optional[str] = None):
    """Send WhatsApp alert to supervisor"""
    result = await ai_robot.send_whatsapp_alert(message, phone)
    if result.get("status") == "error":
        raise HTTPException(status_code=400, detail=result.get("error"))
    return result

@router.get("/robot-status")
async def robot_status():
    """Get AI Robot status"""
    return {
        "robot_name": "🤖 AI Safety Supervisor",
        "status": "active",
        "monitoring": ai_robot.is_monitoring,
        "gemini_configured": bool(ai_robot.gemini_api_key),
        "whatsapp_configured": bool(ai_robot.twilio_account_sid),
        "supervisor_phone": ai_robot.supervisor_phone,
        "model": "gemini-2.0-flash"
    }
