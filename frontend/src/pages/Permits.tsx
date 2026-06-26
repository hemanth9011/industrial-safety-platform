import { useState, useEffect } from 'react'
import { permitsAPI } from '../services/api'

const Permits = () => {
  const [permits, setPermits] = useState<any[]>([])
  const [filter, setFilter] = useState<{ type?: string; status?: string }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPermits()
  }, [filter])

  const loadPermits = async () => {
    try {
      const res = await permitsAPI.getPermits(filter.type, filter.status)
      setPermits(res.data)
    } catch (error) {
      console.error('Error loading permits:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading permits...</div>

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      draft: 'bg-gray-500/20 text-gray-300',
      active: 'bg-industrial-green/20 text-industrial-green',
      expired: 'bg-industrial-red/20 text-industrial-red',
      revoked: 'bg-industrial-red/20 text-industrial-red',
    }
    return colors[status] || colors.draft
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Permit Management</h1>

      {/* Filters */}
      <div className="card-glass p-4 rounded-lg flex gap-4 flex-wrap">
        <div>
          <label className="text-sm text-gray-400">Type</label>
          <select
            value={filter.type || ''}
            onChange={(e) => setFilter({ ...filter, type: e.target.value || undefined })}
            className="ml-2 px-3 py-2 bg-dark-bg border border-dark-border rounded-lg"
          >
            <option value="">All</option>
            <option value="hot_work">Hot Work</option>
            <option value="electrical">Electrical</option>
            <option value="confined_space">Confined Space</option>
            <option value="height_work">Height Work</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-400">Status</label>
          <select
            value={filter.status || ''}
            onChange={(e) => setFilter({ ...filter, status: e.target.value || undefined })}
            className="ml-2 px-3 py-2 bg-dark-bg border border-dark-border rounded-lg"
          >
            <option value="">All</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>
      </div>

      {/* Permits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {permits.map((permit) => (
          <div key={permit.id} className="card-glass p-6 rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg capitalize">{permit.permit_type.replace('_', ' ')}</h3>
                <p className="text-sm text-gray-400">Zone {permit.zone}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(permit.status)}`}>
                {permit.status}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-400">Worker</p>
                <p className="font-semibold">{permit.worker_name}</p>
              </div>
              <div>
                <p className="text-gray-400">Issued By</p>
                <p className="font-semibold">{permit.issued_by}</p>
              </div>
              <div>
                <p className="text-gray-400">Issued</p>
                <p className="font-semibold text-xs">{new Date(permit.issued_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Expires</p>
                <p className="font-semibold text-xs">{new Date(permit.expires_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="flex-1 px-3 py-2 bg-industrial-blue/20 text-industrial-blue rounded-lg hover:bg-industrial-blue/30 text-sm font-semibold transition-colors">
                Edit
              </button>
              <button className="flex-1 px-3 py-2 bg-industrial-red/20 text-industrial-red rounded-lg hover:bg-industrial-red/30 text-sm font-semibold transition-colors">
                Revoke
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Permits
