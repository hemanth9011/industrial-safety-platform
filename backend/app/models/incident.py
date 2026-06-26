from sqlalchemy import Column, String, Float, DateTime, Boolean, Text, Integer, Enum
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class IncidentSeverity(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class IncidentStatus(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    severity = Column(Enum(IncidentSeverity), index=True)
    status = Column(Enum(IncidentStatus), default=IncidentStatus.OPEN, index=True)
    zone = Column(String)
    location = Column(String)
    reported_by = Column(String)
    assigned_to = Column(String, nullable=True)
    root_cause = Column(Text, nullable=True)
    resolution = Column(Text, nullable=True)
    media_url = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), index=True)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    resolved_at = Column(DateTime, nullable=True)
