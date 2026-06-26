import { useState, useEffect } from 'react'
import { dashboardAPI, sensorsAPI, alertsAPI, incidentsAPI, permitsAPI, predictionsAPI } from '../services/api'
import { GaugeChart, AnimatedCard, LineChartComponent } from '../components/Charts'
import AlertsPanel from '../components/AlertsPanel'
import Heatmap from '../components/Heatmap'
import AlertBanner from '../components/AlertBanner'
import { AlertTriangle, Activity, Zap, Users, Thermometer, Wind } from 'lucide-react'

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null)
  const [alerts, setAlerts] = useState<any>([])
  const [riskMetrics, setRiskMetrics] = useState<any>(null)
  const [emergencyMode, setEmergencyMode] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
    const interval = setInterval(loadDashboardData, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      const [statsRes, alertsRes, riskRes] = await Promise.all([
        dashboardAPI.getStats(),
        alertsAPI.getAlerts(),
        dashboardAPI.getRiskMetrics(),
      ])
      setStats(statsRes.data)
      setAlerts(alertsRes.data.slice(0, 5))
      setRiskMetrics(riskRes.data)
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const triggerEmergency = () => {
    setEmergencyMode(true)
    setTimeout(() => setEmergencyMode(false), 5000)
  }

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>
  }

  return (
    <div className="space-y-6">
      {/* Emergency Banner */}
      {emergencyMode && (
        <AlertBanner
          type="critical"
          title="⚠️ EMERGENCY MODE ACTIVATED"
          message="Multiple critical alerts detected. Evacuation procedures may be required. Contact emergency services."
        />
      )}

      {/* Emergency Button */}
      <div className="flex gap-4">
        <button
          onClick={triggerEmergency}
          className="px-4 py-2 bg-industrial-red text-white rounded-lg hover:bg-industrial-red/80 font-semibold"
        >
          🚨 Trigger Emergency Mode
        </button>
        <button
          onClick={loadDashboardData}
          className="px-4 py-2 bg-industrial-blue text-white rounded-lg hover:bg-industrial-blue/80 font-semibold"
        >
          ↻ Refresh Data
        </button>
      </div>

      {/* Risk Score Section */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card-glass p-8 rounded-lg text-center">
            <GaugeChart
              value={stats.risk_score}
              max={100}
              label="Current Risk Score"
              color={stats.risk_score > 70 ? '#dc2626' : stats.risk_score > 40 ? '#ea580c' : '#22c55e'}
            />
          </div>

          <AnimatedCard
            title="Active Alerts"
            value={stats.active_alerts}
            icon="🔔"
            color="text-industrial-yellow"
          />
          <AnimatedCard
            title="Incidents Today"
            value={stats.incidents_today}
            icon="📋"
            color="text-industrial-red"
          />
          <AnimatedCard
            title="Active Permits"
            value={stats.active_permits}
            icon="✅"
            color="text-industrial-green"
          />
          <AnimatedCard
            title="Workers On Site"
            value={stats.workers_on_site}
            icon="👥"
            color="text-industrial-blue"
          />
          <AnimatedCard
            title="Machine Health"
            value={`${stats.machine_health.toFixed(0)}%`}
            icon="⚙️"
            color="text-industrial-green"
          />
        </div>
      )}

      {/* Environmental Conditions */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-glass p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Temperature</p>
                <p className="text-3xl font-bold mt-2">{stats.temperature}°C</p>
              </div>
              <Thermometer size={40} className="text-industrial-orange opacity-50" />
            </div>
          </div>
          <div className="card-glass p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Humidity</p>
                <p className="text-3xl font-bold mt-2">{stats.humidity}%</p>
              </div>
              <Wind size={40} className="text-industrial-blue opacity-50" />
            </div>
          </div>
          <div className="card-glass p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Last Update</p>
                <p className="text-sm font-semibold mt-2">{new Date(stats.last_update).toLocaleTimeString()}</p>
              </div>
              <Activity size={40} className="text-industrial-green opacity-50" />
            </div>
          </div>
        </div>
      )}

      {/* Heatmap and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {riskMetrics && <Heatmap zones={riskMetrics.zones} />}
        <AlertsPanel alerts={alerts} />
      </div>
    </div>
  )
}

export default Dashboard
