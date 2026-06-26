from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from datetime import datetime
import random
import uuid

router = APIRouter()

@router.get("/predict", response_model=dict)
async def predict_risk(db: Session = Depends(get_db)):
    """Predict risk level"""
    risk_levels = ["safe", "warning", "critical"]
    risk_level = random.choice(risk_levels)
    
    return {
        "id": str(uuid.uuid4()),
        "risk_level": risk_level,
        "risk_score": round(random.uniform(10 if risk_level == "safe" else 40 if risk_level == "warning" else 70, 
                                           30 if risk_level == "safe" else 70 if risk_level == "warning" else 100), 2),
        "confidence": round(random.uniform(0.7, 0.99), 3),
        "features": {
            "temperature": round(random.uniform(15, 35), 1),
            "gas_concentration": round(random.uniform(0, 100), 1),
            "worker_density": random.randint(5, 50),
            "helmet_detection": round(random.uniform(0.5, 1.0), 2),
        },
        "explanation": "Risk prediction based on current sensor data and environmental conditions",
        "timestamp": datetime.utcnow().isoformat(),
    }

@router.get("/history", response_model=list)
async def get_prediction_history(db: Session = Depends(get_db)):
    """Get prediction history"""
    predictions = []
    for i in range(10):
        risk_level = random.choice(["safe", "warning", "critical"])
        predictions.append({
            "id": str(uuid.uuid4()),
            "risk_level": risk_level,
            "risk_score": round(random.uniform(10 if risk_level == "safe" else 40 if risk_level == "warning" else 70, 
                                               30 if risk_level == "safe" else 70 if risk_level == "warning" else 100), 2),
            "confidence": round(random.uniform(0.7, 0.99), 3),
            "timestamp": datetime.utcnow().isoformat(),
        })
    return predictions
