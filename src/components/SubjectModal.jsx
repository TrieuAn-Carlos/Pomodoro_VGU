/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useDataStore } from '../store/dataStore'

export default function SubjectModal({ isOpen, onClose, subjectToEdit = null }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#6366f1') // Default indigo-500
  const [goal, setGoal] = useState(0)
  const { user } = useAuthStore()
  const { createSubject, updateSubject } = useDataStore()

  useEffect(() => {
    if (subjectToEdit) {
      setName(subjectToEdit.name)
      setColor(subjectToEdit.color)
      setGoal(subjectToEdit.weekly_goal || 0)
    } else {
      setName('')
      setColor('#6366f1')
      setGoal(0)
    }
  }, [subjectToEdit, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return

    try {
      if (subjectToEdit) {
        await updateSubject(subjectToEdit.id, { name, color, weekly_goal: parseInt(goal) })
      } else {
        await createSubject({ 
          user_id: user.id, 
          name, 
          color, 
          weekly_goal: parseInt(goal),
          created_at: new Date()
        })
      }
      onClose()
    } catch (error) {
      console.error('Error saving subject:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-800/50">
          <h2 className="text-xl font-bold text-white">{subjectToEdit ? 'Edit Subject' : 'New Subject'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Subject Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-slate-500"
              placeholder="e.g. Linear Algebra"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded-lg border-0 p-0 cursor-pointer bg-transparent"
              />
              <span className="text-slate-400 text-sm">{color}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Weekly Goal (minutes)</label>
            <input
              type="number"
              min="0"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-slate-500"
              placeholder="e.g. 300 (5 hours)"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-purple-500/20"
            >
              {subjectToEdit ? 'Save Changes' : 'Create Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
