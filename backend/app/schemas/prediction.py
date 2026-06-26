from pydantic import BaseModel
from typing import Optional, Dict

class PredictionResponse(BaseModel):
    id: str
    risk_level: str
    risk_score: float
    confidence: float
    features: Dict
    explanation: str
    timestamp: str

class Prediction(BaseModel):
    risk_level: str
    risk_score: float
    confidence: float
    timestamp: str
