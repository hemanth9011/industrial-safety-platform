from sqlalchemy import Column, String, DateTime, Boolean, Text, Enum
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class PermitType(str, enum.Enum):
    HOT_WORK = "hot_work"
    ELECTRICAL = "electrical"
    CONFINED_SPACE = "confined_space"
    HEIGHT_WORK = "height_work"

class PermitStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    EXPIRED = "expired"
    REVOKED = "revoked"

class Permit(Base):
    __tablename__ = "permits"

    id = Column(String, primary_key=True, index=True)
    permit_type = Column(Enum(PermitType), index=True)
    status = Column(Enum(PermitStatus), default=PermitStatus.DRAFT, index=True)
    zone = Column(String)
    issued_by = Column(String)
    approved_by = Column(String, nullable=True)
    worker_name = Column(String)
    description = Column(Text)
    issued_at = Column(DateTime, server_default=func.now())
    expires_at = Column(DateTime, index=True)
    revoked_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
