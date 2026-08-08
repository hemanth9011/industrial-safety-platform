import React, { useState, useEffect } from 'react'
import { MessageCircle, AlertCircle, ChevronDown, Send } from 'lucide-react'

interface RobotMessage {
  id: string
  text: string
  timestamp: string
  type: 'analysis' | 'alert' | 'info'
}

export default function FloatingRobotAgent() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<RobotMessage[]>([
    {
      id: '1',
      text: '🤖 Hello! I\'m your AI Safety Supervisor. I\'m monitoring all sensors and will alert you to any issues.',
      timestamp: new Date().toISOString(),
      type: 'info'
    }
  ])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [stats, setStats] = useState({
    sensorsMonitored: 5,
    alertsSent: 0,
    criticalEvents: 0,
    supervisorPhone: '+91 8639270561'
  })

  useEffect(() => {
    // Simulate monitoring
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
        text: '🔴 Now actively monitoring all sensors and systems. Alerts will be sent to supervisor via WhatsApp.',
        timestamp: new Date().toISOString(),
        type: 'alert'
      }
      setMessages([...messages, newMessage])
      setStats(prev => ({ ...prev, alertsSent: prev.alertsSent + 1 }))
    }
  }

  const handleTestAlert = async () => {
    const testMessage = `🚨 TEST ALERT 🚨\n\nAI Robot Test\nTimestamp: ${new Date().toLocaleString()}\n\nThis is a test alert from your AI Safety Supervisor.`
    
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

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Robot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-blue-600 scale-110' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        <span className="text-2xl">🤖</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 bg-white rounded-lg shadow-2xl flex flex-col max-h-96 border border-blue-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                <div>
                  <h3 className="font-bold">AI Safety Supervisor</h3>
                  <p className="text-xs text-blue-100">
                    {isMonitoring ? '🟢 Monitoring Active' : '⚪ Standby Mode'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-blue-500 p-1 rounded"
              >
                <ChevronDown size={20} />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-blue-50 border-b border-blue-100 p-3 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2 rounded">
              <p className="text-gray-600">Sensors</p>
              <p className="font-bold text-lg">{stats.sensorsMonitored}</p>
            </div>
            <div className="bg-white p-2 rounded">
              <p className="text-gray-600">Alerts</p>
              <p className="font-bold text-lg text-orange-600">{stats.alertsSent}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-blue-50 to-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg text-sm ${
                  msg.type === 'alert'
                    ? 'bg-red-100 text-red-800 border-l-4 border-red-600'
                    : msg.type === 'analysis'
                    ? 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-600'
                    : 'bg-blue-100 text-blue-800 border-l-4 border-blue-600'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Supervisor Info */}
          <div className="bg-gray-50 border-t border-gray-200 p-3 text-xs text-gray-600">
            <p className="flex items-center gap-2">
              <AlertCircle size={14} />
              Alerts sent to: <strong>{stats.supervisorPhone}</strong>
            </p>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 p-3 space-y-2">
            <button
              onClick={handleMonitor}
              className={`w-full py-2 px-3 rounded font-semibold text-white text-sm transition ${
                isMonitoring
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isMonitoring ? '🛑 Stop Monitoring' : '▶️ Start Monitoring'}
            </button>
            <button
              onClick={handleTestAlert}
              className="w-full py-2 px-3 rounded font-semibold text-white bg-orange-600 hover:bg-orange-700 text-sm transition"
            >
              📱 Send Test Alert
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
