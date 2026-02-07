import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useDataStore = create((set) => ({
  subjects: [],
  sessions: [],
  goals: [],
  loading: false,
  error: null,

  fetchSubjects: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('order', { ascending: true })
    
    if (error) {
      set({ error: error.message, loading: false })
      return
    }
    set({ subjects: data, loading: false })
  },

  createSubject: async (subjectData) => {
    const { data, error } = await supabase
      .from('subjects')
      .insert([subjectData])
      .select()
      .single()
    
    if (error) throw error
    set((state) => ({ subjects: [...state.subjects, data] }))
    return data
  },

  updateSubject: async (id, updates) => {
    const { data, error } = await supabase
      .from('subjects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    set((state) => ({
      subjects: state.subjects.map((s) => (s.id === id ? data : s)),
    }))
    return data
  },

  deleteSubject: async (id) => {
    const { error } = await supabase.from('subjects').delete().eq('id', id)
    if (error) throw error
    set((state) => ({
      subjects: state.subjects.filter((s) => s.id !== id),
    }))
  },

  fetchSessions: async () => {
    // Only fetch recent sessions initially or add pagination
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('start_time', { ascending: false })
      .limit(100)
    
    if (error) throw error
    set({ sessions: data })
  },

  addSession: async (sessionData) => {
    const { data, error } = await supabase
      .from('sessions')
      .insert([sessionData])
      .select()
      .single()
    
    if (error) throw error
    set((state) => ({ sessions: [data, ...state.sessions] }))
    return data
  },

  updateSession: async (id, updates) => {
    const { data, error } = await supabase
      .from('sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === id ? data : s)),
    }))
    return data
  },
}))
