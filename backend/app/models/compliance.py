from sqlalchemy import Column, String, DateTime, Boolean, Text, LargeBinary
from sqlalchemy.sql import func
from app.core.database import Base

class ComplianceDocument(Base):
    __tablename__ = "compliance_documents"

    id = Column(String, primary_key=True, index=True)
    filename = Column(String)
    document_type = Column(String)  # regulation, standard, guideline
    content = Column(LargeBinary)  # PDF content
    uploaded_by = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class ComplianceEmbedding(Base):
    __tablename__ = "compliance_embeddings"

    id = Column(String, primary_key=True, index=True)
    document_id = Column(String, index=True)
    chunk_text = Column(Text)
    embedding = Column(String)  # JSON string of embedding vector
    created_at = Column(DateTime, server_default=func.now())
