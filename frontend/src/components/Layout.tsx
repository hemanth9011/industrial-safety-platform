import { useState } from 'react'
import { Menu, X, LogOut, Settings, Home, Activity, AlertCircle, FileText, CheckSquare, BarChart3, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Layout = ({ children, user, onLogout }: any) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()

  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Sensors', icon: Activity, path: '/sensors' },
    { name: 'Alerts', icon: AlertCircle, path: '/alerts' },
    { name: 'Incidents', icon: FileText, path: '/incidents' },
    { name: 'Permits', icon: CheckSquare, path: '/permits' },
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { name: 'Compliance', icon: BookOpen, path: '/compliance' },
  ]

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-dark-bg">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-dark-card border-r border-dark-border transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-dark-border flex items-center justify-between">
          {sidebarOpen && <h1 className="font-bold text-lg">ISIP</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-dark-border rounded-lg"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-border transition-colors"
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.name}</span>}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-dark-border space-y-2">
          {sidebarOpen && (
            <div className="text-sm">
              <p className="text-gray-400">User</p>
              <p className="font-semibold capitalize">{user?.username || 'Guest'}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || 'User'}</p>
            </div>
          )}
          <div className="flex space-x-2">
            <button
              onClick={() => navigate('/settings')}
              className="flex-1 p-2 hover:bg-dark-border rounded-lg"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 p-2 hover:bg-red-900/20 text-industrial-red rounded-lg"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-dark-card border-b border-dark-border flex items-center px-6">
          <h2 className="text-xl font-semibold">Industrial Safety Intelligence Platform</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
