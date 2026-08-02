from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.api.services.grok_service import grok_service

router = APIRouter()

class IncidentAnalysisRequest(BaseModel):
    incident_description: str

class SensorDataRequest(BaseModel):
    temperature: float = None
    pressure: float = None
    gas: float = None
    humidity: float = None
    smoke: float = None

class ComplianceCheckRequest(BaseModel):
    document_text: str
    regulation: str = "OSHA"

@router.post("/analyze-incident")
async def analyze_incident(request: IncidentAnalysisRequest):
    """Analyze a safety incident using Grok AI"""
    result = await grok_service.analyze_safety_incident(request.incident_description)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.post("/safety-recommendations")
async def get_recommendations(request: SensorDataRequest):
    """Get safety recommendations based on sensor data using Grok AI"""
    sensor_data = {
        "temperature": request.temperature,
        "pressure": request.pressure,
        "gas": request.gas,
        "humidity": request.humidity,
        "smoke": request.smoke
    }
    result = await grok_service.get_safety_recommendations(sensor_data)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.post("/compliance-check")
async def check_compliance(request: ComplianceCheckRequest):
    """Check compliance against regulations using Grok AI"""
    result = await grok_service.compliance_check(request.document_text, request.regulation)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.get("/status")
async def grok_status():
    """Check Grok API status"""
    return {
        "status": "configured" if grok_service.api_key else "not_configured",
        "model": grok_service.model
    }
