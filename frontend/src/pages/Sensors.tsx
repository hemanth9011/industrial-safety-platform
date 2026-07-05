import { useState, useEffect, useRef } from 'react'
import { sensorsAPI } from '../services/api'
import { sensorAlertSoundManager } from '../utils/soundManager'

const Sensors = () => {
  const [readings, setReadings] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true)
  const [sensorControls, setSensorControls] = useState<{ [key: string]: boolean }>({})
  const previousStatusRef = useRef<{ [key: string]: string }>({})

  useEffect(() => {
    loadSensorData()
    const interval = setInterval(loadSensorData, 3000)
    return () => clearInterval(interval)
  }, [selectedZone])

  const loadSensorData = async () => {
    try {
      const [readingsRes, statsRes] = await Promise.all([
        sensorsAPI.getReadings(selectedZone || undefined),
        sensorsAPI.getStats(),
      ])

      // Check for status changes and play sounds
      if (soundEnabled) {
        checkSensorStatusChanges(readingsRes.data)
      }

      setReadings(readingsRes.data)
      setStats(statsRes.data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading sensor data:', error)
      setLoading(false)
    }
  }

  const checkSensorStatusChanges = (newReadings: any[]) => {
    newReadings.forEach((reading) => {
      const sensorKey = reading.sensor_id
      const previousStatus = previousStatusRef.current[sensorKey]

      if (previousStatus !== reading.status) {
        if (reading.status === 'critical') {
          sensorAlertSoundManager.playCriticalSound(sensorKey)
        } else if (reading.status === 'warning') {
          sensorAlertSoundManager.playWarningSound(sensorKey)
        } else if (reading.status === 'offline') {
          sensorAlertSoundManager.playOfflineSound(sensorKey)
        }
      }

      previousStatusRef.current[sensorKey] = reading.status
    })
  }

  const handleSensorControl = async (sensorId: string, action: 'on' | 'off') => {
    try {
      await sensorsAPI.controlSensor(sensorId, action)
      setSensorControls((prev) => ({
        ...prev,
        [sensorId]: action === 'on',
      }))
      // Reload data immediately
      loadSensorData()
    } catch (error) {
      console.error(`Error turning sensor ${action}:`, error)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading sensors...</div>

  const normalSensors = readings.filter((r) => r.status === 'normal')
  const warningSensors = readings.filter((r) => r.status === 'warning')
  const criticalSensors = readings.filter((r) => r.status === 'critical')
  const offlineSensors = readings.filter((r) => r.status === 'offline')

  const SensorCard = ({ reading }: { reading: any }) => {
    const getStatusStyle = (status: string) => {
      switch (status) {
        case 'critical':
          return 'bg-industrial-red/10 border-2 border-industrial-red'
        case 'warning':
          return 'bg-industrial-yellow/10 border-2 border-industrial-yellow'
        case 'offline':
          return 'bg-gray-600/10 border-2 border-gray-600'
        default:
          return 'bg-industrial-green/10 border-2 border-industrial-green'
      }
    }

    const getStatusBadge = (status: string) => {
      const badges: { [key: string]: { icon: string; color: string } } = {
        normal: { icon: '✓', color: 'bg-industrial-green' },
        warning: { icon: '⚠', color: 'bg-industrial-yellow' },
        critical: { icon: '🚨', color: 'bg-industrial-red animate-pulse' },
        offline: { icon: '✕', color: 'bg-gray-600' },
      }
      const badge = badges[status] || badges.normal
      return badge
    }

    const badge = getStatusBadge(reading.status)
    const isOn = sensorControls[reading.sensor_id] !== false

    return (
      <div className={`card-glass p-4 rounded-lg ${getStatusStyle(reading.status)}`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-gray-400 mb-1">Sensor ID</p>
            <p className="text-sm font-bold font-mono">{reading.sensor_id}</p>
          </div>
          <span className={`${badge.color} text-white px-3 py-1 rounded-full text-lg font-bold`}>
            {badge.icon}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs text-gray-400">Type</p>
            <p className="text-sm font-semibold">{reading.sensor_type}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Zone</p>
            <p className="text-sm font-semibold bg-industrial-blue/20 px-2 py-1 rounded text-center">
              {reading.zone}
            </p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-dark-border mb-3">
          <p className="text-2xl font-bold">
            {reading.value} <span className="text-xs text-gray-400">{reading.unit}</span>
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleSensorControl(reading.sensor_id, 'on')}
            disabled={isOn}
            className={`flex-1 px-3 py-2 rounded font-semibold text-xs transition-all ${
              isOn
                ? 'bg-industrial-green text-white cursor-default'
                : 'bg-dark-border text-gray-400 hover:bg-industrial-green/20'
            }`}
            title="Turn sensor ON"
          >
            ⚡ ON
          </button>
          <button
            onClick={() => handleSensorControl(reading.sensor_id, 'off')}
            disabled={!isOn}
            className={`flex-1 px-3 py-2 rounded font-semibold text-xs transition-all ${
              !isOn
                ? 'bg-industrial-red text-white cursor-default'
                : 'bg-dark-border text-gray-400 hover:bg-industrial-red/20'
            }`}
            title="Turn sensor OFF"
          >
            🔌 OFF
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-3">{new Date(reading.timestamp).toLocaleTimeString()}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sensor Control & Monitoring</h1>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            soundEnabled
              ? 'bg-industrial-green text-white shadow-lg shadow-industrial-green/30'
              : 'bg-dark-border text-gray-400 opacity-60'
          }`}
          title={soundEnabled ? 'Sound: ON' : 'Sound: OFF'}
        >
          {soundEnabled ? '🔔' : '🔕'}
        </button>
      </div>

      {/* Zone Filter */}
      <div className="card-glass p-4 rounded-lg flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedZone(null)}
          className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
            selectedZone === null
              ? 'bg-industrial-blue text-white'
              : 'bg-dark-border hover:bg-dark-border/80'
          }`}
        >
          All Zones
        </button>
        {['A', 'B', 'C', 'D'].map((zone) => (
          <button
            key={zone}
            onClick={() => setSelectedZone(zone)}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-glass p-4 rounded-lg text-center">
            <p className="text-xs text-gray-400">Total</p>
            <p className="text-2xl font-bold mt-1">{stats.total_sensors}</p>
          </div>
          <div className="card-glass p-4 rounded-lg text-center">
            <p className="text-xs text-gray-400">Active</p>
            <p className="text-2xl font-bold mt-1 text-industrial-green">{stats.active_sensors}</p>
          </div>
          <div className="card-glass p-4 rounded-lg text-center">
            <p className="text-xs text-gray-400">Offline</p>
            <p className="text-2xl font-bold mt-1 text-industrial-red">{stats.offline_sensors}</p>
          </div>
          <div className="card-glass p-4 rounded-lg text-center">
            <p className="text-xs text-gray-400">Avg Response</p>
            <p className="text-2xl font-bold mt-1">{stats.average_response_time}ms</p>
          </div>
        </div>
      )}

      {/* Critical Sensors */}
      {criticalSensors.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-industrial-red mb-3 flex items-center gap-2">
            🚨 Critical Sensors ({criticalSensors.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {criticalSensors.map((reading, idx) => (
              <SensorCard key={idx} reading={reading} />
            ))}
          </div>
        </div>
      )}

      {/* Warning Sensors */}
      {warningSensors.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-industrial-yellow mb-3 flex items-center gap-2">
            ⚠ Warning Sensors ({warningSensors.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {warningSensors.map((reading, idx) => (
              <SensorCard key={idx} reading={reading} />
            ))}
          </div>
        </div>
      )}

      {/* Offline Sensors */}
      {offlineSensors.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-400 mb-3 flex items-center gap-2">
            ✕ Offline Sensors ({offlineSensors.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offlineSensors.map((reading, idx) => (
              <SensorCard key={idx} reading={reading} />
            ))}
          </div>
        </div>
      )}

      {/* Normal Sensors */}
      {normalSensors.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-industrial-green mb-3 flex items-center gap-2">
            ✓ Normal Sensors ({normalSensors.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {normalSensors.map((reading, idx) => (
              <SensorCard key={idx} reading={reading} />
            ))}
          </div>
        </div>
      )}

      {readings.length === 0 && (
        <div className="card-glass p-8 rounded-lg text-center text-gray-400">
          No sensor data available
        </div>
      )}
    </div>
  )
}

export default Sensors
