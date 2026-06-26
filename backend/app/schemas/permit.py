from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PermitResponse(BaseModel):
    id: str
    permit_type: str
    status: str
    zone: str
    issued_by: str
    worker_name: str
    description: str
    issued_at: str
    expires_at: str

class Permit(BaseModel):
    id: str
    permit_type: str
    status: str
    zone: str
    issued_by: str
    worker_name: str
    issued_at: str
    expires_at: str
