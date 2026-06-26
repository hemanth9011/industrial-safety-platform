from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.sensor import SensorReading, SensorStats
from datetime import datetime, timedelta
import random
import uuid

router = APIRouter()

# In-memory storage for demo
sensor_data = {}

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
    
    return {
        "id": str(uuid.uuid4()),
        "sensor_id": sensor_id,
        "sensor_type": sensor_type,
        "value": value,
        "unit": config["unit"],
        "zone": zone,
        "status": "normal" if value < (config["max"] * 0.7) else "warning",
        "timestamp": datetime.utcnow().isoformat(),
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
            reading = generate_sensor_reading(f"sensor_{z}_{st}", st, z)
            readings.append(reading)
    
    return readings

@router.get("/stats", response_model=SensorStats)
async def get_sensor_stats(db: Session = Depends(get_db)):
    """Get sensor statistics"""
    return {
        "total_sensors": 28,
        "active_sensors": 28,
        "offline_sensors": 0,
        "last_reading": datetime.utcnow().isoformat(),
        "average_response_time": "50ms",
    }

@router.post("/reading")
async def create_sensor_reading(reading: dict, db: Session = Depends(get_db)):
    """Create sensor reading (for simulator)"""
    sensor_id = str(uuid.uuid4())
    sensor_data[sensor_id] = reading
    return {"id": sensor_id, "status": "created"}
