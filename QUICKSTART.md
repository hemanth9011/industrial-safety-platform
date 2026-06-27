# Industrial Safety Intelligence Platform - Quick Start Guide

## 🚀 Getting Started

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/hemanth9011/industrial-safety-platform.git
cd industrial-safety-platform

# Start the application
docker-compose up --build

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Local Setup

#### Backend Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Run the backend
python -m uvicorn backend.app.main:app --reload --port 8000
```

#### Frontend Setup

```bash
# In another terminal
cd frontend
npm install
npm run dev
```

---

## 🔐 Login Credentials

### Demo Accounts

| Role | Username | Password |
|------|----------|----------|
| 👨‍💼 Admin | `admin` | `admin123` |
| 👔 Supervisor | `supervisor` | `super123` |
| 👷 Operator | `operator` | `operator123` |
| 📋 Auditor | `auditor` | `auditor123` |

---

## 📊 Main Features

### Dashboard
- Real-time risk score monitoring
- Live alert tracking
- Worker density monitoring
- Environmental conditions display
- Zone-based risk heatmap

### Sensor Management
- Real-time data from 28 sensors
- Multi-zone monitoring (A, B, C, D)
- Sensor health tracking
- Historical data visualization

### Alerts & Incidents
- Priority-based alert system
- Incident tracking and management
- Risk score calculation
- Automated recommendations

### Work Permits
- Hot work permits
- Electrical permits
- Confined space permits
- Permit lifecycle management

### Analytics
- Risk trend analysis
- Incident statistics
- Compliance metrics
- Custom reports

### Compliance Assistant
- AI-powered Q&A system
- Safety regulation search
- Document management
- Real-time guidance

---

## 🤖 AI/ML Features

### Risk Engine
- Compound risk calculation
- Multi-factor analysis
- Real-time scoring
- Zone-based assessment

### Computer Vision
- PPE detection (helmet, vest)
- Worker monitoring
- Safety compliance tracking
- Unauthorized entry detection

### Predictive Analytics
- Risk prediction
- Anomaly detection
- Historical analysis
- ML-based recommendations

### RAG System
- Safety regulation queries
- Document-based Q&A
- Compliance guidance
- Knowledge base search

---

## 📡 API Documentation

After starting the backend, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Backend (change 8000 to another port)
python -m uvicorn backend.app.main:app --port 8001

# Frontend (change 5173 in vite.config.ts)
```

### Database Issues
```bash
# Reset database
rm data/industrial_safety.db

# Recreate tables (automatic on startup)
```

### Module Not Found
```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt
npm install
```

---

## 📁 Project Structure

```
industrial-safety-platform/
├── backend/          # FastAPI backend
├── frontend/         # React frontend
├── ai/              # AI/ML modules
├── docker/          # Docker files
├── docker-compose.yml
├── requirements.txt
├── package.json
└── README.md
```

---

## 🔗 API Examples

### Login
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### Get Dashboard Stats
```bash
curl -X GET "http://localhost:8000/api/dashboard/stats" \
  -H "Authorization: Bearer <token>"
```

### Get Alerts
```bash
curl -X GET "http://localhost:8000/api/alerts/?priority=critical" \
  -H "Authorization: Bearer <token>"
```

---

## 📞 Support

If you encounter issues:
1. Check the logs: `docker-compose logs`
2. Review the API documentation: http://localhost:8000/docs
3. Open an issue on GitHub

---

**Happy Monitoring! 🎯**
