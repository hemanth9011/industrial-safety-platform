import { useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import { AlertCircle } from 'lucide-react'

const Login = ({ onLogin }: any) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const demoCredentials = [
    { username: 'admin', password: 'admin123', role: 'Admin' },
    { username: 'supervisor', password: 'super123', role: 'Supervisor' },
    { username: 'operator', password: 'operator123', role: 'Operator' },
    { username: 'auditor', password: 'auditor123', role: 'Auditor' },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authAPI.login(username, password)
      onLogin(response.data.access_token, response.data.user)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (cred: any) => {
    setUsername(cred.username)
    setPassword(cred.password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">ISIP</h1>
          <p className="text-gray-400">Industrial Safety Intelligence Platform</p>
          <p className="text-sm text-gray-500 mt-2">AI-Powered Industrial Safety Monitoring</p>
        </div>

        {/* Login Form */}
        <div className="card-glass p-8 rounded-lg mb-6">
          {error && (
            <div className="mb-4 p-4 bg-industrial-red/10 border border-industrial-red rounded-lg flex items-start">
              <AlertCircle className="mr-3 mt-0.5 text-industrial-red" size={20} />
              <p className="text-sm text-industrial-red">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-industrial-blue transition-colors"
                placeholder="Enter username"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-industrial-blue transition-colors"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-industrial-blue hover:bg-industrial-blue/80 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div>
          <p className="text-center text-sm text-gray-400 mb-4">Demo Credentials</p>
          <div className="grid grid-cols-2 gap-2">
            {demoCredentials.map((cred) => (
              <button
                key={cred.username}
                onClick={() => handleDemoLogin(cred)}
                className="p-3 bg-dark-card hover:bg-dark-border border border-dark-border rounded-lg text-xs font-semibold transition-colors"
              >
                <p className="font-bold">{cred.role}</p>
                <p className="text-gray-400 text-xs mt-1">{cred.username}</p>
                <p className="text-gray-500 text-xs">Pass: {cred.password}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-8">
          <p>ET AI Hackathon 2.0 Submission</p>
          <p className="mt-1">© 2024 Industrial Safety Intelligence</p>
        </div>
      </div>
    </div>
  )
}

export default Login
