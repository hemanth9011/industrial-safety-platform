import { AlertCircle, AlertTriangle, Info } from 'lucide-react'

interface AlertProps {
  type: 'info' | 'warning' | 'critical'
  title: string
  message: string
  onClose?: () => void
}

const AlertBanner = ({ type, title, message, onClose }: AlertProps) => {
  const bgColors = {
    info: 'bg-industrial-blue/10 border-industrial-blue',
    warning: 'bg-industrial-yellow/10 border-industrial-yellow',
    critical: 'bg-industrial-red/10 border-industrial-red',
  }

  const textColors = {
    info: 'text-industrial-blue',
    warning: 'text-industrial-yellow',
    critical: 'text-industrial-red',
  }

  const icons = {
    info: Info,
    warning: AlertTriangle,
    critical: AlertCircle,
  }

  const Icon = icons[type]

  return (
    <div className={`border-l-4 p-4 rounded mb-4 ${bgColors[type]} ${textColors[type]}`}>
      <div className="flex items-start">
        <Icon className="mr-3 mt-0.5" size={20} />
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm mt-1">{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-xl font-bold hover:opacity-70">
            ×
          </button>
        )}
      </div>
    </div>
  )
}

export default AlertBanner
