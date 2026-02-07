import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, subDays, addDays, isSameDay, parseISO } from 'date-fns'

export const useDataStore = create((set, get) => ({
  subjects: [],
  recentSessions: [], // Renamed from 'sessions' to be explicit
  stats: {
    today: 0,
    week: 0,
    streak: 0,
    dailyActivity: [] // For the chart
  },
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

  fetchRecentSessions: async (limit = 20) => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('sessions')
      .select('*, subjects(name, color)') // Join with subjects to get details
      .order('start_time', { ascending: false })
      .limit(limit)
    
    if (error) {
        set({ error: error.message, loading: false })
        return
    }
    set({ recentSessions: data, loading: false })
  },

  fetchDashboardStats: async () => {
    // This function fetches data optimized for the dashboard
    // 1. Today's total duration
    // 2. This week's total duration
    // 3. Streak (Client-side calc from recent history for now, or optimized query)

    const today = new Date()
    const startOfTodayISO = startOfDay(today).toISOString()
    const endOfTodayISO = endOfDay(today).toISOString()
    const startOfWeekISO = startOfWeek(today, { weekStartsOn: 1 }).toISOString()
    const endOfWeekISO = endOfWeek(today, { weekStartsOn: 1 }).toISOString()

    // Fetch sessions for this week to calculate daily activity and weekly total
    const { data: weekData, error: weekError } = await supabase
      .from('sessions')
      .select('duration, start_time')
      .gte('start_time', startOfWeekISO)
      .lte('start_time', endOfWeekISO)

    if (weekError) {
        console.error('Error fetching week stats:', weekError)
        return
    }

    // Calculate today's minutes
    const todayMinutes = weekData
        .filter(s => s.start_time >= startOfTodayISO && s.start_time <= endOfTodayISO)
        .reduce((acc, s) => acc + (s.duration || 0) / 60, 0)

    // Calculate week's minutes
    const weekMinutes = weekData.reduce((acc, s) => acc + (s.duration || 0) / 60, 0)

    // Prepare chart data (Mon-Sun)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const chartData = days.map((day, index) => {
        // Find sessions for this day of the week
        // Note: startOfWeek returns Monday as index 0 if weekStartsOn: 1
        // We need to match the day index carefully.
        // Simpler: iterate 0-6, add days to startOfWeek
        const dayDate = addDays(parseISO(startOfWeekISO), index)


        const daySessions = weekData.filter(s => isSameDay(parseISO(s.start_time), dayDate))
        const minutes = daySessions.reduce((acc, s) => acc + (s.duration || 0) / 60, 0)

        return { name: day, minutes: Math.round(minutes) }
    })

    // Calculate Streak (Simple version: check last 30 days of distinct dates)
    // For a robust app, we'd store a 'daily_streak' in the profile table, but here we'll calc it.
    const { data: streakData } = await supabase
        .from('sessions')
        .select('start_time')
        .order('start_time', { ascending: false })
        .limit(50) // Check last 50 sessions

    let streak = 0
    if (streakData && streakData.length > 0) {
        const uniqueDays = new Set(streakData.map(s => startOfDay(parseISO(s.start_time)).toISOString()))
        // distinct days sorted desc
        const sortedDays = Array.from(uniqueDays).sort().reverse()

        // Check if today or yesterday has a session
        const todayStr = startOfDay(new Date()).toISOString()
        const yesterdayStr = startOfDay(subDays(new Date(), 1)).toISOString()

        if (sortedDays.includes(todayStr) || sortedDays.includes(yesterdayStr)) {
            streak = 1
            let currentCheck = sortedDays.includes(todayStr) ? todayStr : yesterdayStr

            // Iterate backwards
            for (let i = 1; i < sortedDays.length; i++) {
                const prevDate = startOfDay(subDays(parseISO(currentCheck), 1)).toISOString()
                if (sortedDays.includes(prevDate)) {
                    streak++
                    currentCheck = prevDate
                } else {
                    break
                }
            }
        }
    }

    set({
        stats: {
            today: Math.round(todayMinutes),
            week: Math.round(weekMinutes),
            streak,
            dailyActivity: chartData
        }
    })
  },

  addSession: async (sessionData) => {
    const { data, error } = await supabase
      .from('sessions')
      .insert([sessionData])
      .select()
      .single()
    
    if (error) throw error

    // Optimistically update recent sessions if it matches filter
    set((state) => ({
        recentSessions: [data, ...state.recentSessions].slice(0, 20)
    }))

    // Refresh stats to ensure accuracy
    get().fetchDashboardStats()

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
      recentSessions: state.recentSessions.map((s) => (s.id === id ? data : s)),
    }))

    // Refresh stats
    get().fetchDashboardStats()

    return data
  },
}))
