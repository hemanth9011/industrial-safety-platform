from sqlalchemy import Column, String, Boolean, DateTime, Enum
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    SUPERVISOR = "supervisor"
    OPERATOR = "operator"
    AUDITOR = "auditor"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(Enum(UserRole), default=UserRole.OPERATOR)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
