import { useEffect } from 'react'
import { useDataStore } from '../store/dataStore'
import { format, parseISO } from 'date-fns'
import { Clock } from 'lucide-react'

export default function Analytics() {
  const { sessions, fetchSessions, subjects, fetchSubjects } = useDataStore()

  useEffect(() => {
    fetchSessions()
    fetchSubjects()
  }, [])

  const getSubjectName = (id) => subjects.find(s => s.id === id)?.name || 'Unknown Subject'
  const getSubjectColor = (id) => subjects.find(s => s.id === id)?.color || '#64748b'

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white tracking-tight">Detailed Analytics</h1>
      
      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-white">Recent Sessions</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900/50 text-slate-400 text-sm font-medium">
              <tr>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: getSubjectColor(session.subject_id) }}
                      />
                      <span className="text-slate-200 font-medium">{getSubjectName(session.subject_id)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {format(parseISO(session.start_time), 'MMM d, yyyy • h:mm a')}
                  </td>
                  <td className="px-6 py-4 text-slate-300 font-mono">
                    {Math.round(session.duration / 60)} min
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      session.completed 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {session.completed ? 'Completed' : 'Incomplete'}
                    </span>
                  </td>
                </tr>
              ))}
              
              {sessions.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    No sessions recorded yet. Start studying!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
