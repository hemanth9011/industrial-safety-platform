import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Sensors from './pages/Sensors'
import Alerts from './pages/Alerts'
import Incidents from './pages/Incidents'
import Permits from './pages/Permits'
import Analytics from './pages/Analytics'
import Compliance from './pages/Compliance'
import Settings from './pages/Settings'

interface AuthState {
  isAuthenticated: boolean
  user: any
  token: string | null
}

function App() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  })

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setAuth({
        isAuthenticated: true,
        user: JSON.parse(storedUser),
        token: storedToken,
      })
    }
  }, [])

  const handleLogin = (token: string, user: any) => {
    setAuth({
      isAuthenticated: true,
      user,
      token,
    })
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  const handleLogout = () => {
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null,
    })
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  if (!auth.isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <Router>
      <Layout user={auth.user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sensors" element={<Sensors />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/permits" element={<Permits />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
