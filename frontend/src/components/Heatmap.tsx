import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const Heatmap = ({ zones }: any) => {
  const getColor = (riskLevel: string) => {
    const colors: { [key: string]: string } = {
      green: '#22c55e',
      yellow: '#eab308',
      orange: '#ea580c',
      red: '#dc2626',
    }
    return colors[riskLevel] || '#22c55e'
  }

  return (
    <div className="card-glass p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Risk Heatmap</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {zones.map((zone: any) => (
          <div
            key={zone.name}
            className="p-4 rounded-lg text-center"
            style={{
              backgroundColor: `${getColor(zone.risk_level)}20`,
              borderLeft: `4px solid ${getColor(zone.risk_level)}`,
            }}
          >
            <p className="font-bold text-lg">{zone.name}</p>
            <p className="text-2xl font-bold" style={{ color: getColor(zone.risk_level) }}>
              {zone.score.toFixed(0)}
            </p>
            <p className="text-xs text-gray-400 mt-2">Risk Score</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Heatmap
