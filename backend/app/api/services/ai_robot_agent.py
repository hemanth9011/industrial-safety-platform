import os
from typing import Optional
import httpx
from datetime import datetime
import json

class AIRobotAgent:
    """Floating AI Robot Agent for continuous monitoring and supervision"""
    
    # Sensor thresholds
    THRESHOLDS = {
        "temperature": {"warning": 35, "critical": 40},
        "pressure": {"warning": 1.05, "critical": 1.15},
        "gas": {"warning": 80, "critical": 120},
        "humidity": {"warning": 75, "critical": 90},
        "smoke": {"warning": 800, "critical": 1200}
    }
    
    def __init__(self, gemini_key: Optional[str] = None, twilio_key: Optional[str] = None):
        self.gemini_api_key = gemini_key or os.getenv("GEMINI_API_KEY", "")
        self.twilio_account_sid = os.getenv("TWILIO_ACCOUNT_SID", "")
        self.twilio_auth_token = os.getenv("TWILIO_AUTH_TOKEN", "")
        self.twilio_phone = os.getenv("TWILIO_PHONE", "")
        self.supervisor_phone = os.getenv("SUPERVISOR_PHONE", "+918639270561")
        self.gemini_base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
        self.is_monitoring = False
        
    def check_sensor_status(self, sensor_data: dict) -> dict:
        """Check sensor thresholds and determine alert level"""
        status = {
            "level": "normal",
            "critical_sensors": [],
            "warning_sensors": [],
            "details": {}
        }
        
        for sensor, value in sensor_data.items():
            if value is None:
                continue
                
            if sensor in self.THRESHOLDS:
                thresholds = self.THRESHOLDS[sensor]
                
                if value >= thresholds["critical"]:
                    status["level"] = "critical"
                    status["critical_sensors"].append({
                        "sensor": sensor,
                        "value": value,
                        "threshold": thresholds["critical"]
                    })
                    status["details"][sensor] = f"CRITICAL: {value} (threshold: {thresholds['critical']})"
                    
                elif value >= thresholds["warning"]:
                    if status["level"] != "critical":
                        status["level"] = "warning"
                    status["warning_sensors"].append({
                        "sensor": sensor,
                        "value": value,
                        "threshold": thresholds["warning"]
                    })
                    status["details"][sensor] = f"WARNING: {value} (threshold: {thresholds['warning']})"
                    
                else:
                    status["details"][sensor] = f"NORMAL: {value}"
        
        return status
    
    async def analyze_all_data(self, sensor_data: dict, alerts_data: list, incidents_data: list) -> dict:
        """AI Robot analyzes ALL sensor data, alerts, and incidents"""
        if not self.gemini_api_key:
            return {"error": "Gemini API key not configured"}
        
        # Check sensor status
        sensor_status = self.check_sensor_status(sensor_data)
        
        summary = f"""You are an AI Robot Supervisor Agent. Monitor and analyze ALL industrial safety data:

SENSOR READINGS:
- Temperature: {sensor_data.get('temperature', 'N/A')}°C (Warning: 35°C, Critical: 40°C)
- Pressure: {sensor_data.get('pressure', 'N/A')} bar (Warning: 1.05, Critical: 1.15)
- Gas Level: {sensor_data.get('gas', 'N/A')} ppm (Warning: 80, Critical: 120)
- Humidity: {sensor_data.get('humidity', 'N/A')}% (Warning: 75%, Critical: 90%)
- Smoke: {sensor_data.get('smoke', 'N/A')} ppm (Warning: 800, Critical: 1200)

SENSOR STATUS: {sensor_status['level'].upper()}
Critical Sensors: {sensor_status['critical_sensors']}
Warning Sensors: {sensor_status['warning_sensors']}

ACTIVE ALERTS: {len(alerts_data)} alerts
{json.dumps(alerts_data[:3], indent=2) if alerts_data else 'No alerts'}

INCIDENTS: {len(incidents_data)} incidents
{json.dumps(incidents_data[:3], indent=2) if incidents_data else 'No incidents'}

Provide:
1. Overall Safety Status (CRITICAL/HIGH/MEDIUM/LOW)
2. Most Urgent Issues (top 3)
3. Recommended Actions for Supervisor (numbered list, action-focused)
4. Risk Assessment (score 1-10)
5. Immediate Actions Required"""

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.gemini_base_url}?key={self.gemini_api_key}",
                    headers={"Content-Type": "application/json"},
                    json={
                        "contents": [{"parts": [{"text": summary}]}],
                        "generationConfig": {
                            "temperature": 0.7,
                            "maxOutputTokens": 2000
                        }
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    analysis = data["candidates"][0]["content"]["parts"][0]["text"]
                    return {
                        "analysis": analysis,
                        "sensor_status": sensor_status,
                        "timestamp": datetime.now().isoformat(),
                        "status": "success"
                    }
                else:
                    return {"error": f"Gemini API error: {response.status_code}"}
        except Exception as e:
            return {"error": f"AI analysis failed: {str(e)}"}
    
    async def send_whatsapp_alert(self, message: str, phone_number: Optional[str] = None) -> dict:
        """Send WhatsApp message to supervisor"""
        target_phone = phone_number or self.supervisor_phone
        
        if not self.twilio_account_sid:
            # For testing without Twilio, log the message
            return {
                "status": "simulated",
                "message": f"WhatsApp Alert sent to {target_phone}",
                "content": message,
                "timestamp": datetime.now().isoformat()
            }
        
        try:
            async with httpx.AsyncClient() as client:
                auth = (self.twilio_account_sid, self.twilio_auth_token)
                url = f"https://api.twilio.com/2010-04-01/Accounts/{self.twilio_account_sid}/Messages.json"
                
                data = {
                    "From": f"whatsapp:{self.twilio_phone}",
                    "To": f"whatsapp:{target_phone}",
                    "Body": message
                }
                
                response = await client.post(url, data=data, auth=auth, timeout=30.0)
                
                if response.status_code in [200, 201]:
                    return {
                        "status": "sent",
                        "message_id": response.json().get("sid"),
                        "phone": target_phone,
                        "timestamp": datetime.now().isoformat()
                    }
                else:
                    return {
                        "status": "failed",
                        "error": f"Twilio error: {response.status_code}",
                        "timestamp": datetime.now().isoformat()
                    }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    async def monitor_and_alert(self, sensor_data: dict, alerts_data: list, incidents_data: list) -> dict:
        """AI Robot continuously monitors and sends alerts"""
        # Check sensor thresholds
        sensor_status = self.check_sensor_status(sensor_data)
        
        # Analyze all data
        analysis_result = await self.analyze_all_data(sensor_data, alerts_data, incidents_data)
        
        if "error" in analysis_result:
            return analysis_result
        
        analysis = analysis_result.get("analysis", "")
        
        # CRITICAL Alert
        if sensor_status["level"] == "critical" or "CRITICAL" in analysis:
            critical_details = "\n".join([
                f"🔴 {s['sensor'].upper()}: {s['value']} (Critical: {s['threshold']})"
                for s in sensor_status["critical_sensors"]
            ])
            
            critical_message = f"""🚨 CRITICAL ALERT from AI Robot Supervisor 🚨

CRITICAL SENSOR VIOLATIONS:
{critical_details}

AI ANALYSIS:
{analysis[:600]}...

ACTIVE INCIDENTS: {len(incidents_data)}
ALERT COUNT: {len(alerts_data)}

Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

⚡ ACTION REQUIRED IMMEDIATELY! ⚡"""
            
            # Send WhatsApp alert
            whatsapp_result = await self.send_whatsapp_alert(critical_message)
            
            return {
                "status": "critical_alert_sent",
                "alert_level": "CRITICAL",
                "sensor_status": sensor_status,
                "analysis": analysis,
                "whatsapp": whatsapp_result,
                "timestamp": datetime.now().isoformat()
            }
        
        # WARNING Alert
        elif sensor_status["level"] == "warning" or "HIGH" in analysis or "HIGH RISK" in analysis:
            warning_details = "\n".join([
                f"⚠️ {s['sensor'].upper()}: {s['value']} (Warning: {s['threshold']})"
                for s in sensor_status["warning_sensors"]
            ])
            
            warning_message = f"""⚠️ WARNING from AI Robot Supervisor ⚠️

WARNING SENSOR LEVELS:
{warning_details}

AI ANALYSIS:
{analysis[:400]}...

INCIDENTS: {len(incidents_data)}
ALERTS: {len(alerts_data)}

Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

Please monitor closely and prepare safety protocols."""
            
            whatsapp_result = await self.send_whatsapp_alert(warning_message)
            
            return {
                "status": "warning_alert_sent",
                "alert_level": "WARNING",
                "sensor_status": sensor_status,
                "analysis": analysis,
                "whatsapp": whatsapp_result,
                "timestamp": datetime.now().isoformat()
            }
        
        # Normal monitoring
        else:
            return {
                "status": "monitoring",
                "alert_level": "NORMAL",
                "sensor_status": sensor_status,
                "analysis": analysis,
                "timestamp": datetime.now().isoformat()
            }

# Initialize AI Robot Agent
ai_robot = AIRobotAgent()
