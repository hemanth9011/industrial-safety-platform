import { useState, useEffect } from 'react'
import { incidentsAPI } from '../services/api'

const Incidents = () => {
  const [incidents, setIncidents] = useState<any[]>([])
  const [filter, setFilter] = useState<{ severity?: string; status?: string }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadIncidents()
  }, [filter])

  const loadIncidents = async () => {
    try {
      const res = await incidentsAPI.getIncidents(filter.severity, filter.status)
      setIncidents(res.data)
    } catch (error) {
      console.error('Error loading incidents:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading incidents...</div>

  const getSeverityColor = (severity: string) => {
    const colors: { [key: string]: string } = {
      low: 'bg-industrial-green/20 text-industrial-green',
      medium: 'bg-industrial-yellow/20 text-industrial-yellow',
      high: 'bg-industrial-orange/20 text-industrial-orange',
      critical: 'bg-industrial-red/20 text-industrial-red',
    }
    return colors[severity] || colors.low
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Incident Management</h1>

      {/* Filters */}
      <div className="card-glass p-4 rounded-lg flex gap-4 flex-wrap">
        <div>
          <label className="text-sm text-gray-400">Severity</label>
          <select
            value={filter.severity || ''}
            onChange={(e) => setFilter({ ...filter, severity: e.target.value || undefined })}
            className="ml-2 px-3 py-2 bg-dark-bg border border-dark-border rounded-lg"
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
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
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="card-glass p-6 rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Zone</th>
              <th className="text-left p-3">Severity</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Reported By</th>
              <th className="text-left p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident) => (
              <tr key={incident.id} className="border-b border-dark-border hover:bg-dark-border/50">
                <td className="p-3 font-semibold">{incident.title}</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-industrial-blue/20 rounded text-sm">{incident.zone}</span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm font-semibold ${getSeverityColor(incident.severity)}`}>
                    {incident.severity}
                  </span>
                </td>
                <td className="p-3 capitalize">{incident.status}</td>
                <td className="p-3">{incident.reported_by}</td>
                <td className="p-3 text-sm text-gray-400">
                  {new Date(incident.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Incidents
