"""RAG (Retrieval Augmented Generation) Module"""
from typing import List, Dict, Optional
import json
import numpy as np
from pathlib import Path

class RAGSystem:
    def __init__(self):
        """Initialize RAG system"""
        self.documents = {}
        self.embeddings = {}
        self.knowledge_base = self._initialize_kb()

    def _initialize_kb(self) -> Dict[str, str]:
        """Initialize knowledge base with safety regulations"""
        return {
            "fire_safety": {
                "content": "Fire Safety Procedures:\n"
                          "1. In case of fire, activate the nearest alarm\n"
                          "2. Evacuate using the nearest emergency exit\n"
                          "3. Proceed to the designated muster point\n"
                          "4. Account for all personnel\n"
                          "5. Do not re-enter the building\n",
                "tags": ["emergency", "fire", "evacuation"]
            },
            "ppe_requirements": {
                "content": "Personal Protective Equipment (PPE):\n"
                          "- Hard hats required in construction zones\n"
                          "- Safety vests mandatory in all operational areas\n"
                          "- Steel-toed boots must be worn at all times\n"
                          "- Safety glasses required in hazardous areas\n"
                          "- Gloves required when handling sharp materials\n",
                "tags": ["ppe", "safety", "equipment"]
            },
            "confined_space": {
                "content": "Confined Space Entry Procedures:\n"
                          "- Obtain permit before entry\n"
                          "- Perform atmospheric testing\n"
                          "- Have rescue team on standby\n"
                          "- Establish communication system\n"
                          "- Use proper ventilation\n"
                          "- Maximum occupancy: 2 persons\n",
                "tags": ["confined_space", "permit", "safety"]
            },
            "electrical_safety": {
                "content": "Electrical Safety Standards:\n"
                          "- Lock-out tag-out (LOTO) required before work\n"
                          "- Test for absence of voltage\n"
                          "- Use insulated tools only\n"
                          "- Keep area dry\n"
                          "- Report any damage to equipment\n"
                          "- Maximum voltage for portable tools: 110V\n",
                "tags": ["electrical", "safety", "loto"]
            },
            "first_aid": {
                "content": "First Aid Procedures:\n"
                          "1. Call emergency services (911)\n"
                          "2. Check for consciousness and breathing\n"
                          "3. Provide basic life support if trained\n"
                          "4. Place in recovery position\n"
                          "5. Keep warm and reassure\n"
                          "6. Document incident details\n",
                "tags": ["first_aid", "emergency", "medical"]
            },
            "incident_reporting": {
                "content": "Incident Reporting Requirements:\n"
                          "- Report within 24 hours\n"
                          "- Include witness statements\n"
                          "- Document environmental conditions\n"
                          "- Take photographs if possible\n"
                          "- Complete incident form\n"
                          "- Notify supervisor immediately\n",
                "tags": ["incident", "reporting", "documentation"]
            },
        }

    def add_document(self, doc_id: str, content: str, doc_type: str = "regulation"):
        """Add a document to the knowledge base"""
        self.documents[doc_id] = {
            "content": content,
            "type": doc_type,
        }

    def simple_search(self, query: str) -> List[Dict]:
        """Simple keyword search in knowledge base"""
        results = []
        query_lower = query.lower()
        
        for doc_id, doc in self.knowledge_base.items():
            content_lower = doc["content"].lower()
            if any(keyword in content_lower for keyword in query_lower.split()):
                results.append({
                    "document_id": doc_id,
                    "excerpt": doc["content"][:300],
                    "relevance": 0.85,
                    "tags": doc["tags"],
                })
        
        return results

    def semantic_search(self, query: str, top_k: int = 3) -> List[Dict]:
        """Semantic search using TF-IDF-like approach"""
        results = self.simple_search(query)
        return results[:top_k]

    def query(self, question: str) -> Dict:
        """
        Query the RAG system with a question.
        Returns: answer, source, confidence
        """
        # Search for relevant documents
        search_results = self.semantic_search(question)
        
        if not search_results:
            return {
                "question": question,
                "answer": "I could not find this information in the uploaded regulations. Please consult the Safety Officer.",
                "source": None,
                "confidence": 0.0,
            }
        
        # Use the most relevant result
        best_result = search_results[0]
        kb_entry = self.knowledge_base.get(best_result["document_id"], {})
        
        return {
            "question": question,
            "answer": kb_entry.get("content", "Information not available"),
            "source": best_result["document_id"],
            "confidence": best_result["relevance"],
            "tags": best_result.get("tags", []),
        }

# Global RAG system instance
rag_system = RAGSystem()
