import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth APIs
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/api/auth/login', { username, password }),
  register: (username: string, password: string) =>
    api.post('/api/auth/register', { username, password }),
  getCurrentUser: () => api.get('/api/auth/me'),
}

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => api.get('/api/dashboard/stats'),
  getRiskMetrics: () => api.get('/api/dashboard/risk-metrics'),
}

// Sensor APIs
export const sensorsAPI = {
  getReadings: (zone?: string, type?: string) =>
    api.get('/api/sensors/readings', { params: { zone, sensor_type: type } }),
  getStats: () => api.get('/api/sensors/stats'),
  createReading: (data: any) => api.post('/api/sensors/reading', data),
}

// Alert APIs
export const alertsAPI = {
  getAlerts: (priority?: string, status?: string) =>
    api.get('/api/alerts/', { params: { priority, status } }),
  getAlert: (id: string) => api.get(`/api/alerts/${id}`),
  acknowledge: (id: string) => api.post(`/api/alerts/acknowledge/${id}`),
  resolve: (id: string) => api.post(`/api/alerts/resolve/${id}`),
}

// Incident APIs
export const incidentsAPI = {
  getIncidents: (severity?: string, status?: string) =>
    api.get('/api/incidents/', { params: { severity, status } }),
  getIncident: (id: string) => api.get(`/api/incidents/${id}`),
  createIncident: (data: any) => api.post('/api/incidents/', data),
  updateIncident: (id: string, data: any) =>
    api.put(`/api/incidents/${id}`, data),
  resolveIncident: (id: string, data: any) =>
    api.post(`/api/incidents/${id}/resolve`, data),
}

// Permit APIs
export const permitsAPI = {
  getPermits: (type?: string, status?: string) =>
    api.get('/api/permits/', { params: { permit_type: type, status } }),
  getPermit: (id: string) => api.get(`/api/permits/${id}`),
  createPermit: (data: any) => api.post('/api/permits/', data),
  updatePermit: (id: string, data: any) =>
    api.put(`/api/permits/${id}`, data),
  revokePermit: (id: string) => api.post(`/api/permits/${id}/revoke`),
}

// Prediction APIs
export const predictionsAPI = {
  predict: () => api.get('/api/predictions/predict'),
  getHistory: () => api.get('/api/predictions/history'),
}

// Compliance APIs
export const complianceAPI = {
  uploadDocument: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/api/compliance/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getDocuments: () => api.get('/api/compliance/documents'),
  query: (question: string) =>
    api.post('/api/compliance/query', { question }),
  search: (query: string) =>
    api.get('/api/compliance/search', { params: { query } }),
}

export default api
