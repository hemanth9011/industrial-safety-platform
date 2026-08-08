import React, { useState, useEffect } from 'react'
import { ChevronDown, AlertCircle } from 'lucide-react'
import WorkerAvatar from './WorkerAvatar'

interface RobotMessage {
  id: string
  text: string
  timestamp: string
  type: 'analysis' | 'alert' | 'info'
}

export default function FloatingWorkerAgent() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<RobotMessage[]>([
    {
      id: '1',
      text: '👷 Hello! I\'m your AI Safety Worker. I\'m monitoring all sensors and systems for you.',
      timestamp: new Date().toISOString(),
      type: 'info'
    }
  ])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [alertLevel, setAlertLevel] = useState<'normal' | 'warning' | 'critical'>('normal')
  const [stats, setStats] = useState({
    sensorsMonitored: 5,
    alertsSent: 0,
    criticalEvents: 0,
    supervisorPhone: '+91 8639270561'
  })

  useEffect(() => {
    const monitoringTimer = setInterval(async () => {
      try {
        const response = await fetch('/api/robot/robot-status')
        const data = await response.json()
        setIsMonitoring(data.monitoring)
      } catch (error) {
        console.error('Failed to fetch robot status:', error)
      }
    }, 5000)

    return () => clearInterval(monitoringTimer)
  }, [])

  const handleMonitor = async () => {
    setIsMonitoring(!isMonitoring)
    
    if (!isMonitoring) {
      const newMessage: RobotMessage = {
        id: Date.now().toString(),
        text: '🟢 Now actively monitoring all sensors and systems. Alerts will be sent to supervisor via WhatsApp.',
        timestamp: new Date().toISOString(),
        type: 'alert'
      }
      setMessages([...messages, newMessage])
      setStats(prev => ({ ...prev, alertsSent: prev.alertsSent + 1 }))
      setAlertLevel('normal')
    } else {
      setAlertLevel('normal')
    }
  }

  const handleTestAlert = async () => {
    const testMessage = `🚨 TEST ALERT 🚨\n\nAI Safety Worker Test\nTimestamp: ${new Date().toLocaleString()}\n\nThis is a test alert from your AI Safety Supervisor.`
    
    try {
      await fetch('/api/robot/send-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: testMessage })
      })

      const newMsg: RobotMessage = {
        id: Date.now().toString(),
        text: '✅ Test alert sent to supervisor WhatsApp!',
        timestamp: new Date().toISOString(),
        type: 'info'
      }
      setMessages([...messages, newMsg])
    } catch (error) {
      console.error('Failed to send alert:', error)
    }
  }

  const handleTestCritical = async () => {
    setAlertLevel('critical')
    const newMsg: RobotMessage = {
      id: Date.now().toString(),
      text: '🚨 CRITICAL CONDITION DETECTED! Sending immediate alert to supervisor.',
      timestamp: new Date().toISOString(),
      type: 'alert'
    }
    setMessages([...messages, newMsg])
    setStats(prev => ({ ...prev, criticalEvents: prev.criticalEvents + 1 }))
    
    setTimeout(() => setAlertLevel('normal'), 3000)
  }

  const handleTestWarning = async () => {
    setAlertLevel('warning')
    const newMsg: RobotMessage = {
      id: Date.now().toString(),
      text: '⚠️ WARNING: Sensor levels entering danger zone. Monitoring closely.',
      timestamp: new Date().toISOString(),
      type: 'alert'
    }
    setMessages([...messages, newMsg])
    
    setTimeout(() => setAlertLevel('normal'), 3000)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Worker Button with Avatar */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          setIsMinimized(false)
        }}
        className={`relative w-24 h-28 rounded-full shadow-2xl transition-all duration-300 overflow-hidden border-4 flex items-center justify-center ${
          isOpen ? 'scale-110 border-blue-400' : 'border-blue-300 hover:scale-105'
        } ${
          alertLevel === 'critical'
            ? 'bg-red-500 animate-pulse'
            : alertLevel === 'warning'
            ? 'bg-orange-500 animate-bounce'
            : 'bg-gradient-to-br from-blue-500 to-blue-600'
        }`}
      >
        <WorkerAvatar isMonitoring={isMonitoring} alertLevel={alertLevel} />
      </button>

      {/* Status Indicator Badge */}
      <div
        className={`absolute top-0 right-0 w-5 h-5 rounded-full border-2 border-white ${
          isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
        }`}
      />

      {/* Chat Window */}
      {isOpen && !isMinimized && (
        <div className="absolute bottom-28 right-0 w-96 bg-white rounded-2xl shadow-2xl flex flex-col max-h-96 border-2 border-blue-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">👷</div>
                <div>
                  <h3 className="font-bold text-lg">AI Safety Worker</h3>
                  <p className="text-xs text-blue-100">
                    {isMonitoring ? '🟢 Actively Monitoring' : '⚪ Standby Mode'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="hover:bg-blue-500 p-1 rounded transition"
              >
                <ChevronDown size={20} />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-blue-50 border-b border-blue-100 p-3 grid grid-cols-3 gap-2 text-xs">
            <div className="bg-white p-2 rounded text-center">
              <p className="text-gray-600 font-semibold">Sensors</p>
              <p className="font-bold text-lg text-blue-600">{stats.sensorsMonitored}</p>
            </div>
            <div className="bg-white p-2 rounded text-center">
              <p className="text-gray-600 font-semibold">Alerts</p>
              <p className="font-bold text-lg text-orange-600">{stats.alertsSent}</p>
            </div>
            <div className="bg-white p-2 rounded text-center">
              <p className="text-gray-600 font-semibold">Critical</p>
              <p className="font-bold text-lg text-red-600">{stats.criticalEvents}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gradient-to-b from-blue-50 to-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded-lg text-sm max-w-[85%] ${
                  msg.type === 'alert'
                    ? 'bg-red-100 text-red-800 border-l-4 border-red-600 ml-auto'
                    : msg.type === 'analysis'
                    ? 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-600'
                    : 'bg-blue-100 text-blue-800 border-l-4 border-blue-600'
                }`}
              >
                {msg.text}
                <p className="text-xs opacity-70 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
              </div>
            ))}
          </div>

          {/* Supervisor Info */}
          <div className="bg-gray-50 border-t border-gray-200 p-2 text-xs text-gray-600">
            <p className="flex items-center gap-2">
              <AlertCircle size={14} />
              WhatsApp: <strong>{stats.supervisorPhone}</strong>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 p-3 space-y-2 bg-white rounded-b-2xl">
            <button
              onClick={handleMonitor}
              className={`w-full py-2 px-3 rounded-lg font-semibold text-white text-sm transition transform hover:scale-105 ${
                isMonitoring
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isMonitoring ? '🛑 Stop Monitoring' : '▶️ Start Monitoring'}
            </button>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleTestAlert}
                className="py-2 px-2 rounded-lg font-semibold text-white bg-orange-600 hover:bg-orange-700 text-xs transition transform hover:scale-105"
              >
                📱 Test Alert
              </button>
              <button
                onClick={handleTestWarning}
                className="py-2 px-2 rounded-lg font-semibold text-white bg-yellow-600 hover:bg-yellow-700 text-xs transition transform hover:scale-105"
              >
                ⚠️ Warning
              </button>
            </div>

            <button
              onClick={handleTestCritical}
              className="w-full py-2 px-3 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 text-sm transition transform hover:scale-105"
            >
              🚨 Critical Test
            </button>
          </div>
        </div>
      )}

      {/* Minimized View */}
      {isOpen && isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className="absolute bottom-28 right-0 bg-white rounded-lg shadow-lg p-3 border-2 border-blue-200 hover:border-blue-400 transition"
        >
          <p className="text-xs font-semibold text-blue-600">Click to expand</p>
        </button>
      )}
    </div>
  )
}
