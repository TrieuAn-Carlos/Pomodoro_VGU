import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Clock, Target } from 'lucide-react'
import { useDataStore } from '../store/dataStore'
import { useAuthStore } from '../store/authStore'
import SubjectModal from '../components/SubjectModal'

export default function Subjects() {
  const { subjects, loading, fetchSubjects, deleteSubject } = useDataStore()
  const { user } = useAuthStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)

  useEffect(() => {
    if (user) fetchSubjects()
  }, [user])

  const handleEdit = (subject) => {
    setEditingSubject(subject)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject? Sessions associated with it will not be deleted but will lose the subject reference.')) {
      await deleteSubject(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white tracking-tight">Your Subjects</h1>
        <button
          onClick={() => { setEditingSubject(null); setIsModalOpen(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-cyan-500/20 transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>New Subject</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 hover:border-slate-700/50 transition-all group relative overflow-hidden"
            >
              <div 
                className="absolute top-0 left-0 w-1 h-full"
                style={{ backgroundColor: subject.color }} 
              />
              
              <div className="flex justify-between items-start mb-4 pl-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                    style={{ backgroundColor: subject.color }}
                  >
                    {subject.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{subject.name}</h3>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Subject</span>
                  </div>
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(subject)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(subject.id)} className="p-2 hover:bg-red-900/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pl-3 space-y-3">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-slate-500" />
                    <span>Weekly Goal</span>
                  </div>
                  <span className="text-white font-medium">{Math.round(subject.weekly_goal / 60)}h</span>
                </div>
                
                {/* Progress bar placeholder - connect to real data later */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-slate-700 w-0" /> 
                </div>
              </div>
            </div>
          ))}

          {subjects.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-500 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
              <p>No subjects yet. Add one to get started!</p>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <SubjectModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          subjectToEdit={editingSubject}
        />
      )}
    </div>
  )
}
