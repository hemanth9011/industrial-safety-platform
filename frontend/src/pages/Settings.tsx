import { useState } from 'react'
import { Settings } from 'lucide-react'

const Settings = () => {
  const [settings, setSettings] = useState({
    temperatureThreshold: 35,
    gasThreshold: 100,
    alertThreshold: 70,
    darkMode: true,
    autoRefresh: true,
    refreshInterval: 5000,
  })

  const handleChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value })
  }

  const handleSave = () => {
    localStorage.setItem('settings', JSON.stringify(settings))
    alert('Settings saved successfully')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Settings /> Settings
      </h1>

      {/* Sensor Thresholds */}
      <div className="card-glass p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Sensor Thresholds</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Temperature Threshold (°C)</label>
            <input
              type="number"
              value={settings.temperatureThreshold}
              onChange={(e) => handleChange('temperatureThreshold', e.target.value)}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-industrial-blue"
            />
            <p className="text-xs text-gray-400 mt-1">Alert when temperature exceeds this value</p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Gas Concentration Threshold (ppm)</label>
            <input
              type="number"
              value={settings.gasThreshold}
              onChange={(e) => handleChange('gasThreshold', e.target.value)}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-industrial-blue"
            />
            <p className="text-xs text-gray-400 mt-1">Alert when gas concentration exceeds this value</p>
          </div>
        </div>
      </div>

      {/* Alert Settings */}
      <div className="card-glass p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Alert Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Risk Score Alert Threshold</label>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.alertThreshold}
              onChange={(e) => handleChange('alertThreshold', e.target.value)}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-industrial-blue"
            />
            <p className="text-xs text-gray-400 mt-1">Trigger critical alert when risk score exceeds this value</p>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="card-glass p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Display Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold">Dark Mode</label>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => handleChange('darkMode', e.target.checked)}
              className="w-5 h-5"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold">Auto Refresh</label>
            <input
              type="checkbox"
              checked={settings.autoRefresh}
              onChange={(e) => handleChange('autoRefresh', e.target.checked)}
              className="w-5 h-5"
            />
          </div>
          {settings.autoRefresh && (
            <div>
              <label className="block text-sm font-semibold mb-2">Refresh Interval (ms)</label>
              <input
                type="number"
                value={settings.refreshInterval}
                onChange={(e) => handleChange('refreshInterval', e.target.value)}
                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-industrial-blue"
              />
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full px-6 py-3 bg-industrial-green hover:bg-industrial-green/80 text-white font-semibold rounded-lg transition-colors"
      >
        Save Settings
      </button>
    </div>
  )
}

export default Settings
