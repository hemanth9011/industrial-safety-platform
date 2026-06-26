import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle, Clock } from 'lucide-react'

const AlertsPanel = ({ alerts }: any) => {
  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      critical: 'bg-industrial-red/20 border-industrial-red text-industrial-red',
      warning: 'bg-industrial-orange/20 border-industrial-orange text-industrial-orange',
      info: 'bg-industrial-blue/20 border-industrial-blue text-industrial-blue',
    }
    return colors[priority] || colors.info
  }

  return (
    <div className="card-glass p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <AlertCircle className="mr-2" /> Active Alerts
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts && alerts.length > 0 ? (
          alerts.map((alert: any, idx: number) => (
            <div
              key={idx}
              className={`p-3 rounded border-l-4 ${getPriorityColor(alert.priority)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{alert.title}</p>
                  <p className="text-xs mt-1">{alert.description}</p>
                  <p className="text-xs mt-1 opacity-70">Zone: {alert.zone}</p>
                </div>
                <div className="ml-2 text-right">
                  <p className="text-lg font-bold">{alert.risk_score.toFixed(0)}</p>
                  <p className="text-xs">Risk Score</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-4">No active alerts</p>
        )}
      </div>
    </div>
  )
}

export default AlertsPanel
