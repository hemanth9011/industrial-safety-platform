from sqlalchemy import Column, String, Float, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base

class RiskPrediction(Base):
    __tablename__ = "risk_predictions"

    id = Column(String, primary_key=True, index=True)
    risk_level = Column(String)  # safe, warning, critical
    risk_score = Column(Float)
    confidence = Column(Float)
    features_used = Column(String)  # JSON string of features
    explanation = Column(Text)
    zone = Column(String)
    timestamp = Column(DateTime, index=True)
    created_at = Column(DateTime, server_default=func.now())
