import { useState } from 'react'
import { complianceAPI } from '../services/api'
import { BookOpen, Search, Upload } from 'lucide-react'

const Compliance = () => {
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [documents, setDocuments] = useState<any[]>([])

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const res = await complianceAPI.query(query)
      setAnswer(res.data)
    } catch (error) {
      console.error('Error querying compliance:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      await complianceAPI.uploadDocument(file)
      alert('Document uploaded successfully')
    } catch (error) {
      console.error('Error uploading document:', error)
      alert('Error uploading document')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Compliance Assistant</h1>

      {/* RAG Query */}
      <div className="card-glass p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <BookOpen className="mr-2" /> Safety Regulations AI Assistant
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Ask questions about safety regulations and compliance requirements.
        </p>

        <form onSubmit={handleQuery} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about fire safety, PPE, confined spaces, electrical safety..."
              className="flex-1 px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-industrial-blue"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-industrial-blue hover:bg-industrial-blue/80 disabled:opacity-50 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <Search size={18} /> Search
            </button>
          </div>
        </form>

        {/* Answer */}
        {answer && (
          <div className="mt-6 p-4 bg-dark-bg/50 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">Question:</p>
            <p className="font-semibold mb-4">{answer.question}</p>
            <p className="text-gray-400 text-sm mb-2">Answer:</p>
            <p className="mb-4 whitespace-pre-wrap">{answer.answer}</p>
            {answer.source && (
              <div className="text-xs text-gray-500">
                <p>Source: {answer.source}</p>
                <p>Confidence: {(answer.confidence * 100).toFixed(0)}%</p>
              </div>
            )}
            {!answer.source && (
              <p className="text-xs text-industrial-orange">⚠️ No specific source found - consult Safety Officer</p>
            )}
          </div>
        )}
      </div>

      {/* Document Upload */}
      <div className="card-glass p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Upload className="mr-2" /> Upload Documents
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Upload PDF documents to expand the knowledge base.
        </p>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="px-4 py-3 bg-dark-bg border border-dark-border rounded-lg w-full"
        />
      </div>

      {/* Available Documents */}
      <div className="card-glass p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Available Documents</h2>
        <div className="space-y-3">
          {[
            { name: 'Fire Safety Procedures', type: 'regulation' },
            { name: 'PPE Requirements', type: 'standard' },
            { name: 'Confined Space Entry', type: 'guideline' },
            { name: 'Electrical Safety', type: 'standard' },
            { name: 'First Aid Response', type: 'guideline' },
            { name: 'Incident Reporting', type: 'regulation' },
          ].map((doc, idx) => (
            <div key={idx} className="p-4 bg-dark-bg/50 rounded-lg flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <BookOpen size={20} className="text-industrial-blue mt-1" />
                <div>
                  <p className="font-semibold">{doc.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{doc.type}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-industrial-blue/20 text-industrial-blue rounded text-xs font-semibold">
                Active
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Compliance
