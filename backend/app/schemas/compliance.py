from pydantic import BaseModel
from typing import Optional

class ComplianceQuery(BaseModel):
    question: str

class ComplianceResponse(BaseModel):
    question: str
    answer: str
    source: Optional[str]
    confidence: float
    timestamp: str
