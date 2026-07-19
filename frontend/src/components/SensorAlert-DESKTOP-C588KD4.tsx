import { useState, useEffect, useRef } from 'react'

interface SensorAlertProps {
  sensorId: string
  sensorType: string
  zone: string
  value: number
  unit: string
  status: 'normal' | 'warning' | 'critical' | 'offline'
  timestamp: string
  soundEnabled: boolean
  onStatusChange?: (sensorId: string, newStatus: string) => void
}

export const SensorAlert = ({
  sensorId,
  sensorType,
  zone,
  value,
  unit,
  status,
  timestamp,
  soundEnabled,
  onStatusChange,
}: SensorAlertProps) => {
  const previousStatusRef = useRef<string>(status)
  const [isAlertActive, setIsAlertActive] = useState(false)

  useEffect(() => {
    // Only trigger alert on status change and if it's warning/critical/offline
    if (previousStatusRef.current !== status && soundEnabled && status !== 'normal') {
      // Import dynamically to avoid circular dependencies
      import('../utils/soundManager').then(({ sensorAlertSoundManager }) => {
        if (status === 'warning') {
          sensorAlertSoundManager.playWarningSound()
        } else if (status === 'critical') {
          sensorAlertSoundManager.playCriticalSound()
        } else if (status === 'offline') {
          sensorAlertSoundManager.playOfflineSound()
        }
      })

      setIsAlertActive(true)
      setTimeout(() => setIsAlertActive(false), 2000)

      if (onStatusChange) {
        onStatusChange(sensorId, status)
      }
    }

    previousStatusRef.current = status
  }, [status, soundEnabled, sensorId, onStatusChange])

  const getStatusColor = () => {
    switch (status) {
      case 'normal':
        return 'bg-industrial-green/20 text-industrial-green border border-industrial-green/50'
      case 'warning':
        return 'bg-industrial-yellow/20 text-industrial-yellow border border-industrial-yellow/50'
      case 'critical':
        return 'bg-industrial-red/20 text-industrial-red border border-industrial-red/50 animate-pulse'
      case 'offline':
        return 'bg-gray-600/20 text-gray-400 border border-gray-600/50'
      default:
        return 'bg-dark-border text-gray-400'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'normal':
        return '✓'
      case 'warning':
        return '⚠'
      case 'critical':
        return '🚨'
      case 'offline':
        return '✕'
      default:
        return '?'
    }
  }

  return (
    <tr className={`border-b border-dark-border hover:bg-dark-border/50 transition-all ${isAlertActive ? 'bg-dark-border/80' : ''}`}>
      <td className="p-2 font-mono text-sm">{sensorId}</td>
      <td className="p-2">{sensorType}</td>
      <td className="p-2">
        <span className="px-2 py-1 bg-industrial-blue/20 rounded text-xs">{zone}</span>
      </td>
      <td className="p-2 font-semibold">
        {value} <span className="text-gray-400 text-xs">{unit}</span>
      </td>
      <td className="p-2">
        <span className={`px-3 py-1 rounded text-xs font-bold inline-flex items-center gap-1 ${getStatusColor()}`}>
          <span>{getStatusIcon()}</span>
          {status.toUpperCase()}
        </span>
      </td>
      <td className="p-2 text-gray-400 text-xs">{new Date(timestamp).toLocaleTimeString()}</td>
    </tr>
  )
}
