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
    """Generate realistic sensor readings"""
    readings = {
        "temperature": {"min": 15, "max": 35, "unit": "°C"},
        "pressure": {"min": 0.9, "max": 1.1, "unit": "bar"},
        "gas": {"min": 0, "max": 100, "unit": "ppm"},
        "humidity": {"min": 20, "max": 80, "unit": "%"},
        "smoke": {"min": 0, "max": 1000, "unit": "ppm"},
        "vibration": {"min": 0, "max": 50, "unit": "mm/s"},
        "power_usage": {"min": 100, "max": 5000, "unit": "W"},
    }
    
    config = readings.get(sensor_type, {"min": 0, "max": 100, "unit": "unit"})
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
    
    return {
        "id": str(uuid.uuid4()),
        "sensor_id": sensor_id,
        "sensor_type": sensor_type,
        "value": value,
        "unit": config["unit"],
        "zone": zone,
        "status": "normal" if value < (config["max"] * 0.7) else "warning",
        "timestamp": datetime.utcnow().isoformat(),
        "is_on": True,
    }

@router.get("/readings", response_model=list)
async def get_sensor_readings(
    zone: str = Query(None),
    sensor_type: str = Query(None),
    db: Session = Depends(get_db)
):
    """Get sensor readings"""
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
