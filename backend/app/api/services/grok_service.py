import os
from typing import Optional
import httpx

class GrokService:
    """Grok AI integration for Industrial Safety Platform"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GROK_API_KEY", "")
        self.base_url = "https://api.x.ai/v1"
        self.model = "grok-2"
        
    async def analyze_safety_incident(self, incident_description: str) -> dict:
        """Use Grok to analyze a safety incident"""
        if not self.api_key:
            return {"error": "Grok API key not configured"}
        
        prompt = f"""You are an industrial safety expert. Analyze the following safety incident and provide:
1. Risk Level (Critical/High/Medium/Low)
2. Root Cause Analysis
3. Immediate Actions Required
4. Prevention Measures
5. Compliance Implications

Incident: {incident_description}

Provide a structured JSON response."""

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.5,
                        "max_tokens": 1000
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "analysis": data["choices"][0]["message"]["content"],
                        "model": self.model,
                        "status": "success"
                    }
                else:
                    return {"error": f"Grok API error: {response.status_code}"}
        except Exception as e:
            return {"error": f"Failed to analyze incident: {str(e)}"}
    
    async def get_safety_recommendations(self, sensor_data: dict) -> dict:
        """Get safety recommendations based on sensor readings"""
        if not self.api_key:
            return {"error": "Grok API key not configured"}
        
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
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.3,
                        "max_tokens": 500
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "recommendations": data["choices"][0]["message"]["content"],
                        "status": "success"
                    }
                else:
                    return {"error": f"Grok API error: {response.status_code}"}
        except Exception as e:
            return {"error": f"Failed to get recommendations: {str(e)}"}
    
    async def compliance_check(self, document_text: str, regulation: str = "OSHA") -> dict:
        """Check compliance against safety regulations using Grok"""
        if not self.api_key:
            return {"error": "Grok API key not configured"}
        
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
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.5,
                        "max_tokens": 1200
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "compliance_report": data["choices"][0]["message"]["content"],
                        "regulation": regulation,
                        "status": "success"
                    }
                else:
                    return {"error": f"Grok API error: {response.status_code}"}
        except Exception as e:
            return {"error": f"Compliance check failed: {str(e)}"}

# Initialize service
grok_service = GrokService()
