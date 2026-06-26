import { useState, useEffect } from 'react'
import { alertsAPI } from '../services/api'
import { CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react'

const Alerts = () => {
  const [alerts, setAlerts] = useState<any[]>([])
  const [filter, setFilter] = useState<{ priority?: string; status?: string }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAlerts()
    const interval = setInterval(loadAlerts, 5000)
    return () => clearInterval(interval)
  }, [filter])

  const loadAlerts = async () => {
    try {
      const res = await alertsAPI.getAlerts(filter.priority, filter.status)
      setAlerts(res.data)
    } catch (error) {
      console.error('Error loading alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcknowledge = async (id: string) => {
    try {
      await alertsAPI.acknowledge(id)
      loadAlerts()
    } catch (error) {
      console.error('Error acknowledging alert:', error)
    }
  }

  const handleResolve = async (id: string) => {
    try {
      await alertsAPI.resolve(id)
      loadAlerts()
    } catch (error) {
      console.error('Error resolving alert:', error)
    }
  }

  if (loading) return <div>Loading alerts...</div>

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertCircle size={20} className="text-industrial-red" />
      case 'warning':
        return <AlertTriangle size={20} className="text-industrial-orange" />
      default:
        return <AlertCircle size={20} className="text-industrial-blue" />
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Alerts Management</h1>

      {/* Filters */}
      <div className="card-glass p-4 rounded-lg flex gap-4 flex-wrap">
        <div>
          <label className="text-sm text-gray-400">Priority</label>
          <select
            value={filter.priority || ''}
            onChange={(e) => setFilter({ ...filter, priority: e.target.value || undefined })}
            className="ml-2 px-3 py-2 bg-dark-bg border border-dark-border rounded-lg"
          >
            <option value="">All</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-400">Status</label>
          <select
            value={filter.status || ''}
            onChange={(e) => setFilter({ ...filter, status: e.target.value || undefined })}
            className="ml-2 px-3 py-2 bg-dark-bg border border-dark-border rounded-lg"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div key={alert.id} className="card-glass p-6 rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  {getPriorityIcon(alert.priority)}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{alert.title}</h3>
                    <p className="text-gray-400 mt-1">{alert.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{alert.risk_score.toFixed(0)}</p>
                  <p className="text-xs text-gray-400">Risk Score</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-400">Zone</p>
                  <p className="font-semibold">{alert.zone}</p>
                </div>
                <div>
                  <p className="text-gray-400">Priority</p>
                  <p className="font-semibold capitalize">{alert.priority}</p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <p className="font-semibold capitalize">{alert.status}</p>
                </div>
                <div>
                  <p className="text-gray-400">Created</p>
                  <p className="font-semibold text-xs">{new Date(alert.created_at).toLocaleTimeString()}</p>
                </div>
              </div>

              <div className="bg-dark-bg/50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-400 mb-2">Reason:</p>
                <p className="text-sm">{alert.reason}</p>
              </div>

              <div className="bg-dark-bg/50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-400 mb-2">Recommended Action:</p>
                <p className="text-sm text-industrial-yellow">{alert.recommendation}</p>
              </div>

              <div className="flex gap-2">
                {alert.status === 'active' && (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="px-4 py-2 bg-industrial-yellow/20 text-industrial-yellow rounded-lg hover:bg-industrial-yellow/30 transition-colors"
                  >
                    Acknowledge
                  </button>
                )}
                {alert.status !== 'resolved' && (
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="px-4 py-2 bg-industrial-green/20 text-industrial-green rounded-lg hover:bg-industrial-green/30 transition-colors"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="card-glass p-8 rounded-lg text-center">
            <CheckCircle className="mx-auto mb-4 text-industrial-green" size={48} />
            <p className="text-gray-400">No alerts at this time</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Alerts
