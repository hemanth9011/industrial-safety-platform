from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.sensor import SensorReading, SensorStats
from datetime import datetime, timedelta
import random
import uuid

router = APIRouter()

# In-memory storage for sensor states
sensor_states = {}

def generate_sensor_reading(sensor_id: str, sensor_type: str, zone: str):
    """Generate realistic sensor readings with varying status"""
    readings = {
        "temperature": {"min": 15, "max": 45, "unit": "°C", "warning": 35, "critical": 40},
        "pressure": {"min": 0.8, "max": 1.2, "unit": "bar", "warning": 1.05, "critical": 1.15},
        "gas": {"min": 0, "max": 150, "unit": "ppm", "warning": 80, "critical": 120},
        "humidity": {"min": 10, "max": 95, "unit": "%", "warning": 75, "critical": 90},
        "smoke": {"min": 0, "max": 1500, "unit": "ppm", "warning": 800, "critical": 1200},
        "vibration": {"min": 0, "max": 80, "unit": "mm/s", "warning": 40, "critical": 60},
        "power_usage": {"min": 100, "max": 8000, "unit": "W", "warning": 6000, "critical": 7500},
    }
    
    config = readings.get(sensor_type, {"min": 0, "max": 100, "unit": "unit", "warning": 70, "critical": 90})
    value = round(random.uniform(config["min"], config["max"]), 2)
    
    # Check if sensor is powered off
    if sensor_id in sensor_states and sensor_states[sensor_id]["is_on"] == False:
        return {
            "id": str(uuid.uuid4()),
            "sensor_id": sensor_id,
            "sensor_type": sensor_type,
            "value": 0,
            "unit": config["unit"],
            "zone": zone,
            "status": "offline",
            "timestamp": datetime.utcnow().isoformat(),
            "is_on": False,
        }
    
    # Determine status based on thresholds
    if value >= config["critical"]:
        status = "critical"
    elif value >= config["warning"]:
        status = "warning"
    else:
        status = "normal"
    
    return {
        "id": str(uuid.uuid4()),
        "sensor_id": sensor_id,
        "sensor_type": sensor_type,
        "value": value,
        "unit": config["unit"],
        "zone": zone,
        "status": status,
        "timestamp": datetime.utcnow().isoformat(),
        "is_on": True,
    }

@router.get("/readings", response_model=list)
async def get_sensor_readings(
    zone: str = Query(None),
    sensor_type: str = Query(None),
    db: Session = Depends(get_db)
):
    """Get sensor readings with varying statuses"""
    readings = []
    zones = ["A", "B", "C", "D"]
    sensor_types = ["temperature", "pressure", "gas", "humidity", "smoke", "vibration", "power_usage"]
    
    for z in (zones if not zone else [zone]):
        for st in (sensor_types if not sensor_type else [sensor_type]):
            sensor_id = f"sensor_{z}_{st}"
            reading = generate_sensor_reading(sensor_id, st, z)
            readings.append(reading)
    
    return readings

@router.get("/stats", response_model=SensorStats)
async def get_sensor_stats(db: Session = Depends(get_db)):
    """Get sensor statistics"""
    active = sum(1 for s in sensor_states.values() if s.get("is_on", True))
    total = 28
    return {
        "total_sensors": total,
        "active_sensors": active,
        "offline_sensors": total - active,
        "last_reading": datetime.utcnow().isoformat(),
        "average_response_time": "50ms",
    }

@router.post("/reading")
async def create_sensor_reading(reading: dict, db: Session = Depends(get_db)):
    """Create sensor reading (for simulator)"""
    sensor_id = str(uuid.uuid4())
    return {"id": sensor_id, "status": "created"}

@router.post("/control/{sensor_id}")
async def control_sensor(sensor_id: str, action: str = Query(...), db: Session = Depends(get_db)):
    """Turn sensor on/off"""
    if action not in ["on", "off"]:
        return {"error": "action must be 'on' or 'off'"}
    
    is_on = action == "on"
    sensor_states[sensor_id] = {
        "is_on": is_on,
        "controlled_at": datetime.utcnow().isoformat(),
        "status": "online" if is_on else "offline"
    }
    
    return {
        "sensor_id": sensor_id,
        "action": action,
        "status": "success",
        "is_on": is_on,
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/control/{sensor_id}")
async def get_sensor_status(sensor_id: str, db: Session = Depends(get_db)):
    """Get sensor on/off status"""
    status = sensor_states.get(sensor_id, {"is_on": True})
    return {
        "sensor_id": sensor_id,
        "is_on": status.get("is_on", True),
        "status": "online" if status.get("is_on", True) else "offline"
    }
