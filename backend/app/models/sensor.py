from sqlalchemy import Column, String, Float, DateTime, Integer, Boolean
from sqlalchemy.sql import func
from app.core.database import Base

class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(String, primary_key=True, index=True)
    sensor_id = Column(String, index=True)
    sensor_type = Column(String)  # temperature, pressure, gas, humidity, smoke, vibration, etc.
    value = Column(Float)
    unit = Column(String)
    zone = Column(String)  # A, B, C, D
    status = Column(String)  # normal, warning, critical
    timestamp = Column(DateTime, server_default=func.now(), index=True)
    created_at = Column(DateTime, server_default=func.now())
