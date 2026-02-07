/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useMemo } from 'react'
import { useDataStore } from '../store/dataStore'
import { useAuthStore } from '../store/authStore'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Clock, Calendar, Zap, Play } from 'lucide-react'
import { format, startOfWeek, endOfWeek, isSameDay, parseISO } from 'date-fns'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { sessions, subjects, fetchSessions, fetchSubjects } = useDataStore()
  const [stats, setStats] = useState({ today: 0, week: 0, streak: 0 })

  useEffect(() => {
    if (user) {
      fetchSessions()
      fetchSubjects()
    }
  }, [user])

  useEffect(() => {
    if (sessions.length >= 0) {
      const today = new Date()
      const todaySessions = sessions.filter(s => isSameDay(parseISO(s.start_time), today))
      const todayMinutes = todaySessions.reduce((acc, s) => acc + (s.duration || 0) / 60, 0)

      const start = startOfWeek(today)
      const end = endOfWeek(today)
      const weekSessions = sessions.filter(s => {
        const d = parseISO(s.start_time)
        return d >= start && d <= end
      })
      const weekMinutes = weekSessions.reduce((acc, s) => acc + (s.duration || 0) / 60, 0)

      setStats({
        today: Math.round(todayMinutes),
        week: Math.round(weekMinutes),
        streak: 3 // Mock streak
      })
    }
  }, [sessions])

  const chartData = useMemo(() => [
    { name: 'Mon', minutes: 120 },
    { name: 'Tue', minutes: 90 },
    { name: 'Wed', minutes: stats.today },
    { name: 'Thu', minutes: 0 },
    { name: 'Fri', minutes: 0 },
    { name: 'Sat', minutes: 0 },
    { name: 'Sun', minutes: 0 },
  ], [stats.today])

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-400">Welcome back, {user?.user_metadata?.full_name || 'Student'}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(), 'EEEE, MMMM do')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-purple-500/30 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-slate-400 font-medium">Today's Focus</h3>
          </div>
          <p className="text-4xl font-bold text-white mt-2">{stats.today}<span className="text-lg text-slate-500 font-normal ml-1">min</span></p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-xl">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-slate-400 font-medium">Weekly Total</h3>
          </div>
          <p className="text-4xl font-bold text-white mt-2">{Math.round(stats.week / 60)}<span className="text-lg text-slate-500 font-normal ml-1">hrs</span></p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-orange-500/30 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-orange-500/20 text-orange-400 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-slate-400 font-medium">Streak</h3>
          </div>
          <p className="text-4xl font-bold text-white mt-2">{stats.streak}<span className="text-lg text-slate-500 font-normal ml-1">days</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-6">Activity Overview</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}m`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  cursor={{ fill: '#334155', opacity: 0.4 }}
                />
                <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={index === 2 ? '#8b5cf6' : '#334155'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl flex flex-col">
          <h3 className="text-xl font-bold text-white mb-4">Quick Start</h3>
          
          <div className="space-y-3 flex-1">
            {subjects.slice(0, 3).map(subject => (
               <Link to="/timer" key={subject.id} className="block group">
                 <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 border border-transparent hover:border-slate-700 transition-all">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: subject.color }}>
                       {subject.name.charAt(0)}
                     </div>
                     <span className="text-slate-300 group-hover:text-white font-medium">{subject.name}</span>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                     <Play className="w-4 h-4 fill-current" />
                   </div>
                 </div>
               </Link>
            ))}
            
            {subjects.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No subjects yet.
                <Link to="/subjects" className="text-cyan-400 hover:underline ml-1">Add one</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
