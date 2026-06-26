import { useState, useEffect } from 'react'
import { sensorsAPI } from '../services/api'
import { BarChartComponent, LineChartComponent } from '../components/Charts'

const Sensors = () => {
  const [readings, setReadings] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSensorData()
    const interval = setInterval(loadSensorData, 3000)
    return () => clearInterval(interval)
  }, [])

  const loadSensorData = async () => {
    try {
      const [readingsRes, statsRes] = await Promise.all([
        sensorsAPI.getReadings(selectedZone || undefined),
        sensorsAPI.getStats(),
      ])
      setReadings(readingsRes.data)
      setStats(statsRes.data)
    } catch (error) {
      console.error('Error loading sensor data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading sensors...</div>

  const zones = ['A', 'B', 'C', 'D']
  const sensorTypes = [...new Set(readings.map((r) => r.sensor_type))]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Sensor Readings</h1>

      {/* Filters */}
      <div className="card-glass p-4 rounded-lg flex gap-4 flex-wrap">
        <button
          onClick={() => setSelectedZone(null)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedZone === null
              ? 'bg-industrial-blue text-white'
              : 'bg-dark-border hover:bg-dark-border/80'
          }`}
        >
          All Zones
        </button>
        {zones.map((zone) => (
          <button
            key={zone}
            onClick={() => setSelectedZone(zone)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedZone === zone
                ? 'bg-industrial-blue text-white'
                : 'bg-dark-border hover:bg-dark-border/80'
            }`}
          >
            Zone {zone}
          </button>
        ))}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card-glass p-6 rounded-lg text-center">
            <p className="text-gray-400">Total Sensors</p>
            <p className="text-2xl font-bold mt-2">{stats.total_sensors}</p>
          </div>
          <div className="card-glass p-6 rounded-lg text-center">
            <p className="text-gray-400">Active</p>
            <p className="text-2xl font-bold mt-2 text-industrial-green">{stats.active_sensors}</p>
          </div>
          <div className="card-glass p-6 rounded-lg text-center">
            <p className="text-gray-400">Offline</p>
            <p className="text-2xl font-bold mt-2 text-industrial-red">{stats.offline_sensors}</p>
          </div>
          <div className="card-glass p-6 rounded-lg text-center">
            <p className="text-gray-400">Avg Response</p>
            <p className="text-2xl font-bold mt-2">{stats.average_response_time}</p>
          </div>
        </div>
      )}

      {/* Sensor Data Table */}
      <div className="card-glass p-6 rounded-lg overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Real-Time Readings</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left p-2">Sensor ID</th>
              <th className="text-left p-2">Type</th>
              <th className="text-left p-2">Zone</th>
              <th className="text-left p-2">Value</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {readings.slice(0, 20).map((reading, idx) => (
              <tr key={idx} className="border-b border-dark-border hover:bg-dark-border/50">
                <td className="p-2">{reading.sensor_id}</td>
                <td className="p-2">{reading.sensor_type}</td>
                <td className="p-2">
                  <span className="px-2 py-1 bg-industrial-blue/20 rounded">{reading.zone}</span>
                </td>
                <td className="p-2 font-semibold">
                  {reading.value} {reading.unit}
                </td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      reading.status === 'normal'
                        ? 'bg-industrial-green/20 text-industrial-green'
                        : reading.status === 'warning'
                        ? 'bg-industrial-yellow/20 text-industrial-yellow'
                        : 'bg-industrial-red/20 text-industrial-red'
                    }`}
                  >
                    {reading.status}
                  </span>
                </td>
                <td className="p-2 text-gray-400 text-xs">
                  {new Date(reading.timestamp).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Sensors
