# Grok AI Integration Guide

Grok AI is integrated into the Industrial Safety Intelligence Platform for advanced safety analysis and compliance checking.

## Getting Grok API Key

1. Go to **https://console.x.ai**
2. Sign up for X.AI account
3. Create a new API key
4. Copy the API key

## Set Up Grok API Key

### Local Development
Create `.env` file in `backend/` directory:
```
GROK_API_KEY=your-grok-api-key-here
```

### On Replit
1. Go to Replit Secrets (lock icon on left sidebar)
2. Add new secret:
   - Key: `GROK_API_KEY`
   - Value: `your-grok-api-key-here`
3. Restart the app

### On Production (Render/Railway/Fly.io)
1. Go to your deployment dashboard
2. Go to **Environment Variables** / **Secrets**
3. Add:
   ```
   GROK_API_KEY=your-grok-api-key-here
   ```
4. Redeploy

## API Endpoints

### 1. Analyze Safety Incident
**POST** `/api/grok/analyze-incident`

Request:
```json
{
  "incident_description": "Chemical spill in warehouse zone A with 5 workers nearby"
}
```

Response:
```json
{
  "analysis": "Risk Level: CRITICAL...",
  "model": "grok-2",
  "status": "success"
}
```

### 2. Get Safety Recommendations
**POST** `/api/grok/safety-recommendations`

Request:
```json
{
  "temperature": 45,
  "pressure": 1.2,
  "gas": 150,
  "humidity": 85,
  "smoke": 950
}
```

Response:
```json
{
  "recommendations": "ALERT: Multiple thresholds exceeded...",
  "status": "success"
}
```

### 3. Compliance Check
**POST** `/api/grok/compliance-check`

Request:
```json
{
  "document_text": "...safety procedures document...",
  "regulation": "OSHA"
}
```

Response:
```json
{
  "compliance_report": "Compliance Status: NON-COMPLIANT...",
  "regulation": "OSHA",
  "status": "success"
}
```

### 4. Check Grok Status
**GET** `/api/grok/status`

Response:
```json
{
  "status": "configured",
  "model": "grok-2"
}
```

## Features

✅ **Incident Analysis** - AI-powered safety incident analysis
✅ **Safety Recommendations** - Real-time recommendations based on sensor data
✅ **Compliance Checking** - Automatic compliance verification
✅ **Risk Assessment** - Automated risk level determination
✅ **Root Cause Analysis** - AI-powered investigation
✅ **Prevention Measures** - Proactive safety recommendations

## Usage in Application

### From Frontend
```typescript
// Analyze an incident
const response = await fetch('/api/grok/analyze-incident', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    incident_description: 'Description of incident'
  })
})

// Get safety recommendations
const recResponse = await fetch('/api/grok/safety-recommendations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    temperature: 42,
    pressure: 1.15,
    gas: 120,
    humidity: 80,
    smoke: 1200
  })
})
```

## Pricing

- **Free tier:** 10,000 tokens/month
- **Pro:** $20/month (unlimited for most users)
- Each request uses ~500-1000 tokens

## Troubleshooting

**"Grok API key not configured"**
- Ensure GROK_API_KEY environment variable is set
- Check the key is valid and active
- Restart the application

**"Grok API error: 401"**
- API key is invalid or expired
- Generate a new key from console.x.ai

**"Grok API error: 429"**
- Rate limit exceeded
- Wait a moment and retry
- Consider upgrading plan

## Monitoring Usage

Check your API usage on: https://console.x.ai/usage

## Next Steps

1. ✅ Get API key from X.AI
2. ✅ Set GROK_API_KEY environment variable
3. ✅ Test endpoints via API docs at `/api/docs`
4. ✅ Integrate into UI components
5. ✅ Monitor usage

Your app now has powerful AI-driven safety analysis! 🚀
