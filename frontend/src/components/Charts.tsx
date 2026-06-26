import { useEffect, useState } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const GaugeChart = ({ value, max = 100, label, color }: any) => {
  const percentage = (value / max) * 100
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
          />
          <text x="50" y="50" textAnchor="middle" dy="0.3em" className="text-2xl font-bold fill-white">
            {value.toFixed(0)}
          </text>
          <text x="50" y="65" textAnchor="middle" dy="0.3em" className="text-xs fill-gray-400">
            {label}
          </text>
        </svg>
      </div>
    </div>
  )
}

const AnimatedCard = ({ title, value, icon, color }: any) => {
  return (
    <div className="card-glass p-6 rounded-lg transform hover:scale-105 transition-transform duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-2">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`text-4xl ${color}`}>{icon}</div>
      </div>
    </div>
  )
}

const LineChartComponent = ({ data, title }: any) => {
  return (
    <div className="card-glass p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis stroke="rgba(255,255,255,0.5)" />
          <YAxis stroke="rgba(255,255,255,0.5)" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#0284c7" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

const BarChartComponent = ({ data, title }: any) => {
  return (
    <div className="card-glass p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis stroke="rgba(255,255,255,0.5)" />
          <YAxis stroke="rgba(255,255,255,0.5)" />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#0284c7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export { GaugeChart, AnimatedCard, LineChartComponent, BarChartComponent }
