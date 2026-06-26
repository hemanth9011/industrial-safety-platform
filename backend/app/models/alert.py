from sqlalchemy import Column, String, Float, DateTime, Boolean, Enum, Text
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class AlertPriority(str, enum.Enum):
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"

class AlertStatus(str, enum.Enum):
    ACTIVE = "active"
    ACKNOWLEDGED = "acknowledged"
    RESOLVED = "resolved"

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    priority = Column(Enum(AlertPriority), index=True)
    status = Column(Enum(AlertStatus), default=AlertStatus.ACTIVE, index=True)
    risk_score = Column(Float)
    zone = Column(String)
    reason = Column(Text)
    recommendation = Column(Text)
    acknowledged_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), index=True)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
