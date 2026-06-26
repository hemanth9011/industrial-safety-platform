import { useState, useEffect } from 'react'
import { BarChartComponent, LineChartComponent } from '../components/Charts'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d')

  const riskData = [
    { date: 'Mon', risk: 45 },
    { date: 'Tue', risk: 52 },
    { date: 'Wed', risk: 48 },
    { date: 'Thu', risk: 61 },
    { date: 'Fri', risk: 55 },
    { date: 'Sat', risk: 40 },
    { date: 'Sun', risk: 38 },
  ]

  const incidentData = [
    { date: 'Mon', incidents: 2 },
    { date: 'Tue', incidents: 1 },
    { date: 'Wed', incidents: 3 },
    { date: 'Thu', incidents: 2 },
    { date: 'Fri', incidents: 4 },
    { date: 'Sat', incidents: 0 },
    { date: 'Sun', incidents: 1 },
  ]

  const violationData = [
    { name: 'No Helmet', value: 35 },
    { name: 'No Vest', value: 20 },
    { name: 'Unauthorized Entry', value: 15 },
    { name: 'Other', value: 30 },
  ]

  const COLORS = ['#dc2626', '#ea580c', '#eab308', '#0284c7']

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* Risk Trend */}
      <div className="card-glass p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Risk Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={riskData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="risk" stroke="#dc2626" name="Risk Score" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Incident Trend */}
      <div className="card-glass p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Incident Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={incidentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip />
            <Legend />
            <Bar dataKey="incidents" fill="#ea580c" name="Incidents" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Violations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Daily Violations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={violationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {violationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="space-y-4">
          <div className="card-glass p-6 rounded-lg">
            <p className="text-gray-400 mb-2">Avg Risk Score</p>
            <p className="text-4xl font-bold">48.7</p>
          </div>
          <div className="card-glass p-6 rounded-lg">
            <p className="text-gray-400 mb-2">Total Incidents</p>
            <p className="text-4xl font-bold">13</p>
          </div>
          <div className="card-glass p-6 rounded-lg">
            <p className="text-gray-400 mb-2">Total Violations</p>
            <p className="text-4xl font-bold">100</p>
          </div>
          <div className="card-glass p-6 rounded-lg">
            <p className="text-gray-400 mb-2">Incident Resolution Rate</p>
            <p className="text-4xl font-bold text-industrial-green">92%</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
