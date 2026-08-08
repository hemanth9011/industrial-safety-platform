import os
from typing import Optional
import httpx

class GeminiService:
    """Google Gemini AI integration for Industrial Safety Platform"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY", "")
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
        self.model = "gemini-2.0-flash"
        
    async def analyze_safety_incident(self, incident_description: str) -> dict:
        """Use Gemini to analyze a safety incident"""
        if not self.api_key:
            return {"error": "Gemini API key not configured"}
        
        prompt = f"""You are an industrial safety expert. Analyze the following safety incident and provide:
1. Risk Level (Critical/High/Medium/Low)
2. Root Cause Analysis
3. Immediate Actions Required
4. Prevention Measures
5. Compliance Implications

Incident: {incident_description}

Provide a structured response."""

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}?key={self.api_key}",
                    headers={"Content-Type": "application/json"},
                    json={
                        "contents": [
                            {
                                "parts": [{"text": prompt}]
                            }
                        ],
                        "generationConfig": {
                            "temperature": 0.5,
                            "maxOutputTokens": 1000
                        }
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    analysis = data["candidates"][0]["content"]["parts"][0]["text"]
                    return {
                        "analysis": analysis,
                        "model": self.model,
                        "status": "success"
                    }
                else:
                    return {"error": f"Gemini API error: {response.status_code}"}
        except Exception as e:
            return {"error": f"Failed to analyze incident: {str(e)}"}
    
    async def get_safety_recommendations(self, sensor_data: dict) -> dict:
        """Get safety recommendations based on sensor readings"""
        if not self.api_key:
            return {"error": "Gemini API key not configured"}
        
        prompt = f"""You are an industrial safety AI. Based on the following sensor readings, 
provide safety recommendations and alerts:

Sensor Data:
- Temperature: {sensor_data.get('temperature', 'N/A')}°C
- Pressure: {sensor_data.get('pressure', 'N/A')} bar
- Gas Level: {sensor_data.get('gas', 'N/A')} ppm
- Humidity: {sensor_data.get('humidity', 'N/A')}%
- Smoke: {sensor_data.get('smoke', 'N/A')} ppm

Provide immediate safety alerts and recommendations."""

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}?key={self.api_key}",
                    headers={"Content-Type": "application/json"},
                    json={
                        "contents": [
                            {
                                "parts": [{"text": prompt}]
                            }
                        ],
                        "generationConfig": {
                            "temperature": 0.3,
                            "maxOutputTokens": 500
                        }
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    recommendations = data["candidates"][0]["content"]["parts"][0]["text"]
                    return {
                        "recommendations": recommendations,
                        "status": "success"
                    }
                else:
                    return {"error": f"Gemini API error: {response.status_code}"}
        except Exception as e:
            return {"error": f"Failed to get recommendations: {str(e)}"}
    
    async def compliance_check(self, document_text: str, regulation: str = "OSHA") -> dict:
        """Check compliance against safety regulations using Gemini"""
        if not self.api_key:
            return {"error": "Gemini API key not configured"}
        
        prompt = f"""You are a compliance expert. Review the following document against {regulation} regulations:

Document:
{document_text}

Provide:
1. Compliance Status (Compliant/Non-Compliant/Requires Review)
2. Issues Found
3. Recommendations
4. Timeline for Resolution"""

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}?key={self.api_key}",
                    headers={"Content-Type": "application/json"},
                    json={
                        "contents": [
                            {
                                "parts": [{"text": prompt}]
                            }
                        ],
                        "generationConfig": {
                            "temperature": 0.5,
                            "maxOutputTokens": 1200
                        }
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    report = data["candidates"][0]["content"]["parts"][0]["text"]
                    return {
                        "compliance_report": report,
                        "regulation": regulation,
                        "status": "success"
                    }
                else:
                    return {"error": f"Gemini API error: {response.status_code}"}
        except Exception as e:
            return {"error": f"Compliance check failed: {str(e)}"}

# Initialize service
gemini_service = GeminiService()
