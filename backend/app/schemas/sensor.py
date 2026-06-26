from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SensorReading(BaseModel):
    id: str
    sensor_id: str
    sensor_type: str
    value: float
    unit: str
    zone: str
    status: str
    timestamp: str

class SensorStats(BaseModel):
    total_sensors: int
    active_sensors: int
    offline_sensors: int
    last_reading: str
    average_response_time: str
