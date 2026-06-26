from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from datetime import datetime
import uuid

router = APIRouter()

# Demo compliance documents
compliance_docs = {}
knowledge_base = {
    "fire_safety": "Emergency procedures: 1. Activate alarm 2. Evacuate via nearest exit 3. Assemble at muster point",
    "ppe": "Personal Protective Equipment: Hard hats in construction zones, Safety vests in operational areas, Steel-toed boots mandatory",
    "confined_space": "Confined space entry requires: Permit, Atmospheric testing, Rescue team standby, Communication system",
    "electrical_safety": "Electrical safety: Lock-out tag-out (LOTO) required before maintenance, Test for absence of voltage",
    "first_aid": "First aid: Call emergency services (9-1-1), Provide basic life support if trained, Document incident",
}

@router.post("/upload")
async def upload_compliance_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload compliance document (PDF)"""
    doc_id = str(uuid.uuid4())
    compliance_docs[doc_id] = {
        "filename": file.filename,
        "uploaded_at": datetime.utcnow().isoformat(),
        "size": file.size,
    }
    return {"id": doc_id, "filename": file.filename, "status": "uploaded"}

@router.get("/documents")
async def get_compliance_documents(db: Session = Depends(get_db)):
    """Get all compliance documents"""
    return [
        {"id": "doc_1", "filename": "Safety_Regulations_2024.pdf", "type": "regulation", "uploaded_at": datetime.utcnow().isoformat()},
        {"id": "doc_2", "filename": "OSHA_Standards.pdf", "type": "standard", "uploaded_at": datetime.utcnow().isoformat()},
        {"id": "doc_3", "filename": "Company_Safety_Guidelines.pdf", "type": "guideline", "uploaded_at": datetime.utcnow().isoformat()},
    ]

@router.post("/query")
async def query_compliance(query: dict, db: Session = Depends(get_db)):
    """Query compliance documents using RAG"""
    question = query.get("question", "")
    
    # Simple keyword matching for demo RAG
    answer = None
    source = None
    
    for key, value in knowledge_base.items():
        if any(word in question.lower() for word in key.split("_")):
            answer = value
            source = f"Safety_Guidelines_{key}.pdf"
            break
    
    if not answer:
        answer = "I could not find this information in the uploaded regulations. Please consult the Safety Officer."
        source = None
    
    return {
        "question": question,
        "answer": answer,
        "source": source,
        "confidence": 0.85 if source else 0.0,
        "timestamp": datetime.utcnow().isoformat(),
    }

@router.get("/search")
async def search_compliance(query: str, db: Session = Depends(get_db)):
    """Search compliance documents"""
    results = []
    for key, value in knowledge_base.items():
        if query.lower() in value.lower():
            results.append({
                "document": f"Safety_Guidelines_{key}.pdf",
                "excerpt": value[:200],
                "relevance": 0.9,
            })
    return results
